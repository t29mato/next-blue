// This is a JavaScript file

document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'home') {
        page.querySelector('#menu_button').onclick = function () {
            document.querySelector('#menu').open();
        };
        page.querySelector('#info_button').onclick = function () {
            document.querySelector('#info').open();
        };
    }
    else if (page.id === 'movie_details') {
        page.querySelector('#movie_title').innerHTML = page.data.title;
    }
});