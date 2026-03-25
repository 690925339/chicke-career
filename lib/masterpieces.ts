import { Masterpiece } from "@/types";

export const MASTERPIECES: Omit<Masterpiece, "id" | "collectedAt">[] = [
  {
    name: "戴珍珠耳环的灵鸡",
    originalArtist: "约翰内斯·维米尔",
    imageUrl: "/images/masterpieces/pearl-chicken.jpg",
    chickenDescription: "回眸一笑百魅生，这只灵鸡的眼神中透着对虫子的渴望。",
  },
  {
    name: "蒙娜灵鸡的微笑",
    originalArtist: "列奥纳多·达·芬奇",
    imageUrl: "/images/masterpieces/mona-chicken.jpg",
    chickenDescription: "她为什么在笑？是因为刚下了一个金蛋吗？",
  },
  {
    name: "灵鸡之子",
    originalArtist: "雷内·马格利特",
    imageUrl: "/images/masterpieces/son-of-chicken.jpg",
    chickenDescription: "一颗青苹果挡住了它的脸，但这并不妨碍它展示优雅的鸡冠。",
  },
  {
    name: "呐喊的灵鸡",
    originalArtist: "爱德华·蒙克",
    imageUrl: "/images/masterpieces/scream-chicken.jpg",
    chickenDescription: "当它发现明天的早餐只有小米时，发出了灵魂深处的共鸣。",
  },
  {
    name: "梵高的自画像（灵鸡版）",
    originalArtist: "文森特·梵高",
    imageUrl: "/images/masterpieces/vangogh-chicken.jpg",
    chickenDescription: "浓烈的笔触描绘了灵鸡对艺术近乎疯狂的执着。",
  }
];
