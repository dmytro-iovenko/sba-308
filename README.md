## SBA 308: JavaScript Fundamentals
You will create a script that gathers data, processes it, and then outputs a consistent result as described by a specification. You will be provided with four different types of data:
* A `CourseInfo` object, which looks like this:
```javascript
{
  "id": number,
  "name": string,
}
```
* An `AssignmentGroup` object, which looks like this:
```javascript
{
  "id": number,
  "name": string,
  // the ID of the course the assignment group belongs to
  "course_id": number,
  // the percentage weight of the entire assignment group
  "group_weight": number,
  "assignments": [AssignmentInfo],
}
```
* Each `AssignmentInfo` object within the assignments array looks like this:
```javascript
{
  "id": number,
  "name": string,
  // the due date for the assignment
  "due_at": Date string,
  // the maximum points possible for the assignment
  "points_possible": number,
}
```
* An array of `LearnerSubmission` objects, which each look like this:
```javascript
{
    "learner_id": number,
    "assignment_id": number,
    "submission": {
      "submitted_at": Date string,
      "score": number
    }
}
```

Your goal is to analyze and transform this data such that the output of your program is an array of objects, each containing the following information in the following format:
```javascript
{
    // the ID of the learner for which this data has been collected
    "id": number,
    // the learner’s total, weighted average, in which assignments
    // with more points_possible should be counted for more
    // e.g. a learner with 50/100 on one assignment and 190/200 on another
    // would have a weighted average score of 240/300 = 80%.
    "avg": number,
    // each assignment should have a key with its ID,
    // and the value associated with it should be the percentage that
    // the learner scored on the assignment (submission.score / points_possible)
    <assignment_id>: number,
    // if an assignment is not yet due, it should not be included in either
    // the average or the keyed dictionary of scores
}
```
If an `AssignmentGroup` does not belong to its course (mismatching `course_id`), your program should throw an error, letting the user know that the input was invalid. Similar data validation should occur elsewhere within the program. Use try/catch and other logic to handle these types of errors gracefully.
If an assignment is not yet due, do not include it in the results or the average. Additionally, if the learner’s submission is late (`submitted_at` is past `due_at`), deduct 10 percent of the total points possible from their score for that assignment.
Create a function named `getLearnerData()` that accepts these values as parameters, in the order listed: (`CourseInfo`, `AssignmentGroup`, `[LearnerSubmission]`), and returns the formatted result, which should be an array of objects as described above.

### Objectives
- Employ basic JavaScript syntax accurately.
- Implement control flow structures such as conditionals and loops effectively.
- Use arrays and objects to organize and manage data.
- Develop functions to create reusable code.
- Utilize loops and iteration to navigate through data collections.
- Implement error handling to manage potential code failures gracefully.
