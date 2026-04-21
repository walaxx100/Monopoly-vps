// Final 48-space board (13x13 grid: 13+11+13+11) - Clockwise order starting from GO
const BOARD = [
  // FILA INFERIOR (Derecha a Izquierda visualmente, pero ID 0-12)
  { id: 0, name: "GO", type: "go" },
  { id: 1, name: "Salvador", type: "property", price: 60, rent: [2,10,30,90,160,250], color: "brown", flag: "🇧🇷" },
  { id: 2, name: "Treasure", type: "treasure" },
  { id: 3, name: "Rio", type: "property", price: 60, rent: [4,20,60,180,320,450], color: "brown", flag: "🇧🇷" },
  { id: 4, name: "Earnings Tax", type: "tax", amount: 200, taxType: "percent10", label: "10%" },
  { id: 5, name: "Tel Aviv", type: "property", price: 100, rent: [6,30,90,270,400,550], color: "teal", flag: "🇮🇱" },
  { id: 6, name: "TLV Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 7, name: "Haifa", type: "property", price: 100, rent: [6,30,90,270,400,550], color: "teal", flag: "🇮🇱" },
  { id: 8, name: "Jerusalem", type: "property", price: 120, rent: [8,40,100,300,450,600], color: "teal", flag: "🇮🇱" },
  { id: 9, name: "Surprise", type: "surprise" },
  { id: 10, name: "Mumbai", type: "property", price: 140, rent: [10,50,150,450,625,750], color: "yellow", flag: "🇮🇳" },
  { id: 11, name: "New Delhi", type: "property", price: 160, rent: [12,60,180,500,700,900], color: "yellow", flag: "🇮🇳" },
  { id: 12, name: "In Prison", type: "jail" }, // ESQUINA 2

  // COLUMNA DERECHA (Subiendo ID 13-23)
  { id: 13, name: "Venice", type: "property", price: 180, rent: [14,70,200,550,750,950], color: "purple", flag: "🇮🇹" },
  { id: 14, name: "Bologna", type: "property", price: 180, rent: [14,70,200,550,750,950], color: "purple", flag: "🇮🇹" },
  { id: 15, name: "Electric Company", type: "utility", price: 150, flag: "⚡" },
  { id: 16, name: "Milan", type: "property", price: 200, rent: [16,80,220,600,800,1000], color: "purple", flag: "🇮🇹" },
  { id: 17, name: "Rome", type: "property", price: 200, rent: [16,80,220,600,800,1000], color: "purple", flag: "🇮🇹" },
  { id: 18, name: "MUC Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 19, name: "Frankfurt", type: "property", price: 220, rent: [18,90,250,700,875,1050], color: "orange", flag: "🇩🇪" },
  { id: 20, name: "Treasure", type: "treasure" },
  { id: 21, name: "Munich", type: "property", price: 220, rent: [18,90,250,700,875,1050], color: "orange", flag: "🇩🇪" },
  { id: 22, name: "Gas Company", type: "utility", price: 150, flag: "⛽" },
  { id: 23, name: "Berlin", type: "property", price: 240, rent: [20,100,300,750,925,1100], color: "orange", flag: "🇩🇪" },

  // FILA SUPERIOR (Derecha a Izquierda ID 24-36)
  { id: 24, name: "Vacation", type: "vacation" }, // ESQUINA 3
  { id: 25, name: "Shenzhen", type: "property", price: 260, rent: [22,110,330,800,975,1150], color: "red", flag: "🇨🇳" },
  { id: 26, name: "Surprise", type: "surprise" },
  { id: 27, name: "Beijing", type: "property", price: 260, rent: [22,110,330,800,975,1150], color: "red", flag: "🇨🇳" },
  { id: 28, name: "Treasure", type: "treasure" },
  { id: 29, name: "Shanghai", type: "property", price: 280, rent: [24,120,360,850,1025,1200], color: "red", flag: "🇨🇳" },
  { id: 30, name: "CDG Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 31, name: "Toulouse", type: "property", price: 300, rent: [26,130,390,900,1100,1275], color: "pink", flag: "🇫🇷" },
  { id: 32, name: "Paris", type: "property", price: 300, rent: [26,130,390,900,1100,1275], color: "pink", flag: "🇫🇷" },
  { id: 33, name: "Water Company", type: "utility", price: 150, flag: "💧" },
  { id: 34, name: "Yokohama", type: "property", price: 320, rent: [28,150,450,1000,1200,1400], color: "blue", flag: "🇯🇵" },
  { id: 35, name: "Tokyo", type: "property", price: 320, rent: [28,150,450,1000,1200,1400], color: "blue", flag: "🇯🇵" },
  { id: 36, name: "Go to Prison", type: "go_to_jail" }, // ESQUINA 4

  // COLUMNA IZQUIERDA (Bajando ID 37-47)
  
  { id: 37, name: "Liverpool", type: "property", price: 350, rent: [35,175,500,1100,1300,1500], color: "lightblue", flag: "🇬🇧" },
  { id: 38, name: "Manchester", type: "property", price: 350, rent: [35,175,500,1100,1300,1500], color: "lightblue", flag: "🇬🇧" },
  { id: 39, name: "Treasure", type: "treasure" },
  { id: 40, name: "Birmingham", type: "property", price: 380, rent: [40,200,550,1200,1450,1700], color: "lightblue", flag: "🇬🇧" },
  { id: 41, name: "London", type: "property", price: 380, rent: [40,200,550,1200,1450,1700], color: "lightblue", flag: "🇬🇧" },
  { id: 42, name: "JFK Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 43, name: "Los Angeles", type: "property", price: 400, rent: [50,200,600,1400,1700,2000], color: "green", flag: "🇺🇸" },
  { id: 44, name: "Surprise", type: "surprise" },
  { id: 45, name: "San Francisco", type: "property", price: 400, rent: [50,200,600,1400,1700,2000], color: "green", flag: "🇺🇸" },
  { id: 46, name: "Premium Tax", type: "tax", amount: 75, taxType: "fixed", label: "$75" },
  { id: 47, name: "New York", type: "property", price: 450, rent: [60,250,750,1600,1850,2200], color: "green", flag: "🇺🇸" },
];

const COLOR_GROUPS = {
  brown:     [1, 3],
  teal:      [5, 7, 8],
  yellow:    [10, 11],
  purple:    [13, 14, 16, 17],
  orange:    [19, 21, 23],
  red:       [26, 28, 30],
  pink:      [32, 33],
  blue:      [35, 37],
  lightblue: [38, 39, 41, 42],
  green:     [44, 46, 48],
};

const RAILROADS = [6, 18, 31, 43];
const UTILITIES = [15, 22, 34];

const TREASURE_CARDS = [
  { text: "Bank error in your favor. Collect $200.", action: "collect", amount: 200 },
  { text: "Doctor's fee. Pay $50.", action: "pay", amount: 50 },
  { text: "From sale of stock you get $45.", action: "collect", amount: 45 },
  { text: "Holiday fund matures. Receive $100.", action: "collect", amount: 100 },
  { text: "Income tax refund. Collect $20.", action: "collect", amount: 20 },
  { text: "Advance to GO. Collect $200.", action: "advance_go" },
  { text: "Bank pays you dividend of $50.", action: "collect", amount: 50 },
  { text: "Grand Opera Night. Collect $50 from every player.", action: "collect_all", amount: 50 },
  { text: "Pay hospital fees of $100.", action: "pay", amount: 100 },
  { text: "Pay school fees of $50.", action: "pay", amount: 50 },
  { text: "Receive $25 consultancy fee.", action: "collect", amount: 25 },
  { text: "You have won second prize in a beauty contest. Collect $10.", action: "collect", amount: 10 },
  { text: "You inherit $100.", action: "collect", amount: 100 },
  { text: "Get out of jail free.", action: "jail_free" },
  { text: "Life insurance matures. Collect $100.", action: "collect", amount: 100 },
  { text: "Pay fine of $15.", action: "pay", amount: 15 },
];

const SURPRISE_CARDS = [
  { text: "Advance to GO. Collect $200.", action: "advance_go" },
  { text: "Go to jail. Do not pass GO.", action: "go_to_jail" },
  { text: "Make general repairs. $40 per house, $115 per hotel.", action: "repairs", house: 40, hotel: 115 },
  { text: "Pay poor tax of $15.", action: "pay", amount: 15 },
  { text: "Take a trip! Advance to nearest airport.", action: "nearest_railroad" },
  { text: "Bank pays you $50.", action: "collect", amount: 50 },
  { text: "Get out of jail free.", action: "jail_free" },
  { text: "Go back 3 spaces.", action: "back", amount: 3 },
  { text: "Pay each player $50.", action: "pay_all", amount: 50 },
  { text: "Collect $150.", action: "collect", amount: 150 },
  { text: "Advance to Tokyo. If you pass GO, collect $200.", action: "advance_to", space: 38 },
  { text: "You have been elected chairman. Pay each player $50.", action: "pay_all", amount: 50 },
  { text: "Building loan matures. Collect $150.", action: "collect", amount: 150 },
  { text: "Speeding fine. Pay $15.", action: "pay", amount: 15 },
  { text: "Your investment pays off. Collect $100.", action: "collect", amount: 100 },
  { text: "Advance to New York. If you pass GO, collect $200.", action: "advance_to", space: 39 },
];

module.exports = { BOARD, COLOR_GROUPS, RAILROADS, UTILITIES, TREASURE_CARDS, SURPRISE_CARDS };
