import test from 'ava';

import { intersects } from '../../';

// intersects(range1, range2): Return true if the ranges intersect.

function testIntersects(r1, r2) {
  const res1 = intersects(r1, r2);
  const res2 = intersects(r2, r1);
  if (res1 !== res2) {
    throw new Error(`Inconsistent result: ${r1} vs. ${r2}`)
  }
  return res1;
}

test('intersects(range1, range2)', t => {
  t.true(testIntersects('1.1', '>= 1.1'));
  t.true(testIntersects('1.1.5', '1.1.5'));
  t.true(testIntersects('1.4.11', '>= 1.3, < 1.5'));

  t.false(testIntersects('1.0', '>= 1.1'));
  t.false(testIntersects('1.2.5', '1.1.2'));
  t.false(testIntersects('1.5.2', '>= 1.3, < 1.5'));

  t.true(testIntersects('1.1.5', '~> 1.1.2'));
  t.true(testIntersects('>=1.1.5', '~> 1.1.2'));
  t.false(testIntersects('1.2.5', '~> 1.1.2'));
  t.false(testIntersects('>=1.2.5', '~> 1.1.2'));
  t.false(testIntersects('>=2.1.1', '~> 1.1.2'));
  t.false(testIntersects('<=1.1.0', '~> 1.1.2'));
  t.false(testIntersects('<1.1.2', '~> 1.1.2'));
  t.true(testIntersects('<=1.1.2', '~> 1.1.2'));

  t.true(testIntersects('1.1.5', '~> 1.1'));
  t.true(testIntersects('1.2.5', '~> 1.1'));
  t.false(testIntersects('2.1.1', '~> 1.1'));
  t.true(testIntersects('>=1.1.0', '~> 1.1'));
  t.true(testIntersects('<=1.1.0', '~> 1.1'));
  t.false(testIntersects('<1.1.0', '~> 1.1'));
  t.true(testIntersects('>=1.1.5', '~> 1.1'));
  t.true(testIntersects('>=1.2.0', '~> 1.1'));
  t.true(testIntersects('>1.2.0', '~> 1.1'));
  t.false(testIntersects('>=2.0.0', '~> 1.1'));

  t.false(testIntersects('1.2.1', 'nonsense'));

  t.true(testIntersects('1.0', '1.0'));
  t.false(testIntersects('1.0', '1.1'));

  t.false(testIntersects('1.0', '!=1.0'));
  t.true(testIntersects('1.0', '!=1.1'));

  t.true(testIntersects('>1.0', '>2.0, <4.0'));
  t.true(testIntersects('<3.0', '>2.0, <4.0'));
  t.true(testIntersects('>1.0, <3.0', '>2.0, <4.0'));

  t.true(testIntersects('>1.0', '>1.0'));
  t.true(testIntersects('>1.0', '>=1.0'));
  t.true(testIntersects('>=1.0', '>1.0'));
  t.true(testIntersects('>=1.0', '>=1.0'));

  t.true(testIntersects('>1.0', '>1.0, < 2.0'));
  t.true(testIntersects('>1.0', '>=1.0, < 2.0'));
  t.true(testIntersects('>=1.0', '>1.0, < 2.0'));
  t.true(testIntersects('>=1.0', '>=1.0, < 2.0'));

  t.true(testIntersects('1.0', '>=1.0'));
  t.false(testIntersects('1.0', '>1.0'));

  t.true(testIntersects('<2.0', '<=2.0'));
  t.true(testIntersects('<2.0', '<2.0'));
  t.true(testIntersects('<=2.0', '<=2.0'));
  t.true(testIntersects('<=2.0', '<2.0'));

  t.true(testIntersects('<2.0', '>1.0, <2.0'));
  t.true(testIntersects('<=2.0', '>1.0, <2.0'));
  t.true(testIntersects('<2.0', '>1.0, <=2.0'));
  t.true(testIntersects('<=2.0', '>1.0, <=2.0'));

  t.true(testIntersects('2.0', '<=2.0'));
  t.false(testIntersects('2.0', '<2.0'));

  t.true(testIntersects('2.0', '>1.0, <3.0'));
  t.false(testIntersects('2.0', '>1.0, <3.0, !=2.0'));

  t.true(testIntersects('>1.0, !=2.0, <3.0', '>2.0, !=3.0, <4.0'));

  t.false(testIntersects('<1.0.0, >2.0.0', '>1.4.0 <1.6.0'));
  t.true(testIntersects('>1.0.0, <=2.0.0', '2.0.0'));
  t.false(testIntersects('<1.0.0, >=2.0.0', '2.1.0'));
  t.true(testIntersects('>=1.0.0', '<=1.0.0'));
  t.false(testIntersects('>1.0.0, <1.0.0', '<=0.0.0'));
});
