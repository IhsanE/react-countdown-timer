import React, { Component, PropTypes } from 'react'

// Generic Countdown Timer UI component
//
// props:
//   - initialTimeRemaining: Number
//       The time remaining for the countdown (in ms).
//
//   - interval: Number (optional -- default: 1000ms)
//       The time between timer ticks (in ms).
//
//   - formatFunc(timeRemaining): Function (optional)
//       A function that formats the timeRemaining.
//
//   - tickCallback(timeRemaining): Function (optional)
//       A function to call each tick.
//
export default class CountdownTimer extends Component {

  static propTypes = {
    initialTimeRemaining: React.PropTypes.number.isRequired,
    interval: React.PropTypes.number,
    formatFunc: React.PropTypes.func,
    tickCallback: React.PropTypes.func,
    completeCallback: React.PropTypes.func
  }

  defaultProps = {
    interval: 1000,
    formatFunc: null,
    tickCallback: null,
    completeCallback: null,
  }

  state = {
    timeRemaining: this.props.initialTimeRemaining,
    timeoutId: null,
    prevTime: null
  }

  componentWillMount() {
    this.isComponentMounted = false;
  }

  isMounted() {
    return this.isComponentMounted;
  }

  componentDidMount() {
    this.isComponentMounted = true;
    this.tick = this.tick.bind(this)
    this.getFormattedTime = this.getFormattedTime.bind(this)
    this.tick();
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeoutId);
  }

  tick() {
    var currentTime = Date.now();
    var dt = this.state.prevTime ? (currentTime - this.state.prevTime) : 0;
    var interval = this.props.interval;

    // correct for small variations in actual timeout time
    var timeRemainingInInterval = (interval - (dt % interval));
    var timeout = timeRemainingInInterval;

    if (timeRemainingInInterval < (interval / 2.0)) {
      timeout += interval;
    }

    var timeRemaining = Math.max(this.state.timeRemaining - dt, 0);
    var countdownComplete = (this.state.prevTime && timeRemaining <= 0);

    if (this.isMounted()) {
      if (this.state.timeoutId) { clearTimeout(this.state.timeoutId); }
      this.setState({
        timeoutId: countdownComplete ? null : setTimeout(this.tick, timeout),
        prevTime: currentTime,
        timeRemaining: timeRemaining
      });
    }

    if (countdownComplete) {
      if (this.props.completeCallback) { this.props.completeCallback(); }
      return;
    }

    if (this.props.tickCallback) {
      this.props.tickCallback(timeRemaining);
    }

}

getFormattedTime = (milliseconds) => {
  if (this.props.formatFunc) {
    return this.props.formatFunc(milliseconds);
  }

  var totalSeconds = Math.round(milliseconds / 1000);

  var seconds = parseInt(totalSeconds % 60);
  var minutes = parseInt(totalSeconds / 60) % 60;
  var hours = parseInt(totalSeconds / 3600);

  seconds = seconds < 10 ? '0' + seconds : seconds;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  hours = hours < 10 ? '0' + hours : hours;

  return hours + ':' + minutes + ':' + seconds;
}

render() {
  var timeRemaining = this.state.timeRemaining;

  return (
    <div className='timer'>
    {this.getFormattedTime(timeRemaining)}
    </div>
    );
}
}
