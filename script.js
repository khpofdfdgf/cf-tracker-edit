function sendMessage() {
    const userInput = document.getElementById('message-input').value;
    displayMessage('user', userInput);

    // Replace 'YOUR_API_KEY' and 'YOUR_MODEL_ID' with actual values
    const apiKey = 'YOUR_API_KEY';
    const modelId = 'YOUR_MODEL_ID';
    const apiUrl = `https://api.openai.com/v1/engines/${modelId}/completions`;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            prompt: userInput,
            max_tokens: 50,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const chatGptResponse = data.choices[0].text;
        displayMessage('chatbot', chatGptResponse);
    })
    .catch(error => {
        console.error('Error:', error);
        displayMessage('chatbot', 'Sorry, an error occurred. Please try again.');
    })
    .finally(() => {
        document.getElementById('message-input').value = '';
    });
}

function displayMessage(sender, message) {
    const chatWindow = document.getElementById('chat-window');
    const newMessage = document.createElement('div');
    newMessage.className = sender;
    newMessage.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatWindow.appendChild(newMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
