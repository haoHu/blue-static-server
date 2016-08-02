var app = require("../app");
var expect = require("chai").expect;

describe('startup', function () {
	it('startup -p 9000 -a 127.0.0.1 -d 3 -r .', function () {
		app({
			address : '127.0.0.1',
			port : 8080,
			deep : 3,
			root : '.'
		});
	});
});