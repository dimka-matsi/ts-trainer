import { useState } from "react";
import { EXAM_PASS } from "../../content/exams";
import { WEB_EXAM_KEY, WEB_FLASHCARDS, WEB_LESSONS, WEB_REGIONS } from "../../content/web";
import { useProgress } from "../../state/progress";
import { navigate } from "../../state/route";
import { webCurrent, webLessonDone, webLessonUnlocked, webRegionDone, webRegionLessons } from "../../state/webPath";
import { Md } from "../../ui/Code";

/** Карта «Браузера» как вкладка Network: регион — строка запроса, прогресс — водопад. */
export function WebMapView() {
  const { progress } = useProgress();
  const now = webCurrent(progress);
  const [open, setOpen] = useState<Set<number>>(() => new Set([now?.region ?? 0]));
  const toggle = (ri: number) => setOpen((prev) => {
    const next = new Set(prev);
    if (next.has(ri)) next.delete(ri); else next.add(ri);
    return next;
  });
  const doneCount = WEB_LESSONS.filter((l) => webLessonDone(progress, l)).length;
  const topicsTotal = WEB_REGIONS.reduce((n, r) => n + (r.kind === "lessons" ? webRegionLessons(WEB_REGIONS.indexOf(r)).length : r.topics?.length ?? 0), 0);

  return (
    <section className="wm">
      <p className="eyebrow">// браузер → собеседование</p>
      <h1>Браузер</h1>
      <p className="lead">События, event loop, HTTP, кэширование, CORS, безопасность и рендеринг: всё, что спрашивают на фронтенд-собеседованиях про работу браузера. Код в заданиях выполняется в настоящем DOM.</p>
      <div className="actions hero-actions">
        {now && (
          <button type="button" className="btn" onClick={() => navigate({ view: "web-lesson", id: now.id })}>
            {doneCount ? "Продолжить" : "Начать"}: {now.title}
          </button>
        )}
        <button type="button" className="btn ghost" onClick={() => navigate({ view: "web-cards" })}>Карточки: {WEB_FLASHCARDS.length} вопросов</button>
      </div>

      <div className="dt-network" role="table" aria-label="Регионы раздела">
        <div className="dt-net-toolbar">
          <span className="dt-rec" aria-hidden="true" />
          <span>Регионы</span>
          <span className="dt-net-gap" />
          <span>{doneCount} из {WEB_LESSONS.length} уроков пройдено</span>
        </div>
        <div className="dt-row dt-head" role="row">
          <span role="columnheader">Имя</span><span role="columnheader">Статус</span><span role="columnheader">Тип</span>
          <span role="columnheader">Тем</span><span role="columnheader">Водопад</span>
        </div>
        {WEB_REGIONS.map((r, ri) => {
          const lessons = webRegionLessons(ri);
          const live = r.kind === "lessons";
          const done = lessons.filter((l) => webLessonDone(progress, l)).length;
          const unlocked = live && lessons[0] ? webLessonUnlocked(progress, lessons[0]) : false;
          const status = !live ? { code: "—", text: "скоро", cls: "soon" }
            : done === lessons.length ? { code: "200", text: "OK", cls: "ok" }
            : unlocked ? { code: "206", text: "в процессе", cls: "partial" }
            : { code: "(blocked)", text: "закрыто", cls: "blocked" };
          const count = live ? lessons.length : r.topics?.length ?? 0;
          const best = progress.exams[WEB_EXAM_KEY(ri)];
          return (
            <div key={ri} className={`dt-group${open.has(ri) ? " open" : ""}`}>
              <button type="button" className={`dt-row dt-region st-${status.cls}`} role="row" aria-expanded={open.has(ri)} onClick={() => toggle(ri)}>
                <span role="cell" className="dt-name"><span className="dt-caret" aria-hidden="true">▸</span>{ri + 1}. {r.name}</span>
                <span role="cell" className={`dt-status-code st-${status.cls}`}>{status.code} <small>{status.text}</small></span>
                <span role="cell">{live ? "уроки" : "план"}</span>
                <span role="cell">{count}</span>
                <span role="cell" className="dt-wf" aria-label={`${done} из ${count}`}>
                  <i className="dt-wf-bar" style={{ width: `${live && count ? (done / count) * 100 : 0}%`, marginLeft: `${(ri / WEB_REGIONS.length) * 40}%` }} />
                </span>
              </button>
              {open.has(ri) && (
                <div className="dt-detail">
                  <p className="rdesc"><Md text={r.desc} /></p>
                  {live ? lessons.map((l) => {
                    const ok = webLessonDone(progress, l);
                    const can = webLessonUnlocked(progress, l);
                    return (
                      <button key={l.id} type="button" className={`dt-row dt-topic${ok ? " st-ok" : can ? "" : " st-blocked"}${now?.id === l.id ? " cur" : ""}`}
                        disabled={!can} onClick={() => navigate({ view: "web-lesson", id: l.id })}>
                        <span className="dt-name">{ok ? "✓" : can ? "●" : <i className="lock" aria-hidden="true" />} {l.title}{now?.id === l.id && <span className="cur-tag">сейчас</span>}</span>
                        <span className={`dt-status-code st-${ok ? "ok" : can ? "partial" : "blocked"}`}>{ok ? "200" : can ? "pending" : "(blocked)"}</span>
                        <span>урок</span>
                        <span>{l.tasks.length} зад.</span>
                        <span className="dt-q"><Md text={l.q} /></span>
                      </button>
                    );
                  }) : (r.topics ?? []).map((t) => (
                    <div key={t.t} className="dt-row dt-topic st-soon">
                      <span className="dt-name">○ {t.t}</span>
                      <span className="dt-status-code st-soon">—</span>
                      <span>тема</span>
                      <span />
                      <span className="dt-q"><Md text={t.q} /></span>
                    </div>
                  ))}
                  {live && (
                    <div className="actions">
                      {webRegionDone(progress, ri)
                        ? <button type="button" className="btn ghost small" onClick={() => navigate({ view: "web-exam", region: ri })}>Итоговый экзамен{best != null ? ` · ${best}%${best >= EXAM_PASS ? " ✓" : ""}` : ""}</button>
                        : <button type="button" className="btn ghost small" disabled>Экзамен после всех тем</button>}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div className="dt-net-footer">{WEB_REGIONS.length} регионов · {topicsTotal} тем · {WEB_REGIONS.filter((r) => r.kind === "lessons").length} открыто</div>
      </div>
    </section>
  );
}
