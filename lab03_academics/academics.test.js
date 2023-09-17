/**
 * NOTE: The only functions that you should write tests for are those defined
 * in the specification's interface (README.md). 
 * 
 * Your dataStore or any "helper" function you define should NOT be imported or
 * tested - your tests must work even if it is run against another student's
 * solution to this lab.
 */

import {
  academicCreate,
  courseCreate,
  academicDetails,
  courseDetails,
  academicsList,
  coursesList,
  courseEnrol,
  clear,
} from './academics';

const ERROR = { error: expect.any(String) };
const ACADEMIC_ID = { academicId: expect.any(Number) }
const COURSE_ID = { courseId: expect.any(Number)}

// It is important to clear the data store so that no tests will rely on the result of another.
// This beforeEach will run before every test in this test suite!
// This saves us from having to repeatedly clear the data store every time we start a new, independent test
// See [Jest's Setup and Teardown](https://jestjs.io/docs/setup-teardown) for more information
beforeEach(() => {
  clear();
});

// FIXME
// This is a sample test that tests many academic functions together
// You may want to break this up into multiple tests.
describe('Sample test', () => {
  test('error creating academics, empty name', () => {
    expect(academicCreate('', 'dancing')).toStrictEqual({ error: expect.any(String) });
  });

  test('correct return type', () => {
    const academic = academicCreate('Magnus', 'chess');

    // NOTE: We don't actually know what the generated ID should be
    expect(academic).toStrictEqual(
      {
        academicId: expect.any(Number),
      }
    );
  })

  test('correct return type 2', () => {
    const academic = academicCreate('Magnus', 'chess');
    // However, we can still use this ID in other functions
    expect(academicDetails(academic.academicId, academic.academicId)).toStrictEqual({
      academic: {
        academicId: academic.academicId,
        name: 'Magnus',
        hobby: 'chess',
      }
    });
  });

  test('correct return type 3', () => {
    const academic = academicCreate('Magnus', 'chess');
    // Note the different key for "name" in this function - refer to "Data Types"
    // When comparing arrays with multiple items, you may want to convert each
    // array into a Set (since we don't know which order the items will be in).
    expect(academicsList(academic.academicId)).toStrictEqual({
      academics: new Set([
        {
          academicId: academic.academicId,
          academicName: 'Magnus',
        }
      ])
    });
  });
});

// Below are further test blocks that we have started for you.
// Feel free to modify them or move them to different test files/directories if needed!

describe('clear', () => {
  test('returns empty dictionary', () => {
    expect(clear()).toStrictEqual({});
  });
  
  // TODO: More tests for clear
});

describe('academicCreate', () => {

  test.each([
    { name: '', hobby: 'dancing' },
    { name: 'Jade', hobby: '' },
  ])("error: ('$name', '$hobby')", ({ name, hobby }) => {
    expect(academicCreate(name, hobby)).toStrictEqual(ERROR);
  });

  test.each([
    { name: 'Louis', hobby: 'gaming' },
    { name: 'Marius', hobby: 'cooking'},
    { name: 'Darrius', hobby: 'gaming'}
  ])("working: ('$name', '$hobby')", ({ name, hobby }) => {
    expect(academicCreate(name, hobby)).toStrictEqual(ACADEMIC_ID)
  })

});

describe('courseCreate', () => {

  test.each([
    { name: '' },
    { name: 'COMP204L' },
    { name: '2041COMP' },
    { name: 'COMP204' },
    { name: 'COMP20411' },
    { name: 'CCOMP2041' },
    { name: 'comp2041' },
  ])("invalid course name: '$name'", ({ name }) => {
    const academic = academicCreate('Lina', 'Karaoke');
    expect(courseCreate(academic.academicId, name, '')).toStrictEqual(ERROR);
  });

  test.each([
    { academicId: 10, name: 'CDEF4567', description: ''},
    { academicId: 20, name: 'CDEF4567', description: ''},
    { academicId: 30, name: 'CDEF4567', description: ''},
    { academicId: 40, name: 'CDEF4567', description: ''},
    { academicId: 50, name: 'CDEF4567', description: ''},
  ])("error: ('$academicId', '$name', '$description')", ({academicId, name, description}) => {
    expect(courseCreate(academicId, name, description)).toStrictEqual(ERROR)
  })
  
  test.each([
    { name: 'COMP1531', description: 'This course is NULL/10'},
    { name: 'COMP2521', description: 'This course is NULL/10'},
    { name: 'COMP1511', description: 'This course is 10/10'},
    { name: 'MATH1131', description: 'This course is 7/10'},
    { name: 'MATH1231', description: 'This course is 7/10'},
    { name: 'MATH1081', description: 'This course is 0/10'},
    { name: 'ABCD1234', description: 'This course is 10/10'}
  ])("working: ('$name', '$description')", ({name, description}) => {
    const academic = academicCreate('Louis', 'Sleeping');
    expect(courseCreate(academic.academicId, name, description)).toStrictEqual(COURSE_ID);
  })

});

