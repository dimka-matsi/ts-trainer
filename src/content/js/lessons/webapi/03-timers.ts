import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "wa3",
  region: 7,
  level: "junior",
  title: "Таймеры и requestAnimationFrame",
  q: "Чем `setInterval` отличается от рекурсивного `setTimeout`? Зачем нужен `requestAnimationFrame`?",
  answer:
    "`setInterval` ставит колбэк каждые N миллисекунд, не глядя, закончился ли предыдущий, поэтому долгий колбэк сокращает паузы, а пропущенные тики не копятся. Рекурсивный `setTimeout` планирует следующий запуск после окончания текущего и гарантирует паузу между ними. `requestAnimationFrame` вызывает функцию прямо перед следующей отрисовкой кадра — с частотой экрана, в фоновой вкладке он ставится на паузу. Поэтому анимации пишут на нём, а не на таймерах.",
  theory: {
    p: [
      "`setTimeout` и `setInterval` возвращают идентификатор, по которому таймер отменяют: `clearTimeout(id)`, `clearInterval(id)`. Отменённый колбэк не выполнится, даже если время уже вышло и он стоит в очереди. Незакрытый `setInterval` в компоненте — частая утечка: он работает и держит замыкание, пока страница открыта.",
      "`setInterval(fn, 100)` запускает `fn` каждые 100 мс по часам. Если `fn` работает 80 мс, пауза между запусками всего 20 мс, а если дольше интервала — запуски идут вплотную. Рекурсивный `setTimeout` — `function tick() { работа(); setTimeout(tick, 100); }` — отсчитывает паузу от конца работы и позволяет менять задержку на лету, например увеличивать её при ошибках.",
      "Задержка у таймеров минимальная, а не точная. Во вложенных таймерах браузер поднимает её до 4 мс, а в фоновых вкладках — до секунды и больше, чтобы экономить батарею. Для анимации таймеры плохи: они не совпадают с моментом отрисовки, и кадры дёргаются.",
      "`requestAnimationFrame(callback)` вызывает колбэк один раз перед следующей отрисовкой и передаёт время кадра. Для анимации его вызывают снова внутри колбэка. Частота совпадает с экраном (60, 120 Гц), в фоновой вкладке вызовы останавливаются. Отмена — `cancelAnimationFrame(id)`. Для необязательной работы, когда браузер свободен, есть `requestIdleCallback`.",
    ],
    code: `let n = 0;
const id = setInterval(() => {
  n++;
  console.log("тик", n);
  if (n === 3) clearInterval(id);   // не забываем остановить
}, 10);

const skipped = setTimeout(() => console.log("не выполнится"), 0);
clearTimeout(skipped);

let left = 3;
function poll() {                   // рекурсивный setTimeout
  console.log("опрос, осталось", left);
  if (--left > 0) setTimeout(poll, 15); // пауза считается от конца работы
}
poll();`,
    keys: [
      "Таймеры отменяют по id: `clearTimeout`, `clearInterval`. Забытый `setInterval` — утечка.",
      "`setInterval` не ждёт конца колбэка, рекурсивный `setTimeout` гарантирует паузу после работы.",
      "`requestAnimationFrame` — перед каждой отрисовкой, с частотой экрана, на паузе в фоне. Для анимаций — он, а не таймеры.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `let n = 0;
const id = setInterval(() => {
  n++;
  console.log("тик", n);
  if (n === 3) clearInterval(id);
}, 10);
setTimeout(() => console.log("таймер 5 мс"), 5);`,
      opts: ["таймер 5 мс\nтик 1\nтик 2\nтик 3", "тик 1\nтаймер 5 мс\nтик 2\nтик 3", "тик 1\nтик 2\nтик 3\nтаймер 5 мс", "таймер 5 мс\nтик 1"],
      a: 0,
      why: "Первый тик интервала — через 10 мс, одиночный таймер — через 5 мс. Интервал сам останавливается на третьем тике.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const id = setTimeout(() => console.log("отменён"), 0);
setTimeout(() => console.log("A"), 0);
clearTimeout(id);
console.log("B");`,
      opts: ["B\nA", "B\nотменён\nA", "отменён\nA\nB", "A\nB"],
      a: 0,
      why: "`clearTimeout` вызван до того, как таймер успел сработать, и колбэк не выполнится никогда.",
    },
    {
      type: "quiz",
      q: "Почему анимацию делают на `requestAnimationFrame`, а не на `setInterval(fn, 16)`?",
      opts: [
        "rAF вызывается ровно перед отрисовкой с частотой экрана и засыпает в фоне, а таймер не совпадает с кадрами",
        "`setInterval` не может работать чаще раза в секунду",
        "rAF выполняется в отдельном потоке",
        "`setInterval` нельзя остановить",
      ],
      a: 0,
      why: "Таймер может сработать между кадрами или дважды за кадр — отсюда рывки. Экран на 120 Гц таймер на 16 мс тоже не учтёт.",
    },
    {
      type: "run",
      goal: "Напиши `countdown(n, ms, onTick)`: вызывает `onTick(n)`, `onTick(n - 1)`, …, `onTick(1)`. Первый вызов — сразу, дальше с паузой `ms` между вызовами. Возвращает промис, который выполняется после последнего вызова.",
      code: `function countdown(n, ms, onTick) {
  for (let i = n; i > 0; i--) onTick(i);
}`,
      tests: [
        ["(async () => { const log = []; await countdown(3, 5, (x) => log.push(x)); return log; })()", "[3,2,1]"],
        ["(async () => { const log = []; const p = countdown(2, 30, (x) => log.push(x)); const early = log.length; await p; return [early, log.length]; })()", "[1,2]"],
        ["(async () => { const t = Date.now(); await countdown(3, 20, () => {}); return Date.now() - t >= 35; })()", "true"],
      ],
      solution: `function countdown(n, ms, onTick) {
  return new Promise((resolve) => {
    function step(i) {
      onTick(i);
      if (i <= 1) return resolve();
      setTimeout(() => step(i - 1), ms);
    }
    step(n);
  });
}`,
      hint: "Оберни всё в `new Promise`. Внутри — функция `step(i)`: вызывает `onTick(i)`, и если `i` больше 1, планирует `step(i - 1)` через `setTimeout`, а иначе вызывает `resolve()`.",
    },
  ],
};
