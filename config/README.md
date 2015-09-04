Configuration
=============

Configuration files (typically JSON) are stored in this directory, mirroring the namepath of the prototype intended for
configuration.

For example, configuration for js/myproject/foo/Bar.js would be located in config/myproject/foo/Bar.json

Prototypes that require multiple configuration files may use the prototype name as the directory name. Additional
sub-directories may be created under that as organization requires.

For example, configuration for js/myproject/foo/Bar.js may be contained in both config/myproject/foo/Bar.json as well
as in config/myproject/foo/Bar/topics.json and config/myproject/foo/Bar/authors/JohnBrown.json
