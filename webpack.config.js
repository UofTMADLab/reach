module.exports = {
	entry: {
		min: './src/index.js',
		// dev: './src/index.js'
	},
	output: {
		filename: 'reach-[name].js',
		path: __dirname + '/dist'
	}
};