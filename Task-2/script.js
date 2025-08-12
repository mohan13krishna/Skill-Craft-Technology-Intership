let startTime, updatedTime, difference = 0;
let tInterval, running = false;
let lapCounter = 1;

const display = document.getElementById("display");
const startStopBtn = document.getElementById("startStop");
const lapBtn = document.getElementById("lap");
const resetBtn = document.getElementById("reset");
const themeToggle = document.getElementById("themeToggle");
const lapsList = document.getElementById("lapsList");
const body = document.body;

function updateTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;

    let hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((difference / (1000 * 60)) % 60);
    let seconds = Math.floor((difference / 1000) % 60);
    let milliseconds = difference % 1000;

    display.innerHTML = 
        `${("0" + hours).slice(-2)}:` +
        `${("0" + minutes).slice(-2)}:` +
        `${("0" + seconds).slice(-2)}.` +
        `${("00" + milliseconds).slice(-3)}`;
}

startStopBtn.addEventListener("click", () => {
    if (!running) {
        startTime = new Date().getTime() - difference;
        tInterval = setInterval(updateTime, 10);
        startStopBtn.innerHTML = "Pause";
        running = true;
    } else {
        clearInterval(tInterval);
        startStopBtn.innerHTML = "Start";
        running = false;
    }
});

lapBtn.addEventListener("click", () => {
    if (running) {
        let li = document.createElement("li");
        li.textContent = `Lap ${lapCounter}: ${display.innerHTML}`;
        lapsList.appendChild(li);
        lapCounter++;
    }
});

resetBtn.addEventListener("click", () => {
    clearInterval(tInterval);
    difference = 0;
    running = false;
    display.innerHTML = "00:00:00.000";
    startStopBtn.innerHTML = "Start";
    lapsList.innerHTML = "";
    lapCounter = 1;
});

themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    body.classList.toggle("light-theme");
});
