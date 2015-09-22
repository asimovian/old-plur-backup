plur/event/Emitter
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
> var event = 'car/event/Brake';
>
> // Event data created anonymous by another prototype. Dot-walking used to show source-code model
> var event = 'car/event/Factory.Brake'
>
> // Or
> var event = 'car/event/Factory.createEvent.brake'

Wildcards
---------

When specifying an event to subscribe to, end-users may request to subscribe to everything within a given namepath,
using a trailing wildcard character '*'. If only the wildcard character is provided, all events are subscribed to.

For example:

> // Given the following event types:
> //   car/event/control/Brake
> //   car/event/control/Gas
> //   car/event/telemetry/Temperature
>
> // Subscribe to a specific event. Only receives events of type 'car/event/control/stop'.
> var event = 'car/event/control/Brake';
>
> // Subscribe to all events within a namepath. Receives both car/event/control/Brake and car/event/control/Gas.
> var event = 'car/event/control/*';
>
> // Subscribe to all events with a larger namepath. Receives all three events.
> var event = 'car/event/*';
>
> // Receives ALL events received by the emitter.
> var event = '*';
>
> // Receives no events.
> var event = 'bus/*';






