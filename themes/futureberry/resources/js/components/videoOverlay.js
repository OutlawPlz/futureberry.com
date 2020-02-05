export default function () {
    let isTouch = ('ontouchstart' in window) || (navigator.MaxTouchPoints > 0);
    let manifest = document.querySelector('#main');
    let video = document.querySelector('#video');

    if (isTouch) {
        window.addEventListener('click', event => {
            let isHotword = event.target.classList.contains('keyword') ||
                event.target.classList.contains('keyword__label');

            let src = getSrcAttribute(event.target);

            if ( ! isHotword) {
                return videoPause();
            }

            video.paused ? videoPlay(src) : videoPause();
        });
    } else {
        document.querySelectorAll('.keyword').forEach(keyword => {
            keyword.addEventListener('mouseenter', event => {
                let src = getSrcAttribute(event.target);

                videoPlay(src);
            });

            keyword.addEventListener('mouseout', event => {
                if (event.relatedTarget.classList.contains('keyword') ||
                    event.relatedTarget.classList.contains('keyword__link') ||
                    event.relatedTarget.classList.contains('keyword__label')) return;

                videoPause();
            });
        });
    }

    window.addEventListener('scroll', _.debounce(function (event) {
        if ( ! video.paused) {
            videoPause();
        }
    }, 150));

    async function videoPlay(src)
    {
        video.src = src;

        await video.play();

        let hotword = document.querySelector(`span[data-video_url="${src}"]`);

        hotword.classList.add('active');
        manifest.classList.add('hidden');
        video.classList.add('shown');
    }

    function videoPause()
    {
        let src = video.src;
        video.pause();

        let hotword = document.querySelector(`span[data-video_url="${src}"]`);

        hotword.classList.remove('active');
        manifest.classList.remove('hidden');
        video.classList.remove('shown');
    }

    function getSrcAttribute(element)
    {
        let src = '';

        if (element.classList.contains('keyword')) {
            src = element.dataset.video_url;
        }

        if (element.parentElement.classList.contains('keyword')) {
            src = element.parentElement.dataset.video_url;
        }

        return src;
    }
}
