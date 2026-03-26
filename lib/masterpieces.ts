export interface Masterpiece {
  id: string;
  name: string;
  originalName: string;
  artist: string;
  image: string;
  quote: string;
  rarity: "C" | "B" | "A" | "S" | "SSR";
}

export const MASTERPIECES: Masterpiece[] = [
  {
    id: "mona-chicken",
    name: "蒙娜鸡莎的神秘微笑",
    originalName: "蒙娜丽莎",
    artist: "达芬鸡",
    image: "/images/art/mona-chicken.png",
    quote: "艺术的真谛就是——不要让别人看清你的脚掌。",
    rarity: "A"
  },
  {
    id: "pearl-chicken",
    name: "戴珍珠耳环的雏鸡",
    originalName: "戴珍珠耳环的少女",
    artist: "维梅尔鸡",
    image: "/images/art/pearl-chicken.png",
    quote: "我深情回眸，只是因为听到了开饭的声音。",
    rarity: "A"
  },
  {
    id: "scream-chicken",
    name: "呐喊的小雏鸡",
    originalName: "呐喊",
    artist: "爱德华·蒙鸡",
    image: "/images/art/scream-chicken.png",
    quote: "当我发现今天的灵气已经用完时的真实反应。",
    rarity: "B"
  },
  {
    id: "starry-chicken",
    name: "星空下的灵鸡",
    originalName: "星夜",
    artist: "梵高鸡",
    image: "/images/art/starry-chicken.png",
    quote: "在无尽的星轮中，我看到了下一颗蛋的形状。",
    rarity: "S"
  },
  {
    id: "great-wave-chicken",
    name: "神通川的大浪鸡",
    originalName: "神奈川冲浪里",
    artist: "葛饰北斋鸡",
    image: "/images/art/wave-chicken.png",
    quote: "浪再大，也打不湿我防水的羽毛。",
    rarity: "S"
  }
];

export interface Destination {
  id: string;
  name: string;
  description: string;
  duration: number; // seconds
  cost: number;
  image: string;
  possibleRewards: string[]; // Masterpiece IDs
}

export const DESTINATIONS: Destination[] = [
  {
    id: "paris",
    name: "浪漫巴黎",
    description: "去卢浮宫感受艺术的熏陶，或许能带回一些古典气息。",
    duration: 30,
    cost: 1, // 1 技能点
    image: "/images/dest/paris.jpg",
    possibleRewards: ["mona-chicken", "pearl-chicken"]
  },
  {
    id: "tokyo",
    name: "古都京都",
    description: "在金阁寺的碎石路上漫步，追寻东方美学的足迹。",
    duration: 60,
    cost: 2, // 2 技能点
    image: "/images/dest/kyoto.jpg",
    possibleRewards: ["great-wave-chicken"]
  },
  {
    id: "amsterdam",
    name: "风车小镇",
    description: "郁金香盛开的地方，梵高鸡曾在这里对着星空发呆。",
    duration: 120,
    cost: 3, // 3 技能点
    image: "/images/dest/amsterdam.jpg",
    possibleRewards: ["starry-chicken", "scream-chicken"]
  }
];
