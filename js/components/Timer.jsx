import React from 'react';

import say from './speech';

export default class Timer extends React.Component {
  render() {
    let phase = this._getPhase();
    let phaseCount = this._getPhaseCount();
    let repCount = this._getRepCount();
    this._say(phase, phaseCount);
    return (
      <div className="jumbotron">
        <h1>
          {repCount < this.props.reps ?
           `${phase.toUpperCase()} ${phaseCount} ` : null }
          {repCount > 0 ?
           <small>Completed reps: {repCount}</small> : null }
        </h1>
      </div>
    );
  }

  _say(phase, phaseCount) {
    if (this.props.countdown === 0) {
      say('stop');
    } else if (this.props[phase] === phaseCount) {
      say(phase);
    } else {
      say(phaseCount);
    }
  }

  // TODO factor out duplication in these methods
  _getPhaseCount() {
    let { countdown, reps, prep, down, pause, up } = this.props;
    let phases = this._getPhases();
    let repTime = down + pause + up;
    let totalTime = prep + reps * repTime;
    let currentTime = totalTime - countdown;
    if (currentTime < prep) {
      return prep - currentTime;
    }
    currentTime -= prep;
    let phaseTime = currentTime % repTime;
    // TODO this is rep time not phase time
    // TODO generalise this to N phases?
    if (phaseTime >= phases[0].count + pause) {
      return phases[1].count - (phaseTime - phases[0].count - pause);
    } else if (phaseTime >= phases[0].count) {
      return this.props.pause - (phaseTime - phases[0].count);
    } else {
      return phases[0].count - phaseTime;
    }
  }

  _getRepCount() {
    let { countdown, reps, prep, down, pause, up } = this.props;
    let totalTime = prep + reps * (down + pause + up);
    let currentTime = totalTime - countdown - prep;
    let repTime = down + pause + up;
    return Math.floor(currentTime / repTime);
  }

  _getPhase() {
    let { countdown, reps, prep, down, pause, up } = this.props;
    let phases = this._getPhases();
    let repDuration = down + pause + up;
    let totalTime = prep + reps * repDuration;
    let currentTime = totalTime - countdown;
    if (currentTime < prep) {
      return 'prep';
    }
    currentTime -= prep;
    let repTime = currentTime % repDuration;
    // TODO generalise this to N phases?
    if (repTime >= phases[0].count + pause) {
      return phases[1].name;
    } else if (repTime >= phases[1].count) {
      return 'pause';
    } else {
      return phases[0].name;
    }
  }

  _getPhases() {
    let phases = [
        {name: 'down', count: this.props.down},
        {name: 'up', count: this.props.up}
    ];
    if (this.props.isReversed) {
      phases.reverse();
    }
    return phases;
  }
}
