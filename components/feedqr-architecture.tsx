'use client';

import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { gsap } from '@/lib/motion';
import type { Locale } from '@/lib/content';
import { architectureCopy, architectureSteps as steps } from '@/lib/feedqr-architecture-content';
import styles from './feedqr-architecture.module.css';

type Bounds = { left: number; right: number; top: number; bottom: number; cx: number; cy: number };
type Edge = { path: string; returning: boolean };
type Geometry = { width: number; height: number; vertical: boolean; edges: Edge[] };

export function architectureEdges(nodes: readonly Bounds[], vertical: boolean): Edge[] {
  if (nodes.length !== 5) return [];
  if (vertical) return nodes.slice(0, 4).map((node, index) => ({
    path: `M ${node.cx} ${node.bottom + 8} V ${nodes[index + 1].top - 12}`,
    returning: index === 3,
  }));
  const [ui, api, rules, database, confirmation] = nodes;
  const between = (a: Bounds, b: Bounds) => `M ${a.right + 8} ${a.cy} H ${(a.right + b.left) / 2} V ${b.cy} H ${b.left - 10}`;
  const lane = Math.max(api.bottom, rules.bottom) + 44;
  return [
    { path: between(ui, api), returning: false },
    { path: between(api, rules), returning: false },
    { path: `M ${rules.right + 8} ${rules.cy} H ${database.cx} V ${database.top - 12}`, returning: false },
    { path: `M ${database.left - 8} ${database.cy} H ${rules.cx} V ${rules.bottom + 12}`, returning: true },
    { path: `M ${rules.cx - 16} ${rules.bottom + 12} V ${lane} H ${api.cx - 16} V ${api.bottom + 12}`, returning: true },
    { path: `M ${api.cx + 16} ${api.bottom + 12} V ${confirmation.cy} H ${confirmation.right + 12}`, returning: true },
  ];
}

