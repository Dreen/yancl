var jsdom = require('./node_modules/jquery-loader/node_modules/jsdom').jsdom,
	jquery = require('jquery-loader'),
	http = require('http'),
	https = require('https');

function jquerify(html)
{
	var wnd = jsdom(html).createWindow(),
		$ = jquery.create(wnd);

	return {
		html: html,
		wnd: wnd,
		$: $
	};
}

function Yancl (extension)
{
	this.headers = {};
	this.body = null;
	this.url = null; // need underscore method for checking
	this.method = 'GET';

	for (k in extension)
	{
		console.log('ext[%j] = %j', k, extension[k]); //debug
		this[k] = extension[k];
	}
	this._insted = true;
}
// context
Yancl.prototype._insted = false;

// processors
Yancl.prototype._postproc = [];
Yancl.prototype._preproc = [];
Yancl.prototype._procadd = function(type, proc)
{
	if (typeof proc == 'function')
	{
		this[type + 'proc'].push(proc);
	}
}
Yancl.prototype._process = function(type, data)
{
	var processors = this[type + 'proc'];
	for (p in processors)
	{
		data = processors[p].call(this, data);
	}
	return data;
}

// configure by methods
function _method(m)
{
	return function(url)
	{
		return new Yancl({
			method: m,
			url: url
		});
	};
}
Yancl.get = _method('GET');
Yancl.post = _method('POST');
Yancl.put = _method('PUT');
Yancl.patch = _method('PATCH');
Yancl.delete = _method('DELETE');
Yancl.head = _method('HEAD');
Yancl.options = _method('OPTIONS');

// headers
Yancl.prototype.setHeader = function(k, v)
{
	this.headers[k] = v;
	return this;
};

// MIME
Yancl.MIME = {
	JSON: 'application/json'
	// TODO add rest
};
Yancl.prototype.expectsType = function(t)
{
	if (t in Yancl.MIME)
	{
		return this.setHeader('Accept', Yancl.MIME[t]);
	}
	else
	{
		// TODO error
		return this;	
	}
};
Yancl.prototype.sendsType = function(t)
{
	if (t in Yancl.MIME)
	{
		this.setHeader('Content-Type', Yancl.MIME[t]);
	}
	else
	{
		// TODO error
		return this;	
	}
};
for (t in Yancl.MIME)
{
	var type = t;
	Yancl.prototype['expects' + t] = function()
	{
		return this.expectsType(type);
	};
	Yancl.prototype['sends' + t] = function()
	{
		return this.sendsType(type);
	};
}

module.exports = Yancl;

/*Yancl.prototype.send = function(reqOpts)
{
	http.get('http://m.countdown.tfl.gov.uk/arrivals/48704', function(res)
	{
		res.setEncoding('utf8');
		var buffer = '';
		res.on('data', function (chunk)
		{
			buffer += chunk;
		});
		res.on('end', function()
		{
			var a = jquerify(buffer);
			//console.log(a);
			var b = a.$;
			//console.log(b);
			var c = b('#tfl_logo');
			//console.log(c);
			var d = c.attr('src');
			console.log(d);
		});
	});
}*/
