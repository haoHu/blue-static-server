#!/usr/bin/env node
"use strict";

// const program = require("commander");
// const version = require("../package.json").version;
const debug = require("debug")('bss');
const program = require("../lib/command");

let startup = require("../lib/startup");

// program
// 	.version(version)
// 	.option('-a --address [address]', 'Address to use [0.0.0.0]', '0.0.0.0', toString)
// 	.option('-p --port <port>', 'Port to use [8080]', '8080', parseInt)
// 	.option('-d --deep <deep>', 'Max showed deep of files [3]', '3', parseInt)
// 	.option('-s --slient', 'Do not open browser window after starting the server')
// 	.option('-h --help', 'Print this list and exit')
// 	.parse(process.argv);



debug("-a %s", program.address);
debug("-p %s", program.port);
debug("-r %s", program.root);
debug("-d %s", program.deep);
debug("-s %s", program.slient);

startup({
	address : program.address == '0.0.0.0' ? '127.0.0.1' : program.address,
	port : program.port,
	root : program.root,
	deep : program.deep,
	slient : !!program.slient
});


