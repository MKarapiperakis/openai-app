"use client";
import { useEffect, useRef, useState } from "react";
import classes from "./page.module.css";
import QuizFormSubmit from "../../components/quiz/quiz-form-submit";
import Score from "@/components/quiz/score";
import CodeForm from "@/components/code/code-form";
import shuffleArray from "@/lib/shuffleArray";
import { Mosaic, FourSquare, TrophySpin } from "react-loading-indicators";
import validation from "@/lib/validation";

export default function Quiz() {
  const [selectedTechnology, setSelectedTechnology] = useState("");
  const techRef = useRef(null);
  const difficultyRef = useRef(null);
  const modeRef = useRef(null);
  const questionsRef = useRef(null);
  const [isQuiz, setIsQuiz] = useState(false);
  const [quizStart, setQuizStart] = useState(false);
  const [quizEnd, setQuizEnd] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const [codeStart, setCodeStart] = useState(false);
  const [codeData, setCodeData] = useState(null);
  const [error, setError] = useState(false);

  const handleTechnologyChange = (event) => {
    setSelectedTechnology(event.target.value);
  };

  const handleModeChange = (event) => {
    if (event.target.value == "Quiz") setIsQuiz(true);
    else setIsQuiz(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(updatedAnswers);
  };

  const restartCodeQuiz = () => {
    setCodeStart(false);
    setCodeData(null);
    setSelectedTechnology("");
  };
  async function submitFormHandler(event) {
    try {
      event.preventDefault();
      setLoading(true);
      setError(false);

      const enteredTechnology = techRef.current.value;
      const enteredDifficulty = difficultyRef.current.value;
      const enteredMode = modeRef.current.value;
      const enteredQuestions = questionsRef.current?.value || null;

      const isDataValid = validation(
        enteredTechnology,
        enteredDifficulty,
        enteredMode,
        enteredQuestions
      );

      if (isDataValid) {
        if (enteredMode == "Quiz") {
          const reqBody = {
            technology: enteredTechnology,
            difficulty: enteredDifficulty,
            mode: enteredMode,
            questions: enteredQuestions,
          };

          const response = await fetch("/api/openAI", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          const data = await response.json();
          setQuizStart(true);
          const shuffledQuizData = JSON.parse(data.responseData);
          const correctAnswersArray = [];
          shuffledQuizData.questions.forEach((question) => {
            correctAnswersArray.push(question.answers[0]);
            question.answers = shuffleArray(question.answers);
          });
          setCorrectAnswers(correctAnswersArray);
          setSelectedAnswers(
            Array(shuffledQuizData.questions.length).fill(null)
          );
          setQuizData(shuffledQuizData);
          setQuizEnd(false);
        } else {
          const reqBody = {
            technology: enteredTechnology,
            difficulty: enteredDifficulty,
            mode: enteredMode,
          };

          const response = await fetch("/api/openAI", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          const data = await response.json();
          const codeData = JSON.parse(data.responseData);
          setCodeData(codeData);
          setCodeStart(true);
          setCodeEnd(false);
        }
      } else {
        setError(!isDataValid);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  }

  const checkAnswers = () => {
    let score = 0;
    quizData.questions.forEach((question, index) => {
      const selectedAnswerIndex = selectedAnswers[index];
      if (
        selectedAnswerIndex !== null &&
        question.answers[selectedAnswerIndex] === correctAnswers[index]
      ) {
        score++;
      }
    });
    let finalScore = (score / quizData.questions.length) * 100;
    setScore(Math.round(finalScore));
    setQuizEnd(true);
  };

  return (
    <>
      {!quizStart && !codeStart && (
        <header className={classes.header}>
          <h1>
            Start by selecting the{" "}
            <span className={classes.highlight}>
              technology you want to test your knowledge in
            </span>
          </h1>
          <p>Then choose the difficulty level and the testing mode</p>
        </header>
      )}
      <main className={classes.main}>
        {loading && (
          <div className={classes.loading}>
            <TrophySpin
              color="#3ee4ff"
              size="large"
              text="Generating Questions"
              textColor=""
            />
          </div>
        )}

        {!quizStart && !codeStart && !loading && (
          <form className={classes.form} onSubmit={submitFormHandler}>
            {/*Technology field*/}
            <div className={classes.row}>
              <p>
                <label htmlFor="Technology">Technology</label>
                <select
                  ref={techRef}
                  id="technology"
                  name="technology"
                  required
                  onChange={handleTechnologyChange}
                  value={selectedTechnology}
                >
                  <option value="">Select Technology</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="HTML">HTML</option>
                  <option value="CSS">CSS</option>
                  <option value="SQL">SQL</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                  <option value="Ruby">Ruby</option>
                  <option value="Swift">Swift</option>
                  {/* Add more options as needed */}
                </select>
              </p>
            </div>
            {/*Difficulty field*/}
            <div className={classes.row}>
              <p>
                <label htmlFor="difficulty">Difficulty</label>
                <select
                  ref={difficultyRef}
                  id="difficulty"
                  name="difficulty"
                  required
                >
                  <option value="">Select Difficulty</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </p>
            </div>
            {/*Mode field*/}
            <div className={classes.row}>
              <p>
                <label htmlFor="mode">Mode</label>
                <select
                  ref={modeRef}
                  id="mode"
                  name="mode"
                  required
                  onChange={handleModeChange}
                >
                  <option value="">Select Mode</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Code">Code</option>
                </select>
              </p>

              {isQuiz && (
                <p>
                  <label htmlFor="questions">Questions</label>
                  <select
                    ref={questionsRef}
                    id="questions"
                    name="questions"
                    required
                  >
                    <option value="">Select Number of Questions</option>
                    {[...Array(9).keys()].map((num) => (
                      <option key={num + 2} value={num + 2}>
                        {num + 2}
                      </option>
                    ))}
                  </select>
                </p>
              )}
            </div>
            {/*Submit button */}
            {error && (
              <div>
                <p className={classes.error}>
                  Please check your input and try again!
                </p>
              </div>
            )}
            <p className={classes.actions}>
              <QuizFormSubmit />
            </p>
          </form>
        )}

        {!quizEnd && quizData && (
          <div className={classes.quizContainer}>
            <div className={classes.questionContainer}>
              <p>
                <span className={classes.highlight}>
                  Question {currentQuestionIndex + 1}/
                  {quizData.questions.length}
                </span>
                <br></br>
                {quizData.questions[currentQuestionIndex].question}
              </p>
              <ul>
                {quizData.questions[currentQuestionIndex].answers.map(
                  (answer, answerIndex) => (
                    <li key={answerIndex}>
                      <input
                        type="radio"
                        id={`answer-${currentQuestionIndex}-${answerIndex}`}
                        name={`question-${currentQuestionIndex}`}
                        value={answer}
                        className={classes.radioButton}
                        checked={
                          selectedAnswers[currentQuestionIndex] === answerIndex
                        }
                        onChange={() => handleAnswerSelect(answerIndex)}
                      />
                      <label
                        htmlFor={`answer-${currentQuestionIndex}-${answerIndex}`}
                      >
                        {answer}
                      </label>
                    </li>
                  )
                )}
              </ul>

              <div className={classes.buttonsRow}>
                {!quizEnd && (
                  <button
                    onClick={handlePrevQuestion}
                    className={classes.quizButton}
                    disabled={currentQuestionIndex - 1 < 0}
                  >
                    Previous
                  </button>
                )}

                {!quizEnd &&
                  currentQuestionIndex + 1 == quizData.questions.length && (
                    <button
                      onClick={checkAnswers}
                      className={classes.quizButton}
                    >
                      Submit
                    </button>
                  )}

                {!quizEnd && (
                  <button
                    onClick={handleNextQuestion}
                    className={classes.quizButton}
                    disabled={
                      currentQuestionIndex + 1 == quizData.questions.length
                    }
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {quizEnd && quizData && (
          <div className={classes.resultsContainer}>
            <Score score={score} />
            <button
              onClick={() => {
                setQuizStart(false);
                setQuizEnd(false);
                setQuizData(null);
                setCorrectAnswers([]);
                setSelectedAnswers([]);
                setCurrentQuestionIndex(0);
                setScore(0);
                setSelectedTechnology("");
              }}
              className={classes.quizButton}
            >
              Try again
            </button>
          </div>
        )}

        {codeStart && (
          <div>
            <CodeForm
              technology={selectedTechnology}
              codeData={codeData}
              restart={restartCodeQuiz}
            />
          </div>
        )}
      </main>
    </>
  );
}
