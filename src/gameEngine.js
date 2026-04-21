const { BOARD, COLOR_GROUPS, RAILROADS, UTILITIES, TREASURE_CARDS, SURPRISE_CARDS } = require('./boardData');

class GameEngine {
  constructor(settings = {}) {
    this.settings = {
      doubleRentFullSet: settings.doubleRentFullSet ?? false,
      vacationCash: settings.vacationCash ?? false,
      auction: settings.auction ?? false,
      noRentInJail: settings.noRentInJail ?? false,
      mortgage: settings.mortgage ?? false,
      evenBuild: settings.evenBuild ?? true,
      startingCash: settings.startingCash ?? 1500,
      randomizeOrder: settings.randomizeOrder ?? true,
    };
    this.board = BOARD;
    this.players = [];
    this.properties = {}; // id -> { ownerId, houses, mortgaged }
    this.currentPlayerIndex = 0;
    this.phase = 'waiting'; // waiting, playing, ended
    this.treasureDeck = this._shuffle([...TREASURE_CARDS]);
    this.surpriseDeck = this._shuffle([...SURPRISE_CARDS]);
    this.log = [];
    this.vacationPool = 0;
    this.pendingAction = null; // { type, data }
    this.auctionState = null;
    this.dice = [0, 0];
    this.doublesCount = 0;
    this.winner = null;

    // init properties
    this.board.forEach(space => {
      if (['property', 'railroad', 'utility'].includes(space.type)) {
        this.properties[space.id] = { ownerId: null, houses: 0, mortgaged: false };
      }
    });
  }

  addPlayer(id, name, color) {
    if (this.players.length >= 6 || this.phase !== 'waiting') return false;
    this.players.push({
      id,
      name,
      color,
      cash: this.settings.startingCash,
      position: 0,
      inJail: false,
      jailTurns: 0,
      jailFreeCards: 0,
      bankrupt: false,
      mortgages: [],
    });
    return true;
  }

  startGame() {
    if (this.players.length < 2) return false;
    if (this.settings.randomizeOrder) {
      this.players = this._shuffle(this.players);
    }
    this.phase = 'playing';
    this.currentPlayerIndex = 0;
    this._addLog(`Game started! ${this.players[0].name} goes first.`);
    return true;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  rollDice(playerId) {
    if (this.phase !== 'playing') return { error: 'Game not started' };
    const player = this.getCurrentPlayer();
    if (player.id !== playerId) return { error: 'Not your turn' };
    if (this.pendingAction) return { error: 'Resolve pending action first' };

    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);
    this.dice = [d1, d2];
    const isDoubles = d1 === d2;

    if (player.inJail) {
      return this._handleJailRoll(player, d1, d2, isDoubles);
    }

    if (isDoubles) {
      this.doublesCount++;
      if (this.doublesCount >= 3) {
        this._addLog(`${player.name} rolled doubles 3 times! Go to jail!`);
        this._sendToJail(player);
        this.doublesCount = 0;
        this._endTurn();
        return this._stateUpdate();
      }
    } else {
      this.doublesCount = 0;
    }

    const steps = d1 + d2;
    this._addLog(`${player.name} rolled ${d1}+${d2}=${steps}${isDoubles ? ' (doubles!)' : ''}`);
    this._movePlayer(player, steps);

    if (!this.pendingAction && !isDoubles) {
      this._endTurn();
    } else if (!this.pendingAction && isDoubles) {
      this._addLog(`${player.name} rolled doubles! Roll again.`);
    }

    return this._stateUpdate();
  }

  _handleJailRoll(player, d1, d2, isDoubles) {
    if (isDoubles) {
      player.inJail = false;
      player.jailTurns = 0;
      this.doublesCount = 0;
      const steps = d1 + d2;
      this._addLog(`${player.name} rolled doubles ${d1}+${d2} and is FREE from jail!`);
      this._movePlayer(player, steps);
      if (!this.pendingAction) this._endTurn();
    } else {
      player.jailTurns++;
      this._addLog(`${player.name} rolled ${d1}+${d2} in jail (turn ${player.jailTurns}/3)`);
      if (player.jailTurns >= 3) {
        this._addLog(`${player.name} must pay $50 to leave jail!`);
        player.inJail = false;
        player.jailTurns = 0;
        this._charge(player, 50);
        const steps = d1 + d2;
        this._movePlayer(player, steps);
        if (!this.pendingAction) this._endTurn();
      } else {
        this._endTurn();
      }
    }
    return this._stateUpdate();
  }

