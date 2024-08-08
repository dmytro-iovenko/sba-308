// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  // the ID of the course the assignment group belongs to
  course_id: 451,
  // the percentage weight of the entire assignment group
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      // the due date for the assignment
      due_at: "2023-01-25",
      // the maximum points possible for the assignment
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

/**
 * Function to analyze and transform input data.
 * Return an array of objects, each containing the following information
 * in the following format:
 * {
 *     // the ID of the learner for which this data has been collected
 *     "id": number,
 *     // the learner’s total, weighted average, in which assignments
 *     // with more points_possible should be counted for more
 *     // e.g. a learner with 50/100 on one assignment and 190/200 on another
 *     // would have a weighted average score of 240/300 = 80%.
 *     "avg": number,
 *     // each assignment should have a key with its ID,
 *     // and the value associated with it should be the percentage that
 *     // the learner scored on the assignment (submission.score / points_possible)
 *     <assignment_id>: number,
 *     // if an assignment is not yet due, it should not be included in either
 *     // the average or the keyed dictionary of scores
 * }
 *
 * @param {*} course        - CourseInfo object
 * @param {*} ag            - AssignmentGroup object
 * @param [{*}] submissions - array of LearnerSubmission objects
 * @returns [{*}] result    - array of objects
 */
function getLearnerData(course, ag, submissions) {
  // here, we would process this data to achieve the desired result.
  const result = [];

  try {
    // convert AssignmentGroup object to Assignments dictionary
    let assignmentsObj = getAssignments(ag, course);
    // convert LearnerSubmission objects array to Submissions dictionary
    let submissionsObj = getSubmissions(submissions, assignmentsObj);
    // loop through submissions and push data to result array
    for (let data in submissionsObj) {
      result.push({
        // the ID of the learner for which this data has been collected
        id: Number(data),
        // calculate the learner's total, weighted average
        // and round result to 3 decimal places
        avg: roundToThreeDecimalPlaces(
          submissionsObj[data].totalScores /
            submissionsObj[data].totalPossiblePoints
        ),
        // spread assignments object to list all learner's assignments
        ...submissionsObj[data].assignments,
      });
    }
  } catch (error) {
    // handle error, if any
    console.log(error);
  }

  // return array of objects anyway even if it's empty because of errors
  return result;

  /** NESTED HELPER FUNCTIONS **/

  // Nested function to return an object where each 'key' is an unique assignment ID
  // and 'value' is parameters of the assigment
  function getAssignments(ag, course) {
    // validate AssignmentGroup parameters
    validateAssignmentGroup(ag, course);
    // validate Assignment parameters
    ag.assignments.forEach((element) => validateAssignment(element));
    return ag.assignments.reduce(
      (obj, element) => ({
        ...obj,
        [element.id]: {
          name: element.name,
          due_at: element.due_at,
          points_possible: element.points_possible,
        },
      }),
      {}
    );
    /** NESTED VALIDATIONS **/
    function validateAssignmentGroup(ag, course) {
      // if an AssignmentGroup does not belong to its course, throw an error
      if (ag.course_id !== course.id) {
        throw new Error(
          `AssignmentGroup does not belong to its course (mismatching course_id: ${ag.course_id})`
        );
      }
    }
    function validateAssignment(element) {
      // if Assignment has invalid due date, throw an error
      if (!Date.parse(element.due_at)) {
        throw new Error(
          `Assignment (id: ${element.id}) has an invalid due date (due_at: ${element.due_at})`
        );
      }
      // if Assignment has invalid points_possible, throw an error
      else if (!(Number(element.points_possible) > 0)) {
        throw new Error(
          `Assignment (id: ${element.id}) has an invalid points_possible: ${element.points_possible}`
        );
      }
    }
  }

  // Nested function to return an object where each 'key' is an unique learner ID
  // and 'value' is another object with all learner's assigments
  // and parameters that need to calculate the learner’s total, weighted average
  function getSubmissions(submissions, assignments) {
    // validate Submission parameters
    submissions.forEach((element) => {
      validateSubmission(element, assignments);
    });
    const filtered_submissions = [];
    // if an assignment is not yet due, it should not be included in either
    // the average or the keyed dictionary of scores
    for (let element of submissions) {
        if (Date.parse(assignments[element.assignment_id].due_at) >= Date.now()) {
            continue;
        } 
        filtered_submissions.push(element);
    }
    return (
        filtered_submissions.reduce((obj, element) => {
          // if the learner’s submission is late (submitted_at is past due_at),
          // deduct 10 percent of the total points possible from the score for that assignment
          let adjusted_score =
            Date.parse(element.submission.submitted_at) >
            Date.parse(assignments[element.assignment_id].due_at)
              ? element.submission.score -
                // deduct 10 percent of the total points possible
                0.1 * assignments[element.assignment_id].points_possible
              : element.submission.score;
          return {
            ...obj,
            [element.learner_id]: {
              ...obj[element.learner_id],
              // each assignment should have a key with its ID,
              // and the value is the percentage that the learner scored
              // on the assignment (submission.score / points_possible)
              assignments: obj[element.learner_id]
                ? // if assignments key already exists, then add a new record to the existing object
                  {
                    ...obj[element.learner_id].assignments,
                    [element.assignment_id]: roundToThreeDecimalPlaces(
                      adjusted_score /
                        assignments[element.assignment_id].points_possible
                    ),
                  }
                : // otherwise, create a new object and store it
                  {
                    [element.assignment_id]: roundToThreeDecimalPlaces(
                      adjusted_score /
                        assignments[element.assignment_id].points_possible
                    ),
                  },
              // calculate total scores of learner's assignments to use in avg calculation later
              totalScores: obj[element.learner_id]
                ? // if totalScores key already exists, then increase it by submission.score
                  obj[element.learner_id].totalScores + adjusted_score
                : // otherwise, store submission.score as new totalScores value
                  adjusted_score,
              // calculate total possible points to use in avg calculation
              totalPossiblePoints: obj[element.learner_id]
                ? // if totalScores key already exists, then increase it by points_possible
                  obj[element.learner_id].totalPossiblePoints +
                  assignments[element.assignment_id].points_possible
                : // otherwise, store points_possible as new totalPossiblePoints value
                  assignments[element.assignment_id].points_possible,
            },
          };
        }, {})
    );
    /** NESTED VALIDATIONS **/
    function validateSubmission(element, assignments) {
      // if Submission has invalid learner_id, throw an error
      if (!element.learner_id) {
        throw new Error(
          `Submission has invalid learner_id: ${element.learner_id}, assignment_id: ${element.assignment_id}`
        );
      }
      // if Submission has invalid assignment_id, throw an error
      else if (!assignments[element.assignment_id]) {
        throw new Error(
          `Submission has invalid assignment_id: ${element.assignment_id}, learner_id: ${element.learner_id}`
        );
      }
      // if Submission has invalid submission.score, throw an error
      else if (!(Number(element.submission.score) >= 0)) {
        throw new Error(
          `Submission has invalid submission.score: ${element.submission.score}, learner_id: ${element.learner_id}, assignment_id: ${element.assignment_id}`
        );
      }
      // if Submission has invalid submission.submitted_at, throw an error
      else if (!Date.parse(element.submission.submitted_at)) {
        throw new Error(
          `Submission has invalid submission.submitted_at: ${element.submission.submitted_at}, learner_id: ${element.learner_id}, assignment_id: ${element.assignment_id}`
        );
      }
    }
  }
  // Nested function to round number to 3 decimal places
  function roundToThreeDecimalPlaces(num) {
    return Number(num.toFixed(3));
  }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);
