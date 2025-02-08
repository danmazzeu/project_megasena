export function loading(status, title = 'empty', description = 'empty') {
    const loading = document.getElementById('loading');

    if (status == undefined) { alert('Configure o status do loading.'); return; }

    if (status === true) {
        if (title == 'empty') { alert('Configure o título do loading.'); return; }
        if (description == 'empty') { alert('Configure a descrição do loading.'); return; }

        if (title == 'Manutenção') {
            loading.querySelector('i').classList.remove('bi-arrow-counterclockwise');
            loading.querySelector('i').classList.add('bi-emoji-frown-fill');
        }

        loading.querySelector('h1').textContent = title;
        loading.querySelector('p').textContent = description;
        loading.querySelector('p').style.maxWidth = '300px';
        loading.classList.add('show');
    }

    if (status === false) {
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }
}