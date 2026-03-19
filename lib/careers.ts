import { Career } from "@/types";

export const CAREERS: Career[] = [
  {
    id: "fortune-teller",
    name: "算命鸡",
    title: "命运预言师",
    description: "洞察掌纹，预见命运。用古老的手相术，为你揭示人生密码。",
    unlockCost: 0,
    color: "#7C3AED",
    bgColor: "#EDE9FE",
    skill: {
      id: "palm-reading",
      name: "手相解读",
      description: "上传你的手掌照片，AI算命鸡将为你解读命运玄机",
      dailyFreeQuota: 3,
      extraCost: 10,
    },
  },
  {
    id: "doctor",
    name: "医生鸡",
    title: "羽毛神医",
    description: "妙手回春，悬壶济世。（即将上线）",
    unlockCost: 500,
    color: "#059669",
    bgColor: "#D1FAE5",
    skill: {
      id: "health-analysis",
      name: "健康分析",
      description: "敬请期待",
      dailyFreeQuota: 3,
      extraCost: 10,
    },
  },
  {
    id: "lawyer",
    name: "律师鸡",
    title: "羽翼法神",
    description: "以法为剑，正义必胜。（即将上线）",
    unlockCost: 800,
    color: "#1D4ED8",
    bgColor: "#DBEAFE",
    skill: {
      id: "legal-advice",
      name: "法律咨询",
      description: "敬请期待",
      dailyFreeQuota: 3,
      extraCost: 10,
    },
  },
];

export const getCareerById = (id: string) => CAREERS.find((c) => c.id === id);
