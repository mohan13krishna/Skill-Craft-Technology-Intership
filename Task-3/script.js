class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = { X: 0, O: 0 };
        this.winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.makeMove(index));
        });

        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.closeModal();
            this.resetGame();
        });
    }

    makeMove(index) {
        if (!this.gameActive || this.board[index] !== '') return;

        this.board[index] = this.currentPlayer;
        const cell = document.querySelector(`[data-index="${index}"]`);
        
        cell.textContent = this.currentPlayer === 'X' ? '❌' : '⭕';
        cell.classList.add(this.currentPlayer.toLowerCase(), 'taken');

        if (this.checkWinner()) {
            this.handleWin();
        } else if (this.isBoardFull()) {
            this.handleTie();
        } else {
            this.switchPlayer();
        }
    }

    checkWinner() {
        return this.winningCombos.find(combo => {
            const [a, b, c] = combo;
            return this.board[a] && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });
    }

    isBoardFull() {
        return this.board.every(cell => cell !== '');
    }

    handleWin() {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.highlightWinningCells();
        this.updateDisplay();
        setTimeout(() => this.showWinModal(), 800);
    }

    handleTie() {
        this.gameActive = false;
        setTimeout(() => this.showTieModal(), 500);
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }

    highlightWinningCells() {
        const winningCombo = this.checkWinner();
        if (winningCombo) {
            winningCombo.forEach(index => {
                document.querySelector(`[data-index="${index}"]`).classList.add('winning');
            });
        }
    }

    updateDisplay() {
        const statusText = this.gameActive ? `Player ${this.currentPlayer}'s Turn` : 'Game Over';
        document.getElementById('game-status').textContent = statusText;
        
        document.getElementById('score-x').textContent = this.scores.X;
        document.getElementById('score-o').textContent = this.scores.O;

        document.getElementById('player-x-info').classList.toggle('active', 
            this.currentPlayer === 'X' && this.gameActive);
        document.getElementById('player-o-info').classList.toggle('active', 
            this.currentPlayer === 'O' && this.gameActive);
    }

    showWinModal() {
        const modal = document.getElementById('victory-modal');
        const winnerSymbol = document.getElementById('winner-symbol');
        const victoryMessage = document.getElementById('victory-message');
        
        winnerSymbol.textContent = this.currentPlayer === 'X' ? '❌' : '⭕';
        winnerSymbol.className = `winner-symbol player-${this.currentPlayer.toLowerCase()}`;
        victoryMessage.textContent = `Player ${this.currentPlayer} Wins! 🎊`;
        
        modal.style.display = 'block';
        this.createFireworks();
    }

    showTieModal() {
        const modal = document.getElementById('victory-modal');
        const winnerSymbol = document.getElementById('winner-symbol');
        const victoryMessage = document.getElementById('victory-message');
        const victoryTitle = document.getElementById('victory-title');
        
        victoryTitle.textContent = '🤝 It\'s a Tie! 🤝';
        winnerSymbol.textContent = '🤝';
        winnerSymbol.className = 'winner-symbol';
        victoryMessage.textContent = 'Great game! Try again! 🎮';
        
        modal.style.display = 'block';
    }

    createFireworks() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd700', '#ff8a80'];
        
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.left = Math.random() * window.innerWidth + 'px';
                firework.style.top = Math.random() * window.innerHeight + 'px';
                firework.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                document.body.appendChild(firework);
                setTimeout(() => firework.remove(), 1000);
            }, i * 80);
        }
    }

    closeModal() {
        document.getElementById('victory-modal').style.display = 'none';
        document.getElementById('victory-title').textContent = '🎉 VICTORY! 🎉';
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.clearBoard();
        this.updateDisplay();
    }

    newGame() {
        this.scores = { X: 0, O: 0 };
        this.resetGame();
    }

    clearBoard() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
