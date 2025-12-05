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


// Basic Civil & Mechanical Engineering (BCME) - For 1-1 and 1-2 (and additional units)
import bcmeUnit1 from './basic-civil-and-mechanical-engineering/unit1.js';
import bcmeUnit2 from './basic-civil-and-mechanical-engineering/unit2.js';
import bcmeUnit3 from './basic-civil-and-mechanical-engineering/unit3.js';
import bcmeUnit4 from './basic-civil-and-mechanical-engineering/unit4.js';
import bcmeUnit5 from './basic-civil-and-mechanical-engineering/unit5.js';
import bcmeUnit6 from './basic-civil-and-mechanical-engineering/unit6.js';
// import bcmeUnit3, bcmeUnit4, ... as you add them for 2-1, 2-2, etc.

// 1-2 specific subjects (communicative english, chemistry, diff eq, data structures)
import ceUnit1 from './communicative-english/unit1.js';
import ceUnit2 from './communicative-english/unit2.js';
import ceUnit3 from './communicative-english/unit3.js';
import ceUnit4 from './communicative-english/unit4.js';
import ceUnit5 from './communicative-english/unit5.js';

import ecUnit1 from './engineering-chemistry/unit1.js';
import ecUnit2 from './engineering-chemistry/unit2.js';
import ecUnit3 from './engineering-chemistry/unit3.js';
import ecUnit4 from './engineering-chemistry/unit4.js';
import ecUnit5 from './engineering-chemistry/unit5.js';

import deUnit1 from './differential-equations-and-vector-calculus/unit1.js';
import deUnit2 from './differential-equations-and-vector-calculus/unit2.js';
import deUnit3 from './differential-equations-and-vector-calculus/unit3.js';
import deUnit4 from './differential-equations-and-vector-calculus/unit4.js';
import deUnit5 from './differential-equations-and-vector-calculus/unit5.js';

import dsUnit1 from './data-structures/unit1.js';
import dsUnit2 from './data-structures/unit2.js';
import dsUnit3 from './data-structures/unit3.js';
import dsUnit4 from './data-structures/unit4.js';
import dsUnit5 from './data-structures/unit5.js';

// List of all CSE sub-branch subject IDs - Share only 1-1 and 1-2
const cseSubBranches = [
  'cse',
  'cse-ai',
  'cse-ai-ml',
  'cse-ai-ds',
  'cse-ds',
  'cse-cs',
  'cse-iot',
];

// Build CSE sub-branch unit mapping - ONLY for 1-1 and 1-2
const cseFirstYearUnits = {
  1: bcmeUnit1,  // 1-1
  2: bcmeUnit2,  // 1-2
};

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
  'communicative-english': {
    1: ceUnit1,
    2: ceUnit2,
    3: ceUnit3,
    4: ceUnit4,
    5: ceUnit5,
  },
  'engineering-chemistry': {
    1: ecUnit1,
    2: ecUnit2,
    3: ecUnit3,
    4: ecUnit4,
    5: ecUnit5,
  },
  'differential-equations-and-vector-calculus': {
    1: deUnit1,
    2: deUnit2,
    3: deUnit3,
    4: deUnit4,
    5: deUnit5,
  },
  'data-structures': {
    1: dsUnit1,
    2: dsUnit2,
    3: dsUnit3,
    4: dsUnit4,
    5: dsUnit5,
  },
  'basic-civil-and-mechanical-engineering': {
    1: bcmeUnit1,
    2: bcmeUnit2,
    3: bcmeUnit3,
    4: bcmeUnit4,
    5: bcmeUnit5,
    6: bcmeUnit6,
  },
  // Add all CSE sub-branches - ONLY share 1-1 and 1-2 subjects
  ...Object.fromEntries(cseSubBranches.map(branch => [branch, cseFirstYearUnits])),
};

export const getUnit = (subjectId, unitNumber) => {
  return unitsMap[subjectId]?.[unitNumber] || null;
};
