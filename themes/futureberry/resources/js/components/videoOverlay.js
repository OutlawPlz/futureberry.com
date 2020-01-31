export default function () {
    let keywords = document.querySelectorAll('.keyword');
    let video = document.querySelector('#video');
    let content = document.querySelector('.row-main');

    window.addEventListener('scroll', _.debounce(function (event) {
        if ( ! video.paused) pauseVideo(event.target);
    }, 300));

    keywords.forEach(keyword => {
        if (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0)) {
            keyword.addEventListener('click', event => {
                video.paused ? playVideo(event.target) : pauseVideo(event.target);
            });

            return;
        }

        keyword.addEventListener('mouseenter', event => {
            playVideo(event.target);
        });

        keyword.addEventListener('mouseout', event => {
            pauseVideo(event.target);
        })
    });

    async function playVideo(keyword) {
        video.src = keyword.dataset.video;

        await video.play();

        content.classList.add('hidden');
        video.classList.add('shown');
    }

    function pauseVideo(keyword) {
        video.pause();

        content.classList.remove('hidden');
        video.classList.remove('shown');
    }
}
