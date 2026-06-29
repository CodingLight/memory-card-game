import { useCallback, useEffect, useRef, useState } from "react";

// 卡面数据使用成对的水果表情，供洗牌后生成记忆卡片列表。
const cardValues = [
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🥝",
  "🍑",
  "🍒",
  "🍎",
  "🍌",
  "🍇",
  "🍊",
  "🍓",
  "🥝",
  "🍑",
  "🍒",
];

// 根据原始卡面值创建一组全新的卡片对象，并通过 Fisher-Yates 算法打乱顺序。
const shuffleCards = () => {
  // 每张卡片都带有独立 id，便于 React 渲染和后续匹配状态更新。
  const shuffledCards = cardValues.map((value, index) => ({
    id: index,
    value,
    isFlipped: false,
    isMatch: false,
  }));

  // 从数组尾部向前遍历，随机交换当前位置与前面任意位置的元素。
  for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledCards[index], shuffledCards[randomIndex]] = [
      shuffledCards[randomIndex],
      shuffledCards[index],
    ];
  }

  return shuffledCards;
};

// 自定义 Hook：统一管理翻牌、配对、计分、步数与自动重开等游戏状态。
const useGameLogic = () => {
  // 初始化时立即洗牌，确保每次进入游戏都有新的卡片顺序。
  const [cards, setCards] = useState(() => shuffleCards());
  // 记录第一张已翻开的卡片 id；为 null 表示当前轮次还未选中第一张。
  const [selectedCardId, setSelectedCardId] = useState(null);
  // score 表示成功配对的组数，moves 表示玩家点击卡片的总次数。
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  // resolveTimerRef 用于控制“不匹配时稍后翻回去”的延时任务。
  const resolveTimerRef = useRef(null);
  // restartTimerRef 用于控制“通关后几秒自动开始新局”的延时任务。
  const restartTimerRef = useRef(null);
  // 当所有卡片都已匹配时，即视为游戏胜利。
  const hasWon = cards.length > 0 && cards.every((card) => card.isMatch);

  // 在重置、卸载或重新开始时统一清理所有定时器，避免状态更新落到旧局面上。
  const clearTimers = useCallback(() => {
    if (resolveTimerRef.current) {
      window.clearTimeout(resolveTimerRef.current);
      resolveTimerRef.current = null;
    }

    if (restartTimerRef.current) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  // 重新开始游戏时，清空所有状态并生成一套新的打乱卡组。
  const handleReset = useCallback(() => {
    clearTimers();
    setCards(shuffleCards());
    setSelectedCardId(null);
    setScore(0);
    setMoves(0);
  }, [clearTimers]);

  // 组件卸载时做兜底清理，防止定时器在页面离开后继续触发。
  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    // 尚未通关时无需安排自动重开定时器。
    if (!hasWon) {
      return undefined;
    }

    // 通关后给玩家几秒钟查看结果，再自动开启新一局。
    restartTimerRef.current = window.setTimeout(() => {
      restartTimerRef.current = null;
      handleReset();
    }, 5000);

    return () => {
      // 如果依赖变更或组件卸载，及时取消旧的自动重开任务。
      if (restartTimerRef.current) {
        window.clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }
    };
  }, [handleReset, hasWon]);

  const handleCardClick = useCallback(
    (card) => {
      // 以下情况直接忽略点击：
      // 1. 正在等待两张不匹配的卡片翻回；
      // 2. 当前卡片已经翻开；
      // 3. 当前卡片已经完成配对。
      if (resolveTimerRef.current || card.isFlipped || card.isMatch) {
        return;
      }

      // 每点击一次卡片都算一次操作，用于展示玩家本局尝试次数。
      setMoves((previousMoves) => previousMoves + 1);

      if (selectedCardId === null) {
        // 当前是本轮第一张牌：只需要把它翻开，并记录它的 id。
        setCards((currentCards) =>
          currentCards.map((currentCard) =>
            currentCard.id === card.id
              ? { ...currentCard, isFlipped: true }
              : currentCard,
          ),
        );
        setSelectedCardId(card.id);
        return;
      }

      // 当前是本轮第二张牌：根据已记录的第一张牌来判断是否配对成功。
      const previousCard = cards.find(
        (currentCard) => currentCard.id === selectedCardId,
      );

      if (!previousCard) {
        // 理论上很少发生；若第一张牌不存在，则直接重置选择状态以保证安全。
        setSelectedCardId(null);
        return;
      }

      // 比较两张卡片的 value，相同则说明成功配对。
      const isMatch = previousCard.value === card.value;

      // 无论是否匹配，先把两张相关卡片都翻开；若匹配成功则同步标记为已完成。
      setCards((currentCards) =>
        currentCards.map((currentCard) => {
          if (currentCard.id === previousCard.id || currentCard.id === card.id) {
            return {
              ...currentCard,
              isFlipped: true,
              isMatch,
            };
          }

          return currentCard;
        }),
      );

      if (isMatch) {
        // 配对成功后增加分数，并清空已选择的第一张牌，为下一轮做准备。
        setScore((previousScore) => previousScore + 1);
        setSelectedCardId(null);
        return;
      }

      // 配对失败时，保留短暂展示时间，让玩家看到结果后再自动翻回去。
      resolveTimerRef.current = window.setTimeout(() => {
        setCards((currentCards) =>
          currentCards.map((currentCard) =>
            currentCard.id === previousCard.id || currentCard.id === card.id
              ? { ...currentCard, isFlipped: false }
              : currentCard,
          ),
        );
        // 定时任务执行完成后，清空引用与首张卡选择状态，允许进入下一轮点击。
        resolveTimerRef.current = null;
        setSelectedCardId(null);
      }, 800);
    },
    [cards, selectedCardId],
  );

  return {
    cards,
    score,
    moves,
    hasWon,
    handleReset,
    handleCardClick,
  };
};

export default useGameLogic;
