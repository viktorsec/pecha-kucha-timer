const BEFORE_TALK = "BEFORE_TALK";
const IN_TALK = "IN_TALK";
const AFTER_TALK = "AFTER_TALK";
const PANEL_LENGTH = 20000;
const PANEL_COUNT = 15;

var state = BEFORE_TALK;
var timeRemaining = PANEL_LENGTH * PANEL_COUNT;
var intervalId;

function renderPanelTime(time) {
    let panelTime = Math.floor(time % PANEL_LENGTH)
    if (panelTime === 0 && time > 0) {
        panelTime = PANEL_LENGTH;
    }
    if (panelTime < 5000) {
        console.log("changing color");
        $("#end-of-panel").css("color", "red");
    } else {
        $("#end-of-panel").css("color", "black");
    }
    const seconds = Math.floor(panelTime / 1000);
    let remainder = Math.floor((panelTime % 1000) / 10);
    if (remainder < 10) {
        remainder = '0' + remainder;
    }
    $("#end-of-panel").html(seconds + ':' + remainder);
}

function renderPresentationTime(time) {
    const minutes = Math.floor(time / (1000 * 60));
    let seconds = Math.floor((time % 60000) / 1000);
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    let remainder = Math.floor((time % 1000) / 10);
    if (remainder < 10) {
        remainder = '0' + remainder;
    }
    $("#end-of-presentation").html(minutes + ':' + seconds + ':' + remainder);
}

$(document).ready(function() {
    renderPanelTime(PANEL_LENGTH);
    renderPresentationTime(PANEL_LENGTH * PANEL_COUNT);
});

function endPresentation() {
    state = AFTER_TALK;
    $("#rearm-label").fadeIn();
}

function tick() {
    if (timeRemaining <= 0) {
        clearInterval(intervalId);
        endPresentation();
    } else {
        timeRemaining = timeRemaining - 10;
        renderPanelTime(timeRemaining);
        renderPresentationTime(timeRemaining);
    };
}

function startPresentation() {
    state = IN_TALK;
    $("#start-label").fadeOut();
    intervalId = setInterval(tick, 10);
}

function rearmPresentation() {
    timeRemaining = PANEL_LENGTH * PANEL_COUNT;
    state = BEFORE_TALK;
    renderPanelTime(timeRemaining);
    renderPresentationTime(timeRemaining);
    $("#rearm-label").fadeOut(null, () => {
        $("#start-label").fadeIn();
    });
}

document.onkeypress = function (event) {
    if (event.keyCode === 32) {
        if (state === BEFORE_TALK) {
            startPresentation();
        }
        else if (state === AFTER_TALK) {
            rearmPresentation();
        }
    }
};