'use strict';

const common = require('../common');
const assert = require('assert');
const os = require('os');

const eol = common.isWindows ? '\r\n' : '\n';

assert.strictEqual(eol, os.EOL);

common.expectsError(function() {
  os.EOL = 123;
}, {
  type: TypeError,
  message: /^Cannot assign to read only property 'EOL' of object '#<Object>'$/
});
