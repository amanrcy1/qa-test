// simple test runner — tracks pass/fail and exits with code 1 on failure

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

// call at end of test suite to print results and set exit code
function summary() {
  console.log('\n' + '='.repeat(40));
  console.log(`📊 Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log('='.repeat(40) + '\n');
  if (failed > 0) process.exit(1);
}

module.exports = { assert, summary };
