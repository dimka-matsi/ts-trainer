import { LESSON_BY_ID } from "./content/lessons";
import { LEVELS } from "./content/sorter/levels";
import { EngineProvider } from "./state/engine";
import { levelUnlocked, ProgressProvider, useProgress } from "./state/progress";
import { useRoute, type Route } from "./state/route";
import { ToastProvider } from "./state/toast";
import { Achievements } from "./ui/Achievements";
import { Header } from "./ui/Header";
import { LessonView } from "./views/lesson/LessonView";
import { MapView } from "./views/MapView";
import { SorterView } from "./views/SorterView";

function Screen({ route }: { route: Route }) {
  const { progress } = useProgress();
  if (route.view === "lesson") {
    const lesson = LESSON_BY_ID[route.id];
    if (lesson) return <LessonView key={lesson.id} lesson={lesson} />;
  }
  if (route.view === "level" && LEVELS[route.index] && levelUnlocked(progress, route.index)) {
    return <SorterView key={route.index} index={route.index} />;
  }
  return <MapView />;
}

export function App() {
  const route = useRoute();
  return (
    <ToastProvider>
      <ProgressProvider>
        <EngineProvider>
          <div className="wrap">
            <Header route={route} />
            <main><Screen route={route} /></main>
            <Achievements />
          </div>
        </EngineProvider>
      </ProgressProvider>
    </ToastProvider>
  );
}
