const audio = new Audio();
let isPlaying = false;

const playerIcons = document.querySelectorAll('.player i');

playerIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        const audioData = this.dataset.audio;
        const audioPath = `./audios/${audioData}.mp3`;

        playerIcons.forEach(icon => {
            icon.classList.add('bi-play-circle-fill');
            icon.classList.remove('bi-pause-circle-fill');
        });

        isPlaying = !isPlaying;

        if (isPlaying) {
            this.classList.remove('bi-play-circle-fill');
            this.classList.add('bi-pause-circle-fill');
            audio.src = audioPath;
            audio.play();
        } else {
            this.classList.add('bi-play-circle-fill');
            this.classList.remove('bi-pause-circle-fill');
            audio.pause();
        }
        audio.onerror = function() {
            console.error("Audio file not found:", audioPath);
        };
    });
});

audio.addEventListener('ended', function() {
    playerIcons.forEach(icon => {
        icon.classList.add('bi-play-circle-fill');
        icon.classList.remove('bi-pause-circle-fill');
        audio.pause();
        isPlaying = false;
    });
});