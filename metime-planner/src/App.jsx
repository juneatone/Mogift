import { useState } from 'react';
import SetupScreen from './SetupScreen';
import SuggestScreen from './SuggestScreen';
import './index.css';
import styles from './App.module.css';

export default function App() {
  const [lang, setLang] = useState('en');
  const [screen, setScreen] = useState('setup');
  const [prefs, setPrefs] = useState(null);

  function handleStart(p) {
    setPrefs(p);
    setScreen('suggest');
  }

  return (
    <div className={styles.app}>
      <div className={styles.langBar}>
        <button
          className={`${styles.langBtn} ${lang === 'en' ? styles.langActive : ''}`}
          onClick={() => setLang('en')}
        >English</button>
        <button
          className={`${styles.langBtn} ${lang === 'mr' ? styles.langActive : ''}`}
          onClick={() => setLang('mr')}
        >मराठी</button>
      </div>

      {screen === 'setup' && (
        <SetupScreen lang={lang} onStart={handleStart} />
      )}
      {screen === 'suggest' && prefs && (
        <SuggestScreen lang={lang} prefs={prefs} onBack={() => setScreen('setup')} />
      )}
    </div>
  );
}
