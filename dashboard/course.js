document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseName = urlParams.get('courseName');
    const contentPath = urlParams.get('contentPath');
    const email = localStorage.getItem('email')
    document.getElementById('user').textContent = email;

    let courseTitle = courseName;

    document.getElementById('courseTitle').textContent = courseTitle;

    // Set the link to the chatbot page with the current course
    document.getElementById('chatbotLink').href = `chatbot.html?courseName=${courseName}&contentPath=${contentPath}`;
});
