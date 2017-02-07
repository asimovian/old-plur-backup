# Javascript Source #

All JS source files are stored here, organized by namespace.

The term **"namepath"** is used in plur to designate the relative path of a JS file, not including its extension.

For example ...
> js / myproject / Script.js

... would have a namepath of:
> 'myproject/Script'


## JS Directory Structure Standard ##

For **core** libraries that are universal to all related sub-projects:  
> js / **name/space** / foo.js

For all other projects, include the project name:
> js / **project-name** / **name/space** / foo.js

For example, consider a web-based app named Meo that has:
* a core library project for common data models,
* a www project for the web-based gui,
* a bin project for server-side request/response from the gui.

The core project file structure might look like:
> meo / js / meo / stuff / Script.js

The corresponding namepath for the above Script.js would be:
> 'meo/stuff/Script'

The www and bin project file structures would look like:
> meo-www / js / meo-www / meo / urls / Script2.js  
> meo-bin / js / meo-bin / meo / database / Script3.js

The corresponding namepaths for the above www and bin scripts above would be:
> 'meo-www/meo/urls/Script2'  
> 'meo-bin/meo/database/Script3'







