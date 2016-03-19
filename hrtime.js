'use strict';

module.exports = (function() {
	if ((typeof process === 'object') && process && (typeof process.hrtime === 'function')) {
		return process.hrtime;
	} else {
		var t0 = Date.now(), pt = 0;
		return (function() {
			var t = Date.now() - t0;
			if (t <= pt) {
				t = pt + 0.000001;
			}
			pt = t;
			return [ Math.floor(t / 1000),
					 Math.min(999999999, Math.max(0, (Math.floor(((t / 1000) - Math.floor((t / 1000))) * 1000000000)))) ];
		});
	}
})();
