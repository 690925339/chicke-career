"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SkillRecord, Achievement, Masterpiece } from "@/types";
import { CAREERS } from "@/lib/careers";
import { DESTINATIONS, MASTERPIECES } from "@/lib/masterpieces";
import { v4 as uuidv4 } from "uuid";

interface UserState {
  chickenCoin: number;
  diamond: number;
  aura: number; // energy: 0-10
  maxAura: number;
  currentCareerId: string;
  currentSkillId: string;
  unlockedCareerIds: string[];
  checkInStreak: number;
  lastCheckInDate: string | null;
  skillRecords: SkillRecord[];
  achievements: Achievement[];
  dailySkillUsage: Record<string, number>;
  lastSkillDate: string | null;
  lastAuraRecovery: string | null;
  affection: number; // 0-100
  mood: number; // 0-100
  
  // Egg Economy
  eggs: number;
  skillPoints: number;
  hunger: number; // 0-100, 100 means full

  // Travel System (Pivoted to Travel Photos)
  travelState: 'idle' | 'traveling' | 'returned';
  currentTrip: { 
    destinationId: string; 
    startTime: string; 
    duration: number; 
  } | null;
  collectedMasterpieceIds: string[];

  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  setCurrentCareer: (id: string) => void;
  setCurrentSkill: (id: string) => void;
  unlockCareer: (id: string, cost: number) => boolean;
  checkIn: () => { success: boolean; reward: number };
  addSkillRecord: (record: SkillRecord) => void;
  useAura: (amount: number) => boolean;
  recoverAura: (amount: number) => void;
  checkAuraRecovery: () => void;
  
  // Egg Economy Methods
  feedChicken: () => { success: boolean; eggsGained: number };
  exchangeEggsForPoints: (amount: number) => boolean;
  useSkillPoint: (amount: number) => boolean;

  // Travel Methods
  startTravel: () => boolean;
  checkTravelStatus: () => void;
  claimTravelReward: () => Masterpiece | null;
  addAffection: (amount: number) => void;
}

