import { useState } from 'react';
import { T, interests } from './data';
import styles from './SetupScreen.module.css';

const DURATION_VALS = [15, 30, 60, 90];

export default function SetupScreen({ lang, onStart }) {
  const t = T[lang];
  const [windows, setWindows] = useState(3);
  const [duration, setDuration] = useState(15);
  const [selected, setSelected] = useState(new Set(['calm', 'movement', 'selfcare']));

  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size > 1) next.delete(id); }
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t.appName}</h1>
        <p className={styles.tagline}>{t.tagline}</p>
      </header>

      <section className={styles.section}>
        <label className={styles.label}>{t.windowsLabel}</label>
        <div className={styles.sliderRow}>
          <input
            type="range" min="1" max="7" step="1"
            value={windows}
            onChange={e => setWindows(Number(e.target.value))}
            className={styles.slider}
          />
          <span className={styles.sliderVal}>{windows}</span>
        </div>
      </section>

      <section className={styles.section}>
        <label className={styles.label}>{t.durationLabel}</label>
        <div className={styles.durGrid}>
          {DURATION_VALS.map((d, i) => (
            <button
              key={d}
              className={`${styles.durBtn} ${duration === d ? styles.durBtnActive : ''}`}
              onClick={() => setDuration(d)}
            >
              {t.durations[i]}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <label className={styles.label}>{t.interestsLabel}</label>
        <p className={styles.hint}>{t.interestsHint}</p>
        <div className={styles.intGrid}>
          {interests[lang].map(i => (
            <button
              key={i.id}
              className={`${styles.intBtn} ${selected.has(i.id) ? styles.intBtnActive : ''}`}
              onClick={() => toggle(i.id)}
            >
              <span className={styles.intIcon}>{i.icon}</span>
              {i.label}
            </button>
          ))}
        </div>
      </section>

      <button
        className={styles.cta}
        onClick={() => onStart({ windows, duration, interests: selected })}
      >
        {t.cta}
      </button>
    </div>
  );
}
