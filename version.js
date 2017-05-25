#!/usr/local/bin/node 

const {getCurrent} = require('./lib/version')

var currentVersion = getCurrent()

console.log(currentVersion)