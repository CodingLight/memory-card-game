// 结算弹窗组件：在通关后以软萌气泡面板展示奖励、星级评价与后续操作按钮。
const WinMessage = ({
  levelName,
  moves,
  matchedPairs,
  starCount,
  rewardLabel,
  onReplay,
  onBackToLobby,
}) => {
  return (
    <div className="win-message-overlay">
      {/* 使用 dialog 语义帮助辅助技术理解这是一个需要优先关注的结算层。 */}
      <div className="win-message" role="dialog" aria-modal="true">
        <p className="section-eyebrow">恭喜通关</p>
        <h2>{levelName}</h2>
        <div className="win-stars" aria-label={`获得 ${starCount} 颗星星`}>
          {Array.from({ length: 3 }, (_, index) => (
            <span
              key={`star-${index + 1}`}
              className={index < starCount ? "win-star active" : "win-star"}
            >
              星
            </span>
          ))}
        </div>
        {/* 成绩文案保持短句式，既便于儿童阅读，也有利于家长快速查看表现。 */}
        <p className="win-message-copy">
          你一共完成了 {matchedPairs} 组配对，用了 {moves} 次翻牌。
        </p>
        <p className="win-message-hint">奖励已放入背包：{rewardLabel}</p>
        <div className="win-action-group">
          <button type="button" className="bubble-button" onClick={onReplay}>
            再玩一次
          </button>
          <button
            type="button"
            className="bubble-button bubble-button-soft"
            onClick={onBackToLobby}
          >
            回到大厅
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinMessage;
