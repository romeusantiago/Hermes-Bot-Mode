import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const pluginSource = readFileSync(new URL('../plugin.js', import.meta.url), 'utf8')

function load(hostOverrides = {}) {
  const values = new Map()
  const atom = initial => {
    const slot = { get: () => values.get(slot), set: value => values.set(slot, value) }
    values.set(slot, initial)
    return slot
  }
  const context = {
    atom, PALETTE_AREA: 'palette', COMPOSER_AREAS: { middleware: 'middleware' },
    haptic: () => undefined,
    document: { getElementById: () => null, createElement: () => ({}), head: { appendChild: () => undefined } },
    host: { state: { profile: { listen: () => undefined } }, ...hostOverrides }
  }
  const source = pluginSource
    .replace(/^import\s+\{[\s\S]*?\}\s+from '@hermes\/plugin-sdk'\r?\n/m, '')
    .replace(/^import .* from 'react'\r?\n/m, '')
    .replace(/^import .* from 'react\/jsx-runtime'\r?\n/m, '')
    .replace('export default {', 'globalThis.plugin = {')
    .concat('\nglobalThis.__routines = { createCanonicalChat, openBotSelection, recordRosterStatus, routinePrompt, normalizedProfileName, botMeta: STARK_BOT_META, pullServerAvatars, botMetaAtom: $botMeta };\n')
  vm.runInNewContext(source, context, { filename: 'plugin.js' })
  return context
}

test('unit: direct execution is selected for the active bot profile', () => {
  const { __routines } = load()
  assert.equal(__routines.normalizedProfileName(' Default '), 'default')
  assert.equal(__routines.routinePrompt('default', 'Health', 'Collect status', ' DEFAULT '), 'Collect status')
})

test('integration: a different active profile retains the delegated routine wrapper', () => {
  const { __routines } = load()
  const prompt = __routines.routinePrompt('research', 'Digest', 'Summarize findings', 'default')
  assert.match(prompt, /hermes -p 'research' chat/)
  assert.match(prompt, /\[Scheduled routine\] Summarize findings/)
})

test('security: delegated routine arguments remain literal shell values', () => {
  const { __routines } = load()
  const title = 'Audit $(printf TITLE_EXPANDED) `printf TITLE_TICK` \'quoted\''
  const instruction = 'Line one $(printf TASK_EXPANDED) `printf TASK_TICK`\nLine two \'quoted\''
  const prompt = __routines.routinePrompt('research', title, instruction, 'default')
  const command = prompt.slice(prompt.indexOf('hermes '), prompt.lastIndexOf('\n\nIf the command'))
  const script = `hermes() { printf '%s\\037' "$@"; }\n${command}`
  const result = spawnSync('sh', ['-c', script], { encoding: 'utf8' })

  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(result.stdout.split('\x1f').slice(0, -1), [
    '-p',
    'research',
    'chat',
    '-c',
    `Routine: ${title}`,
    '-q',
    `[Scheduled routine] ${instruction}`
  ])
})

test('regression: Create Cronjob passes the active profile to routinePrompt', () => {
  assert.match(pluginSource, /prompt: routinePrompt\(bot, title, task, activeProfile\)/)
  const { __routines } = load()
  const instruction = 'Keep "quoted" output intact'
  assert.equal(__routines.routinePrompt('ops', 'Check', instruction, 'ops'), instruction)
  assert.doesNotMatch(__routines.routinePrompt('ops', 'Check', instruction, 'ops'), /hermes -p/)
})

test('regression: clicking a fresh STARK bot opens an empty draft without submitting a prompt', async () => {
  const calls = []
  const runtime = load({
    newChat: profile => calls.push(['newChat', profile]),
    request: (method, params) => {
      calls.push(['request', method, params])
      return Promise.resolve({})
    }
  })

  await runtime.__routines.openBotSelection({ name: 'content' })

  assert.deepEqual(calls, [['newChat', 'content']])
})

test('regression: clicking a STARK bot with history only opens its existing session', async () => {
  const calls = []
  const runtime = load({
    openSession: (id, options) => calls.push(['openSession', id, options]),
    request: (method, params) => {
      calls.push(['request', method, params])
      return Promise.resolve({})
    }
  })

  const id = await runtime.__routines.openBotSelection({
    name: 'content',
    last_session: { id: 'stored-session-1' }
  })

  assert.equal(id, 'stored-session-1')
  assert.equal(calls.length, 1)
  assert.equal(calls[0][0], 'openSession')
  assert.equal(calls[0][1], 'stored-session-1')
  assert.equal(calls[0][2].profile, 'content')
})

