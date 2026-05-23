/**
 * XP and levelling utilities for the Meow coding platform.
 *
 * Level formula:  level = floor( sqrt( totalXP / 100 ) ) + 1
 * XP required for a given level:  level² × 100  (total cumulative)
 * Streak bonus:  1.5× multiplier for consecutive-day coding
 */

/**
 * Derive the current level from total XP.
 * @param {number} totalXP
 * @returns {number} level (1-based, minimum 1)
 */
export function getLevel(totalXP) {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

/**
 * Total XP needed to reach a specific level.
 * @param {number} level
 * @returns {number}
 */
export function xpForLevel(level) {
  return (level - 1) * (level - 1) * 100;
}

/**
 * XP needed to advance from the current level to the next.
 * @param {number} totalXP
 * @returns {{ current: number, needed: number, progress: number }}
 */
export function xpProgress(totalXP) {
  const level = getLevel(totalXP);
  const currentFloor = xpForLevel(level);
  const nextFloor = xpForLevel(level + 1);
  const xpIntoLevel = totalXP - currentFloor;
  const xpBetween = nextFloor - currentFloor;

  return {
    current: xpIntoLevel,
    needed: xpBetween,
    progress: xpBetween > 0 ? xpIntoLevel / xpBetween : 1,
  };
}

/**
 * Apply the daily-streak multiplier to a raw XP reward.
 * @param {number} rawXP   — base XP from the mission
 * @param {number} streak  — number of consecutive days
 * @returns {number} adjusted XP (rounded)
 */
export function applyStreakBonus(rawXP, streak) {
  const multiplier = streak >= 2 ? 1.5 : 1;
  return Math.round(rawXP * multiplier);
}

/**
 * Determine if a streak is still active based on the last coding date.
 * A streak is alive if the last activity was today or yesterday.
 * @param {string | null} lastDateISO — ISO date string of last activity, or null
 * @returns {{ alive: boolean, isToday: boolean }}
 */
export function checkStreak(lastDateISO) {
  if (!lastDateISO) return { alive: false, isToday: false };

  const now = new Date();
  const last = new Date(lastDateISO);

  const todayStr = now.toISOString().slice(0, 10);
  const lastStr = last.toISOString().slice(0, 10);

  if (todayStr === lastStr) return { alive: true, isToday: true };

  // Check if last activity was yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (lastStr === yesterdayStr) return { alive: true, isToday: false };

  return { alive: false, isToday: false };
}
