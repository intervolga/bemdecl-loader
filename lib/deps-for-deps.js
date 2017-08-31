const path = require('path');
const bemDirs = require('@intervolga/bem-utils').bemDirs;
const dirsExist = require('@intervolga/bem-utils').dirsExist;

/**
 * Transforms BemDeps to list of dependent directories and files
 *
 * @param {Array} relations
 * @param {Array} levels
 * @return {Promise}
 */
function depsForDeps(relations, levels) {
  // Get directories from BemDeps
  const dirs = bemDirs(relations);

  // Get all (with sub-) directories
  let allDirs = {};
  dirs.forEach((targetDir) => {
    allDirs[targetDir] = true;

    let subDir = path.dirname(targetDir);
    do {
      allDirs[subDir] = true;
      subDir = path.dirname(subDir);
    } while (path.dirname(subDir) !== subDir);
  });
  allDirs = Object.keys(allDirs);

  // Join dirs with levels
  const paths = levels.slice();
  levels.forEach((level) => {
    allDirs.forEach((dir) => {
      paths.push(path.join(level, dir));
    });
  });

  // Search for existing directories
  return dirsExist(paths).then((result) => {
    return Object.keys(result).filter((dir) => {
      return true === result[dir];
    });
  });


  //
  // let files = {};
  // relations.forEach((dep) => {
  //   const file = bemPath(dep, 'deps.js');
  //   files[file] = true;
  // });
  // files = Object.keys(files);
  //
  // let directories = {};
  // files.forEach((file) => {
  //   let dir = path.dirname(file);
  //   do {
  //     directories[dir] = true;
  //     dir = path.dirname(dir);
  //   } while (path.dirname(dir) !== dir);
  // });
  // directories = Object.keys(directories);
  //
  // const absLevelPaths = levels.map((level) => {
  //   return path.resolve(level);
  // });
  //
  // const result = absLevelPaths.slice();
  // files.concat(directories).forEach((item) => {
  //   absLevelPaths.forEach((level) => {
  //     const fileName = path.join(level, item);
  //     result.push(fileName);
  //     // if (fs.existsSync(fileName)) {
  //     // }
  //   });
  // });
  //
  // return result;
}

module.exports = depsForDeps;
