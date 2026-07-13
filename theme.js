(function () {
    'use strict';

    var year = document.getElementById('copy-year');
    if (year) year.textContent = new Date().getFullYear();
})();
