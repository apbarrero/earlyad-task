#!/usr/bin/env node

var EarlyAd = require('../earlyad');
var isNewerVersion = EarlyAd.isNewerVersion;
var checkDepVersion = EarlyAd.checkDepVersion;
var assert = require('chai').assert;

describe('Early adopter', function() {

   describe('isNewerVersion', function() {

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

   describe('checkDepVersion', function() {

      describe('with git URLs', function() {

         var pack = {
            "name": "foo",
            "version": "1.0.0",
            "dependencies": {
               "bar": "git://github.com/baz/bar.git#1.0.0",
               "bar2": "git://github.com/baz/bar2.git#1.2.3"
            }
         };

         it('should return true if dependency is listed within package with a lesser version', function() {
            assert.ok(checkDepVersion(pack, { url: "git://github.com/baz/bar.git", version: "1.0.1" }));
            assert.ok(checkDepVersion(pack, { url: "git://github.com/baz/bar2.git", version: "1.3.0" }));
         });
         it('should return false if dependency is listed within package with a greater version', function() {
            assert.notOk(checkDepVersion(pack, { url: "git://github.com/baz/bar.git", version: "0.9.0" }));
            assert.notOk(checkDepVersion(pack, { url: "git://github.com/baz/bar2.git", version: "1.1.10" }));
         });
         it('should return false if dependency is listed within package with the same version', function() {
            assert.notOk(checkDepVersion(pack, { url: "git://github.com/baz/bar.git", version: "1.0.0" }));
            assert.notOk(checkDepVersion(pack, { url: "git://github.com/baz/bar2.git", version: "1.2.3" }));
         });
         it('should return false if dependency is not included in package dependencies', function() {
            assert.notOk(checkDepVersion(pack, { url: "git://github.com/baz/notfound.git", version: "1.0.0" }));
         });
      });

      describe('with github \'user/repo\' URLs', function() {
         var pack = {
            "name": "foo",
            "version": "1.0.0",
            "dependencies": {
               "bar": "git://github.com/baz/bar.git#1.0.0",
               "bar2": "git://github.com/baz/bar2.git#1.2.3"
            }
         };

         it('should return true if dependency is listed within package with a lesser version', function() {
            assert.ok(checkDepVersion(pack, { url: "baz/bar", version: "1.0.1" }));
            assert.ok(checkDepVersion(pack, { url: "baz/bar2", version: "1.3.0" }));
         });
         it('should return false if dependency is listed within package with a greater version', function() {
            assert.notOk(checkDepVersion(pack, { url: "baz/bar", version: "0.9.0" }));
            assert.notOk(checkDepVersion(pack, { url: "baz/bar2", version: "1.1.10" }));
         });
         it('should return false if dependency is listed within package with the same version', function() {
            assert.notOk(checkDepVersion(pack, { url: "baz/bar", version: "1.0.0" }));
            assert.notOk(checkDepVersion(pack, { url: "baz/bar2", version: "1.2.3" }));
         });
         it('should return false if dependency is not included in package dependencies', function() {
            assert.notOk(checkDepVersion(pack, { url: "baz/notfound", version: "1.0.0" }));
         });
      });
   });
});

