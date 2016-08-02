"use strict";
const path = require('path');
const koa = require('koa');
const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const favicon = require('koa-favicon');
const logger = require("koa-logger");
const serve = require('koa-static');
const opener = require('opener');
const filewalker = require('./file-walker');
const mdpreview = require('./markdown-preview');

const app = new koa();
const program = require('./command');
const debug = require('debug')('koa');

const ONEWEEK = 3600 * 24 * 7;
const protocol = 'http://';

let cfg = {
	address : program.address,
	port : program.port,
	root : program.root,
	deep : program.deep,
	slient : !!program.slient
};
debug('file walker deep: %d', cfg.deep);
debug('serve address: %s', cfg.address);
debug('root path: %s', cfg.root);
debug('liten port: %d', cfg.port);
debug('auto open browser: %s', cfg.slient);

app.use(compress({
	filter : content_type => {
		return /text/i.test(content_type);
	},
	threshold : 2048,
	flush : require('zlib').Z_SYNC_FLUSH
}));

app.use(favicon(path.join(__dirname, '../public/images/favicon.ico'), {
	maxAge : ONEWEEK
}));

// etag works together with conditional-get
app.use(conditional());
app.use(etag());

// 预览markdown文件
app.use(mdpreview());

app.use(serve(cfg.root, {
	index : false
}));
// 遍历文件，设置深度
app.use(filewalker({
	root : cfg.root,
	deep : cfg.deep
}));

app.use(logger());

app.listen(cfg.port, () => {
	let host = `${protocol}${cfg.address}:${cfg.port}`;
	debug('access address: %s', host);
	!cfg.slient && opener(host, {
		command : null
	});
	process.send && process.send('STARTUP');
});
process.on('message', (msg) => {
	msg == 'CLOSE' && process.exit();
});





