TODO
----

Refactor SQL Statement data-model out of DB Request prototype. Create design/LinkedList. Refactor SQL Statement model
to use new LinkedList prototypes.

DB Request should be refactored into SQL DB Request and should manage an array of statements to be sent to the
SQL DB Service.

DB Find Service should be refactored into SQL DB Service and accept any valid SQL statement.

SQL Statement should provide a **complete** list of keywords for each dialect (*PostgreSQL*, MySQL, etc.). Put more
emphasis on **advanced** use of a single dialect rather than **simple** use of many dialects. Many ORM-type APIs attempt
to "dumb-down" their SQL API in in attempt to reach a wider market - at the cost of technical debt arising wherever
complexity is needed. The dumbed-down approach also claims to limit code migration issues when switching between SQL
software, but this is almost never the case in reality - there are always code changes required during DB migrations.
