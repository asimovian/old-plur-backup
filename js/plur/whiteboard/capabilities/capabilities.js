// left-overs from half-baked service capabilities code. to be redone.


openSession(session) {
    this._sessionMap[session.getId()] = session;
    this._emitter.emit('plur.session.open', {sessionId: session.getId()});
};

/*
 acquireCapabilities(capabilities, minTrust, callback) {
 console.log('Acquiring capabilities with trust >=' + minTrust + ': ', capabilities);
 // search all nodes looking for known capabilities
 // iterate through each node session
 //todo: do this properly, use remote nodes
 for (let id in this._sessionMap) {
 let session = this._sessionMap[id];

 // request capabilities from this session
 session.io.emit('plur.capability.request', {
 capabilities: capabilities,
 minTrust: minTrust - 0.1 // remove .1 per hop. only this node is 1.00
 });

 // look for a valid response
 //TODO: filter and sort results.
 session.io.on('plur.capability.response', function (event, msg, listener) {
 if (typeof msg.sessionId === 'undefined')
 return;

 callback(session, msg.data.capabilities); //TODO: send remote node
 session.io.off(listener);
 });
 }
 };*/

getSession(id) {
    return this._sessionMap[id];
};

closeSession(id) {
    delete this._sessionMap[id];
    this._emitter.emit('plur.session.close', {sessionId: id});
};