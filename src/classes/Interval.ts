export default class Interval {
  private _callback: Function;
  private _delay: number;
  private _forcedUpdateTime: number;
  private _intervalID: number;
  private _lastUpdateTime: number;
  private _callbackProps: any[];

  constructor(delay: number, callback: Function, callbackProps?: any[]) {
    this._callback = callback;
    this._delay = delay;
    this._intervalID = -1;
    this._forcedUpdateTime = 0;
    this._lastUpdateTime = 0;
    this._callbackProps = callbackProps || [];
  }

  executeNow(moveUpdateTime = true) {
    if(moveUpdateTime) {
      this.stop();
      this.start(true);
    } else {
      this._callback(...this._callbackProps);
      this._forcedUpdateTime = Date.now();
    }
  }
  
  elapsedTimeFromLastUpdate() {
    return Date.now() - (this._forcedUpdateTime || this._lastUpdateTime);
  }
  
  remainingTimeToUpdate() {
    return this._delay - this.elapsedTimeFromLastUpdate();
  }

  start(startImmediately = false) {
    if(this._intervalID !== -1) return false;

    if(startImmediately) {
      this._lastUpdateTime = Date.now();
      this._callback(...this._callbackProps);
    }
    this._intervalID = window.setInterval(() => {
      this._lastUpdateTime = Date.now();
      this._resetForcedUpdateTime();
      this._callback(...this._callbackProps);
    }, this._delay);

    return true;
  }

  stop() {
    if(this._intervalID === -1) return;

    window.clearInterval(this._intervalID);
    this._intervalID = -1;
  }

  setDelay(delay: number) {
    if(delay <= 0) {
      console.log(`Delay can't be: ${delay}.`);
      return -1;
    }

    if(this._intervalID !== -1) {
      this.stop();
    }
    this._delay = delay;
    
    return delay;
  }

  get isRunning() {
    return this._intervalID !== -1;
  }

  get lastUpdateTime() {
    return this._lastUpdateTime;
  }

  setCallbackProps(callbackProps: any[]) {
    this._callbackProps = callbackProps;
  }

  _resetForcedUpdateTime() {
    this._forcedUpdateTime = 0;
  }
};