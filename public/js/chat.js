document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const messageContainer = document.getElementById('message-container');
    const messageForm = document.getElementById('send-container');
    const messageInput = document.getElementById('message-input');
    const userListContainer = document.getElementById('user-list-container');
    const userList = document.getElementById('user-list');
  
    // Get the name from the query parameters
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
  
    if (name) {
      // Emit 'new-user' event
      socket.emit('new-user', name);
      userListContainer.style.display = 'block';
    } else {
          // Redirect to index.html if name is not provided
    window.location.href = 'index.html';
}

// Event listener for 'selected-recipient' event
socket.on('selected-recipient', (recipient) => {
  appendMessage(`You are now chatting with ${recipient.name}`);
});

// Event listener for 'chat-message' event
socket.on('chat-message', (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

// Event listener for 'user-list' event
socket.on('user-list', (users) => {
  userList.innerHTML = '';
  users.forEach(user => {
    if (user.name !== name) {
      const userElement = document.createElement('li');
      userElement.innerText = user.name;
      userElement.addEventListener('click', () => {
        socket.emit('select-recipient', user.id);
        messageForm.style.display = 'block';
        userListContainer.style.display = 'none';
      });
      userList.append(userElement);
    }
  });
});

// Event listener for form submission
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  socket.emit('send-chat-message', message);
  messageInput.value = '';
  appendMessage(`You: ${message}`, 'sent');
});

// Append messages to the message container
function appendMessage(message, sender = 'received') {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add(sender);
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
});
