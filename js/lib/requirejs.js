requirejs.config({
	baseUrl: '../',
	paths: {
		'plur' : 'plur'
		'crypto-js': 'plur/lib/plur/crypto-js',
		'socket.io-client': 'plur/lib/plur/socket.io-client'
	},
	nodeRequire: require,
    enforceDefine: true,
});
