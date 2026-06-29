// 单张卡片组件：负责渲染卡片正反面，并把关卡主题信息映射成更童趣的卡面样式。
const Card = ({ card, onCardClick, disabled = false }) => {
  // 卡面插画按照 pairId 与 public 目录下的 SVG 文件一一对应，便于后续继续扩充资源包。
  const imageSrc = `/card-art/${card.pairId}.svg`;

  return (
    <button
      type="button"
      // flipped 控制翻面展示，matched 表示已配对成功，disabled 用于等待回翻时暂时冻结交互。
      className={`card ${card.isFlipped ? "flipped" : ""} ${
        card.isMatch ? "matched" : ""
      } ${disabled ? "card-disabled" : ""}`}
      style={{ "--card-accent": card.accent }}
      // 点击时回传完整卡片对象，方便上层根据 pairId 做配对判断。
      onClick={() => onCardClick(card)}
      disabled={disabled || card.isMatch}
      aria-label={`记忆卡片：${card.title}`}
    >
      {/* 正面统一展示童趣提示，引导孩子点击翻牌。 */}
      <span className="card-front">
        <span className="card-front-bubble">翻翻看</span>
        <span className="card-front-mark">?</span>
      </span>
      {/* 背面改为“插画 + 短标题”的贴纸式卡面，降低纯文字带来的单调感。 */}
      <span className="card-back">
        <span className="card-art-frame">
          <img
            className="card-art-image"
            src={imageSrc}
            alt={card.title}
            loading="lazy"
            width="132"
            height="132"
          />
        </span>
        <span className="card-back-title">{card.title}</span>
        <span className="card-back-subtitle">{card.subtitle}</span>
      </span>
    </button>
  );
};

export default Card;
