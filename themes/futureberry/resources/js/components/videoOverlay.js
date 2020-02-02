export default function () {
    let keywords = document.querySelectorAll('.keyword');
    let video = document.querySelector('#video');
    let content = document.querySelector('.row-main');

    window.addEventListener('scroll', _.debounce(function (event) {
        if ( ! video.paused) pauseVideo(event.target);
    }, 150));

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
            if (event.relatedTarget.classList.contains('keyword') ||
                event.relatedTarget.classList.contains('keyword__link') ||
                event.relatedTarget.classList.contains('keyword__label')) return;

            pauseVideo(event.target);
        })
    });

    async function playVideo(keyword) {
        video.src = keyword.dataset.video_url;

        await video.play();

        let link = keyword.querySelector('.keyword__link');

        if (link) link.classList.add('active');

        content.classList.add('hidden');
        video.classList.add('shown');
    }

    function pauseVideo(keyword) {
        video.pause();

        let link = document.querySelector('.keyword__link.active');

        if (link) link.classList.remove('active');

        content.classList.remove('hidden');
        video.classList.remove('shown');
    }
}
