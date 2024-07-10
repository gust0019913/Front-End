document.addEventListener("DOMContentLoaded", function() {
    var userRole = 'Student'; // This can be 'Teacher', 'Parent', etc.
    document.getElementById('userRole').textContent = userRole;

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
});
