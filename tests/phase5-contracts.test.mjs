import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const root = new URL('../', import.meta.url)
const readJson = relative => JSON.parse(readFileSync(new URL(relative, root), 'utf8'))


test('producer fixture is a pinned read-only roster projection', () => {
  const contract = readJson('contracts/fixtures/hermes-bots.roster.v1.json')
  const schema = readJson('contracts/hermes-bots.roster.v1.schema.json')

  assert.equal(contract.schema, schema.properties.schema.const)
  assert.equal(contract.mode, 'read_only')
  assert.equal(contract.provenance.source, 'hermes-bots')
  assert.match(contract.provenance.source_commit, /^[0-9a-f]{40}$/)
  assert.equal(contract.returned, contract.items.length)

  const allowed = new Set(['name', 'title', 'description', 'role', 'last_session', 'avatar_revision', 'capabilities'])
  for (const item of contract.items) {
    assert.deepEqual(new Set(Object.keys(item)), allowed)
    assert.equal(typeof item.name, 'string')
    assert.equal(typeof item.capabilities, 'object')
    assert.equal('token' in item, false)
    assert.equal('path' in item, false)
  }
})

test('pilot capability manifest does not promote writes or orchestration', () => {
  const pilot = readJson('stark-pilot.json')
  assert.equal(pilot.capabilities.profile_creation, false)
  assert.equal(pilot.capabilities.routines, false)
  assert.equal(pilot.capabilities.lateral_orchestration, false)
})
