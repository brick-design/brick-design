module.exports = {
	presets: [
		[
			'@babel/preset-env',
			'@babel/preset-typescript',
			{
				modules: false,
				targets: {
					browsers: ['>0.25%, not dead'],
				},
			},
		],
	],
	plugins: [
		'@babel/proposal-class-properties',
		'@babel/proposal-object-rest-spread',
	],
}
