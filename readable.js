module.exports = function(seconds, decimals) {
	var s, m, h, d, st, dt, yt, ps, pm, ph, pd, pf, rv, years, months;
	decimals = parseInt(decimals);
	if (! (isFinite(decimals) && (decimals > 0))) {
		decimals = 0;
	}
	if (decimals > 9) {
		decimals = 9;
	}
	seconds = parseFloat(seconds);
	if (! isFinite(seconds)) {
		return '<invalid>';
	} else if (seconds < 0) {
		return '<negative>';
	}
	m = Math.floor(seconds / 60);
	if (seconds >= Number.MAX_SAFE_INTEGER) {
		f = s = 0;
	} else {
		st = seconds;
		if (decimals > 0) {
			pf = '.';
			for (i = 0; i < decimals; i++) {
				if ((st * 10) >= Number.MAX_SAFE_INTEGER) {
					pf += '0';
				} else {
					st *= 10;
					pf += (Math.floor(st) - (Math.floor(st / 10) * 10)).toFixed(0);
				}
			}
		} else {
			pf = '';
		}
		s = Math.min(59, Math.max(0, Math.floor(seconds) - (m * 60)));
	}
	h = Math.floor(m / 60);
	if (m >= Number.MAX_SAFE_INTEGER) {
		m = 0;
	} else {
		m = Math.min(59, Math.max(0, m - (h * 60)));
	}
	d = Math.floor(h / 24);
	if (h >= Number.MAX_SAFE_INTEGER) {
		h = 0;
	} else {
		h = Math.min(23, Math.max(0, h - (d * 24)));
	}
	years = seconds / (365.2425 * 86400);
	months = Math.min(11, Math.max(Math.floor((years - Math.floor(years)) * 12), 0));
	years = Math.floor(years);
	ps = (('0' + s.toFixed(0)).slice(-2));
	pm = ('0' + m.toFixed(0)).slice(-2);
	ph = ('0' + h.toFixed(0)).slice(-2);
	if (d > 0) {
		pd = '';
		for (dt = d; dt > 0; dt = Math.floor(dt / 10)) {
			if (dt >= Number.MAX_SAFE_INTEGER) {
				pd = '0' + pd;
			} else {
				pd = (dt - (Math.floor(dt / 10) * 10)).toFixed(0) + pd;
			}
		}
	} else {
		pd = '0';
	}
	if (d > 0) {
		rv = (pd + '+' + ph + ':' + pm + ':' + ps + pf);
	} else if (h > 0) {
		rv = (ph + ':' + pm + ':' + ps + pf);
	} else {
		rv = (pm + ':' + ps + pf);
	}
	if ((years >= 20) || ((years >= 1) && (months == 0))) {
		yt = ('≈ ' +
			  ((years < 1000000) ? years.toFixed(0) : years.toExponential(2).replace('e+', '×10^')) +
			  ' year' +
			  ((years != 1) ? 's' : ''));
		if (d >= 1e15) {
			rv = yt;
		} else {
			rv += ' (' + yt + ')'
		}
	} else if (years >= 1) {
		rv += (' (≈ ' +
			   years.toFixed(0) +
			   ' year' +
			   ((years != 1) ? 's' : '') +
			   ' and ' +
			   months.toFixed(0) +
			   ' month' +
			   ((months != 1) ? 's' : '') +
			   ')');
	}
	return rv;
}
