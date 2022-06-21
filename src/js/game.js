const $question = document.querySelector("#question");
const $choices = Array.from(document.querySelectorAll(".choice-text"));
const $progressBarText = document.querySelector("#progressText");
const $userScoreText = document.querySelector("#userScore");
const $progressBarFull = document.querySelector("#progressBarFull");
const $loadingSpinner = document.querySelector("#loadingSpinner");
const $game = document.querySelector("#game");
const $gameContainer = document.querySelector("#game-container");
const $endContainer = document.querySelector("#end-container");
const $username = document.querySelector("#username");
const $saveScoreBtn = document.querySelector("#saveScoreBtn");
const $finalScore = document.querySelector("#finalScore");

var he = require("he");

let currentQuestion = {};
let isAcceptingChoice = false;
let userScore = 0;
// let questionsFromJSON = require("./questions.json");
let questionCounter = 0;
let questionsArray = [];

var questions = [];

fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
)
  .then((res) => res.json())
  .then((data) => {
    // console.log(data.results);

    questions = data.results.map((question) => {
      const formattedQuestion = {
        question: he.decode(question.question),
      };

      let choices = [...question.incorrect_answers];
      choices = choices.map((choice) => he.decode(choice));
      question.correct_answer = he.decode(question.correct_answer);
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      choices.splice(formattedQuestion.answer - 1, 0, question.correct_answer);

      choices.forEach((choice, idx) => {
        formattedQuestion["choice" + (idx + 1)] = choice;
      });

      // console.log(formattedQuestion);

      return formattedQuestion;
    });

    startGame();
  });

// CONSTANTS
const SCORE_FOR_CORRECT = 10;
const SCORE_FOR_INCORRECT = -2;
const MAX_QUESTION_NUM = 10;

const startGame = () => {
  questionCounter = 0;
  userScore = 0;
  questionsArray = [...questions];
  getNewQuestion();
  $loadingSpinner.classList.add("hidden");
  $game.classList.remove("hidden");
};

const getNewQuestion = () => {
  // check if any available questions in array or if asked the max number of questions
  if (questionsArray.length === 0 || questionCounter >= MAX_QUESTION_NUM) {
    localStorage.setItem("recentUserScore", userScore);
    // let endPageUrl = new URL("end.html", import.meta.url);
    // console.log(endPageUrl);
    // return window.location.assign("./end.html");
    $gameContainer.style.display = "none";
    $endContainer.style.display = "flex";
    // $finalScore.innerText = recentUserScore;
    $finalScore.innerText = userScore;
  }
  // increment counter
  questionCounter++;

  // change game info text
  $progressBarText.textContent = `Question ${questionCounter}/${MAX_QUESTION_NUM}`;

  // update progress bar
  $progressBarFull.style.width = `${
    (questionCounter / MAX_QUESTION_NUM) * 100
  }%`;

  // get random number between 0 and length of the available questions array
  const questionIdx = Math.floor(Math.random() * questionsArray.length);

  // get the question at that idx location and render to DOM
  currentQuestion = questionsArray[questionIdx];
  $question.textContent = currentQuestion.question;

  // render the choices for that question to the DOM
  $choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.textContent = currentQuestion["choice" + number];
  });

  // remove the used question from the remaining questions array
  questionsArray.splice(questionIdx, 1);

  isAcceptingChoice = true;
};

$choices.forEach((choice) => {
  choice.addEventListener("click", (evt) => {
    // console.log(evt.target);
    if (!isAcceptingChoice) return;

    isAcceptingChoice = false;
    const selectedChoice = evt.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    // console.log(selectedAnswer == currentQuestion.answer);

    // apply style classes based on choice correctness
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
    // console.log(classToApply);

    if (classToApply === "correct") {
      changeScore(SCORE_FOR_CORRECT);
    } else if (classToApply === "incorrect" && userScore > 0) {
      changeScore(SCORE_FOR_INCORRECT);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    // remove styles after interval
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

const changeScore = (changeAmount) => {
  userScore += changeAmount;
  $userScoreText.textContent = userScore;
};

// SAVE SCORE SCREEN

// const $username = document.querySelector("#username");
// const $saveScoreBtn = document.querySelector("#saveScoreBtn");
// const $finalScore = document.querySelector("#finalScore");

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
