#!/bin/sh
# @copyright 2015 Asimovian LLC
# @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
#
# Uses Google's Closure Compiler to compile all source files for each plur module available.
# Requires: sudo npm install -g google-closure-compiler

JARFILE="/usr/local/lib/node_modules/google-closure-compiler/compiler.jar"

java -jar $JARFILE --js_output_file=/tmp/out.js 'js/**.js'