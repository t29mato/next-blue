var videoPlayer;
var jsonVideo;
var currentVideo;
var tag;
var NXB_API_URL = 'https://script.google.com/macros/s/AKfycbw6IbZpgyHknQ4ARKAzNEGv4bVwthZBoYExxQZSOxoKfdds_8Q/exec';

function onYouTubeIframeAPIReady() {
  getVideo().done(function(data) {
    jsonVideo = JSON.parse(data);
    createVideoPlayer(0);
    createVideoList();
  })
}

function getVideo(tag) {
  var url = NXB_API_URL;
  if (tag) { url = url + '?tag=' + tag; }
  return $.ajax({
    url: url,
    type: 'GET',
  })
}

function updateVideoList(tag) {
  emptyVideoList();
  getVideo(tag);
}

function createVideoList() {
  for (var i in jsonVideo) {
    var a = $('<a>', {
      href: '#',
      onclick: 'loadVideo(' + i + ')',
      class: 'relative',
    });
    var img = $('<img>', {
      src: jsonVideo[i].thumbnail,
      class: 'thumbnail',
    });
    a.html(img);
    $('#video_list').append(a);
  }
}

function emptyVideoList() {
  $('#video_list').empty();
}

function createVideoPlayer(num) {
  console.log(num);  
  console.log(jsonVideo[0]);  
  videoPlayer = new YT.Player('video_player', {
    height: '210',
    width: '100%',
    videoId: jsonVideo[num].video_id,
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

function destroyVideoPlayer() {
  if (videoPlayer) { videoPlayer.destroy(); }
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    $('.loader').attr('src','img/loader.gif');    
  } else if (event.data == YT.PlayerState.ENDED) {
    nextVideo();
  }
}

// 音楽プレイヤー用
function playVideo() {
  player.playVideo();
  $('.loader').attr('src','img/loader_pause.gif');
  console.log(player.getCurrentTime());
}
function pauseVideo() {
  player.pauseVideo();
  $('.loader').attr('src','img/loader_pause.gif');
}
function stopVideo() {
  player.stopVideo();
  $('.loader').attr('src','img/loader_pause.gif');
}
function goVideo() {
  var currentTime = player.getCurrentTime();
  player.seekTo(currentTime + 15);
}
function backVideo() {
  var currentTime = player.getCurrentTime();
  player.seekTo(currentTime -15);
}
function nextVideo() {
  loadPlayer(currentVideo + 1);
}
function previousVideo() {
  if (currentVideo == 0) {
    return;
  }
  loadPlayer(currentVideo - 1);
}
