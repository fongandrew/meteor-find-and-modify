Package.describe({
  name: 'fongandrew:find-and-modify',
  summary: 'findAndModify implementation for Meteor collection',
  version: '0.1.1',
  git: 'https://github.com/fongandrew/meteor-find-and-modify.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('mongo', ['client', 'server']);
  api.imply('mongo', ['client', 'server'])
  api.addFiles('find_and_modify.js', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('fongandrew:find-and-modify');
  api.addFiles('find_and_modify_tests.js');
});
