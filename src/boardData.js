// Mr. Worldwide Board - All 40 spaces
const BOARD_SPACES = [
  // Bottom row (left to right): index 0-10
  { id: 0, name: "GO", type: "go", price: 0 },
  { id: 1, name: "Tokyo", type: "property", price: 280, rent: [24,120,200,500,700,900], color: "red", flag: "🇯🇵" },
  { id: 2, name: "Yokohama", type: "property", price: 280, rent: [22,110,190,480,680,870], color: "red", flag: "🇯🇵" },
  { id: 3, name: "Water Company", type: "utility", price: 150, flag: "💧" },
  { id: 4, name: "Paris", type: "property", price: 260, rent: [22,110,190,480,680,870], color: "blue", flag: "🇫🇷" },
  { id: 5, name: "Toulouse", type: "property", price: 260, rent: [22,110,190,480,680,870], color: "blue", flag: "🇫🇷" },
  { id: 6, name: "CDG Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 7, name: "Shanghai", type: "property", price: 240, rent: [20,100,170,450,650,800], color: "pink", flag: "🇨🇳" },
  { id: 8, name: "Treasure", type: "treasure", price: 0 },
  { id: 9, name: "Beijing", type: "property", price: 220, rent: [18,90,160,430,620,750], color: "pink", flag: "🇨🇳" },
  { id: 10, name: "Surprise", type: "surprise", price: 0 },
  { id: 11, name: "Shenzhen", type: "property", price: 220, rent: [18,90,160,430,620,750], color: "pink", flag: "🇨🇳" },
  // Right column (bottom to top): index 12-20
  { id: 12, name: "Vacation", type: "vacation", price: 0 },

  // Right side (bottom to top)
  { id: 13, name: "Berlin", type: "property", price: 200, rent: [16,80,140,400,580,700], color: "orange", flag: "🇩🇪" },
  { id: 14, name: "Gas Company", type: "utility", price: 150, flag: "⛽" },
  { id: 15, name: "Munich", type: "property", price: 180, rent: [14,70,130,380,550,650], color: "orange", flag: "🇩🇪" },
  { id: 16, name: "Treasure", type: "treasure", price: 0 },
  { id: 17, name: "Frankfurt", type: "property", price: 180, rent: [14,70,130,380,550,650], color: "orange", flag: "🇩🇪" },
  { id: 18, name: "MUC Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 19, name: "Rome", type: "property", price: 160, rent: [12,60,120,340,490,600], color: "purple", flag: "🇮🇹" },
  { id: 20, name: "Milan", type: "property", price: 160, rent: [12,60,120,340,490,600], color: "purple", flag: "🇮🇹" },

  // Top row (right to left): index 21-30
  { id: 21, name: "In Prison", type: "jail", price: 0 },
  { id: 22, name: "Electric Company", type: "utility", price: 150, flag: "⚡" },
  { id: 23, name: "Bologna", type: "property", price: 140, rent: [10,50,110,320,460,560], color: "purple", flag: "🇮🇹" },
  { id: 24, name: "Venice", type: "property", price: 140, rent: [10,50,110,320,460,560], color: "purple", flag: "🇮🇹" },
  { id: 25, name: "Passing by", type: "passing", price: 0 },
  { id: 26, name: "New Delhi", type: "property", price: 130, rent: [8,40,100,300,440,520], color: "yellow", flag: "🇮🇳" },
  { id: 27, name: "Mumbai", type: "property", price: 120, rent: [8,40,100,300,440,520], color: "yellow", flag: "🇮🇳" },
  { id: 28, name: "Surprise", type: "surprise", price: 0 },
  { id: 29, name: "Jerusalem", type: "property", price: 110, rent: [6,30,90,270,400,480], color: "teal", flag: "🇮🇱" },
  { id: 30, name: "Haifa", type: "property", price: 100, rent: [6,30,90,270,400,480], color: "teal", flag: "🇮🇱" },

  // Left column (top to bottom): index 31-39
  { id: 31, name: "Go to Prison", type: "go_to_jail", price: 0 },
  { id: 32, name: "TLV Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 33, name: "Tel Aviv", type: "property", price: 100, rent: [6,30,90,270,400,480], color: "teal", flag: "🇮🇱" },
  { id: 34, name: "Earnings Tax", type: "tax", price: 0, amount: 100, taxType: "percent10" },
  { id: 35, name: "Treasure", type: "treasure", price: 0 },
  { id: 36, name: "Rio", type: "property", price: 60, rent: [2,10,30,90,160,250], color: "brown", flag: "🇧🇷" },
  { id: 37, name: "Salvador", type: "property", price: 60, rent: [2,10,30,90,160,250], color: "brown", flag: "🇧🇷" },
  { id: 38, name: "New York", type: "property", price: 400, rent: [50,200,600,1400,1700,2000], color: "green", flag: "🇺🇸" },
  { id: 39, name: "Premium Tax", type: "tax", price: 0, amount: 75, taxType: "fixed" },
  { id: 40, name: "San Francisco", type: "property", price: 360, rent: [35,175,500,1100,1300,1500], color: "green", flag: "🇺🇸" },
  { id: 41, name: "Surprise", type: "surprise", price: 0 },
  { id: 42, name: "Los Angeles", type: "property", price: 350, rent: [35,175,500,1100,1300,1500], color: "green", flag: "🇺🇸" },
  { id: 43, name: "JFK Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 44, name: "London", type: "property", price: 320, rent: [28,150,450,1000,1200,1400], color: "lightblue", flag: "🇬🇧" },
  { id: 45, name: "Birmingham", type: "property", price: 320, rent: [28,150,450,1000,1200,1400], color: "lightblue", flag: "🇬🇧" },
  { id: 46, name: "Treasure", type: "treasure", price: 0 },
  { id: 47, name: "Manchester", type: "property", price: 300, rent: [26,130,390,900,1100,1275], color: "lightblue", flag: "🇬🇧" },
  { id: 48, name: "Liverpool", type: "property", price: 300, rent: [26,130,390,900,1100,1275], color: "lightblue", flag: "🇬🇧" },
];

// Rearrange to 40 spaces clockwise: bottom(0-10), right(11-20), top(21-30), left(31-40)
const SPACES = [
  // Bottom row left→right (0=GO, 10=Jail visiting)
  { id: 0, name: "GO", type: "go" },
  { id: 1, name: "Salvador", type: "property", price: 60, rent: [2,10,30,90,160,250], color: "brown", flag: "🇧🇷" },
  { id: 2, name: "Treasure", type: "treasure" },
  { id: 3, name: "Rio", type: "property", price: 60, rent: [2,10,30,90,160,250], color: "brown", flag: "🇧🇷" },
  { id: 4, name: "Earnings Tax", type: "tax", amount: 100, taxType: "percent10" },
  { id: 5, name: "Tel Aviv", type: "property", price: 100, rent: [6,30,90,270,400,480], color: "teal", flag: "🇮🇱" },
  { id: 6, name: "TLV Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 7, name: "Haifa", type: "property", price: 110, rent: [6,30,90,270,400,480], color: "teal", flag: "🇮🇱" },
  { id: 8, name: "Jerusalem", type: "property", price: 120, rent: [8,40,100,300,440,520], color: "teal", flag: "🇮🇱" },
  { id: 9, name: "Surprise", type: "surprise" },
  { id: 10, name: "Mumbai", type: "property", price: 130, rent: [8,40,100,300,440,520], color: "yellow", flag: "🇮🇳" },
  { id: 11, name: "New Delhi", type: "property", price: 140, rent: [10,50,110,320,460,560], color: "yellow", flag: "🇮🇳" },

  // Right column bottom→top (11-20)
  { id: 12, name: "Passing by", type: "passing" },
  { id: 13, name: "Venice", type: "property", price: 140, rent: [10,50,110,320,460,560], color: "purple", flag: "🇮🇹" },
  { id: 14, name: "Bologna", type: "property", price: 140, rent: [10,50,110,320,460,560], color: "purple", flag: "🇮🇹" },
  { id: 15, name: "Electric Company", type: "utility", price: 150, flag: "⚡" },
  { id: 16, name: "Milan", type: "property", price: 160, rent: [12,60,120,340,490,600], color: "purple", flag: "🇮🇹" },
  { id: 17, name: "Rome", type: "property", price: 160, rent: [12,60,120,340,490,600], color: "purple", flag: "🇮🇹" },
  { id: 18, name: "MUC Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 19, name: "Frankfurt", type: "property", price: 180, rent: [14,70,130,380,550,650], color: "orange", flag: "🇩🇪" },
  { id: 20, name: "Treasure", type: "treasure" },

  // Top row right→left (21-30)
  { id: 21, name: "In Prison", type: "jail" },
  { id: 22, name: "Munich", type: "property", price: 180, rent: [14,70,130,380,550,650], color: "orange", flag: "🇩🇪" },
  { id: 23, name: "Gas Company", type: "utility", price: 150, flag: "⛽" },
  { id: 24, name: "Berlin", type: "property", price: 200, rent: [16,80,140,400,580,700], color: "orange", flag: "🇩🇪" },
  { id: 25, name: "Shenzhen", type: "property", price: 220, rent: [18,90,160,430,620,750], color: "pink", flag: "🇨🇳" },
  { id: 26, name: "Surprise", type: "surprise" },
  { id: 27, name: "Beijing", type: "property", price: 220, rent: [18,90,160,430,620,750], color: "pink", flag: "🇨🇳" },
  { id: 28, name: "Treasure", type: "treasure" },
  { id: 29, name: "Shanghai", type: "property", price: 240, rent: [20,100,170,450,650,800], color: "pink", flag: "🇨🇳" },
  { id: 30, name: "CDG Airport", type: "railroad", price: 200, flag: "✈️" },

  // Left column top→bottom (31-39)
  { id: 31, name: "Go to Prison", type: "go_to_jail" },
  { id: 32, name: "Toulouse", type: "property", price: 260, rent: [22,110,190,480,680,870], color: "blue", flag: "🇫🇷" },
  { id: 33, name: "Paris", type: "property", price: 260, rent: [22,110,190,480,680,870], color: "blue", flag: "🇫🇷" },
  { id: 34, name: "Water Company", type: "utility", price: 150, flag: "💧" },
  { id: 35, name: "Yokohama", type: "property", price: 280, rent: [24,120,200,500,700,900], color: "red", flag: "🇯🇵" },
  { id: 36, name: "Tokyo", type: "property", price: 280, rent: [24,120,200,500,700,900], color: "red", flag: "🇯🇵" },
  { id: 37, name: "Premium Tax", type: "tax", amount: 75, taxType: "fixed" },
  { id: 38, name: "San Francisco", type: "property", price: 360, rent: [35,175,500,1100,1300,1500], color: "green", flag: "🇺🇸" },
  { id: 39, name: "Surprise", type: "surprise" },
  { id: 40, name: "Los Angeles", type: "property", price: 350, rent: [35,175,500,1100,1300,1500], color: "green", flag: "🇺🇸" },
  { id: 41, name: "JFK Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 42, name: "London", type: "property", price: 320, rent: [28,150,450,1000,1200,1400], color: "lightblue", flag: "🇬🇧" },
  { id: 43, name: "Birmingham", type: "property", price: 320, rent: [28,150,450,1000,1200,1400], color: "lightblue", flag: "🇬🇧" },
  { id: 44, name: "Treasure", type: "treasure" },
  { id: 45, name: "Manchester", type: "property", price: 300, rent: [26,130,390,900,1100,1275], color: "lightblue", flag: "🇬🇧" },
  { id: 46, name: "Liverpool", type: "property", price: 300, rent: [26,130,390,900,1100,1275], color: "lightblue", flag: "🇬🇧" },
  { id: 47, name: "New York", type: "property", price: 400, rent: [50,200,600,1400,1700,2000], color: "darkgreen", flag: "🇺🇸" },
  { id: 48, name: "Premium Tax", type: "tax", amount: 75, taxType: "fixed" },
  { id: 49, name: "New York (2)", type: "property", price: 400, rent: [50,200,600,1400,1700,2000], color: "darkgreen", flag: "🇺🇸" },
];

// Final 48-space board (13x13 grid: 13+11+13+11)
const BOARD = [
  // Bottom row (ids 0-12): 13 casillas
  { id: 0, name: "GO", type: "go" },
  { id: 1, name: "Salvador", type: "property", price: 60, rent: [2,10,30,90,160,250], color: "brown", flag: "🇧🇷" },
  { id: 2, name: "Treasure", type: "treasure" },
  { id: 3, name: "Rio", type: "property", price: 60, rent: [2,10,30,90,160,250], color: "brown", flag: "🇧🇷" },
  { id: 4, name: "Earnings Tax", type: "tax", amount: 0, taxType: "percent10", label: "10%" },
  { id: 6, name: "Tel Aviv", type: "property", price: 100, rent: [6,30,90,270,400,480], color: "teal", flag: "🇮🇱" },
  { id: 5, name: "TLV Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 8, name: "Haifa", type: "property", price: 110, rent: [6,30,90,270,400,480], color: "teal", flag: "🇮🇱" },
  { id: 9, name: "Jerusalem", type: "property", price: 120, rent: [8,40,100,300,440,520], color: "teal", flag: "🇮🇱" },
  { id: 7, name: "Surprise", type: "surprise" },
  { id: 10, name: "Mumbai", type: "property", price: 130, rent: [8,40,100,300,440,520], color: "yellow", flag: "🇮🇳" },
  { id: 13, name: "New Delhi", type: "property", price: 140, rent: [10,50,110,320,460,560], color: "yellow", flag: "🇮🇳" },
  { id: 12, name: "In Prison", type: "jail" },
  
  // Right column (ids 13-23): 11 casillas
  { id: 16, name: "Venice", type: "property", price: 140, rent: [10,50,110,320,460,560], color: "purple", flag: "🇮🇹" },
  { id: 17, name: "Bologna", type: "property", price: 150, rent: [12,60,120,340,490,600], color: "purple", flag: "🇮🇹" },
  { id: 11, name: "Electric Company", type: "utility", price: 150, flag: "⚡" },
  { id: 19, name: "Milan", type: "property", price: 160, rent: [12,60,120,340,490,600], color: "purple", flag: "🇮🇹" },
  { id: 20, name: "Rome", type: "property", price: 180, rent: [14,70,130,380,550,650], color: "orange", flag: "🇮🇹" },
  { id: 15, name: "MUC Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 14, name: "Treasure", type: "treasure" },
  { id: 22, name: "Frankfurt", type: "property", price: 180, rent: [14,70,130,380,550,650], color: "orange", flag: "🇩🇪" },
  { id: 21, name: "Treasure", type: "treasure" },
  { id: 26, name: "Munich", type: "property", price: 200, rent: [16,80,140,400,580,700], color: "orange", flag: "🇩🇪" },
  { id: 24, name: "Gas Company", type: "utility", price: 150, flag: "⛽" },
  { id: 18, name: "Surprise", type: "surprise" },
  { id: 27, name: "Berlin", type: "property", price: 220, rent: [18,90,160,430,620,750], color: "red", flag: "🇩🇪" },
  { id: 23, name: "Vacation", type: "vacation" },
  
  // Top row (ids 24-36): 13 casillas
  { id: 29, name: "Shenzhen", type: "property", price: 220, rent: [18,90,160,430,620,750], color: "red", flag: "🇨🇳" },
  { id: 28, name: "Surprise", type: "surprise" },
  { id: 30, name: "Beijing", type: "property", price: 240, rent: [20,100,170,450,650,800], color: "red", flag: "🇨🇳" },
  { id: 32, name: "Treasure", type: "treasure" },
  { id: 31, name: "Shanghai", type: "property", price: 240, rent: [20,100,170,450,650,800], color: "pink", flag: "🇨🇳" },
  { id: 25, name: "CDG Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 34, name: "Toulouse", type: "property", price: 260, rent: [22,110,190,480,680,870], color: "pink", flag: "🇫🇷" },
  { id: 35, name: "Paris", type: "property", price: 280, rent: [24,120,200,500,700,900], color: "blue", flag: "🇫🇷" },
  { id: 40, name: "Water Company", type: "utility", price: 150, flag: "💧" },
  { id: 39, name: "Yokohama", type: "property", price: 280, rent: [24,120,200,500,700,900], color: "red", flag: "🇯🇵" },
  { id: 38, name: "Tokyo", type: "property", price: 320, rent: [28,150,450,1000,1200,1400], color: "blue", flag: "🇯🇵" },
  { id: 36, name: "Go to Prison", type: "go_to_jail" },
  
  // Left column (ids 37-47): 11 casillas
  { id: 47, name: "Manchester", type: "property", price: 300, rent: [26,130,390,900,1100,1275], color: "lightblue", flag: "🇬🇧" },
  { id: 46, name: "London", type: "property", price: 300, rent: [28,150,450,1000,1200,1400], color: "lightblue", flag: "🇬🇧" },
  { id: 44, name: "Treasure", type: "treasure" },
  { id: 49, name: "Birmingham", type: "property", price: 320, rent: [28,150,450,1000,1200,1400], color: "lightblue", flag: "🇬🇧" },
  { id: 48, name: "Liverpool", type: "property", price: 320, rent: [26,130,390,900,1100,1275], color: "lightblue", flag: "🇬🇧" },
  { id: 33, name: "JFK Airport", type: "railroad", price: 200, flag: "✈️" },
  { id: 45, name: "Los Angeles", type: "property", price: 350, rent: [35,175,500,1100,1300,1500], color: "green", flag: "🇺🇸" },
  { id: 41, name: "Surprise", type: "surprise" },
  { id: 43, name: "San Francisco", type: "property", price: 360, rent: [35,175,500,1100,1300,1500], color: "green", flag: "🇺🇸" },
  { id: 37, name: "Premium Tax", type: "tax", amount: 75, taxType: "fixed", label: "$75" },
  { id: 42, name: "New York", type: "property", price: 400, rent: [50,200,600,1400,1700,2000], color: "green", flag: "🇺🇸" },
];

// Color groups for color set detection
const COLOR_GROUPS = {
  brown:    [1, 3],
  teal:     [6, 8, 9],
  yellow:   [10, 13],
  purple:   [16, 17, 19],
  orange:   [20, 22, 26],
  red:      [27, 29, 30, 39],
  pink:     [31, 34],
  blue:     [35, 38],
  green:    [42, 43, 45],
  lightblue: [46, 47, 48, 49],
};

const RAILROADS = [5, 15, 25, 33];
const UTILITIES = [11, 24, 40];

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
