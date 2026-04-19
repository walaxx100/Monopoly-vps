const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const GameEngine = require('./gameEngine');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Rooms: { roomId -> { game, clients: Map<ws, {playerId, playerName}> } }
const rooms = new Map();

function broadcast(room, data) {
  const msg = JSON.stringify(data);
  room.clients.forEach((info, ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  });
}

function sendToClient(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function getRoomList() {
  const list = [];
  rooms.forEach((room, id) => {
    list.push({
      id,
      playerCount: room.clients.size,
      phase: room.game.phase,
      players: room.game.players.map(p => p.name),
    });
  });
  return list;
}

function broadcastRoomList() {
  // Broadcast to clients in lobby (not in a room)
  const list = getRoomList();
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN && !ws.roomId) {
      sendToClient(ws, { type: 'room_list', rooms: list });
    }
  });
}

wss.on('connection', (ws) => {
  ws.id = uuidv4();
  ws.roomId = null;

  sendToClient(ws, { type: 'connected', clientId: ws.id, rooms: getRoomList() });

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    const { type, payload = {} } = msg;

    switch (type) {
      case 'get_rooms':
        sendToClient(ws, { type: 'room_list', rooms: getRoomList() });
        break;

      case 'create_room': {
        const roomId = uuidv4().slice(0, 6).toUpperCase();
        const settings = payload.settings || {};
        const game = new GameEngine(settings);
        const room = { game, clients: new Map() };
        rooms.set(roomId, room);

        const playerId = uuidv4();
        const color = payload.color || '#e74c3c';
        game.addPlayer(playerId, payload.name || 'Host', color);
        room.clients.set(ws, { playerId, playerName: payload.name });
        ws.roomId = roomId;

        sendToClient(ws, { type: 'joined_room', roomId, playerId, state: game.getState() });
        broadcastRoomList();
        break;
      }

      case 'join_room': {
        const { roomId, name, color } = payload;
        const room = rooms.get(roomId);
        if (!room) { sendToClient(ws, { type: 'error', msg: 'Room not found' }); break; }
        if (room.game.phase !== 'waiting') { sendToClient(ws, { type: 'error', msg: 'Game already started' }); break; }
        if (room.clients.size >= 6) { sendToClient(ws, { type: 'error', msg: 'Room is full' }); break; }

        const playerId = uuidv4();
        room.game.addPlayer(playerId, name || 'Player', color || '#3498db');
        room.clients.set(ws, { playerId, playerName: name });
        ws.roomId = roomId;

        sendToClient(ws, { type: 'joined_room', roomId, playerId, state: room.game.getState() });
        broadcast(room, { type: 'state_update', state: room.game.getState() });
        broadcastRoomList();
        break;
      }

      case 'start_game': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const result = room.game.startGame();
        if (!result) { sendToClient(ws, { type: 'error', msg: 'Need at least 2 players' }); break; }
        broadcast(room, { type: 'state_update', state: room.game.getState() });
        break;
      }

      case 'roll_dice': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const info = room.clients.get(ws);
        const state = room.game.rollDice(info.playerId);
        broadcast(room, { type: 'state_update', state });
        break;
      }

      case 'buy_property': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const info = room.clients.get(ws);
        const state = room.game.buyProperty(info.playerId);
        broadcast(room, { type: 'state_update', state });
        break;
      }

      case 'decline_property': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const info = room.clients.get(ws);
        const state = room.game.declineProperty(info.playerId);
        broadcast(room, { type: 'state_update', state });
        break;
      }

      case 'pay_jail': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const info = room.clients.get(ws);
        const state = room.game.payJailFine(info.playerId);
        broadcast(room, { type: 'state_update', state });
        break;
      }

      case 'use_jail_card': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const info = room.clients.get(ws);
        const state = room.game.useJailCard(info.playerId);
        broadcast(room, { type: 'state_update', state });
        break;
      }

      case 'build_house': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const info = room.clients.get(ws);
        const state = room.game.buildHouse(info.playerId, payload.spaceId);
        broadcast(room, { type: 'state_update', state });
        break;
      }

      case 'sell_house': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const info = room.clients.get(ws);
        const state = room.game.sellHouse(info.playerId, payload.spaceId);
        broadcast(room, { type: 'state_update', state });
        break;
      }

      case 'mortgage': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const info = room.clients.get(ws);
        const state = room.game.mortgageProperty(info.playerId, payload.spaceId);
        broadcast(room, { type: 'state_update', state });
        break;
      }

      case 'unmortgage': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const info = room.clients.get(ws);
        const state = room.game.unmortgageProperty(info.playerId, payload.spaceId);
        broadcast(room, { type: 'state_update', state });
        break;
      }

      case 'bid_auction': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const info = room.clients.get(ws);
        const state = room.game.bidAuction(info.playerId, payload.amount);
        broadcast(room, { type: 'state_update', state });
        break;
      }

      case 'end_auction': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const state = room.game.endAuction();
        broadcast(room, { type: 'state_update', state });
        break;
      }

      case 'declare_bankruptcy': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const info = room.clients.get(ws);
        const state = room.game.declareBankruptcy(info.playerId);
        broadcast(room, { type: 'state_update', state });
        break;
      }

      case 'propose_trade': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const info = room.clients.get(ws);
        const result = room.game.proposeTrade(info.playerId, payload.toId, payload.offer);
        if (result.error) { sendToClient(ws, { type: 'error', msg: result.error }); break; }
        // Notify the target player specifically + broadcast state
        broadcast(room, { type: 'state_update', state: result });
        // Also send a trade notification to the target
        room.clients.forEach((cinfo, cws) => {
          if (cinfo.playerId === payload.toId) {
            sendToClient(cws, { type: 'trade_incoming', tradeId: result.tradeId });
          }
        });
        break;
      }

      case 'respond_trade': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const info = room.clients.get(ws);
        const state = room.game.respondTrade(info.playerId, payload.tradeId, payload.accept);
        if (state.error) { sendToClient(ws, { type: 'error', msg: state.error }); break; }
        broadcast(room, { type: 'state_update', state });
        break;
      }

      case 'cancel_trade': {
        const room = rooms.get(ws.roomId);
        if (!room) break;
        const info = room.clients.get(ws);
        const state = room.game.cancelTrade(info.playerId, payload.tradeId);
        if (state.error) { sendToClient(ws, { type: 'error', msg: state.error }); break; }
        broadcast(room, { type: 'state_update', state });
        break;
      }
    }
  });

  ws.on('close', () => {
    if (ws.roomId) {
      const room = rooms.get(ws.roomId);
      if (room) {
        room.clients.delete(ws);
        if (room.clients.size === 0) {
          rooms.delete(ws.roomId);
        } else {
          broadcast(room, { type: 'state_update', state: room.game.getState() });
        }
      }
    }
    broadcastRoomList();
  });
});

const PORT = process.env.PORT || 3456;
server.listen(PORT, () => {
  console.log(`Mr. Worldwide Monopoly running on port ${PORT}`);
});
