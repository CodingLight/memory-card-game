import Card from "./components/Card";
import GameHeader from "./components/GameHeader";
import WinMessage from "./components/WinMessage";
import useGameLogic from "./hooks/useGameLogic";

// 应用根组件：负责拼装头部、胜利提示和卡片网格，并从自定义 Hook 获取全部游戏状态。
function App() {
  // 将游戏逻辑与界面渲染解耦，组件本身只关心如何展示状态和绑定事件。
  const { cards, score, moves, hasWon, handleReset, handleCardClick } =
    useGameLogic();

  return (
    <div className="app">
      {/* 头部区域展示当前分数、操作次数，并提供手动重开入口。 */}
      <GameHeader score={score} moves={moves} onReset={handleReset} />
      {/* 胜利后显示覆盖层提示，告诉玩家本局已完成。 */}
      {hasWon && <WinMessage moves={moves} />}
      {/* 卡片区域按当前 cards 状态渲染；点击行为统一交给 Hook 中的逻辑处理。 */}
      <div className="cards-grid" style={{ marginTop: "20px" }}>
        {cards.map((card) => (
          <Card key={card.id} card={card} onCardClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}

export default App;
