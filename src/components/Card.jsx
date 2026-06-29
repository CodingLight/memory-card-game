// 单张卡片组件：根据翻面和匹配状态切换样式，并把点击事件向上交给父级处理。
const Card = ({ card, onCardClick }) => {
  return (
    <div
      // flipped 控制是否展示背面，matched 用于标识已成功配对的卡片样式。
      className={`card ${card.isFlipped ? "flipped" : ""} ${
        card.isMatch ? "matched" : ""
      }`}
      // 点击时把完整 card 对象回传，方便上层逻辑直接读取其 id 和 value。
      onClick={() => onCardClick(card)}
    >
      {/* 正面统一显示问号，提示玩家该卡片尚未被识别。 */}
      <div className="card-front">?</div>
      {/* 背面显示真实卡面内容，在翻开后供玩家记忆与比对。 */}
      <div className="card-back">{card.value}</div>
    </div>
  );
};

export default Card;
