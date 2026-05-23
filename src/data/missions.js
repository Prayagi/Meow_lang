/**
 * Mission definitions for the Meow coding platform.
 * Each mission teaches a concept in the Meow language with progressive difficulty.
 */

export const missions = [
  // ── Variables (3 missions) ──────────────────────────────────────
  {
    id: "var-1",
    title: "Name Your Cat",
    description:
      "Every cat needs a name! Create a variable called `name` and set it to your cat's name, then print it.",
    category: "Variables",
    difficulty: 1,
    xpReward: 50,
    starterCode: 'meow name = "___"\npurr(name)',
    expectedOutput: [],
    hints: [
      'Replace ___ with any name you like, e.g. "Whiskers".',
      "meow creates a variable. purr() prints it!",
    ],
  },
  {
    id: "var-2",
    title: "Cat Math",
    description:
      "Cats love fish! Create two variables: `fish` set to 3 and `more_fish` set to 5. Print their sum.",
    category: "Variables",
    difficulty: 1,
    xpReward: 75,
    starterCode: "meow fish = 3\nmeow more_fish = 5\npurr(fish + more_fish)",
    expectedOutput: ["8"],
    hints: [
      "Use meow to declare each variable.",
      "The + operator adds numbers together.",
      "purr(fish + more_fish) prints the sum.",
    ],
  },
  {
    id: "var-3",
    title: "Swapping Treats",
    description:
      "You have two treat boxes. Swap their contents using a temporary variable!",
    category: "Variables",
    difficulty: 2,
    xpReward: 100,
    starterCode:
      'meow box_a = "tuna"\nmeow box_b = "salmon"\n~ Swap them here! ~\npurr(box_a)\npurr(box_b)',
    expectedOutput: ["salmon", "tuna"],
    hints: [
      "Create a temporary variable to hold one value while you swap.",
      "meow temp = box_a, then set box_a = box_b, then box_b = temp.",
    ],
  },

  // ── Output (3 missions) ────────────────────────────────────────
  {
    id: "out-1",
    title: "First Meow",
    description:
      'Your very first program! Use purr() to print "Meow!" to the screen.',
    category: "Output",
    difficulty: 1,
    xpReward: 25,
    starterCode: '~ Type your code below ~\npurr("Meow!")',
    expectedOutput: ["Meow!"],
    hints: [
      'purr("Meow!") will print the text Meow! to the output.',
      "Make sure to include the quotes around the text.",
    ],
  },
  {
    id: "out-2",
    title: "Cat Poem",
    description:
      "Print a 3-line cat poem. Each purr() call prints one line.",
    category: "Output",
    difficulty: 1,
    xpReward: 50,
    starterCode:
      'purr("Soft kitty,")\npurr("Warm kitty,")\npurr("Little ball of fur.")',
    expectedOutput: ["Soft kitty,", "Warm kitty,", "Little ball of fur."],
    hints: [
      "Each purr() prints one line of output.",
      "Make sure the text matches exactly, including punctuation.",
    ],
  },
  {
    id: "out-3",
    title: "String Cats-enation",
    description:
      'Combine two strings together using + and print the result. Make it say "MeowMix".',
    category: "Output",
    difficulty: 2,
    xpReward: 75,
    starterCode: 'meow part1 = "Meow"\nmeow part2 = "Mix"\npurr(part1 + part2)',
    expectedOutput: ["MeowMix"],
    hints: [
      "The + operator joins strings together.",
      'purr(part1 + part2) will print "MeowMix".',
    ],
  },

  // ── Conditions (3 missions) ────────────────────────────────────
  {
    id: "cond-1",
    title: "Hungry Cat?",
    description:
      'If the cat is hungry, print "Feed me!" — otherwise print "I\'m full."',
    category: "Conditions",
    difficulty: 2,
    xpReward: 100,
    starterCode:
      'meow hungry = true\n\nhiss (hungry) {\n  purr("Feed me!")\n} else {\n  purr("I\'m full.")\n}',
    expectedOutput: ["Feed me!"],
    hints: [
      "hiss is the if-statement in Meow.",
      "hiss (condition) { ... } else { ... }",
      "Since hungry is true, the first block runs.",
    ],
  },
  {
    id: "cond-2",
    title: "Cat Age Check",
    description:
      "Check if the cat is a kitten (age < 2), adult (2-9), or senior (10+). Print the right label.",
    category: "Conditions",
    difficulty: 3,
    xpReward: 150,
    starterCode:
      'meow age = 5\n\nhiss (age < 2) {\n  purr("Kitten")\n} else hiss (age < 10) {\n  purr("Adult")\n} else {\n  purr("Senior")\n}',
    expectedOutput: ["Adult"],
    hints: [
      "Use else hiss for chained conditions.",
      "Check the boundaries: < 2 for kitten, < 10 for adult, otherwise senior.",
    ],
  },
  {
    id: "cond-3",
    title: "Mood Ring",
    description:
      'A cat\'s mood depends on two things: fed and petted. If both are true print "Purring", if only fed print "Content", if only petted print "Playful", otherwise print "Grumpy".',
    category: "Conditions",
    difficulty: 3,
    xpReward: 175,
    starterCode:
      'meow fed = true\nmeow petted = false\n\nhiss (fed and petted) {\n  purr("Purring")\n} else hiss (fed) {\n  purr("Content")\n} else hiss (petted) {\n  purr("Playful")\n} else {\n  purr("Grumpy")\n}',
    expectedOutput: ["Content"],
    hints: [
      "Use 'and' to combine conditions.",
      "Order matters — check both first, then each individually, then the default.",
    ],
  },

  // ── Loops (3 missions) ─────────────────────────────────────────
  {
    id: "loop-1",
    title: "Nine Lives",
    description:
      "Use a loop to print the numbers 1 through 9 — one for each life!",
    category: "Loops",
    difficulty: 2,
    xpReward: 125,
    starterCode:
      "meow life = 1\nchase (life <= 9) {\n  purr(life)\n  life = life + 1\n}",
    expectedOutput: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    hints: [
      "chase is the while-loop in Meow.",
      "Don't forget to increment the variable or you'll loop forever!",
    ],
  },
  {
    id: "loop-2",
    title: "Catnip Countdown",
    description:
      'Count down from 5 to 1, then print "Pounce!"',
    category: "Loops",
    difficulty: 2,
    xpReward: 125,
    starterCode:
      'meow n = 5\nchase (n >= 1) {\n  purr(n)\n  n = n - 1\n}\npurr("Pounce!")',
    expectedOutput: ["5", "4", "3", "2", "1", "Pounce!"],
    hints: [
      "Start at 5 and subtract 1 each loop.",
      "The purr after the loop prints after all iterations finish.",
    ],
  },
  {
    id: "loop-3",
    title: "Fishy Multiplication",
    description:
      "Print the 3-times table from 3×1 to 3×5.",
    category: "Loops",
    difficulty: 3,
    xpReward: 175,
    starterCode:
      "meow i = 1\nchase (i <= 5) {\n  purr(3 * i)\n  i = i + 1\n}",
    expectedOutput: ["3", "6", "9", "12", "15"],
    hints: [
      "Multiply 3 * i on each iteration.",
      "Loop from 1 to 5 inclusive.",
    ],
  },

  // ── Functions (3 missions) ─────────────────────────────────────
  {
    id: "func-1",
    title: "Cat Call",
    description:
      'Create a function called greet that prints "Hello, I am a cat!". Then call it.',
    category: "Functions",
    difficulty: 3,
    xpReward: 150,
    starterCode:
      'scratch greet() {\n  purr("Hello, I am a cat!")\n}\n\ngreet()',
    expectedOutput: ["Hello, I am a cat!"],
    hints: [
      "scratch defines a function in Meow.",
      "Call the function by writing its name followed by ().",
    ],
  },
  {
    id: "func-2",
    title: "Treat Calculator",
    description:
      "Write a function that takes a number of cats and returns treats needed (3 per cat). Print the result for 4 cats.",
    category: "Functions",
    difficulty: 4,
    xpReward: 200,
    starterCode:
      "scratch treats(cats) {\n  bring cats * 3\n}\n\npurr(treats(4))",
    expectedOutput: ["12"],
    hints: [
      "'bring' is the return keyword in Meow.",
      "The function multiplies cats by 3.",
    ],
  },
  {
    id: "func-3",
    title: "Recursive Yarn Ball",
    description:
      "Write a recursive function to compute the factorial of 5 (5! = 120).",
    category: "Functions",
    difficulty: 5,
    xpReward: 300,
    starterCode:
      "scratch factorial(n) {\n  hiss (n <= 1) {\n    bring 1\n  }\n  bring n * factorial(n - 1)\n}\n\npurr(factorial(5))",
    expectedOutput: ["120"],
    hints: [
      "A recursive function calls itself with a smaller input.",
      "The base case is when n <= 1, return 1.",
      "Otherwise return n * factorial(n - 1).",
    ],
  },
];

/** Lookup a mission by its id */
export function getMissionById(id) {
  return missions.find((m) => m.id === id) ?? null;
}

/** Get all missions for a given category */
export function getMissionsByCategory(category) {
  return missions.filter((m) => m.category === category);
}

/** Ordered list of unique categories */
export const missionCategories = [
  "Variables",
  "Output",
  "Conditions",
  "Loops",
  "Functions",
];
