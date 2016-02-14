#!/usr/bin/env node

var isNewerVersion = require('../earlyad');
var assert = require('chai').assert;

console.log(isNewerVersion);

describe('Early adopter', function() {

   it('should properly detect a version update', function() {
      assert.ok(isNewerVersion('1.2.3', '1.2.2'));
   });
});

