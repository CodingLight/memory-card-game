import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Card from "./components/Card";
import GameHeader from "./components/GameHeader";
import WinMessage from "./components/WinMessage";
import useGameLogic from "./hooks/useGameLogic";

// 关卡数据集中定义在根组件文件中，便于当前小型项目统一维护 UI 文案、难度和奖励信息。
const levelOptions = [
  {
    id: "meadow",
    name: "云朵草坪",
    difficulty: "轻松热身",
    description: "跟着云朵和小兔一起热热身，先记住最基础的 6 组卡片。",
    rewardLabel: "云朵贴纸 x2",
    targetMoves: 14,
    columns: 3,
    deck: [
      {
        id: "cloud",
        shortLabel: "云",
        title: "云朵朵",
        subtitle: "慢慢飘呀飘",
        accent: "#8dd7ff",
      },
      {
        id: "rainbow",
        shortLabel: "虹",
        title: "彩虹桥",
        subtitle: "轻轻亮起来",
        accent: "#ffb1c8",
      },
      {
        id: "star",
        shortLabel: "星",
        title: "星星灯",
        subtitle: "眨眼亮晶晶",
        accent: "#ffd86b",
      },
      {
        id: "bunny",
        shortLabel: "兔",
        title: "兔兔跳",
        subtitle: "蹦蹦好开心",
        accent: "#c9b8ff",
      },
      {
        id: "bear",
        shortLabel: "熊",
        title: "熊熊糖",
        subtitle: "软软甜甜哒",
        accent: "#ffbf93",
      },
      {
        id: "whale",
        shortLabel: "鲸",
        title: "鲸鱼湾",
        subtitle: "咕噜吹泡泡",
        accent: "#8fe1d6",
      },
    ],
  },
  {
    id: "rainbow",
    name: "彩虹乐园",
    difficulty: "标准挑战",
    description: "彩虹滑梯已经展开，8 组卡片会更考验观察力和记忆节奏。",
    rewardLabel: "彩虹徽章 x1",
    targetMoves: 22,
    columns: 4,
    deck: [
      {
        id: "cloud",
        shortLabel: "云",
        title: "云朵朵",
        subtitle: "慢慢飘呀飘",
        accent: "#8dd7ff",
      },
      {
        id: "rainbow",
        shortLabel: "虹",
        title: "彩虹桥",
        subtitle: "轻轻亮起来",
        accent: "#ffb1c8",
      },
      {
        id: "star",
        shortLabel: "星",
        title: "星星灯",
        subtitle: "眨眼亮晶晶",
        accent: "#ffd86b",
      },
      {
        id: "bunny",
        shortLabel: "兔",
        title: "兔兔跳",
        subtitle: "蹦蹦好开心",
        accent: "#c9b8ff",
      },
      {
        id: "bear",
        shortLabel: "熊",
        title: "熊熊糖",
        subtitle: "软软甜甜哒",
        accent: "#ffbf93",
      },
      {
        id: "whale",
        shortLabel: "鲸",
        title: "鲸鱼湾",
        subtitle: "咕噜吹泡泡",
        accent: "#8fe1d6",
      },
      {
        id: "moon",
        shortLabel: "月",
        title: "月亮船",
        subtitle: "摇摇晃晃睡",
        accent: "#9ac7ff",
      },
      {
        id: "cat",
        shortLabel: "猫",
        title: "猫猫铃",
        subtitle: "叮当蹭蹭你",
        accent: "#ff9fb8",
      },
    ],
  },
  {
    id: "forest",
    name: "星辉森林",
    difficulty: "进阶冒险",
    description: "在星辉森林里寻找 10 组伙伴，适合已经熟悉玩法的小探险家。",
    rewardLabel: "森林宝箱 x1",
    targetMoves: 30,
    columns: 5,
    deck: [
      {
        id: "cloud",
        shortLabel: "云",
        title: "云朵朵",
        subtitle: "慢慢飘呀飘",
        accent: "#8dd7ff",
      },
      {
        id: "rainbow",
        shortLabel: "虹",
        title: "彩虹桥",
        subtitle: "轻轻亮起来",
        accent: "#ffb1c8",
      },
      {
        id: "star",
        shortLabel: "星",
        title: "星星灯",
        subtitle: "眨眼亮晶晶",
        accent: "#ffd86b",
      },
      {
        id: "bunny",
        shortLabel: "兔",
        title: "兔兔跳",
        subtitle: "蹦蹦好开心",
        accent: "#c9b8ff",
      },
      {
        id: "bear",
        shortLabel: "熊",
        title: "熊熊糖",
        subtitle: "软软甜甜哒",
        accent: "#ffbf93",
      },
      {
        id: "whale",
        shortLabel: "鲸",
        title: "鲸鱼湾",
        subtitle: "咕噜吹泡泡",
        accent: "#8fe1d6",
      },
      {
        id: "moon",
        shortLabel: "月",
        title: "月亮船",
        subtitle: "摇摇晃晃睡",
        accent: "#9ac7ff",
      },
      {
        id: "cat",
        shortLabel: "猫",
        title: "猫猫铃",
        subtitle: "叮当蹭蹭你",
        accent: "#ff9fb8",
      },
      {
        id: "deer",
        shortLabel: "鹿",
        title: "小鹿角",
        subtitle: "躲在花丛里",
        accent: "#a8df9f",
      },
      {
        id: "cake",
        shortLabel: "糖",
        title: "糖糖屋",
        subtitle: "闻起来香香",
        accent: "#ffcf80",
      },
    ],
  },
];

