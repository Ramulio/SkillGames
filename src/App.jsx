import React, { useState, useEffect } from "react";

// stile caselle uniforme
const boxStyle =
  "flex items-center justify-center text-3xl font-bold rounded-xl p-6 w-48 h-24 bg-gray-200 shadow";

export default function DemoGames() {
  const [screen, setScreen] = useState("menu");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {screen === "menu" && <Menu setScreen={setScreen} />}
      {screen === "logic" && <ColorLogicGame setScreen={setScreen} />}
      {screen === "math" && <TurboMathGame setScreen={setScreen} />}
    </div>
  );
}

/**************** MENU ****************/
function Menu({ setScreen }) {
  return (
    <div className="flex flex-col items-center gap-10 text-center">
      <h1 className="text-5xl font-bold">Skill Games Demo</h1>

      <div className="flex gap-6">
        <button
          className="bg-gray-200 px-6 py-3 rounded-xl text-xl shadow"
          onClick={() => setScreen("logic")}
        >
          Play Color Logic
        </button>

        <button
          className="bg-gray-200 px-6 py-3 rounded-xl text-xl shadow"
          onClick={() => setScreen("math")}
        >
          Play TurboMath
        </button>
      </div>
    </div>
  );
}

/**************** COLOR LOGIC ****************/
const colors = ["Red", "Blue", "Green", "Yellow"];
const cssColors = {
  Red: "red",
  Blue: "blue",
  Green: "green",
  Yellow: "gold",
};

function ColorLogicGame({ setScreen }) {
  const [time, setTime] = useState(60);
  const [score, setScore] = useState(0);

  const [leftWord, setLeftWord] = useState("Red");
  const [rightWord, setRightWord] = useState("Blue");
  const [rightColor, setRightColor] = useState("red");

  // TIMER
  useEffect(() => {
    const t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  // genera combinazioni
  const generate = () => {
    const left = colors[Math.floor(Math.random() * colors.length)];

    const makeEqual = Math.random() < 0.5;

    let rightColorName;

    if (makeEqual) {
      rightColorName = left;
    } else {
      const others = colors.filter((c) => c !== left);
      rightColorName = others[Math.floor(Math.random() * others.length)];
    }

    const randomRightWord =
      colors[Math.floor(Math.random() * colors.length)];

    setLeftWord(left);
    setRightWord(randomRightWord);
    setRightColor(cssColors[rightColorName]);
  };

  useEffect(() => generate(), []);

  const evaluate = (ans) => {
    const expectedColorName = Object.keys(cssColors).find(
      (k) => cssColors[k] === rightColor
    );

    const isEqual = leftWord === expectedColorName;
    const correct =
      (ans === "equal" && isEqual) ||
      (ans === "not" && !isEqual);

    setScore((s) => s + (correct ? 1 : -1));
    generate();
  };

  // GAME OVER
  if (time === 0)
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold">Time's up!</h2>
        <p className="text-xl">Score: {score}</p>
        <button
          className="bg-gray-200 px-4 py-2 rounded-xl shadow"
          onClick={() => setScreen("menu")}
        >
          Menu
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-8 text-center">

      <button
        onClick={() => setScreen("menu")}
        className="absolute top-4 left-4 bg-gray-200 px-4 py-2 rounded-xl shadow"
      >
        Menu
      </button>

      <h2 className="text-4xl font-bold">Color Logic</h2>

      <p className="text-xl">{time}s</p>
      <p className="text-xl">Score: {score}</p>

      <div className="flex gap-10 mt-4">
        <div className={boxStyle}>
          <span style={{ color: cssColors[leftWord] }}>{leftWord}</span>
        </div>

        <div className={boxStyle}>
          <span style={{ color: rightColor }}>{rightWord}</span>
        </div>
      </div>

      <div className="flex gap-10 mt-4">
        <button
          className="bg-gray-200 px-8 py-4 rounded-xl text-xl shadow"
          onClick={() => evaluate("not")}
        >
          Not Equal
        </button>

        <button
          className="bg-gray-200 px-8 py-4 rounded-xl text-xl shadow"
          onClick={() => evaluate("equal")}
        >
          Equal
        </button>
      </div>
    </div>
  );
}

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

  useEffect(() => {
    const t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const submit = () => {
    if (input.trim() === "") return;

    if (Number(input) === task.result) {
      setScore((s) => s + 1);
      setTask(generateOperation());
    }

    setInput("");
  };

  if (time === 0)
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold">Time's up!</h2>
        <p className="text-xl">Score: {score}</p>
        <button
          className="bg-gray-200 px-4 py-2 rounded-xl shadow"
          onClick={() => setScreen("menu")}
        >
          Menu
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-4">

      <button
        onClick={() => setScreen("menu")}
        className="absolute top-4 right-4 bg-gray-200 px-3 py-1 rounded-xl shadow"
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
          if (/^-?\d*$/.test(v)) setInput(v);
        }}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
    </div>
  );
}