  payJailFine(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || !player.inJail) return { error: 'Not in jail' };
    if (player.id !== this.getCurrentPlayer().id) return { error: 'Not your turn' };
    if (player.cash < 50) return { error: 'Not enough cash' };
    player.cash -= 50;
    player.inJail = false;
    player.jailTurns = 0;
    this._addLog(`${player.name} paid $50 to leave jail.`);
    return this._stateUpdate();
  }

  useJailCard(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || !player.inJail || player.jailFreeCards < 1) return { error: 'Cannot use card' };
    player.jailFreeCards--;
    player.inJail = false;
    player.jailTurns = 0;
    this._addLog(`${player.name} used a Get Out of Jail Free card!`);
    return this._stateUpdate();
  }

  buyProperty(playerId) {
    if (!this.pendingAction || this.pendingAction.type !== 'buy_property') return { error: 'No property to buy' };
    const player = this.players.find(p => p.id === playerId);
    if (!player || player.id !== this.getCurrentPlayer().id) return { error: 'Not your turn' };

    const spaceId = this.pendingAction.spaceId;
    const space = this.board[spaceId];
    if (player.cash < space.price) return { error: 'Not enough cash' };

    player.cash -= space.price;
    this.properties[spaceId].ownerId = player.id;
    this._addLog(`${player.name} bought ${space.name} for $${space.price}!`);

    this.pendingAction = null;
    if (!this.pendingAction) {
      if (this.doublesCount > 0) {
        this._addLog(`${player.name} rolled doubles! Roll again.`);
      } else {
        this._endTurn();
      }
    }
    return this._stateUpdate();
  }

  declineProperty(playerId) {
    if (!this.pendingAction || this.pendingAction.type !== 'buy_property') return { error: 'No property to decline' };
    const player = this.players.find(p => p.id === playerId);
    if (!player || player.id !== this.getCurrentPlayer().id) return { error: 'Not your turn' };

    const spaceId = this.pendingAction.spaceId;
    const space = this.board[spaceId];

    if (this.settings.auction) {
      this._startAuction(spaceId);
    } else {
      this._addLog(`${player.name} declined to buy ${space.name}.`);
      this.pendingAction = null;
      if (this.doublesCount > 0) {
        this._addLog(`${player.name} rolled doubles! Roll again.`);
      } else {
        this._endTurn();
      }
    }
    return this._stateUpdate();
  }

  bidAuction(playerId, amount) {
    if (!this.auctionState) return { error: 'No auction' };
    const player = this.players.find(p => p.id === playerId);
    if (!player || amount <= this.auctionState.highestBid) return { error: 'Bid too low' };
    if (player.cash < amount) return { error: 'Not enough cash' };

    this.auctionState.highestBid = amount;
    this.auctionState.highestBidder = playerId;
    this._addLog(`${player.name} bids $${amount} on ${this.board[this.auctionState.spaceId].name}`);
    return this._stateUpdate();
  }

  endAuction() {
    if (!this.auctionState) return { error: 'No auction' };
    const { spaceId, highestBidder, highestBid } = this.auctionState;
    if (highestBidder) {
      const player = this.players.find(p => p.id === highestBidder);
      player.cash -= highestBid;
      this.properties[spaceId].ownerId = highestBidder;
      this._addLog(`${player.name} won auction for ${this.board[spaceId].name} at $${highestBid}!`);
    } else {
      this._addLog(`No bids. ${this.board[spaceId].name} remains unowned.`);
    }
    this.auctionState = null;
    this.pendingAction = null;
    this._endTurn();
    return this._stateUpdate();
  }

  buildHouse(playerId, spaceId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return { error: 'Player not found' };
    const prop = this.properties[spaceId];
    if (!prop || prop.ownerId !== playerId) return { error: 'Not your property' };
    const space = this.board[spaceId];
    if (space.type !== 'property') return { error: 'Cannot build here' };
    if (prop.houses >= 5) return { error: 'Already has hotel' };
    if (prop.mortgaged) return { error: 'Property is mortgaged' };

    // Check owns full set
    const group = COLOR_GROUPS[space.color];
    if (!group) return { error: 'Invalid color group' };
    const ownsAll = group.every(id => this.properties[id]?.ownerId === playerId);
    if (!ownsAll) return { error: 'Must own full color set' };

    // Even build check
    if (this.settings.evenBuild) {
      const minHouses = Math.min(...group.map(id => this.properties[id]?.houses ?? 0));
      if (prop.houses > minHouses) return { error: 'Must build evenly (even build rule)' };
    }

    const houseCost = this._getHouseCost(space.color);
    if (player.cash < houseCost) return { error: 'Not enough cash' };

    player.cash -= houseCost;
    prop.houses++;
    const label = prop.houses === 5 ? 'hotel' : `${prop.houses} house(s)`;
    this._addLog(`${player.name} built on ${space.name} (now ${label})`);
    return this._stateUpdate();
  }

  sellHouse(playerId, spaceId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return { error: 'Player not found' };
    const prop = this.properties[spaceId];
    if (!prop || prop.ownerId !== playerId || prop.houses === 0) return { error: 'Cannot sell' };

    const space = this.board[spaceId];
    if (this.settings.evenBuild) {
      const group = COLOR_GROUPS[space.color] || [];
      const maxHouses = Math.max(...group.map(id => this.properties[id]?.houses ?? 0));
      if (prop.houses < maxHouses) return { error: 'Must sell evenly (even build rule)' };
    }

    const houseCost = this._getHouseCost(space.color);
    player.cash += Math.floor(houseCost / 2);
    prop.houses--;
    this._addLog(`${player.name} sold a house on ${space.name}`);
    return this._stateUpdate();
  }

  mortgageProperty(playerId, spaceId) {
    if (!this.settings.mortgage) return { error: 'Mortgage not enabled' };
    const player = this.players.find(p => p.id === playerId);
    if (!player) return { error: 'Player not found' };
    const prop = this.properties[spaceId];
    if (!prop || prop.ownerId !== playerId || prop.mortgaged) return { error: 'Cannot mortgage' };
    if (prop.houses > 0) return { error: 'Must sell houses first' };

    const space = this.board[spaceId];
    const mortgageValue = Math.floor(space.price / 2);
    player.cash += mortgageValue;
    prop.mortgaged = true;
    this._addLog(`${player.name} mortgaged ${space.name} for $${mortgageValue}`);
    return this._stateUpdate();
  }

  unmortgageProperty(playerId, spaceId) {
    if (!this.settings.mortgage) return { error: 'Mortgage not enabled' };
    const player = this.players.find(p => p.id === playerId);
    if (!player) return { error: 'Player not found' };
    const prop = this.properties[spaceId];
    if (!prop || prop.ownerId !== playerId || !prop.mortgaged) return { error: 'Cannot unmortgage' };

    const space = this.board[spaceId];
    const unmortgageCost = Math.floor(space.price / 2 * 1.1);
    if (player.cash < unmortgageCost) return { error: 'Not enough cash' };

    player.cash -= unmortgageCost;
    prop.mortgaged = false;
    this._addLog(`${player.name} unmortgaged ${space.name} for $${unmortgageCost}`);
    return this._stateUpdate();
  }

  // ─── TRADES ────────────────────────────────────────────────────────────────

  proposeTrade(fromId, toId, offer) {
    // offer = { fromCash, toCash, fromProps: [spaceId,...], toProps: [spaceId,...] }
    const from = this.players.find(p => p.id === fromId);
    const to = this.players.find(p => p.id === toId);
    if (!from || !to || from.bankrupt || to.bankrupt) return { error: 'Invalid players' };
    if (fromId === toId) return { error: 'Cannot trade with yourself' };

    // Validate ownership
    for (const sid of (offer.fromProps || [])) {
      if (this.properties[sid]?.ownerId !== fromId) return { error: `You don't own that property` };
    }
    for (const sid of (offer.toProps || [])) {
      if (this.properties[sid]?.ownerId !== toId) return { error: `Target doesn't own that property` };
    }
    if ((offer.fromCash || 0) > from.cash) return { error: 'Not enough cash to offer' };

    const tradeId = Math.random().toString(36).slice(2, 8).toUpperCase();
    if (!this.pendingTrades) this.pendingTrades = {};
    this.pendingTrades[tradeId] = {
      tradeId, fromId, toId,
      fromCash: offer.fromCash || 0,
      toCash: offer.toCash || 0,
      fromProps: offer.fromProps || [],
      toProps: offer.toProps || [],
      status: 'pending',
    };
    this._addLog(`💱 ${from.name} proposed a trade to ${to.name}`);
    return { tradeId, ...this.getState() };
  }

  respondTrade(playerId, tradeId, accept) {
    if (!this.pendingTrades?.[tradeId]) return { error: 'Trade not found' };
    const trade = this.pendingTrades[tradeId];
    if (trade.toId !== playerId) return { error: 'Not your trade to respond to' };
    if (trade.status !== 'pending') return { error: 'Trade already resolved' };

    const from = this.players.find(p => p.id === trade.fromId);
    const to = this.players.find(p => p.id === trade.toId);

    if (!accept) {
      trade.status = 'declined';
      this._addLog(`❌ ${to.name} declined the trade from ${from.name}`);
      delete this.pendingTrades[tradeId];
      return this.getState();
    }

    // Validate again at execution time
    if (trade.fromCash > from.cash) {
      trade.status = 'failed';
      delete this.pendingTrades[tradeId];
      this._addLog(`⚠️ Trade failed: ${from.name} doesn't have enough cash`);
      return this.getState();
    }
    if (trade.toCash > to.cash) {
      trade.status = 'failed';
      delete this.pendingTrades[tradeId];
      this._addLog(`⚠️ Trade failed: ${to.name} doesn't have enough cash`);
      return this.getState();
    }

    // Execute trade
    from.cash -= trade.fromCash;
    from.cash += trade.toCash;
    to.cash -= trade.toCash;
    to.cash += trade.fromCash;

    trade.fromProps.forEach(sid => { this.properties[sid].ownerId = trade.toId; });
    trade.toProps.forEach(sid => { this.properties[sid].ownerId = trade.fromId; });

    trade.status = 'accepted';
    this._addLog(`✅ Trade completed: ${from.name} ↔ ${to.name}`);
    delete this.pendingTrades[tradeId];
    return this.getState();
  }

  cancelTrade(playerId, tradeId) {
    if (!this.pendingTrades?.[tradeId]) return { error: 'Trade not found' };
    const trade = this.pendingTrades[tradeId];
    if (trade.fromId !== playerId) return { error: 'Not your trade' };
    const from = this.players.find(p => p.id === trade.fromId);
    this._addLog(`🚫 ${from.name} cancelled their trade offer`);
    delete this.pendingTrades[tradeId];
    return this.getState();
  }

  declareBankruptcy(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return { error: 'Player not found' };
    player.bankrupt = true;

    // Return all properties
    Object.keys(this.properties).forEach(id => {
      if (this.properties[id].ownerId === playerId) {
        this.properties[id] = { ownerId: null, houses: 0, mortgaged: false };
      }
    });

    this._addLog(`${player.name} has gone BANKRUPT!`);

    const active = this.players.filter(p => !p.bankrupt);
    if (active.length === 1) {
      this.winner = active[0];
      this.phase = 'ended';
      this._addLog(`🏆 ${active[0].name} wins the game!`);
    } else if (player.id === this.getCurrentPlayer().id) {
      this._endTurn();
    }
    return this._stateUpdate();
  }

  _movePlayer(player, steps) {
    const oldPos = player.position;
    player.position = (player.position + steps) % this.board.length;

    // Pass GO
    if (player.position < oldPos && player.position !== 0) {
      player.cash += 200;
      this._addLog(`${player.name} passed GO! Collect $200.`);
    }

    this._landOn(player);
  }

  _landOn(player) {
    const space = this.board[player.position];
    this._addLog(`${player.name} landed on ${space.name}`);

    switch (space.type) {
      case 'go':
        player.cash += 200;
        this._addLog(`${player.name} landed on GO! Collect $200.`);
        break;

      case 'property':
      case 'railroad':
      case 'utility': {
        const prop = this.properties[space.id];
        if (!prop) break;
        if (!prop.ownerId) {
          this.pendingAction = { type: 'buy_property', spaceId: space.id };
        } else if (prop.ownerId !== player.id && !prop.mortgaged) {
          // Check if owner is in jail and noRentInJail is on
          const owner = this.players.find(p => p.id === prop.ownerId);
          if (this.settings.noRentInJail && owner?.inJail) {
            this._addLog(`${owner.name} is in jail - no rent collected.`);
            break;
          }
          const rent = this._calculateRent(space, prop);
          this._addLog(`${player.name} owes $${rent} rent to ${owner?.name}`);
          this._transferMoney(player, owner, rent);
        }
        break;
      }

      case 'tax': {
        let amount;
        if (space.taxType === 'percent10') {
          amount = Math.floor(player.cash * 0.1);
          this._addLog(`${player.name} pays 10% income tax: $${amount}`);
        } else {
          amount = space.amount;
          this._addLog(`${player.name} pays $${amount} tax`);
        }
        this._charge(player, amount);
        break;
      }

      case 'treasure': {
        const card = this._drawTreasure();
        this._addLog(`Treasure: "${card.text}"`);
        this._applyCard(player, card);
        break;
      }

      case 'surprise': {
        const card = this._drawSurprise();
        this._addLog(`Surprise: "${card.text}"`);
        this._applyCard(player, card);
        break;
      }

      case 'go_to_jail':
        this._sendToJail(player);
        break;

      case 'vacation':
        if (this.settings.vacationCash && this.vacationPool > 0) {
          this._addLog(`${player.name} collects vacation pool: $${this.vacationPool}!`);
          player.cash += this.vacationPool;
          this.vacationPool = 0;
        } else {
          this._addLog(`${player.name} is on vacation!`);
        }
        break;

      case 'free_parking':
        this._addLog(`${player.name} is on Free Parking.`);
        break;

      case 'jail':
        this._addLog(`${player.name} is just visiting jail.`);
        break;
    }
  }

  _calculateRent(space, prop) {
    const ownerId = prop.ownerId;

    if (space.type === 'railroad') {
      const owned = RAILROADS.filter(id => this.properties[id]?.ownerId === ownerId).length;
      return [25, 50, 100, 200][owned - 1] || 25;
    }

    if (space.type === 'utility') {
      const owned = UTILITIES.filter(id => this.properties[id]?.ownerId === ownerId).length;
      const mult = owned === 2 ? 10 : 4;
      return (this.dice[0] + this.dice[1]) * mult;
    }

    // Property
    if (prop.houses === 0) {
      let rent = space.rent[0];
      // Double rent if owns full set
      if (this.settings.doubleRentFullSet && !prop.mortgaged) {
        const group = COLOR_GROUPS[space.color] || [];
        const ownsAll = group.every(id => this.properties[id]?.ownerId === ownerId);
        if (ownsAll) rent *= 2;
      } else {
        const group = COLOR_GROUPS[space.color] || [];
        const ownsAll = group.every(id => this.properties[id]?.ownerId === ownerId);
        if (ownsAll && prop.houses === 0) rent *= 2;
      }
      return rent;
    }

    return space.rent[prop.houses] || space.rent[space.rent.length - 1];
  }

  _applyCard(player, card) {
    switch (card.action) {
      case 'collect':
        player.cash += card.amount;
        break;
      case 'pay':
        this._charge(player, card.amount);
        break;
      case 'advance_go':
        if (player.position !== 0) {
          player.cash += 200;
          this._addLog(`${player.name} collects $200 passing GO`);
        }
        player.position = 0;
        break;
      case 'go_to_jail':
        this._sendToJail(player);
        break;
      case 'jail_free':
        player.jailFreeCards++;
        this._addLog(`${player.name} got a Get Out of Jail Free card!`);
        break;
      case 'advance_to': {
        const dest = card.space;
        if (dest > player.position) player.cash += 200;
        player.position = dest;
        this._landOn(player);
        break;
      }
      case 'nearest_railroad': {
        let nearest = RAILROADS[0];
        let minDist = Infinity;
        RAILROADS.forEach(id => {
          const dist = (id - player.position + this.board.length) % this.board.length;
          if (dist < minDist) { minDist = dist; nearest = id; }
        });
        if (nearest < player.position) player.cash += 200;
        player.position = nearest;
        this._landOn(player);
        break;
      }
      case 'back':
        player.position = (player.position - card.amount + this.board.length) % this.board.length;
        this._landOn(player);
        break;
      case 'collect_all':
        this.players.filter(p => p.id !== player.id && !p.bankrupt).forEach(p => {
          this._transferMoney(p, player, card.amount);
        });
        break;
      case 'pay_all':
        this.players.filter(p => p.id !== player.id && !p.bankrupt).forEach(p => {
          this._transferMoney(player, p, card.amount);
        });
        break;
      case 'repairs': {
        let total = 0;
        Object.keys(this.properties).forEach(id => {
          if (this.properties[id].ownerId === player.id) {
            const h = this.properties[id].houses;
            total += h === 5 ? card.hotel : h * card.house;
          }
        });
        this._charge(player, total);
        this._addLog(`${player.name} pays $${total} for repairs`);
        break;
      }
    }
  }

  _charge(player, amount) {
    player.cash -= amount;
    if (this.settings.vacationCash) {
      this.vacationPool += amount;
    }
    if (player.cash < 0) {
      this._addLog(`${player.name} is in debt! ($${player.cash})`);
    }
  }

  _transferMoney(from, to, amount) {
    from.cash -= amount;
    if (to) to.cash += amount;
    if (from.cash < 0) {
      this._addLog(`${from.name} is in debt! ($${from.cash})`);
    }
  }

  _sendToJail(player) {
    player.position = 13; // Jail space
    player.inJail = true;
    player.jailTurns = 0;
    this.doublesCount = 0;
    this._addLog(`${player.name} goes to JAIL!`);
  }

  _endTurn() {
    const activePlayers = this.players.filter(p => !p.bankrupt);
    let next = (this.currentPlayerIndex + 1) % this.players.length;
    while (this.players[next].bankrupt) {
      next = (next + 1) % this.players.length;
    }
    this.currentPlayerIndex = next;
    this.doublesCount = 0;
    this._addLog(`--- ${this.players[this.currentPlayerIndex].name}'s turn ---`);
  }

  _startAuction(spaceId) {
    this.auctionState = { spaceId, highestBid: 0, highestBidder: null };
    this.pendingAction = { type: 'auction', spaceId };
    this._addLog(`Auction started for ${this.board[spaceId].name}!`);
  }

  _drawTreasure() {
    if (this.treasureDeck.length === 0) this.treasureDeck = this._shuffle([...TREASURE_CARDS]);
    return this.treasureDeck.pop();
  }

  _drawSurprise() {
    if (this.surpriseDeck.length === 0) this.surpriseDeck = this._shuffle([...SURPRISE_CARDS]);
    return this.surpriseDeck.pop();
  }

  _getHouseCost(color) {
    const costs = { brown: 50, teal: 50, yellow: 100, purple: 100, orange: 100, red: 150, pink: 150, blue: 150, green: 200, darkgreen: 200, lightblue: 200 };
    return costs[color] || 100;
  }

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  _addLog(msg) {
    this.log.push({ time: Date.now(), msg });
    if (this.log.length > 100) this.log.shift();
  }

  _stateUpdate() {
    return this.getState();
  }

  getState() {
    return {
      phase: this.phase,
      players: this.players,
      properties: this.properties,
      currentPlayerIndex: this.currentPlayerIndex,
      pendingAction: this.pendingAction,
      auctionState: this.auctionState,
      log: this.log.slice(-20),
      dice: this.dice,
      doublesCount: this.doublesCount,
      vacationPool: this.vacationPool,
      winner: this.winner,
      settings: this.settings,
      board: this.board,
      pendingTrades: this.pendingTrades || {},
    };
  }
}

module.exports = GameEngine;
