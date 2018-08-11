// Youtube Iframe APIの呼び出し
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var json;
var currentVideo = 0;
var tag;

function onYouTubeIframeAPIReady() {
  $.ajax({
    url: 'https://script.google.com/macros/s/AKfycbxJOWoWTM1lKPXX0J1aXAXgBHA1jBOFDaHQ1JLPeLrArbYsLGe9/exec',
    type: 'GET'
  })
  .done((data) => {
    console.log("succeded for getting data");
    json = JSON.parse(data);
    $('#title').append(' [' + json.length + ']');
    for (var i in json) {
      var a = document.createElement('a');
      a.href = '#';
      a.setAttribute('onclick', 'loadPlayer(' + i + ')');
      a.classList.add('relative');
      var img = document.createElement('img');
      img.src = json[i].thumbnail;
      img.classList.add('thumbnail');
      a.append(img);
      $('#video-list').append(a); 
    }
    // loadPlayer(0);
  })
  .fail((data) => {
    console.log("failed for getting data");
  })
  .always((data) => {
  });
}

function updateVideo(tag) {
  document.querySelector('#menu').close();
  document.querySelector('#info').close();
  $('#video-list').empty();
  $('#title').text(tag);
  $.ajax({
    url: 'https://script.google.com/macros/s/AKfycbxJOWoWTM1lKPXX0J1aXAXgBHA1jBOFDaHQ1JLPeLrArbYsLGe9/exec?tag=' + tag,
    type: 'GET'
  })
  .done((data) => {
    console.log("succeded for getting data");
    json = JSON.parse(data);
    $('#title').append(' [' + json.length + ']');
    for (var i in json) {
      var a = document.createElement('a');
      a.href = '#';
      a.setAttribute('onclick', 'loadPlayer(' + i + ')');
      a.classList.add('relative');
      var img = document.createElement('img');
      img.src = json[i].thumbnail;
      img.classList.add('thumbnail');
      a.append(img);
      $('#video-list').append(a); 
      // $('#video-list img').eq(i).attr('src', json[i].thumbnail);
    }
    // loadPlayer(0);
  })
  .fail((data) => {
    console.log("failed for getting data");
  })
  .always((data) => {
  });
}


$("#video-list > a").click(function () {
  console.log("from click a");
  loadPlayer($(this).attr("rel"));
});


function loadPlayer(id) {
  $('.loader').remove();
  $('<img>', {
    class: 'loader',
    src: 'img/loader_pause.gif',
  }).appendTo($('#video-list a').eq(id));

  $('#ons-list-info').empty();
  var html = $('#ons-list-info');
  html.append('<ons-list-item>Playing Video Info.</ons-list-item>');
  if (json[id].title) {
    html.append('<ons-list-header class="menu_header">Title</ons-list-header>');
    html.append('<ons-list-item>' + json[id].title + '</ons-list-item>');
  }
  if (json[id].year) {
    html.append('<ons-list-header class="menu_header">Filming Date</ons-list-header>');
    html.append('<ons-list-item>' + json[id].year + '/' + json[id].month + '</ons-list-item>');
  }
  if (json[id].creator_name_en) {
    html.append('<ons-list-header class="menu_header">Creator</ons-list-header>');
    var item = $('<ons-list-item>', {
      tappable: '',
      onclick: 'updateVideo("' + json[id].creator_name_en + '")',
    });
    item.text(json[id].creator_name_en);
    html.append(item);
  }

  html.append('<ons-list-header class="menu_header">Tag</ons-list-header>');
  var tags = [];
  if (json[id].country_name_en) {
    tags.push(json[id].country_name_en);
  }
  if (json[id].area_name_en) {
    tags.push(json[id].area_name_en);
  }
  if (json[id].spot_name_en) {
    tags.push(json[id].spot_name_en);
  }
  if (json[id].sea_name_en) {
    tags.push(json[id].sea_name_en);
  }
  if (json[id].other_name_en) {
    tags.push(json[id].other_name_en);
  }
  for (var tag of tags) {
    var item = $('<ons-list-item>', {
      tappable: '',
      onclick: 'updateVideo("' + tag + '")',
    });
    item.text(tag);
    html.append(item);    
  }
  
  currentVideo = id;
  console.log("loading video" + json[id].preview_url);
  console.log(json[id].end);
  if (player) {
    player.destroy();
  }
  player = new YT.Player('video-player', {
    height: '210',
    width: '100%',
    videoId: json[id].video_id,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },
    playerVars: {
      start: json[id].start,
      end: json[id].end,
      rel: 0,
      showinfo: 0,
      playsinline: 1,
      controls: 1,
      modestbranding: 1,
      disablekb: 1,
      enablejsapi: 0,
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  // 再生した時
  if (event.data == YT.PlayerState.PLAYING && !done) {
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
