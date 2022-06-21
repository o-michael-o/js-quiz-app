import { userScore } from "./game";

const $username = document.querySelector("#username");
const $saveScoreBtn = document.querySelector("#saveScoreBtn");
const $finalScore = document.querySelector("#finalScore");

let recentUserScore;
let highScores;

const MAX_HIGH_SCORES = 5;

window.addEventListener("DOMContentLoaded", (event) => {
  // console.log("DOM fully loaded and parsed");
  // get score from local storage and display to DOM

  recentUserScore = localStorage.getItem("recentUserScore");
  $finalScore.innerText = recentUserScore;
  // console.log(recentUserScore);

  // get high scores from local storage
  highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  // console.log(highScores);
});

const saveHighScore = (evt) => {
  // console.log("save high scores");
  evt.preventDefault();

  const score = {
    userScore: recentUserScore,
    username: username.value,
  };

  // console.log(score);
  highScores.push(score);

  highScores.sort((a, b) => b.userScore - a.userScore);
  // console.log(highScores);

  highScores.splice(5);

  localStorage.setItem("highScores", JSON.stringify(highScores));

  setTimeout(() => {
    window.location.assign("/");
  }, 1000);
};

$username.addEventListener("keyup", () => {
  // console.log(username.value);
  $saveScoreBtn.disabled = !username.value;
});

$saveScoreBtn.addEventListener("click", saveHighScore);
