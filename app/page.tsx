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
  category?: string;
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
  const base = 2000 + Math.random() * 3000;
  return Math.floor(base);
}

function getComputerCorrectChance(): number {
  return 0.55 + Math.random() * 0.2;
}

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
  const [lastRoundResult, setLastRoundResult] = useState<"win" | "lose" | "tie" | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const computerTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(QUESTIONS);
    setQuestionQueue(shuffled);
    setRound(0);
    setPlayerScore(0);
    setComputerScore(0);
    setPlayerStreak(0);
    setComputerStreak(0);
    setGamePhase("playing");
  }, []);

  const nextRound = useCallback(() => {
    if (round >= 10) {
      setGamePhase("result");
      return;
    }
    const q = questionQueue[round];
    if (!q) return;
    setCurrentQ(q);
    setPlayerAnswered(false);
    setComputerAnswered(false);
    setPlayerChoice(null);
    setComputerChoice(null);
    setShowResult(false);
    setRoundMessage("");
    setPlayerReaction("");
    setComputerReaction("");
    setTimer(15);
    setLastRoundResult(null);
  }, [round, questionQueue]);

  useEffect(() => {
    if (gamePhase === "playing" && questionQueue.length > 0) {
      nextRound();
    }
  }, [gamePhase, questionQueue.length, nextRound]);

  useEffect(() => {
    if (gamePhase !== "playing" || !currentQ || showResult) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gamePhase, currentQ, showResult]);

  useEffect(() => {
    if (timer === 0 && !playerAnswered) {
      handlePlayerAnswer(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  useEffect(() => {
    if (gamePhase !== "playing" || !currentQ || playerAnswered || showResult) return;
    computerTimerRef.current = setTimeout(() => {
      const isCorrect = Math.random() < getComputerCorrectChance();
      const choice = isCorrect ? currentQ.correct : (currentQ.correct + 1 + Math.floor(Math.random() * (currentQ.options.length - 1))) % currentQ.options.length;
      setComputerChoice(choice);
      setComputerAnswered(true);
      setComputerReaction(getRandomItem(FUNNY_COMPUTER_REACTIONS));
    }, getComputerAnswerSpeed());
    return () => {
      if (computerTimerRef.current) clearTimeout(computerTimerRef.current);
    };
  }, [gamePhase, currentQ, playerAnswered, showResult]);

  useEffect(() => {
    if (playerAnswered && computerAnswered) {
      resolveRound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerAnswered, computerAnswered]);

  function handlePlayerAnswer(choice: number) {
    if (playerAnswered) return;
    setPlayerChoice(choice);
    setPlayerAnswered(true);
  }

  function resolveRound() {
    if (!currentQ) return;
    const pCorrect = playerChoice === currentQ.correct;
    const cCorrect = computerChoice === currentQ.correct;

    let msg = "";
    let pReact = "";
    let cReact = "";
    let result: "win" | "lose" | "tie" | null = null;

    if (pCorrect && cCorrect) {
      msg = `🤝 Both got it right! "${currentQ.options[currentQ.correct]}"`;
      pReact = getRandomItem(FUNNY_PLAYER_CORRECT);
      cReact = getRandomItem(FUNNY_COMPUTER_REACTIONS);
      setPlayerScore((s) => s + 10 + playerStreak * 5);
      setComputerScore((s) => s + 10 + computerStreak * 5);
      setPlayerStreak((s) => s + 1);
      setComputerStreak((s) => s + 1);
      result = "tie";
    } else if (pCorrect && !cCorrect) {
      msg = `🎉 You got it! "${currentQ.options[currentQ.correct]}" — Computer flubbed!`;
      pReact = getRandomItem(FUNNY_PLAYER_CORRECT);
      cReact = getRandomItem(FUNNY_PLAYER_WRONG);
      setPlayerScore((s) => s + 10 + playerStreak * 5);
      setPlayerStreak((s) => s + 1);
      setComputerStreak(0);
      result = "win";
    } else if (!pCorrect && cCorrect) {
      msg = `😅 Computer knew it was "${currentQ.options[currentQ.correct]}" — you didn't!`;
      pReact = getRandomItem(FUNNY_PLAYER_WRONG);
      cReact = getRandomItem(FUNNY_COMPUTER_REACTIONS);
      setComputerScore((s) => s + 10 + computerStreak * 5);
      setComputerStreak((s) => s + 1);
      setPlayerStreak(0);
      result = "lose";
    } else {
      msg = `💥 Both wrong! The answer was "${currentQ.options[currentQ.correct]}"`;
      pReact = getRandomItem(FUNNY_PLAYER_WRONG);
      cReact = getRandomItem(FUNNY_PLAYER_WRONG);
      setPlayerStreak(0);
      setComputerStreak(0);
      result = "tie";
    }

    if (playerChoice === -1) {
      pReact = "⏰ Time's up! The computer got you!";
    }

    setRoundMessage(msg);
    setPlayerReaction(pReact);
    setComputerReaction(cReact);
    setLastRoundResult(result);
    setShowResult(true);

    setTimeout(() => {
      setRound((r) => r + 1);
    }, 3000);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {gamePhase === "menu" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-purple-500/10 animate-pulse"
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Swords className="w-10 h-10 text-purple-400" />
              <Trophy className="w-10 h-10 text-yellow-400" />
              <Brain className="w-10 h-10 text-cyan-400" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
              TRIVIA BATTLE
            </h1>
            <p className="text-xl text-purple-300/80 mb-8">You vs The Computer — who's funnier AND smarter?</p>
            <ShimmerButton onClick={startGame} className="text-lg px-12 py-6">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Battle!
            </ShimmerButton>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <Zap className="w-6 h-6 text-yellow-400 mb-2" />
                <h3 className="font-bold">15 Rounds</h3>
                <p className="text-sm text-purple-300/70">Fast-paced trivia mayhem</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <Clock className="w-6 h-6 text-cyan-400 mb-2" />
                <h3 className="font-bold">15s Timer</h3>
                <p className="text-sm text-purple-300/70">Think fast or lose your turn</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <Star className="w-6 h-6 text-pink-400 mb-2" />
                <h3 className="font-bold">Streak Bonuses</h3>
                <p className="text-sm text-purple-300/70">Chain correct answers for extra points</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {gamePhase === "playing" && currentQ && (
        <div className="min-h-screen flex flex-col">
          {/* Top bar — round + scores */}
          <div className="flex items-center justify-between px-6 py-4 bg-black/30 border-b border-white/10">
            <div className="text-center">
              <p className="text-xs text-purple-400 uppercase tracking-wider">You</p>
              <p className="text-3xl font-bold text-cyan-400">{playerScore}</p>
              {playerStreak > 1 && <p className="text-xs text-yellow-400">🔥 x{playerStreak}</p>}
            </div>
            <div className="text-center">
              <p className="text-sm text-purple-300">Round {round + 1} / 10</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className={`w-5 h-5 ${timer <= 5 ? "text-red-400 animate-pulse" : "text-purple-400"}`} />
                <span className={`text-2xl font-mono font-bold ${timer <= 5 ? "text-red-400" : "text-white"}`}>{timer}s</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-purple-400 uppercase tracking-wider">Computer</p>
              <p className="text-3xl font-bold text-pink-400">{computerScore}</p>
              {computerStreak > 1 && <p className="text-xs text-yellow-400">🔥 x{computerStreak}</p>}
            </div>
          </div>

          {/* Question area */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 w-full max-w-3xl">
              <p className="text-xs text-purple-400 uppercase tracking-wider mb-2">Question {round + 1}</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">{currentQ.question}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQ.options.map((opt, idx) => {
                  let btnClass = "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-left";
                  if (playerAnswered && showResult) {
                    if (idx === currentQ.correct) btnClass = "bg-green-600/30 border-green-500 text-green-300";
                    else if (idx === playerChoice && playerChoice !== currentQ.correct) btnClass = "bg-red-600/30 border-red-500 text-red-300";
                  } else if (playerAnswered && idx === playerChoice) {
                    btnClass = "bg-purple-600/30 border-purple-500";
                  }
                  return (
                    <button
                      key={idx}
                      disabled={playerAnswered}
                      onClick={() => handlePlayerAnswer(idx)}
                      className={`p-4 rounded-xl transition-all duration-200 font-medium ${btnClass}`}
                    >
                      <span className="text-purple-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reactions */}
            {showResult && (
              <div className="mt-6 w-full max-w-3xl space-y-3 animate-fade-in">
                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-sm text-cyan-400 font-semibold">🧑 You</p>
                  <p className="text-lg">{playerReaction}</p>
                </div>
                <div className="bg-pink-900/20 border border-pink-500/30 rounded-xl p-4">
                  <p className="text-sm text-pink-400 font-semibold">🤖 Computer</p>
                  <p className="text-lg">{computerReaction}</p>
                </div>
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 text-center">
                  <p className="text-lg font-bold">{roundMessage}</p>
                </div>
              </div>
            )}

            {/* Waiting / thinking indicator */}
            {!showResult && (
              <div className="mt-6 flex gap-8 text-sm text-purple-400">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${playerAnswered ? "bg-green-400" : "bg-purple-500 animate-pulse"}`} />
                  {playerAnswered ? "Answered" : "Your turn..."}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${computerAnswered ? "bg-green-400" : "bg-pink-500 animate-pulse"}`} />
                  {computerAnswered ? "Answered" : "Computer thinking..."}
                </div>
              </div>
            )}
          </div>

          {/* Bottom split-screen visual */}
          <div className="h-2 flex">
            <div className="flex-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20" />
            <div className="w-px bg-white/20" />
            <div className="flex-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
          </div>
        </div>
      )}

      {gamePhase === "result" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="text-center max-w-lg">
            <Trophy className={`w-20 h-20 mx-auto mb-4 ${playerScore > computerScore ? "text-yellow-400" : playerScore < computerScore ? "text-slate-500" : "text-purple-400"}`} />
            <h1 className="text-5xl font-black mb-2">
              {playerScore > computerScore && "🏆 YOU WIN! 🏆"}
              {playerScore < computerScore && "💻 COMPUTER WINS! 💻"}
              {playerScore === computerScore && "🤝 IT'S A TIE! 🤝"}
            </h1>
            <p className="text-xl text-purple-300/80 mb-6">
              {playerScore > computerScore && "You've proven humanity's superiority... for now."}
              {playerScore < computerScore && "The machines are taking over! Soon."}
              {playerScore === computerScore && "Evenly matched! Rematch?"}
            </p>
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-sm text-purple-400">You</p>
                <p className="text-5xl font-bold text-cyan-400">{playerScore}</p>
              </div>
              <div className="text-3xl text-purple-500">VS</div>
              <div className="text-center">
                <p className="text-sm text-purple-400">Computer</p>
                <p className="text-5xl font-bold text-pink-400">{computerScore}</p>
              </div>
            </div>
            <ShimmerButton onClick={startGame} className="text-lg px-10 py-5">
              <RefreshCw className="w-5 h-5 mr-2" />
              Play Again
            </ShimmerButton>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </main>
  );
}