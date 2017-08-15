const path = require('path');
const b_ = require('@bem/naming')('origin');

/**
 * Convert BemDep to "nested & origin" path
 * Based on slow @bem/fs-scheme/lib/schemes/nested.js
 *
 * @param {Object} dep
 * @param {String} tech
 * @param {String} layer
 * @return {String}
 */
function bemPath(dep, tech, layer) {
  const cell = {
    entity: {
      block: dep.block,
      elem: dep.elem || '',
      mod: dep.mod ? dep.mod : {},
    },
    layer: layer || '',
    tech: tech || '',
  };

  const folder = path.join(
    cell.layer,
    cell.entity.block,
    cell.entity.elem ? (b_.delims.elem + cell.entity.elem) : '',
    cell.entity.mod.name ? (b_.delims.mod.name + cell.entity.mod.name) : ''
  );

  return path.join(folder,
    b_.stringify(cell.entity) + (cell.tech ? '.' + cell.tech : ''));
}

module.exports = bemPath;