export function FeedqrArchitecture({ locale }: { locale: Locale }) {
  const prefix = `feedqr-flow-${useId().replace(/:/g, '')}`;
  const root = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const signals = useRef<(SVGPathElement | null)[]>([]);
  const packet = useRef<SVGRectElement>(null);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<'idle' | 'selection' | 'playing'>('idle');
  const playing = mode === 'playing';
  const [complete, setComplete] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [overview, setOverview] = useState(false);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const t = architectureCopy[locale];
  const incoming = active === 0 ? [] : active < 4 ? [active - 1] : geometry?.vertical ? [3] : [3, 4, 5];

  useLayoutEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReduced(media.matches); if (media.matches) setMode('idle'); };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    const canvas = board.current;
    if (!canvas) return;
    let frame = 0;
    let alive = true;
    const measure = () => {
      const bounds = canvas.getBoundingClientRect();
      const nodes = buttons.current.map((button) => button?.getBoundingClientRect());
      if (!bounds.width || nodes.some((node) => !node) || nodes.length !== steps.length) return;
      const padding = getComputedStyle(canvas);
      const vertical = bounds.width - parseFloat(padding.paddingLeft) - parseFloat(padding.paddingRight) <= 740;
      const relative = nodes.map((node) => ({
        left: node!.left - bounds.left, right: node!.right - bounds.left,
        top: node!.top - bounds.top, bottom: node!.bottom - bounds.top,
        cx: (node!.left + node!.right) / 2 - bounds.left,
        cy: (node!.top + node!.bottom) / 2 - bounds.top,
      }));
      const next = { width: bounds.width, height: bounds.height, vertical, edges: architectureEdges(relative, vertical) };
      setGeometry((previous) => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    const refresh = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { frame = 0; measure(); });
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(refresh);
    observer?.observe(canvas);
    buttons.current.forEach((button) => { if (button) observer?.observe(button); });
    window.addEventListener('resize', refresh, { passive: true });
    void document.fonts.ready.then(() => { if (alive) refresh(); });
    return () => {
      alive = false;
      observer?.disconnect();
      window.removeEventListener('resize', refresh);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useLayoutEffect(() => {
    if (!geometry || !root.current || reduced || overview || mode === 'idle') return;
    const replay = mode === 'playing';
    const indices = active === 0 ? [] : active < 4 ? [active - 1] : geometry.vertical ? [3] : [3, 4, 5];
    if (!indices.length && !replay) { setMode('idle'); return; }
    let alive = true;
    const marker = packet.current;
    const signalNodes = indices.map((index) => signals.current[index]);
    const context = gsap.context(() => {}, root.current);
    try {
      context.add(() => {
        const timeline = gsap.timeline({ onComplete: () => {
          if (!alive) return;
          if (marker) marker.style.opacity = '0';
          if (!replay) { setMode('idle'); return; }
          if (active === steps.length - 1) { setMode('idle'); setComplete(true); }
          else setActive(active + 1);
        } });
        indices.forEach((index) => {
          const path = paths.current[index];
          const signal = signals.current[index];
          if (!path || !signal || !marker) return;
          const length = path.getTotalLength();
          const cursor = { distance: 0 };
          signal.setAttribute('stroke-dasharray', String(length));
          signal.setAttribute('stroke-dashoffset', String(length));
          timeline.to(cursor, {
            distance: length, duration: indices.length > 1 ? 0.24 : 0.55, ease: 'power1.inOut',
            onStart: () => { signal.style.opacity = '1'; marker.style.opacity = '1'; },
            onUpdate: () => {
              if (!alive) return;
              const point = path.getPointAtLength(cursor.distance);
              marker.setAttribute('x', String(point.x - 4));
              marker.setAttribute('y', String(point.y - 4));
              signal.setAttribute('stroke-dashoffset', String(length - cursor.distance));
            },
          });
        });
        if (replay) timeline.to({}, { duration: active === 0 ? 1.2 : 1.05 });
      });
    } catch {
      // Selection and verified explanations remain usable if SVG motion fails.
      setMode('idle');
    }
    return () => {
      alive = false;
      context.revert();
      if (marker) marker.style.removeProperty('opacity');
      signalNodes.forEach((signal) => {
        signal?.style.removeProperty('opacity');
        signal?.removeAttribute('stroke-dasharray');
        signal?.removeAttribute('stroke-dashoffset');
      });
    };
  }, [active, mode, reduced, overview, geometry]);

  function select(index: number) {
    setMode(reduced ? 'idle' : 'selection'); setComplete(false); setOverview(false); setActive(index);
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const next = ['ArrowRight', 'ArrowDown'].includes(event.key) ? (index + 1) % steps.length
      : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? (index + steps.length - 1) % steps.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? steps.length - 1 : null;
    if (next === null) return;
    event.preventDefault(); select(next); buttons.current[next]?.focus({ preventScroll: true });
  }
  function play() {
    if (reduced) { setOverview(!overview); return; }
    if (playing) { setMode('idle'); return; }
    setComplete(false); setOverview(false); setActive(0); setMode('playing');
  }
  const details = (index: number) => <>
    <h4>{steps[index].heading[locale]}</h4><p>{steps[index].description[locale]}</p>
    <ul>{steps[index].details[locale].map((item) => <li key={item}>{item}</li>)}</ul>
  </>;

  return (
    <div ref={root} className={styles.architecture} id="feedqr-architecture-flow">
      <div className={styles.intro}><h3>{t.title}</h3><p>{t.intro}</p></div>
      <div className={styles.interactive}>
        <div className={styles.toolbar}>
          <p>{t.select}</p><button type="button" className={styles.play} onClick={play} aria-pressed={reduced ? overview : playing} aria-controls={`${prefix}-canvas ${prefix}-contexts`}>
            {reduced ? overview ? t.hideAll : t.showAll : playing ? t.stop : t.play}
          </button>
        </div>
        <div className={styles.legend} aria-hidden="true"><span>{t.request}</span><span>{t.response}</span></div>
        <div ref={board} className={styles.board} id={`${prefix}-canvas`}>
          <svg className={styles.connections} viewBox={`0 0 ${geometry?.width ?? 1000} ${geometry?.height ?? 500}`} aria-hidden="true">
            <defs>
              <marker id={`${prefix}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 8 4 L 0 8 Z" fill="#8996a3" /></marker>
              <marker id={`${prefix}-active-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 8 4 L 0 8 Z" fill="#b9ff47" /></marker>
            </defs>
            {geometry?.edges.map((edge, index) => <g key={index}>
              <path ref={(element) => { paths.current[index] = element; }} className={styles.connection} d={edge.path}
                data-lit={incoming.includes(index)} data-return={edge.returning} markerEnd={`url(#${prefix}-${incoming.includes(index) ? 'active-arrow' : 'arrow'})`} />
              <path ref={(element) => { signals.current[index] = element; }} className={styles.signal} d={edge.path} />
            </g>)}
            <rect ref={packet} className={styles.packet} x={-4} y={-4} width={8} height={8} />
          </svg>
          <ol className={styles.flow} aria-label={t.diagram}>
            {steps.map((step, index) => <li className={styles.node} key={step.id}>
              <button ref={(element) => { buttons.current[index] = element; }} type="button" className={styles.nodeButton}
                id={`${prefix}-step-${index}`} aria-pressed={active === index} aria-controls={`${prefix}-context-${index}`}
                onClick={() => select(index)} onKeyDown={(event) => keyboard(event, index)}>
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.nodeTitle}>{step.title[locale]}</span><span className={styles.technology}>{step.technology}</span>
              </button>
            </li>)}
          </ol>
        </div>
        <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">
          {t.step} {active + 1} {t.of} {steps.length} — {steps[active].title[locale]}{complete ? ` · ${t.complete}` : ''}
        </p>
        <p className={styles.disclosure}>{t.visual}</p>
        <div className={styles.context} data-overview={overview} id={`${prefix}-contexts`}>
          {steps.map((step, index) => <div key={step.id} className={styles.contextPanel} id={`${prefix}-context-${index}`}
            role="region" aria-labelledby={`${prefix}-step-${index}`} aria-hidden={!overview && active !== index}
            inert={!overview && active !== index} data-active={overview || active === index}>{details(index)}</div>)}
        </div>
      </div>
      <noscript>
        <style>{`.${styles.interactive} { display: none; }`}</style>
        <ol className={styles.staticFlow}>{steps.map((step, index) => <li key={step.id}>
          <p className={styles.staticTitle}>{step.title[locale]} · {step.technology}</p>{details(index)}
        </li>)}</ol>
      </noscript>
    </div>
  );
}
