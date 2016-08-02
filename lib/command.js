"use strict";

const program = require("commander");
const version = require("../package.json").version;

module.exports = program
	.version(version)
	.option('-a --address [address]', 'Address to use [0.0.0.0]', '0.0.0.0', toString)
	.option('-p --port <port>', 'Port to use [8080]', '8080', parseInt)
	.option('-r --root <root>', 'Static server root path', '.', toString)
	.option('-d --deep <deep>', 'Max showed deep of files [3]', '3', parseInt)
	.option('-s --slient', 'Do not open browser window after starting the server')
	.option('-h --help', 'Print this list and exit')
	.parse(process.argv);

