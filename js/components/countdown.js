let intervalID = null;
let counter;

export default function countdown(numberOfSeconds, tick) {
  counter = numberOfSeconds;
  tick(counter);
  intervalID = setInterval(() => doCountdown(tick), 1000);
}

function doCountdown(tick) {
  counter -= 1;
  console.log('countdown', counter);
  if (counter === 0) {
    clearInterval(intervalID);
  } else {
    tick(counter);
  }
}
