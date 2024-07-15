document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get('course');

    let courseTitle = '';
    switch(course) {
        case 'IntroLiteraryStudies':
            courseTitle = 'Introduction to Literary Studies';
            break;
        case 'ShakespeareanLiterature':
            courseTitle = 'Shakespearean Literature';
            break;
        case 'ModernAmericanLiterature':
            courseTitle = 'Modern American Literature';
            break;
        case 'VictorianLiterature':
            courseTitle = 'Victorian Literature';
            break;
        default:
            courseTitle = 'Course';
    }

    document.getElementById('courseTitle').textContent = courseTitle;

    // Set the link to the chatbot page with the current course
    document.getElementById('chatbotLink').href = `chatbot.html?course=${course}`;

    document.getElementById('userPlaceholder').textContent = 'User'; // This will be dynamically set based on login
});
