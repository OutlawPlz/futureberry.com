export default function () {
    let keywords = document.querySelectorAll('.keyword');
    let video = document.querySelector('#video');
    let content = document.querySelector('.row-main');

    keywords.forEach(keyword => {
        keyword.addEventListener('mouseenter', event => {
            content.classList.add('hidden');

            video.src = event.target.dataset.video;
            video.play();

            video.classList.add('shown');
        });

        keyword.addEventListener('mouseout', event => {
            video.pause();

            content.classList.remove('hidden');
            video.classList.remove('shown');
        })
    });
}
