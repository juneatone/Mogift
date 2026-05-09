import { useState, useEffect } from 'react';
import styles from './JournalingPanel.module.css';

const ui = {
  en: {
    placeholder: "Write whatever's on your mind...",
    saveBtn: "Save note",
    savedLabel: "Saved notes",
    noNotes: "No saved notes yet.",
    deleteBtn: "Delete",
    todayAt: "Today at",
    charCount: (n) => `${n} characters`,
    savedMsg: "Note saved ✓",
  },
  mr: {
    placeholder: "मनात जे आहे ते लिहा...",
    saveBtn: "नोट सेव्ह करा",
    savedLabel: "सेव्ह केलेल्या नोट्स",
    noNotes: "अजून कोणत्याही नोट्स सेव्ह केल्या नाहीत.",
    deleteBtn: "हटवा",
    todayAt: "आज",
    charCount: (n) => `${n} अक्षरे`,
    savedMsg: "नोट सेव्ह झाली ✓",
  }
};

const STORAGE_KEY = 'metime_journal_notes';

function loadNotes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export default function JournalingPanel({ lang }) {
  const t = ui[lang];
  const [text, setText] = useState('');
  const [notes, setNotes] = useState(loadNotes);
  const [showSaved, setShowSaved] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  function save() {
    if (!text.trim()) return;
    const note = {
      id: Date.now(),
      text: text.trim(),
      date: new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
    };
    const updated = [note, ...notes];
    setNotes(updated);
    saveNotes(updated);
    setText('');
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  }

  function deleteNote(id) {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
  }

  return (
    <div className={styles.panel}>
      <textarea
        className={styles.textarea}
        placeholder={t.placeholder}
        value={text}
        onChange={e => setText(e.target.value)}
        rows={5}
      />
      <div className={styles.textareaFooter}>
        <span className={styles.charCount}>{t.charCount(text.length)}</span>
        {savedMsg && <span className={styles.savedMsg}>{t.savedMsg}</span>}
      </div>

      <button className={styles.saveBtn} onClick={save} disabled={!text.trim()}>
        {t.saveBtn}
      </button>

      <button
        className={styles.toggleSaved}
        onClick={() => setShowSaved(s => !s)}
      >
        {t.savedLabel} ({notes.length}) {showSaved ? '▲' : '▼'}
      </button>

      {showSaved && (
        <div className={styles.notesList}>
          {notes.length === 0 && (
            <p className={styles.empty}>{t.noNotes}</p>
          )}
          {notes.map(note => (
            <div key={note.id} className={styles.noteCard}>
              <div className={styles.noteMeta}>
                <span className={styles.noteDate}>{t.todayAt} {note.date}</span>
                <button className={styles.deleteBtn} onClick={() => deleteNote(note.id)}>
                  {t.deleteBtn}
                </button>
              </div>
              <p className={styles.noteText}>{note.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
