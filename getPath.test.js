/**
 * @jest-environment jsdom
 */
const getPath = require("./getPath");

describe("getPath", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="wrapper">
        <ul id="list">
          <li class="item">Тест_1</li>
          <li class="item">Тест2</li>
          <li class="item special">Тест3</li>
        </ul>
      </div>
    `;
  });

  test("если есть id, возвращает #id", () => {
    const el = document.getElementById("list");
    expect(getPath(el)).toBe("#list");
  });

  test("если есть классы, добавляет их", () => {
    const el = document.querySelector("li.special");
    const selector = getPath(el);
    expect(document.querySelector(selector)).toBe(el);
  });

  test("для первого элемента добавляет nth-child", () => {
    const el = document.querySelector("li:first-child");
    const selector = getPath(el);
    expect(document.querySelector(selector)).toBe(el);
  });

  test("селектор должен быть уникальным", () => {
    const el = document.querySelector("li:nth-child(2)");
    const selector = getPath(el);
    const found = document.querySelectorAll(selector);
    expect(found.length).toBe(1);
    expect(found[0]).toBe(el);
  });
});
