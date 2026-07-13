(function () {
    'use strict';

    var body = document.body;
    var html = document.documentElement;
    var media = window.matchMedia('(prefers-color-scheme: dark)');

    function applyTheme(dark) {
        body.classList.toggle('dark', dark);
        html.classList.toggle('dark', dark);
    }

    applyTheme(media.matches);

    if (media.addEventListener) {
        media.addEventListener('change', function (event) {
            applyTheme(event.matches);
        });
    } else if (media.addListener) {
        media.addListener(function (event) {
            applyTheme(event.matches);
        });
    }

    var year = document.getElementById('copy-year');
    if (year) year.textContent = new Date().getFullYear();
})();
