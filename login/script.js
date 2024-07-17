document.addEventListener('DOMContentLoaded', () => {
    const accountTypes = document.querySelectorAll('.account-type');
    const loginForm = document.getElementById('login-form');
    const welcomeMessage = document.getElementById('welcome-message');

    let selectedAccountType = '';

    accountTypes.forEach(accountType => {
        accountType.addEventListener('click', () => {
            accountTypes.forEach(type => type.classList.remove('selected'));
            accountType.classList.add('selected');
            const accountTypeName = accountType.id.charAt(0).toUpperCase() + accountType.id.slice(1);
            welcomeMessage.textContent = `Hello ${accountTypeName.toLowerCase()}! Please fill out the form below to get started`;
            loginForm.style.display = 'block';
            selectedAccountType = accountType.id;
        });
    });

    const loginBtn = document.getElementById("login-btn");

    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log('Login button clicked with email:', email);
    
        if (email === '' || password === '') {
          alert('Email and password cannot be empty');
          return;
        }

        if (selectedAccountType == validateEmail(email)){

            try {
                localStorage.setItem('email', email);
                const result = await attemptLogin(email, password);
                console.log(result);
    
                if (result.statusCode === 200 && selectedAccountType != 'parent') {
                    window.location.href = '../dashboard/index.html';
                } else if (result.statusCode === 200 && selectedAccountType == 'parent') {
                    window.location.href = '../dashboard/chatbot.html';
                } else {
                    alert("Login failed!");
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert("Login failed!");
            }

        } else {
            console.log(selectedAccountType)
            alert("Please make sure you selected the correct account type")
        }

        
    });

    const attemptLogin = async (email, password) => {
        try {
            const response = await axios.post('https://12f2t7lfmd.execute-api.eu-west-1.amazonaws.com/dev/login', {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('API call successful:', response.data);
            localStorage.setItem('accessToken', response.data.AuthenticationResult.AccessToken);
            return {
                statusCode: response.status,
            };
        } catch (error) {
            if (error.response) {
                console.error('API call failed with response:', error.response.status, error.response.data);
                throw error.response; // Throw the error to be caught in the calling function
            } else {
                console.error('API call failed:', error.message);
                throw error; // Throw the error to be caught in the calling function
            }
        }
    };

    function validateEmail(email) {

            // Check if the email starts with 'gust00'
            if (email.startsWith('gust00') == true) {
                localStorage.setItem('role', selectedAccountType);
                return 'student';

                
                
        } //check if email starts with 'parent00'
            if (email.startsWith('parent00') == true) {
                localStorage.setItem('role', selectedAccountType)
                return 'parent';
        }

        // Check if the email follows the 'lastname.f@gust.edu.kw' pattern
            const emailParts = email.split('@');
            if (emailParts.length === 2 && emailParts[1] === 'gust.edu.kw') {
                const nameParts = emailParts[0].split('.');
                if (nameParts.length === 2 && nameParts[1].length === 1) {
                    localStorage.setItem('role', selectedAccountType);
                    return 'teacher';
                }
            return 'wrong email';
        }
        // Add additional conditions for other account types if needed
        return 'wrong email';
    }

});
