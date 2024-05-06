"use client";
import { useEffect, useRef, useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike"; // For C-like languages (JavaScript, Java, C++, etc.)
import "prismjs/components/prism-javascript"; // For JavaScript syntax highlighting
import "prismjs/components/prism-css"; // For CSS syntax highlighting
import "prismjs/components/prism-sql"; // For SQL syntax highlighting
import "prismjs/components/prism-python"; // For Python syntax highlighting
import "prismjs/components/prism-java"; // For Java syntax highlighting
import "prismjs/components/prism-ruby"; // For Ruby syntax highlighting
import "prismjs/components/prism-swift"; // For Swift syntax highlighting
import "prismjs/themes/prism.css";
import classes from "./code-form.module.css";
import { FaEye,FaEyeSlash } from "react-icons/fa";
import Score from "../quiz/score";
import { ThreeDot } from "react-loading-indicators";

export default function CodeForm({ technology, codeData, restart }) {
  const [code, setCode] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(null);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleHintVisibility = () => {
    setShowHint(!showHint);
  };

  const handleCodeSubmit = async () => {
    setLoading(true);
    try {
      const reqBody = {
        question: codeData.question,
        code: code,
      };
      const response = await fetch("/api/codeQuiz", {
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
      const responseData = JSON.parse(data.responseData);
      setScore(responseData.score);
      setComments(responseData.comments);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getLanguage = () => {
    switch (technology) {
      case "JavaScript":
        return languages.javascript;
      case "CSS":
        return languages.css;
      case "SQL":
        return languages.sql;
      case "Python":
        return languages.python;
      case "Java":
        return languages.java;
      case "Ruby":
        return languages.ruby;
      case "Swift":
        return languages.swift;
      default:
        return languages.javascript;
    }
  };

  const generateLineNumbers = () => {
    const totalLines = code.split("\n").length;
    return Array.from(Array(totalLines).keys()).map(
      (lineNumber) => lineNumber + 1
    );
  };

  return (
    <div className={classes.questionContainer}>
      <div>
        <p>{codeData.question}</p>

        <div style={{ display: "flex" }}>
          <div
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 18,
              backgroundColor: "#1e1e1e",
              color: "#6c6c6c",
              borderRight: "0px solid #ddd",
              padding: "10px",
              borderTopLeftRadius: "14px",
              borderBottomLeftRadius: "14px",
            }}
          >
            {generateLineNumbers().map((lineNumber) => (
              <div key={lineNumber}>{lineNumber}</div>
            ))}
          </div>
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) => highlight(code, getLanguage())}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 18,
              backgroundColor: "#1e1e1e",
              color: "#ADD8E6",
              width: "100vw",
              borderTopRightRadius: "14px",
              borderBottomRightRadius: "14px",
            }}
          />
        </div>
        <div className={classes.hint}>
          <div className={classes.row}>
            <span className={classes.highlight}>Show hint</span>
            {!showHint && (
              <FaEye className={classes.eyeIcon} onClick={toggleHintVisibility} />
            )}
             {showHint && (
              <FaEyeSlash className={classes.eyeIcon} onClick={toggleHintVisibility} />
            )}
            
          </div>

          <span
            className={classes.hintText}
            style={{ filter: showHint ? "none" : "blur(5px)" }}
          >
            {codeData.hint}
          </span>
        </div>
        <div className={classes.result}>
          <div className={classes.row}>
            {comments.length > 0 && (
              <div className={classes.comments}>
                <h1 className={classes.highlight}>Comments</h1>
                <p>{comments}</p>
                {score != null && <Score score={score} />}
              </div>
            )}
          </div>
        </div>
        {loading && (
          <div className={classes.loading}>
            <ThreeDot color="#3ee4ff" size="medium" textColor="" />
          </div>
        )}
        {!loading && (
          <button
            className={classes.quizButton}
            onClick={handleCodeSubmit}
            disabled={code.trim().length == 0}
          >
            Submit
          </button>
        )}
        <br></br>

        <div>
          {!loading && (
            <button onClick={restart} className={classes.restartButton}>
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
