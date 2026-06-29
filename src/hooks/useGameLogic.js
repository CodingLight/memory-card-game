import { useCallback, useEffect, useRef, useState } from "react";

// 默认卡组用于兜底，避免上层忘记传关卡数据时导致游戏无法启动。
const defaultCardThemes = [
  { id: "cloud", shortLabel: "云", title: "云朵朵", subtitle: "慢慢飘呀飘", accent: "#8dd7ff" },
  { id: "rainbow", shortLabel: "虹", title: "彩虹桥", subtitle: "笑着打招呼", accent: "#ffb1c8" },
  { id: "star", shortLabel: "星", title: "星星灯", subtitle: "眨眼亮晶晶", accent: "#ffd86b" },
  { id: "bunny", shortLabel: "兔", title: "兔兔跳", subtitle: "蹦蹦好开心", accent: "#c9b8ff" },
  { id: "bear", shortLabel: "熊", title: "熊熊糖", subtitle: "抱着小甜点", accent: "#ffbf93" },
  { id: "whale", shortLabel: "鲸", title: "鲸鱼湾", subtitle: "喷水咕噜噜", accent: "#8fe1d6" },
];

// 依据关卡配置生成成对卡片数据；每张卡片都保留主题信息，方便界面渲染童趣化内容。
const createCardsFromLevel = (levelConfig) => {
  const sourceThemes =
    levelConfig?.deck?.length > 0 ? levelConfig.deck : defaultCardThemes;

  return sourceThemes.flatMap((theme, index) => [
    {
      id: `${theme.id}-${index}-a`,
      pairId: theme.id,
      shortLabel: theme.shortLabel,
      title: theme.title,
      subtitle: theme.subtitle,
      accent: theme.accent,
      isFlipped: false,
      isMatch: false,
    },
    {
      id: `${theme.id}-${index}-b`,
      pairId: theme.id,
      shortLabel: theme.shortLabel,
      title: theme.title,
      subtitle: theme.subtitle,
      accent: theme.accent,
      isFlipped: false,
      isMatch: false,
    },
  ]);
};

// 使用 Fisher-Yates 算法打乱卡片顺序，保证每次开局都具有随机性。
const shuffleCards = (levelConfig) => {
  const shuffledCards = createCardsFromLevel(levelConfig);

  for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledCards[index], shuffledCards[randomIndex]] = [
      shuffledCards[randomIndex],
      shuffledCards[index],
    ];
  }

  return shuffledCards;
};

// 自定义 Hook：统一管理关卡卡组、翻牌流程、匹配结果与局内统计。
const useGameLogic = (levelConfig) => {
  // 初始化时根据当前关卡创建并打乱卡组，保证页面首次渲染即可看到正确难度。
  const [cards, setCards] = useState(() => shuffleCards(levelConfig));
  // selectedCardId 记录当前轮已翻开的第一张牌，便于第二次点击时进行配对判断。
  const [selectedCardId, setSelectedCardId] = useState(null);
  // score 记录成功配对的组数，moves 记录玩家总点击次数。
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  // isResolving 用于告诉界面“当前正在等待两张失败卡片翻回去”，可用于禁用交互提示。
  const [isResolving, setIsResolving] = useState(false);
  // resolveTimerRef 保存失败回翻的延时任务引用，便于重置或卸载时清理。
  const resolveTimerRef = useRef(null);
  // totalPairs 表示当前关卡总配对数；matchedPairs 则表示当前已完成数量。
  const totalPairs = cards.length / 2;
  const matchedPairs = cards.filter((card) => card.isMatch).length / 2;
  // 全部卡片完成匹配后，界面即可弹出结算层。
  const hasWon = cards.length > 0 && cards.every((card) => card.isMatch);

  // 清理所有未完成的回翻定时器，避免旧关卡残留的异步状态污染新局面。
  const clearTimers = useCallback(() => {
    if (resolveTimerRef.current) {
      window.clearTimeout(resolveTimerRef.current);
      resolveTimerRef.current = null;
    }

    setIsResolving(false);
  }, []);

  // handleReset 支持显式传入新关卡，方便上层在“进入新关卡”时先切屏再刷新卡组。
  const handleReset = useCallback(
    (nextLevelConfig = levelConfig) => {
      clearTimers();
      setCards(shuffleCards(nextLevelConfig));
      setSelectedCardId(null);
      setScore(0);
      setMoves(0);
    },
    [clearTimers, levelConfig],
  );

  useEffect(() => clearTimers, [clearTimers]);

  const handleCardClick = useCallback(
    (card) => {
      // 以下情况直接忽略点击：
      // 1. 正在等待失败卡片翻回；
      // 2. 当前卡片已经翻开；
      // 3. 当前卡片已经完成配对；
      // 4. 游戏已经通关，等待结算弹窗中的后续操作。
      if (resolveTimerRef.current || card.isFlipped || card.isMatch || hasWon) {
        return;
      }

      setMoves((previousMoves) => previousMoves + 1);

      if (selectedCardId === null) {
        // 当前是本轮第一张牌：只需要把它翻开，并记住它的 id。
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

      // 找出第一张已翻开的牌，与这次点击的牌进行成对比较。
      const previousCard = cards.find(
        (currentCard) => currentCard.id === selectedCardId,
      );

      if (!previousCard) {
        // 若第一张牌意外丢失，则重置选择状态，防止逻辑进入异常分支。
        setSelectedCardId(null);
        return;
      }

      const isMatch = previousCard.pairId === card.pairId;

      // 第二张牌点击后先统一翻开两张相关卡片，匹配成功时同步落下“已完成”状态。
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
        setScore((previousScore) => previousScore + 1);
        setSelectedCardId(null);
        return;
      }

      // 配对失败时，保留短暂展示时间帮助儿童玩家记忆，再自动翻回。
      setIsResolving(true);
      resolveTimerRef.current = window.setTimeout(() => {
        setCards((currentCards) =>
          currentCards.map((currentCard) =>
            currentCard.id === previousCard.id || currentCard.id === card.id
              ? { ...currentCard, isFlipped: false }
              : currentCard,
          ),
        );
        resolveTimerRef.current = null;
        setIsResolving(false);
        setSelectedCardId(null);
      }, 900);
    },
    [cards, hasWon, selectedCardId],
  );

  return {
    cards,
    score,
    moves,
    hasWon,
    matchedPairs,
    totalPairs,
    isResolving,
    handleReset,
    handleCardClick,
  };
};

export default useGameLogic;
