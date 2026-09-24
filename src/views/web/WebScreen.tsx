import type { ExamTask } from "../../content/exams";
import { WEB_EXAM_KEY, WEB_FLASHCARDS, WEB_LESSON_BY_ID, WEB_LESSONS, WEB_REGIONS } from "../../content/web";
import { useProgress } from "../../state/progress";
import { navigate, type Route } from "../../state/route";
import { webCurrent, webLessonUnlocked, webRegionDone } from "../../state/webPath";
import { CardsView } from "../CardsView";
import { ExamView, type ExamConfig } from "../ExamView";
import { WebLessonView } from "./WebLessonView";
import { WebMapView } from "./WebMapView";

/** Экзамен региона «Браузера»: вопросы с вариантами из его уроков. */
const webExam = (region: number): ExamConfig => ({
  name: WEB_REGIONS[region]!.name,
  regionNo: region + 1,
  pool: WEB_LESSONS.filter((l) => l.region === region).flatMap((l) => l.tasks.flatMap((t): ExamTask[] => (t.type === "quiz" ? [t] : []))),
  examKey: WEB_EXAM_KEY(region),
  fromLessons: true,
  back: { view: "web" },
  cards: { view: "web-cards" },
});

const webCards = { cards: WEB_FLASHCARDS, regionNames: WEB_REGIONS.map((r) => r.name) };

function WebLocked({ what }: { what: string }) {
  const { progress } = useProgress();
  const now = webCurrent(progress);
  return (
    <section className="intro locked">
      <p className="crumb">Пока закрыто</p>
      <h1>{what}</h1>
      <p>Темы открываются по порядку: каждая опирается на предыдущие.{now ? ` Сейчас на очереди «${now.title}».` : ""}</p>
      <div className="actions">
        {now && <button type="button" className="btn" onClick={() => navigate({ view: "web-lesson", id: now.id })}>Перейти к «{now.title}»</button>}
        <button type="button" className="btn ghost" onClick={() => navigate({ view: "web" })}>К карте</button>
      </div>
    </section>
  );
}

export function WebScreen({ route }: { route: Route }) {
  const { progress } = useProgress();
  if (route.view === "web-lesson") {
    const lesson = WEB_LESSON_BY_ID[route.id];
    if (lesson) return webLessonUnlocked(progress, lesson) ? <WebLessonView key={lesson.id} lesson={lesson} /> : <WebLocked what={lesson.title} />;
  }
  if (route.view === "web-exam" && WEB_REGIONS[route.region]?.kind === "lessons") {
    return webRegionDone(progress, route.region)
      ? <ExamView key={route.region} cfg={webExam(route.region)} />
      : <WebLocked what={`Экзамен «${WEB_REGIONS[route.region]!.name}»`} />;
  }
  if (route.view === "web-cards") return <CardsView {...webCards} />;
  return <WebMapView />;
}
