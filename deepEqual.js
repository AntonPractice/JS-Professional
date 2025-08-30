const assert = require("assert");

function deepEqual(actual, expected, path = "$") {
  try {
    if (typeof actual !== typeof expected) {
      assert.fail(`${path}: Типы не совпадают!`);
    }

    if (actual === null && expected === null) {
      return true;
    }

    if (actual === null || expected === null) {
      assert.fail(`${path}: Один из типов null`);
    }

    if (typeof actual === "object") {
      const actualKeys = Object.keys(actual);
      const expectedKeys = Object.keys(expected);

      assert.deepStrictEqual(
        actualKeys,
        expectedKeys,
        `${path}: Значения не совпадают!`
      );

      for (const key of actualKeys) {
        deepEqual(actual[key], expected[key], `${path}.${key}`);
      }
      return true;
    }
    assert.strictEqual(actual, expected, `${path}: Значения не совпадают!`);
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = deepEqual;
