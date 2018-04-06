import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Square extends React.Component {
  render() {
    return (
      <button
        title={this.props.title}
        className={this.getClass()}
        onClick={() => {
          this.onClick();
          this.props.onClick();
        }}
      >
        {this.props.value}
      </button>
    );
  }

  getClass() {
    if (this.props.winner) {
      return "square winner";
    } else {
      return this.props.value ? "square played" : "square";
    }
  }

  onClick() {
    const parts = (this.className || "").split(" ");
    console.log(parts);
    if (parts.indexOf("played") === -1) {
      parts.push("played");
      this.className = parts.join(" ");
    }
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.makeState();
    this.players = ["X", "O"];
    this.winnerLookup = {};
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        title={i}
        winner={this.state.winningSquares.indexOf(i) > -1}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  handleClick(i) {
    if (this.shouldSuppressClick()) {
      return;
    }

    const squares = this.state.squares.slice();
    squares[i] = this.players[this.state.currentPlayer];

    const winner = this.determineWinner(squares),
      winningSquares = winner ? winner.squares : [];
    if (winner) {
      this.mutate({ gameOver: true });
    } else {
      this.mutate({
        currentPlayer: (this.state.currentPlayer + 1) % 2
      });
    }

    this.mutate({
      squares,
      winningSquares,
      gameOver: !!winner,
      currentPlayer: !winner ? ((this.state.currentPlayer + 1) % 2) : this.state.currentPlayer
    });
  }

  mutate(props) {
    console.log("mutating", props);
    this.setState(Object.assign({}, this.state, props));
  }

  determineWinner(squares) {
    return [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [6, 4, 2]
    ].reduce((acc, cur) => {
      var value = squares
        .reduce(
          (a, currentSquare, idx) =>
            cur.indexOf(idx) > -1 ? a.concat([currentSquare]) : a,
          []
        )
        .join("");
      const player = { XXX: "X", OOO: "O" }[value];
      return acc || (player ? { player, squares: cur } : null);
    }, null);
  }

  shouldSuppressClick(i) {
    return this.state.squares[i] || this.state.gameOver;
  }

  playerName() {
    return this.players[this.state.currentPlayer];
  }

  makeState() {
    return {
      winningSquares: [],
      squares: Array(9).fill(),
      currentPlayer: 0,
      gameOver: false
    };
  }

  reset() {
    this.setState(this.makeState());
  }

  render() {
    const status = this.gameOver
      ? `${this.playerName()} won!`
      : `To play: ${this.playerName()}`;

    return (
      <div>
        <div className="status">
          {this.state.gameOver ? (
            <button onClick={() => this.reset()}>Again?</button>
          ) : status}
        </div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
