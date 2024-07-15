document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get('course');

    document.getElementById('backToCourseBtn').href = `course.html?course=${course}`;

    document.getElementById('userPlaceholder').textContent = 'User'; // This will be dynamically set based on login

    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    sendButton.addEventListener('click', function() {
        const userMessage = chatInput.value;
        if (userMessage.trim() !== "") {
            const userMessageElement = document.createElement('div');
            userMessageElement.classList.add('text-right');
            userMessageElement.innerHTML = `<strong>You:</strong> ${userMessage}`;
            chatContainer.appendChild(userMessageElement);
            chatInput.value = '';

            // Simulate chatbot response
            setTimeout(function() {
                const botMessageElement = document.createElement('div');
                botMessageElement.classList.add('text-left');
                botMessageElement.innerHTML = `<strong>Bot:</strong> I received your message: ${userMessage}`;
                chatContainer.appendChild(botMessageElement);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 1000);
        }
    });

    chatInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });
});
