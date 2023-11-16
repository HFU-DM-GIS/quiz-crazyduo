const quizData = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
        correctAnswer: "Mars"
    },
    // Add more questions as needed
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

    const resultText = (score === quizData.length) ? "Congratulations! You got all questions right!" : `You got ${score} out of ${quizData.length} questions right.`;

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
