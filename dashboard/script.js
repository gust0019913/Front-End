document.addEventListener("DOMContentLoaded", function() { // This will be dynamically set based on login
    const email = localStorage.getItem('email')
    document.getElementById('user').textContent = email; // Update the user role in the top-right corner

    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    const assignStudentsCard = document.getElementById('assignStudentsCard');
    const uploadReportCard = document.getElementById('uploadReportCard');
    const studentEmail = document.getElementById('studentEmail');
    let students = '';
    let fileContent = '';
    let contentPath = '';
    if (role === 'teacher') {
        assignStudentsCard.classList.remove('hidden');
        uploadReportCard.classList.remove('hidden');
        populateAssignStudentsCard();
    }
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
            <a href="../course/course.html?courseName=${course.CourseName}&contentPath=${course.ContentPath}" class="card-link">
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

    // Function to fetch students from DynamoDB
async function fetchStudents() {
    // Replace with your actual API to fetch students
    const response = await fetch('https://12f2t7lfmd.execute-api.eu-west-1.amazonaws.com/dev/students');
    const allStudents = await response.json();
    students = allStudents;
}

// Function to fetch parents from DynamoDB
async function fetchParents() {
    // Replace with your actual API to fetch parents
    const response = await fetch('https://12f2t7lfmd.execute-api.eu-west-1.amazonaws.com/dev/parents');
    const parents = await response.json();
    return parents;
}

// Function to populate the table with students and parents
async function populateAssignStudentsCard() {
    await fetchStudents();
    //since we assure that students are fetched, we also create the options for uploading the file here.
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.studentID;
        option.textContent = student.email;
        studentEmail.appendChild(option);
    });
    const parents = await fetchParents();

    const tbody = document.querySelector('#assignStudentsCard tbody');
    tbody.innerHTML = ''; // Clear existing rows

    students.forEach(student => {
        const tr = document.createElement('tr');

        const tdStudentEmail = document.createElement('td');
        tdStudentEmail.textContent = student.email; // Assuming student object has email property

        const tdParentSelect = document.createElement('td');
        const select = document.createElement('select');
        select.className = 'form-control';
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Select a parent';
        select.appendChild(defaultOption);

        parents.forEach(parent => {
            const option = document.createElement('option');
            option.textContent = parent.email; // Assuming parent object has name property
            option.value = parent.parentID; // Assuming parent object has id property
            select.appendChild(option);
        });

        tdParentSelect.appendChild(select);

        const tdUpdateButton = document.createElement('td');
        const updateButton = document.createElement('button');
        updateButton.className = 'btn btn-primary';
        updateButton.textContent = 'Update';
        // Add event listener to handle update action
        updateButton.addEventListener('click', () => {
            assignParentToStudent(student.studentID, select.value);
        });

        tdUpdateButton.appendChild(updateButton);

        tr.appendChild(tdStudentEmail);
        tr.appendChild(tdParentSelect);
        tr.appendChild(tdUpdateButton);

        tbody.appendChild(tr);
    });
}

// Function to handle parent assignment to student
async function assignParentToStudent(studentID, parentID) {
    let studentIDs = [];
    studentIDs.push(studentID);
    // Replace with your actual API to update the assignment
    const response = await fetch('https://12f2t7lfmd.execute-api.eu-west-1.amazonaws.com/dev/parents', {
        method: 'POST',
        body: JSON.stringify({ 
            ParentID: parentID,
            StudentIDs: studentIDs,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        alert('Parent assigned successfully!');
    } else {
        alert('Student was already assigned to this parent.');
    }
}

document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const studentID = document.getElementById('studentEmail').value;

    if (!studentEmail || studentEmail === 'Select a student' || !fileInput) {
        alert('Please select a student and a file.');
        return;
    }

    try {
        const response = await fetch('https://12f2t7lfmd.execute-api.eu-west-1.amazonaws.com/dev/reports', {
            method: 'POST',
            body: JSON.stringify({ 
                StudentID: studentID,
                ContentPath: contentPath,
                FileContent: fileContent,
        })
        });

        if (response.ok) {
            alert('File uploaded successfully.');
        } else {
            alert('Failed to upload file.');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('An error occurred while uploading the file.');
    }
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const fileName = file.name;

    reader.onload = function(event) {
        const base64String = event.target.result.split(',')[1]; // Extract base64 string without data URL prefix
        console.log('Base64 Encoded File:', base64String);
        fileContent = base64String;
        contentPath = fileName;
        // Now you can use base64String as needed, e.g., send it to a server or store it locally
    };

    reader.readAsDataURL(file);
});
    
});
