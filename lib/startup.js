"use strict";
const fork = require('child_process').fork;
const path = require('path');
let CWD;
const _ = require('lodash');
const debug = require('debug')('startup');

let startup = config => {
	let args = [];
	_.forEach(config, (v, k) => {
		if (typeof v == 'boolean') {
			v && args.push(`--${k}`)
		} else {
			args.push(`--${k}`);
			args.push(v);
		}
	});
	try{
		process.chdir(config.root);
		CWD = process.cwd();
		let ps = fork(path.join(__dirname, 'koa.js'), args, {
			env : process.env,
			cwd : CWD,
			stdio : [
				process.stdin,
				process.stdout,
				process.stderr
			]
		});
		ps.on('exit', () => {
			debug('done');
			process.exit();
		});
		ps.on('error', e => {
			debug('Error: %s', e.message);
			throw e;
		});
		ps.on('message', msg => {
			process.send && process.send(msg);
		});
		process.on('message', msg => {
			ps.send && ps.send(msg);
		});
	} catch (err) {
		debug(err);
	}
};

module.exports = startup;