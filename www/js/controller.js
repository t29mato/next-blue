// This is a JavaScript file

document.addEventListener('init', function (event) {
    var page = event.target;
    if (page.id === 'home') {
        page.querySelector('#tag_button').onclick = function () {
            document.querySelector('#tag').open();
        };
        page.querySelector('#info_button').onclick = function () {
            document.querySelector('#info').open();
        };
    }
});

