define(['requirejs', 'http', 'plur/service/Daemon', 'plur/config/Config', 'plur/config/NodeJs', 'plur/obj/Parser', 'plur/exception/Exception'],
function(requirejs, http, PlurServiceDaemon, PlurConfig, PlurNodeJsConfig, PlurObjParser, PlurException) { // no indent
	
var Generic = function(parameters) {
	this._CONFIG = Generic._CONFIG;
	var configs = [];

	for (var i = 0; i < parameters.length; ++i) {
		var p = parameters[i];
		if (p instanceof PlurConfig) {
			if (p.getConfiguredClasspath() === Generic.CLASSPATH) {
				this._CONFIG.merge(p);
			}
		}
	}

	this._serviceClasses = []; // services
	this._requestMap = {}; // key (classpath) -> value ([services])
};

Generic.CLASSPATH = 'plur/service/daemon/Generic';
Generic._CONFIG = new PlurNodeJsConfig(Generic.CLASSPATH);

Generic.prototype = new PlurServiceDaemon();
Generic.prototype.CLASSPATH = Generic.CLASSPATH;

/**
 * Starts the daemon
 */
Generic.prototype.start = function() {
	var self = this;
	var numWaiting = this._CONFIG.serviceClasspaths.length;
	for (var i = 0; i < this._CONFIG.serviceClasspaths.length; ++i) {
		requirejs([this._CONFIG.serviceClasspaths[i]], function(Service) {
			numWaiting--;
			
			// contract checking
			if (typeof(Service.REQUEST_CLASSPATHS.length) === 'undefined') {
				throw new PlurException('Service `' + Service.CLASSPATH + '` is valid. It lacks a REQUEST_CLASSPATHS static property');
			}
			
			// map requests to this service
			for (var j = 0; j < Service.REQUEST_CLASSPATHS.length; ++j) {
				var classpath = Service.REQUEST_CLASSPATHS[j];
				if (typeof(self._requestMap[classpath]) === 'undefined') {
					self._requestMap[classpath] = [Service];
				} else {
					self._requestMap[classpath].push(Service);
				}
			}

			self._serviceClasses.push(Service);
			console.log('Loaded service: ' + Service.CLASSPATH);
			
			if (numWaiting == 0) {
				self._listen();
			}
		});
	}
};

Generic.prototype._listen = function() {
	var self = this;
	http.createServer(function(req, res) {
		var data = '';
		req.on('data', function(chunk) {
			data += chunk;
		});

		req.on('end', function() {
			var obj = JSON.parse(data);
			var classpath = obj.classpath;
			var serviceClasses = self._requestMap[classpath];
			if (typeof(serviceClasses) === 'undefined') {
				res.writeHead(500, {'Content-Type': 'application/json'});
				var e = new PlurException('Unsupported service request: ' + classpath);
				res.end(JSON.stringify(e.toObj()) + "\n");
				return;
			}
			
			
			ObjParser.get().parse(obj, function(request, error) {
				if (error) {
					res.writeHead(500, {'Content-Type': 'application/json'});
					if (!(error instanceof PlurException)) {
						var pe = new PlurException(''+e);
						res.end(JSON.stringify(pe.toObj()) + "\n");
						throw e;
					}
					
					res.end(JSON.stringify(e.toObj()) + "\n");
					return;
				}
				
				for (var s = 0; s < serviceClasses.length; ++s) {
					var service = new serviceClasses[s];
					service.process(request, null, function(response) {
						res.writeHead(200, {'Content-Type': 'application/json'});
						res.end(JSON.stringify(response.toObj()) + "\n");		
					});
				}
			});
		});
	}).listen(self._CONFIG.port, self._CONFIG.ip, function() {
		console.log('Service Daemon is running.');
	});
};

/**
 * Stops the daemon.
 */
Generic.prototype.stop = function() {
};

/**
 * Performs a heartbeat operation (e.g., periodic maintenance, metrics reporting, etc.)
 */
Generic.prototype.heartbeat = function() {
};

return Generic;
}); // no indent