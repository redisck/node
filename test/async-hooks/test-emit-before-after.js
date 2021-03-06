'use strict';

const common = require('../common');
const assert = require('assert');
const spawnSync = require('child_process').spawnSync;
const async_hooks = require('async_hooks');
const initHooks = require('./init-hooks');

switch (process.argv[2]) {
  case 'test_invalid_async_id':
    async_hooks.emitBefore(-1);
    break;
  case 'test_invalid_trigger_id':
    async_hooks.emitBefore(1, -1);
    break;
}

const c1 = spawnSync(process.execPath, [__filename, 'test_invalid_async_id']);
assert.strictEqual(c1.stderr.toString().split('\n')[0],
                   'Error: before(): asyncId or triggerId is less than zero ' +
                   '(asyncId: -1, triggerId: -1)');
assert.strictEqual(c1.status, 1);

const c2 = spawnSync(process.execPath, [__filename, 'test_invalid_trigger_id']);
assert.strictEqual(c2.stderr.toString().split('\n')[0],
                   'Error: before(): asyncId or triggerId is less than zero ' +
                   '(asyncId: 1, triggerId: -1)');
assert.strictEqual(c2.status, 1);

const expectedId = async_hooks.newUid();
const expectedTriggerId = async_hooks.newUid();
const expectedType = 'test_emit_before_after_type';

// Verify that if there is no registered hook, then nothing will happen.
async_hooks.emitBefore(expectedId);
async_hooks.emitAfter(expectedId);

initHooks({
  onbefore: common.mustCall((id) => assert.strictEqual(id, expectedId)),
  onafter: common.mustCall((id) => assert.strictEqual(id, expectedId)),
  allowNoInit: true
}).enable();

async_hooks.emitInit(expectedId, expectedType, expectedTriggerId);
async_hooks.emitBefore(expectedId);
async_hooks.emitAfter(expectedId);
