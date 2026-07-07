"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Sparkles, Zap, Brain, Trophy, Swords, Clock, Star, XCircle, CheckCircle, RefreshCw } from "lucide-react";

type Question = {
  id: number;
  question: string;
  options: string[];
  correct: number;
  funnyWrong?: string;
};

const QUESTIONS: Question[] = [
  { id: 1, question: "What do you call a fake noodle?", options: ["An impasta", "A fraudini", "A liar-ia", "Fake-uccini"], correct: 0, funnyWrong: "That's not even a pasta shape, bud." },
  { id: 2, question: "Why don't scientists trust atoms?", options: ["They make up everything", "They're too small", "They split easily", "They're unstable"], correct: 0, funnyWrong: "Atom-ically incorrect, my friend." },
  { id: 3, question: "What's the best time to go to the dentist?", options: ["Tooth-hurty", "2:30", "Never", "When it hurts"], correct: 0, funnyWrong: "That joke has no bite." },
  { id: 4, question: "How many tickles does it take to make an octopus laugh?", options: ["Ten-tickles", "Eight", "A bunch", "None, they're serious"], correct: 0, funnyWrong: "Octo-puss that answer away." },
  { id: 5, question: "What do you call a bear with no teeth?", options: ["A gummy bear", "A bald bear", "A smooth bear", "A harmless bear"], correct: 0, funnyWrong: "That answer is toothless!" },
  { id: 6, question: "What's a ghost's favorite dessert?", options: ["Boo-berry pie", "Spooky cake", "Ghost toast", "Vanilla ice cream"], correct: 0, funnyWrong: "BOO-ring answer!" },
  { id: 7, question: "Why did the scarecrow win an award?", options: ["He was outstanding in his field", "He looked great", "He scared everyone", "Best dressed"], correct: 0, funnyWrong: "That answer is straw-ngely wrong." },
  { id: 8, question: "What do you call a fish wearing a bowtie?", options: ["Sofishticated", "A fancy fish", "A dapper fish", "Fish-tastic"], correct: 0, funnyWrong: "That answer is off the hook!" },
  { id: 9, question: "Why did the math book look so sad?", options: ["It had too many problems", "It was boring", "No one read it", "Bad cover design"], correct: 0, funnyWrong: "That doesn't add up." },
  { id: 10, question: "What's orange and sounds like a parrot?", options: ["A carrot", "An orange", "A parrot that's orange", "A loud fruit"], correct: 0, funnyWrong: "That answer is un-peeling!" },
  { id: 11, question: "How do you make holy water?", options: ["You boil the hell out of it", "Bless it", "Pray over it", "Freeze it"], correct: 0, funnyWrong: "That answer is sin-ful." },
  { id: 12, question: "Why don't eggs tell jokes?", options: ["They'd crack each other up", "They're too fragile", "No one listens", "Bad delivery"], correct: 0, funnyWrong: "Egg-scruciatingly wrong!" },
  { id: 13, question: "What do you call a pig that does karate?", options: ["A pork chop", "A karate pig", "Bacon fighter", "A ninja pig"], correct: 0, funnyWrong: "That answer is ham-fisted." },
  { id: 14, question: "Why did the bicycle fall over?", options: ["It was two-tired", "It slipped", "Bad balance", "The wind"], correct: 0, funnyWrong: "Wheel-y bad answer." },
  { id: 15, question: "What do you call a sleeping bull?", options: ["A bulldozer", "A bull nap", "A sleepy bull", "A bull-dream"], correct: 0, funnyWrong: "That answer is bull-don't." },
];

const FUNNY_COMPUTER_REACTIONS = [
  "Haha, too slow! 💨",
  "Is that really your answer? 😂",
  "My grandma answers faster! 👵",
  "Oof, that's wrong. Big oof. 🫢",
  "BOOM! Computer takes the lead! 💥",
  "You call THAT a guess? 🤡",
  "The machine outsmarts the human again! 🤖",
  "BZZT! Wrong! Try again... oh wait, you can't! 😆",
  "My circuits are laughing at you! ⚡",
  "That was... a choice. 🙈",
];

