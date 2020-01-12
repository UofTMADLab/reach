#!/usr/bin/env node

const _fs = require('fs');
const _path = require('path');
const version = "0.0.35";
console.log("Making package")

try {
	const reachCode = _fs.readFileSync("./dist/reach-min.js", { encoding : 'utf8' }).replace(/\r\n/g, '\n');
	const default360 = _fs.readFileSync("./template/reach-default-360.png.b64");
	const formatCode = _fs.readFileSync("./template/format.js", { encoding : 'utf8' }).replace(/\r\n/g, '\n');
	
	
	
	var escaped = reachCode.replace(/\\/g, '\\\\');
	escaped = escaped.replace(/"/g, '\\"');
	escaped = escaped.replace(/\n/g, "\\n");
	
	var codeAdded = formatCode.replace("{{REACH_VERSION}}", version);
	codeAdded = codeAdded.replace("{{REACH_DEFAULT_360}}", default360);
	codeAdded = codeAdded.replace("{{REACH_CODE}}", escaped);
	

	_fs.writeFileSync(`./dist/format-${version}-dist.js`, codeAdded, {encoding: 'utf8'});
	
	console.log("written to ./dist");
} catch (ex) {
	console.log(`Problem: ${ex.message}`);
	process.exit(1);
}
