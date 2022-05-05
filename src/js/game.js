const $question = document.querySelector("#question");
const $choices = Array.from(document.querySelectorAll(".choice-text"));
const $progressBarText = document.querySelector("#progressText");
const $userScoreText = document.querySelector("#userScore");
const $progressBarFull = document.querySelector("#progressBarFull");

let currentQuestion = {};
let isAcceptingChoice = false;
let userScore = 0;
let questionCounter = 0;
let questionsArray = [];

// console.log($choices);

let questions = [
  {
    question: "Inside which HTML element do we put the JavaScript??",
    choice1: "<script>",
    choice2: "<javascript>",
    choice3: "<js>",
    choice4: "<scripting>",
    answer: 1,
  },
  {
    question:
      "What is the correct syntax for referring to an external script called 'xxx.js'?",
    choice1: "<script href='xxx.js'>",
    choice2: "<script name='xxx.js'>",
    choice3: "<script src='xxx.js'>",
    choice4: "<script file='xxx.js'>",
    answer: 3,
  },
  {
    question: " How do you write 'Hello World' in an alert box?",
    choice1: "msgBox('Hello World');",
    choice2: "alertBox('Hello World');",
    choice3: "msg('Hello World');",
    choice4: "alert('Hello World');",
    answer: 4,
  },
];

// CONSTANTS
const SCORE_FOR_CORRECT = 10;
const SCORE_FOR_INCORRECT = -2;
const MAX_QUESTION_NUM = 3;

const startGame = () => {
  questionCounter = 0;
  userScore = 0;
  questionsArray = [...questions];
  // console.log(questionsArray);
  getNewQuestion();
};

const getNewQuestion = () => {
  // check if any available questions in array or if asked the max number of questions
  if (questionsArray.length === 0 || questionCounter >= MAX_QUESTION_NUM) {
    localStorage.setItem("recentUserScore", userScore);
    return window.location.assign("../end.html");
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
    console.log(evt.target);
    if (!isAcceptingChoice) return;

    isAcceptingChoice = false;
    const selectedChoice = evt.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    console.log(selectedAnswer == currentQuestion.answer);

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
    }, 250);
  });
});

const changeScore = (changeAmount) => {
  userScore += changeAmount;
  $userScoreText.textContent = userScore;
};

startGame();