const today = () => new Date().toDateString();
const MAX_AURA = 10;
const RECOVERY_MS = 30 * 60 * 1000; // 30 mins

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      chickenCoin: 200, // 新手测试礼包
      diamond: 0,
      aura: 10,
      maxAura: MAX_AURA,
      currentCareerId: "fortune-teller",
      currentSkillId: "palm-reading",
      unlockedCareerIds: ["fortune-teller"],
      checkInStreak: 0,
      lastCheckInDate: null,
      skillRecords: [],
      achievements: [],
      dailySkillUsage: {},
      lastSkillDate: null,
      lastAuraRecovery: new Date().toISOString(),
      affection: 20,
      mood: 80,
      
      eggs: 0,
      skillPoints: 5, // 初始赠送 5 点
      hunger: 30,

      travelState: 'idle',
      currentTrip: null,
      collectedMasterpieceIds: [],

      // ... existing methods ...
      addCoins: (amount) => set((s) => ({ chickenCoin: s.chickenCoin + amount })),

      spendCoins: (amount) => {
        if (get().chickenCoin < amount) return false;
        set((s) => ({ chickenCoin: s.chickenCoin - amount }));
        return true;
      },

      setCurrentCareer: (id) => {
        const career = CAREERS.find(c => c.id === id);
        set({ 
          currentCareerId: id,
          currentSkillId: career?.defaultSkillId ?? ""
        });
      },

      setCurrentSkill: (id) => set({ currentSkillId: id }),

      unlockCareer: (id, cost) => {
        const { spendCoins, unlockedCareerIds } = get();
        if (unlockedCareerIds.includes(id)) return true;
        if (!spendCoins(cost)) return false;
        set((s) => ({ unlockedCareerIds: [...s.unlockedCareerIds, id] }));
        return true;
      },

      checkIn: () => {
        const { lastCheckInDate, checkInStreak } = get();
        if (lastCheckInDate === today()) return { success: false, reward: 0 };
        const newStreak = checkInStreak + 1;
        const reward = Math.min(newStreak * 10, 100);
        set({ lastCheckInDate: today(), checkInStreak: newStreak, chickenCoin: get().chickenCoin + reward });
        return { success: true, reward };
      },

      addSkillRecord: (record) =>
        set((s) => ({ skillRecords: [record, ...s.skillRecords].slice(0, 50) })),

      useAura: (amount) => {
        const { aura } = get();
        if (aura < amount) return false;
        set({ aura: aura - amount, lastAuraRecovery: new Date().toISOString() });
        return true;
      },

      recoverAura: (amount) => {
        set((s) => ({ aura: Math.min(s.maxAura, s.aura + amount) }));
      },

      checkAuraRecovery: () => {
        const { aura, maxAura, lastAuraRecovery } = get();
        if (aura >= maxAura || !lastAuraRecovery) return;

        const now = new Date().getTime();
        const last = new Date(lastAuraRecovery).getTime();
        const diff = now - last;
        const recovered = Math.floor(diff / RECOVERY_MS);

        if (recovered > 0) {
          set({
            aura: Math.min(maxAura, aura + recovered),
            lastAuraRecovery: new Date().toISOString()
          });
        }
      },

      // Egg Economy Implementation
      feedChicken: () => {
        const { aura, hunger, useAura } = get();
        if (aura < 1) return { success: false, eggsGained: 0 };
        
        useAura(1);
        const gained = Math.floor(Math.random() * 3) + 1; // 1-3 eggs
        set((s) => ({ 
          eggs: s.eggs + gained,
          hunger: Math.min(100, s.hunger + 10),
          affection: Math.min(100, s.affection + 1)
        }));
        return { success: true, eggsGained: gained };
      },

      exchangeEggsForPoints: (amount) => {
        const { eggs } = get();
        if (eggs < amount) return false;
        const pointsGained = Math.floor(amount / 10);
        if (pointsGained < 1) return false;

        set((s) => ({
          eggs: s.eggs - amount,
          skillPoints: s.skillPoints + pointsGained
        }));
        return true;
      },

      useSkillPoint: (amount) => {
        const { skillPoints } = get();
        if (skillPoints < amount) return false;
        set((s) => ({ skillPoints: s.skillPoints - amount }));
        return true;
      },

      // Travel Implementation (Direct Start with Magic Door)
      startTravel: () => {
        const { skillPoints, travelState, useSkillPoint } = get();
        if (travelState !== 'idle') return false;
        
        // 每个目的地消耗 2 个技能点 (统一价格)
        if (!useSkillPoint(2)) return false;

        // 随机时长: 5, 10, 24 小时
        const durations = [5, 10, 24];
        const selectedHours = durations[Math.floor(Math.random() * durations.length)];
        
        // 随机目的地
        const randomDest = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];

        set({
          travelState: 'traveling',
          currentTrip: {
            destinationId: randomDest.id,
            startTime: new Date().toISOString(),
            duration: selectedHours * 3600 // 转换为秒
          }
        });
        return true;
      },

      checkTravelStatus: () => {
        const { travelState, currentTrip } = get();
        if (travelState !== 'traveling' || !currentTrip) return;

        const now = new Date().getTime();
        const start = new Date(currentTrip.startTime).getTime();
        if (now - start >= currentTrip.duration * 1000) {
          set({ travelState: 'returned' });
        }
      },

      claimTravelReward: () => {
        const { travelState, currentTrip, collectedMasterpieceIds } = get();
        if (travelState !== 'returned' || !currentTrip) return null;

        const dest = DESTINATIONS.find(d => d.id === currentTrip.destinationId);
        if (!dest) return null;

        // 随机抽取一个奖励
        const rewardId = dest.possibleRewards[Math.floor(Math.random() * dest.possibleRewards.length)];
        const masterpiece = MASTERPIECES.find(m => m.id === rewardId);

        if (masterpiece) {
          set((s) => ({
            travelState: 'idle',
            currentTrip: null,
            collectedMasterpieceIds: Array.from(new Set([...s.collectedMasterpieceIds, rewardId])),
            chickenCoin: s.chickenCoin + 20 // 基础归来奖励
          }));
          return masterpiece;
        }

        set({ travelState: 'idle', currentTrip: null });
        return null;
      },
      
      addAffection: (amount) => set((s) => ({
        affection: Math.min(100, s.affection + amount),
        mood: Math.min(100, s.mood + amount * 2)
      })),
    }),
    { name: "chicken-career-user" }
  )
);
