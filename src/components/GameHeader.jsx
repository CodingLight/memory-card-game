// 游戏头部组件：在战斗主界面中集中展示关卡信息、进度统计与快捷操作入口。
const GameHeader = ({
  levelName,
  levelDifficulty,
  score,
  moves,
  matchedPairs,
  totalPairs,
  onReset,
  onBack,
  onOpenBag,
  onOpenSettings,
}) => {
  return (
    <section className="game-header">
      <div className="game-header-top">
        <div>
          {/* 标题区明确告诉玩家当前正在挑战哪一个童趣关卡。 */}
          <p className="section-eyebrow">记忆冒险进行中</p>
          <h1>{levelName}</h1>
          <p className="game-header-subtitle">{levelDifficulty}</p>
        </div>
        {/* 右侧快捷按钮用于返回大厅、打开背包和设置，方便在同一战斗页完成操作。 */}
        <div className="header-action-group">
          <button
            type="button"
            className="bubble-button bubble-button-soft"
            onClick={onBack}
          >
            返回大厅
          </button>
          <button
            type="button"
            className="bubble-button bubble-button-soft"
            onClick={onOpenBag}
          >
            打开背包
          </button>
          <button
            type="button"
            className="bubble-button bubble-button-soft"
            onClick={onOpenSettings}
          >
            冒险设置
          </button>
        </div>
      </div>
      {/* 统计区按“星星数、配对进度、步数”三项组织，帮助孩子快速理解当前局面。 */}
      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">收集星星</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">配对进度</span>
          <span className="stat-value">
            {matchedPairs}/{totalPairs}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">翻牌次数</span>
          <span className="stat-value">{moves}</span>
        </div>
      </div>
      <div className="header-progress-row">
        {/* 进度条用柔和渐变展示本局完成比例，避免只用数字带来的理解门槛。 */}
        <div className="progress-track" aria-hidden="true">
          <span
            className="progress-fill"
            style={{ width: `${(matchedPairs / totalPairs) * 100}%` }}
          />
        </div>
        {/* 重开按钮保留为显性操作，方便快速重新挑战当前关卡。 */}
        <button
          type="button"
          className="bubble-button reset-btn"
          onClick={onReset}
        >
          重新整理卡片
        </button>
      </div>
    </section>
  );
};

export default GameHeader;
