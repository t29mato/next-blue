// グローバル変数
var videoPlayer;
var jsonVideo;
var NXB_API_URL = 'https://script.google.com/macros/s/AKfycbxJOWoWTM1lKPXX0J1aXAXgBHA1jBOFDaHQ1JLPeLrArbYsLGe9/exec';
var videoId;
var videoNum;

// YoutubeIframeAPIの準備
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// オススメtagを作成
function createReccomendTag () { 
  console.log('tagメニュー作成');
  var tags = {
    country: [
      'Fiji',
      'Palau',
      'Japan',
    ],
    island: [
      'Sipadan island',
      'Roatan island',
      'Guam island',
      'Hawai island',      
    ],
    sea: [
      'Red Sea',
    ],
    other: [
      'Wreck Diving',
      'Skin Diving',
      'Night Diving',
    ]
  };
  $('<ons-list-item>', {
    tappable: '',
    onclick: 'updateVideoList()',
  }).html('All').appendTo($('#video_tag'));
  for (var i in tags) {
    $('<ons-list-header>', {
      class: 'menu_header'
    }).html(i).appendTo($('#video_tag'));
    for (var tag of tags[i]) {
      $('<ons-list-item>', {
        tappable: '',
        onclick: 'updateVideoList("' + tag + '")',
      }).html(tag).appendTo($('#video_tag'));
    }
  }
}

// YoutubeIframeAPIが準備できたら実行
function onYouTubeIframeAPIReady() {
  getVideo().done(function(data) {    
    createReccomendTag();
    jsonVideo = JSON.parse(data);
    $('#title').html('All (' + jsonVideo.length + ')')
    createVideoPlayer(0);
    createVideoList();
    setLoader('pause', 0);
  })
}

// NJB_APIよりjsonにビデオ情報を取得
function getVideo(tag) {
  var url = NXB_API_URL;
  if (tag) { url = url + '?tag=' + tag; }
  return $.ajax({
    url: url,
    type: 'GET',
  })
}

// ビデオ一覧を更新
function updateVideoList(tag) {
  document.querySelector('#tag').close();
  document.querySelector('#info').close(); 
  if (tag) {
    $('#title').html(tag);
  } else {
    $('#title').html('All ');
  }
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
      href: '#',
      onclick: 'createVideoPlayer(' + num + ')',
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
  var tags = [
    ['Creator', 'channel_title'],
    ['Country', 'country_name_en'],
    ['Area', 'Area_name_en'],
    ['Island', 'island_name_en'],
    ['Sea', 'sea_name_en'],
    ['Tag', 'other_name_en']
  ];
  $('<ons-list-item>').html('Video Info.').appendTo(html);
  if (jsonVideo[num].title) {
    html.append('<ons-list-header class="menu_header">Title</ons-list-header>');
    html.append('<ons-list-item>' + jsonVideo[num].title + '</ons-list-item>');
  }
  if (jsonVideo[num].year) {
    html.append('<ons-list-header class="menu_header">Filming Date</ons-list-header>');
    html.append('<ons-list-item>' + jsonVideo[num].year + '/' + jsonVideo[num].month + '</ons-list-item>');
  }

  for (var tag of tags) {
    if (jsonVideo[num][tag[1]]) {
      html.append('<ons-list-header class="menu_header">' + tag[0] + '</ons-list-header>');
      $('<ons-list-item>', {
        tappable: '',
        onclick: 'updateVideoList("' + jsonVideo[num][tag[1]] + '")',
      }).text(jsonVideo[num][tag[1]]).appendTo(html);
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
    height: 'auto',
    width: 'auto',
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
  // event.target.playVideo();
}

// ビデオの状態が変更になったら、
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    setLoader('play');
  }
  if (event.data == YT.PlayerState.ENDED) {
    nextVideo();
  }
  if (event.data == YT.PlayerState.PAUSED) {
    setLoader('pause');
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