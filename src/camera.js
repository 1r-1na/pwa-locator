import backImage from "./x-circle.svg";
import saveImage from "./save.svg";
import pauseImage from "./pause-btn.svg";
import playImage from "./play-btn.svg";

let width = 320; // We will scale the photo width to this
let height = 0; // This will be computed based on the input stream
let streaming = false; //flag for a 1st-time init

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");
const backButton = document.getElementById("back");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const saveButton = document.getElementById("save");

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

function toVideoMode() {
  video.style.display = "block";
  photo.style.display = "none";
  pauseButton.style.display = "block";
  playButton.style.display = "none";
  saveButton.disabled = true;
}

function toPictureMode() {
  video.style.display = "none";
  photo.style.display = "block";
  pauseButton.style.display = "none";
  playButton.style.display = "block";
  saveButton.disabled = false;
}

function takePicture() {
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, width, height);

  const imageData = canvas.toDataURL("image/jpeg");
  photo.setAttribute("src", imageData);
}

//further initializations as soon as a video stream appears
video.addEventListener("canplay", adjustAspectRations, false);

pauseButton.addEventListener(
  "click",
  (ev) => {
    toPictureMode();
    takePicture();
    ev.preventDefault();
  },
  false
);

playButton.addEventListener(
  "click",
  (ev) => {
    toVideoMode();
    ev.preventDefault();
  },
  false
);

window.onload = () => {
  backButton.src = backImage;
  pauseButton.src = pauseImage;
  playButton.src = playImage;
  saveButton.src = saveImage;

  toVideoMode();

  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((err) => console.error("An error occurred:", err));
};
