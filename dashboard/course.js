document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseName = urlParams.get('courseName');
    const contentPath = urlParams.get('contentPath');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    document.getElementById('user').textContent = email;

    if (role != 'teacher') {
        document.getElementById('chatbotBox').classList.remove('hidden');
    }

    let courseTitle = courseName;

    document.getElementById('courseTitle').textContent = courseTitle;

    // Set the link to the chatbot page with the current course
    document.getElementById('chatbotLink').href = `chatbot.html?courseName=${courseName}&contentPath=${contentPath}`;
});
