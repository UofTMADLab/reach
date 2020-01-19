#!/usr/bin/env node

const _fs = require('fs');
const _path = require('path');
const version = "1.0.51";
console.log("Making package")

try {
	
	const default360 = _fs.readFileSync("./template/reach-default-360.png.b64");
	const formatCode = _fs.readFileSync("./template/format.js", { encoding : 'utf8' }).replace(/\r\n/g, '\n');
	const reachCode = _fs.readFileSync("./dist/reach-min.js", { encoding : 'utf8' }).replace(/\r\n/g, '\n');
	
	
	var escaped = reachCode.replace(/\\/g, '\\\\');
	escaped = escaped.replace(/"/g, '\\"');
	escaped = escaped.replace(/\n/g, "\\n");
	
	
	var versionAdded = formatCode.replace("{{REACH_VERSION}}", version);
	var codeAdded = versionAdded.replace("{{REACH_CODE}}", function() {return escaped});
	var imageAdded = codeAdded.replace("{{REACH_DEFAULT_360}}", default360);
	
	

	_fs.writeFileSync(`./dist/format-${version}-dist.js`, imageAdded, {encoding: 'utf8'});
	
	console.log("written to ./dist");
} catch (ex) {
	console.log(`Problem: ${ex.message}`);
	process.exit(1);
}
