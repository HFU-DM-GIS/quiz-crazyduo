document.addEventListener("DOMContentLoaded", function () {
  checkUrl();
});

function checkUrl() {
  var url = window.location.href;
  var apiUrl;

  switch (true) {
    case url.indexOf("geography") > -1:
      apiUrl = "https://opentdb.com/api.php?amount=10&category=22&type=multiple";
      break;
    case url.indexOf("film") > -1:
      apiUrl = "https://opentdb.com/api.php?amount=10&category=11&type=multiple";
      break;
    case url.indexOf("sport") > -1:
      apiUrl = "https://opentdb.com/api.php?amount=10&category=21&type=multiple";
      break;
    case url.indexOf("allgemeinwissen") > -1:
      apiUrl = "https://opentdb.com/api.php?amount=10&category=9&type=multiple";
      break;
    default:
      console.error("Ungültige Kategorie");
      return;
  }
  console.log("API-URL: " + apiUrl);

  let quizData = [];
  let currentQuestion = 0;
  let score = 0;

  const questionElement = document.getElementById("question");
  const optionsContainer = document.getElementById("options-container");
  const resultElement = document.getElementById("result");
  const timerElement = document.getElementById("timer");

  if (!timerElement) {
    console.log("Timer-Element nicht gefunden");
    return;
  }

  let timerSeconds = 30;
  let timerInterval;

  function startTimer() {
    timerInterval = setInterval(function () {
      timerElement.textContent = `Die Zeit läuft: ${timerSeconds} Sekunden`;

      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        // Wenn der Timer abgelaufen ist, rufe die Funktion auf, um die Frage als falsch zu bewerten
        checkAnswer();
      } else {
        timerSeconds--; // Dekrementiere den Timer nur, wenn er größer als 0 ist
      }
    }, 1000); // 1000 Millisekunden entsprechen 1 Sekunde
    
    // Stellen Sie sicher, dass der Timer zuerst korrekt aktualisiert wird, bevor er auf 0 gesetzt wird
    timerElement.textContent = `Die Zeit läuft: ${timerSeconds} Sekunden`;

  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  async function fetchQuizData() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(response);
      console.log(data);
      quizData = formatQuizData(data.results);
      loadQuestion();
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  }

  function formatQuizData(apiData) {
    return apiData.map((apiQuestion) => {
      const formattedQuestion = {
        question: apiQuestion.question,
        options: [...apiQuestion.incorrect_answers, apiQuestion.correct_answer],
        correctAnswer: apiQuestion.correct_answer,
      };
      return formattedQuestion;
    });
  }

  function loadQuestion() {
    const currentQuizData = quizData[currentQuestion];
    let question = currentQuizData.question.replaceAll("&quot;", '"').replaceAll("&rsquo;", "'").replaceAll("&#039;", "'").replaceAll("&amp;", "").replaceAll("Llanfair&shy;pwllgwyngyll&shy;gogery&shy;chwyrn&shy;drobwll&shy;llan&shy;tysilio&shy;gogo&shy;goch","Llanfairpwll");

    questionElement.textContent = question;

    optionsContainer.innerHTML = "";
    currentQuizData.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = option.replaceAll("&quot;", '"').replaceAll("&rsquo;", "'").replaceAll("&#039;", "'").replaceAll("&ntilde;&aacute", "ñá").replaceAll("&aring;", "å").replaceAll("&amp;", "").replaceAll("&ouml;","ö");
      button.classList.add("option-btn");
      button.setAttribute("data-index", index);
      button.addEventListener("click", selectOption);
      optionsContainer.appendChild(button);
    });

    // Überprüfen Sie, ob timerElement gefunden wurde
    const timerElement = document.getElementById("timer");
    if (!timerElement) {
      console.error("Timer-Element nicht gefunden");
      return;
    }

    // Timer zurücksetzen und stoppen
    timerSeconds = 30;
    stopTimer();

    // Starten Sie den Timer, wenn das Dokument vollständig geladen wurde
    startTimer();
  }

  function selectOption(event) {
    const selectedOption = event.target.textContent;
    const currentQuizData = quizData[currentQuestion];

    if (selectedOption === currentQuizData.correctAnswer) {
      score++;
      resultElement.textContent = "Herzlichen Glückwunsch! Du hast die Frage richtig beantwortet.";
    } else {
      resultElement.textContent = `Leider falsch! Die richtige Antwort ist ${currentQuizData.correctAnswer}.`;
    }

    stopTimer();

    const optionButtons = document.querySelectorAll(".option-btn");
    optionButtons.forEach((button) => {
      button.removeEventListener("click", selectOption);
      button.disabled = true;
    });

    document.getElementById("submit-btn").style.display = "block";
    document.getElementById("submit-btn").addEventListener('click', checkAnswer);
  }

  function checkAnswer() {
    stopTimer();

    const currentQuizData = quizData[currentQuestion];

    const resultText = score === quizData.length
      ? "Herzlichen Glückwunsch! Du hast alle Fragen richtig beantwortet!"
      : `Du hast ${score} von ${quizData.length} Fragen richtig beantwortet.`;

    resultElement.textContent = resultText;

    if (currentQuestion < quizData.length - 1) {
      currentQuestion++;
      loadQuestion();
      document.getElementById("submit-btn").style.display = "none";
    } else {
      loadThankYouScreen();
    }
  }

  function loadThankYouScreen() {
    questionElement.textContent = "Vielen Dank für deine Teilnahme am Quiz. Möchtest du noch eine weitere Kategorie ausprobieren?";
    resultElement.textContent = "";

    optionsContainer.innerHTML = "";

    const yesButton = document.createElement("button");
    yesButton.textContent = "Ja";
    yesButton.classList.add("option-btn");
    yesButton.addEventListener("click", startNewQuiz);

    const noButton = document.createElement("button");
    noButton.textContent = "Nein";
    noButton.classList.add("option-btn");
    noButton.addEventListener("click", function () {
      console.log("Vielen Dank für die Teilnahme!");
      window.location.href = "quiz.beendet.html";
    });

    optionsContainer.appendChild(yesButton);
    optionsContainer.appendChild(noButton);
  }

  function startNewQuiz() {
    console.log("Neues Quiz starten oder zu einer anderen Kategorie wechseln");
    window.location.href = "category.html";
  }

  // Initial load
  fetchQuizData();
}

// Fügen Sie einen Event-Listener für das DOMContentLoaded-Ereignis hinzu
document.addEventListener("DOMContentLoaded", function () {
  // Rufen Sie Ihre Funktion checkUrl auf, wenn das DOM vollständig geladen ist
  checkUrl();
});
