#!/usr/bin/env node

var isNewerVersion = require('../earlyad');
var assert = require('chai').assert;

describe('Early adopter', function() {

   it('should return true if new version is greater than current', function() {
      assert.ok(isNewerVersion('1.2.3', '1.2.2'));
      assert.ok(isNewerVersion('1.4.1', '1.3.1'));
      assert.ok(isNewerVersion('2.3.1', '1.3.1'));
      assert.ok(isNewerVersion('1.4.1', '1.3.12'));
      assert.ok(isNewerVersion('1.15.0', '1.8.12'));
      assert.ok(isNewerVersion('2.0.0', '1.8.10'));
      assert.ok(isNewerVersion('10.0.0', '9.2.18'));
   });
   it('should return false if new version is lesser than current', function() {
      assert.notOk(isNewerVersion('1.2.1', '1.2.2'));
      assert.notOk(isNewerVersion('1.4.1', '1.5.1'));
      assert.notOk(isNewerVersion('2.3.1', '3.3.1'));
      assert.notOk(isNewerVersion('1.4.12', '1.5.1'));
      assert.notOk(isNewerVersion('1.0.15', '1.2.1'));
      assert.notOk(isNewerVersion('2.9.0', '3.0.10'));
      assert.notOk(isNewerVersion('9.1.12', '10.0.1'));
   });
   it('should return false if any parameter is non-compliant with semantic version', function() {
      assert.notOk(isNewerVersion('1.2.3', 'foo'));
      assert.notOk(isNewerVersion('foo', '1.2.3'));
      assert.notOk(isNewerVersion('foo', 'bar'));
      assert.notOk(isNewerVersion('1.2.3', '1.0'));
      assert.notOk(isNewerVersion('1.0', '1.2.3'));
      assert.notOk(isNewerVersion('1.0', '1.0'));
      assert.notOk(isNewerVersion('1.2.3', '42'));
      assert.notOk(isNewerVersion('42', '1.2.3'));
      assert.notOk(isNewerVersion('42', '42'));
      assert.notOk(isNewerVersion('1.2.3', '1.2.3foo'));
      assert.notOk(isNewerVersion('1.2.3foo', '1.2.3'));
      assert.notOk(isNewerVersion('1.2.3foo', '1.2.3foo'));
   });
});

