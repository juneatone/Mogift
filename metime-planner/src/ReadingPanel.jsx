import { useState } from 'react';
import styles from './ReadingPanel.module.css';

const articles = {
  en: [
    {
      category: "Life & Wisdom",
      emoji: "🌿",
      items: [
        { title: "The Art of Doing Nothing — Why Rest Is Productive", url: "https://psyche.co/ideas/the-art-of-doing-nothing-why-rest-is-productive", source: "Psyche" },
        { title: "How to Live Slowly in a Fast World", url: "https://www.theguardian.com/lifeandstyle/2019/jul/06/how-to-live-slowly-in-a-fast-world", source: "The Guardian" },
        { title: "The Magic of Ordinary Days", url: "https://www.nytimes.com/guides/smarterliving/how-to-be-more-mindful", source: "NYT" },
        { title: "You Don't Have to Be Productive All the Time", url: "https://hbr.org/2020/08/you-dont-have-to-be-productive-all-the-time", source: "HBR" },
      ]
    },
    {
      category: "Buddha Stories",
      emoji: "🪷",
      items: [
        { title: "The Mustard Seed — A Story of Grief and Letting Go", url: "https://www.buddhanet.net/e-learning/buddhism/bt-story11.htm", source: "BuddhaNet" },
        { title: "The Blind Men and the Elephant", url: "https://www.sacred-texts.com/bud/btg/btg29.htm", source: "Sacred Texts" },
        { title: "The River and the Raft — On Not Clinging", url: "https://www.accesstoinsight.org/tipitaka/mn/mn.022.than.html", source: "Access to Insight" },
        { title: "The Two Arrows — Pain vs Suffering", url: "https://www.lionsroar.com/the-second-arrow/", source: "Lion's Roar" },
      ]
    },
    {
      category: "Short Stories with Morals",
      emoji: "📖",
      items: [
        { title: "The Necklace by Guy de Maupassant", url: "https://americanliterature.com/author/guy-de-maupassant/short-story/the-necklace", source: "American Lit" },
        { title: "The Gift of the Magi by O. Henry", url: "https://americanliterature.com/author/o-henry/short-story/the-gift-of-the-magi", source: "American Lit" },
        { title: "The Happy Prince by Oscar Wilde", url: "https://www.gutenberg.org/files/902/902-h/902-h.htm", source: "Project Gutenberg" },
        { title: "The Last Leaf by O. Henry", url: "https://americanliterature.com/author/o-henry/short-story/the-last-leaf", source: "American Lit" },
      ]
    }
  ],
  mr: [
    {
      category: "जीवन आणि ज्ञान",
      emoji: "🌿",
      items: [
        { title: "आराम हेच उत्पादकता आहे — का?", url: "https://psyche.co/ideas/the-art-of-doing-nothing-why-rest-is-productive", source: "Psyche" },
        { title: "मंद जगणे — एक कला", url: "https://www.theguardian.com/lifeandstyle/2019/jul/06/how-to-live-slowly-in-a-fast-world", source: "The Guardian" },
        { title: "साध्या दिवसांचे जादू", url: "https://www.nytimes.com/guides/smarterliving/how-to-be-more-mindful", source: "NYT" },
        { title: "तुम्हाला नेहमी उत्पादक असणे आवश्यक नाही", url: "https://hbr.org/2020/08/you-dont-have-to-be-productive-all-the-time", source: "HBR" },
      ]
    },
    {
      category: "बुद्धाच्या कथा",
      emoji: "🪷",
      items: [
        { title: "मोहरीचे दाणे — दुःख आणि सोडून देणे", url: "https://www.buddhanet.net/e-learning/buddhism/bt-story11.htm", source: "BuddhaNet" },
        { title: "आंधळे माणसे आणि हत्ती", url: "https://www.sacred-texts.com/bud/btg/btg29.htm", source: "Sacred Texts" },
        { title: "नदी आणि तराफा — आसक्तीवर", url: "https://www.accesstoinsight.org/tipitaka/mn/mn.022.than.html", source: "Access to Insight" },
        { title: "दोन बाण — वेदना विरुद्ध दुःख", url: "https://www.lionsroar.com/the-second-arrow/", source: "Lion's Roar" },
      ]
    },
    {
      category: "बोधकथा",
      emoji: "📖",
      items: [
        { title: "हार — गाय द मोपासाँ", url: "https://americanliterature.com/author/guy-de-maupassant/short-story/the-necklace", source: "American Lit" },
        { title: "मागींची भेट — ओ. हेन्री", url: "https://americanliterature.com/author/o-henry/short-story/the-gift-of-the-magi", source: "American Lit" },
        { title: "आनंदी राजकुमार — ऑस्कर वाइल्ड", url: "https://www.gutenberg.org/files/902/902-h/902-h.htm", source: "Project Gutenberg" },
        { title: "शेवटचे पान — ओ. हेन्री", url: "https://americanliterature.com/author/o-henry/short-story/the-last-leaf", source: "American Lit" },
      ]
    }
  ]
};

export default function ReadingPanel({ lang }) {
  const [expanded, setExpanded] = useState(null);
  const data = articles[lang];

  return (
    <div className={styles.panel}>
      {data.map((section, i) => (
        <div key={i} className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <span>{section.emoji} {section.category}</span>
            <span className={styles.chevron}>{expanded === i ? '▲' : '▼'}</span>
          </button>
          {expanded === i && (
            <div className={styles.links}>
              {section.items.map((item, j) => (
                <a
                  key={j}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <span className={styles.linkTitle}>{item.title}</span>
                  <span className={styles.linkSource}>{item.source} →</span>
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
