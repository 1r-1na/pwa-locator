import backImage from "./x-circle.svg";
import saveImage from "./save.svg";
import pauseImage from "./pause-btn.svg";
import playImage from "./play-btn.svg";
import { CURRENT_POS_KEY, LATEST_POS_KEY } from "./keys.js";

let width;
let height;
let canvasImgBlob = null;
let currentCoordinates = null;

const video = document.getElementById("video");
const backButton = document.getElementById("back");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const saveButton = document.getElementById("save");
const photo = document.getElementById("photo");
const canvas = new OffscreenCanvas(320, 260);

function adjustAspectRations() {
  width = video.offsetWidth;
  height = video.offsetHeight;
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
  canvas.width = width;
  canvas.height = height;
  drawImage();

  canvas.convertToBlob({ type: "image/jpeg" }).then((blob) => {
    canvasImgBlob = blob;
    const imageData = URL.createObjectURL(blob);
    photo.src = imageData;
    photo.width = width;
    photo.height = height;
  });
}

function drawImage() {
  currentCoordinates = localStorage.getItem(CURRENT_POS_KEY);
  const context = canvas.getContext("2d");
  // draw taken picture
  context.drawImage(video, 0, 0, width, height);
  // draw current coordinates
  context.font = "48px, serif";
  const textMetrics = context.measureText(currentCoordinates);
  const xPos = canvas.width / 2 - textMetrics.width / 2;
  const yPos = canvas.height;
  context.fillStyle = "rgba(255,255,0,0.5)";
  context.fillRect(xPos - 2.5, yPos - 50.5, textMetrics.width + 5, 50);
  context.fillStyle = "rgba(0,0,0,1.0)";
  context.fillText(currentCoordinates, xPos, yPos - 5);
}

//further initializations as soon as a video stream appears
video.addEventListener("canplay", adjustAspectRations, false);

pauseButton.addEventListener(
  "click",
  (ev) => {
    toPictureMode();
    takePicture();
    stopStreamedVideo();
    ev.preventDefault();
  },
  false
);

playButton.addEventListener(
  "click",
  (ev) => {
    toVideoMode();
    startStreamedVideo();
    ev.preventDefault();
  },
  false
);

saveButton.addEventListener(
  "click",
  (ev) => {
    const reader = new FileReader();
    reader.onloadend = function () {
      localStorage.setItem(LATEST_POS_KEY, currentCoordinates);
      localStorage.setItem(currentCoordinates, reader.result);
    };
    reader.readAsDataURL(canvasImgBlob);
  },
  false
);

function stopStreamedVideo() {
  const tracks = video.srcObject.getTracks();

  tracks.forEach((track) => {
    track.stop();
  });

  video.srcObject = null;
}

function startStreamedVideo() {
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
}

window.onload = () => {
  backButton.src = backImage;
  pauseButton.src = pauseImage;
  playButton.src = playImage;
  saveButton.src = saveImage;

  toVideoMode();
  startStreamedVideo();
};