describe('academicDetails', () => {
  let academic;
  beforeEach(() => {
    academic = academicCreate('Tamantha', 'Running')
  });
  
  test('invalid authId', () => {
    expect(academicDetails(academic.academicId + 1, academic.academicId)).toStrictEqual(ERROR);
  });
  
  test('invalid viewId', () => {
    expect(academicDetails(academic.academicId, academic.academicId + 1)).toStrictEqual(ERROR);
  });

  test('view self details', () => {
    expect(academicDetails(academic.academicId, academic.academicId)).toStrictEqual({
      academic: {
        academicId: academic.academicId,
        name: 'Tamantha',
        hobby: 'Running',
      }
    });
  });

  test("view other academics' details", () => {
    const academic2 = academicCreate('applelover', 'eating');
    expect(academicDetails(academic.academicId, academic2.academicId)).toStrictEqual({
      academic: {
        academicId: academic2.academicId,
        name: 'applelover',
        hobby: 'eating',
      }
    });
    expect(academicDetails(academic2.academicId, academic.academicId)).toStrictEqual({
      academic: {
        academicId: academic.academicId,
        name: 'Tamantha',
        hobby: 'Running',
      }
    });
  });
});

describe('courseDetails', () => {
  // before process
  let academic_1;
  let academic_2;
  let course_1;
  let course_2
  beforeEach(() => {
    academic_1 = academicCreate('Louis', 'Running');
    academic_2 = academicCreate('Danny', 'Cooking')
    course_1 = courseCreate(academic_1.academicId, 'COMP1531', 'This is awesome')
    course_2 = courseCreate(academic_2.academicId, 'ABCD1234', 'This is bad')
  });
  
  // academicId test
  test ("academicId does not exist 1", () => {
    expect(courseDetails(academic_1.academicId + 3, course_1.courseId)).toStrictEqual(ERROR);
  })

  test ("academicId does not exist 2", () => {
    expect(courseDetails(academic_2.academicId + 3, course_2.courseId)).toStrictEqual(ERROR);
  })
  // courseId test
  test ("courseId does not exist 1", () => {
    expect(courseDetails(academic_1.academicId, course_1.courseId + 3)).toStrictEqual(ERROR);
  })

  test ("courseId does not exist 2", () => {
    expect(courseDetails(academic_2.academicId, course_2.courseId + 3)).toStrictEqual(ERROR);
  })

  // academicId test 2
  test ("academicId is not a member of the course 1", () => {
    expect(courseDetails(academic_2.academicId, course_1.courseId)).toStrictEqual(ERROR);
  })

  test ("academicId is not a member of the course 2", () => {
    expect(courseDetails(academic_1.academicId, course_2.courseId)).toStrictEqual(ERROR);
  })
  // working test
  test ("working test 1", () => {
    expect(courseDetails(academic_1.academicId, course_1.courseId)).toStrictEqual({
      course: {
        courseId: course_1.courseId,
        name: 'COMP1531',
        description: 'This is awesome',
        staffMembers: [
          {
            academicId: academic_1.academicId,
            name: 'Louis',
            hobby: 'Running',
          },
        ],
        allMembers: [
          {
            academicId: academic_1.academicId,
            name: 'Louis',
            hobby: 'Running',
          },
        ],
      }
    })
  })

  test ("working test 2", () => {
    expect(courseDetails(academic_2.academicId, course_2.courseId)).toStrictEqual({
      course: {
        courseId: course_2.courseId,
        name: 'ABCD1234',
        description: 'This is bad',
        staffMembers: [
          {
            academicId: academic_2.academicId,
            name: 'Danny',
            hobby: 'Cooking',
          },
        ],
        allMembers: [
          {
            academicId: academic_2.academicId,
            name: 'Danny',
            hobby: 'Cooking',
          },
        ],
      }
    })
  })

});