// 背包和设置均为前端演示数据，用于把用户要求中的多界面流转完整落到当前项目里。
const bagItems = [
  {
    id: "hint",
    name: "星星放大镜",
    desc: "开局时悄悄记住一组卡片。",
    count: 2,
  },
  {
    id: "bubble",
    name: "泡泡护盾",
    desc: "翻错时给你一个小小安慰。",
    count: 1,
  },
  { id: "clock", name: "慢慢沙漏", desc: "让回翻动画变得更从容。", count: 3 },
  {
    id: "sticker",
    name: "奖励贴纸",
    desc: "通关后会贴进你的收藏册。",
    count: 8,
  },
];

const helperCards = [
  {
    id: "pet",
    title: "今日伙伴",
    body: "小熊布布已经准备好给你加油啦。",
    tone: "peach",
  },
  {
    id: "mission",
    title: "每日任务",
    body: "完成 2 次挑战，就能解锁额外彩虹贴纸。",
    tone: "mint",
  },
  {
    id: "care",
    title: "护眼提醒",
    body: "柔和对比色和大按钮布局，适合长短时段交替游玩。",
    tone: "lavender",
  },
];

// 根据步数和目标步数给出 1-3 星评价，让结算弹窗更有目标感。
const getStarCount = (moves, targetMoves) => {
  if (moves <= targetMoves) {
    return 3;
  }

  if (moves <= targetMoves + 4) {
    return 2;
  }

  return 1;
};

