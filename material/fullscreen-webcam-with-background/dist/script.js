(function () {
  'use strict';
  var video = document.querySelector('video')
  var streaming = !0
  navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

  // navigator.getMedia({ video: { facingMode: 'environment' }, audio: false }, function (stream) {
  //   // if ('srcObject' in video) {
  //   //     video.srcObject = stream;
  //   //   } else {
  //   //     video.src = vu.createObjectURL(stream);
  //   //   }
  //   // video.play();
  //   video.srcObject = stream
  // }, function (error) {
  //   if (window.console)
  //     console.error(error);
  // });



  if (navigator.mediaDevices) {
    // access the web cam
    navigator.mediaDevices.getUserMedia({video: { facingMode: 'environment'}})
    // permission granted:
      .then(function(stream) {
        video.srcObject = stream;
        video.play();
        // video.addEventListener('click', takeSnapshot);
      })
      // permission denied:
      .catch(function(error) {
        document.body.textContent = 'Could not access the camera. Error: ' + error.name;
      });
  }
  video.addEventListener('canplay', function (ev) {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      streaming = !0;
    }
  }, !1);
})();