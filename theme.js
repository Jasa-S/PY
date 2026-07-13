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

    var navigation = document.querySelector('.site-nav');
    var currentPage = navigation && navigation.querySelector('[aria-current="page"]');
    function alignNavigation() {
        if (!navigation || !currentPage || navigation.scrollWidth <= navigation.clientWidth) return;
        var navigationRect = navigation.getBoundingClientRect();
        var currentRect = currentPage.getBoundingClientRect();
        var currentCenter = currentRect.left - navigationRect.left + navigation.scrollLeft + currentRect.width / 2;
        navigation.scrollLeft = Math.max(0, currentCenter - navigation.clientWidth / 2);
    }

    alignNavigation();
    window.addEventListener('load', alignNavigation, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignNavigation);
})();
