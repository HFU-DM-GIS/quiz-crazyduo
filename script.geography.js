const quizData = [
    {
        question: "Was ist die Hauptstadt von Frankreich?",
        options: ["Berlin", "Madrid", "Paris", "Rom"],
        correctAnswer: "Paris"
    },
    {
        question: "In welchem Land liegt die Sahara-Wüste?",
        options: ["Marokko", "Ägypten", "Algerien", "Sudan"],
        correctAnswer: "Algerien"
    },
    {
        question: "Welcher Fluss fließt durch London?",
        options: ["Themse", "Seine", "Donau", "Tiber"],
        correctAnswer: "Themse"
    },
    {
        question: "In welchem Land liegt die Akropolis?",
        options: ["Italien", "Griechenland", "Türkei", "Ägypten"],
        correctAnswer: "Griechenland"
    },
    {
        question: "Welcher Berg ist der höchste in Europa?",
        options: ["Mont Blanc", "Matterhorn", "Zugspitze", "Elbrus"],
        correctAnswer: "Elbrus"
    },
    {
        question: "Welches Land liegt östlich von Indien?",
        options: ["China", "Bangladesch", "Pakistan", "Sri Lanka"],
        correctAnswer: "Bangladesch"
    },
    {
        question: "Welches Land hat die meisten Einwohner?",
        options: ["Indien", "China", "USA", "Russland"],
        correctAnswer: "China"
    },
    {
        question: "In welchem Meer liegt die Insel Kreta?",
        options: ["Mittelmeer", "Adriatisches Meer", "Ägäisches Meer", "Rotes Meer"],
        correctAnswer: "Ägäisches Meer"
    },
    {
        question: "Welches Land hat die längste Küstenlinie?",
        options: ["Russland", "Kanada", "USA", "Australien"],
        correctAnswer: "Kanada"
    },
    {
        question: "Welcher Fluss fließt durch Ägypten?",
        options: ["Nil", "Euphrat", "Tigris", "Jangtsekiang"],
        correctAnswer: "Nil"
    }
];

let currentQuestion = 0;
let score = 0;

const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const resultElement = document.getElementById('result');

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
loadQuestion();