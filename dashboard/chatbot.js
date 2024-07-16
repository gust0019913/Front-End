document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseName = urlParams.get('courseName');
    const contentPath = urlParams.get('contentPath');
    const email = localStorage.getItem('email')
    document.getElementById('user').textContent = email;

    document.getElementById('backToCourseBtn').href = `course.html?courseName=${courseName}`;

     // This will be dynamically set based on login



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

});
