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
  category: string;
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
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [comboActive, setComboActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const computerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const roundTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(QUESTIONS).slice(0, 10);
    setQuestionQueue(shuffled);
    setPlayerScore(0);
    setComputerScore(0);
    setRound(0);
    setRoundsPlayed(0);
    setStreak(0);
    setComboActive(false);
    setGamePhase("playing");
    setShowResult(false);
    setPlayerAnswered(false);
    setComputerAnswered(false);
    setCurrentQ(shuffled[0]);
    setTimer(15);
  }, []);

  const nextRound = useCallback(() => {
    if (roundTimerRef.current) clearTimeout(roundTimerRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (computerTimerRef.current) clearTimeout(computerTimerRef.current);

    const nextRoundNum = round + 1;
    if (nextRoundNum >= questionQueue.length || nextRoundNum >= 10) {
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
    setRoundMessage("");
    setPlayerReaction("");
    setComputerReaction("");
    setTimer(15);
  }, [round, questionQueue]);

  useEffect(() => {
    if (gamePhase !== "playing" || !currentQ || showResult) return;

    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handlePlayerTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gamePhase, currentQ, showResult]);

  const handlePlayerTimeout = useCallback(() => {
    if (playerAnswered) return;
    setPlayerAnswered(true);
    setPlayerChoice(-1);
    setPlayerReaction("⏰ Time's up! The computer laughs at your hesitation!");
    setComputerReaction(getRandomItem(FUNNY_COMPUTER_REACTIONS));
    setComputerScore((s) => s + 10);
    setStreak(0);
    setComboActive(false);
    setShowResult(true);
    roundTimerRef.current = setTimeout(nextRound, 3000);
  }, [playerAnswered, nextRound]);

  const handlePlayerAnswer = useCallback((index: number) => {
    if (playerAnswered || !currentQ) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setPlayerAnswered(true);
    setPlayerChoice(index);

    const correct = index === currentQ.correct;
    if (correct) {
      const bonus = streak >= 2 ? Math.floor(streak * 2) : 0;
      const points = 10 + bonus;
      setPlayerScore((s) => s + points);
      setStreak((s) => s + 1);
      if (streak + 1 >= 2) setComboActive(true);
      setPlayerReaction(`${getRandomItem(FUNNY_PLAYER_CORRECT)} +${points} points${bonus > 0 ? ` (${bonus} streak bonus!)` : ""}`);
    } else {
      setPlayerReaction(`${getRandomItem(FUNNY_PLAYER_WRONG)} ${currentQ.funnyWrong || ""}`);
      setStreak(0);
      setComboActive(false);
    }

    const computerDelay = getComputerAnswerSpeed();
    computerTimerRef.current = setTimeout(() => {
      const compCorrect = Math.random() < getComputerCorrectChance();
      const compChoice = compCorrect ? currentQ.correct : (currentQ.correct + 1 + Math.floor(Math.random() * 3)) % 4;
      setComputerChoice(compChoice);
      setComputerAnswered(true);
      if (compCorrect) {
        setComputerScore((s) => s + 10);
        setComputerReaction(getRandomItem(FUNNY_COMPUTER_REACTIONS));
      } else {
        setComputerReaction("The computer messed up! 🤖💥 HAHA!");
      }
      setShowResult(true);
      roundTimerRef.current = setTimeout(nextRound, 3000);
    }, computerDelay);
  }, [playerAnswered, currentQ, streak, nextRound]);

  useEffect(() => {
    return () => {
      if (computerTimerRef.current) clearTimeout(computerTimerRef.current);
      if (roundTimerRef.current) clearTimeout(roundTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (gamePhase === "menu") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-[#0a0a1a]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-8 text-center px-4">
          <div className="flex items-center gap-3 animate-fade-up">
            <Swords className="h-10 w-10 text-primary" />
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
              <span className="gradient-text">Trivia Battle</span>
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-md animate-fade-up" style={{ animationDelay: "0.15s" }}>
            You vs. The Machine. <br />
            Answer fast. Answer funny. <strong className="text-foreground">Crush the computer.</strong>
          </p>
          <div className="flex flex-col gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <ShimmerButton onClick={startGame} className="text-lg px-10 py-4 h-auto">
              <Swords className="mr-2 h-5 w-5" /> Start Battle!
            </ShimmerButton>
            <p className="text-xs text-muted-foreground">10 rounds • timed • streak bonuses • hilarious reactions</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-sm animate-fade-up" style={{ animationDelay: "0.45s" }}>
            {[
              { icon: Zap, label: "Fast Timer", desc: "15 sec per round" },
              { icon: Brain, label: "Fun Trivia", desc: "Puns & jokes" },
              { icon: Trophy, label: "Beat the Bot", desc: "Win for glory" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-card/40 p-3 backdrop-blur">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium">{label}</span>
                <span className="text-[10px] text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === "result") {
    const playerWon = playerScore > computerScore;
    const tie = playerScore === computerScore;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background via-background to-[#0a0a1a] p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/3 left-1/3 w-80 h-80 rounded-full blur-[100px] ${playerWon ? "bg-green-500/10" : tie ? "bg-yellow-500/10" : "bg-red-500/10"}`} />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6 text-center animate-fade-up">
          <Trophy className={`h-16 w-16 ${playerWon ? "text-yellow-400" : tie ? "text-blue-400" : "text-muted-foreground"}`} />
          <h1 className="text-4xl sm:text-5xl font-bold">
            {playerWon ? "🏆 YOU WIN!" : tie ? "🤝 IT'S A TIE!" : "💀 THE COMPUTER WINS!"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {playerWon
              ? "Humanity prevails! The machines will remember this day."
              : tie
              ? "Evenly matched... for now. Rematch?"
              : "Skynet begins... today."}
          </p>
          <div className="flex gap-8 items-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm text-muted-foreground">You</span>
              <span className="text-3xl font-bold text-primary">{playerScore}</span>
            </div>
            <span className="text-2xl text-muted-foreground">vs</span>
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm text-muted-foreground">Computer</span>
              <span className="text-3xl font-bold text-accent">{computerScore}</span>
            </div>
          </div>
          <ShimmerButton onClick={startGame} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" /> Play Again
          </ShimmerButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-[#0a0a1a]">
      {/* Top bar */}
      <header className="border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Swords className="h-4 w-4 text-primary" />
          <span className="gradient-text">Trivia Battle</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Round {round + 1}/10</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={`font-mono ${timer <= 5 ? "text-red-400 animate-pulse" : "text-muted-foreground"}`}>{timer}s</span>
          </div>
        </div>
      </header>

      {/* Split screen */}
      <div className="flex flex-1 flex-col sm:flex-row">
        {/* Player side */}
        <div className="flex-1 border-b sm:border-b-0 sm:border-r border-white/5 p-4 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold">You</span>
            </div>
            <div className="flex items-center gap-2">
              {comboActive && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full animate-pulse">
                  🔥 x{streak}
                </span>
              )}
              <span className="text-2xl font-bold text-primary">{playerScore}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            {currentQ && !showResult && (
              <div className="animate-fade-up w-full max-w-md">
                <div className="mb-4">
                  <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full">
                    {currentQ.category || "funny"}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-6 leading-snug">
                  {currentQ.question}
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  {currentQ.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handlePlayerAnswer(i)}
                      disabled={playerAnswered}
                      className={`group relative overflow-hidden rounded-xl border p-3 sm:p-4 text-left text-sm sm:text-base transition-all duration-200 ${
                        playerAnswered
                          ? i === currentQ.correct
                            ? "border-green-500/60 bg-green-500/10"
                            : i === playerChoice
                            ? "border-red-500/60 bg-red-500/10"
                            : "border-white/5 opacity-50"
                          : "border-white/10 hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-0.5 cursor-pointer"
                      }`}
                    >
                      <span className="text-xs text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showResult && playerReaction && (
              <div className="animate-fade-up text-center">
                <p className="text-lg font-medium mb-1">{playerReaction}</p>
                {playerChoice === currentQ?.correct && playerChoice >= 0 && (
                  <p className="text-green-400 text-sm">✅ Correct!</p>
                )}
                {playerChoice !== currentQ?.correct && playerChoice >= 0 && (
                  <p className="text-red-400 text-sm">❌ Wrong! The answer was: {currentQ?.options[currentQ.correct]}</p>
                )}
                {playerChoice === -1 && (
                  <p className="text-yellow-400 text-sm">⏰ Ran out of time!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Computer side */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Brain className="h-4 w-4 text-accent" />
              </div>
              <span className="font-semibold">Computer</span>
            </div>
            <span className="text-2xl font-bold text-accent">{computerScore}</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            {currentQ && (
              <div className="animate-fade-up w-full max-w-md">
                <div className="mb-4">
                  <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full">
                    {currentQ.category || "funny"}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-6 leading-snug opacity-60">
                  {currentQ.question}
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  {currentQ.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-3 sm:p-4 text-left text-sm sm:text-base transition-all duration-500 ${
                        computerAnswered
                          ? i === currentQ.correct
                            ? "border-green-500/60 bg-green-500/10"
                            : i === computerChoice
                            ? "border-red-500/60 bg-red-500/10"
                            : "border-white/5 opacity-30"
                          : computerChoice === null && playerAnswered
                          ? "border-white/10 animate-pulse"
                          : "border-white/5"
                      }`}
                    >
                      <span className="text-xs text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showResult && computerReaction && (
              <div className="animate-fade-up text-center">
                <p className="text-lg font-medium">{computerReaction}</p>
              </div>
            )}

            {!computerAnswered && playerAnswered && !showResult && (
              <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                <Brain className="h-4 w-4" />
                <span className="text-sm">Computer is thinking...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Streak: {streak}x</span>
        <span className="hidden sm:inline">Answer fast for streak bonuses!</span>
        <Button variant="ghost" className="h-7 text-xs" onClick={() => setGamePhase("menu")}>
          Quit
        </Button>
      </div>
    </div>
  );
}