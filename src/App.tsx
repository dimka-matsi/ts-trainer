import { LESSON_BY_ID } from "./content/lessons";
import { hasExam } from "./content/exams";
import { REGIONS } from "./content/regions";
import { LEVELS } from "./content/sorter/levels";
import { EngineProvider } from "./state/engine";
import { lessonUnlocked, levelUnlocked, regionDone } from "./state/path";
import { ProgressProvider, useProgress } from "./state/progress";
import { useEffect } from "react";
import { trackOf, useRoute, type Route } from "./state/route";
import { ToastProvider } from "./state/toast";
import { Header } from "./ui/Header";
import { LessonView } from "./views/lesson/LessonView";
import { LockedView } from "./views/LockedView";
import { CardsView, tsCards } from "./views/CardsView";
import { ExamView, tsExam } from "./views/ExamView";
import { InterviewView } from "./views/InterviewView";
import { ProgressView } from "./views/ProgressView";
import { MapView } from "./views/MapView";
import { SorterView } from "./views/SorterView";
import { HubView } from "./views/HubView";
import { WebHeader } from "./views/web/WebHeader";
import { WebScreen } from "./views/web/WebScreen";

function Screen({ route }: { route: Route }) {
  const { progress } = useProgress();
  if (route.view === "lesson") {
    const lesson = LESSON_BY_ID[route.id];
    if (lesson) {
      return lessonUnlocked(progress, lesson)
        ? <LessonView key={lesson.id} lesson={lesson} />
        : <LockedView what={lesson.title} />;
    }
  }
  if (route.view === "exam" && REGIONS[route.region] && REGIONS[route.region]!.kind !== "soon" && hasExam(route.region)) {
    return regionDone(progress, route.region)
      ? <ExamView key={route.region} cfg={tsExam(route.region)} />
      : <LockedView what={`Экзамен «${REGIONS[route.region]!.name}»`} />;
  }
  if (route.view === "cards") return <CardsView {...tsCards} />;
  if (route.view === "interview") return <InterviewView />;
  if (route.view === "progress") return <ProgressView />;
  if (route.view === "level" && LEVELS[route.index]) {
    return levelUnlocked(progress, route.index)
      ? <SorterView key={route.index} index={route.index} />
      : <LockedView what={`Уровень ${route.index + 1}. ${LEVELS[route.index]!.title}`} />;
  }
  return <MapView />;
}

export function App() {
  const route = useRoute();
  const track = trackOf(route);

  // Стиль направления: токены цвета и шрифты переключаются по data-track на <html>.
  useEffect(() => {
    document.documentElement.dataset.track = track;
    document.title = track === "web" ? "Браузер · Тренажёр" : track === "hub" ? "Тренажёр: подготовка к собеседованию" : "Тренажёр TypeScript";
  }, [track]);

  return (
    <ToastProvider>
      <ProgressProvider>
        <EngineProvider>
          {track === "hub" ? <HubView /> : (
            <>
              {track === "web" ? <WebHeader route={route} /> : <Header route={route} />}
              <div className="wrap">
                <main>{track === "web" ? <WebScreen route={route} /> : <Screen route={route} />}</main>
              </div>
            </>
          )}
        </EngineProvider>
      </ProgressProvider>
    </ToastProvider>
  );
}
