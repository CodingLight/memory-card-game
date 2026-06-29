// 胜利提示组件：在玩家完成所有配对后，以覆盖层形式展示结果信息。
const WinMessage = ({ moves }) => {
  return (
    <div className="win-message-overlay">
      {/* 使用 dialog 相关语义属性，帮助辅助技术识别这是一个模态提示层。 */}
      <div className="win-message" role="dialog" aria-modal="true">
        <h2>Congratulations!</h2>
        {/* 将本局步数带入提示文案，给玩家一个直观的成绩反馈。 */}
        <p>You completed the game in {moves} moves!</p>
        {/* 补充说明系统会在几秒后自动开新局，避免玩家误以为界面卡住。 */}
        <p className="win-message-hint">A new game starts in 5 seconds.</p>
      </div>
    </div>
  );
};

export default WinMessage;
