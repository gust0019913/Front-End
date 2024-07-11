document.addEventListener("DOMContentLoaded", function() {
    const email = localStorage.getItem('email')

    const fetchCourseDetails = async (courseId) => { // Pass courseId as a parameter
        try {
          const response = await fetch(`https://12f2t7lfmd.execute-api.eu-west-1.amazonaws.com/dev/courses/${courseId}`);
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
      
      // Example usage:
      const courseId = 'your_course_id_here'; // Replace with the actual course ID
      fetchCourseDetails(courseId) // Pass courseId to fetchCourseDetails
        .then(courseDetails => {
          if (courseDetails) {
            const course = courseDetails; // Save course details in a const variable
            console.log('Course details:', course);
            // Further processing with 'course' variable
          }
        });
      
    


    //const emailAttr = userAttributes.find(attr => attr.Name === 'email'); //custom:role // can retrieve role this way as well

    document.getElementById('user').textContent = email;

    // Update the user role in the top-right corner
   // document.getElementById('userRole').textContent = userRole;
});
