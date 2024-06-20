import * as React from "react";

export interface QuestionProps {
    question: string;
    answers: string[];
    choose: string;
    onAnswer: (answer: string) => void;
}
const choice = ["A", "B", "C", "D"];

const Question = (props: QuestionProps) => {
    const { question, answers, choose, onAnswer } = props;

    return (
        <div className="quiz-container">
            <div className="quiz-title">
                <h2>{question}</h2>
            </div>
            <div className="choice-container">
                {answers.map((answer, index) => (
                    <div
                        className={`choice-box${
                            choose == answer ? " active" : ""
                        }`}
                        key={index}
                        onClick={() => {
                            onAnswer(answer);
                        }}
                    >
                        <div className="choice-num">{choice[index]}</div>
                        <div>{answer}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Question;
