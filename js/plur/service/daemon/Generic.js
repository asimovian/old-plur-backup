/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requirejs http plur/service/Daemon plur/config/Config plur/config/NodeJs plur/obj/Parser plur/excaption/Error
 */
define([
    'requirejs',
    'http',
    'plur/service/Daemon',
    'plur/config/Config',
    'plur/config/NodeJs',
    'plur/obj/Parser',
    'plur/error/Error' ],
function(
    requirejs,
    http,
    PlurServiceDaemon,
    PlurConfig,
    PlurNodeJsConfig,
    PlurObjParser,
    PlurError ) {

//todo: There is overlap between Service, Daemon, and Generic Daemon. They need to be broken apart properly.
//There is nothing Generic about this Service daemon, it's opening a websocket service up.

/**
 * A generic daemon that handles Request messages for any number of registered Services, routing them once validated.
 *
 * @constructor plur/service/daemon/Generic
 **
 * @param {PlurConfig[]} parameters
 */
var GenericDaemon = function(parameters) {
	this._CONFIG = GenericDaemon._CONFIG;
	this._serviceClasses = []; // services
	this._requestMap = {}; // key (namepath) -> value ([services])

	var configs = [];

	for (var i = 0; i < parameters.length; ++i) {
		var p = parameters[i];
		if (p instanceof PlurConfig) {
			if (p.getConfiguredNamepath() === GenericDaemon.namepath) {
				this._CONFIG.merge(p);
			}
		}
	}
};

GenericDaemon.prototype = PlurObject.create('plur/service/daemon/Daemon', GenericDaemon);

/**
 * Starts the daemon
 */
GenericDaemon.prototype.start = function() {
	var self = this;
	var numWaiting = this._CONFIG.serviceNamepaths.length;
	for (var i = 0; i < this._CONFIG.serviceNamepaths.length; ++i) {
		requirejs([this._CONFIG.serviceNamepaths[i]], function(Service) {
			numWaiting--;
			
			// contract checking
			if (typeof(Service.REQUEST_NAMEPATHS.length) === 'undefined') {
				throw new PlurError('Service `' + Service.namepath + '` is valid. It lacks a REQUEST_NAMEPATHS static property');
			}
			
			// map requests to this service
			for (var j = 0; j < Service.REQUEST_NAMEPATHS.length; ++j) {
				var namepath = Service.REQUEST_NAMEPATHS[j];
				if (typeof(self._requestMap[namepath]) === 'undefined') {
					self._requestMap[namepath] = [Service];
				} else {
					self._requestMap[namepath].push(Service);
				}
			}

			self._serviceClasses.push(Service);
			console.log('Loaded service: ' + Service.namepath);
			
			if (numWaiting == 0) {
				self._listen();
			}
		});
	}
};

GenericDaemon.prototype._listen = function() {
	var self = this;

	http.createServer(function(req, res) {
		var data = '';
		req.on('data', function(chunk) {
			data += chunk;
		});

		req.on('end', function() {
			var obj = JSON.parse(data);
			var namepath = obj.namepath;
			var serviceClasses = self._requestMap[namepath];
			if (typeof(serviceClasses) === 'undefined') {
				res.writeHead(500, {'Content-Type': 'application/json'});
				var e = new PlurError('Unsupported service request: ' + namepath);
				res.end(JSON.stringify(e.toObj()) + "\n");
				return;
			}
			
			
			ObjParser.get().parse(obj, function(request, error) {
				if (error) {
					res.writeHead(500, {'Content-Type': 'application/json'});
					if (!(error instanceof PlurError)) {
						var pe = new PlurError(''+e);
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
GenericDaemon.prototype.stop = function() {
};

/**
 * Performs a heartbeat operation (e.g., periodic maintenance, metrics reporting, etc.)
 */
GenericDaemon.prototype.heartbeat = function() {
};

return GenericDaemon;
});