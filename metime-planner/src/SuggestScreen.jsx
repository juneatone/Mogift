import { useState, useEffect } from 'react';
import { T, activities, funfacts } from './data';
import ReadingPanel from './ReadingPanel';
import CookingPanel from './CookingPanel';
import JournalingPanel from './JournalingPanel';
import styles from './SuggestScreen.module.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SuggestScreen({ lang, prefs, onBack }) {
  const t = T[lang];
  const [activity, setActivity] = useState(null);
  const [doneCount, setDoneCount] = useState(0);
  const [doneMsg, setDoneMsg] = useState('');
  const [factIndex, setFactIndex] = useState(0);
  const [shuffledFacts, setShuffledFacts] = useState([]);
  const [lastActivity, setLastActivity] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  function pickActivity(exclude) {
    const pool = activities[lang].filter(a =>
      a.duration <= prefs.duration && prefs.interests.has(a.category) && a !== exclude
    );
    const fallback = activities[lang].filter(a => a.duration <= prefs.duration && a !== exclude);
    const source = pool.length > 0 ? pool : fallback.length > 0 ? fallback : activities[lang];
    return source[Math.floor(Math.random() * source.length)];
  }

  useEffect(() => {
    const a = pickActivity(null);
    setActivity(a);
    setLastActivity(a);
    if (a.category === 'funfact') {
      setShuffledFacts(shuffle(funfacts[lang]));
      setFactIndex(0);
    }
  }, []);

  function getAnother() {
    const a = pickActivity(lastActivity);
    setActivity(a);
    setLastActivity(a);
    setAnimKey(k => k + 1);
    setDoneMsg('');
    if (a.category === 'funfact') {
      setShuffledFacts(shuffle(funfacts[lang]));
      setFactIndex(0);
    }
  }

  function markDone() {
    const count = doneCount + 1;
    setDoneCount(count);
    const phrases = t.donePhrases;
    setDoneMsg(phrases[Math.floor(Math.random() * phrases.length)]);
    setTimeout(() => {
      setDoneMsg('');
      getAnother();
    }, 2800);
  }

  const weekStat = doneCount === 0
    ? t.weekZero
    : doneCount === 1
    ? t.weekOne
    : t.weekMany(doneCount);

  const currentFact = shuffledFacts[factIndex % (shuffledFacts.length || 1)];

  if (!activity) return null;

  return (
    <div className={styles.container}>
      <p className={styles.todayLabel}>{t.todayLabel}</p>

      <div key={animKey} className={styles.card}>
        <h2 className={styles.cardTitle}>{activity.title}</h2>
        <p className={styles.cardDesc}>{activity.desc}</p>
        <span className={styles.badge}>{t.durationBadge(activity.duration)}</span>
      </div>

      {/* Reading panel */}
      {activity.category === 'reading' && (
        <ReadingPanel lang={lang} />
      )}

      {/* Cooking panel */}
      {activity.category === 'cooking' && (
        <CookingPanel lang={lang} />
      )}

      {/* Journaling panel */}
      {activity.category === 'journaling' && (
        <JournalingPanel lang={lang} />
      )}

      {/* Fun fact panel */}
      {activity.category === 'funfact' && currentFact && (
        <div className={styles.factCard}>
          <div className={styles.factHeader}>
            <span className={styles.factBulb}>💡</span>
            <span className={styles.factTopic}>{t.factLabel} — {currentFact.topic}</span>
          </div>
          <p className={styles.factText}>{currentFact.fact}</p>
          <button className={styles.factBtn} onClick={() => setFactIndex(i => i + 1)}>
            {t.nextFact} →
          </button>
        </div>
      )}

      {doneMsg && (
        <div className={styles.doneMsg}>
          <span>✓</span> {doneMsg}
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.doneBtn} onClick={markDone}>
          ✓ {t.doneBtn}
        </button>
        <button className={styles.anotherBtn} onClick={getAnother}>
          ↺ {t.anotherBtn}
        </button>
      </div>

      <div className={styles.weekBox}>
        <p className={styles.weekLabel}>{t.weekLabel}</p>
        <p className={styles.weekStat}>{weekStat}</p>
      </div>

      <button className={styles.backBtn} onClick={onBack}>
        ← {t.backBtn}
      </button>
    </div>
  );
}
