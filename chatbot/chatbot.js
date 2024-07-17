document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseName = urlParams.get('courseName');
    const accessToken = localStorage.getItem('accessToken'); //for parent details
    let contentPath = '';
    let subValue = ''; //for parent details
    let studentID = '';
    const email = localStorage.getItem('email')
    document.getElementById('user').textContent = email;
    const role = localStorage.getItem('role');

    if (role != 'parent') {
        contentPath = urlParams.get('contentPath');
        document.getElementById('backToCourseBtn').href = `../course/course.html?courseName=${courseName}`;
        document.getElementById('backToCourseBtn').classList.remove('hidden');
    } else {
        await loadUserDetails();
        studentID = await fetchStudentOfParent(subValue);
        contentPath = `reports/${studentID}/report.txt`;
    }


    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    setTimeout(() => {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'chat-message bot';
        welcomeMessage.innerHTML = '<strong>Chatbot:</strong> Welcome! How can I assist you today?';
        chatContainer.appendChild(welcomeMessage);

        // Scroll to the bottom of the chat container
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1000);

    // Scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;

    sendButton.addEventListener('click', async function() {
        const userMessage = chatInput.value;
        if (userMessage.trim() !== "") {
            const userMessageElement = document.createElement('div');
            userMessageElement.classList.add('text-right');
            userMessageElement.className = 'chat-message user';
            userMessageElement.innerHTML = `<strong>You:</strong> ${userMessage}`;
            chatContainer.appendChild(userMessageElement);
            chatInput.value = '';

            const data = await invokeChatbotAPI(userMessage);
            const botResponse = data.message;
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot';
            botMessage.innerHTML = `<strong>Chatbot:</strong> ${botResponse}`;
            chatContainer.appendChild(botMessage);

        // Scroll to the bottom of the chat container
        chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    });

    chatInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });

    async function invokeChatbotAPI(userMessage) {
        const url = 'https://sg8i4e0hli.execute-api.eu-west-1.amazonaws.com/dev/askChatbot';
        const requestBody = {
            bucketName: 'yyeproject',
            filePath: contentPath,
            question: userMessage
        };
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any additional headers if needed
                },
                body: JSON.stringify(requestBody)
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
    
            const data = await response.json();
            return data;
            // Process the response data here
    
        } catch (error) {
            console.error('Error invoking chatbot API:', error);
            // Handle errors here
        }
    }

    async function fetchUserDetails() { //to fetch the user details of the parent
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

    async function fetchStudentOfParent(subValue) {
        try {
            const response = await fetch(`https://12f2t7lfmd.execute-api.eu-west-1.amazonaws.com/dev/get_studentOfParent?parentID=${subValue}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.studentID[0]; //returns the enrolled courses list
        } catch (error) {
            console.error('Error fetching courses:', error);
            coursesContainer.innerHTML = '<p>Error loading courses. Please try again later.</p>';
        }
    }

});