test('regression: clicking a STARK bot with a valid pin performs only a read and navigation', async () => {
  const calls = []
  const runtime = load({
    openSession: (id, options) => calls.push(['openSession', id, options]),
    request: (method, params) => {
      calls.push(['request', method, params])
      return Promise.resolve({ sessions: [{ id: 'pinned-session' }] })
    }
  })

  await runtime.__routines.openBotSelection(
    { name: 'content', last_session: { id: 'pinned-session' } },
    { chat: 'pinned-session' }
  )

  assert.deepEqual(calls.map(call => call.slice(0, 2)), [
    ['request', 'session.list'],
    ['openSession', 'pinned-session']
  ])
})

test('regression: clicking a STARK bot with a stale pin never updates profile metadata', async () => {
  const calls = []
  const runtime = load({
    openSession: (id, options) => calls.push(['openSession', id, options]),
    request: (method, params) => {
      calls.push(['request', method, params])
      return Promise.resolve({ sessions: [{ id: 'replacement-session' }] })
    }
  })

  await runtime.__routines.openBotSelection(
    { name: 'content', last_session: { id: 'replacement-session' } },
    { chat: 'missing-session' }
  )

  assert.deepEqual(calls.map(call => call.slice(0, 2)), [
    ['request', 'session.list'],
    ['openSession', 'replacement-session']
  ])
  assert.equal(calls.some(call => call[1] === 'profiles.configure'), false)
})

test('defense: canonical chat creation cannot submit a prompt in STARK mode', async () => {
  const calls = []
  const runtime = load({
    request: (method, params) => {
      calls.push(['request', method, params])
      return Promise.resolve({ session_id: 'runtime-session' })
    }
  })

  await runtime.__routines.createCanonicalChat('content')

  assert.deepEqual(calls.map(call => call[1]), ['session.create'])
})

test('system: the STARK pilot registers only the visual Bots pane', () => {
  const runtime = load()
  const registered = []
  const writes = []
  runtime.plugin.register({
    storage: {
      get: () => null,
      set: (key, value) => writes.push([key, value])
    },
    register: entry => registered.push(entry)
  })
  assert.deepEqual(
    registered.map(entry => entry.id),
    ['pane']
  )
  assert.equal(writes.length, 1)
  assert.equal(writes[0][0], 'runtime-status')
  assert.equal(writes[0][1].build, '2026.08-pilot.6')
  assert.equal(writes[0][1].mode, 'visual-only')
  runtime.__routines.recordRosterStatus([{ name: 'default' }, { name: 'dev' }])
  assert.equal(writes[1][0], 'roster-status-2')
  assert.equal(writes[1][1].loaded, true)
  assert.equal(writes[1][1].profiles, 2)
})

test('identity: the visual roster exposes Jarvis plus 13 mythological specialists', () => {
  const { __routines } = load()
  assert.deepEqual(Object.keys(__routines.botMeta), [
    'default', 'automation', 'business', 'clickup', 'content', 'crm', 'dev',
    'ops', 'pm', 'process', 'qa', 'research', 'secondbrain', 'study'
  ])
  assert.equal(__routines.botMeta.default.title, 'Jarvis')
  assert.equal(__routines.botMeta.automation.title, 'Dédalo · Automação')
  assert.equal(__routines.botMeta.qa.title, "Ma'at · Qualidade")
  assert.equal(__routines.botMeta.secondbrain.title, 'Mnemosine · Segundo Cérebro')
})

test('avatar cache: a changed server revision forces the new profile asset to load', async () => {
  const calls = []
  const runtime = load({
    request: async (method, params) => {
      calls.push([method, params])
      return { found: true, data: 'data:image/png;base64,bmV3' }
    }
  })
  runtime.__routines.botMetaAtom.set({
    dev: { image: 'data:image/png;base64,b2xk', avatar_revision: 'new-revision', _avatar_loaded_revision: 'old-revision' }
  })
  runtime.__routines.pullServerAvatars([
    { name: 'dev', has_avatar: true, ui_meta: { 'hermes-bots': { avatar_revision: 'new-revision' } } }
  ])
  await Promise.resolve()
  await Promise.resolve()
  assert.equal(calls.filter(([method]) => method === 'profiles.get_asset').length, 1)
  assert.equal(runtime.__routines.botMetaAtom.get().dev.image, 'data:image/png;base64,bmV3')
  assert.equal(runtime.__routines.botMetaAtom.get().dev._avatar_loaded_revision, 'new-revision')
})

test('performance: direct prompt selection remains bounded', t => {
  const { __routines } = load()
  const start = Date.now()
  for (let index = 0; index < 10000; index += 1) __routines.routinePrompt('ops', 'Check', 'Inspect', 'ops')
  const elapsed = Date.now() - start
  t.diagnostic(`10,000 direct prompt selections: ${elapsed} ms`)
  assert.ok(elapsed < 1000)
})