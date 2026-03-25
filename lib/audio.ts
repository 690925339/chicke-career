export const SFX = {
  TAP: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  SUCCESS: "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
  SKILL: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  TRAVEL: "https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3",
  ZAP: "https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3",
};

export const playSFX = (url: string) => {
  if (typeof window === "undefined") return;
  const audio = new Audio(url);
  audio.volume = 0.4;
  audio.play().catch(e => console.log("Audio play blocked", e));
};
