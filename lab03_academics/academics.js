/**
 * @module academics
 */

/**
 * Create your dataStore here. The design is entirely up to you!
 * One possible starting point is
 *
 * let/const dataStore = {
 *   academics: [],
 *   courses: []
 * }
 *
 * and adding to the dataStore the necessary information when the
 * "create" functions are used.
 *
 * You will also need to modify the clear function accordingly
 * - we recommend you complete clear() at the bottom first!
 *
 * Do not export the dataStore. Your tests should not use/rely on
 * how dataStore is structured - only what goes in and out of the
 * defined functions from the interface.
 */

// TODO
let dataStore = {
    academics: [
        {
            academicId: 1,
            name: "Louis",
            hobby: "coding",
        },
    ],
    courses: [
        {
            courseId: 1,
            name: "COMP1531",
            description: "This is awesome",
            staffMembers: [
                {
                    academicId: 1,
                    name: "Louis",
                    hobby: "coding",
                },
            ],
            allMembers: [
                {
                    academicId: 1,
                    name: "Louis",
                    hobby: "coding",
                },
            ],
        },
    ],
};
/**
 * Complete the functions from the interface table.
 * As an optional activity, you can document your functions
 * similar to how academicCreate has been done.
 *
 * A reminder to return { error: 'any relevant error message of your choice' }
 * for error cases.
 */

/**
 * Creates a new academic, returning an object containing
 * a unique academic id
 *
 * @param {string} name
 * @param {string} hobby
 * @returns {{academicId: number}}
 */
export function academicCreate(name, hobby) {
    if (name === "") {
        return { error: "name is an empty string" };
    } else if (hobby === "") {
        return { error: "hobbby is an empty string" };
    }
    const academic_id = dataStore.academics.length
    dataStore.academics.push({
        academicId: academic_id,
        name: name,
        hobby: hobby,
    });

    return {
        academicId: academic_id,
    };
}

/**
 * Some description
 *
 * @param {number} academicId
 * @param {string} name
 * @param {string} description
 * @returns {{courseId: number}}
 */
export function courseCreate(academicId, name, description) {  
    function find_academic_id(academic_entries) {
        return academic_entries.academicId === academicId;
    }

    let academic_info = dataStore.academics.find(find_academic_id);
    if (name === "") {
        return {
            error: "The course name is an empty string"
        }
    } else if (name.length > 8) {
        return {error: "The course name is too long"}
    } else if (name.length < 8) {
        return {error: "The course name is too short"}
    }

    for (let i = 0; i < name.length; i++) {
        if (i <= 3) {
            if (/[A-Z]/.test(name.charAt(i)) === false) {
                return {
                    error: "The course name is not 4 uppercase letters"
                };
            }
        } else if (i <= 7) {
            if (/[0-9]/.test(name.charAt(i)) === false) {
                return {
                    error: "The course name is not followed by 4 single-digit integers"
                };
            }
        }
    }

    if (academic_info === undefined) {
        return { error: "academicId does not refer to an existing academic" };
    }

    const course_id = dataStore.courses.length
    dataStore.courses.push({
        courseId: course_id,
        name: name,
        description: description,
        staffMembers: [
            {
                academicId: academicId,
                name: academic_info.name,
                hobby: academic_info.hobby,
            },
        ],
        allMembers: [
            {
                academicId: academicId,
                name: academic_info.name,
                hobby: academic_info.hobby,
            },
        ],
    });
    return {
        courseId: course_id,
    };
}

/**
 * Some documentation
 */
export function academicDetails(academicId, academicToViewId) {
    function find_academic_id_1(academic_entries) {
        return academic_entries.academicId === academicId;
    }
    function find_academic_id_2(academic_entries) {
        return academic_entries.academicId === academicToViewId;
    }

    let academic_1_valid = dataStore.academics.find(find_academic_id_1);
    let academic_details = dataStore.academics.find(find_academic_id_2);

    if (academic_1_valid === undefined) {
        return { error: "academicId does not refer to an existing academic"}
    } else if (academic_details === undefined) {
        return { error: "academicToViewId does not refer to an existing academic"}
    }
    return {
        academic: {
            academicId: academic_details.academicId,
            name: academic_details.name,
            hobby: academic_details.hobby,
        },
    };
}

