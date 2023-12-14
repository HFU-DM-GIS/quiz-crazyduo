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

  // Diese Variablen werden verwendet um den aktuellen Zustand des Quiz zu prüfen
  let quizData = [];
  let currentQuestion = 0;
  let score = 0;

  const questionElement = document.getElementById("question");
  const optionsContainer = document.getElementById("options-container");
  const resultElement = document.getElementById("result");

  async function fetchQuizData() {
    //fetch-Funktion um die Fragen von der API abzurufen
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
    //Daten von der API werden umgewandelt in das Quizformat
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
    //Frage aufzurufen
    const currentQuizData = quizData[currentQuestion];
    let question = currentQuizData.question
      .replaceAll("&quot;", '"')
      .replaceAll("&rsquo;", "'")
      .replaceAll("&#039;", "'")
      .replaceAll("&amp;", "");

    questionElement.textContent = question;

    optionsContainer.innerHTML = "";
    currentQuizData.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = option
        .replaceAll("&quot;", '"')
        .replaceAll("&rsquo;", "'")
        .replaceAll("&#039;", "'")
        .replaceAll("&ntilde;&aacute", "ñá")
        .replaceAll ("&aring;", "å")
        .replaceAll ("&amp;", "");
      button.classList.add("option-btn");
      button.setAttribute("data-index", index);
      button.addEventListener("click", selectOption);
      optionsContainer.appendChild(button);
    });
  }

  function selectOption(event) {
    //Wird aufgerufen, wenn eine Antwort ausgewählt wird und prüft, ob die Antwort richtig oder falsch ist
    const selectedOption = event.target.textContent;
    const currentQuizData = quizData[currentQuestion];

    if (selectedOption === currentQuizData.correctAnswer) {
      score++;
      resultElement.textContent =
        "Herzlichen Glückwunsch! Du hast die Frage richtig beantwortet.";
    } else {
      resultElement.textContent = `Leider falsch! Die richtige Antwort ist ${currentQuizData.correctAnswer}.`;
    }

    // Disable options after selecting one
    const optionButtons = document.querySelectorAll(".option-btn");
    optionButtons.forEach((button) => {
      button.removeEventListener("click", selectOption);
      button.disabled = true;
    });

    // Show submit button after selecting an option
    document.getElementById("submit-btn").style.display = "block";
    document.getElementById("submit-btn").addEventListener('click', checkAnswer);
  }

  function checkAnswer() {
    //Zeigt die Anzahl der richtigen Antworten an
    const currentQuizData = quizData[currentQuestion];

    const resultText =
      score === quizData.length
        ? "Herzlichen Glückwunsch! Du hast alle Fragen richtig beantwortet!"
        : `Du hast ${score} von ${quizData.length} Fragen richtig beantwortet.`;

    resultElement.textContent = resultText;

    // Show next question or quiz result
    if (currentQuestion < quizData.length - 1) {
      currentQuestion++;
      loadQuestion();
      document.getElementById("submit-btn").style.display = "none";
    } else {
      // Clear question and options, show thank you message
      loadThankYouScreen();
    }
  }

  function loadThankYouScreen() {
    // Anzeigen des Dankes-Texts und der Ja/Nein-Buttons
    questionElement.textContent = "Vielen Dank für deine Teilnahme am Quiz. Möchtest du noch eine weitere Kategorie ausprobieren?";
    resultElement.textContent = ""; // Leeren Sie das Resultat-Element

    optionsContainer.innerHTML = "";

    // Erstellen der Ja/Nein-Buttons
    const yesButton = document.createElement("button");
    yesButton.textContent = "Ja";
    yesButton.classList.add("option-btn");
    yesButton.addEventListener("click", startNewQuiz); // Funktion für Ja-Button

    const noButton = document.createElement("button");
    noButton.textContent = "Nein";
    noButton.classList.add("option-btn");
    noButton.addEventListener("click", function () {
      // Funktion für Nein-Button
      console.log("Vielen Dank für die Teilnahme!");
      window.location.href = "quiz.beendet.html";
    });

    // Fügen Sie die Buttons dem Options-Container hinzu
    optionsContainer.appendChild(yesButton);
    optionsContainer.appendChild(noButton);
  }

  function startNewQuiz() {
   //Wechsel Kategorie Seite, beim drücken vom Button "Ja"
    console.log("Neues Quiz starten oder zu einer anderen Kategorie wechseln");
    window.location.href = "category.html";
  }

  // Initial load
  fetchQuizData();
}

checkUrl();

// Add an event listener for hashchange to update apiUrl dynamically
window.addEventListener("hashchange", checkUrl);
