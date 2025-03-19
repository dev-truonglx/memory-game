// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('initial');
  const [currentNumber, setCurrentNumber] = useState(null);
  const [options, setOptions] = useState([]);
  const [nextNumber, setNextNumber] = useState(null);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(localStorage.getItem('highScore') || 0);
  const [timeLeft, setTimeLeft] = useState(10); // 10 giây cho mỗi lựa chọn

  // Tạo số ngẫu nhiên từ 1-1000
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 1000) + 1;
  };

  // Khởi tạo số đầu tiên và đếm ngược
  useEffect(() => {
    if (gameState === 'initial') {
      setCurrentNumber(generateRandomNumber());
    }
  }, [gameState]);

  // Đếm ngược khi đang chơi
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('gameOver');
    }
  }, [gameState, timeLeft]);

  // Bắt đầu game
  const startGame = () => {
    setGameState('playing');
    setTimeLeft(10);
    generateNextLevel(currentNumber);
  };

  // Tạo các lựa chọn cho level
  const generateNextLevel = (prevNumber) => {
    const newOptions = [
      prevNumber,
      generateRandomNumber(),
      generateRandomNumber(),
      generateRandomNumber()
    ];
    // Xáo trộn mảng
    for (let i = newOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newOptions[i], newOptions[j]] = [newOptions[j], newOptions[i]];
    }
    setOptions(newOptions);
    setNextNumber(generateRandomNumber());
  };

  // Xử lý khi người chơi chọn
  const handleChoice = (choice) => {
    if (choice === currentNumber) {
      const newLevel = level + 1;
      setLevel(newLevel);
      setCurrentNumber(nextNumber);
      setTimeLeft(10); // Reset thời gian
      generateNextLevel(nextNumber);
      // Cập nhật high score
      if (newLevel > highScore) {
        setHighScore(newLevel);
        localStorage.setItem('highScore', newLevel);
      }
    } else {
      setGameState('gameOver');
    }
  };

  // Reset game
  const resetGame = () => {
    setGameState('initial');
    setLevel(1);
    setOptions([]);
    setNextNumber(null);
    setTimeLeft(10);
  };

  return (
    <div className="App">
      {gameState === 'initial' && (
        <div className="initial-screen animate-fade-in">
          <h1>Trò chơi luyện trí nhớ</h1>
          <h3>Điểm cao nhất: {highScore}</h3>
          {currentNumber && (
            <div>
              <h2>Hãy nhớ số này:</h2>
              <h2 className="memory-number animate-bounce">{currentNumber}</h2>
            </div>
          )}
          <button className="start-button" onClick={startGame}>Bắt đầu</button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-screen animate-fade-in">
          <h1>Level {level}</h1>
          <h3>Điểm cao nhất: {highScore}</h3>
          <div className="timer">Thời gian: {timeLeft}s</div>
          <h3>Chọn số đã xuất hiện ở màn trước:</h3>
          <div className="options-grid">
            {options.map((option, index) => (
              <button 
                key={index}
                className="option-button animate-pop-in"
                onClick={() => handleChoice(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="next-number">
            <h3>Số tiếp theo cần nhớ: <span className="highlight">{nextNumber}</span></h3>
          </div>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className="game-over animate-fade-in">
          <h1>Game Over!</h1>
          <h2>Đạt level: {level}</h2>
          <h3>Điểm cao nhất: {highScore}</h3>
          <button className="reset-button" onClick={resetGame}>Chơi lại</button>
        </div>
      )}
    </div>
  );
}

export default App;