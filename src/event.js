class AppEvent extends Event {
  constructor(type, data) {
    super(type);
    this.data = data;
    return this;
  }

  dispatch() {
    dispatchEvent(this);
  }

  static listen(type, handler) {
    window.addEventListener(type, handler);
  }

  static remove(type, handler) {
    window.removeEventListener(type, handler);
  }
}

export default AppEvent;
