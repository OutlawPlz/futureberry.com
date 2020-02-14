export default function () {
    let isTouch = ('ontouchstart' in window) || (navigator.MaxTouchPoints > 0);

    let manifest = document.querySelector('#app');
    let video = document.querySelector('.hotword__video');
    let image = document.querySelector('.hotword__image');
    let hotwords = document.querySelectorAll('.hotword');

    if (isTouch) {
        window.addEventListener('click', event => {
            let isHotword = event.target.classList.contains('hotword') ||
                event.target.classList.contains('hotword__label');

            let src = getSrcAttribute(event.target);

            if ( ! isHotword) {
                isImage(src) ? hideImage() : videoPause();

                return;
            }

            if (isImage(src)) {
                image.classList.contains('hotword__image--shown') ?
                    hideImage() :
                    showImage(src);

                return;
            }

            video.paused ? videoPlay(src) : videoPause();
        });
    } else {
        hotwords.forEach(hotword => {
            hotword.addEventListener('mouseenter', event => {
                let src = getSrcAttribute(event.target);

                console.log(src);

                isImage(src) ? showImage(src) : videoPlay(src);
            });

            hotword.addEventListener('mouseout', event => {
                if (event.relatedTarget.classList.contains('hotword') ||
                    event.relatedTarget.classList.contains('hotword__link') ||
                    event.relatedTarget.classList.contains('hotword__label')) return;

                image.classList.contains('hotword__image--shown') ?
                    hideImage() :
                    videoPause();
            });
        });
    }

    window.addEventListener('scroll', _.throttle(function (event) {
        if (image.classList.contains('hotword__image--shown')) {
            hideImage();
        }

        if ( ! video.paused) {
            videoPause();
        }
    }, 300));

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

    function isImage(src)
    {
        let extension = src.split('.').pop();

        return extension !== 'mp4';
    }

    function showImage(src)
    {
        image.src = src;

        let hotword = document.querySelector(`span[data-video_url="${src}"]`);

        hotword.classList.add('hotword--active');
        manifest.classList.add('hidden');
        image.classList.add('hotword__image--shown');
    }

    function hideImage()
    {
        let src = image.src;

        console.log(src);

        let hotword = document.querySelector(`span[data-video_url="${src}"]`);

        hotword.classList.remove('hotword--active');
        manifest.classList.remove('hidden');
        image.classList.remove('hotword__image--shown');
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
