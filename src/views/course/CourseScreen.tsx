import type { Course } from "../../content/course/types";
import type { ExamTask } from "../../content/exams";
import { useProgress } from "../../state/progress";
import { navigate, type Route } from "../../state/route";
import { courseCurrent, courseInterviewPool, courseLessonUnlocked, courseRegionDone } from "../../state/coursePath";
import { CardsView } from "../CardsView";
import { ExamView, type ExamConfig } from "../ExamView";
import { InterviewView } from "../InterviewView";
import { CourseProgressView } from "./CourseProgressView";
import { PerfMapView } from "./PerfMapView";
import { ReactMapView } from "./ReactMapView";
import { SecMapView } from "./SecMapView";
import { CourseLessonView } from "./CourseLessonView";
import { WebMapView } from "./WebMapView";

/** Экзамен региона курса: вопросы с вариантами из его уроков. */
const courseExam = (course: Course, region: number): ExamConfig => ({
  name: course.regions[region]!.name,
  regionNo: region + 1,
  pool: course.lessons.filter((l) => l.region === region).flatMap((l) => l.tasks.flatMap((t): ExamTask[] => (t.type === "quiz" ? [t] : []))),
  examKey: course.examBase + region,
  source: "Вопросы берутся из упражнений уроков этого региона",
  back: { view: "course", course: course.id },
  cards: { view: "course-cards", course: course.id },
});

function CourseLocked({ course, what }: { course: Course; what: string }) {
  const { progress } = useProgress();
  const now = courseCurrent(course, progress);
  return (
    <section className="intro locked">
      <p className="crumb">Пока закрыто</p>
      <h1>{what}</h1>
      <p>Темы открываются по порядку: каждая опирается на предыдущие.{now ? ` Сейчас на очереди «${now.title}».` : ""}</p>
      <div className="actions">
        {now && <button type="button" className="btn" onClick={() => navigate({ view: "course-lesson", course: course.id, id: now.id })}>Перейти к «{now.title}»</button>}
        <button type="button" className="btn ghost" onClick={() => navigate({ view: "course", course: course.id })}>К карте</button>
      </div>
    </section>
  );
}

/** Экраны курса без кода («Браузер», «Оптимизация», «Безопасность»): карта, урок, экзамен, карточки. Карта у каждого курса своя. */
export function CourseScreen({ course, route }: { course: Course; route: Route }) {
  const { progress } = useProgress();
  if (route.view === "course-lesson") {
    const lesson = course.byId[route.id];
    if (lesson) {
      return courseLessonUnlocked(course, progress, lesson)
        ? <CourseLessonView key={lesson.id} course={course} lesson={lesson} />
        : <CourseLocked course={course} what={lesson.title} />;
    }
  }
  if (route.view === "course-exam" && course.regions[route.region]?.kind === "lessons") {
    return courseRegionDone(course, progress, route.region)
      ? <ExamView key={route.region} cfg={courseExam(course, route.region)} />
      : <CourseLocked course={course} what={`Экзамен «${course.regions[route.region]!.name}»`} />;
  }
  if (route.view === "course-cards") {
    return <CardsView cards={course.flashcards} regionNames={course.regions.map((r) => r.name)} interview={{ view: "course-interview", course: course.id }} />;
  }
  if (route.view === "course-progress") return <CourseProgressView course={course} />;
  if (route.view === "course-interview") {
    return (
      <InterviewView cfg={{
        poolFor: (p) => courseInterviewPool(course, p),
        regionNames: course.regions.map((r) => r.name),
        map: { view: "course", course: course.id },
        cards: { view: "course-cards", course: course.id },
      }} />
    );
  }
  if (course.id === "perf") return <PerfMapView course={course} />;
  if (course.id === "sec") return <SecMapView course={course} />;
  if (course.id === "react") return <ReactMapView course={course} />;
  return <WebMapView course={course} />;
}
