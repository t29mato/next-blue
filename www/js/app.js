// グローバル変数
var videoPlayer;
var jsonVideo;
var NXB_API_URL = 'https://script.google.com/macros/s/AKfycbw6IbZpgyHknQ4ARKAzNEGv4bVwthZBoYExxQZSOxoKfdds_8Q/exec';
var videoId;
var videoNum;

// YoutubeIframeAPIが準備できたら実行
function onYouTubeIframeAPIReady() {  getVideo().done(function(data) {
    jsonVideo = JSON.parse(data);
    $('#title').append(' (' + jsonVideo.length + ')');
    createVideoPlayer(0);
    createVideoList();
    setLoader('pause', 0);
  })
}


// NJB_APIよりjsonにビデオ情報を取得
function getVideo(tag) {
  var url = NXB_API_URL;  if (tag) { url = url + '?tag=' + tag; }
  return $.ajax({
    url: url,
    type: 'GET',
  })
}


// ビデオ一覧を更新
function updateVideoList(tag) {
  document.querySelector('#menu').close();
  document.querySelector('#info').close();  $('#title').html(tag);
  $('#video_list').html('<div style="text-align:center; position:relative; top:50px;"><ons-icon size="50px" spin icon="md-spinner"></ons-icon></div>');
  getVideo(tag).done(function(data) {
    jsonVideo = JSON.parse(data);
    $('#title').append(' (' + jsonVideo.length + ')');
    emptyVideoList();
    createVideoList();
  })
}

// ビデオ一覧を作成
function createVideoList() {
  for (var num in jsonVideo) {
    var a = $('<a>', {
      href: '#',      onclick: 'createVideoPlayer(' + num + ')',
      class: 'relative',
    });
    var img = $('<img>', {
      src: jsonVideo[num].thumbnail,
      class: 'thumbnail',
    });
    a.html(img);
    $('#video_list').append(a);
    if (jsonVideo[num].video_id == videoId) {
      setLoader('play', num);
    }
  }
}


// ビデオ一覧を空に
function emptyVideoList() {
  $('#video_list').empty();
}

// ビデオ情報を更新
function updateVideoInfo(num) {
  $('#video_info').empty();
  var html = $('#video_info');
  var tags = ['country_name_en', 'area_name_en', 'spot_name_en', 'sea_name_en', 'other_name_en'];
  $('<ons-list-item>').html('Video Info.').appendTo(html);
  if (jsonVideo[num].title) {    html.append('<ons-list-header class="menu_header">Title</ons-list-header>');
    html.append('<ons-list-item>' + jsonVideo[num].title + '</ons-list-item>');
  }
  if (jsonVideo[num].year) {
    html.append('<ons-list-header class="menu_header">Filming Date</ons-list-header>');
    html.append('<ons-list-item>' + jsonVideo[num].year + '/' + jsonVideo[num].month + '</ons-list-item>');
  }
  if (jsonVideo[num].creator_name_en) {
    html.append('<ons-list-header class="menu_header">Creator</ons-list-header>');
    $('<ons-list-item>', {
      tappable: '',
      onclick: 'updateVideoList("' + jsonVideo[num].creator_name_en + '")',
    }).text(jsonVideo[num].creator_name_en).appendTo(html);
  }
  html.append('<ons-list-header class="menu_header">Tag</ons-list-header>');
  for (var tag of tags) {
    if (jsonVideo[num][tag]) {
      $('<ons-list-item>', {
        tappable: '',
        onclick: 'updateVideoList("' + jsonVideo[num][tag] + '")',
      }).text(jsonVideo[num][tag]).appendTo(html);
    }
  }

}


// Iframeを埋め込みビデオを再生
function createVideoPlayer(num) {
  videoId = jsonVideo[num].video_id;
  videoNum = num;
  if (videoPlayer) { videoPlayer.destroy(); }
  updateVideoInfo(num);
  setLoader('pause', num);
  videoPlayer = new YT.Player('video_player', {
    height: '210',    width: '100%',
    videoId: videoId,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },
    playerVars: {
      start: jsonVideo[num].start,
      end: jsonVideo[num].end,
      showinfo: 0,
      playsinline: 1,
      controls: 1,
      modestbranding: 1,
      disablekb: 1,
      enablejsapi: 0,
    }
  });
}


// ローダーアニメーションを設定
function setLoader(type, num) {
  var loaderSrc;
  if (type == 'play') {
    loaderSrc = 'img/loader.gif';
  }
  if (type == 'pause') {
    loaderSrc = 'img/loader_pause.gif';
  }  if (!num) {
    $('.loader').attr('src', loaderSrc);
  }
  if (num >= 0) {
    $('.loader').remove();
    $('<img>', {
      class: 'loader',
      src: loaderSrc,
    }).appendTo($('#video_list a').eq(num));  
  }
}


// 再生の準備が整ったらビデオ再生
function onPlayerReady(event) {
  event.target.playVideo();
}


// ビデオの状態が変更になったら、
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    setLoader('play');  } else if (event.data == YT.PlayerState.ENDED) {
    nextVideo();
  }
}

// 音楽プレイヤー用
function playVideo() {  videoPlayer.playVideo();
  setLoader('play');
}
function pauseVideo() {
  videoPlayer.pauseVideo();
  setLoader('pause');
}
function stopVideo() {
  videoPlayer.stopVideo();
  setLoader('pause');
}
function goVideo() {
  var currentTime = videoPlayer.getCurrentTime();
  videoPlayer.seekTo(currentTime + 15);
}
function backVideo() {
  var currentTime = videoPlayer.getCurrentTime();
  videoPlayer.seekTo(currentTime -15);
}
function nextVideo() {
  videoNum++;
  if ((videoNum + 1) >= jsonVideo.length) {
    videoNum = 0;
  }
  createVideoPlayer(videoNum);
}