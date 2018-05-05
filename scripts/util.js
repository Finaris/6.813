class Util {
  /**
   * Set multiple event listeners on an element
   */
  static events(target, events, callback) {
    if (callback) {
      events.split(/\s+/).forEach(name => target.addEventListener(name, callback));
    } else { // Multiple events and callbacks
      for (var name in events) {
        Util.events(target, name, events[name]);
      }
    }
  }

  /**
   * @param delay {number} number of milliseconds
   * @returns {Promise} gets resolved after the delay
   */
  static delay(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Create an element and set a bunch of attributes on it
   * @param tag {String}
   * @param attributes {Object}
   * @returns {Element}
   */
  static create(tag, attributes) {
    var element = document.createElement(tag);

    for (var name in attributes) {
      element.setAttribute(name, attributes[name]);
    }

    return element;
  }

  /**
   * Get a parameter from the URL query string
   * @param name {String}
   */
  static getURLParam(name) {
    return new URL(location).searchParams.get(name);
  }

  /**
   * Get one element by selector
   * @param selector {String}
   * @returns {Element}
   */
  static one(selector) {
    return document.querySelector(selector);
  }

  /**
   * Get all elements that match a selector as an array
   * @param selector {String}
   * @returns {Array<Element>}
   */
  static all(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  /**
   * Return a promise that is resolved after all animations of a given name
   * have stopped on one or more elements.
   * Caveat: The animations need to be *already* applied when this is called.
   * @param target {Element|Array<Element>}
   * @param animationName {String}
   */
  static afterAnimation(target, animationName) {
    target = Array.isArray(target) ? target : [target];
    var animating = target.filter(candy => getComputedStyle(candy).animationName.includes(animationName));

    return Promise.all(animating.map(el => Util.when(el, "animationend", evt => evt.animationName == animationName)));
  }

  /**
   * Returns a promise that is resolved when the event fires
   * @param target {EventTarget|Array<EventTarget>}
   * @param eventName {String}
   * @param test {callback} resolved when the event fires
   */
  static async when(target, eventName, test = evt => true) {
    if (Array.isArray(target)) {
      return Promise.all(target.map(a => Util.when(a, eventName, test)));
    }

    var callback;
    var evt = await new Promise(resolve => {
      target.addEventListener(eventName, callback = evt => {
        if (test(evt)) {
          resolve(evt);
        }
      });
    });

    target.removeEventListener(eventName, callback);
    return evt;
  }
}