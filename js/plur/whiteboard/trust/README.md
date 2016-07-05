Trust
=====

Let "trust" represent an actor's *prediction* of output quality for a another actor/subject within a context, based on
various expectations, **relative** to its own prediction for *other* known actors/subjects within the same
context.

An actor could be an Application, Service, Node, IP, User, Network, Session, Cloud, etc.

A subject could be a Service, Config, Service+Config, Review, Vote, Change, etc.

Context could be result quality (incorrect results), response time, network relationship, aggregate contexts, etc. 

Expectations could include:
 * Whether a Service was developed by the same Author or not
 * Whether a Node has been sending more than 100 errors per hour or not.
 * Whether an Author's Configs are trusted by other groups of actors or not
 * Whether other Services on the Actor's Node trusts another Node or not
 
With each expectation, the logic surrounding a trust decision must compare whether Actor A is more trusted than Actor B for
every actor it wishes to compare. The aggregate result of these comparisons are then used to create an Ordered List
with each entry trusted less.

Expectations can be thought of as markers against the ordered list to indicate whether an actor/subject should be trusted less or
more than others compared to that same marker.
 
Actors can trust themselves less than another for any given subject and context.

For example:
If an (App) Node does not have a running SQL Service, but another (SQL) Node in the same Network does, the App node
will trust the SQL Node to provide correct SQL Service Responses more than it will itself to do the same.

Grouping contexts together to form aggregate contexts allow the concept of "trust" to be more generally conceptualized.
It allows determining of whether an actor/subject is trusted *in general*, without having to calculate the contextual
details (network, author, quality, etc.).


Trust Networks
--------------

By sharing trust lists with each other, actors can further **predict** trust of actors/subjects by comparing the 
trust predictions of others. Opinions from actors that are trusted more than others will affect the opinion of the
comparing actor in a weighted manner.

Example:
Let comparing actor, Node A, and neighbor Node B exist in Network A, while Node C and Node D exist in their own
respective networks.

If Node A is neutral about Node A, but Node B has communicated to Node A that it trusts Node D more than Node C to run
SQL Service Requests, Node A will decide to trust Node D more.

If another Node, Node Z, joins Network A and communicates, with Node A, it too will decide to trust Node D more than
Node C. This can occur without any prior communication between Node Z and the foreign Nodes C and D, as well as without
any prior communication the Node B - completely via a trusted proxy decision.

Trust Network Registries
------------------------

Trust Network Registries are Services that accept membership registration from actors and in turn allows them to
search for other trust opinions on a given actor/subject and context as well as aggregate metrics on such. It also
allows members to subscribe to changes in trust levels.

Trust Network Registries will be an important aspect of the Plur network ecosystem, as they will allow Nodes and Users to
research potential third-party modules to be imported, review patches, review vendor ratings for a given service or product, etc.