describe('academicsList', () => {
  // before process
  let academic_1;
  let academic_2
  beforeEach(() => {
    academic_1 = academicCreate('Louis', 'Running');
    academic_2 = academicCreate('Danny', 'Cooking')
  })

  // academicId test
  test("academicId does not exist", () => {
    expect(academicsList(academic_1.academicId + 3)).toStrictEqual(ERROR);
  })

  test("academicId is ''", () => {
    expect(academicsList('')).toStrictEqual(ERROR);
  })
  
  // working test
  test("working 1", () => {
    expect(academicsList(academic_1.academicId)).toStrictEqual({
      academics: new Set([
        {
          academicId: academic_1.academicId,
          academicName: 'Louis',
        },
        {
          academicId: academic_2.academicId,
          academicName: 'Danny',
        },
      ])
    });
  })

  test("working 2", () => {
    expect(academicsList(academic_1.academicId)).toStrictEqual({
      academics: new Set([
        {
          academicId: academic_2.academicId,
          academicName: 'Danny',
        },
        {
          academicId: academic_1.academicId,
          academicName: 'Louis',
        },
      ])
    });
  })

});

describe('coursesList', () => {
  // before process
  let academic_1;
  let academic_2;
  let course_1;
  let course_2
  beforeEach(() => {
    academic_1 = academicCreate('Louis', 'Running');
    academic_2 = academicCreate('Danny', 'Cooking');
    course_1 = courseCreate(academic_1.academicId, 'COMP1531', 'This is awesome')
    course_2 = courseCreate(academic_2.academicId,'ABCD1234', 'This is bad')
  })

  // academicId test 
  test("academicId does not exist", () => {
    expect(coursesList(academic_1.academicId + 3)).toStrictEqual(ERROR);
  })

  test("academicId is ''", () => {
    expect(coursesList('')).toStrictEqual(ERROR);
  })

  // working test
  test("working 1", () => {
    expect(coursesList(academic_1.academicId)).toStrictEqual({
      courses: new Set([
        {
          courseId: course_1.courseId,
          courseName: 'COMP1531',
        },
        {
          courseId: course_2.courseId,
          courseName: 'ABCD1234',
        },
      ])
    });
  })

  test("working 2", () => {
    expect(coursesList(academic_2.academicId)).toStrictEqual({
      courses: new Set([
        {
          courseId: course_2.courseId,
          courseName: 'ABCD1234',
        },
        {
          courseId: course_1.courseId,
          courseName: 'COMP1531',
        },
      ])
    });
  })
});

describe('courseEnrol', () => {
  // before process
  let academic_1;
  let academic_2;
  let course_1;
  let course_2;
  beforeEach(() => {
    academic_1 = academicCreate('Louis', 'Running');
    academic_2 = academicCreate('Danny', 'Cooking');
    course_1 = courseCreate(academic_1.academicId, 'COMP1531', 'This is awesome')
    course_2 = courseCreate(academic_2.academicId,'ABCD1234', 'This is bad')
  })

  // academicId test
  test ("academicId does not exist", () => {
    expect(courseEnrol(academic_1.academicId + 3, course_1.courseId, false)).toStrictEqual(ERROR);
  })

  test ("academic is already in the course 1", () => {
    expect(courseEnrol(academic_1.academicId, course_1.courseId, true)).toStrictEqual(ERROR);
  })

  test ("academic is already in the course 2", () => {
    expect(courseEnrol(academic_2.academicId, course_2.courseId, false)).toStrictEqual(ERROR);
  })
  
  // courseId test
  test ("courseId does not exist", () => {
    expect(courseEnrol(academic_1.academicId, course_1.courseId + 3, false)).toStrictEqual(ERROR);
  })

  // working test
  test ("enroll as member", () => {
    expect(courseEnrol(academic_1.academicId, course_2.courseId, false)).toStrictEqual({});
  })

  test ("enroll as staff", () => {
    expect(courseEnrol(academic_2.academicId, course_1.courseId, true)).toStrictEqual({});
  })
});


