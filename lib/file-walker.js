"use strict";
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const CWD = process.cwd();
const debug = require('debug')('file-walker');

function getRealPath (filePath) {
	return path.join(CWD, filePath);
}

function isDir(filePath) {
	let realPath = getRealPath(filePath);
	return fs.existsSync(realPath) && fs.statSync(realPath).isDirectory();
}

// 递归查找路径下内容
function fileWalker(dirPath, deep) {
	let realPath = getRealPath(dirPath);
	if (deep == 0) return [];
	let nodes = fs.readdirSync(realPath).map(name => {
		if (name.indexOf('.') == 0) return null;
		let filePath = path.join(dirPath, name);
		return {
			name : name,
			children : isDir(filePath) ? fileWalker(filePath, deep - 1) : null,
			path : filePath
		};
	}).filter(f => !!f);
	return nodes;
}

// 列表数据的html
function toHtml (list) {
	return list.map((item) => {
		return item.children ? 
			`
				<li>
					<span>${item.name}</span>
					<a title="${item.name}" href="${item.path}" class="fa fa-fw fa-arrow-right"></a>
					<ul>
						${toHtml(item.children)}
					</ul>
				</li>
			` : 
			`
				<li>
					<a title="${item.name}" href="${item.path}">${item.name}</a>
				</li>
			`
	}).join('');
}

// 格式化路径面包线
function mapBreads(filePath) {
	let fullPath = '/';
	debug("filePath: %s", filePath);
	return filePath.split('/').filter(p => !!p).map(p => {
		fullPath += p + '/';
		return {
			name : p,
			path : fullPath
		};
	});
}

// 渲染目录页面body
function renderBody (deep, filePath, root) {
	let tplFile = path.join(__dirname, '../views/dir.ejs');
	let tplStr = fs.readFileSync(tplFile, {
		encoding : 'utf8'
	});
	let cssStr = fs.readFileSync(path.join(__dirname, '../public/stylesheets/list.css'), {
		encoding : 'utf8'
	});
	let realPath = getRealPath(filePath);
	// let breads = mapBreads(filePath);
	let breads = mapBreads(root);
	let html = toHtml(fileWalker(filePath, deep));
	let renderData = {
		css : cssStr,
		breads : breads,
		title : filePath,
		html : html,
		realPath : realPath
	};
	debug("breads");
	debug(renderData.breads);
	return ejs.render(tplStr, renderData);
}

module.exports = (config) => {
	let deep = config.deep;
	let root = config.root;
	return (ctx, next) => {
		let filePath = decodeURI(ctx.path);
		let realPath = getRealPath(filePath);
		ctx.path = root;
		debug(`filePath:${filePath}`);
		debug(`realPath:${realPath}`);

		// before
		return next().then(() => {
			// after
			// 判断文件不存在
			if (!fs.existsSync(realPath)) {
				ctx.status = 404;
				return;
			}

			// 判断不是目录
			if (!isDir(filePath)) {
				return;
			}

			// 目录的处理
			ctx.body = renderBody(config.deep, filePath, root);
			ctx.set('Access-Control-Allow-Origin', '*');
			debug(`Access Directory: ${realPath}`);
		}, (err) => {
			debug(err);
			throw err;
		});
	};
};