import React, { PropTypes } from 'react';

const PHASES = ['down', 'pause', 'up'];
const synth = window.speechSynthesis;
const PHRASES = {
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
  phrase.lang = 'en-EN';
  // 'prime' the speaker
  /* phrase.voice = 'Google UK English Female';
     phrase.volume = 0;
     speechSynthesis.speak(phrase);
     phrase.volume = 1; */
}

export default class RepTimer extends React.Component {
  state = {
    down: 3,
    pause: 1,
    up: 5,
    isPlaying: false,
    phase: null,
    currentTime: null
  };

  render() {
    return (
      <div className="row">
        <h1>Repr</h1>
        <div className="form-horizontal">
          {PHASES.map(phase => this._renderTimeInput(phase))}
        </div>
        <div>
          {this.state.isPlaying ?
           <div className="jumbotron">
           <h1>{this.state.phase.toUpperCase()} {this.state.currentTime}</h1>
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

  _renderTimeInput(phase) {
    return (
      <div className="form-group">
        <label className="control-label col-md-2">
          {phase.toUpperCase()}{' '}
        </label>
        <div className="col-md-10">
          <input
                  className="form-control"
                  type="number"
                  value={this.state[phase]}
                  onChange={this._setTime.bind(this, phase)}
          />
        </div>
      </div>
    );
  }

  _setTime(phase, e) {
    let time = e.target.value;
    this.setState({[phase]: time});
  }

  _getReady = () => {
    let utterance = this._say('get ready');
    utterance.onend = this._startTimer;
  };

  _startTimer = () => {
    if (this.state.isPlaying) {
      return;
    }
    this.setState({
      isPlaying: true,
      phase: 'down',
      currentTime: this.state['down']
    },
      () => {
        this._say('start');
        this._tick = setInterval(this._advanceTimer, 1000);
      }
    );
  };

  _advanceTimer = () => {
    //    console.log('time', this.state.currentTime);
    let currentTime = this.state.currentTime;
    if (currentTime === 1) {
      this._advancePhase(this.state.phase);
    } else {
      currentTime -= 1;
      this.setState({
        currentTime: currentTime}
        , () => this._say(currentTime));
    }
  };

  _advancePhase(finishedPhase) {
    let index = PHASES.findIndex(phase => phase === finishedPhase);
    if (index === 2) {
      this._stopTimer();
    } else {
      let nextPhase = PHASES[index + 1];
      this.setState({
        phase: nextPhase,
        currentTime: this.state[nextPhase]
      },
        () => this._say(nextPhase)
      );
    }
  }

  _stopTimer() {
    this._say('stop');
    clearInterval(this._tick);
    this.setState({
      isPlaying: false,
      phase: null,
      currentTime: null
    });
  }

  _say(what) {
    let utterThis = PHRASES[what];
    synth.speak(utterThis);
    return utterThis;
  }
}
