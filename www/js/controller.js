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
        if (ons.platform.isIOS()) {
            $('#video_player').addClass('video_player_ios');
            $('#video_controller').addClass('video_controller_ios');
            $('#video_list').addClass('video_list_ios');
        }
        if (ons.platform.isAndroid()) {
            $('#video_player').addClass('video_player_android');
            $('#video_controller').addClass('video_controller_android');
            $('#video_list').addClass('video_list_android');
        }
    }
});

