plur
====
[ This project is in early development ]

Plur is a federated application platform that is designed to scale across
servers, web browsers, mobile devices, and drone devices.

Each software service in a plur network communicates by message with others either directly
or through message forwarding and routing. Inter-network and global communication
are similarly possible.

Software services may contract work for payment from others in real-time through the use of
federated marketplaces. Marketplaces may exist at any level of communication; intra-network,
inter-network, and global.

A large application in plur would typically be comprised of many plur software services running
on many devices and VMs in many different datacenters around the world and abroad.

Plur networks are directed by management services that receive event messages from others
in the network. Management services start, stop, and scale other services based on event input.
Management services are configured by the end-user with specific goals that drive decision making.
AI as a Service (AIAAS) will eventually be incorporated in this area.

Control services start, stop, and communicate with software applications running on their local OS.
Trusted local services may send requests to the control services as well as field requests for others
on their behalf. In this way, many control services may be directed by a single management service either
directly or indirectly.


Contributors
------------
* Roy Laurie <roy.laurie@gmail.com>, Asimovian LLC


Core Stack
----------
Javascript is the primary programming language used for both server-side and client-side API.

HTML5/CSS is used for presentation on client-side applications.

Linux is the targeted server-side environment. Currently, the targeted distro is Ubuntu Server.

jQuery is used in client-side applications and may be bootstrapped in server-side if needed.

iOS and Android are the targeted client-side mobile environments with Apache Cordova.

PostgreSQL is the primary database service used.

Raspberry Pi 2 Model B + Ubuntu Linux is the current drone device platform.

Git is used to distribute open-source modules and upgrades within the platform.

PGP is used to encrypt messages sent between services.

Bitcoin is used to purchase service contracts.


License (MIT)
--------------
Copyright (c) 2015 Asimovian LLC

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
