import React, { createRef, useEffect, useRef, useState } from "react";
import Question from "../components/question";
import { v4 as uuidv4 } from "uuid";
import gsap from "gsap";
import {
    SwitchTransition,
    Transition,
    TransitionGroup,
} from "react-transition-group";

import { FaAngleLeft , FaAngleRight  } from "react-icons/fa6";
import questionsData from "../data/question.json";
import Leaderboard from "../components/leaderboard";

import Confetti from 'react-confetti'

const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

interface QuestionData {
    question: string;
    answers: string[];
    correct: string;
    choose: string
}

const Questions: React.FC = () => {
    const [stage, setStage] = useState("home");
    const [maxQuestion, setMaxQuestion] = useState(20);

    const [userName, setUserName] = useState("");
    const [userID, setUserID] = useState("");

    const [name, setName] = useState("");
    const [questions, setQuestions] = useState<QuestionData[]>([]);
    const [indexQuestion, setIndexQuestion] = useState<number>(0);




    useEffect(() => {
        resetAllValues();
    }, []);

    const resetAllValues = () => {
        setStage('home');
        setUserName('');
        setUserID('');
        setIndexQuestion(0);
        const shuffledQuestions = shuffleArray([...questionsData]).slice(0, maxQuestion);
        const questionsWithShuffledAnswers = shuffledQuestions.map((q) => ({
            ...q,
            answers: shuffleArray(q.answers),
            choose: ''
        }));
        setQuestions(questionsWithShuffledAnswers);
    }

    const handleAnswer = (selectedAnswer: string, index: number) => {
        const updatedQuestions = questions.map((q, i) =>
            i === index ? { ...q, choose: selectedAnswer } : q
          );
          setQuestions(updatedQuestions);
    };

    const saveScore = () => {
        let score = 0;

        questions.forEach((q) => {
            if (q.correct === q.choose) {
                score++;
            }
        });

        const newScore = {
            id: userID,
            name: userName,
            score,
            date: new Date().toISOString(),
        };
        const storedScores = JSON.parse(
            localStorage.getItem("leaderboard") || "[]"
        );
        storedScores.push(newScore);
        localStorage.setItem("leaderboard", JSON.stringify(storedScores));

        // navigate("leaderboard", { replace: true });
        setStage('leaderboard');
    };

    const handleStart = (event: React.FormEvent) => {
        event.preventDefault();
        if (name.trim()) {
            setUserName(name.trim());
            setUserID(uuidv4());

            setStage('quests')
        }
    };

    const handleNextQuestion = (mode: string) => {
        if (!["next", "prev"].includes(mode)) return;
        else if (mode === "next" && indexQuestion == 19) return;
        else if (mode === "prev" && indexQuestion == 0) return;

        const value = mode == "next" ? 1 : -1;
        setIndexQuestion(indexQuestion + value);
    };

    return (
       <>
            {stage == 'leaderboard' ? (<Confetti
      width={window.innerWidth}
      height={window.innerHeight}
    />) : null}

            <SwitchTransition>
                <Transition
                    key={stage}
                    timeout={500}
                    onEnter={(node: HTMLElement) => {
                        gsap.set(node, {
                            autoAlpha: 0,
                            scale: 0.8,
                            opacity: 0.2,
                        });
                        gsap.timeline({ paused: true })
                            .to(node, {
                                autoAlpha: 1,
                                duration: 0.25,
                            })
                            .to(node, { scale: 1, opacity: 1, duration: 0.25 })
                            .play();
                    }}
                    onExit={(node: HTMLElement) => {
                        gsap.timeline({ paused: true })
                            .to(node, {
                                scale: 0.8,
                                opacity: 0.2,
                                duration: 0.2,
                            })
                            .to(node, {
                                autoAlpha: 0,
                                duration: 0.2,
                            })
                            .play();
                    }}
                >
                    {stage == 'home' ? (
                        <div
                            style={{
                                maxWidth: "260px",
                                width: "100%",
                                padding: "20px",
                            }}
                        >
                            <form
                                onSubmit={handleStart}
                                className="flex-center"
                                style={{ gap: 18 }}
                            >
                                <h1
                                    className="brand-name"
                                    style={{ margin: "0px" }}
                                >
                                    Quick quiz
                                </h1>
                                <input
                                    style={{ textAlign: "center" }}
                                    className="w-full"
                                    type="text"
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full outline"
                                    style={{ fontWeight: 600 }}
                                >
                                    OK, Let's go!
                                </button>
                            </form>
                        </div>
                    ) : stage == 'leaderboard' ?
                    (
                        <div className="box-container flex-center" style={{ maxWidth: "340px"}}>
                            <Leaderboard id={userID} name={userName}/>
                            <button onClick={() => resetAllValues()}>
                                    Try again!
                                </button>
                        </div>
                    )
                    : (
                        <div className="box-container flex-center">
                            <p style={{ color: "gray" }}>
                                Question <span>{indexQuestion + 1}</span> out of
                                {maxQuestion}
                            </p>

                            <Question
                                key={indexQuestion}
                                question={questions[indexQuestion].question}
                                choose={questions[indexQuestion].choose}
                                answers={questions[indexQuestion].answers}
                                onAnswer={(answer) =>
                                    handleAnswer(answer, indexQuestion)
                                }
                            />

                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", paddingTop: "20px" }}>
                                <button onClick={() => handleNextQuestion("prev")}>
                                <FaAngleLeft size={18}/>
                                    Prev
                                </button>
                                <button disabled={questions[indexQuestion].choose == "" } onClick={() => {
                                    indexQuestion == maxQuestion - 1 ? saveScore() : handleNextQuestion("next")
                                }}>
                                    {indexQuestion == maxQuestion - 1 ? "Submit" : "Next"}
                                    <FaAngleRight size={18}/>
                                </button>


                            </div>
                        </div>
                    )}
                </Transition>
            </SwitchTransition>
        </>
    );
};

export default Questions;
