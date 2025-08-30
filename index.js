const deepEqual = require("./deepEqual");

function testDeepEqual(actual, expected) {
  try {
    deepEqual(actual, expected);
    console.log("OK"); // Успешное сравнение
  } catch (error) {
    console.log("Error:", error.message); // Вывод пути к несовпадающему свойству
  } finally {
    console.log("______________");
  }
}

const obj1 = {
  a: {
    b: 1,
  },
};

const obj2 = {
  a: {
    b: 2,
  },
};

const obj3 = {
  a: {
    b: 1,
  },
};

testDeepEqual(obj1, obj1);
// OK

testDeepEqual(obj1, obj2);
// Error: a.b

testDeepEqual(obj1, obj3);
// OK
