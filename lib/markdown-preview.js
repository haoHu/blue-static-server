"use strict";
const fs = require("fs");
const path = require("path");
const ejs = require('ejs');
const CWD = process.cwd();
const debug = require('debug')('markdown-preview');
const showdown = require('showdown');
const converter = new showdown.Converter();
const send = require('koa-send');

function getRealPath (filePath) {
	return path.join(CWD, filePath);
}

function renderBody (filePath) {
	let tplFile = path.join(__dirname, '../views/mdpreview.ejs');
	let realPath = getRealPath(filePath);
	let tplStr = fs.readFileSync(tplFile, {
		encoding : 'utf8'
	});
	let mdStr = fs.readFileSync(realPath, {
		encoding : 'utf8'
	});
	let html = ejs.render(tplStr, {
		css : '',
		title : path.basename(filePath),
		html : converter.makeHtml(mdStr)
	});
	return html;
}

module.exports = (config) => {
	return (ctx, next) => {
		let filePath = decodeURI(ctx.path);
		debug(`markdown file: ${filePath}`);

		return next().then(() => {
			console.log(ctx.request);
			let extName = path.extname(filePath).slice(1);
			debug(`extName: ${extName}`);
			if (extName === 'md') {
				ctx.body = renderBody(filePath);
				ctx.set('Access-Control-Allow-Origin', '*');
				ctx.set('Content-Type', 'text/html; charset=utf-8');
				debug(`Access Directory: ${filePath}`);
			}
			return;
		}, (err) => {
			debug(err);
			throw err;
		});

	};
};