"use client";
import { create } from "zustand";
import { PalmReadingResult } from "@/types";

type Step = "info" | "left-hand" | "right-hand" | "confirm" | "loading" | "result";

interface SkillState {
  step: Step;
  age: number | null;
  gender: "male" | "female" | null;
  leftHandFile: File | null;
  rightHandFile: File | null;
  leftHandPreview: string | null;
  rightHandPreview: string | null;
  result: PalmReadingResult | null;
  error: string | null;

  setStep: (step: Step) => void;
  setInfo: (age: number, gender: "male" | "female") => void;
  setHandImage: (hand: "left" | "right", file: File, preview: string) => void;
  setResult: (result: PalmReadingResult) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const initial = {
  step: "info" as Step,
  age: null,
  gender: null,
  leftHandFile: null,
  rightHandFile: null,
  leftHandPreview: null,
  rightHandPreview: null,
  result: null,
  error: null,
};

export const useSkillStore = create<SkillState>()((set) => ({
  ...initial,
  setStep: (step) => set({ step }),
  setInfo: (age, gender) => set({ age, gender }),
  setHandImage: (hand, file, preview) =>
    hand === "left"
      ? set({ leftHandFile: file, leftHandPreview: preview })
      : set({ rightHandFile: file, rightHandPreview: preview }),
  setResult: (result) => set({ result, step: "result" }),
  setError: (error) => set({ error, step: "confirm" }),
  reset: () => set(initial),
}));
