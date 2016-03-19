/*
 *  Simple test for KeepTime class.
 *
 *  Copyright (C) 2012-2015 Timo J. Rinne <tri@iki.fi>
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License version 2 as
 *  published by the Free Software Foundation.
 */

'use strict';

(function() {
	var testTime = 0.5;
	var testTimeGrace = 0.25;
	var KeepTime = require('../keeptime.js');
	var globalTimer = new KeepTime(true);
	var timer = undefined;
	var t1, t2, t3, t4, t5, t6;
	var testNumber = 0;
	var delayedResolve = function(seconds, resolveValue) {
		return new Promise(function (resolve, reject) {
			setTimeout(function() { resolve(resolveValue); }, Math.round(seconds * 1000));
		});
	}

	timer = new KeepTime(true);

	(delayedResolve(testTime)
	 .then(function() {
		 console.log('Test #' + ++testNumber);
		 t1 = timer.get();
		 timer.stop();
		 t2 = timer.get();
		 t3 = timer.get();
		 if (t1 < testTime) {
			 throw new Error('KeepTime returns time smaller than wait.');
		 }
		 if (t1 > (testTime + testTimeGrace)) {
			 throw new Error('KeepTime returns time greater than wait + grace time.');
		 }
		 if (t2 < t1) {
			 throw new Error('KeepTime returns smaller time in subsequent call.');
		 }
		 if (t2 != t3) {
			 throw new Error('KeepTime returns different time in subsequent calls in stopped state.');
		 }
		 console.log('KeepTime returns ' + t1.toFixed(9) + 's' +
					 ' after timeout of ' + testTime.toFixed(4) + 's' +
					 ', which is in acceptable limits.');
		 return delayedResolve(testTime);
	 })
	 .then(function() {
		 console.log('Test #' + ++testNumber);
		 t4 = timer.get();
		 if (t4 != t3) {
			 throw new Error('KeepTime returns different time after wait in stopped state.');
		 }
		 timer.start();
		 return delayedResolve(testTime);
	 })
	 .then(function() {
		 console.log('Test #' + ++testNumber);
		 t5 = timer.get();
		 if (t5 < (2 * testTime)) {
			 throw new Error('KeepTime returns time smaller than wait.');
		 }
		 if (t5 > ((2 * testTime) + testTimeGrace)) {
			 throw new Error('KeepTime returns time greater than wait + grace time.');
		 }
		 console.log('KeepTime returns ' + t5.toFixed(9) + 's' +
					 ' after run time of ' + (testTime*2).toFixed(4) + 's' +
					 ', which is in acceptable limits.');
		 timer.reset();
		 t6 = timer.get();
		 if ((t6 < 0) || (t6 > testTimeGrace)) {
			 throw new Error('KeepTime returns time greater than grace time immediately after reset.');
		 }
		 return;
	 })
	 .then(function() {
		 console.log('Test #' + ++testNumber);
		 var kt = new KeepTime();
		 var i, pt, t;
		 pt = 0;
		 kt.start();
		 for (i = 0; i < 1000000; i++) {
			 t = kt.get();
			 if (t < pt) {
				 throw new Error('KeepTime returns smaller time than last time.');
			 }
			 pt = t;
		 }
		 return;
	 })
	 .then(function() {
		 console.log('Test #' + ++testNumber);
		 var i, s, pp, p = 'Readable time conversions:';
		 var l = p.length;
		 timer.stop();
		 for (i = -12; i <= 100; i++) {
			 s = Math.pow(10, i);
			 timer.set(s);
			 pp = ((((s >= 0.9) && (s < 1000000999)) ? s.toFixed(0) : s.toPrecision(1)) +
				   's -> ' +
				   timer.getReadable((i < 1) ? 9 : 0));
			 if ((l + 1 + pp.length) > 100) {
				 p += "\n  " + pp;
				 l = 2 + pp.length;
			 } else {
				 p += ' ' + pp;
				 l += 1 + pp.length;
			 }
		 }
		 console.log(p);
		 return;
	 })
	 .then(function() {
		 console.log('Test #' + ++testNumber);
		 var y = ((new Date()).getUTCFullYear());
		 var t0 = Date.now() / 1000;
		 var t1 = Date.UTC(y + 1, 0, 1, 0, 0, 0, 0) / 1000;
		 console.log('Time passed after Unix epoch 1970-01-01 00:00:00 UTC is ' + 
					 t0.toFixed(3) +
					 ' seconds, which in readable form is ' +
					 KeepTime.readable(t0, 3) +
					 '.');
		 
		 console.log('Time left till end of the year ' + 
					 y.toFixed() +
					 ' is ' +
					 (t1 - t0).toFixed(3) +
					 ' seconds, which in readable form is ' +
					 KeepTime.readable(t1 - t0, 3) +
					 '.');
		 return;
	 })
	 .then(function() {
		console.log('All OK. Runtime as readable string was: ' + globalTimer.getReadable(9));
		process.exit(0);
	 })
	 .catch(function(e) {
		 throw e;
	 }));
})();
