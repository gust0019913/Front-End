document.addEventListener("DOMContentLoaded", function() { // This will be dynamically set based on login
    const email = localStorage.getItem('email')
    document.getElementById('user').textContent = email; // Update the user role in the top-right corner

    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    console.log(role);
    const createBtn = document.getElementById('createBtn');
    if (role == 'teacher') {
        createBtn.classList.remove('hidden');
    }
    const coursesContainer = document.getElementById('courses-container');

    let  subValue = '';

    async function fetchUserDetails() {
      const apiUrl = `https://12f2t7lfmd.execute-api.eu-west-1.amazonaws.com/dev/get_userDetails?access_token=${accessToken}`;
  
      try {
          const response = await fetch(apiUrl, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
  
          if (!response.ok) {
              throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
  
          const userDetails = await response.json();
          return userDetails;
      } catch (error) {
          console.error('Fetch error:', error);
      }
  }

  async function loadUserDetails() {
    try {
        const userDetails = await fetchUserDetails(); // Await the promise
        console.log(userDetails); // Now you can access the actual user details
        for (const detail of userDetails) {
            if (detail.Name === 'sub') {
                subValue = detail.Value; // Return the value if 'sub' is found
                localStorage.setItem('sub', subValue);
            }
        }
        console.log(subValue); // Log the sub value
        await loadCourses()
    } catch (error) {
        console.error('Error loading user details:', error);
    }
}

loadUserDetails()
  
  async function fetchStudentCourses(subValue) {
    try {
        const response = await fetch(`https://12f2t7lfmd.execute-api.eu-west-1.amazonaws.com/dev/get_studentEnrolledCourses?studentID=${subValue}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const courses = await response.json();
        return courses.enrolledCourses; //returns the enrolled courses list
    } catch (error) {
        console.error('Error fetching courses:', error);
        coursesContainer.innerHTML = '<p>Error loading courses. Please try again later.</p>';
    }
}

async function fetchTeacherCourses(subValue) {
    try {
        const response = await fetch(`https://12f2t7lfmd.execute-api.eu-west-1.amazonaws.com/dev/get_teacherEnrolledCourses?teacherID=${subValue}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const courses = await response.json();
        return courses.enrolledCourses; //returns the enrolled courses list
    } catch (error) {
        console.error('Error fetching courses:', error);
        coursesContainer.innerHTML = '<p>Error loading courses. Please try again later.</p>';
    }
}

    const fetchCourseDetails = async (courseId) => { // Pass courseId as a parameter
        try {
          const response = await fetch(`https://12f2t7lfmd.execute-api.eu-west-1.amazonaws.com/dev/courses/{CourseID}?CourseID=${courseId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
          return null; // or handle error as per your application's requirements
        } 
      };
      
      function displayCourse(course) {
        const courseCard = `
            <a href="course.html?courseName=${course.CourseName}&contentPath=${course.ContentPath}" class="card-link">
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${course.CourseName}</h5>
                        <p class="card-text">${course.CourseDescription}</p>
                    </div>
                </div>
            </a>
        `;
    
        // Append the course card to the container
        coursesContainer.innerHTML += courseCard;
    }

    async function loadCourses() {
        try {
            let enrolledCoursesList = '';
            if (role === 'student') {
                enrolledCoursesList = await fetchStudentCourses(subValue);
            } else {
                enrolledCoursesList = await fetchTeacherCourses(subValue);
            }
            
            
            if (Array.isArray(enrolledCoursesList)) {
                for (const courseID of enrolledCoursesList) {
                    const courseDetails = await fetchCourseDetails(courseID); // Await the fetch
                    displayCourse(courseDetails); // Display the course details
                }
            } else {
                console.error('enrolledCoursesList is not an array:', enrolledCoursesList);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }
    
});
