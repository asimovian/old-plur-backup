plur / event / Emitter
==================

The Plur library uses its own home-rolled event emitter to handle simple event-driven execution and communication.

Emitter uses a Publisher/Subscriber model to allow end-users to subscribe to topic strings, automatically executing the
subscriber's callback function each time the subscribed topic is published. The callback function receives both the
topic string and the published data.

Emitter represents the topic / data relationship in the model as event / data. Similarly, the Emitter prototype uses
the term "emit" to represent "publish".

Event strings are expected to start with the namepath of the prototype for that event type (delimited by the / character),
if it exists, or the prototype handling it if the former is anonymous. Further separation is expected by dot-walking.

For example:

> // Event data is modeled by a prototype  
> myEmitter.emit('car/event/Brake', function(event, data) { /* ... */ });  
>  
> // Event data created anonymous by another prototype. Dot-walking used to show source-code model  
> myEmitter.emit('car/event/Factory.Brake', function(event, data) { /* ... */ });  
>  
> // Or  
> myEmitter.emit('car/event/Factory.createEvent.brake', function(event, data) { /* ... */ });  

Wildcards
---------

When specifying an event to subscribe to, end-users may request to subscribe to everything within a given namepath,
using a trailing wildcard character '*'. If only the wildcard character is provided, all events are subscribed to.

For example:

> // Given the following event types:  
> // -- car/event/control/Brake  
> // -- car/event/control/Gas  
> // -- car/event/metric/Temperature  
> // -- car/event/metric/FluidLevel.Oil  
> // -- car/event/metric/FluidLevel.Fuel  
>  
> // Subscribe to a specific event. Only receives events of type car/event/control/Brake.  
> myEmitter.on('car/event/control/Brake', function(event, data) { /* ... */ });  
>  
> // Subscribe to all events within a namepath. Receives both control/Brake and control/Gas.  
> myEmitter.on('car/event/control/\*', function(event, data) { /* ... */ });  
>  
> // Subscribe to all events within a namepath. Receives both FluidLevel.Oil and FluidLevel.Fuel.  
> myEmitter.on('car/event/metric/FluidLevel.\*', function(event, data) { /* ... */ });  
>
> // Subscribe to all events with a larger namepath. Receives all five events.  
> myEmitter.on('car/event/\*', function(event, data) { /* ... */ });  
>  
> // Receives ALL events received by the emitter.  
> myEmitter.on('\*', function(event, data) { /* ... */ });  
>  
> // Receives no events, in this case.  
> myEmitter.on('bus/\*', function(event, data) { /* ... */ });  






