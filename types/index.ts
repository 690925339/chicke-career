export interface Career {
  id: string;
  name: string;
  title: string;
  description: string;
  unlockCost: number;
  color: string;
  bgColor: string;
  skills: CareerSkill[];
  defaultSkillId: string;
}

export interface CareerSkill {
  id: string;
  name: string;
  description: string;
  dailyFreeQuota: number; // For backward compatibility or base quota
  extraCost: number;
}

export interface PalmReadingResult {
  overall: string;
  career: string;
  love: string;
  wealth: string;
  health: string;
  luckyNumber: number;
  luckyColor: string;
  advice: string;
}

export interface SkillRecord {
  id: string;
  careerId: string;
  skillId: string;
  createdAt: string;
  result: PalmReadingResult;
  inputs: {
    age: number;
    gender: string;
  };
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  reward: { chickenCoin: number };
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: { chickenCoin?: number; diamond?: number };
  unlocked: boolean;
  unlockedAt?: string;
}

export interface CheckInDay {
  day: number;
  reward: { chickenCoin: number };
  claimed: boolean;
}

export interface Masterpiece {
  id: string;
  name: string;
  originalArtist: string;
  imageUrl: string;
  chickenDescription: string;
  collectedAt: string;
}
