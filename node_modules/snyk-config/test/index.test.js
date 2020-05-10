const { loadConfig } = require('../');
const path = require('path');
const test = require('tape');

test('can be loaded twice', function(t) {
  var config = loadConfig(__dirname + '/fixtures/one');
  t.equal(config.foo, 1, 'config matches');
  t.equal(config.bar, 2, 'config matches');

  var config2 = loadConfig(__dirname + '/fixtures/two');
  t.equal(config2.foo, 10, 'config2 matches');
  t.equal(config2.bar, 20, 'config2 matches');

  t.end();
});

test('env values override', function(t) {
  process.env.SNYK_foo = 100; // jshint ignore:line
  process.env.SNYK_bar__foo = 200; // jshint ignore:line
  process.env.SNYK_complex__colour = 'red'; // jshint ignore:line
  process.env.SNYK_complex__fruit = 'apple'; // jshint ignore:line
  process.env.SNYK_complex__nested__colour = 'purple'; // jshint ignore:line
  process.env.SNYK_complex__nested__nested__fruit = 'banana'; // jshint ignore:line
  process.env.PORT = 8888; // jshint ignore:line
  var config = loadConfig(__dirname + '/fixtures/one');

  t.equal(config.foo, '100', 'config matches');
  t.deepEqual(config.bar, { foo: '200' }, 'object matches');
  t.deepEqual(
    config.complex,
    {
      animal: 'dog',
      colour: 'red',
      fruit: 'apple',
      nested: {
        animal: 'cat',
        colour: 'purple',
        nested: {
          fruit: 'banana',
        },
      },
    },
    'complex object can be merged into',
  );

  delete process.env.SNYK_foo;
  delete process.env.SNYK_bar__foo;
  delete process.env.SNYK_complex__colour;
  delete process.env.SNYK_complex__fruit;
  delete process.env.SNYK_complex__nested__colour;
  delete process.env.SNYK_complex__nested__nested__fruit;
  delete process.env.PORT;

  t.end();
});

test('secret config overrides local and default', function(t) {
  var config = loadConfig(__dirname + '/fixtures/three', {
    secretConfig: __dirname + '/fixtures/three/config.secret.json',
  });

  t.equal(config.foo, 111, 'default value matches');
  t.equal(config.bar, 42, 'secret value matches');
  t.deepEqual(
    config.baz,
    { key1: 'value1', key2: 'value2' },
    'nesting merge ok',
  );

  t.end();
});

test('can be called without a path', function(t) {
  var config = loadConfig(__dirname);
  t.ok(config, 'config loaded without a path');
  t.end();
});

test('env truthy correctly parsed', function(t) {
  process.env.SNYK_foo = 'TRUE'; // jshint ignore:line
  process.env.SNYK_bar = 'FALSE'; // jshint ignore:line
  process.env.SNYK_baz = true; // jshint ignore:line
  process.env.SNYK_zoo = false; // jshint ignore:line

  var config = loadConfig(__dirname + '/fixtures/one');

  t.strictEqual(config.foo, true, 'TRUE becomes boolean true');
  t.strictEqual(config.bar, false, 'FALSE becomes boolean false');
  t.strictEqual(config.baz, true, 'true becomes boolean true');
  t.strictEqual(config.zoo, false, 'false becomes boolean false');

  delete process.env.SNYK_foo;
  delete process.env.SNYK_bar;
  delete process.env.SNYK_baz;
  delete process.env.SNYK_zoo;

  t.end();
});

test('arg truthy correctly parsed', function(t) {
  var config = loadConfig(__dirname + '/fixtures/one');

  t.equal(config.afoo, true, 'truth config matches');
  t.ok(!config.abar, 'false config matches');
  t.equal(config.azoo, 'true', 'strings left as is');

  t.end();
});

test('env var substition throws on missing env vars', function(t) {
  delete process.env.CONFIG_TEST_VALUE;

  try {
    loadConfig(__dirname + '/fixtures/env');
    t.fail('Should have thrown!');
  } catch (err) {
    t.ok(err, 'Throws on missing env vars');
    t.end();
  }
});

test('env var substitution', function(t) {
  var testFixtureValue = 'a fixture value';
  process.env.CONFIG_TEST_VALUE = testFixtureValue;

  var config = loadConfig(__dirname + '/fixtures/env');
  var sourceData = require('./fixtures/env/config.default.json');

  t.equal(config.regular, sourceData.regular, 'regular key matches');

  var replacedValue = sourceData.nested.toBeReplaced.replace(
    /\${CONFIG_TEST_VALUE}/g,
    testFixtureValue,
  );
  t.equal(
    config.nested.toBeReplaced,
    replacedValue,
    'nested substitution works',
  );

  replacedValue = sourceData.toBeReplaced.replace(
    /\${CONFIG_TEST_VALUE}/g,
    testFixtureValue,
  );
  t.equal(config.toBeReplaced, replacedValue, 'substitution works');

  t.end();
});

test('env overrides for which files to read', (t) => {
  const servEnv = __dirname + '/fixtures/serv-env';
  process.env.SERVICE_ENV = 'foo';
  process.env.CONFIG_SECRET_FILE = path.resolve(
    servEnv,
    'config.super-secret.json',
  );
  const config = loadConfig(servEnv);
  t.equal(config.secret, 42);
  t.equal(config.source, 'from-foo');

  delete process.env.SERVICE_ENV;
  delete process.env.CONFIG_SECRET_FILE;
  t.end();
});