const FUNNY_PLAYER_CORRECT = [
  "NAILED IT! 🎯",
  "You're on fire! 🔥",
  "The human strikes back! 💪",
  "Take THAT, computer! 🖥️💢",
  "Boom goes the dynamite! 💣",
  "Unstoppable! 🏆",
  "The crowd goes wild! 🎉",
  "Too easy for you! 😎",
  "Computer is SHOOK! 😱",
  "Absolute legend! 👑",
];

const FUNNY_PLAYER_WRONG = [
  "Oof, that was rough. 🫣",
  "The machine chuckles... 🤖😏",
  "Not your finest moment. 😬",
  "Yikes. That hurt to watch. 😵",
  "The computer just did a victory lap! 🏃‍♂️",
  "Bruh moment. 📸",
  "That answer was... creative. 🎨",
  "The audience is cringing. 😅",
  "Womp womp. 🎺",
  "Even the toaster is judging you. 🍞",
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getComputerAnswerSpeed(): number {
  return Math.floor(2000 + Math.random() * 3000);
}

function getComputerCorrectChance(): number {
  return 0.55 + Math.random() * 0.2;
}

const TOTAL_ROUNDS = 10;

export default function Home() {
  const [gamePhase, setGamePhase] = useState<"menu" | "playing" | "result">("menu");
  const [round, setRound] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [playerAnswered, setPlayerAnswered] = useState(false);
  const [computerAnswered, setComputerAnswered] = useState(false);
  const [playerChoice, setPlayerChoice] = useState<number | null>(null);
  const [computerChoice, setComputerChoice] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [roundMessage, setRoundMessage] = useState("");
  const [playerReaction, setPlayerReaction] = useState("");
  const [computerReaction, setComputerReaction] = useState("");
  const [timer, setTimer] = useState(15);
  const [questionQueue, setQuestionQueue] = useState<Question[]>([]);
  const [playerStreak, setPlayerStreak] = useState(0);
  const [computerStreak, setComputerStreak] = useState(0);
  const [playerCorrectCount, setPlayerCorrectCount] = useState(0);
  const [computerCorrectCount, setComputerCorrectCount] = useState(0);
  const [roundsHistory, setRoundsHistory] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const computerTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(QUESTIONS).slice(0, TOTAL_ROUNDS);
    setQuestionQueue(shuffled);
    setRound(0);
    setPlayerScore(0);
    setComputerScore(0);
    setPlayerStreak(0);
    setComputerStreak(0);
    setPlayerCorrectCount(0);
    setComputerCorrectCount(0);
    setRoundsHistory([]);
    setGamePhase("playing");
    setCurrentQ(shuffled[0]);
    setPlayerAnswered(false);
    setComputerAnswered(false);
    setPlayerChoice(null);
    setComputerChoice(null);
    setShowResult(false);
    setTimer(15);
  }, []);

  const nextRound = useCallback(() => {
    const nextRoundNum = round + 1;
    if (nextRoundNum >= TOTAL_ROUNDS || nextRoundNum >= questionQueue.length) {
      setGamePhase("result");
      return;
    }
    setRound(nextRoundNum);
    setCurrentQ(questionQueue[nextRoundNum]);
    setPlayerAnswered(false);
    setComputerAnswered(false);
    setPlayerChoice(null);
    setComputerChoice(null);
    setShowResult(false);
    setTimer(15);
    setPlayerReaction("");
    setComputerReaction("");
    setRoundMessage("");
  }, [round, questionQueue]);

  const handlePlayerAnswer = useCallback((choiceIndex: number) => {
    if (playerAnswered || !currentQ) return;
    setPlayerChoice(choiceIndex);
    setPlayerAnswered(true);

    const isCorrect = choiceIndex === currentQ.correct;
    if (isCorrect) {
      const streakBonus = Math.min(playerStreak, 5);
      const points = 100 + streakBonus * 50;
      setPlayerScore((s) => s + points);
      setPlayerStreak((s) => s + 1);
      setPlayerCorrectCount((c) => c + 1);
      setPlayerReaction(getRandomItem(FUNNY_PLAYER_CORRECT));
    } else {
      setPlayerStreak(0);
      setPlayerReaction(getRandomItem(FUNNY_PLAYER_WRONG));
    }
  }, [playerAnswered, currentQ, playerStreak]);

  // Computer AI answers after a delay
  useEffect(() => {
    if (gamePhase !== "playing" || computerAnswered || !currentQ) return;

    const speed = getComputerAnswerSpeed();
    computerTimerRef.current = setTimeout(() => {
      const isCorrect = Math.random() < getComputerCorrectChance();
      const choice = isCorrect ? currentQ.correct : (currentQ.correct + 1 + Math.floor(Math.random() * 3)) % 4;
      setComputerChoice(choice);
      setComputerAnswered(true);

      if (choice === currentQ.correct) {
        const streakBonus = Math.min(computerStreak, 5);
        const points = 100 + streakBonus * 50;
        setComputerScore((s) => s + points);
        setComputerStreak((s) => s + 1);
        setComputerCorrectCount((c) => c + 1);
        setComputerReaction(getRandomItem(FUNNY_COMPUTER_REACTIONS));
      } else {
        setComputerStreak(0);
        setComputerReaction("Wait, what?! The computer got it WRONG?! 🤯");
      }
    }, speed);

    return () => {
      if (computerTimerRef.current) clearTimeout(computerTimerRef.current);
    };
  }, [gamePhase, computerAnswered, currentQ, computerStreak]);

  // Timer countdown
  useEffect(() => {
    if (gamePhase !== "playing" || showResult) return;
    if (timer <= 0) {
      if (!playerAnswered) {
        setPlayerAnswered(true);
        setPlayerChoice(-1);
        setPlayerStreak(0);
        setPlayerReaction("TIME'S UP! ⏰💀");
      }
      return;
    }
    const t = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [gamePhase, timer, playerAnswered, showResult]);

  // Show round result when both answered
  useEffect(() => {
    if (!playerAnswered || !computerAnswered || showResult || !currentQ) return;
    setShowResult(true);

    const playerCorrect = playerChoice === currentQ.correct;
    const computerCorrect = computerChoice === currentQ.correct;

    let msg = "";
    if (playerCorrect && computerCorrect) msg = "🔥 Both got it right!";
    else if (playerCorrect && !computerCorrect) msg = "🎉 You beat the computer this round!";
    else if (!playerCorrect && computerCorrect) msg = "😤 The computer got one over on you!";
    else msg = "💀 Both wrong! Oof.";

    setRoundMessage(msg);
    setRoundsHistory((h) => [...h, msg]);

    const t = setTimeout(() => nextRound(), 2500);
    return () => clearTimeout(t);
  }, [playerAnswered, computerAnswered, showResult, currentQ, playerChoice, computerChoice, nextRound]);

  // Menu screen
  if (gamePhase === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `fade-up ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Swords className="w-10 h-10 text-yellow-400" />
            <Brain className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-2 bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent">
            TRIVIA BATTLE
          </h1>
          <p className="text-xl text-blue-200/70 mb-2">You vs The Computer</p>
          <p className="text-sm text-gray-400 mb-8">A split-screen trivia showdown with funny roasts & streak bonuses</p>

          <div className="grid grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-300 font-semibold mb-1">
                <Zap className="w-4 h-4" /> Streak Bonus
              </div>
              <p className="text-xs text-gray-400">Get consecutive right answers for +50 extra points per streak!</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-purple-300 font-semibold mb-1">
                <Clock className="w-4 h-4" /> 15-Second Timer
              </div>
              <p className="text-xs text-gray-400">Answer before time runs out or you get roasted!</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-300 font-semibold mb-1">
                <Star className="w-4 h-4" /> 10 Rounds
              </div>
              <p className="text-xs text-gray-400">First to dominate 10 hilarious trivia questions wins!</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-yellow-300 font-semibold mb-1">
                <Brain className="w-4 h-4" /> Computer AI
              </div>
              <p className="text-xs text-gray-400">The computer thinks before answering — and it taunts you!</p>
            </div>
          </div>

          <ShimmerButton size="lg" onClick={startGame} className="text-lg px-12 py-4">
            <Swords className="w-5 h-5 mr-2" />
            START BATTLE
          </ShimmerButton>
        </div>
      </div>
    );
  }

  // Result screen
  if (gamePhase === "result") {
    const playerWon = playerScore > computerScore;
    const tie = playerScore === computerScore;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <Trophy className={`w-20 h-20 mx-auto mb-4 ${playerWon ? "text-yellow-400" : tie ? "text-gray-400" : "text-red-400"}`} />
          <h1 className="text-5xl font-extrabold mb-2">
            {playerWon ? (
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">YOU WIN! 🏆</span>
            ) : tie ? (
              <span className="text-gray-300">IT'S A TIE! 🤝</span>
            ) : (
              <span className="text-red-400">COMPUTER WINS! 💻</span>
            )}
          </h1>
          <p className="text-gray-400 mb-6">
            {playerWon
              ? "The human race is safe... for now."
              : tie
              ? "You and the machine are evenly matched!"
              : "Skynet begins here..."}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
              <p className="text-sm text-blue-300 mb-1">🧑 YOU</p>
              <p className="text-4xl font-bold text-blue-400">{playerScore}</p>
              <p className="text-xs text-gray-500 mt-1">{playerCorrectCount}/{TOTAL_ROUNDS} correct</p>
              {playerStreak > 1 && <p className="text-xs text-yellow-400">Best streak: {playerStreak}</p>}
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
              <p className="text-sm text-red-300 mb-1">🤖 COMPUTER</p>
              <p className="text-4xl font-bold text-red-400">{computerScore}</p>
              <p className="text-xs text-gray-500 mt-1">{computerCorrectCount}/{TOTAL_ROUNDS} correct</p>
              {computerStreak > 1 && <p className="text-xs text-yellow-400">Best streak: {computerStreak}</p>}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-8 max-h-32 overflow-y-auto text-left">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Round History</p>
            {roundsHistory.map((msg, i) => (
              <p key={i} className="text-sm text-gray-300 mb-1">
                <span className="text-gray-500">R{i + 1}:</span> {msg}
              </p>
            ))}
          </div>

          <ShimmerButton size="lg" onClick={startGame}>
            <RefreshCw className="w-4 h-4 mr-2" />
            PLAY AGAIN
          </ShimmerButton>
        </div>
      </div>
    );
  }

  // Playing screen — SPLIT SCREEN
  const playerCorrect = playerAnswered && playerChoice === currentQ?.correct;
  const computerCorrect = computerAnswered && computerChoice === currentQ?.correct;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex flex-col">
      {/* Top bar: round + scores */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/5">
        <div className="text-sm text-gray-400">
          Round <span className="text-white font-bold">{round + 1}</span>/{TOTAL_ROUNDS}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold text-lg">{playerScore}</span>
            <span className="text-xs text-gray-500">YOU</span>
          </div>
          <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${(playerScore / Math.max(playerScore + computerScore, 1)) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">CPU</span>
            <span className="text-red-400 font-bold text-lg">{computerScore}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Clock className="w-4 h-4 text-yellow-400" />
          <span className={`font-mono font-bold ${timer <= 5 ? "text-red-400 animate-pulse" : "text-yellow-400"}`}>
            {timer}s
          </span>
        </div>
      </div>

      {/* SPLIT SCREEN — two halves */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* PLAYER SIDE */}
        <div className="relative flex flex-col items-center justify-center p-6 border-r border-white/5 bg-gradient-to-b from-blue-950/40 to-transparent">
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">🧑 YOU</span>
          </div>
          {playerStreak >= 2 && (
            <div className="absolute top-3 right-3 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1 text-xs text-yellow-300 animate-pulse">
              🔥 {playerStreak}x Streak!
            </div>
          )}

          {!showResult && currentQ && (
            <div className="w-full max-w-lg">
              <p className="text-lg md:text-xl font-semibold text-center text-white mb-6 min-h-[3rem]">
                {currentQ.question}
              </p>
              <div className="grid grid-cols-1 gap-3">
                {currentQ.options.map((opt, idx) => {
                  let btnClass = "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-400/50 text-white";
                  if (playerAnswered) {
                    if (idx === currentQ.correct) btnClass = "bg-green-500/20 border-green-400 text-green-300";
                    else if (idx === playerChoice && idx !== currentQ.correct) btnClass = "bg-red-500/20 border-red-400 text-red-300";
                    else btnClass = "bg-white/5 border-white/5 text-gray-500";
                  }
                  return (
                    <button
                      key={idx}
                      disabled={playerAnswered}
                      onClick={() => handlePlayerAnswer(idx)}
                      className={`${btnClass} rounded-xl p-4 text-left font-medium transition-all duration-200 border ${
                        !playerAnswered ? "hover:scale-[1.02] active:scale-[0.98]" : ""
                      }`}
                    >
                      <span className="text-xs text-gray-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Player reaction */}
          {playerReaction && (
            <div className={`mt-4 text-center animate-fade-up ${playerCorrect ? "text-green-400" : "text-red-400"}`}>
              <p className="text-lg font-bold">{playerReaction}</p>
            </div>
          )}
        </div>

        {/* COMPUTER SIDE */}
        <div className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-red-950/40 to-transparent">
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-400" />
            <span className="text-sm font-semibold text-red-300">🤖 COMPUTER</span>
          </div>
          {computerStreak >= 2 && (
            <div className="absolute top-3 right-3 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1 text-xs text-yellow-300 animate-pulse">
              🔥 {computerStreak}x Streak!
            </div>
          )}

          {!showResult && currentQ && (
            <div className="w-full max-w-lg">
              <p className="text-lg md:text-xl font-semibold text-center text-white mb-6 min-h-[3rem]">
                {currentQ.question}
              </p>
              <div className="grid grid-cols-1 gap-3">
                {currentQ.options.map((opt, idx) => {
                  let btnClass = "bg-white/5 border border-white/10 text-white";
                  if (computerAnswered) {
                    if (idx === currentQ.correct) btnClass = "bg-green-500/20 border-green-400 text-green-300";
                    else if (idx === computerChoice && idx !== currentQ.correct) btnClass = "bg-red-500/20 border-red-400 text-red-300";
                    else btnClass = "bg-white/5 border-white/5 text-gray-500";
                  } else {
                    // Show thinking state
                    btnClass = "bg-white/5 border border-white/5 text-gray-500";
                  }
                  return (
                    <div
                      key={idx}
                      className={`${btnClass} rounded-xl p-4 font-medium border transition-all duration-200`}
                    >
                      <span className="text-xs text-gray-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                      {!computerAnswered && idx === 0 && (
                        <span className="ml-2 text-xs text-gray-600 animate-pulse">thinking...</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Computer reaction */}
          {computerReaction && (
            <div className={`mt-4 text-center animate-fade-up ${computerCorrect ? "text-red-400" : "text-green-400"}`}>
              <p className="text-lg font-bold">{computerReaction}</p>
            </div>
          )}
        </div>
      </div>

      {/* Round result banner */}
      {showResult && roundMessage && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-4 text-center animate-fade-up">
            <p className="text-2xl font-bold text-white">{roundMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
