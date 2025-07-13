document.addEventListener("DOMContentLoaded", function () {
  // Feedback mode toggle
  const feedbackToggle = document.getElementById("feedback-mode");
  let instantFeedback = false;

  feedbackToggle.addEventListener("change", () => {
    instantFeedback = feedbackToggle.checked;
    localStorage.setItem("feedbackMode", instantFeedback ? "instant" : "end");
  });

  // Load feedback mode from storage
  const savedMode = localStorage.getItem("feedbackMode");
  if (savedMode === "instant") {
    feedbackToggle.checked = true;
    instantFeedback = true;
  }

  // Quiz logic
  const form = document.getElementById("quiz-form");
  const topicInput = document.getElementById("quizTopic");
  const quizContainer = document.getElementById("quizContainer");
  const loadingIcon = document.getElementById("loading-icon");

  let currentQuiz = [];
  let userAnswers = [];
  let totalScore = 0;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const topic = topicInput.value.trim();
    if (!topic) return;

    // Reset quiz state
    currentQuiz = [];
    userAnswers = [];
    totalScore = 0;

    quizContainer.innerHTML = "";
    loadingIcon.classList.remove("hidden");

    fetch("/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    })
      .then((res) => res.json())
      .then((data) => {
        loadingIcon.classList.add("hidden");
        if (data.quiz) {
          currentQuiz = data.quiz;
          renderQuiz(data.quiz);
        } else {
          quizContainer.innerHTML = `<div class="score-card">${
            data.error || "Failed to load quiz."
          }</div>`;
        }
      })
      .catch(() => {
        loadingIcon.classList.add("hidden");
        quizContainer.innerHTML = `<div class="score-card">Error fetching quiz. Try again.</div>`;
      });
  });

  function renderQuiz(quiz) {
    quizContainer.innerHTML = "";

    quiz.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-question-index", idx);

      // Question
      const q = document.createElement("div");
      q.className = "card__question";
      q.textContent = `Q${idx + 1}: ${item.question}`;
      card.appendChild(q);

      // Options
      const optionsDiv = document.createElement("div");
      optionsDiv.className = "card__options";
      const correct = item.correct_answer[0].toLowerCase();
      const options = item.options.trim().split("\n");

      options.forEach((optText) => {
        if (!optText.trim()) return;

        const btn = document.createElement("button");
        btn.className = "btn btn--option";
        btn.textContent = optText;
        btn.setAttribute("aria-label", optText);
        btn.setAttribute("data-option", optText[0].toLowerCase());

        btn.onclick = function () {
          if (btn.disabled) return;

          // Visual feedback for selection
          btn.classList.add("selected");

          // Store user's answer
          userAnswers[idx] = {
            question: item.question,
            userAnswer: optText,
            correctAnswer: item.correct_answer,
            isCorrect: optText[0].toLowerCase() === correct,
          };

          if (userAnswers[idx].isCorrect) {
            totalScore++;
          }

          if (instantFeedback) {
            // Show immediate feedback
            showQuestionFeedback(optionsDiv, correct, idx);
          } else {
            // Just disable options and show selection
            optionsDiv.querySelectorAll(".btn--option").forEach((b) => {
              b.disabled = true;
              if (b !== btn) {
                b.style.opacity = "0.5";
              }
            });
          }

          // Scroll to next question if not the last one
          const nextQuestionIndex = idx + 1;
          if (nextQuestionIndex < quiz.length) {
            setTimeout(
              () => {
                const nextCard = document.querySelector(
                  `[data-question-index="${nextQuestionIndex}"]`
                );
                if (nextCard) {
                  nextCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              },
              instantFeedback ? 1000 : 500
            );
          }

          // Check if quiz is complete
          if (userAnswers.filter((a) => a).length === quiz.length) {
            setTimeout(
              () => {
                // Always show detailed feedback at the end
                showDetailedResults();
              },
              instantFeedback ? 1500 : 1000
            );
          }
        };

        optionsDiv.appendChild(btn);
      });

      card.appendChild(optionsDiv);
      quizContainer.appendChild(card);
    });
  }

  function showQuestionFeedback(optionsDiv, correct, questionIndex) {
    // Disable all options
    optionsDiv.querySelectorAll(".btn--option").forEach((btn) => {
      btn.disabled = true;

      const optionLetter = btn.getAttribute("data-option");

      if (optionLetter === correct) {
        btn.classList.remove("selected");
        btn.classList.add("correct");
      } else if (btn.classList.contains("selected")) {
        btn.classList.remove("selected");
        btn.classList.add("wrong");
      } else {
        btn.style.opacity = "0.5";
      }
    });
  }

  function showDetailedResults() {
    // Apply visual feedback to all existing questions
    userAnswers.forEach((answer, idx) => {
      if (!answer) return;

      const card = document.querySelector(`[data-question-index="${idx}"]`);
      if (!card) return;

      const optionsDiv = card.querySelector(".card__options");
      const correctLetter = currentQuiz[idx].correct_answer[0].toLowerCase();

      // Apply feedback to existing buttons
      showQuestionFeedback(optionsDiv, correctLetter, idx);
    });

    // Add score display at the bottom
    const resultsDiv = document.createElement("div");
    resultsDiv.className = "quiz-complete";

    const title = document.createElement("h3");
    title.textContent = "Quiz Complete!";
    resultsDiv.appendChild(title);

    const scoreDiv = document.createElement("div");
    scoreDiv.className = "score-card";
    scoreDiv.textContent = `Final Score: ${totalScore} out of ${currentQuiz.length}`;
    resultsDiv.appendChild(scoreDiv);

    quizContainer.appendChild(resultsDiv);

    // Scroll to results
    setTimeout(() => {
      resultsDiv.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
});
