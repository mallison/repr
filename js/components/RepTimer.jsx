import React, { PropTypes } from 'react';

import countdown from './countdown';

const PHASES = ['down', 'pause', 'up'];
const synth = window.speechSynthesis;
const PHRASES = {
  'prep': new SpeechSynthesisUtterance('prepare'),
  'start': new SpeechSynthesisUtterance('start'),
  'stop': new SpeechSynthesisUtterance('stop'),
  'up': new SpeechSynthesisUtterance('up'),
  'down': new SpeechSynthesisUtterance('down'),
  'pause': new SpeechSynthesisUtterance('pause'),
  'get ready': new SpeechSynthesisUtterance('get ready'),
};
for (let i = 0; i < 10; i += 1) {
  PHRASES[i] = new SpeechSynthesisUtterance(i);
}

for (let k in PHRASES) {
  let phrase = PHRASES[k];
  phrase.lang = 'en-GB';
  phrase.voice = 'Google UK English Female';
  // 'prime' the speaker
  /* 
     phrase.volume = 0;
     speechSynthesis.speak(phrase);
     phrase.volume = 1; */
}

export default class RepTimer extends React.Component {
  state = {
    prep: 5,
    reps: 2,
    down: 3,
    pause: 1,
    up: 3,
    countdown: null
  };

  render() {
    this._sayState();
    let params = ['prep', 'reps'];
    params = params.concat(PHASES);
    let prepCount = this._getPrepCount();
    let phase = this._getPhase();
    let phaseCount = this._getPhaseCount();
    let repCount = this._getRepCount();
    return (
      <div className="row">
        <h1>Repr</h1>
        <div className="form-horizontal">
          {params.map(param => this._renderInput(param))}
        </div>
        <div>
          {this.state.countdown !== null ?
           <div className="jumbotron">
           <h1>
           {phase.toUpperCase()}
           {' '}
           {phaseCount}
           {' '}
           <small>{repCount}</small>
           </h1>
           </div>
          :
           <button
           className="btn btn-success"
           onClick={this._getReady}>Start!</button>
          }
        </div>
      </div>
    );
  }

  _sayState(phase, countdown) {
    if (phase) {
      if (this.state[phase] === countdown) {
        this._say(phase);
      } else if (countdown) {
        this._say(countdown);
      }
    }
  }

  _renderInput(param) {
    return (
      <div className="form-group" key={param}>
        <label className="control-label col-md-2">
          {param.toUpperCase()}{' '}
        </label>
        <div className="col-md-10">
          <input
                  className="form-control"
                  type="number"
                  value={this.state[param]}
                  onChange={this._setValue.bind(this, param)}
          />
        </div>
      </div>
    );
  }

  _setValue(param, e) {
    let time = e.target.value;
    this.setState({[param]: time});
  }

  _getReady = () => {
    let utterance = this._say('get ready');
    utterance.onend = this._countSet;
  };

  _countSet = () => {
    let { reps, prep, down, pause, up } = this.state;
    let totalTime = prep + reps * (down + pause + up);
    countdown(
      totalTime,
      (counter) => this.setState({
        countdown: counter
      })
    );
  };

  _getPrepCount() {
    let { countdown, reps, prep, down, pause, up } = this.state;
    let totalTime = prep + reps * (down + pause + up);
    let currentTime = totalTime - countdown;
    if (currentTime < prep) {
      return currentTime;
    }
  }

  _getPhaseCount() {
    let { countdown, reps, prep, down, pause, up } = this.state;
    let totalTime = prep + reps * (down + pause + up);
    let currentTime = totalTime - countdown;
    if (currentTime < prep) {
      return prep - currentTime;
    }
    currentTime -= prep;
    let repTime = down + pause + up;
    let phaseTime = currentTime % repTime;
    // TODO this is rep time not phase time
    // TODO generalise this to N phases?
    if (phaseTime >= down + pause) {
      return this.state.up - (phaseTime - down - pause);
    } else if (phaseTime >= down) {
      return this.state.pause - (phaseTime - down);
    } else {
      return this.state.down - phaseTime;
    }
  }

  _getRepCount() {
    let { countdown, reps, prep, down, pause, up } = this.state;
    let totalTime = prep + reps * (down + pause + up);
    let currentTime = totalTime - countdown - prep;
    let repTime = down + pause + up;
    console.log(currentTime, repTime, currentTime / repTime);
    return Math.floor(currentTime / repTime);
  }

  _getPhase() {
    let { countdown, reps, prep, down, pause, up } = this.state;
    let totalTime = prep + reps * (down + pause + up);
    let currentTime = totalTime - countdown;
    if (currentTime < prep) {
      return 'prep';
    }
    currentTime -= prep;
    let repDuration = down + pause + up;
    let repTime = currentTime % repDuration;
    // TODO generalise this to N phases?
    if (repTime >= down + pause) {
      return 'up';
    } else if (repTime >= down) {
      return 'pause';
    } else {
      return 'down';
    }
  }

  _stopTimer = () => {
    this._say('stop');
  };

  _say(what) {
    console.log('saying', what);
    let utterThis = PHRASES[what];
    synth.speak(utterThis);
    return utterThis;
  }
}
