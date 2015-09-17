#!/bin/sh
# Requires: sudo npm install -g google-closure-compiler

JARFILE="/usr/local/lib/node_modules/google-closure-compiler/compiler.jar"

java -jar $JARFILE --js_output_file=/tmp/out.js 'js/**.js'