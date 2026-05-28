import { runMeowCode } from 'file:///c:/Users/Lenovo/OneDrive/Documents/meowsie/src/engine/meowRunner.js';

const tests = [
  {
    name: "First Meow (Print)",
    code: `paw {
      purr("Meow!")
    }`,
    expectedSuccess: true,
    expectedOutput: ["Meow!"]
  },
  {
    name: "Var Declaration & Print",
    code: `paw {
      meow name = "Whiskers"
      purr(name)
    }`,
    expectedSuccess: true,
    expectedOutput: ["Whiskers"]
  },
  {
    name: "If-Else Block (fur / hairball)",
    code: `paw {
      meow hungry = fur
      hiss (hungry) {
        purr("Feed me!")
      } else {
        purr("I'm full.")
      }
    }`,
    expectedSuccess: true,
    expectedOutput: ["Feed me!"]
  },
  {
    name: "Chained If-Else (mew hiss)",
    code: `paw {
      meow age = 5
      hiss (age < 2) {
        purr("Kitten")
      } else hiss (age < 10) {
        purr("Adult")
      } else {
        purr("Senior")
      }
    }`,
    expectedSuccess: true,
    expectedOutput: ["Adult"]
  },
  {
    name: "While Loop (chase)",
    code: `paw {
      meow life = 1
      chase (life <= 3) {
        purr(life)
        life = life + 1
      }
    }`,
    expectedSuccess: true,
    expectedOutput: ["1", "2", "3"]
  },
  {
    name: "Function Definition & Call (scratch/bring)",
    code: `paw {
      scratch add(x, y) {
        bring x + y
      }
      purr(add(5, 3))
    }`,
    expectedSuccess: true,
    expectedOutput: ["8"]
  },
  {
    name: "Fallback Compatibility (meowmeow/pounce)",
    code: `paw {
      meowmeow legacyVar = "Legacy Value"
      pounce oldFunc(a) {
        bring a
      }
      purr(oldFunc(legacyVar))
    }`,
    expectedSuccess: true,
    expectedOutput: ["Legacy Value"]
  }
];

let failed = 0;
for (const t of tests) {
  const result = runMeowCode(t.code);
  let testPassed = true;

  if (result.success !== t.expectedSuccess) {
    console.error(`❌ Test failed: ${t.name}. Expected success ${t.expectedSuccess}, got ${result.success}`);
    if (result.errors.length > 0) {
      console.error("Errors:", JSON.stringify(result.errors, null, 2));
    }
    testPassed = false;
  } else if (result.success) {
    const outMatch = JSON.stringify(result.output) === JSON.stringify(t.expectedOutput);
    if (!outMatch) {
      console.error(`❌ Test failed: ${t.name}. Output mismatch. Expected:`, t.expectedOutput, "Got:", result.output);
      testPassed = false;
    }
  }

  if (testPassed) {
    console.log(`✅ Test passed: ${t.name}`);
  } else {
    failed++;
  }
}

if (failed === 0) {
  console.log("\n🎉 All local engine tests passed successfully!");
  process.exit(0);
} else {
  console.error(`\n❌ ${failed} test(s) failed.`);
  process.exit(1);
}
