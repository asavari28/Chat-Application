document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const nameInput = document.getElementById('name-input');
  
    startBtn.addEventListener('click', () => {
      const name = nameInput.value;
      if (name.trim() !== '') {
        window.location.href = `inde-chat.html?name=${encodeURIComponent(name)}`;
      }
    });
  });
  