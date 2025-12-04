// Import all unit data files DIRECTLY (not as raw text)
// This is more reliable than parsing

// Engineering Graphics
import egUnit1 from './engineering-graphics/unit1.js';
import egUnit2 from './engineering-graphics/unit2.js';
import egUnit3 from './engineering-graphics/unit3.js';
import egUnit4 from './engineering-graphics/unit4.js';
import egUnit5 from './engineering-graphics/unit5.js';

// Basic Electrical & Electronics Engineering
import beeeUnit1 from './basic-electrical-and-electronics-engineering/unit1.js';
import beeeUnit2 from './basic-electrical-and-electronics-engineering/unit2.js';
import beeeUnit3 from './basic-electrical-and-electronics-engineering/unit3.js';
import beeeUnit4 from './basic-electrical-and-electronics-engineering/unit4.js';
import beeeUnit5 from './basic-electrical-and-electronics-engineering/unit5.js';
import beeeUnit6 from './basic-electrical-and-electronics-engineering/unit6.js';

// Engineering Physics
import epUnit1 from './engineering-physics/unit1.js';
import epUnit2 from './engineering-physics/unit2.js';
import epUnit3 from './engineering-physics/unit3.js';
import epUnit4 from './engineering-physics/unit4.js';
import epUnit5 from './engineering-physics/unit5.js';

// Introduction to Programming
import itpUnit1 from './introduction-to-programming/unit1.js';
import itpUnit2 from './introduction-to-programming/unit2.js';
import itpUnit3 from './introduction-to-programming/unit3.js';
import itpUnit4 from './introduction-to-programming/unit4.js';
import itpUnit5 from './introduction-to-programming/unit5.js';

// Linear Algebra & Calculus
import lacUnit1 from './linear-algebra-and-calculus/unit1.js';
import lacUnit2 from './linear-algebra-and-calculus/unit2.js';
import lacUnit3 from './linear-algebra-and-calculus/unit3.js';
import lacUnit4 from './linear-algebra-and-calculus/unit4.js';
import lacUnit5 from './linear-algebra-and-calculus/unit5.js';

// Unit map by subject and unit number
export const unitsMap = {
  'engineering-graphics': {
    1: egUnit1,
    2: egUnit2,
    3: egUnit3,
    4: egUnit4,
    5: egUnit5,
  },
  'basic-electrical-and-electronics-engineering': {
    1: beeeUnit1,
    2: beeeUnit2,
    3: beeeUnit3,
    4: beeeUnit4,
    5: beeeUnit5,
    6: beeeUnit6,
  },
  'engineering-physics': {
    1: epUnit1,
    2: epUnit2,
    3: epUnit3,
    4: epUnit4,
    5: epUnit5,
  },
  'introduction-to-programming': {
    1: itpUnit1,
    2: itpUnit2,
    3: itpUnit3,
    4: itpUnit4,
    5: itpUnit5,
  },
  'linear-algebra-and-calculus': {
    1: lacUnit1,
    2: lacUnit2,
    3: lacUnit3,
    4: lacUnit4,
    5: lacUnit5,
  },
};

export const getUnit = (subjectId, unitNumber) => {
  return unitsMap[subjectId]?.[unitNumber] || null;
};
