# 🐱 Meowsie — Learn to Code with Your Cat Companion

Learn programming through an interactive, gamified experience with **Meow**, a custom language designed for beginners. Train your digital cat companion while mastering coding fundamentals.

## Features

- **Meow Language** — A simple, cat-themed programming language for learning variables, loops, functions, and logic
- **Interactive Playground** — Write and run code instantly with live output
- **Pet Companion System** — Raise and care for your cat as you progress through missions
- **Gamification** — Earn XP, unlock achievements, and level up your coding skills
- **Progressive Missions** — Start simple, tackle increasingly complex challenges

## Quick Start

### Prerequisites
- Node.js 18+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Setup

1. Clone the repository:
```bash
git clone <repo-url>
cd meowsie
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` and add your Groq API key:
```
GROQ_API_KEY=gsk_your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 📚 The Meow Language Guide

### Program Structure

Every Meow program must start with `paw { }`:

```meow
paw {
  ~ Your code goes here ~
}
```

---

### Keywords & Usage

| Keyword | What It Does | Example |
|---------|-------------|---------|
| **purr()** | Print output to screen | `purr("Hello!")` |
| **meow** | Declare a variable | `meow name = "Whiskers"` |
| **hiss** | If statement (condition) | `hiss (x > 5) { ... }` |
| **mew** | Else clause | `} mew { ... }` |
| **chase** | While loop | `chase (i <= 10) { ... }` |
| **scratch** | Function definition | `scratch greet() { ... }` |
| **bring** | Return a value | `bring x + 5` |
| **fur** | Boolean true | `meow isHappy = fur` |
| **hairball** | Boolean false | `meow isAngry = hairball` |
| **catnip** | Null/empty value | `meow treat = catnip` |

---

### Variables

**Declare & initialize:**
```meow
meow name = "Whiskers"
meow age = 5
meow score = 0.5
meow isHappy = fur
```

**Update a variable:**
```meow
meow x = 10
x = x + 5      ~ Now x is 15 ~
x = x - 2      ~ Now x is 13 ~
```

---

### Output (Printing)

**Print a single value:**
```meow
purr("Hello, World!")
purr(42)
purr(3.14)
```

**Print multiple lines:**
```meow
purr("Line 1")
purr("Line 2")
purr("Line 3")
```

**Print variables & expressions:**
```meow
meow name = "Fluffy"
purr(name)              ~ Prints: Fluffy ~
purr(5 + 3)             ~ Prints: 8 ~
```

**String concatenation (joining):**
```meow
meow first = "Hello"
meow second = "World"
purr(first + " " + second)    ~ Prints: Hello World ~
```

---

### Arithmetic Operations

```meow
meow a = 10
meow b = 3

purr(a + b)       ~ 13 (addition) ~
purr(a - b)       ~ 7 (subtraction) ~
purr(a * b)       ~ 30 (multiplication) ~
purr(a / b)       ~ 3 (division) ~
purr(a % b)       ~ 1 (modulo/remainder) ~
```

---

### Conditions (If/Else)

**Simple if:**
```meow
meow age = 5
hiss (age < 10) {
  purr("Kitten!")
}
```

**If with else:**
```meow
meow score = 50
hiss (score >= 60) {
  purr("Pass!")
} mew {
  purr("Fail!")
}
```

**Chained conditions:**
```meow
meow temp = 25
hiss (temp < 0) {
  purr("Freezing!")
} mew hiss (temp < 15) {
  purr("Cold!")
} mew hiss (temp < 25) {
  purr("Cool!")
} mew {
  purr("Warm!")
}
```

**Comparison operators:**
```meow
x == y           ~ Equal ~
x != y           ~ Not equal ~
x < y            ~ Less than ~
x > y            ~ Greater than ~
x <= y           ~ Less than or equal ~
x >= y           ~ Greater than or equal ~
```

**Logical operators:**
```meow
x and y          ~ Both true ~
x or y           ~ At least one true ~
!x               ~ Not x ~

~ Example: ~
hiss (age >= 18 and hasLicense) {
  purr("Can drive!")
}
```

---

### Loops (Repetition)

**While loop (repeat while condition is true):**
```meow
meow i = 1
chase (i <= 5) {
  purr(i)
  i = i + 1
}
~ Prints: 1, 2, 3, 4, 5 ~
```

**Countdown:**
```meow
meow n = 5
chase (n >= 1) {
  purr(n)
  n = n - 1
}
purr("Blastoff!")
```

**Multiplication table:**
```meow
meow multiplier = 3
meow i = 1
chase (i <= 10) {
  purr(multiplier * i)
  i = i + 1
}
~ Prints: 3, 6, 9, 12, ... 30 ~
```

---

### Functions

**Define a function (no parameters):**
```meow
scratch greet() {
  purr("Hello, I'm a cat!")
}

greet()    ~ Call the function ~
```

**Function with parameters:**
```meow
scratch add(x, y) {
  bring x + y
}

purr(add(5, 3))    ~ Prints: 8 ~
```

**Function that returns a value:**
```meow
scratch multiply(a, b) {
  bring a * b
}

meow result = multiply(4, 5)
purr(result)       ~ Prints: 20 ~
```

**Recursive function (function that calls itself):**
```meow
scratch factorial(n) {
  hiss (n <= 1) {
    bring 1
  }
  bring n * factorial(n - 1)
}

purr(factorial(5))    ~ Prints: 120 ~
```

---

### Complete Examples

**Example 1: Cat Stats**
```meow
meow catName = "Whiskers"
meow catAge = 3
meow happiness = 9

purr(catName)
purr(catAge)
purr(happiness)
```

**Example 2: Treat Calculator**
```meow
scratch counTreats(numCats) {
  bring numCats * 3
}

meow treats = counTreats(4)
purr(treats)    ~ Prints: 12 ~
```

**Example 3: Happy or Sad**
```meow
meow fed = fur
meow petted = hairball

hiss (fed and petted) {
  purr("Purring!")
} mew hiss (fed) {
  purr("Content!")
} mew {
  purr("Grumpy!")
}
```

**Example 4: Countdown**
```meow
meow countdown = 5
chase (countdown >= 1) {
  purr(countdown)
  countdown = countdown - 1
}
purr("Pounce!")
```

---

## Stack

- **Frontend:** Next.js 16, React 19, Framer Motion
- **State Management:** Zustand
- **Editor:** CodeMirror
- **Styling:** Catppuccin color scheme

## Pages

- **Dashboard** — Track progress and pet stats
- **Playground** — Write and run Meow code instantly in the browser
- **Missions** — Complete coding challenges
- **Shop** — Customize your cat companion

## Contributing

Found a bug or have a feature idea? Open an issue or submit a pull request!

## License

MIT License — Feel free to use this project as you like.

---

**Start your coding journey. Adopt a digital cat. Master programming.** 🐾


