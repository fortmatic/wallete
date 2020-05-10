'use strict';

const GemVersion = require('./ruby/gem-version');
const GemRequirement = require('./ruby/gem-requirement');
const _comparison = require('./comparison');
const compare = _comparison.compare;
const rcompare = _comparison.rcompare;

module.exports = {
  validRange,
  satisfies,
  maxSatisfying,
  minSatisfying,
  intersects,
  gtr: () => { throw new Error('Not implemented'); },
  ltr: () => { throw new Error('Not implemented'); },
  outside: () => { throw new Error('Not implemented'); },
};

function _createRequirement(range) {
  return GemRequirement.create(range.split(','));
}

function _expandTildes(gemRequirement) {
  const requirements = [];
  gemRequirement.requirements.forEach((req) => {
    const op = req[0];
    const version = req[1];
    if (op.indexOf('~') !== -1) {
      requirements.push(`>= ${version}`);
      requirements.push(`< ${version.bump()}`);
    } else {
      requirements.push(`${op} ${version}`);
    }
  });
  return GemRequirement.create(requirements);
}

function validRange(range) {
  if (range === null || range === undefined) { return null; }
  if (range === '') { return GemRequirement.default().toString(); }

  try {
    let requirement = _createRequirement(range);
    if (range.indexOf('~') !== -1) {
      requirement = _expandTildes(requirement);
    }
    return requirement.toString();
  } catch (err) {
    return null;
  }
}

function satisfies(version, range) {
  try {
    return _createRequirement(range).satisfiedBy(
      GemVersion.create(version));
  } catch (err) {
    return false;
  }
}

function _firstSatisfying(versions, range, compareFunction) {
  const requirement = _createRequirement(range);
  const maxSatisfying = versions
    .map(v => GemVersion.create(v))
    .sort(compareFunction)
    .find(v => requirement.satisfiedBy(v));
  return maxSatisfying ? maxSatisfying.toString() : null;
}

function maxSatisfying(versions, range) {
  return _firstSatisfying(versions, range, rcompare);
}

function minSatisfying(versions, range) {
  return _firstSatisfying(versions, range, compare);
}

function intersects(r1, r2) {
  try {
    const range1 = _expandTildes(_createRequirement(r1));
    const range2 = _expandTildes(_createRequirement(r2));
    return intersectLeftRight(range1, range2) || intersectLeftRight(range2, range1);
  } catch (e) {
    return false;
  }
}

function intersectLeftRight(leftRange, rightRange) {
  for (const [ op, version ] of leftRange.requirements) {
    if (op === '!=') {
      continue;
    }

    if (rightRange.satisfiedBy(version)) {
      if (op === '' || op === '=' || op === '>=' || op === '<=') {
        return true;
      } else if (op === '<' || op === '>') {
        const negOp = op === '<' ? '>=' : '<=';
        if (rightRange.requirements
          .every(([ op2, ver2 ]) => !(
               (op2 === negOp || (op2 || '=') === '=') && ver2.compare(version) === 0
          ))
        ) {
          return true;
        }
      }
    } else {
      // Handle cases where leftRange can intersect rightRange without any of
      // leftRange's versions satisfying rightRange:

      // 1. When both ranges have '>' or '<' parts that are identical.
      if (op === '>' || op === '<') {
        if (rightRange.requirements
          .some(([ op2, ver2 ]) =>
              (op2 || '=') === op && ver2.compare(version) === 0
          )
        ) {
          return true;
        }
      }

      // 2. When rightRange has a '!=' requirement that specifically excludes
      // the edge, but otherwise it would have been included.
      if (op === '>' || op === '>=' || op === '<' || op === '<=') {
        if (rightRange.requirements.some(( [ op2 ]) => op2 === '!=')) {
          const newRange = new GemRequirement(
            rightRange
              .asList()
              .filter(reqStr => !reqStr.startsWith('!='))
          );
          if (newRange.satisfiedBy(version)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}
