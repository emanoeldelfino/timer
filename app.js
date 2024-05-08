const playPause = document.querySelector("#play-pause");
const darkModeBtn = document.querySelector("#dark-mode-btn");
const r = document.querySelector(":root");
const timer = document.querySelector("#timer");
const reset = document.querySelector("#reset");
const title = document.querySelector("title");
const hours = document.querySelector(".hours");
const minutes = document.querySelector(".minutes");
const seconds = document.querySelector(".seconds");
const inputs = document.querySelectorAll(".timer-input");
const bellSoundEffect = new Audio('./sounds/bell.mp3');

let previousTime,
  elapsedTime = 0;

inputs.forEach((elem) => {
  elem.addEventListener("input", (event) => {
    const target = event.target;

    if (!target.checkValidity()) target.value = target.value.slice(0, -1);
  });
});

darkModeBtn.addEventListener("click", () => {
  darkModeBtn.innerText = toggleText(darkModeBtn, "dark_mode", "lightbulb");
  let bg, fg;
  [bg, fg] =
    darkModeBtn.innerText === "lightbulb"
      ? ["black", "white"]
      : ["white", "black"];
  r.style.setProperty("--background", bg);
  r.style.setProperty("--foreground", fg);
});

document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    playPause.click();
  } else {
    e.key.toUpperCase() === "R" && reset.click();
  }
});

playPause.addEventListener("click", () => {
  playPause.innerText = toggleText(playPause, "play_arrow", "pause");
  if (playPause.innerText === "pause") { 
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
});

reset.addEventListener("click", () => {
  hours.value = "";
  minutes.value = "";
  seconds.value = "";

  if ((playPause.innerText = "pause")) {
    playPause.innerText = toggleText(playPause, "play_arrow", "pause");
    clear();
  }
});

function clear() {
  clearInterval(timerInterval);
  inputs.forEach(input => {
    input.readOnly = false;
  });
}

function toggleText(elem, ...args) {
  const elemText = elem.innerText;

  if (args.includes(elemText) && !hasDuplicates(args)) {
    let replaceText = "";
    if (args.indexOf(elemText) < args.length - 1) {
      replaceText = args[args.indexOf(elemText) + 1];
    } else {
      replaceText = args[0];
    }

    return replaceText;
  } else {
    throw new Error(
      "Invalid arguments after elem. It doesn't include the text of element or it has duplicates."
    );
  }
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
    clear();
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
