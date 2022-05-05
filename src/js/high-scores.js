const $highScoresList = document.querySelector("#highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

$highScoresList.innerHTML = highScores
  .map((highScore) => {
    return `<li class="high-score">${highScore.username}: ${highScore.userScore}</li>`;
  })
  .join("");
