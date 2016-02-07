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
    prep: 2,
    reps: 2,
    down: 2,
    pause: 1,
    up: 2,
    phase: null,
    currentTime: null,
    currentRep: null
  };

  render() {
    let params = ['prep', 'reps'];
    params = params.concat(PHASES);
    return (
      <div className="row">
        <h1>Repr</h1>
        <div className="form-horizontal">
          {params.map(param => this._renderInput(param))}
        </div>
        <div>
          {this.state.currentTime !== null ?
           <div className="jumbotron">
           <h1>
           {this.state.phase.toUpperCase()}
           {' '}
           {this.state.currentTime}
           {' '}
           <small>{this.state.currentRep}</small>
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

  _renderInput(param) {
    return (
      <div className="form-group">
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
    utterance.onend = this._startPrepare;
  };

  _startPrepare = () => {
    this.setState({
      phase: 'prep',
      currentTime: this.state.prep
    },
      () => this._prepInterval = setInterval(this._prepare, 1000)
    );
  };

  _prepare = () => {
    if (this.state.currentTime === 1) {
      clearInterval(this._prepInterval);
      this.setState({
        currentTime: null,
        currentRep: 0
      }, this._startTimer
      );
    } else {
      this._say(this.state.currentTime - 1);
      this.setState({
        currentTime: this.state.currentTime - 1
      });
    }
  };

  _startTimer = () => {
    if (this.state.currentTime !== null) {
      return;
    }
    this.setState({
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
      if (this.state.currentRep === this.state.reps) {
        this._stopTimer();
      } else {
        this._startRep();
      }
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

  _startRep() {
    this.setState({
      phase: null,
      currentTime: null,
      currentRep: this.state.currentRep + 1
    },
      this._advancePhase
    );
  }

  _stopTimer() {
    this._say('stop');
    clearInterval(this._tick);
    this.setState({
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
