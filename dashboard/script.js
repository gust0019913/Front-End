document.addEventListener("DOMContentLoaded", function() {
    // Assuming you will fetch the user role from a server or set it during login
    var userRole = 'Student'; // This can be 'Teacher', 'Parent', etc.

    // Update the user role in the top-right corner
    document.getElementById('userRole').textContent = userRole;
});
