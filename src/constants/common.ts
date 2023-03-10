export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "";

export const ITEM_CLASSES = [
  {
    label: "Common",
    value: "common",
    color: "var(--common)",
  },
  {
    label: "Rare",
    value: "rare",
    color: "var(--rare)",
  },
  {
    label: "Extraordinary",
    value: "extraordinary",
    color: "var(--extraordinary)",
  },
  {
    label: "Legendary",
    value: "legendary",
    color: "var(--legendary)",
  },
  {
    label: "Mythical",
    value: "mythical",
    color: "var(--mythical)",
  },
  {
    label: "Mega",
    value: "mega",
    color: "var(--mega)",
  },
];

export const SORT_OPTIONS = [
  {
    label: "Cost",
    value: "cost",
  },
  {
    label: "Name",
    value: "displayName",
  },
];
