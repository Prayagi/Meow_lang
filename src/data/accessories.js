/**
 * Cat accessory definitions for the Meow coding platform.
 * Accessories are unlocked at specific levels and equippable per slot.
 */

export const accessories = [
  // ── Hats ───────────────────────────────────────────────────────
  { id: "hat-beanie",       name: "Beanie",            type: "hat",     emoji: "🧶", requiredLevel: 1  },
  { id: "hat-tophat",       name: "Top Hat",           type: "hat",     emoji: "🎩", requiredLevel: 3  },
  { id: "hat-crown",        name: "Royal Crown",       type: "hat",     emoji: "👑", requiredLevel: 7  },
  { id: "hat-wizard",       name: "Wizard Hat",        type: "hat",     emoji: "🧙", requiredLevel: 10 },
  { id: "hat-party",        name: "Party Hat",         type: "hat",     emoji: "🥳", requiredLevel: 2  },

  // ── Glasses ────────────────────────────────────────────────────
  { id: "glasses-nerdy",    name: "Nerdy Glasses",     type: "glasses", emoji: "🤓", requiredLevel: 1  },
  { id: "glasses-sun",      name: "Sunglasses",        type: "glasses", emoji: "😎", requiredLevel: 2  },
  { id: "glasses-heart",    name: "Heart Shades",      type: "glasses", emoji: "💕", requiredLevel: 4  },
  { id: "glasses-monocle",  name: "Monocle",           type: "glasses", emoji: "🧐", requiredLevel: 6  },
  { id: "glasses-star",     name: "Star Glasses",      type: "glasses", emoji: "🌟", requiredLevel: 8  },

  // ── Bowties ────────────────────────────────────────────────────
  { id: "bowtie-red",       name: "Red Bowtie",        type: "bowtie",  emoji: "🎀", requiredLevel: 1  },
  { id: "bowtie-polka",     name: "Polka-Dot Bowtie",  type: "bowtie",  emoji: "🔴", requiredLevel: 3  },
  { id: "bowtie-gold",      name: "Gold Bowtie",       type: "bowtie",  emoji: "🏅", requiredLevel: 6  },
  { id: "bowtie-rainbow",   name: "Rainbow Bowtie",    type: "bowtie",  emoji: "🌈", requiredLevel: 9  },

  // ── Collars ────────────────────────────────────────────────────
  { id: "collar-bell",      name: "Bell Collar",       type: "collar",  emoji: "🔔", requiredLevel: 1  },
  { id: "collar-studded",   name: "Studded Collar",    type: "collar",  emoji: "⛓️", requiredLevel: 4  },
  { id: "collar-diamond",   name: "Diamond Collar",    type: "collar",  emoji: "💎", requiredLevel: 8  },
  { id: "collar-flower",    name: "Flower Collar",     type: "collar",  emoji: "🌸", requiredLevel: 2  },

  // ── Capes ──────────────────────────────────────────────────────
  { id: "cape-hero",        name: "Hero Cape",         type: "cape",    emoji: "🦸", requiredLevel: 5  },
  { id: "cape-wizard",      name: "Wizard Cloak",      type: "cape",    emoji: "🌌", requiredLevel: 7  },
  { id: "cape-royal",       name: "Royal Mantle",      type: "cape",    emoji: "👘", requiredLevel: 10 },
  { id: "cape-invisible",   name: "Invisible Cape",    type: "cape",    emoji: "👻", requiredLevel: 12 },
];

/** All valid accessory slot types */
export const accessoryTypes = ["hat", "glasses", "bowtie", "collar", "cape"];

/** Get accessories available at a given level */
export function getAccessoriesForLevel(level) {
  return accessories.filter((a) => a.requiredLevel <= level);
}

/** Get accessories of a specific type */
export function getAccessoriesByType(type) {
  return accessories.filter((a) => a.type === type);
}

/** Lookup an accessory by id */
export function getAccessoryById(id) {
  return accessories.find((a) => a.id === id) ?? null;
}
