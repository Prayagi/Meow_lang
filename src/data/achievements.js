/**
 * Achievement definitions for the Meow coding platform.
 * Each achievement has an emoji icon and a human-readable condition string.
 */

export const achievements = [
  // ── Getting Started ────────────────────────────────────────────
  {
    id: "first-meow",
    title: "First Meow",
    description: "Run your very first Meow program.",
    icon: "🐱",
    condition: "run_first_program",
  },
  {
    id: "hello-world",
    title: "Hello World!",
    description: 'Print "Meow!" to the screen.',
    icon: "🌍",
    condition: "complete_mission_out-1",
  },

  // ── Mission milestones ─────────────────────────────────────────
  {
    id: "triple-paw",
    title: "Triple Paw",
    description: "Complete 3 missions.",
    icon: "🐾",
    condition: "complete_3_missions",
  },
  {
    id: "mission-master",
    title: "Mission Master",
    description: "Complete 10 missions.",
    icon: "🏆",
    condition: "complete_10_missions",
  },
  {
    id: "purrfectionist",
    title: "Purrfectionist",
    description: "Complete all 15 missions.",
    icon: "✨",
    condition: "complete_all_missions",
  },

  // ── Category specialists ───────────────────────────────────────
  {
    id: "variable-virtuoso",
    title: "Variable Virtuoso",
    description: "Complete all Variable missions.",
    icon: "📦",
    condition: "complete_all_category_Variables",
  },
  {
    id: "output-oracle",
    title: "Output Oracle",
    description: "Complete all Output missions.",
    icon: "📢",
    condition: "complete_all_category_Output",
  },
  {
    id: "condition-king",
    title: "Condition King",
    description: "Complete all Conditions missions.",
    icon: "👑",
    condition: "complete_all_category_Conditions",
  },
  {
    id: "loop-legend",
    title: "Loop Legend",
    description: "Complete all Loops missions.",
    icon: "🔁",
    condition: "complete_all_category_Loops",
  },
  {
    id: "function-fanatic",
    title: "Function Fanatic",
    description: "Complete all Functions missions.",
    icon: "⚙️",
    condition: "complete_all_category_Functions",
  },

  // ── Debugging & errors ─────────────────────────────────────────
  {
    id: "debug-hero",
    title: "Debug Hero",
    description: "Encounter and fix 5 code errors.",
    icon: "🐛",
    condition: "fix_5_errors",
  },
  {
    id: "bug-zapper",
    title: "Bug Zapper",
    description: "Encounter 20 errors total — persistence pays off!",
    icon: "⚡",
    condition: "encounter_20_errors",
  },

  // ── Streaks & consistency ──────────────────────────────────────
  {
    id: "streak-3",
    title: "Three-Day Streak",
    description: "Code 3 days in a row.",
    icon: "🔥",
    condition: "streak_3_days",
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Code 7 days in a row.",
    icon: "💪",
    condition: "streak_7_days",
  },

  // ── XP & level ─────────────────────────────────────────────────
  {
    id: "level-5",
    title: "Rising Star",
    description: "Reach level 5.",
    icon: "⭐",
    condition: "reach_level_5",
  },
  {
    id: "level-10",
    title: "Cat Sensei",
    description: "Reach level 10.",
    icon: "🥋",
    condition: "reach_level_10",
  },

  // ── Fun / Easter eggs ──────────────────────────────────────────
  {
    id: "night-owl",
    title: "Night Owl Cat",
    description: "Write code between midnight and 5 AM.",
    icon: "🦉",
    condition: "code_at_night",
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Complete a mission within 30 seconds of starting it.",
    icon: "💨",
    condition: "complete_mission_fast",
  },
  {
    id: "accessorize",
    title: "Fashionista",
    description: "Equip your first accessory.",
    icon: "👒",
    condition: "equip_first_accessory",
  },
];

/** Lookup an achievement by its id */
export function getAchievementById(id) {
  return achievements.find((a) => a.id === id) ?? null;
}

/** Get total number of achievements */
export const totalAchievements = achievements.length;
