import type { CourseId } from "../content/course/types";
import { navigate } from "../state/route";

/** Плитки хаба в том же порядке, что карточки на главном экране. */
const TILES: ("ts" | CourseId)[] = ["ts", "web", "sec", "perf"];

/**
 * Кнопка возврата на хаб: мини-копия главного экрана из четырёх плиток цветов направлений.
 * Плитка текущего направления горит, остальные приглушены; при наведении загораются все и расходятся.
 */
export function HubButton({ current }: { current: "ts" | CourseId }) {
  return (
    <button type="button" className="hub-btn" onClick={() => navigate({ view: "hub" })}
      aria-label="К выбору направления" title="К выбору направления">
      <svg className="hub-btn-arrow" viewBox="0 0 8 12" width="8" height="12" aria-hidden="true"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 1 1.5 6 6 11" />
      </svg>
      <span className="hub-btn-grid" aria-hidden="true">
        {TILES.map((id) => <i key={id} className={`hb-${id}`} data-on={id === current || undefined} />)}
      </span>
    </button>
  );
}
