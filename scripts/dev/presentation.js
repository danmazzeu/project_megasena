const title = document.querySelector('#presentation h1');
let text = title.textContent;

title.textContent = '';

let charIndex = 0;
const typingSpeed = 100;
const pauseDuration = 2000;

function typeCharacter() {
    
    if (charIndex < text.length) {
        title.textContent += text[charIndex];
        charIndex++;
        setTimeout(typeCharacter, typingSpeed);
    } else {
        setTimeout(restartTyping, pauseDuration);
    }
}

function restartTyping() {
    if (text.length == 9) {
        text = text.substring(1);
    }
    title.textContent = 'M';
    charIndex = 0;
    setTimeout(typeCharacter, typingSpeed);
}


typeCharacter();