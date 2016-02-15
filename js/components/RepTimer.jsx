import React, { PropTypes } from 'react';

import TimerDisplay from './Timer';
import countdown from './countdown';
import say from './speech';

const PHASES = ['down', 'pause', 'up'];

export default class RepTimer extends React.Component {
  state = {
    prep: 5,
    reps: 8,
    down: 3,
    pause: 1,
    isReversed: false,
    up: 2,
    countdown: null
  };

  render() {
    let params = ['prep', 'reps'];
    let phases = [...PHASES];
    if (this.state.isReversed) {
      phases.reverse();
    }
    params = params.concat(phases);

    /// debug
    let timers = [];
    let { reps, prep, down, pause, up } = this.state;
    for (let i = prep + reps * (down + pause + up); i >= 0; i -= 1) {
      timers.push(<TimerDisplay {...this.state} countdown={i} />);
    }

    return (
      <div className="row">
        <h1>Repr</h1>
        {this.state.countdown === null ?
        <div>
         {params.map(param => this._renderInput(param))}
          <button
                type="button"
                onClick={() => this.setState({isReversed: !this.state.isReversed})}
                className="btn btn-primary btn-block"
                >
          Reverse phases
        </button>
        <button
                type="button"
                className="btn btn-success btn-block"
                onClick={this._getReady}>Start!
        </button>
        </div>
        : null }
        <div>
          {this.state.countdown !== null ? <TimerDisplay {...this.state} /> : null}
        </div>
      </div>
    );
  }

  _renderInput(param) {
    return (
      <div className="form-group" key={param} style={{paddingRight: 5}}>
        <label>
          {param.toUpperCase()}
        </label>
        {' '}
        <input
                className="form-control"
                type="number"
                value={this.state[param]}
                onChange={this._setValue.bind(this, param)}
        />
      </div>
    );
  }

  _setValue(param, e) {
    let time = parseInt(e.target.value, 10);
    this.setState({[param]: time});
  }

  _getReady = () => {
    let utterance = say('get ready');
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
}
