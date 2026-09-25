import { useEffect, useState } from "react";
import { FLASHCARDS, LEVEL_NAME, type Flashcard } from "../content/flashcards";
import { REGIONS } from "../content/regions";
import { lessonDone, PATH, regionDone } from "../state/path";
import { useProgress, type Progress } from "../state/progress";
import { shuffle } from "../state/random";
import { navigate, type Route } from "../state/route";
import { CodeBlock, Md } from "../ui/Code";

/** Откуда брать вопросы и куда возвращаться: у каждого направления своё. */
export interface InterviewConfig {
  poolFor(p: Progress): Flashcard[];
  regionNames: string[];
  map: Route;
  cards: Route;
}

const QUESTIONS = 5;
const SECONDS = 60;

type Grade = "full" | "part" | "none";
const GRADE_TEXT: Record<Grade, string> = { full: "Ответил", part: "Частично", none: "Не ответил" };

/** TypeScript: вопросы только по пройденному — карточки пройденных регионов и уроков. */
function tsPoolFor(p: Progress): Flashcard[] {
  const doneLessons = new Set(PATH.flatMap((s) => (s.kind === "lesson" && lessonDone(p, s.lesson) ? [s.lesson.id] : [])));
  return FLASHCARDS.filter((c) => {
    if (c.id.startsWith("lesson-")) return doneLessons.has(c.id.slice("lesson-".length));
    return regionDone(p, c.region);
  });
}

/** Пробное собеседование: случайные вопросы из пройденного, минута на ответ вслух, самооценка. */
export const tsInterview: InterviewConfig = {
  poolFor: tsPoolFor,
  regionNames: REGIONS.map((r) => r.name),
  map: { view: "map" },
  cards: { view: "cards" },
};

export function InterviewView({ cfg }: { cfg: InterviewConfig }) {
  const { progress, reviewCard } = useProgress();
  const pool = cfg.poolFor(progress);
  const [questions, setQuestions] = useState<Flashcard[] | null>(null);
  const [index, setIndex] = useState(0);
  const [grades, setGrades] = useState<Grade[]>([]);

  const start = () => { setQuestions(shuffle(pool).slice(0, QUESTIONS)); setIndex(0); setGrades([]); };

  if (!questions) {
    return (
      <section className="intro interview">
        <p className="eyebrow">// пробное собеседование</p>
        <h1>Собеседование</h1>
        <p>{QUESTIONS} случайных вопросов по пройденным темам. На каждый — минута, чтобы ответить вслух, как на настоящем интервью. Потом сравни с образцом и честно оцени себя: вопросы с ошибками вернутся в колоду карточек на сегодня.</p>
        {pool.length >= QUESTIONS ? (
          <>
            <p className="how">Сейчас в пуле {pool.length} вопросов. С каждой пройденной темой их становится больше.</p>
            <div className="actions"><button type="button" className="btn" onClick={start}>Начать</button></div>
          </>
        ) : (
          <>
            <p className="how">Вопросы берутся только из пройденного, а сейчас их {pool.length}. Пройди ещё несколько уроков, и режим откроется.</p>
            <div className="actions"><button type="button" className="btn ghost" onClick={() => navigate(cfg.map)}>К карте</button></div>
          </>
        )}
      </section>
    );
  }

  if (index >= questions.length) {
    const full = grades.filter((g) => g === "full").length;
    return (
      <section className="intro interview">
        <p className="eyebrow">// пробное собеседование</p>
        <h1>Итог: {full} из {questions.length}</h1>
        <ul className="iv-sum">
          {questions.map((q, i) => (
            <li key={q.id}><span className={`iv-grade g-${grades[i]}`}>{GRADE_TEXT[grades[i]!]}</span><Md text={q.q} /></li>
          ))}
        </ul>
        <p className="how">Вопросы с оценкой «Частично» и «Не ответил» добавлены в колоду карточек на сегодня.</p>
        <div className="actions">
          <button type="button" className="btn" onClick={start}>Ещё раз</button>
          <button type="button" className="btn ghost" onClick={() => navigate(cfg.cards)}>К карточкам</button>
        </div>
      </section>
    );
  }

  const grade = (g: Grade) => {
    const q = questions[index]!;
    reviewCard(q.id, g === "full");
    setGrades([...grades, g]);
    setIndex(index + 1);
  };

  return <Question key={index} card={questions[index]!} n={index + 1} total={questions.length} regionName={cfg.regionNames[questions[index]!.region] ?? ""} onGrade={grade} />;
}

function Question({ card, n, total, regionName, onGrade }: { card: Flashcard; n: number; total: number; regionName: string; onGrade(g: Grade): void }) {
  const [left, setLeft] = useState(SECONDS);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) return;
    if (left <= 0) { setOpen(true); return; }
    const t = window.setTimeout(() => setLeft(left - 1), 1000);
    return () => window.clearTimeout(t);
  }, [left, open]);

  return (
    <section className="intro interview">
      <p className="crumb">Вопрос {n} из {total} · {regionName} · {LEVEL_NAME[card.level]}</p>
      <div className="iv-timer" aria-label={`Осталось ${left} секунд`}>
        <i style={{ width: `${(left / SECONDS) * 100}%` }} />
        <span>{!open ? `${left} с` : left > 0 ? `Ответ за ${SECONDS - left} с` : "Время ответа вышло"}</span>
      </div>
      <article className={`fc${open ? " open" : ""}`}>
        <p className="fc-q"><Md text={card.q} /></p>
        {!open ? (
          <div className="actions">
            <button type="button" className="btn" onClick={() => setOpen(true)}>Я ответил, показать образец</button>
            <span className="note">Отвечай вслух: определение, пример, подвох.</span>
          </div>
        ) : (
          <div className="fc-a">
            <p><Md text={card.a} /></p>
            {card.code && <CodeBlock code={card.code} />}
            <p className="muted">Насколько твой ответ совпал с образцом?</p>
            <div className="actions">
              <button type="button" className="btn ghost" onClick={() => onGrade("none")}>Не ответил</button>
              <button type="button" className="btn ghost" onClick={() => onGrade("part")}>Частично</button>
              <button type="button" className="btn" onClick={() => onGrade("full")}>Ответил</button>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}

