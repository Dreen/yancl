var jsdom = require('./node_modules/jquery-loader/node_modules/jsdom').jsdom;
var jquery = require('jquery-loader');
var http = require('http');
var https = require('https');

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

/**
headers = {};
body = null; // need underscore method for checking
url = "";
method = "GET";
*/
function Yancl (extension)
{
	for (k in extension)
	{
		console.log('ext[%j] = %j', k, extension[k]);
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

//// create instance
//function _spawn(extension)
//{
//	//for (k in this)
//	//{
//	//	if (typeof this[k] != 'function' && typeof extension[k] != 'undefined')
//	//	{
//	//		extension[k] = this[k];
//	//	}
//	//}
//	return new Yancl(extension);
//}

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
