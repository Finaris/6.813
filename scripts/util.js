/*  Created for the memes.
 */
class Util {
    /**
	 * Create multiple event listeners on an element.
     * @return None.
	 */
	static events(target, events, callback) {
		if (callback) {
			events.split(/\s+/).forEach(name => target.addEventListener(name, callback));
		}
		else { // Multiple events and callbacks
			for (var name in events) {
				Util.events(target, name, events[name]);
			}
		}
	}
}
