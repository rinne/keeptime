/*
 *  KeepTime
 *
 *  KeepTime class is a simple way to create a timer object, that
 *  measures the real time passing. The timer can be
 *  started/stopped/restarted and the value of the timer (in seconds)
 *  can be looked up.
 *
 *  Copyright (C) 2012-2015 Timo J. Rinne <tri@iki.fi>
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License version 2 as
 *  published by the Free Software Foundation.
 */

'use strict';

var hrtime = require('./hrtime');

var KeepTime = function(autoStart) {
    this.timerStart = hrtime();
    this.timerStop = autoStart ? undefined : [ this.timerStart[0], this.timerStart[1] ];
};

KeepTime.readable =  (function(csr) {
	return function(seconds, decimals) {
		if (csr === undefined) {
			csr = require('./readable.js');
		}
		return csr(seconds, decimals);
	};
})();

KeepTime.prototype.get = function() {
    var time = this.timerStop ? this.timerStop : hrtime();
    return (time[0] - this.timerStart[0]) + ((time[1] - this.timerStart[1]) * 0.000000001);
};

KeepTime.prototype.set = function(seconds) {
	seconds = parseFloat(seconds);
	if (! isFinite(seconds)) {
		e = new Error('Bad timer value');
		e.name = 'TypeError';
		throw e;
	}
	if (seconds < 0) {
		e = new Error('Can\'t set timer to negative value');
		e.name = 'RangeError';
		throw e;
	}
	var running = (! this.timerStop);
	if ((seconds * 10) > Number.MAX_SAFE_INTEGER) {
		this.timerStart = [ -(Math.round(seconds)), 0 ];
	} else {
		this.timerStart =
			[ -(Math.ceil(seconds)),
			  Math.floor(Math.min(999999999, Math.max(0, -((seconds - Math.ceil(seconds)) * 1000000000)))) ];
	}
	this.timerStop = [0, 0];
	if (running) {
		this.start();
	}
};

KeepTime.prototype.getArray = function() {
    var time = this.timerStop ? this.timerStop : hrtime();
    var rv = [ time[0] - this.timerStart[0], time[1] - this.timerStart[1] ];
    if (rv[1] < 0) {
		rv[0] -= 1;
		rv[1] += 1000000000;
    }
    return rv;
};

KeepTime.prototype.stop = function() {
    if (this.timerStop) {
		return false;
    }
    this.timerStop = hrtime();
    return true;
};

KeepTime.prototype.start = function() {
    if (! this.timerStop) {
		return false;
    }
    var diff = [ this.timerStop[0] - this.timerStart[0], this.timerStop[1] - this.timerStart[1] ];
    if (diff[1] < 0) {
		diff[0] -= 1;
		diff[1] += 1000000000;
    }
    var time = hrtime();
    this.timerStart = [ time[0] - diff[0], time[1] - diff[1] ];
    if (this.timerStart[1] < 0) {
		this.timerStart[0] -= 1;
		this.timerStart[1] += 1000000000;
    }
    this.timerStop = undefined;
    return true;
};

KeepTime.prototype.reset = function() {
    this.timerStart = this.timerStop ? [ this.timerStop[0], this.timerStop[1] ] : hrtime();
};

KeepTime.prototype.getReadable = function(decimals) {
	return KeepTime.readable(this.get(), decimals);
};

module.exports = KeepTime;
