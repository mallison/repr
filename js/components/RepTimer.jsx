import React, { PropTypes } from 'react';

import TimerDisplay from './Timer';
import countdown from './countdown';
import say from './speech';

const PHASES = ['down', 'pause', 'up'];

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
    let params = ['prep', 'reps'];
    params = params.concat(PHASES);

    /// debug
    /* let timers = [];
       let { reps, prep, down, pause, up } = this.state;
       for (let i = prep + reps * (down + pause + up); i >= 0; i -= 1) {
       timers.push(<TimerDisplay {...this.state} countdown={i} />);
       } */

    return (
      <div className="row">
        <h1>Repr</h1>
        <div className="form-horizontal">
          {params.map(param => this._renderInput(param))}
        </div>
        <div>
          {this.state.countdown !== null ?
           <TimerDisplay {...this.state} />
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
