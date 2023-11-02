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
const stopButton = document.getElementById("stop");
const startButton = document.getElementById("start");
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

//further initializations as soon as a video stream appears
video.addEventListener("canplay", adjustAspectRations, false);

function takePicture() {
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, width, height);

  const imageData = canvas.toDataURL("image/jpeg");
  photo.setAttribute("src", imageData);
}

stopButton.addEventListener(
  "click",
  (ev) => {
    streaming = false;
    takePicture();
    video.style.display = "none";
    photo.style.display = "block";
    stopButton.style.display = "none";
    startButton.style.display = "block";
    ev.preventDefault();
  },
  false
);

startButton.addEventListener(
  "click",
  (ev) => {
    streaming = true;
    video.style.display = "block";
    photo.style.display = "none";
    stopButton.style.display = "block";
    startButton.style.display = "none";
    ev.preventDefault();
  },
  false
);

window.onload = () => {
  backButton.src = backImage;
  stopButton.src = pauseImage;
  startButton.src = playImage;
  saveButton.src = saveImage;

  startButton.style.display = "none";
  photo.style.display = "none";

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
