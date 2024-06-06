const chatContent = document.getElementById('chat');
const sendButton = document.getElementById('send-button');
const messageInput = document.getElementById('message-input');

function addInitialMessage() {
  addMessageToChat(
    'Chat AI',
    'Jelaskan tentang produk yang ingin anda pasarkan. Kami akan memberi bantuan strategi marketing dan microinfluencer yang cocok',
    'bot'
  );
}

function addMessageToChat(senderName, message, senderClass, messageId = null) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', senderClass);
  if (messageId) {
    messageElement.id = messageId;
  }

  if (senderClass === 'bot') {
    message = marked.parse(message);
  }

  messageElement.innerHTML = `<div class="chat-bubble"><strong>${senderName}</strong><p>${message}</p></div>`;
  chatContent.appendChild(messageElement);
}

function removeMessageFromChat(messageId) {
  const messageElement = document.getElementById(messageId);
  if (messageElement) {
    messageElement.remove();
  }
}

async function handleSendMessage() {
  try {
    const message = messageInput.value.trim();
    if (message === '') return;

    addMessageToChat('User', message, 'user');

    messageInput.value = '';

    chatContent.scrollTop = chatContent.scrollHeight + 200;

    const loadingMessageId = 'loading-message';
    addMessageToChat('Chat AI', 'Typing...', 'bot', loadingMessageId);

    const response = await fetch(
      'https://mrfirdauss-api-marketing.hf.space/generate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
      }
    );
    const data = await response.json();

    removeMessageFromChat(loadingMessageId);

    if (data.response) {
      addMessageToChat('Chat AI', data.response, 'bot');
    } else {
      addMessageToChat('Chat AI', 'Sorry, I did not understand that.', 'bot');
    }

    chatContent.scrollTop = chatContent.scrollHeight;
  } catch (e) {
    console.error(e);
    removeMessageFromChat('loading-message');
    addMessageToChat(
      'Chat AI',
      'There was an error processing your message. Please try again later.',
      'bot'
    );
    chatContent.scrollTop = chatContent.scrollHeight;
  }
}

sendButton.addEventListener('click', async (e) => await handleSendMessage());

messageInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    await handleSendMessage();
  }
});

document.addEventListener('DOMContentLoaded', (event) => {
  addInitialMessage();
});