export function courseDetails(academicId, courseId) {
    function find_academic_id(academic_entries) {
        return academic_entries.academicId === academicId
    }
    function find_course_id(course_entries) {
        return course_entries.courseId === courseId
    }
    function find_id_enroll(academic) {
        return academic.academicId === academicId
    }

    let academic_id_valid = dataStore.academics.find(find_academic_id);
    let course_id_valid = dataStore.courses.find(find_course_id);

    if (academic_id_valid === undefined) {
        return { error: "academicId does not refer to an existing academic"}
    }
    if (course_id_valid === undefined) {
        return { error: "courseId does not refer to an existing course"}
    }

    const academic_id_enroll = course_id_valid.allMembers.find(find_id_enroll);
    if (academic_id_enroll === undefined) {
        return { error: "academicId refers to an academic that is not a member of the course"}
    }
    return {
        course: {
            courseId: course_id_valid.courseId,
            name: course_id_valid.name,
            description: course_id_valid.description,
            staffMembers: course_id_valid.staffMembers,
            allMembers: course_id_valid.allMembers
        },
    };
}

export function academicsList(academicId) {
    function find_academic_id (academic_entries) {
        return academic_entries.academicId === academicId
    }
    let academic_id_valid = dataStore.academics.find(find_academic_id)
    if (academic_id_valid === undefined) {
        return { error: "academicId does not refer to an existing academic"}
    }
    let clone_array = [];
    for (let index of dataStore.academics) {
        clone_array.push({
            academicId: index.academicId,
            academicName: index.name,
        })
    }

    return {
        academics: new Set(clone_array)
    };
}

export function coursesList(academicId) {
    // TODO
    function find_academic_id(academic_entries) {
        return academic_entries.academicId === academicId;
    }

    let academic_id_valid = dataStore.academics.find(find_academic_id);
    if (academic_id_valid === undefined) {
        return { error: "academicId does not refer to an existing academic"}
    }
    let clone_array = []
    for (let index of dataStore.courses) {
        clone_array.push({
            courseId: index.courseId,
            courseName: index.name,
        })
    }
    return {
        courses: new Set(clone_array)
    };
}

export function courseEnrol(academicId, courseId, isStaff) {
    function find_academic_id (academic_entries) {
        return academic_entries.academicId === academicId;
    }

    function find_course_id (course_entries) {
        return course_entries.courseId === courseId;
    }

    function find_id_enroll (academic) {
        return academic.academicId === academicId
    }

    let academic_id_valid = dataStore.academics.find(find_academic_id);
    let course_id_valid = dataStore.courses.find(find_course_id);

    if (academic_id_valid === undefined) {
        return { error: "academicId does not refer to an existing academic" }
    } else if (course_id_valid === undefined) {
        return { error: "courseId does not refer to an existing course" }
    }

    const academic_id_enroll = course_id_valid.allMembers.find(find_id_enroll);
    if (academic_id_enroll !== undefined) {
        return { error: "academicId refers to an existing staff or member in the course" }
    } 

    if (isStaff === true) {
        course_id_valid.staffMembers.push({
            academicId: academic_id_valid.academicId,
            name: academic_id_valid.name,
            hobby: academic_id_valid.hobby,
        })
    }

    course_id_valid.allMembers.push({
        academicId: academic_id_valid.academicId,
        name: academic_id_valid.name,
        hobby: academic_id_valid.hobby,
    })
    return {};
}

export function clear() {
    dataStore.academics = [];
    dataStore.courses = [];
    return {};
}
