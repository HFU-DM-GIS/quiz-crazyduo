document.addEventListener("DOMContentLoaded", function () {
  checkUrl();
});

function checkUrl() {
  var url = window.location.href;
  var apiUrl;

  switch (true) {
    //Verwende "includes()" anstelle von "indexOf()" für bessere Lesbarkeit
    //Vermeide das direkte Platzieren von API-URLs im Klartext im Code
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
    console.error("Timer-Element nicht gefunden");
    return;
  }
//Deklaration der Timer-Variablen kann direkt in der Funktion checkUrl erfolgen
  let timerSeconds = 30;
  let timerInterval;

  function startTimer() {
    timerInterval = setInterval(function () {
      timerElement.textContent = `Die Zeit läuft: ${timerSeconds} Sekunden`;

      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        result();
      } else {
        timerSeconds--; // Dekrementiere den Timer nur, wenn er größer als 0 ist
      }
    }, 1000); // 1000 Millisekunden entsprechen 1 Sekunde
    
    // Sicherstellung, dass der Timer zuerst korrekt aktualisiert wird, bevor er auf 0 gesetzt wird
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
      displayQuiz();
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  }

  function formatQuizData(apiData) {
    return apiData.map((apiQuestion) => {
      const formattedQuestion = {
        question: apiQuestion.question,
        options: shuffle([...apiQuestion.incorrect_answers, apiQuestion.correct_answer]),
        correctAnswer: apiQuestion.correct_answer,
      };
      return formattedQuestion;
    });
  }
  
  // Hilfsfunktion zum Mischen eines Arrays (Fisher-Yates Algorithmus)
  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
  
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  

  function displayQuiz() {
    const currentQuizData = quizData[currentQuestion];
    let question = currentQuizData.question.replaceAll("&quot;", '"').replaceAll("&rsquo;", "'").replaceAll("&#039;", "'").replaceAll("&amp;", "").replaceAll("Llanfair&shy;pwllgwyngyll&shy;gogery&shy;chwyrn&shy;drobwll&shy;llan&shy;tysilio&shy;gogo&shy;goch","Llanfairpwll").replaceAll("&ouml;","ö");

    questionElement.textContent = question;

    optionsContainer.innerHTML = "";
    currentQuizData.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = option.replaceAll("&quot;", '"').replaceAll("&rsquo;", "'").replaceAll("&#039;", "'").replaceAll("&ntilde;&aacute", "ñá").replaceAll("&aring;", "å").replaceAll("&amp;", "").replaceAll("&ouml;","ö").replaceAll("&oacute;n","ó");
      button.classList.add("option-btn");
      button.setAttribute("data-index", index);
      button.addEventListener("click", checkAnswer);
      optionsContainer.appendChild(button);
    });

    // Timer zurücksetzen und stoppen
    timerSeconds = 30;
    stopTimer();

    // Starten Sie den Timer, wenn das Dokument vollständig geladen wurde
    startTimer();
  }

  function checkAnswer(event) {
    stopTimer();  // Timer stoppen, wenn eine Antwort ausgewählt wurde
    const selectedOption = event.target.textContent;
    const currentQuizData = quizData[currentQuestion];

    if (selectedOption === currentQuizData.correctAnswer) {
      score++;
      resultElement.textContent = "Herzlichen Glückwunsch! Du hast die Frage richtig beantwortet.";
    } else {
      resultElement.textContent = `Leider falsch! Die richtige Antwort ist ${currentQuizData.correctAnswer}.`;
    }

    // Alle Optionsbutton deaktivieren, sobald eine Antwort ausgewählt wurde, um weitere Klicks zu verhindern
    const optionButtons = document.querySelectorAll(".option-btn");
    optionButtons.forEach((button) => {
      button.removeEventListener("click", checkAnswer);
      button.disabled = true;
    });

    document.getElementById("submit-btn").style.display = "block";
    document.getElementById("submit-btn").addEventListener('click', result);
  }

  function result() {
    stopTimer();
    //currentQuizData wird deklariert, aber nicht benutzt
    const currentQuizData = quizData[currentQuestion];

    const resultText = score === quizData.length
      ? "Herzlichen Glückwunsch! Du hast alle Fragen richtig beantwortet!"
      : `Du hast ${score} von ${quizData.length} Fragen richtig beantwortet.`;

    resultElement.textContent = resultText;

    if (currentQuestion < quizData.length - 1) {
      currentQuestion++;
      displayQuiz();
      document.getElementById("submit-btn").style.display = "none";
    } else {
      loadThankYouScreen();
    }
  }

  function loadThankYouScreen() {
    questionElement.textContent = "Vielen Dank für deine Teilnahme am Quiz. Möchtest du noch eine weitere Kategorie ausprobieren?";
    resultElement.textContent = "";

    optionsContainer.innerHTML = "";
    timerElement.style.display = "none";

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

    //Besser wäre es, den Button standardmäßig ausgeblendet zu haben
    //Button verstecken
    document.getElementById("submit-btn").style.display= "none";
  }

  function startNewQuiz() {
    console.log("Neues Quiz starten oder zu einer anderen Kategorie wechseln");
    window.location.href = "category.html";
  }

  // Initial load
  fetchQuizData();
}


