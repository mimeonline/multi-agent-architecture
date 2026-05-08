import Reveal from 'reveal.js';
import RevealNotes from 'reveal.js/plugin/notes/notes.esm.js';
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.esm.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import 'reveal.js/plugin/highlight/monokai.css';
import './styles.css';

const deck = new Reveal({
  hash: true,
  slideNumber: true,
  controls: true,
  progress: true,
  center: true,
  transition: 'fade',
  backgroundTransition: 'fade',
  width: 1280,
  height: 720,
  margin: 0.06,
  plugins: [RevealNotes, RevealHighlight]
});

deck.initialize();
