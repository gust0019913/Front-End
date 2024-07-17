        document.addEventListener('DOMContentLoaded', function () {
            const email = localStorage.getItem('email');
            const userID = localStorage.getItem('sub');
            console.log(userID);
            document.getElementById('user').textContent = email;
            let fileContent = '';
            let contentPath = '';
            let courseID = '';
            fetchStudents();
            document.getElementById('dropdownSelect').addEventListener('click', toggleDropdown);
            document.getElementById('createCourseBtn').addEventListener('click', function(event) {
                event.preventDefault(); // Prevent the default form submission
            
                // Retrieve values from inputs or wherever they are stored
                let courseName = document.getElementById('courseName').value;
                let courseDescription = document.getElementById('courseDescription').value;
                courseID = document.getElementById('courseId').value;
            
                // Check if any required field is empty
                if (courseName.trim() === '' || courseDescription.trim() === '' || courseID.trim() === '' || fileContent.trim() === '') {
                    // Optionally, show an error message or handle the empty fields
                    alert('Please make sure to fill all fields, add students and choose a file.');
                } else {
                    // Call createCourse function if all fields are filled
                    createCourse(courseID, courseName, courseDescription, fileContent, contentPath, userID);
                }
            });
            const dropdownContent = document.getElementById('dropdownContent');

            dropdownSelect.addEventListener('click', function () {
                dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
            });

            dropdownContent.addEventListener('click', function (e) {
                if (e.target && e.target.nodeName === "DIV") {
                    const value = e.target.getAttribute('data-value');
                    if (selectedStudents.includes(value)) {
                        selectedStudents.splice(selectedStudents.indexOf(value), 1);
                        e.target.classList.remove('selected');
                    } else {
                        selectedStudents.push(value);
                        e.target.classList.add('selected');
                    }
                    dropdownSelect.textContent = selectedStudents.length ? selectedStudents.join(', ') : 'Select Students';
                }
            });

            // Close the dropdown if the user clicks outside of it
            window.addEventListener('click', function(event) {
                if (!event.target.matches('.custom-dropdown-select') && !event.target.matches('.custom-dropdown-content div')) {
                    if (dropdownContent.style.display === 'block') {
                        dropdownContent.style.display = 'none';
                    }
                }
            });

            let selectedStudents = [];

function fetchStudents() {
    const apiURL = 'https://12f2t7lfmd.execute-api.eu-west-1.amazonaws.com/dev/students';

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            displayStudents(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function displayStudents(students) {
    const dropdownContent = document.getElementById('dropdownContent');
    dropdownContent.innerHTML = '';

    students.forEach(student => {
        const studentItem = document.createElement('div');
        studentItem.textContent = student.email;
        studentItem.dataset.value = student.studentID; // Assuming each student object has a studentID property
        studentItem.dataset.email = student.email;
        studentItem.addEventListener('click', selectStudent);
        dropdownContent.appendChild(studentItem);
    });
}

function toggleDropdown() {
    const dropdownContent = document.getElementById('dropdownContent');
    dropdownContent.classList.toggle('show');
}

function selectStudent(event) {
    event.stopPropagation();
    const studentItem = event.currentTarget;
    studentItem.classList.toggle('selected');
    updateSelectedStudents();
}

function updateSelectedStudents() {
    const selectedItems = document.querySelectorAll('.custom-dropdown-content .selected');
    selectedStudents = Array.from(selectedItems).map(item => ({
        studentID: item.dataset.value,
        email: item.dataset.email
    }));
    const selectedEmails = selectedStudents.map(student => student.email);
    document.getElementById('dropdownSelect').textContent = selectedEmails.length > 0 ? selectedEmails.join(', ') : 'Select Students';
}

function createCourse(courseID, courseName, courseDesc, fileContent, contentPath, userID) {
    const selectedStudentIDs = selectedStudents.map(student => student.studentID);
    // Replace the following URL with your actual create course API endpoint
    const apiURL = 'https://12f2t7lfmd.execute-api.eu-west-1.amazonaws.com/dev/courses';
    
    fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            CourseID: courseID,
            CourseName: courseName,
            CourseDescription: courseDesc,
            ContentPath: contentPath,
            FileContent: fileContent,
            TeacherID: userID,
            StudentIDs: selectedStudentIDs
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Course created successfully:', data);
        alert("Course created successfully!");
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Error creating course:', error);
    });
}

window.addEventListener('click', function(event) {
    if (!event.target.matches('.custom-dropdown-select')) {
        const dropdownContent = document.getElementById('dropdownContent');
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    }
});

 // Event listener for file input change
 document.getElementById('uploadTxt').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const fileName = file.name;
    courseID = document.getElementById('courseId').value;

    reader.onload = function(event) {
        const base64String = event.target.result.split(',')[1]; // Extract base64 string without data URL prefix
        console.log('Base64 Encoded File:', base64String);
        fileContent = base64String;
        contentPath = `uploads/${courseID}/${fileName}`;
        console.log(contentPath);
        // Now you can use base64String as needed, e.g., send it to a server or store it locally
    };

    reader.readAsDataURL(file);
});

    });