// 游戏头部组件：集中展示标题、分数、步数，并提供重新开始按钮。
const GameHeader = ({ score, moves, onReset }) => {
  return (
    <div className="game-header">
      {/* 游戏标题用于明确当前页面功能。 */}
      <h1>Memory Card Game</h1>
      {/* 统计区展示玩家当前局面的核心指标。 */}
      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Score: </span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Moves: </span>
          <span className="stat-value">{moves}</span>
        </div>
      </div>
      {/* 用户可以随时点击此按钮，中断当前对局并开始一局新游戏。 */}
      <button className="reset-btn" onClick={onReset}>
        Reset Game
      </button>
    </div>
  );
};

export default GameHeader;
