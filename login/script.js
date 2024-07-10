document.addEventListener('DOMContentLoaded', () => {
    const accountTypes = document.querySelectorAll('.account-type');
    const loginForm = document.getElementById('login-form');
    const welcomeMessage = document.getElementById('welcome-message');

    accountTypes.forEach(accountType => {
        accountType.addEventListener('click', () => {
            accountTypes.forEach(type => type.classList.remove('selected'));
            accountType.classList.add('selected');
            const accountTypeName = accountType.id.charAt(0).toUpperCase() + accountType.id.slice(1);
            welcomeMessage.textContent = `Hello ${accountTypeName.toLowerCase()}! Please fill out the form below to get started`;
            loginForm.style.display = 'block';
        });
    });
});
