/**
 * Cat mood state machine for the Meow coding platform.
 *
 * States: idle, happy, confused, sleeping, zoomies, typing, thinking, celebrating
 * Events: code_run_success, code_run_error, user_typing, user_idle_30s,
 *         achievement_unlocked, mission_complete, user_returned
 */

/** All valid mood states */
export const MOODS = {
  IDLE: "idle",
  HAPPY: "happy",
  CONFUSED: "confused",
  SLEEPING: "sleeping",
  ZOOMIES: "zoomies",
  TYPING: "typing",
  THINKING: "thinking",
  CELEBRATING: "celebrating",
};

/** All recognised events */
export const EVENTS = {
  CODE_RUN_SUCCESS: "code_run_success",
  CODE_RUN_ERROR: "code_run_error",
  USER_TYPING: "user_typing",
  USER_IDLE_30S: "user_idle_30s",
  ACHIEVEMENT_UNLOCKED: "achievement_unlocked",
  MISSION_COMPLETE: "mission_complete",
  USER_RETURNED: "user_returned",
};

/**
 * Transition table.
 * Key = current mood, value = { event → next mood }.
 * If a transition isn't listed the mood stays unchanged.
 */
const transitions = {
  [MOODS.IDLE]: {
    [EVENTS.CODE_RUN_SUCCESS]: MOODS.HAPPY,
    [EVENTS.CODE_RUN_ERROR]: MOODS.CONFUSED,
    [EVENTS.USER_TYPING]: MOODS.TYPING,
    [EVENTS.USER_IDLE_30S]: MOODS.SLEEPING,
    [EVENTS.ACHIEVEMENT_UNLOCKED]: MOODS.CELEBRATING,
    [EVENTS.MISSION_COMPLETE]: MOODS.CELEBRATING,
  },
  [MOODS.HAPPY]: {
    [EVENTS.CODE_RUN_SUCCESS]: MOODS.ZOOMIES,
    [EVENTS.CODE_RUN_ERROR]: MOODS.CONFUSED,
    [EVENTS.USER_TYPING]: MOODS.TYPING,
    [EVENTS.USER_IDLE_30S]: MOODS.IDLE,
    [EVENTS.ACHIEVEMENT_UNLOCKED]: MOODS.CELEBRATING,
    [EVENTS.MISSION_COMPLETE]: MOODS.CELEBRATING,
  },
  [MOODS.CONFUSED]: {
    [EVENTS.CODE_RUN_SUCCESS]: MOODS.HAPPY,
    [EVENTS.CODE_RUN_ERROR]: MOODS.CONFUSED,
    [EVENTS.USER_TYPING]: MOODS.THINKING,
    [EVENTS.USER_IDLE_30S]: MOODS.IDLE,
    [EVENTS.ACHIEVEMENT_UNLOCKED]: MOODS.CELEBRATING,
    [EVENTS.MISSION_COMPLETE]: MOODS.HAPPY,
  },
  [MOODS.SLEEPING]: {
    [EVENTS.CODE_RUN_SUCCESS]: MOODS.HAPPY,
    [EVENTS.CODE_RUN_ERROR]: MOODS.CONFUSED,
    [EVENTS.USER_TYPING]: MOODS.TYPING,
    [EVENTS.USER_IDLE_30S]: MOODS.SLEEPING,
    [EVENTS.ACHIEVEMENT_UNLOCKED]: MOODS.CELEBRATING,
    [EVENTS.MISSION_COMPLETE]: MOODS.CELEBRATING,
    [EVENTS.USER_RETURNED]: MOODS.IDLE,
  },
  [MOODS.ZOOMIES]: {
    [EVENTS.CODE_RUN_SUCCESS]: MOODS.ZOOMIES,
    [EVENTS.CODE_RUN_ERROR]: MOODS.CONFUSED,
    [EVENTS.USER_TYPING]: MOODS.TYPING,
    [EVENTS.USER_IDLE_30S]: MOODS.HAPPY,
    [EVENTS.ACHIEVEMENT_UNLOCKED]: MOODS.CELEBRATING,
    [EVENTS.MISSION_COMPLETE]: MOODS.CELEBRATING,
  },
  [MOODS.TYPING]: {
    [EVENTS.CODE_RUN_SUCCESS]: MOODS.HAPPY,
    [EVENTS.CODE_RUN_ERROR]: MOODS.CONFUSED,
    [EVENTS.USER_TYPING]: MOODS.TYPING,
    [EVENTS.USER_IDLE_30S]: MOODS.IDLE,
    [EVENTS.ACHIEVEMENT_UNLOCKED]: MOODS.CELEBRATING,
    [EVENTS.MISSION_COMPLETE]: MOODS.CELEBRATING,
  },
  [MOODS.THINKING]: {
    [EVENTS.CODE_RUN_SUCCESS]: MOODS.HAPPY,
    [EVENTS.CODE_RUN_ERROR]: MOODS.CONFUSED,
    [EVENTS.USER_TYPING]: MOODS.TYPING,
    [EVENTS.USER_IDLE_30S]: MOODS.IDLE,
    [EVENTS.ACHIEVEMENT_UNLOCKED]: MOODS.CELEBRATING,
    [EVENTS.MISSION_COMPLETE]: MOODS.CELEBRATING,
  },
  [MOODS.CELEBRATING]: {
    [EVENTS.CODE_RUN_SUCCESS]: MOODS.HAPPY,
    [EVENTS.CODE_RUN_ERROR]: MOODS.CONFUSED,
    [EVENTS.USER_TYPING]: MOODS.TYPING,
    [EVENTS.USER_IDLE_30S]: MOODS.IDLE,
    [EVENTS.ACHIEVEMENT_UNLOCKED]: MOODS.CELEBRATING,
    [EVENTS.MISSION_COMPLETE]: MOODS.CELEBRATING,
  },
};

/**
 * Compute the next mood given the current mood and an event.
 * Returns the same mood if no transition is defined.
 *
 * @param {string} currentMood — one of MOODS values
 * @param {string} event       — one of EVENTS values
 * @returns {string} next mood
 */
export function nextMood(currentMood, event) {
  const table = transitions[currentMood];
  if (!table) return currentMood;
  return table[event] ?? currentMood;
}

/**
 * Emoji representation for each mood (useful for UI).
 */
export const moodEmojis = {
  [MOODS.IDLE]: "😺",
  [MOODS.HAPPY]: "😸",
  [MOODS.CONFUSED]: "😿",
  [MOODS.SLEEPING]: "😴",
  [MOODS.ZOOMIES]: "🙀",
  [MOODS.TYPING]: "⌨️",
  [MOODS.THINKING]: "🤔",
  [MOODS.CELEBRATING]: "🎉",
};

/**
 * Human-friendly label for each mood.
 */
export const moodLabels = {
  [MOODS.IDLE]: "Chillin'",
  [MOODS.HAPPY]: "Happy",
  [MOODS.CONFUSED]: "Confused",
  [MOODS.SLEEPING]: "Sleeping",
  [MOODS.ZOOMIES]: "Zoomies!",
  [MOODS.TYPING]: "Typing…",
  [MOODS.THINKING]: "Thinking…",
  [MOODS.CELEBRATING]: "Celebrating!",
};
