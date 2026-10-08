function CourseList() {
  const courses = [
    {
      id: 1,
      name: "Computer Science and Engineering"
    },
    {
      id: 2,
      name: "Artificial Intelligence and Machine Learning"
    },
    {
      id: 3,
      name: "Electronics and Communication Engineering"
    }
  ];

  return (
    <div>
      <h2>Available Courses</h2>

      {courses.map((course) => (
        <div key={course.id}>
          <h3>{course.name}</h3>
        </div>
      ))}
    </div>
  );
}

export default CourseList;