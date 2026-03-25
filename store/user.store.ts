"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SkillRecord, Achievement, Masterpiece } from "@/types";
import { CAREERS } from "@/lib/careers";
import { v4 as uuidv4 } from "uuid";

interface UserState {
  chickenCoin: number;
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
  
  // Travel System
  travelStartTime: string | null;
  travelEndTime: string | null;
  masterpieces: Masterpiece[];

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
  
  // Travel Methods
  startTravel: (durationMinutes: number) => boolean;
  collectTravelReward: (masterpiece: Masterpiece) => void;
  cancelTravel: () => void;
  addAffection: (amount: number) => void;
}

const today = () => new Date().toDateString();
const MAX_AURA = 10;
const RECOVERY_MS = 30 * 60 * 1000; // 30 mins

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      chickenCoin: 100,
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
      travelStartTime: null,
      travelEndTime: null,
      masterpieces: [],

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

      startTravel: (durationMinutes) => {
        const { aura, spendCoins, travelStartTime } = get();
        if (travelStartTime) return false; // Already traveling
        if (aura < 2) return false; // Cost 2 aura to start
        
        const start = new Date();
        const end = new Date(start.getTime() + durationMinutes * 60000);
        
        set({
          aura: aura - 2,
          travelStartTime: start.toISOString(),
          travelEndTime: end.toISOString()
        });
        return true;
      },

      collectTravelReward: (masterpiece) => {
        set((s) => ({
          masterpieces: [masterpiece, ...s.masterpieces],
          travelStartTime: null,
          travelEndTime: null,
          chickenCoin: s.chickenCoin + 50 // Extra fixed reward
        }));
      },

      cancelTravel: () => set({ travelStartTime: null, travelEndTime: null }),
      
      addAffection: (amount) => set((s) => ({
        affection: Math.min(100, s.affection + amount),
        mood: Math.min(100, s.mood + amount * 2)
      })),
    }),
    { name: "chicken-career-user" }
  )
);
