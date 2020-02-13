export default function () {
    let header = document.querySelector('.row-header');
    let prevScroll = window.scrollY;

    document.addEventListener('scroll', _.throttle(function (event) {
        if (prevScroll > window.scrollY) { // scroll up
            header.classList.remove('row-header--hidden');
        }

        if (prevScroll < window.scrollY) { // scroll down
            header.classList.add('row-header--hidden');
        }

        prevScroll = window.scrollY;
    }, 300));
}
