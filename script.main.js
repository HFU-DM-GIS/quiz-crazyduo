function checkUrl() {
    var url = window.location.href;
    var apiUrl;
  
    switch (true) {
      case url.indexOf("geography") > -1:
        apiUrl = "https://opentdb.com/api.php?amount=20&category=22&type=multiple";
        break;
      case url.indexOf("film") > -1:
        apiUrl = "https://opentdb.com/api.php?amount=20&category=11&type=multiple";
        break;
      case url.indexOf("sport") > -1:
        apiUrl = "https://opentdb.com/api.php?amount=20&category=21&type=multiple";
        break;
      case url.indexOf("allgemeinwissen") > -1:
        apiUrl = "https://opentdb.com/api.php?amount=20&category=9&type=multiple";
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
          .replaceAll("&ntilde;&aacute", "ñá");
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
    document.getElementById("submit-btn").addEventListener('click', checkAnswer).style.display = "block";
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
      document.getElementById("options-container").innerHTML = ""; // Clear options
      document.getElementById("submit-btn").style.display = "none";
    }
  }

  // Initial load
  fetchQuizData();
}

checkUrl();

// Add an event listener for hashchange to update apiUrl dynamically
window.addEventListener("hashchange", checkUrl);
