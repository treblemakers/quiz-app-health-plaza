import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);
interface Score {
    id: string;
    score: number;
    name: string;
    date: string;
}

interface UserData {
  id: string;
  name: string;
}

function Leaderboard(props: UserData) {
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const container = useRef<HTMLDivElement>(null);
  const nodeScore = useRef<HTMLDivElement>(null);

  const {id, name} = props;


  useEffect(() => {
    const storedLeaderboard = JSON.parse(
      localStorage.getItem("leaderboard") || "[]"
    );

    storedLeaderboard.sort((a: Score, b: Score) => {
      if (a.score === b.score) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return b.score - a.score;
    });
    setLeaderboard(storedLeaderboard);
  }, []);


  useGSAP(
    () => {
      gsap.to(container.current, { duration: 1, scrollTo: `.cur-user-score` });
    },
    { scope: nodeScore }
);

  return (
    <div className="leaderboard-container" >
      <h2>Leaderboard</h2>
      <div className="ranking-container" ref={container}>
        {leaderboard.map((entry, index) => (
          <div id={entry.id} ref={entry.id == id ? nodeScore : null} className={`ranking-list ${entry.id == id ? " cur-user-score" : ""} ${index == 0 ? " first" : index == 1 ? "second" : index == 2 ? "third" : ""}`} key={entry.id}>
            <div className="ranked"><span>#</span>{index + 1}</div>

            <div className="user-container">
              <div className="user-name">{entry.name}</div>
              <div className="user-score">{entry.score} {entry.score > 1 ? "pts" : "pt"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
