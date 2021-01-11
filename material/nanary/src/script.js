// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };

// Define constants
const cameraView = document.querySelector("#camera--view"),
      cameraOutput = document.querySelector("#camera--output"),
      cameraBg = document.querySelector("#camera--bg"),
      cameraSensor = document.querySelector("#camera--sensor"),
      cameraTrigger = document.querySelector("#camera--trigger"),
      cameraToggleBg = document.querySelector("#camera--toggle-bg")
      // cameraToggleFb = document.querySelector("#camera--toggle-fb")

// Access the device camera and stream to cameraView
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(stream) {
    // track = stream.getTracks()[0];
    cameraView.srcObject = stream;
  })
    .catch(function(error) {
    console.error("Oops. Something is broken.", error);
  });
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);

  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraOutput.classList.add("taken");

  cameraBg.src = cameraOutput.src;
  cameraBg.classList.add("bg");
  cameraBg.hidden = false;
};
cameraToggleBg.onclick = function() {
  cameraBg.hidden = !cameraBg.hidden;
};
/*
cameraToggleBg.addEventListener('mousedown', function() {
  cameraBg.hidden = true;
});
cameraToggleBg.addEventListener('mouseup', function() {
  cameraBg.hidden = false;
});
cameraToggleFb.onclick = function() {
  alert('전/후 토글');
};
*/
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);
