define(function() {

var Manager = function(client) {
    this._client = client;
};

Manager.DEFAULT = 'default';
Manager._instances = { /* name => obj */ };

Manager.register = function(name, manager) {
    if (Manager._instances[name]) {
        throw new 'Request manager uninitialized.';
    }

    if (typeof(manager) === 'undefined') {
        manager = name;
        name = Manager.DEFAULT;
    }

    Manager._instances[name] = manager;
};

Manager.init = function(name, client) {
    if (typeof(client) === 'undefined') {
        client = name;
        name = Manager.DEFAULT;
    }

    var m = new Manager(client);
    Manager.register(name, m);
    return m;
};

Manager.get = function(name) {
    if (typeof(name) === 'undefined') {
        name = Manager.DEFAULT;
    }

    if (!Manager._instances[name]) {
        throw new 'Request manager uninitialized.';
    }

    return Manager._instances[name];
};

Manager.prototype = {
    getClient: function() {
        return this._client;
    },

    request: function(request, callback) {
        this._client.send(request, callback);
    }
};

return Manager;
});
