plur
====
![Image of "plur"] (https://raw.githubusercontent.com/asimovian/plur/master/doc/plur.png)

(This project is in an early development stage.)

Plur is a distributed application platform that is intended to scale across networks of virtual machines. The framework
is designed to improve cross-platform code re-use by allowing most of the same libraries to be used on both backend and
fronted applications.

One or more plur services run on each plur network node (application), communicating with other services either directly
or through message forwarding and routing either across private networks or the Internet at large.

Plur networks are controlled by management services that receive and react to metrics from other plur services as well
as directives by the network administrators. Management services start, stop, and reconfigure other plur
services dynamically, based on changing operational requirements.

Typical third-party software services used in production environments (e.g., PostgreSQL, Memcached, etc.) are locked down and
only interacted with through plur messaging API presented by custom plur services.


Contributors
------------
* Roy Laurie \<<roy.laurie@asimovian.software>\>, Asimovian LLC


Core Stack
----------
Javascript is the primary programming language used for both server-side and client-side API.

Linux is the targeted server-side environment. 

HTML5/CSS is used for presentation on client-side applications.

PostgreSQL is the primary database service used.

Git is used to distribute open-source modules and upgrades within the platform.


License (MIT)
--------------
Copyright (c) 2016 Asimovian LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
