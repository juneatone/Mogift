import { useState, useRef } from 'react';
import styles from './CookingPanel.module.css';

const ui = {
  en: {
    micHint: "Tap the mic and speak, or type your vegetables below",
    inputPlaceholder: "e.g. potato, onion, tomato, spinach...",
    askBtn: "Find a dish",
    listening: "Listening...",
    thinking: "Searching recipes...",
    watchLabel: "Watch on YouTube",
    tryAnother: "Try another result",
    noMic: "Microphone not supported on this browser. Please type instead.",
    noResult: "No recipe found for those vegetables. Try different ones!",
    ingredientsLabel: "Ingredients",
    stepsLabel: "Instructions",
    sourceLabel: "Full recipe",
    categoryLabel: "Category",
    areaLabel: "Cuisine",
  },
  mr: {
    micHint: "माईक दाबा आणि बोला, किंवा खाली भाज्या टाइप करा",
    inputPlaceholder: "उदा. बटाटा, कांदा, टोमॅटो, पालक...",
    askBtn: "डिश शोधा",
    listening: "ऐकत आहे...",
    thinking: "रेसिपी शोधत आहे...",
    watchLabel: "YouTube वर बघा",
    tryAnother: "दुसरी रेसिपी",
    noMic: "या ब्राउझरमध्ये मायक्रोफोन उपलब्ध नाही. कृपया टाइप करा.",
    noResult: "या भाज्यांसाठी रेसिपी सापडली नाही. वेगळ्या भाज्या वापरा!",
    ingredientsLabel: "साहित्य",
    stepsLabel: "कृती",
    sourceLabel: "पूर्ण रेसिपी",
    categoryLabel: "प्रकार",
    areaLabel: "पाककृती",
  }
};

// Extract ingredients + measures from MealDB meal object
function extractIngredients(meal) {
  const items = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      items.push(`${measure ? measure.trim() + ' ' : ''}${ing.trim()}`);
    }
  }
  return items;
}

// Split instructions into steps
function extractSteps(instructions) {
  if (!instructions) return [];
  return instructions
    .split(/\r\n|\n|\r/)
    .map(s => s.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(s => s.length > 10)
    .slice(0, 8);
}

// Parse vegetable input — take first meaningful word as search term
function getPrimaryIngredient(input) {
  const cleaned = input.trim().toLowerCase();
  // Common Marathi -> English mappings
  const marathiMap = {
    'बटाटा': 'potato', 'कांदा': 'onion', 'टोमॅटो': 'tomato',
    'पालक': 'spinach', 'मटार': 'peas', 'गाजर': 'carrot',
    'फ्लॉवर': 'cauliflower', 'वांगे': 'eggplant', 'भेंडी': 'okra',
    'कोबी': 'cabbage', 'मेथी': 'fenugreek', 'कोथिंबीर': 'coriander',
  };
  for (const [mr, en] of Object.entries(marathiMap)) {
    if (cleaned.includes(mr)) return en;
  }
  // English — take first word before comma/space
  const first = cleaned.split(/[,،\s]+/)[0];
  return first || cleaned;
}

export default function CookingPanel({ lang }) {
  const t = ui[lang];
  const [veggies, setVeggies] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState([]);
  const [mealIndex, setMealIndex] = useState(0);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError(t.noMic); return; }
    const rec = new SR();
    rec.lang = lang === 'mr' ? 'mr-IN' : 'en-IN';
    rec.interimResults = false;
    rec.onstart = () => { setListening(true); setError(''); };
    rec.onresult = (e) => {
      setVeggies(e.results[0][0].transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
  }

  async function findDish() {
    if (!veggies.trim()) return;
    setLoading(true);
    setMeals([]);
    setMealIndex(0);
    setError('');

    const ingredient = getPrimaryIngredient(veggies);

    try {
      // Step 1: filter by ingredient
      const filterRes = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
      );
      const filterData = await filterRes.json();

      if (!filterData.meals || filterData.meals.length === 0) {
        setError(t.noResult);
        setLoading(false);
        return;
      }

      // Step 2: fetch full details for top 3 results
      const top3 = filterData.meals.slice(0, 3);
      const detailed = await Promise.all(
        top3.map(m =>
          fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`)
            .then(r => r.json())
            .then(d => d.meals[0])
        )
      );

      setMeals(detailed);
    } catch {
      setError(t.noResult);
    }
    setLoading(false);
  }

  const meal = meals[mealIndex];
  const ingredients = meal ? extractIngredients(meal) : [];
  const steps = meal ? extractSteps(meal.strInstructions) : [];

  return (
    <div className={styles.panel}>
      <div className={styles.inputRow}>
        <button
          className={`${styles.micBtn} ${listening ? styles.micActive : ''}`}
          onClick={startListening}
          aria-label="Start microphone"
          title="Speak your vegetables"
        >
          {listening ? '🔴' : '🎤'}
        </button>
        <input
          type="text"
          className={styles.input}
          placeholder={listening ? t.listening : t.inputPlaceholder}
          value={veggies}
          onChange={e => setVeggies(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && findDish()}
        />
      </div>
      <p className={styles.hint}>{t.micHint}</p>

      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.askBtn}
        onClick={findDish}
        disabled={loading || !veggies.trim()}
      >
        {loading ? t.thinking : t.askBtn}
      </button>

      {meal && (
        <div className={styles.result}>
          {/* Meal thumbnail */}
          {meal.strMealThumb && (
            <img
              src={`${meal.strMealThumb}/preview`}
              alt={meal.strMeal}
              className={styles.thumb}
            />
          )}

          <h3 className={styles.dishName}>{meal.strMeal}</h3>

          <div className={styles.tags}>
            {meal.strCategory && (
              <span className={styles.tag}>🍽 {meal.strCategory}</span>
            )}
            {meal.strArea && (
              <span className={styles.tag}>🌍 {meal.strArea}</span>
            )}
          </div>

          <div className={styles.block}>
            <p className={styles.blockLabel}>🥗 {t.ingredientsLabel}</p>
            <ul className={styles.ingList}>
              {ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          </div>

          {steps.length > 0 && (
            <div className={styles.block}>
              <p className={styles.blockLabel}>👩‍🍳 {t.stepsLabel}</p>
              <ol className={styles.stepList}>
                {steps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
          )}

          <div className={styles.btnRow}>
            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ytBtn}
              >
                ▶ {t.watchLabel}
              </a>
            )}
            {meal.strSource && (
              <a
                href={meal.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sourceBtn}
              >
                📄 {t.sourceLabel}
              </a>
            )}
          </div>

          {meals.length > 1 && (
            <button
              className={styles.retryBtn}
              onClick={() => setMealIndex(i => (i + 1) % meals.length)}
            >
              ↺ {t.tryAnother} ({mealIndex + 1}/{meals.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
