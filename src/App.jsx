import React, { useState, useEffect } from "react";

// Simple styles
const cardStyle =
  "flex items-center justify-center text-3xl font-bold border rounded-2xl p-8 m-2 w-40 h-24";
const btnStyle =
  "px-4 py-2 rounded-xl shadow text-xl m-2 bg-gray-200";

export default function DemoGames() {
  const [screen, setScreen] = useState("menu");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      {screen === "menu" && <Menu setScreen={setScreen} />}
      {screen === "flex" && <ColorLogicGame setScreen={setScreen} />}
      {screen === "math" && <TurboMathGame setScreen={setScreen} />}
    </div>
  );
}

/**************** MENU ****************/
function Menu({ setScreen }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">Skill Games Demo</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        onClick={() => setScreen("flex")}
      >
        Play Color Logic
      </button>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded-xl"
        onClick={() => setScreen("math")}
      >
        Play TurboMath
      </button>
    </div>
  );
}

/**************** COLOR LOGIC ****************/
const colors = ["Red", "Blue", "Green", "Yellow"];
const cssColors = {
  Red: "red",
  Blue: "blue",
  Green: "green",
  Yellow: "yellow",
};

function ColorLogicGame({ setScreen }) {
  const [time, setTime] = useState(60);
  const [score, setScore] = useState(0);
  const [leftWord, setLeftWord] = useState("Red");
  const [rightWord, setRightWord] = useState("Blue");
  const [rightColor, setRightColor] = useState("red");

  useEffect(() => {
    const t = setInterval(
      () => setTime((s) => Math.max(0, s - 1)),
      1000
    );
    return () => clearInterval(t);
  }, []);

  const generateCards = () => {
    const makeEqual = Math.random() < 0.5;

    const left = colors[Math.floor(Math.random() * colors.length)];
    let rightColorName;

    if (makeEqual) {
      rightColorName = left;
    } else {
      const others = colors.filter((c) => c !== left);
      rightColorName =
        others[Math.floor(Math.random() * others.length)];
    }

    const randomRightWord =
      colors[Math.floor(Math.random() * colors.length)];

    setLeftWord(left);
    setRightWord(randomRightWord);
    setRightColor(cssColors[rightColorName]);
  };

  useEffect(() => {
    generateCards();
  }, []);

  const evaluate = React.useCallback(
    (answer) => {
      const rightColorName = Object.keys(cssColors).find(
        (k) => cssColors[k] === rightColor
      );

      const isEqual = leftWord === rightColorName;
      const correct =
        answer === (isEqual ? "equal" : "not");

      setScore((s) => s + (correct ? 1 : -1));
      generateCards();
    },
    [leftWord, rightColor]
  );

  // Arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;

      if (e.code === "ArrowLeft") {
        e.preventDefault();
        evaluate("not");
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        evaluate("equal");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [evaluate]);

  if (time === 0)
    return (
      <div className="relative flex flex-col items-center gap-4">
        <button
          className="absolute top-4 right-4 bg-gray-300 px-3 py-1 rounded-lg shadow"
          onClick={() => setScreen("menu")}
        >
          Menu
        </button>

        <h2 className="text-2xl font-bold">Time's up!</h2>
        <p className="text-xl">Score: {score}</p>
      </div>
    );

  return (
    <div className="relative flex flex-col items-center gap-4">
      {/* Menu */}
      <button
        onClick={() => setScreen("menu")}
        className="absolute top-4 right-4 bg-gray-300 px-3 py-1 rounded-lg shadow"
      >
        Menu
      </button>

      <h2 className="text-2xl font-bold">Color Logic</h2>
      <p className="text-lg font-bold">{time}s</p>
      <p className="text-lg">Score: {score}</p>

      <div className="flex gap-10 items-center mt-4">
        <div className={cardStyle}>{leftWord}</div>
        <div
          className={cardStyle}
          style={{ color: rightColor }}
        >
          {rightWord}
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          className={btnStyle}
          onClick={() => evaluate("not")}
        >
          ⟵ Not Equal
        </button>

        <button
          className={btnStyle}
          onClick={() => evaluate("equal")}
        >
          Equal ⟶
        </button>
      </div>
    </div>
  );
}

/**************** TURBOMATH ****************/ 
/**************** TURBOMATH ****************/ 
function generateOperation() {
  const ops = ["+", "-", "*", "/"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let a, b, result;

  switch (op) {
    case "+":
      a = Math.floor(Math.random() * 500);
      b = Math.floor(Math.random() * 500);
      result = a + b;
      if (result > 999) return generateOperation();
      break;

    case "-":
      // risultato tra -1 e -99
      result = -(Math.floor(Math.random() * 99) + 1);
      a = Math.floor(Math.random() * 500) + 100;
      b = a - result;
      break;

    case "*":
      a = Math.floor(Math.random() * 40);
      b = Math.floor(Math.random() * 20);
      result = a * b;
      if (result > 999) return generateOperation();
      break;

    case "/":
      b = Math.floor(Math.random() * 20) + 1;
      result = Math.floor(Math.random() * 40);
      a = result * b;
      break;
  }

  return { a, b, op, result };
}

function TurboMathGame({ setScreen }) {
  const [time, setTime] = useState(120);
  const [score, setScore] = useState(0);
  const [task, setTask] = useState(generateOperation());
  const [input, setInput] = useState("");

  // Timer
  useEffect(() => {
    const t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  // Submit manuale
  const submit = () => {
    const correctResult = task.result;

    if (input !== "" && Number(input) === correctResult) {
      setScore((s) => s + 1);
      setTask(generateOperation());
    }

    setInput("");
  };

  // AUTO-SUBMIT che NON interferisce con la digitazione
  useEffect(() => {
    if (input === "") return;
    if (Number(input) === task.result) {
      submit();
    }
  }, [input, task]);



  // Fine tempo
  if (time === 0)
    return (
      <div className="relative flex flex-col items-center gap-4">
        <button
          className="absolute top-4 right-4 bg-gray-300 px-3 py-1 rounded-lg shadow"
          onClick={() => setScreen("menu")}
        >
          Menu
        </button>
        <h2 className="text-2xl font-bold">Time's up!</h2>
        <p className="text-xl">Score: {score}</p>
      </div>
    );



  return (
    <div className="relative flex flex-col items-center gap-4">

      <button
        onClick={() => setScreen("menu")}
        className="absolute top-4 right-4 bg-gray-300 px-3 py-1 rounded-lg shadow"
      >
        Menu
      </button>

      <h2 className="text-2xl font-bold">TurboMath</h2>
      <p className="text-xl font-bold">{time}s</p>
      <p>Score: {score}</p>

      <div className="text-3xl font-bold">
        {task.a} {task.op} {task.b}
      </div>

      <input
        type="text"
        inputMode="numeric"
        className="border p-2 rounded-xl text-xl text-center"
        value={input}
        onChange={(e) => {
          const v = e.target.value;
          if (/^-?\d*$/.test(v)) {
            setInput(v); // accetta solo numeri o "-"
          }
        }}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />

    </div>
  );
}
