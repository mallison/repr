let intervalID = null; // TODO this means only one timer can run at a time!
let counter;

export default function countdown(numberOfSeconds, tick) {
  counter = numberOfSeconds;
  tick(counter);
  intervalID = setInterval(() => doCountdown(tick), 1000);
}

function doCountdown(tick) {
  counter -= 1;
  tick(counter);
  if (counter === 0) {
    clearInterval(intervalID);
  }
}
