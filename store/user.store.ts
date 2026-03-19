"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SkillRecord, Achievement } from "@/types";

interface UserState {
  chickenCoin: number;
  diamond: number;
  currentCareerId: string;
  unlockedCareerIds: string[];
  checkInStreak: number;
  lastCheckInDate: string | null;
  skillRecords: SkillRecord[];
  achievements: Achievement[];
  dailySkillUsage: Record<string, number>;
  lastSkillDate: string | null;

  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  setCurrentCareer: (id: string) => void;
  unlockCareer: (id: string, cost: number) => boolean;
  checkIn: () => { success: boolean; reward: number };
  addSkillRecord: (record: SkillRecord) => void;
  getDailyUsage: (skillId: string) => number;
  incrementDailyUsage: (skillId: string) => void;
}

const today = () => new Date().toDateString();

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      chickenCoin: 100,
      diamond: 5,
      currentCareerId: "fortune-teller",
      unlockedCareerIds: ["fortune-teller"],
      checkInStreak: 0,
      lastCheckInDate: null,
      skillRecords: [],
      achievements: [],
      dailySkillUsage: {},
      lastSkillDate: null,

      addCoins: (amount) => set((s) => ({ chickenCoin: s.chickenCoin + amount })),

      spendCoins: (amount) => {
        if (get().chickenCoin < amount) return false;
        set((s) => ({ chickenCoin: s.chickenCoin - amount }));
        return true;
      },

      setCurrentCareer: (id) => set({ currentCareerId: id }),

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

      getDailyUsage: (skillId) => {
        const { lastSkillDate, dailySkillUsage } = get();
        if (lastSkillDate !== today()) return 0;
        return dailySkillUsage[skillId] ?? 0;
      },

      incrementDailyUsage: (skillId) => {
        const { lastSkillDate } = get();
        const usage = lastSkillDate !== today() ? {} : get().dailySkillUsage;
        set({ lastSkillDate: today(), dailySkillUsage: { ...usage, [skillId]: (usage[skillId] ?? 0) + 1 } });
      },
    }),
    { name: "chicken-career-user" }
  )
);
