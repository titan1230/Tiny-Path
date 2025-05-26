import { BackgroundOptions } from "@/types";

export const backgroundOptions: BackgroundOptions = {
  gradients: [
    {
      name: "Purple Pink",
      class: "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500",
    },
    {
      name: "Ocean Blue",
      class: "bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500",
    },
    {
      name: "Sunset",
      class: "bg-gradient-to-br from-orange-400 via-red-500 to-pink-500",
    },
    {
      name: "Forest",
      class: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500",
    },
    {
      name: "Lavender",
      class: "bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500",
    },
    {
      name: "Golden Hour",
      class: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
    },
    {
      name: "Midnight",
      class: "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
    },
    {
      name: "Aurora",
      class: "bg-gradient-to-br from-green-300 via-blue-500 to-purple-600",
    },
  ],
  solids: [
    { name: "Deep Purple", class: "bg-purple-600" },
    { name: "Ocean Blue", class: "bg-blue-600" },
    { name: "Emerald", class: "bg-emerald-600" },
    { name: "Rose", class: "bg-rose-600" },
    { name: "Amber", class: "bg-amber-600" },
    { name: "Indigo", class: "bg-indigo-600" },
    { name: "Teal", class: "bg-teal-600" },
    { name: "Slate", class: "bg-slate-600" },
    { name: "Crimson", class: "bg-red-600" },
    { name: "Violet", class: "bg-violet-600" },
    { name: "Cyan", class: "bg-cyan-600" },
    { name: "Lime", class: "bg-lime-600" },
  ],
};
