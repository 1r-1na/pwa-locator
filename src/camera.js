import backImage from "./x-circle.svg";
import saveImage from "./save.svg";
import stopImage from "./pause-btn.svg";
import resumeImage from "./play-btn.svg";
import cameraImage from "./camera.svg";

let width = 320; // We will scale the photo width to this
let height = 0; // This will be computed based on the input stream
let streaming = false; //flag for a 1st-time init

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");
const cameraButton = document.getElementById("takephoto");

function adjustAspectRations(event) {
  //perform a one-time adjustment of video's and photo's aspect ratio
  if (!streaming) {
    height = (video.videoHeight / video.videoWidth) * width;
    if (isNaN(height)) {
      height = (width * 3.0) / 4.0;
    }

    video.setAttribute("width", width);
    video.setAttribute("height", height);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    streaming = true;
  }
}

//further initializations as soon as a video stream appears
video.addEventListener("canplay", adjustAspectRations, false);

function takePicture() {
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, width, height);

  imageData = canvas.toDataURL("image/jpeg");
  photo.setAttribute("src", imageData);
  video.setAttribute("visibility", "collapse");
  photo.setAttribute("visibility", "visible");
}

cameraButton.addEventListener(
  "click",
  (ev) => {
    takePicture();
    ev.preventDefault();
  },
  false
);

window.onload = () => {
  const backButton = document.getElementById("back");
  backButton.src = backImage;
  cameraButton.src = cameraImage;
  const saveButton = document.getElementById("save");
  saveButton.src = saveImage;
  const stopButton = document.getElementById("stop");
  stopButton.src = stopImage;
  const resumeButton = document.getElementById("resume");
  resumeButton.src = resumeImage;
  photo.setAttribute("visibility", "collapse");

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((err) => console.error("An error occurred:", err));
};
