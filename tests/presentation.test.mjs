import {test} from 'node:test';
import assert from 'node:assert/strict';
import {humanReadable, agentSummary, taskSummary} from '../dist/runtime/utils.js';
test('readable diagnostics preserve nested approval input values',()=>{
 const text=humanReadable({file_path:'/tmp/example',enabled:true,options:{lines:[1,2]}});
 assert.match(text,/file path: \/tmp\/example/);assert.match(text,/enabled: Yes/);assert.match(text,/lines:\n\s+1: 1\n\s+2: 2/);
 assert.equal(humanReadable({}),'None');
});
test('agent reports retain resume IDs, failures, limits and output',()=>{
 assert.equal(agentSummary({id:'resume-id',role:'Explore',status:'turn_limit',turns:3,output:'Found the issue.'}),'Explore — turn limit\nAgent ID: resume-id\nTurns: 3\nFound the issue.');
 assert.match(agentSummary({status:'failed',error:'Unavailable'}),/Error: Unavailable/);
 assert.equal(taskSummary([]),'No tasks.');
});
