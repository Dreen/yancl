var jsdom = require('./node_modules/jquery-loader/node_modules/jsdom').jsdom;
var jquery = require('jquery-loader');
var http = require('http');

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

function test()
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
}

test();