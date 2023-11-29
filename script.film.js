const apiUrl = "https://opentdb.com/api.php?amount=20&category=11&type=multiple";

let quizData = [];
let currentQuestion = 0;
let score = 0;

const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const resultElement = document.getElementById('result');

async function fetchQuizData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        quizData = formatQuizData(data.results);
        loadQuestion();
    } catch (error) {
        console.error("Error fetching quiz data:", error);
    }
}

function formatQuizData(apiData) {
    return apiData.map(apiQuestion => {
        const formattedQuestion = {
            question: apiQuestion.question,
            options: [...apiQuestion.incorrect_answers, apiQuestion.correct_answer],
            correctAnswer: apiQuestion.correct_answer
        };
        return formattedQuestion;
    });
}

function loadQuestion() {
    const currentQuizData = quizData[currentQuestion];
    questionElement.textContent = currentQuizData.question;

    optionsContainer.innerHTML = "";
    currentQuizData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.setAttribute('data-index', index);
        button.addEventListener('click', selectOption);
        optionsContainer.appendChild(button);
    });
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

    // Disable options after selecting one
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.removeEventListener('click', selectOption);
        button.disabled = true;
    });

    // Show submit button after selecting an option
    document.getElementById('submit-btn').style.display = 'block';
}

function checkAnswer() {
    const currentQuizData = quizData[currentQuestion];

    const resultText = (score === quizData.length) ? "Herzlichen Glückwunsch! Du hast alle Fragen richtig beantwortet!" : `Du hast ${score} von ${quizData.length} Fragen richtig beantwortet.`;

    resultElement.textContent = resultText;

    // Show next question or quiz result
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
        document.getElementById('submit-btn').style.display = 'none';
    } else {
        document.getElementById('options-container').innerHTML = ""; // Clear options
        document.getElementById('submit-btn').style.display = 'none';
    }
}

// Initial load
fetchQuizData();
