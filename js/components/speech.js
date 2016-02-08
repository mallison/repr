const synth = window.speechSynthesis;

const PHRASES = {
  'prep': new SpeechSynthesisUtterance('prepare'),
  'start': new SpeechSynthesisUtterance('start'),
  'stop': new SpeechSynthesisUtterance('stop'),
  'up': new SpeechSynthesisUtterance('up'),
  'down': new SpeechSynthesisUtterance('down'),
  'pause': new SpeechSynthesisUtterance('pause'),
  'get ready': new SpeechSynthesisUtterance('get ready')
};

for (let i = 0; i < 10; i += 1) {
  PHRASES[i] = new SpeechSynthesisUtterance(i);
}

for (let k in PHRASES) {
  let phrase = PHRASES[k];
  phrase.lang = 'en-GB';
  phrase.voice = 'Google UK English Female';
}

export default function say(utterance) {
  let utterThis = PHRASES[utterance];
  synth.speak(utterThis);
  return utterThis;
}
