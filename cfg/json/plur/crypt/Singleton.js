{
    "cryptSingleton": {
        "ciphers": {
            "symmetric": {
                "PGP": { "namepath": "plur/config/Config", "configuredNamepath": "plur/crypt/asymmetric/PGP",
                    "pgp": {
                        "aeadProtect": true
                    }
                }
            },

            "asymmetric": {
                "AES256": { "namepath": "plur/config/Config", "configuredNamepath": "plur/crypt/symmetric/AES",
                    "keySize": 256
                },
                "AES192": { "namepath": "plur/config/Config", "configuredNamepath": "plur/crypt/symmetric/AES",
                    "keySize": 192
                }
            }
        }
    }
}