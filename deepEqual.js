const assert = require("assert");

function deepEqual(actual, expected, path = "$") {
  try {
    // Проверка совпадения типов с использованием assert
    if (typeof actual !== typeof expected) {
      assert.fail(`${path}: Типы не совпадают!`);
    }

    if (actual === null && expected === null) {
      return true;
    }

    // Отдельная обработка null значений
    if (actual === null || expected === null) {
      assert.fail(`${path}: Один из типов null`);
    }
    // Обработка объектов (включая массивы)
    if (typeof actual === "object") {
      // Получаем ключи собственных свойств
      const actualKeys = Object.keys(actual);
      const expectedKeys = Object.keys(expected);

      // assert.deepStrictEqual рекурсивно сравнивает массивы
      // и выводит подробную информацию при несоответствии
      assert.deepStrictEqual(
        actualKeys,
        expectedKeys,
        `${path}: Значения не совпадают!`
      );

      // Рекурсивно сравниваем значения каждого свойства
      for (const key of actualKeys) {
        deepEqual(actual[key], expected[key], `${path}.${key}`);
      }
      return true;
    }

    // Для примитивных значений используем строгое сравнение assert
    assert.strictEqual(actual, expected, `${path}: Значения не совпадают!`);
  } catch (error) {
    // Оборачиваем ошибку assert в Error с пользовательским сообщением
    throw new Error(error.message);
  }
}

module.exports = deepEqual;
