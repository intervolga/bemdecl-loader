const loaderUtils = require('loader-utils');
const nodeEval = require('node-eval');
const bemDeps = require('@bem/deps');
const depsForDeps = require('./lib/deps-for-deps');

/**
 * BemDeps loader
 *
 * @param {String} source
 */
function bemDepsLoader(source) {
  const callback = this.async();

  // Prepare options
  const options = {
    levels: [],
  };
  Object.assign(options, loaderUtils.getOptions(this));

  // Load deps
  const self = this;
  bemDeps.load({levels: options.levels}).then((relations) => {
    const bemDecl = nodeEval(source);

    // Resolve deps
    return bemDeps.resolve(bemDecl, relations).entities;
  }).then((bemDeps) => {
    // Mark dependecies
    depsForDeps(bemDeps, options.levels).forEach((fileName) => {
      self.addDependency(fileName);
    });

    callback(null, 'module.exports = ' + JSON.stringify(bemDeps) + ';');
  }).catch(callback);
}

module.exports = bemDepsLoader;
