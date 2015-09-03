define(['child_process', 'http', 'plur/test/Test', 'plur/db/request/Find', 'plur/db/response/Find', 'plur/db/service/Find', 'plur/file/System', 'plur/config/NodeJs', 'plur/obj/Parser'],
function(child_process, http, PlurTest, PlurDbFindRequest, PlurDbFindResponse, PlurDbFindService, PlurFileSystem, PlurNodeJsConfig, PlurObjParser) { // no indent

var Test = function(callback) {
	PlurTest.call(this, callback);
};

Test.namepath = 'plurtest/db/service/Find';
Test.SUBJECT_namepath = 'plur/db/service/Find';
Test._SERVICE_DAEMON_APP = 'service-daemon.js';
Test._DAEMON_namepath = 'plur/service/daemon/Generic';

Test.prototype = new PlurTest();
Test.prototype.constructor = Test;
Test.prototype.namepath = Test.namepath;
Test.prototype.SUBJECT_namepath = Test.SUBJECT_namepath;

Test.prototype.testProcess = function() {
	// start a service daemon
	var daemonPath = PlurFileSystem.get().getNodeJsAppPath(Test._SERVICE_DAEMON_APP);
	var runtimeConfig = new PlurNodeJsConfig(Test._DAEMON_namepath);
	runtimeConfig.serviceNamepathes = [PlurDbFindRequest.namepath];
	runtimeConfig.port = 1337;
	var runtimeConfigArg = JSON.stringify(runtimeConfig);
	var daemon = child_process.spawn('nodejs', [daemonPath, runtimeConfigArg]);
	daemon.stdout.setEncoding('utf8');
	daemon.stderr.setEncoding('utf8');
	
	var self = this;
	function sendRequest() {
		// attempt to send a db request to the service daemon via http
		var request = new PlurDbFindRequest(self.namepath, ['id', 'name'], ['name ASC'], 2);
		request.where('id', request.GREATER, '0')
		.and('id', request.LESS, '20');	
	
		var client = http.request({
			host: runtimeConfig.ip,
			port: runtimeConfig.port,
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			agent: false
		}, function(res) { // on server response received
			var buffer = '';
			res.on('data', function(data) {
				buffer += data;
			});
			
			res.on('end', function() {
				daemon.kill();
				var input = PlurObjParser.get().parse(JSON.parse(buffer));
				console.log('Input: ', input);
				self.pass('testProcess');
			});
		});
	
		// send request to service daemon
		var output =  JSON.stringify(request.toObj());
		console.log('Output: ', output);
		client.write(output);
		client.end();
	}
	
	daemon.stdout.on('data', function(data) {
		if (data.match(/Service Daemon is running\./)) {
			sendRequest();
		}
	});
	
	daemon.stderr.on('data', function(data) {
		daemon.kill();
		self.fail('testProcess');
	});
};

return Test;
}); // no indent
