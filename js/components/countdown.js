let intervalID = null; // TODO this means only one timer can run at a time!
let counter;

export default function countdown(numberOfSeconds, tick, end) {
  counter = numberOfSeconds;
  tick(counter);
  intervalID = setInterval(() => doCountdown(tick, end), 1000);
}

function doCountdown(tick, end) {
  counter -= 1;
  tick(counter);
  if (counter === 0) {
    clearInterval(intervalID);
    if (end) {
      end();
    }
  }
}
