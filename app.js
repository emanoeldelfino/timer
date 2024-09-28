const playPauseBtn = document.querySelector("#play-pause");
const darkModeBtn = document.querySelector("#dark-mode-btn");
const rootElem = document.querySelector(":root");
const timer = document.querySelector("#timer");
const resetBtn = document.querySelector("#reset");
const title = document.querySelector("title");
const hours = document.querySelector(".hours");
const minutes = document.querySelector(".minutes");
const seconds = document.querySelector(".seconds");
const inputs = document.querySelectorAll(".timer-input");
const bellSoundEffect = new Audio('./sounds/bell.mp3');

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");

  console.log(savedTheme)

  if (savedTheme === "light")
    setLightMode();
});

let previousTime, elapsedTime = 0;

let timerInterval;

inputs.forEach((elem) => {
  elem.addEventListener("input", (event) => {
    const target = event.target;

    if (!target.checkValidity()) target.value = target.value.slice(0, -1);
  });
});

darkModeBtn.addEventListener("click", darkModeFn);

document.addEventListener("keydown", (e) => {
  if (e.key === " ")
    playPause();
  else if (e.key.toUpperCase() === "R")
    reset();
});

playPauseBtn.addEventListener("click", playPause);

resetBtn.addEventListener("click", reset);

function darkModeFn() {
  if (darkModeBtn.innerText === "lightbulb")
    setLightMode();
  else
    setDarkMode();
}

function setDarkMode() {
  localStorage.setItem("theme", "dark");
  rootElem.style.setProperty("--background", "black");
  rootElem.style.setProperty("--foreground", "white");
  darkModeBtn.innerText = "lightbulb";
}

function setLightMode() {
  localStorage.setItem("theme", "light");
  rootElem.style.setProperty("--background", "white");
  rootElem.style.setProperty("--foreground", "black");
  darkModeBtn.innerText = "dark_mode";
}

function playPause() {
  playPauseBtn.innerText = playPauseBtn.innerText === "play_arrow" ? "pause" : "play_arrow";
  if (playPauseBtn.innerText === "pause") { 
    inputs.forEach(input => {
      input.readOnly = true;
    });

    let lastUpdateTime = Date.now();

    timerInterval = setInterval(() => {
      const currentTime = Date.now();
      const elapsedSeconds = (currentTime - lastUpdateTime) / 1000;

      if (Math.floor(elapsedSeconds) >= 1) {
        decreaseOneSecondTimer();
        lastUpdateTime = currentTime;
      }
    }, 50);
  } else {
    clear();
  }
}

function reset() {
  hours.value = "";
  minutes.value = "";
  seconds.value = "";
  title.innerText = "Timer";
  playPauseBtn.innerText = "play_arrow";
  clear();
}

function clear() {
  clearInterval(timerInterval);
  inputs.forEach(input => {
    input.readOnly = false;
  });
}

function decreaseOneSecondTimer() {
  let hoursValue = parseInt(hours.value || 0, 10);
  let minutesValue = parseInt(minutes.value || 0, 10);
  let secondsValue = parseInt(seconds.value || 0, 10);

  secondsValue--;

  if (secondsValue < 0) {
    secondsValue = 59;
    minutesValue--;
  }

  if (minutesValue < 0) {
    minutesValue = 59;
    hoursValue--;
  }

  if (hoursValue < 0) {
    hoursValue = 0;
  }

  hours.value = padZero(hoursValue);
  minutes.value = padZero(minutesValue);
  seconds.value = padZero(secondsValue);

  title.innerText = `${hours.value}:${minutes.value}:${seconds.value}`;

  if (hoursValue === minutesValue && minutesValue === secondsValue && secondsValue === 0) {
    reset();
    bellSoundEffect.play();
    return;
  }
}

function padZero(number) {
  return number < 10 ? `0${number}` : number;
}

function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}
