import {apiUrls} from './api.url.js';

document.addEventListener("DOMContentLoaded", function () {
  checkUrl();
}); 


function checkUrl() {
  var url = window.location.href;
  var apiUrl;
  
    switch (true) {
      case url.includes("geography"):
        apiUrl = apiUrls.geography;
        break;
      case url.includes("film"):
        apiUrl = apiUrls.film;
        break;
      case url.includes("sport"):
        apiUrl = apiUrls.sport;
        break;
      case url.includes("allgemeinwissen"):
        apiUrl = apiUrls.allgemeinwissen;
        break;
      default:
        console.error("Ungültige Url");
        return;
    }
    console.log("API-URL festgelegt: " + apiUrl);
    

  let quizData = [];
  let currentQuestion = 0;
  let score = 0;
  let timerSeconds = 30;
  let timerInterval;

  const questionElement = document.getElementById("question");
  const optionsContainer = document.getElementById("options-container");
  const resultElement = document.getElementById("result");
  const timerElement = document.getElementById("timer");

  if (!timerElement) {
    console.error("Timer-Element nicht gefunden");
    return;
  }
// Funktion zum Starten des Timers
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
// Funktion zum Stoppen des Timers
  function stopTimer() {
    clearInterval(timerInterval);
  }
  // Event Listener hinzugefügt, um die Fehlermeldung bei Klick auszublenden
  document.getElementById("error-message").addEventListener("click", function () {
  this.style.display = "none";
  });
// Funktion zum Abrufen der Quizdaten
  async function fetchQuizData() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("API Response:", response);
      console.log("Quiz Data:", data);
      quizData = formatQuizData(data.results);
      displayQuiz();
    } catch (error) {
      console.error("Fehler beim Abrufen der Quizdaten:", error);

       // Fehlermeldung für den Besucher anzeigen, wenn die Quizdaten nicht abgerufen werden können
       const errorMessageElement = document.getElementById("error-message");
       errorMessageElement.style.display = "block";
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
  
  // Hilfsfunktion zum Mischen eines Arrays 
  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
  
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  
// Funktion zum Anzeigen des Quiz
  function displayQuiz() {
    const currentQuizData = quizData[currentQuestion];
    let question = currentQuizData.question.replaceAll("&quot;", '"').replaceAll("&rsquo;", "'").replaceAll("&#039;", "'").replaceAll("&amp;", "").replaceAll("Llanfair&shy;pwllgwyngyll&shy;gogery&shy;chwyrn&shy;drobwll&shy;llan&shy;tysilio&shy;gogo&shy;goch","Llanfairpwll").replaceAll("&ouml;","ö").replaceAll("&ldquo;The Iron Giant,&rdquo;","The Iron Giant");

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
// Funktion zur Überprüfung der Antwort
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
// Funktion zur Anzeige des Ergebnisses
  function result() {
    stopTimer();
    
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
// Funktion zum Laden des Dankeschön-Bildschirms
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

    //Button verstecken
    document.getElementById("submit-btn").style.display= "none";
  }
// Funktion zum Starten eines neuen Quiz
  function startNewQuiz() {
    console.log("Neues Quiz starten oder zu einer anderen Kategorie wechseln");
    window.location.href = "category.html";
  }

  // Initial load
  fetchQuizData();
}


