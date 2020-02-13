export default function () {
    let isTouch = ('ontouchstart' in window) || (navigator.MaxTouchPoints > 0);

    let manifest = document.querySelector('#main');
    let video = document.querySelector('.hotword__video');
    let hotwords = document.querySelectorAll('.hotword');

    if (isTouch) {
        window.addEventListener('click', event => {
            let isHotword = event.target.classList.contains('hotword') ||
                event.target.classList.contains('hotword__label');

            let src = getSrcAttribute(event.target);

            if ( ! isHotword) {
                return videoPause();
            }

            video.paused ? videoPlay(src) : videoPause();
        });
    } else {
        hotwords.forEach(hotword => {
            hotword.addEventListener('mouseenter', event => {
                let src = getSrcAttribute(event.target);

                videoPlay(src);
            });

            hotword.addEventListener('mouseout', event => {
                if (event.relatedTarget.classList.contains('hotword') ||
                    event.relatedTarget.classList.contains('hotword__link') ||
                    event.relatedTarget.classList.contains('hotword__label')) return;

                videoPause();
            });
        });
    }

    // hotwords.forEach(hotword => {
    //     let label = hotword.querySelector('.hotword__label');
    //     let link = hotword.querySelector('.hotword__link');
    //
    //     if ( ! link) {
    //         return;
    //     }
    //
    //     let popper = new Popper(label, link, {
    //         placement: 'top',
    //     });
    // });

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

        hotword.classList.add('hotword--active');
        manifest.classList.add('hidden');
        video.classList.add('hotword__video--shown');
    }

    function videoPause()
    {
        let src = video.src;
        video.pause();

        let hotword = document.querySelector(`span[data-video_url="${src}"]`);

        hotword.classList.remove('hotword--active');
        manifest.classList.remove('hidden');
        video.classList.remove('hotword__video--shown');
    }

    function getSrcAttribute(element)
    {
        let src = '';

        if (element.classList.contains('hotword')) {
            src = element.dataset.video_url;
        }

        if (element.parentElement.classList.contains('hotword')) {
            src = element.parentElement.dataset.video_url;
        }

        return src;
    }
}
