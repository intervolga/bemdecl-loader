const path = require('path');
const bemPath = require('./bem-path');

/**
 * Transforms BemDeps to list of dependent files and directories
 *
 * @param {Array} relations
 * @param {Array} levels
 * @return {Array}
 */
function depsForDeps(relations, levels) {
  let files = {};
  relations.forEach((dep) => {
    const file = bemPath(dep, 'deps.js');
    files[file] = true;
  });
  files = Object.keys(files);

  let directories = {};
  files.forEach((file) => {
    let dir = path.dirname(file);
    do {
      directories[dir] = true;
      dir = path.dirname(dir);
    } while (path.dirname(dir) !== dir);
  });
  directories = Object.keys(directories);

  const absLevelPaths = levels.map((level) => {
    return path.resolve(level);
  });

  const result = absLevelPaths.slice();
  files.concat(directories).forEach((item) => {
    absLevelPaths.forEach((level) => {
      result.push(path.join(level, item));
    });
  });

  return result;
}

module.exports = depsForDeps;