// 应用根组件：负责组织多场景 UI、状态切换、浮层交互，并与游戏逻辑 Hook 对接。
function App() {
  // scene 用来模拟完整儿童游戏流程，从启动页一路流转到大厅、关卡和游戏主界面。
  const [scene, setScene] = useState("splash");
  // authMode 用于在登录和注册两个表单之间切换，满足登录/注册页的界面需求。
  const [authMode, setAuthMode] = useState("login");
  // profile 保存当前玩家昵称和陪伴者称呼，用于大厅欢迎语与信息展示。
  const [profile, setProfile] = useState({
    name: "小小探险家",
    guardian: "陪玩星球",
    password: "",
  });
  // selectedLevelId 用于记录当前选中的关卡卡组，关卡切换时会同步刷新游戏内容。
  const [selectedLevelId, setSelectedLevelId] = useState(levelOptions[1].id);
  // activePanel 负责打开背包或设置气泡面板，null 表示当前没有浮层。
  const [activePanel, setActivePanel] = useState(null);
  // sceneLoading 用于启动页和切换关卡时的趣味过渡动画。
  const [sceneLoading, setSceneLoading] = useState(false);
  // toastMessage 负责展示底部气泡提示，给交互动作即时反馈。
  const [toastMessage, setToastMessage] = useState(null);
  // 设置项支持音效、音乐、减少动效和增强对比度，方便满足适配与合规要求。
  const [settings, setSettings] = useState({
    music: true,
    sound: true,
    reducedMotion: false,
    highContrast: false,
  });
  // launchTimerRef 统一管理场景切换动画的延时任务，避免多次点击留下旧定时器。
  const launchTimerRef = useRef(null);
  const selectedLevel = useMemo(
    () =>
      levelOptions.find((level) => level.id === selectedLevelId) ||
      levelOptions[0],
    [selectedLevelId],
  );

  // 游戏逻辑 Hook 只关注对局本身；不同界面和浮层交互仍由 App 统一编排。
  const {
    cards,
    score,
    moves,
    hasWon,
    matchedPairs,
    totalPairs,
    isResolving,
    handleReset,
    handleCardClick,
  } = useGameLogic(selectedLevel);

  const starCount = getStarCount(moves, selectedLevel.targetMoves);

  // 统一封装气泡提示，减少多个交互入口重复写状态更新逻辑。
  const showToast = useCallback((message) => {
    setToastMessage(message);
  }, []);

  useEffect(() => {
    // 应用启动后先展示一段趣味加载，再自动进入登录页。
    launchTimerRef.current = window.setTimeout(() => {
      setScene("auth");
      launchTimerRef.current = null;
    }, 1800);

    return () => {
      if (launchTimerRef.current) {
        window.clearTimeout(launchTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setToastMessage(null);
    }, 2200);

    return () => window.clearTimeout(timerId);
  }, [toastMessage]);

  const closePanel = () => setActivePanel(null);

  const openPanel = (panelName) => {
    setActivePanel(panelName);
  };

  const handleProfileChange = (fieldName, fieldValue) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [fieldName]: fieldValue,
    }));
  };

  const handleAuthSubmit = (event) => {
    event.preventDefault();
    setScene("lobby");
    showToast(
      authMode === "login"
        ? `欢迎回来，${profile.name}！`
        : `注册成功，${profile.name} 的冒险手册已准备好啦！`,
    );
  };

  const launchSelectedLevel = useCallback(() => {
    if (launchTimerRef.current) {
      window.clearTimeout(launchTimerRef.current);
    }

    setSceneLoading(true);
    setActivePanel(null);
    showToast(`小熊正在为你整理 ${selectedLevel.name} 的卡片。`);

    launchTimerRef.current = window.setTimeout(() => {
      handleReset(selectedLevel);
      setScene("game");
      setSceneLoading(false);
      launchTimerRef.current = null;
    }, 1400);
  }, [handleReset, selectedLevel, showToast]);

  const handleReplay = () => {
    handleReset(selectedLevel);
    showToast(`再来一次，看看能不能把 ${selectedLevel.name} 玩得更棒！`);
  };

  const handleBackToLobby = () => {
    setScene("lobby");
    setActivePanel(null);
    showToast("已经回到彩虹大厅啦。");
  };

  const handleSettingToggle = (settingKey, settingLabel) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [settingKey]: !currentSettings[settingKey],
    }));
    showToast(`${settingLabel}已更新。`);
  };

  const renderAuthScene = () => (
    <section className="scene-card auth-card">
      <div className="auth-copy">
        <p className="section-eyebrow">童趣欢迎页</p>
        <h1>Memory Card 梦幻乐园</h1>
        <p className="scene-description">
          柔和的马卡龙色、圆鼓鼓的气泡按钮和软萌引导文案，会陪着孩子完成每一次记忆挑战。
        </p>
        <div className="feature-pill-row">
          <span className="feature-pill">云朵面板</span>
          <span className="feature-pill">彩虹引导</span>
          <span className="feature-pill">护眼配色</span>
        </div>
      </div>
      <form className="auth-form" onSubmit={handleAuthSubmit}>
        <div className="auth-tab-row">
          <button
            type="button"
            className={
              authMode === "login" ? "tab-button active" : "tab-button"
            }
            onClick={() => setAuthMode("login")}
          >
            登录
          </button>
          <button
            type="button"
            className={
              authMode === "register" ? "tab-button active" : "tab-button"
            }
            onClick={() => setAuthMode("register")}
          >
            注册
          </button>
        </div>
        <label className="field-group">
          <span>小朋友昵称</span>
          <input
            value={profile.name}
            onChange={(event) =>
              handleProfileChange("name", event.target.value)
            }
            placeholder="输入可爱昵称"
          />
        </label>
        <label className="field-group">
          <span>陪伴者称呼</span>
          <input
            value={profile.guardian}
            onChange={(event) =>
              handleProfileChange("guardian", event.target.value)
            }
            placeholder="例如：妈妈、小老师"
          />
        </label>
        <label className="field-group">
          <span>{authMode === "login" ? "登录口令" : "设置口令"}</span>
          <input
            type="password"
            value={profile.password}
            onChange={(event) =>
              handleProfileChange("password", event.target.value)
            }
            placeholder="为了演示流程，这里不会真实提交"
          />
        </label>
        <button type="submit" className="bubble-button auth-submit">
          {authMode === "login" ? "进入彩虹大厅" : "创建冒险手册"}
        </button>
      </form>
    </section>
  );

  const renderLobbyScene = () => (
    <section className="scene-stack">
      <section className="hero-card">
        <div>
          <p className="section-eyebrow">主页大厅</p>
          <h1>{profile.name}，欢迎回到童趣记忆乐园</h1>
          <p className="scene-description">
            今天也和 {profile.guardian}{" "}
            一起，去云朵、彩虹和星星组成的世界里完成一场轻松的记忆冒险吧。
          </p>
          <div className="hero-action-row">
            <button
              type="button"
              className="bubble-button"
              onClick={() => setScene("levels")}
            >
              选择关卡
            </button>
            <button
              type="button"
              className="bubble-button bubble-button-soft"
              onClick={() => openPanel("bag")}
            >
              查看背包
            </button>
            <button
              type="button"
              className="bubble-button bubble-button-soft"
              onClick={() => openPanel("settings")}
            >
              打开设置
            </button>
          </div>
        </div>
        <div className="mascot-bubble">
          <span className="mascot-face">熊</span>
          <p>布布小熊提醒你：慢慢看、慢慢记，一样很厉害。</p>
        </div>
      </section>

      <section className="dashboard-grid">
        {helperCards.map((item) => (
          <article key={item.id} className={`mini-panel tone-${item.tone}`}>
            <p className="mini-panel-title">{item.title}</p>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="level-preview-card">
        <div>
          <p className="section-eyebrow">推荐关卡</p>
          <h2>{selectedLevel.name}</h2>
          <p>{selectedLevel.description}</p>
        </div>
        <div className="level-meta-list">
          <span className="feature-pill">{selectedLevel.difficulty}</span>
          <span className="feature-pill">
            目标步数 {selectedLevel.targetMoves}
          </span>
          <span className="feature-pill">奖励 {selectedLevel.rewardLabel}</span>
        </div>
      </section>
    </section>
  );

  const renderLevelsScene = () => (
    <section className="scene-stack">
      <section className="section-header-card">
        <div>
          <p className="section-eyebrow">关卡选择页</p>
          <h1>挑一条最喜欢的彩虹路线</h1>
          <p className="scene-description">
            每个关卡都使用同一套童趣设计语言，只通过卡片数量、说明文案和奖励目标体现差异。
          </p>
        </div>
        <button
          type="button"
          className="bubble-button bubble-button-soft"
          onClick={handleBackToLobby}
        >
          返回大厅
        </button>
      </section>
      <div className="level-grid">
        {levelOptions.map((level) => (
          <button
            type="button"
            key={level.id}
            className={
              selectedLevelId === level.id ? "level-card active" : "level-card"
            }
            onClick={() => {
              setSelectedLevelId(level.id);
              showToast(`已选中 ${level.name}。`);
            }}
          >
            <span className="level-card-badge">{level.difficulty}</span>
            <h2>{level.name}</h2>
            <p>{level.description}</p>
            <div className="level-card-meta">
              <span>{level.deck.length} 组记忆卡</span>
              <span>奖励：{level.rewardLabel}</span>
            </div>
          </button>
        ))}
      </div>
      <section className="launch-card">
        <div>
          <p className="section-eyebrow">准备出发</p>
          <h2>{selectedLevel.name}</h2>
          <p>
            建议在 {selectedLevel.targetMoves} 步内完成，挑战更高的星级评价。
          </p>
        </div>
        <button
          type="button"
          className="bubble-button"
          onClick={launchSelectedLevel}
        >
          开始这场冒险
        </button>
      </section>
    </section>
  );

  const renderGameScene = () => (
    <section className="scene-stack">
      <GameHeader
        levelName={selectedLevel.name}
        levelDifficulty={selectedLevel.difficulty}
        score={score}
        moves={moves}
        matchedPairs={matchedPairs}
        totalPairs={totalPairs}
        onReset={() => handleReset(selectedLevel)}
        onBack={handleBackToLobby}
        onOpenBag={() => openPanel("bag")}
        onOpenSettings={() => openPanel("settings")}
      />
      <section className="battle-layout">
        <aside className="battle-side-panel">
          <div className="mini-panel tone-mint">
            <p className="mini-panel-title">冒险目标</p>
            <p>
              把 {selectedLevel.deck.length}{" "}
              组卡片都找出来，记住每位小伙伴的位置。
            </p>
          </div>
          <div className="mini-panel tone-peach">
            <p className="mini-panel-title">提示气泡</p>
            <p>
              {isResolving
                ? "先等等，卡片正在轻轻翻回去。"
                : "现在可以继续翻牌啦。"}
            </p>
          </div>
          <div className="mini-panel tone-lavender">
            <p className="mini-panel-title">奖励预告</p>
            <p>完成后会获得 {selectedLevel.rewardLabel}，还能点亮结算星星。</p>
          </div>
        </aside>
        <section className="game-board-panel">
          <div className="board-heading">
            <div>
              <p className="section-eyebrow">游戏操作主界面</p>
              <h2>翻开软萌卡片，找到它们的伙伴</h2>
            </div>
            <span className="board-chip">
              目标步数 {selectedLevel.targetMoves}
            </span>
          </div>
          <div
            className="cards-grid"
            style={{ "--columns": selectedLevel.columns }}
          >
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onCardClick={handleCardClick}
                disabled={isResolving}
              />
            ))}
          </div>
        </section>
      </section>
      {hasWon && (
        <WinMessage
          levelName={selectedLevel.name}
          moves={moves}
          matchedPairs={matchedPairs}
          starCount={starCount}
          rewardLabel={selectedLevel.rewardLabel}
          onReplay={handleReplay}
          onBackToLobby={handleBackToLobby}
        />
      )}
    </section>
  );

  const renderActivePanel = () => {
    if (!activePanel) {
      return null;
    }

    if (activePanel === "bag") {
      return (
        <div className="bubble-modal-overlay" onClick={closePanel}>
          <section
            className="bubble-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header-row">
              <div>
                <p className="section-eyebrow">背包 / 道具界面</p>
                <h2>软萌背包</h2>
              </div>
              <button
                type="button"
                className="bubble-button bubble-button-soft"
                onClick={closePanel}
              >
                关上背包
              </button>
            </div>
            <div className="bag-grid">
              {bagItems.map((item) => (
                <article key={item.id} className="bag-item-card">
                  <span className="bag-item-count">{item.count}</span>
                  <h3>{item.name}</h3>
                  <p>{item.desc}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      );
    }

    return (
      <div className="bubble-modal-overlay" onClick={closePanel}>
        <section
          className="bubble-modal"
          role="dialog"
          aria-modal="true"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="modal-header-row">
            <div>
              <p className="section-eyebrow">设置面板</p>
              <h2>冒险偏好调整</h2>
            </div>
            <button
              type="button"
              className="bubble-button bubble-button-soft"
              onClick={closePanel}
            >
              收起设置
            </button>
          </div>
          <div className="settings-list">
            <button
              type="button"
              className={settings.music ? "setting-row active" : "setting-row"}
              onClick={() => handleSettingToggle("music", "背景音乐")}
            >
              <span>背景音乐</span>
              <strong>{settings.music ? "已开启" : "已关闭"}</strong>
            </button>
            <button
              type="button"
              className={settings.sound ? "setting-row active" : "setting-row"}
              onClick={() => handleSettingToggle("sound", "按钮音效")}
            >
              <span>按钮音效</span>
              <strong>{settings.sound ? "已开启" : "已关闭"}</strong>
            </button>
            <button
              type="button"
              className={
                settings.reducedMotion ? "setting-row active" : "setting-row"
              }
              onClick={() =>
                handleSettingToggle("reducedMotion", "减少动态效果")
              }
            >
              <span>减少动态效果</span>
              <strong>{settings.reducedMotion ? "已开启" : "已关闭"}</strong>
            </button>
            <button
              type="button"
              className={
                settings.highContrast ? "setting-row active" : "setting-row"
              }
              onClick={() => handleSettingToggle("highContrast", "增强对比度")}
            >
              <span>增强对比度</span>
              <strong>{settings.highContrast ? "已开启" : "已关闭"}</strong>
            </button>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div
      className={`playful-app scene-${scene} ${
        settings.reducedMotion ? "reduced-motion" : ""
      } ${settings.highContrast ? "high-contrast" : ""}`}
    >
      {/* 背景装饰统一使用云朵、星星和彩虹条，保证所有页面共享一致的世界观。 */}
      <div className="background-decor">
        <span className="decor-cloud cloud-left" />
        <span className="decor-cloud cloud-right" />
        <span className="decor-rainbow" />
        <span className="decor-star star-one" />
        <span className="decor-star star-two" />
      </div>

      {scene === "splash" ? (
        <section className="splash-screen">
          <div className="splash-logo">梦</div>
          <h1>Memory Card 梦幻乐园</h1>
          <p>小动物正在跑来帮你整理记忆卡片，马上就好啦。</p>
          <div className="loading-mascots" aria-hidden="true">
            <span className="loading-mascot">兔</span>
            <span className="loading-mascot">熊</span>
            <span className="loading-mascot">星</span>
          </div>
          <div className="loading-track" aria-hidden="true">
            <span className="loading-track-fill" />
          </div>
        </section>
      ) : null}

      {scene !== "splash" ? (
        <main className="app-shell">
          <header className="topbar">
            <div>
              <p className="section-eyebrow">童趣化全场景改造</p>
              <h2>当前玩家：{profile.name}</h2>
            </div>
            <div className="topbar-actions">
              <span className="feature-pill">Q 版圆角组件</span>
              <span className="feature-pill">响应式布局</span>
              <span className="feature-pill">无障碍对比度</span>
            </div>
          </header>

          {scene === "auth" && renderAuthScene()}
          {scene === "lobby" && renderLobbyScene()}
          {scene === "levels" && renderLevelsScene()}
          {scene === "game" && renderGameScene()}
        </main>
      ) : null}

      {sceneLoading ? (
        <div className="scene-loader-overlay">
          <div className="scene-loader-card">
            <p className="section-eyebrow">趣味加载中</p>
            <h2>{selectedLevel.name}</h2>
            <p>小动物正在排队进入关卡，星星进度条也在发光发亮。</p>
            <div className="loading-mascots" aria-hidden="true">
              <span className="loading-mascot">猫</span>
              <span className="loading-mascot">鹿</span>
              <span className="loading-mascot">虹</span>
            </div>
            <div className="loading-track" aria-hidden="true">
              <span className="loading-track-fill" />
            </div>
          </div>
        </div>
      ) : null}

      {renderActivePanel()}

      {toastMessage ? (
        <div className="toast-bubble" role="status" aria-live="polite">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}

export default App;
