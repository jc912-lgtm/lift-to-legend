/* ═══════════════════════════════════════
   GAME DATA
   ═══════════════════════════════════════ */
const WC={male:['55kg','61kg','67kg','73kg','81kg','89kg','96kg','102kg','109kg','+109kg'],female:['45kg','49kg','55kg','59kg','64kg','71kg','76kg','81kg','87kg','+87kg']};

// ── 舉重五字訣 (Five Principles from research) ──
const PRINCIPLES=[
  {id:'near',name:'近',full:'槓鈴貼身',desc:'槓鈴要貼近身體移動，減少水平位移',icon:'📏',color:'#41a6f6'},
  {id:'fast',name:'快',full:'動作迅速',desc:'各階段銜接流暢，一氣呵成',icon:'⚡',color:'#f4d03f'},
  {id:'low',name:'低',full:'下蹲接槓低',desc:'以最低姿勢接住槓鈴，提高效率',icon:'⬇️',color:'#38b764'},
  {id:'accurate',name:'準',full:'發力點精準',desc:'槓鈴與髖部發力點接觸精確',icon:'🎯',color:'#ef7d57'},
  {id:'stable',name:'穩',full:'穩定不晃',desc:'接槓後穩定站起，不搖晃前後走動',icon:'🧘',color:'#b13e53'},
];

// ── Selectable Character Avatars ──
const CHARACTERS=[
  {id:'cat',name:'肌肉貓',desc:'灰色貓咪，柔軟但超有力！',bodyColor:'#616161',accentColor:'#ffd740',eyeColor:'#4caf50'},
  {id:'corgi',name:'元氣柯基',desc:'短腿大能量！永遠充滿活力',bodyColor:'#ffb74d',accentColor:'#fff3e0',eyeColor:'#5d4037'},
  {id:'coolboy',name:'酷哥',desc:'戴墨鏡的型男，冷靜又帥氣',bodyColor:'#42a5f5',accentColor:'#e0e0e0',eyeColor:'#263238'},
  {id:'girl',name:'活力女孩',desc:'捲髮運動少女，熱情滿滿！',bodyColor:'#ec407a',accentColor:'#ffd54f',eyeColor:'#1565c0'},
  {id:'bear',name:'力量熊',desc:'別看我呆呆的，力氣超大！',bodyColor:'#8d6e63',accentColor:'#d7ccc8',eyeColor:'#263238'},
];

// ── Snatch 6 Phases (from Paper 1) ──
const SNATCH_PHASES=[
  {id:'start',game:'breathe',name:'預備姿勢',desc:'握好槓鈴，調整呼吸',emoji:'🏋️',stat:'stb',time:'穩定'},
  {id:'firstPull',game:'mash',name:'第一拉',desc:'從地面拉至膝蓋（國際選手0.48秒）',emoji:'⬆️',stat:'str',time:'0.48s'},
  {id:'transition',game:'ring',name:'過渡/雙屈膝',desc:'膝蓋前移，儲存SSC彈性能量',emoji:'🔄',stat:'tec',time:'0.15s'},
  {id:'secondPull',game:'mash',name:'第二拉（發力）',desc:'三關節伸展（髖膝踝）的爆發瞬間！',emoji:'💥',stat:'pwr',time:'0.15s'},
  {id:'catch',game:'ring',name:'接槓下蹲',desc:'快速下蹲在頭頂接住槓鈴',emoji:'⚡',stat:'tec',time:'0.40s'},
  {id:'recovery',game:'hold',name:'站起',desc:'從深蹲位置穩定站起',emoji:'🦵',stat:'str',time:'1.37s'},
];
const CJ_CLEAN_PHASES=[
  {id:'setup',game:'breathe',name:'預備',desc:'穩定站姿',emoji:'🏋️',stat:'stb'},
  {id:'pull',game:'mash',name:'上搏拉',desc:'用腿發力拉槓',emoji:'⬆️',stat:'str'},
  {id:'catch',game:'ring',name:'前蹲接槓',desc:'在肩上接住槓鈴',emoji:'⚡',stat:'tec'},
  {id:'stand',game:'hold',name:'站起',desc:'從前蹲站起',emoji:'🦵',stat:'str'},
];
const CJ_JERK_PHASES=[
  {id:'dip',game:'hold',name:'預蹲',desc:'微蹲蓄力',emoji:'⬇️',stat:'stb'},
  {id:'drive',game:'mash',name:'上挺發力',desc:'腿推+手壓！',emoji:'💥',stat:'pwr'},
  {id:'split',game:'ring',name:'分腿/下蹲',desc:'快速分腿接槓',emoji:'🦵',stat:'tec'},
  {id:'lock',game:'hold',name:'鎖定站穩',desc:'穩定鎖住！',emoji:'🧘',stat:'stb'},
];

// ── Training Categories (expanded from real coaching data: 137 exercises in 14 categories) ──
const TRAIN_CATEGORIES=[
  // ═══ 基礎訓練 (unlock:0) ═══
  {
    id:'basics',name:'基礎訓練',icon:'🏋️',unlock:0,
    exercises:[
      {id:'squat',name:'深蹲 Squat',cost:20,primary:{str:3},secondary:{pwr:1},icon:'🦵',
        tip:'深蹲是舉重之王！',science:'強化股四頭肌和臀肌，站起來的核心力量。研究顯示國內選手站起階段比國際選手慢0.4秒，加強深蹲能縮短差距！'},
      {id:'frontSquat',name:'前蹲 Front Squat',cost:20,primary:{str:2},secondary:{tec:1},icon:'🏋️',
        tip:'前蹲模擬挺舉接槓位置。',science:'訓練挺舉上搏接槓後的站起能力。'},
      {id:'deadlift',name:'硬舉 Deadlift',cost:20,primary:{str:2},secondary:{stb:1},icon:'💪',
        tip:'鍛鍊後鏈肌群。',science:'背部和腿後側力量讓第一拉更穩定。'},
      {id:'press',name:'肩推 Overhead Press',cost:15,primary:{str:2},secondary:{stb:1},icon:'🙌',
        tip:'強化上肢推的力量。',science:'肩部穩定性對上挺鎖定至關重要。'},
    ]
  },
  // ═══ 抓舉技術 (unlock:0, expanded to 14) ═══
  {
    id:'snatch',name:'抓舉技術',icon:'🤸',unlock:0,
    exercises:[
      {id:'snatchDrill',name:'抓舉分解練習',cost:25,primary:{tec:3},secondary:{pwr:1},icon:'🤸',
        tip:'分解練習讓每個階段練到位！',science:'抓舉有6階段，分解練習專注改善每個環節。'},
      {id:'tcjs',name:'三次彈跳抓 TCJS',cost:25,primary:{tec:3},secondary:{pwr:2},icon:'🔥',
        tip:'王信淵教授研發的創新訓練法！',
        science:'研究證實：TCJS能讓初學者的槓鈴加速度提高（效果量g=3.79），同時減少槓鈴碰撞速度（g=6.39）。原理：三次彈跳啟動SSC伸展-收縮循環，讓發力更有效率，槓鈴軌跡更貼身！',
        isSpecial:true},
      {id:'hangSnatch',name:'懸垂抓舉 Hang Snatch',cost:22,primary:{tec:2},secondary:{pwr:2},icon:'🔄',
        tip:'從髖部位置開始的抓舉。',science:'專注訓練第二拉的發力和快速下蹲接槓。'},
      {id:'powerSnatch',name:'力量抓舉 Power Snatch',cost:22,primary:{pwr:2},secondary:{tec:2},icon:'⚡',
        tip:'不需要全蹲的抓舉。',science:'強調爆發力和拉的高度，適合爆發力訓練。'},
      {id:'deficitSnatch',name:'墊高抓舉 Deficit Snatch',cost:28,primary:{tec:2},secondary:{pwr:2,str:1},icon:'📏',
        tip:'站高台增加拉距。',science:'增加動作行程，強化起始位置力量。'},
      {id:'blockSnatch',name:'箱上抓舉 Block Snatch',cost:25,primary:{tec:2},secondary:{pwr:2},icon:'📦',
        tip:'從箱上起槓省去一拉。',science:'專注訓練過渡到發力階段的銜接。'},
      {id:'lowBlockSnatch',name:'低箱抓舉 Low Block Snatch',cost:25,primary:{tec:2},secondary:{str:1},icon:'🧱',
        tip:'低箱強化膝下起槓。',science:'加強膝蓋以下位置的拉力與節奏。'},
      {id:'hangSnatchAbove',name:'膝上懸垂抓 Hang Snatch above Knee',cost:22,primary:{tec:2},secondary:{pwr:1},icon:'🔼',
        tip:'從膝上直接發力抓。',science:'縮短行程專注發力點精準度。'},
      {id:'hangSnatchBelow',name:'膝下懸垂抓 Hang Snatch below Knee',cost:24,primary:{tec:2},secondary:{pwr:2},icon:'🔽',
        tip:'從膝下開始更具挑戰。',science:'強化過渡階段的位置控制能力。'},
      {id:'snatchWide',name:'寬站抓舉 Snatch Wide Feet',cost:25,primary:{tec:3},secondary:{stb:1},icon:'🦶',
        tip:'寬站距改變接槓策略。',science:'訓練不同站距的接槓穩定性。'},
      {id:'snatchCombo',name:'抓舉組合 Snatch Combo',cost:30,primary:{tec:3},secondary:{pwr:2,str:1},icon:'🔗',
        tip:'三合一組合超硬！',science:'連續不同位置抓舉訓練全面技術。'},
      {id:'snatchDeadliftCombo',name:'抓舉硬舉組合 Snatch DL+Snatch',cost:28,primary:{str:2},secondary:{tec:2},icon:'🔗',
        tip:'先硬舉再抓舉。',science:'結合拉力與技術的複合訓練。'},
      {id:'deficitSnatchDLCombo',name:'墊高硬舉+抓舉 Deficit Snatch DL+Snatch',cost:30,primary:{str:3},secondary:{tec:2},icon:'⬆️',
        tip:'墊高硬舉接抓舉極累。',science:'極限行程拉力配合全技術動作。'},
      {id:'noFeetSnatch',name:'不動腳抓舉 Power Snatch No Feet',cost:22,primary:{tec:3},secondary:{stb:1},icon:'🧍',
        tip:'腳不移動考驗平衡。',science:'強制練習精準垂直發力軌跡。'},
    ]
  },
  // ═══ 挺舉技術 (unlock:0, expanded to 16) ═══
  {
    id:'clean',name:'挺舉技術',icon:'🏅',unlock:0,
    exercises:[
      {id:'cleanJerkDrill',name:'挺舉練習',cost:25,primary:{tec:3},secondary:{str:1},icon:'🏅',
        tip:'上搏和上挺都要練！',science:'上搏用腿送槓到肩上，上挺腿推+手壓配合。'},
      {id:'hangClean',name:'懸垂上搏 Hang Clean',cost:22,primary:{tec:2},secondary:{str:2},icon:'🔄',
        tip:'從髖部開始的上搏。',science:'強化發力點的精準度和接槓穩定性。'},
      {id:'powerClean',name:'力量上搏 Power Clean',cost:22,primary:{pwr:2},secondary:{str:2},icon:'💥',
        tip:'不全蹲的上搏，強調爆發。',science:'適合爆發力和速度訓練。'},
      {id:'jerkDrill',name:'架上挺舉 Jerk from Rack',cost:20,primary:{tec:2},secondary:{pwr:2},icon:'🚀',
        tip:'專注練上挺動作。',science:'從架上開始，專注訓練分腿或下蹲挺的技術。'},
      {id:'hangCleanBelow',name:'膝下懸垂上搏 Hang Clean below Knee',cost:24,primary:{tec:2},secondary:{str:2},icon:'🔽',
        tip:'從膝下開始更難控制。',science:'強化過渡階段拉力和接槓節奏。'},
      {id:'hangCleanAbove',name:'膝上懸垂上搏 Hang Power Clean above Knee',cost:22,primary:{pwr:2},secondary:{tec:1},icon:'🔼',
        tip:'膝上快速發力上搏。',science:'縮短行程訓練爆發力時機。'},
      {id:'deficitClean',name:'墊高上搏 Deficit Clean',cost:28,primary:{str:3},secondary:{tec:1},icon:'📏',
        tip:'站高台增加拉程。',science:'增加動作行程強化起始力量。'},
      {id:'blockClean',name:'箱上上搏 Block Clean',cost:25,primary:{tec:2},secondary:{pwr:1},icon:'📦',
        tip:'從箱上專練過渡段。',science:'專注膝上到發力點的銜接技術。'},
      {id:'lowBlockClean',name:'低箱上搏 Low Block Clean',cost:25,primary:{tec:2},secondary:{str:1},icon:'🧱',
        tip:'低箱強化低位拉力。',science:'強化膝下起槓的力量與姿勢。'},
      {id:'cleanWide',name:'寬站上搏 Clean Wide Feet',cost:25,primary:{tec:2},secondary:{stb:1},icon:'🦶',
        tip:'寬站距訓練接槓穩定。',science:'不同站距提升接槓適應力。'},
      {id:'cleanFSJerk',name:'上搏+前蹲+上挺 Clean+FS+Jerk',cost:35,primary:{str:2},secondary:{tec:2,pwr:2},icon:'🔗',
        tip:'三合一極限組合訓練。',science:'模擬完整比賽動作的連續訓練。'},
      {id:'cleanPushPress',name:'上搏+推舉 Clean+Push Press',cost:28,primary:{str:2},secondary:{pwr:2},icon:'💪',
        tip:'上搏接推舉練力量。',science:'結合拉與推的綜合力量訓練。'},
      {id:'cleanPushJerk',name:'上搏+推挺 Clean+Push Jerk',cost:30,primary:{tec:2},secondary:{pwr:2},icon:'🚀',
        tip:'上搏接推挺練連貫性。',science:'訓練上搏與上挺的銜接節奏。'},
      {id:'deficitCleanDL',name:'墊高硬舉+上搏 Deficit Clean DL+Clean',cost:30,primary:{str:3},secondary:{tec:1},icon:'⬆️',
        tip:'墊高硬舉再接上搏。',science:'極限行程拉力配合上搏技術。'},
      {id:'cleanCombo',name:'上搏組合 Clean Combo',cost:32,primary:{tec:3},secondary:{str:2},icon:'🔗',
        tip:'多位置組合超有挑戰。',science:'連續不同位置上搏全面強化。'},
      {id:'noFeetClean',name:'不動腳上搏 Power Clean No Feet',cost:22,primary:{tec:3},secondary:{stb:1},icon:'🧍',
        tip:'腳不動強迫垂直發力。',science:'矯正發力方向偏移問題。'},
    ]
  },
  // ═══ 拉力訓練 (unlock:10, expanded to 13) ═══
  {
    id:'pull',name:'拉力訓練',icon:'⬆️',unlock:10,
    exercises:[
      {id:'snatchPull',name:'抓舉拉 Snatch Pull',cost:20,primary:{str:2},secondary:{pwr:2},icon:'⬆️',
        tip:'用抓舉握法的拉力訓練。',science:'能用比抓舉更重的重量訓練拉的力量和軌跡。'},
      {id:'cleanPull',name:'上搏拉 Clean Pull',cost:20,primary:{str:2},secondary:{pwr:2},icon:'⬆️',
        tip:'用上搏握法的拉力訓練。',science:'強化從地面到發力點的整個拉的軌跡。'},
      {id:'slowPull',name:'慢速拉 Slow Pull (6秒)',cost:18,primary:{tec:2},secondary:{str:2},icon:'🐌',
        tip:'用6秒慢慢拉，感受每個位置。',science:'慢速拉強化位置感知和控制力，糾正動作偏差。'},
      {id:'deficitPull',name:'墊高拉 Deficit Pull',cost:22,primary:{str:3},secondary:{pwr:1},icon:'📏',
        tip:'站在墊子上增加動作範圍。',science:'增加第一拉的距離，強化起始位置的力量。'},
      {id:'stiffSnatchPull',name:'直腿抓舉拉 Stiff-Legged Snatch Pull',cost:20,primary:{str:2},secondary:{rec:1},icon:'🦵',
        tip:'直腿拉強化後鏈。',science:'鍛鍊腿後側與下背的連結力量。'},
      {id:'stiffCleanPull',name:'直腿上搏拉 Stiff-Legged Clean Pull',cost:20,primary:{str:2},secondary:{rec:1},icon:'🦵',
        tip:'窄握直腿拉更練背。',science:'上搏握法的直腿拉強化背部。'},
      {id:'snatchPullPause',name:'停頓抓舉拉 Snatch Pull 3sec Pause',cost:22,primary:{tec:2},secondary:{str:2},icon:'⏸️',
        tip:'停頓3秒感受位置。',science:'靜態停頓強化特定角度控制力。'},
      {id:'cleanPullPause',name:'停頓上搏拉 Clean Pull 3sec Pause',cost:22,primary:{tec:2},secondary:{str:2},icon:'⏸️',
        tip:'停頓強化膝上控制。',science:'強化過渡階段的位置精準度。'},
      {id:'blockSnatchPull',name:'箱上抓舉拉 Block Snatch Pull',cost:20,primary:{str:2},secondary:{pwr:1},icon:'📦',
        tip:'箱上起拉專練上半程。',science:'從箱上訓練發力段的拉力。'},
      {id:'blockCleanPull',name:'箱上上搏拉 Block Clean Pull',cost:20,primary:{str:2},secondary:{pwr:1},icon:'📦',
        tip:'箱上搏握拉練過渡。',science:'專練膝上到髖部的拉力軌跡。'},
      {id:'deficitStiffPull',name:'墊高直腿拉 Deficit Stiff-Legged Pull',cost:24,primary:{str:3},secondary:{rec:1},icon:'📐',
        tip:'墊高加直腿超有感。',science:'極限行程直腿拉全面強化後鏈。'},
      {id:'mediumGripPull',name:'中握拉 Medium Grip Pull',cost:18,primary:{str:2},secondary:{tec:1},icon:'🤲',
        tip:'中等握距訓練拉力。',science:'不同握距刺激不同肌群參與。'},
      {id:'mediumGripDL',name:'中握硬舉 Medium Grip Deadlift+Pull',cost:20,primary:{str:2},secondary:{pwr:1},icon:'🤲',
        tip:'中握硬舉加拉組合。',science:'結合硬舉與拉的複合訓練。'},
    ]
  },
  // ═══ 爆發力 (unlock:0) ═══
  {
    id:'explosive',name:'爆發力',icon:'⚡',unlock:0,
    exercises:[
      {id:'plyometric',name:'增強式跳躍訓練',cost:15,primary:{pwr:3},secondary:{},icon:'⚡',
        tip:'跳躍訓練提升SSC爆發力！',science:'增強式訓練直接訓練SSC伸展-收縮循環。'},
      {id:'boxJump',name:'跳箱 Box Jump',cost:12,primary:{pwr:2},secondary:{stb:1},icon:'📦',
        tip:'跳上高箱子訓練下肢爆發。',science:'模擬舉重中快速伸展三關節的動作模式。'},
      {id:'sqJump',name:'深蹲跳 Squat Jump',cost:15,primary:{pwr:2},secondary:{str:1},icon:'🦘',
        tip:'負重深蹲後跳起。',science:'結合力量和速度，直接提升發力能力。'},
    ]
  },
  // ═══ 輔助訓練 (unlock:15, expanded to 14) ═══
  {
    id:'accessory',name:'輔助訓練',icon:'🔧',unlock:15,
    exercises:[
      {id:'pullUp',name:'引體向上 Pull Up',cost:12,primary:{str:2},secondary:{},icon:'💪',
        tip:'上肢拉的基礎訓練。',science:'強化背闊肌和手臂，幫助拉的階段。'},
      {id:'benchPress',name:'臥推 Bench Press',cost:15,primary:{str:2},secondary:{pwr:1},icon:'🏋️',
        tip:'上肢推的力量訓練。',science:'增強胸部和三頭肌力量，幫助上挺鎖定。'},
      {id:'hyperext',name:'背伸展 Hyperextension',cost:10,primary:{str:1},secondary:{rec:1},icon:'🔙',
        tip:'保護脊椎的背部訓練。',science:'強化下背部肌肉，預防受傷。'},
      {id:'grip',name:'握力訓練 Grip Training',cost:8,primary:{str:1},secondary:{stb:1},icon:'✊',
        tip:'握不住槓什麼都白搭！',science:'握力是舉重的基本門檻，握力不夠一切免談。'},
      {id:'sitUp',name:'仰臥起坐 Sit Up',cost:8,primary:{sta:1},secondary:{stb:1},icon:'🔄',
        tip:'核心穩定的基礎。',science:'強化腹肌維持軀幹穩定性。'},
      {id:'jumps',name:'連續跳 Jumps',cost:10,primary:{pwr:2},secondary:{},icon:'🦘',
        tip:'連續跳練彈性反射。',science:'訓練SSC的反覆利用能力。'},
      {id:'platetwist',name:'轉體 Standing Plate Twist',cost:8,primary:{stb:1},secondary:{str:1},icon:'🔁',
        tip:'旋轉核心抗扭力。',science:'強化核心旋轉穩定性。'},
      {id:'dips',name:'雙槓下撐 Dips',cost:12,primary:{str:2},secondary:{},icon:'🤸',
        tip:'三頭和胸肌都練到。',science:'上肢推力的輔助動作。'},
      {id:'frenchPress',name:'法式彎舉 French Press',cost:10,primary:{str:1},secondary:{pwr:1},icon:'💪',
        tip:'三頭肌孤立訓練。',science:'強化上挺鎖定的手臂力量。'},
      {id:'overheadPress2',name:'肩推 Overhead Press',cost:15,primary:{str:2},secondary:{},icon:'🙌',
        tip:'站姿肩推練穩定。',science:'肩部力量與穩定性的關鍵訓練。'},
      {id:'snatchPress',name:'抓舉握推 Snatch Press',cost:15,primary:{tec:1},secondary:{str:1},icon:'🏋️',
        tip:'寬握推舉練肩活動度。',science:'改善抓舉握法的肩部柔軟度。'},
      {id:'staticHold',name:'靜態半蹲 Static Hold',cost:10,primary:{str:2},secondary:{stb:1},icon:'🧊',
        tip:'定住不動練等長肌力。',science:'等長收縮訓練特定角度力量。'},
      {id:'stepTraining',name:'階梯訓練 Step Training',cost:12,primary:{sta:1},secondary:{pwr:1},icon:'🪜',
        tip:'上下階梯練心肺。',science:'提升有氧耐力和下肢功能。'},
      {id:'gripTraining2',name:'握力進階 Advanced Grip',cost:10,primary:{str:1},secondary:{stb:1},icon:'✊',
        tip:'進階握力挑戰極限。',science:'更高難度的握力強化訓練。'},
    ]
  },
  // ═══ 技術暖身操 (unlock:20, expanded to 16) ═══
  {
    id:'technical',name:'技術暖身操',icon:'🧘',unlock:20,
    exercises:[
      {id:'muscleSnatch',name:'肌力抓 Muscle Snatch',cost:12,primary:{tec:2},secondary:{str:1},icon:'💫',
        tip:'不下蹲的抓舉，純靠手臂力量。',science:'訓練翻轉接槓的手臂路徑和時機。'},
      {id:'snatchBalance',name:'抓舉平衡 Snatch Balance',cost:15,primary:{tec:3},secondary:{stb:1},icon:'⚖️',
        tip:'從肩後快速下蹲接槓。',science:'專門訓練快速下蹲和頭上穩定性，是抓舉的關鍵技術。'},
      {id:'overheadSquat',name:'過頭深蹲 Overhead Squat',cost:18,primary:{tec:2},secondary:{stb:2},icon:'🙆',
        tip:'舉著槓鈴做深蹲。',science:'測試和訓練全身柔軟度和穩定性，抓舉的基礎能力。'},
      {id:'muscleSnatchPressOHS',name:'肌力抓+推+過頭蹲 Muscle Snatch+Press+OHS',cost:20,primary:{tec:3},secondary:{stb:1},icon:'🔗',
        tip:'三合一暖身組合。',science:'完整上肢活動度暖身序列。'},
      {id:'muscleSnatchBalance',name:'肌力抓+平衡 Muscle Snatch+Balance',cost:18,primary:{tec:3},secondary:{},icon:'⚖️',
        tip:'肌力抓接平衡下蹲。',science:'銜接翻轉與下蹲的技術練習。'},
      {id:'contactSnatchBalance',name:'發力肌力抓+平衡 Contact Muscle Snatch+Balance',cost:20,primary:{tec:3},secondary:{pwr:1},icon:'💫',
        tip:'加入髖部觸碰發力。',science:'結合發力與快速下蹲的進階練習。'},
      {id:'hipSnatchBalance',name:'髖抓舉平衡 Hip Snatch Balance',cost:15,primary:{tec:2},secondary:{stb:1},icon:'⚖️',
        tip:'髖部發力接平衡。',science:'專注髖部發力點與接槓的銜接。'},
      {id:'continuousSnatchWide',name:'連續寬站抓 Continuous Snatch Wide',cost:22,primary:{tec:2},secondary:{pwr:2},icon:'🔁',
        tip:'不停歇連續做。',science:'連續動作訓練節奏和耐力。'},
      {id:'hangSnatchPullCont',name:'連續懸垂抓舉拉 Hang Snatch Pull Continuous',cost:20,primary:{str:2},secondary:{tec:1},icon:'🔁',
        tip:'連續懸垂拉練節奏。',science:'反覆拉力強化肌肉記憶。'},
      {id:'muscleSnatchOHS',name:'肌力抓+過頭蹲 Muscle Snatch+OHS',cost:20,primary:{tec:2},secondary:{stb:1},icon:'💫',
        tip:'肌力抓直接接過頭蹲。',science:'上肢穩定性的進階暖身。'},
      {id:'muscleClean',name:'肌力上搏 Muscle Clean No Contact',cost:15,primary:{tec:2},secondary:{str:1},icon:'🏅',
        tip:'不接觸髖的上搏練臂。',science:'純手臂翻轉訓練接槓路徑。'},
      {id:'hangMuscleCleanWide',name:'寬站懸垂肌力上搏 Hang Muscle Clean Wide',cost:18,primary:{tec:2},secondary:{pwr:1},icon:'🦶',
        tip:'寬站懸垂肌力上搏。',science:'訓練寬站距的接槓穩定策略。'},
      {id:'continuousHangClean',name:'連續懸垂膝下上搏 Continuous Hang Clean below Knee',cost:22,primary:{tec:2},secondary:{str:2},icon:'🔁',
        tip:'連續做不停強化耐力。',science:'連續反覆強化技術和肌耐力。'},
      {id:'backSquatJump',name:'後蹲跳 Back Squat Jump',cost:15,primary:{pwr:3},secondary:{},icon:'🦘',
        tip:'負重蹲跳超有爆發力。',science:'負重跳躍直接提升爆發力。'},
      {id:'goodMorning',name:'早安式 Good Morning',cost:12,primary:{str:2},secondary:{rec:1},icon:'🌅',
        tip:'強化後鏈預防受傷。',science:'訓練髖鉸鏈和下背肌群。'},
      {id:'narrowMuscleSnatch',name:'窄握肌力抓 Narrow Grip Muscle Snatch',cost:15,primary:{tec:2},secondary:{str:1},icon:'🤏',
        tip:'窄握增加翻轉難度。',science:'不同握距刺激手臂翻轉路徑。'},
    ]
  },
  // ═══ 恢復 (unlock:0) ═══
  {
    id:'recovery',name:'恢復',icon:'😴',unlock:0,
    exercises:[
      {id:'rest',name:'休息恢復',cost:0,primary:{},secondary:{rec:1},icon:'😴',isRest:true,
        tip:'休息和訓練一樣重要！',science:'肌肉是在恢復時生長的！過度訓練會受傷和退步。'},
      {id:'flexibility',name:'柔軟度訓練',cost:10,primary:{tec:1},secondary:{rec:1},icon:'🧘',
        tip:'好的柔軟度讓你蹲更深更穩！',science:'研究發現國際選手的踝關節角度比國內選手大。'},
      {id:'mental',name:'心理訓練/想像練習',cost:10,primary:{stb:3},secondary:{},icon:'🧠',
        tip:'比賽時心理素質決定成敗！',science:'想像練習能強化神經肌肉連結，維持比賽技術水準。'},
    ]
  },
  // ═══ 前蹲系列 (NEW, unlock:10, 7 exercises) ═══
  {
    id:'frontSquatSeries',name:'前蹲系列',icon:'🦵',unlock:10,
    exercises:[
      {id:'frontHalfSquat',name:'前半蹲 Half Front Squat',cost:15,primary:{str:2},secondary:{},icon:'🦵',
        tip:'半蹲練站起最難角度。',science:'針對站起死點的專項力量。'},
      {id:'frontBoxSquat',name:'前箱蹲 Front Box Squat',cost:18,primary:{str:2},secondary:{stb:1},icon:'📦',
        tip:'坐到箱上消除反彈。',science:'消除SSC反射強化純肌力。'},
      {id:'jerkDrive',name:'上挺驅動 Jerk Drive',cost:15,primary:{pwr:2},secondary:{str:1},icon:'🚀',
        tip:'短行程爆發力驅動。',science:'訓練上挺起始的腿部驅動力。'},
      {id:'frontSquatPause',name:'停頓前蹲 Front Squat 3sec Pause',cost:22,primary:{str:3},secondary:{stb:1},icon:'⏸️',
        tip:'底部停3秒超有感。',science:'靜態停頓消除反彈強化底部力量。'},
      {id:'frontSquatJerk',name:'前蹲+上挺 Front Squat+Jerk',cost:30,primary:{str:2},secondary:{pwr:2},icon:'🔗',
        tip:'蹲完直接挺超硬。',science:'模擬上搏站起後接上挺的比賽節奏。'},
      {id:'frontSquatPushPress',name:'前蹲+推舉 Front Squat+Push Press',cost:28,primary:{str:2},secondary:{pwr:1},icon:'💪',
        tip:'蹲完推舉練連貫。',science:'結合下肢蹲與上肢推的複合訓練。'},
      {id:'frontSquatPushJerk',name:'前蹲+推挺 Front Squat+Push Jerk',cost:30,primary:{str:2},secondary:{pwr:2,tec:1},icon:'🚀',
        tip:'前蹲接推挺全身整合。',science:'完整模擬挺舉後半段動作序列。'},
    ]
  },
  // ═══ 後蹲系列 (NEW, unlock:10, 7 exercises) ═══
  {
    id:'backSquatSeries',name:'後蹲系列',icon:'🏋️',unlock:10,
    exercises:[
      {id:'halfSquat',name:'半蹲 Half Squat',cost:15,primary:{str:2},secondary:{},icon:'🦵',
        tip:'半蹲可以上更大重量。',science:'針對站起死點角度的專項力量。'},
      {id:'boxSquat',name:'箱蹲 Box Squat',cost:18,primary:{str:2},secondary:{stb:1},icon:'📦',
        tip:'坐箱消除彈性勢能。',science:'消除底部反彈訓練純粹肌力。'},
      {id:'backRackDrive',name:'後架驅動 Back Rack Drive',cost:15,primary:{pwr:2},secondary:{},icon:'🚀',
        tip:'後架短行程爆發。',science:'訓練短行程快速驅動能力。'},
      {id:'squatPause',name:'停頓深蹲 Squat 3sec Pause',cost:22,primary:{str:3},secondary:{stb:1},icon:'⏸️',
        tip:'底部停頓超有挑戰。',science:'消除反射強化底部死點力量。'},
      {id:'squatJerk',name:'深蹲+上挺 Squat+Jerk',cost:30,primary:{str:2},secondary:{pwr:2},icon:'🔗',
        tip:'蹲完直接挺很硬核。',science:'極限複合訓練挑戰全身整合。'},
      {id:'squatPushPress',name:'深蹲+推舉 Squat+Push Press',cost:28,primary:{str:2},secondary:{pwr:1},icon:'💪',
        tip:'蹲完推舉練全身力。',science:'結合大腿與肩部的複合力量。'},
      {id:'squatPushJerk',name:'深蹲+推挺 Squat+Push Jerk',cost:30,primary:{str:2},secondary:{pwr:2},icon:'🚀',
        tip:'後蹲加推挺超全面。',science:'全身力量與爆發力的極限複合。'},
    ]
  },
  // ═══ 力量抓舉系列 (NEW, unlock:15, 6 exercises) ═══
  {
    id:'powerSnatchSeries',name:'力量抓舉系列',icon:'⚡',unlock:15,
    exercises:[
      {id:'powerSnatchOHS',name:'力量抓舉+過頭蹲 Power Snatch+OHS',cost:28,primary:{pwr:2},secondary:{tec:2},icon:'⚡',
        tip:'力抓接過頭蹲連貫。',science:'結合爆發力與穩定性訓練。'},
      {id:'hangPowerSnatch',name:'懸垂力量抓舉 Hang Power Snatch',cost:22,primary:{pwr:2},secondary:{tec:1},icon:'🔄',
        tip:'懸垂起直接力量抓。',science:'專注訓練發力段的爆發力。'},
      {id:'belowKneePowerSnatch',name:'膝下力量抓舉 Power Snatch below Knee',cost:24,primary:{pwr:2},secondary:{str:1},icon:'🔽',
        tip:'膝下起動難度更高。',science:'增加拉程強化全程爆發力。'},
      {id:'snatchDLPowerSnatch',name:'抓舉硬舉+力量抓 Snatch DL+Power Snatch',cost:26,primary:{str:2},secondary:{pwr:2},icon:'🔗',
        tip:'先硬舉再力量抓。',science:'複合訓練結合力量與爆發。'},
      {id:'deficitPowerSnatch',name:'墊高力量抓舉 Deficit Power Snatch',cost:28,primary:{pwr:2},secondary:{str:2},icon:'📏',
        tip:'墊高增加行程更難。',science:'極限行程的爆發力訓練。'},
      {id:'blockPowerSnatch',name:'箱上力量抓舉 Block Power Snatch',cost:24,primary:{pwr:2},secondary:{tec:1},icon:'📦',
        tip:'箱上起槓練過渡爆發。',science:'從箱上專練發力段的爆發力。'},
    ]
  },
  // ═══ 力量上搏系列 (NEW, unlock:15, 8 exercises) ═══
  {
    id:'powerCleanSeries',name:'力量上搏系列',icon:'💥',unlock:15,
    exercises:[
      {id:'powerCleanFS',name:'力量上搏+前蹲 Power Clean+FS',cost:28,primary:{pwr:2},secondary:{str:2},icon:'💥',
        tip:'力搏加前蹲雙重練。',science:'結合爆發力與蹲起力量。'},
      {id:'powerCleanFSJerk',name:'力量上搏+前蹲+上挺 Power Clean+FS+Jerk',cost:35,primary:{pwr:2},secondary:{str:2,tec:1},icon:'🔗',
        tip:'三合一極致複合動作。',science:'模擬完整挺舉動作的爆發版。'},
      {id:'hangPowerClean',name:'懸垂力量上搏 Hang Power Clean',cost:22,primary:{pwr:2},secondary:{str:1},icon:'🔄',
        tip:'懸垂起接力量上搏。',science:'專注發力點爆發與接槓速度。'},
      {id:'belowKneePowerClean',name:'膝下力量上搏 Power Clean below Knee',cost:24,primary:{pwr:2},secondary:{str:1},icon:'🔽',
        tip:'膝下起搏更有挑戰。',science:'增加行程訓練全程爆發力。'},
      {id:'cleanDLPowerClean',name:'上搏硬舉+力量上搏 Clean DL+Power Clean',cost:26,primary:{str:2},secondary:{pwr:2},icon:'🔗',
        tip:'硬舉接力搏強化拉力。',science:'複合拉力結合爆發上搏。'},
      {id:'deficitPowerClean',name:'墊高力量上搏 Deficit Power Clean',cost:28,primary:{str:3},secondary:{pwr:1},icon:'📏',
        tip:'墊高搏最練起始力。',science:'極限行程強化第一拉力量。'},
      {id:'blockPowerClean',name:'箱上力量上搏 Block Power Clean',cost:24,primary:{pwr:2},secondary:{tec:1},icon:'📦',
        tip:'箱上起搏練過渡爆發。',science:'專練膝上到髖部的爆發銜接。'},
      {id:'noFeetPowerClean',name:'不動腳力量上搏 Power Clean No Feet',cost:22,primary:{tec:2},secondary:{pwr:2},icon:'🧍',
        tip:'腳不動練垂直發力。',science:'矯正發力方向偏移的進階練習。'},
    ]
  },
  // ═══ 架上系列 (NEW, unlock:20, 9 exercises) ═══
  {
    id:'rackWork',name:'架上系列',icon:'🗄️',unlock:20,
    exercises:[
      {id:'rackJerk',name:'架上上挺 Jerk from Rack',cost:20,primary:{pwr:2},secondary:{tec:2},icon:'🚀',
        tip:'架上專練上挺技術。',science:'省去上搏專注上挺發力與分腿。'},
      {id:'rackPushPress',name:'架上推舉 Front Rack Push Press',cost:18,primary:{str:2},secondary:{pwr:1},icon:'💪',
        tip:'架上推舉練推力。',science:'訓練腿驅動加肩推的力量。'},
      {id:'rackPushJerk',name:'架上推挺 Push Jerk from Rack',cost:20,primary:{pwr:2},secondary:{tec:1},icon:'🚀',
        tip:'推挺是上挺的基礎。',science:'訓練腿驅動與手臂推接的時機。'},
      {id:'shoulderPress',name:'架上肩推 Shoulder Press from Rack',cost:15,primary:{str:2},secondary:{stb:1},icon:'🙌',
        tip:'嚴格肩推不借力。',science:'純上肢推力強化三角肌力量。'},
      {id:'backRackJerk',name:'後架上挺 Back Rack Jerk',cost:22,primary:{pwr:2},secondary:{str:1},icon:'🔙',
        tip:'後架更能練大重量。',science:'後架位置允許更大負荷的上挺。'},
      {id:'backRackPushJerk',name:'後架推挺 Back Rack Push Jerk',cost:22,primary:{pwr:2},secondary:{str:1},icon:'🔙',
        tip:'後架推挺練驅動力。',science:'後架位置訓練驅動與推接。'},
      {id:'snatchGripPress',name:'抓舉握肩推 Snatch Grip Press',cost:18,primary:{tec:2},secondary:{str:1},icon:'🏋️',
        tip:'寬握推舉練肩活動度。',science:'改善寬握位的肩部穩定與力量。'},
      {id:'snatchBalanceRack',name:'架上抓舉平衡 Snatch Balance',cost:20,primary:{tec:3},secondary:{stb:1},icon:'⚖️',
        tip:'架上起做平衡更穩。',science:'從架上開始專注下蹲接槓穩定。'},
      {id:'snatchGripPressOHS',name:'抓舉握推+過頭蹲 Snatch Press+OHS',cost:25,primary:{tec:2},secondary:{stb:2},icon:'🔗',
        tip:'寬握推接過頭蹲。',science:'全面強化抓舉握法的上肢穩定。'},
    ]
  },
];
const TRAIN=TRAIN_CATEGORIES.flatMap(cat=>cat.exercises);

const EVENTS=[
  {id:1,name:'校內比賽',unlock:'初始可參加',reqLv:0,diff:0.5,prize:100,emoji:'🏫',desc:'你的第一場比賽！不要緊張，享受過程。'},
  {id:2,name:'縣市錦標賽',unlock:'校內賽前三名',reqLv:1,diff:0.65,prize:300,emoji:'🏛️',desc:'代表學校出戰！競爭更激烈了。'},
  {id:3,name:'全國錦標賽',unlock:'縣市賽前三名',reqLv:2,diff:0.78,prize:800,emoji:'🇹🇼',desc:'全國最強的選手都在這裡！'},
  {id:4,name:'亞洲錦標賽',unlock:'全國賽冠軍',reqLv:3,diff:0.88,prize:2000,emoji:'🌏',desc:'走向國際舞台！亞洲強手如雲。'},
  {id:5,name:'世界錦標賽',unlock:'亞錦賽獎牌',reqLv:4,diff:0.94,prize:5000,emoji:'🌍',desc:'世界頂尖水準的較量！'},
  {id:6,name:'奧運會',unlock:'達奧運標準',reqLv:5,diff:0.98,prize:20000,emoji:'🏟️',desc:'你的終極目標！全世界都在看！'},
];

const SN={str:'力量',tec:'技術',pwr:'爆發力',stb:'穩定性',sta:'體力',rec:'恢復'};
const SI={str:'💪',tec:'🎯',pwr:'⚡',stb:'🧠',sta:'❤️',rec:'💚'};
const SC={str:'#ef7d57',tec:'#3b5dc9',pwr:'#f4d03f',stb:'#b13e53',sta:'#38b764',rec:'#73eff7'};

const SHOP=[
  {id:'protein',name:'蛋白粉',desc:'訓練效果+20%（3天）',price:200,effect:{type:'trainBoost',value:1.2,dur:3},icon:'🥤',tip:'訓練後30分鐘內補充蛋白質效果最好！'},
  {id:'tape',name:'護腕繃帶',desc:'比賽穩定性+5',price:150,effect:{type:'compBoost',stat:'stb',value:5},icon:'🩹',tip:'保護手腕關節，放心挑戰大重量。'},
  {id:'shoes',name:'舉重鞋',desc:'技術永久+3',price:600,effect:{type:'perm',stat:'tec',value:3},icon:'👟',tip:'硬底墊高腳跟，讓你蹲得更深更穩。研究證實踝關節活動度對接槓品質至關重要！'},
  {id:'belt',name:'舉重腰帶',desc:'力量永久+3',price:600,effect:{type:'perm',stat:'str',value:3},icon:'🥋',tip:'增加腹內壓，保護脊椎，安全挑戰大重量。'},
  {id:'drink',name:'能量飲料',desc:'恢復40體力',price:80,effect:{type:'sta',value:40},icon:'🧃',tip:'補充電解質，但記得水才是最好的飲料！'},
  {id:'charm',name:'幸運護符',desc:'比賽運氣+3%',price:1200,effect:{type:'luck',value:3},icon:'🍀',tip:'運氣是留給準備好的人！'},
  {id:'book',name:'教練秘笈',desc:'所有屬性+1',price:800,effect:{type:'allBoost',value:1},icon:'📖',tip:'學無止境！書中有前輩們累積的智慧。'},
  {id:'video',name:'國際賽影片分析',desc:'技術+2、穩定+1',price:400,effect:{type:'multi',stats:{tec:2,stb:1}},icon:'📹',tip:'觀看國際選手的比賽影片，分析他們的技術是進步的捷徑！注意他們的槓鈴軌跡和節奏。'},
  {id:'singlet',name:'比賽連身衣(基本)',desc:'開啟連身衣商店',price:0,effect:{type:'none'},icon:'👔',tip:'去商店選購更多款式！'},
  {id:'kneeSleeves',name:'護膝套',desc:'保護膝蓋，深蹲更穩',price:300,effect:{type:'perm',stat:'stb',value:2},icon:'🦵',tip:'護膝能保護膝關節，讓你更安心地蹲'},
  {id:'chalk',name:'止滑粉',desc:'握力提升！不怕手滑',price:100,effect:{type:'perm',stat:'str',value:1},icon:'🤍',tip:'止滑粉（碳酸鎂）能增加摩擦力，是舉重必備品'},
];

const SINGLETS=[
  {id:'basic_blue',name:'基本藍',desc:'基礎訓練用',price:0,body:'#1565c0',stripe:'#ffffff',stripeType:'diagonal'},
  {id:'taiwan_red',name:'台灣紅',desc:'代表台灣出賽！',price:300,body:'#c62828',stripe:'#ffffff',stripeType:'horizontal'},
  {id:'gold_champion',name:'冠軍金',desc:'王者的象徵',price:800,body:'#1a237e',stripe:'#f4d03f',stripeType:'diagonal'},
  {id:'tiger_orange',name:'猛虎橘',desc:'像老虎一樣兇猛',price:500,body:'#e65100',stripe:'#000000',stripeType:'vstripe'},
  {id:'dragon_black',name:'黑龍',desc:'低調霸氣',price:600,body:'#212121',stripe:'#c62828',stripeType:'diagonal'},
  {id:'sakura_pink',name:'櫻花粉',desc:'可愛又有力',price:400,body:'#e91e63',stripe:'#ffffff',stripeType:'horizontal'},
  {id:'forest_green',name:'森林綠',desc:'自然的力量',price:350,body:'#2e7d32',stripe:'#f4d03f',stripeType:'vstripe'},
  {id:'thunder_purple',name:'雷電紫',desc:'電光石火',price:700,body:'#6a1b9a',stripe:'#ffeb3b',stripeType:'diagonal'},
];

const COACH_TIPS=[
  {text:'槓鈴要貼身！',principle:'near'},
  {text:'動作要快！',principle:'fast'},
  {text:'蹲越低越好！',principle:'low'},
  {text:'發力要準！',principle:'accurate'},
  {text:'站穩不晃！',principle:'stable'},
  {text:'別急著加重量'},
  {text:'SSC像彈簧！'},
  {text:'每天進步一點'},
  {text:'TCJS超有效！'},
  {text:'雙屈膝是精髓'},
  {text:'組間要休息'},
  {text:'暖身很重要！'},
  {text:'記錄訓練日誌'},
  {text:'比賽前深呼吸'},
  {text:'和隊友互相鼓勵'},
  {text:'吃好睡好！'},
];

const EVENTS_RANDOM=[
  {text:'昨晚睡得特別好！',effect:'sta',value:15,emoji:'😊'},
  {text:'下雨天在室內加練，心情不錯！',effect:'stb',value:1,emoji:'🌧️'},
  {text:'學弟學妹來加油，超有動力！',effect:'stb',value:1,emoji:'🤩'},
  {text:'教練送你一份蛋白質點心！',effect:'money',value:100,emoji:'🎁'},
  {text:'今天感覺狀態超好！',effect:'str_t',value:3,emoji:'💪'},
  {text:'看了TCJS的研究論文，好興奮！',effect:'tec_t',value:2,emoji:'📚'},
  {text:'和國手一起訓練了！學到好多！',effect:'all_t',value:1,emoji:'🌟'},
  {text:'做了很棒的伸展，身體超輕鬆。',effect:'rec',value:1,emoji:'🧘'},
  {text:'在YouTube看到自己的技術影片分析！',effect:'tec',value:1,emoji:'📹'},
  {text:'有教練來觀察你的訓練！',effect:'stb',value:2,emoji:'👀'},
];

const STORY_EVENTS=[
  {id:'start',trigger:'day',value:1,text:'第一天！教練說：準備好了嗎？',emoji:'🧑‍🏫'},
  {id:'train10',trigger:'trains',value:10,text:'練了10次了！身體開始有變化💪',emoji:'😤'},
  {id:'train30',trigger:'trains',value:30,text:'動作越來越熟練了！',emoji:'🌟'},
  {id:'firstComp',trigger:'comps',value:1,text:'第一場比賽！緊張嗎？',emoji:'😰'},
  {id:'firstMedal',trigger:'medals',value:1,text:'第一面獎牌！夢想開始了！',emoji:'🥇'},
  {id:'national',trigger:'eventLevel',value:2,text:'代表出戰全國賽！',emoji:'🇹🇼'},
  {id:'asian',trigger:'eventLevel',value:3,text:'站上國際舞台！亞洲賽！',emoji:'🌏'},
  {id:'world',trigger:'eventLevel',value:4,text:'世界錦標賽！全世界都在看！',emoji:'🌍'},
  {id:'olympic',trigger:'eventLevel',value:5,text:'奧運！你的終極目標就在眼前！',emoji:'🏟️'},
  {id:'injury1',trigger:'fatigue',value:70,text:'身體在抗議了...要注意休息',emoji:'🤕'},
  {id:'streak7',trigger:'streak',value:7,text:'七天不間斷！超有毅力！',emoji:'🔥'},
  {id:'rich',trigger:'money',value:3000,text:'存了不少錢呢！',emoji:'💰'},
  {id:'day100',trigger:'day',value:100,text:'100天了！回頭看你進步好多',emoji:'📅'},
  {id:'day365',trigger:'day',value:365,text:'一年了！你已經不是當初的自己',emoji:'🎂'},
  {id:'allStats30',trigger:'custom',check:'Object.values(c.stats).every(v=>v>=30)',text:'全能力30+！基礎扎實！',emoji:'⚖️'},
  {id:'str50',trigger:'custom',check:'c.stats.str>=50',text:'力量破50！越來越強了',emoji:'💪'},
  {id:'tec50',trigger:'custom',check:'c.stats.tec>=50',text:'技術破50！動作越來越漂亮',emoji:'🎯'},
  {id:'olympicGold',trigger:'custom',check:"c.medals.some(m=>m.event==='奧運會'&&m.rank===1)",text:'奧運金牌！！你做到了！！！',emoji:'🏆'},
];

const ACHIEVEMENTS=[
  {id:'first_train',name:'初出茅廬',desc:'完成第一次訓練',icon:'⭐',check:c=>c.totalTrainings>=1},
  {id:'train_10',name:'勤奮新手',desc:'訓練10次',icon:'🌟',check:c=>c.totalTrainings>=10},
  {id:'train_50',name:'鋼鐵意志',desc:'訓練50次',icon:'💫',check:c=>c.totalTrainings>=50},
  {id:'train_100',name:'訓練狂人',desc:'訓練100次',icon:'🔥',check:c=>c.totalTrainings>=100},
  {id:'first_comp',name:'初登擂台',desc:'參加第一場比賽',icon:'🎪',check:c=>c.totalComps>=1},
  {id:'first_medal',name:'首面獎牌',desc:'獲得獎牌',icon:'🏅',check:c=>c.medals.length>=1},
  {id:'first_gold',name:'金牌得主',desc:'獲得金牌',icon:'🥇',check:c=>c.medals.some(m=>m.rank===1)},
  {id:'national',name:'全國選手',desc:'參加全國賽',icon:'🇹🇼',check:c=>c.eventLevel>=2},
  {id:'international',name:'走向國際',desc:'參加亞洲賽',icon:'🌏',check:c=>c.eventLevel>=3},
  {id:'world_class',name:'世界級選手',desc:'參加世界賽',icon:'🌍',check:c=>c.eventLevel>=4},
  {id:'olympian',name:'奧運選手',desc:'站上奧運舞台',icon:'🏟️',check:c=>c.eventLevel>=5},
  {id:'olympic_gold',name:'奧運金牌！！！',desc:'登上世界之巔！',icon:'🏆',check:c=>c.medals.some(m=>m.event==='奧運會'&&m.rank===1)},
  {id:'streak7',name:'一週不間斷',desc:'連續訓練7天',icon:'📅',check:c=>c.streak>=7},
  {id:'rich',name:'小富翁',desc:'擁有5000金幣',icon:'💰',check:c=>c.money>=5000},
  {id:'balanced',name:'全能選手',desc:'所有屬性達30',icon:'⚖️',check:c=>Object.values(c.stats).every(v=>v>=30)},
  {id:'max_stat',name:'突破極限',desc:'任一屬性達80',icon:'💎',check:c=>Object.values(c.stats).some(v=>v>=80)},
  {id:'rest_master',name:'懂得休息',desc:'連續休息3天',icon:'🛏️',check:c=>(c.restStreak||0)>=3},
  {id:'tcjs_fan',name:'TCJS愛好者',desc:'做了10次TCJS訓練',icon:'🔬',check:c=>(c.tcjsCount||0)>=10},
  {id:'five_prin',name:'五字訣大師',desc:'五字訣全部達 Lv.3',icon:'📜',check:c=>c.principles&&Object.values(c.principles).every(v=>v>=3)},
  {id:'perfect10',name:'完美十連',desc:'比賽中累計10次完美',icon:'🌟',check:c=>(c.perfectCount||0)>=10},
];

const COACHES=[
  {id:'titan',name:'小巨人',desc:'身高150但力量爆表！專攻爆發力訓練',
    style:'power',
    bonusStat:'pwr',bonusValue:1.5,
    personality:'hot',
    lines:{
      train:['矮不是問題！力量才是！','爆發力就是一切！','我雖然矮但我舉得比你重！','別看我小，我可是全國冠軍！','用力！再用力！'],
      rest:['休息？我不需要休息！...好吧你休息一下','等等就要繼續練喔！','你比我還沒力？'],
      win:['看到沒！小巨人的弟子！','這就是爆發力的威力！','身高不決定一切！'],
      lose:['沒關係！下次用力炸開它！','輸了就練更多！','站起來！再來！'],
      injury:['受傷了？揉一揉繼續！...開玩笑的，去看醫生','別硬撐，身體最重要','我以前也受過傷，休息是為了走更長的路'],
      coffee:['咖啡？我喝蠻牛！','好吧來一杯，聊聊爆發力訓練','你知道嗎，我以前159公斤抓舉...'],
    },
    programs:[
      {name:'初階課表',level:1,desc:'先練爆發力基礎！',exercises:['squat','plyometric','boxJump','rest'],sets:'每項3組'},
      {name:'中階課表',level:2,desc:'爆發！爆發！再爆發！',exercises:['squat','powerSnatch','powerClean','plyometric','sqJump'],sets:'每項4組'},
      {name:'高階課表',level:3,desc:'今天要炸開天花板！',exercises:['frontSquat','tcjs','powerSnatch','powerClean','plyometric','snatchPull','cleanPull'],sets:'每項5組'},
    ],
    appearance:{hair:'#8d6e63',skin:'#e8b87a',height:'short',build:'stocky',
      special:'小但肌肉超大，穿緊身衣，頭帶紅色頭帶，永遠很激動的表情'}
  },
  {id:'monk',name:'二頭肌唐三藏',desc:'佛系訓練法，注重技術和心理素質',
    style:'technical',
    bonusStat:'tec',bonusValue:1.5,
    personality:'calm',
    lines:{
      train:['呼吸...感受槓鈴...成為槓鈴','技術是水，力量是杯，杯再大裝不了水也沒用','慢即是快，少即是多','動作做對比重量重要一萬倍','心如止水，力如山崩'],
      rest:['休息是修行的一部分','打坐冥想，感受肌肉','今天的你比昨天的你更強了'],
      win:['善哉善哉，技術到位自然成功','勝不驕，這只是修行的一步','冷靜成就了你'],
      lose:['失敗是最好的老師','執著於結果反而會失敗','放下，重新來過'],
      injury:['身體在告訴你什麼，要聽','受傷是身體的智慧，休息吧','我幫你念經...不是，我幫你找醫生'],
      coffee:['我喝茶，你喝咖啡','來，聊聊人生和舉重的共通之處','你知道嗎，舉重和禪修很像...'],
    },
    programs:[
      {name:'初階課表',level:1,desc:'先把動作做對',exercises:['snatchDrill','cleanJerkDrill','flexibility','mental'],sets:'每項3組'},
      {name:'中階課表',level:2,desc:'感受每個動作的細節',exercises:['hangSnatch','hangClean','snatchBalance','overheadSquat','slowPull'],sets:'每項4組'},
      {name:'高階課表',level:3,desc:'技術到位，重量自然來',exercises:['snatchDrill','tcjs','hangSnatch','cleanJerkDrill','snatchBalance','muscleSnatch','mental'],sets:'每項5組'},
    ],
    appearance:{hair:'#1a1a1a',skin:'#ffcc80',height:'tall',build:'lean',
      special:'光頭（或極短髮），戴佛珠項鍊，穿寬鬆的僧袍式訓練服，表情永遠很平靜，二頭肌超大反差萌'}
  },
  {id:'thor',name:'雷神索爾',desc:'北歐式硬派訓練，全面提升力量',
    style:'strength',
    bonusStat:'str',bonusValue:1.5,
    personality:'epic',
    lines:{
      train:['VALHALLA AWAITS! 練！','像維京人一樣舉起它！','Thor would be proud!','想像你在舉起雷神之鎚！','No pain no gain! SKOL!'],
      rest:['Even gods need rest','去吃肉！大量的肉！','Vikings也需要睡覺'],
      win:['BY ODIN\'S BEARD! 你做到了！','WORTHY! 你配得上金牌！','雷神認可你了！'],
      lose:['A warrior never gives up!','Defeat is temporary, glory is forever!','再來！Ragnarok還沒到！'],
      injury:['受傷了？塗點北歐草藥...開玩笑，去看醫生','A true warrior knows when to heal','Rest and come back STRONGER!'],
      coffee:['我喝蜂蜜酒...好吧咖啡也行','SKOL! 乾杯！','你知道維京人也做重訓嗎？'],
    },
    programs:[
      {name:'初階課表',level:1,desc:'LIFT HEAVY! 基礎力量！',exercises:['squat','deadlift','press','pullUp'],sets:'每項3組'},
      {name:'中階課表',level:2,desc:'MORE WEIGHT! SKOL!',exercises:['squat','frontSquat','deadlift','benchPress','snatchPull','cleanPull'],sets:'每項4組'},
      {name:'高階課表',level:3,desc:'VALHALLA TRAINING PROTOCOL!',exercises:['squat','frontSquat','deadlift','snatchPull','cleanPull','deficitPull','press','grip'],sets:'每項5組'},
    ],
    appearance:{hair:'#d4a44a',skin:'#ffcc80',height:'tall',build:'massive',
      special:'金色長髮紮馬尾，大鬍子，穿無袖盔甲風格的訓練服，手臂有北歐紋身，永遠很豪邁'}
  },
];
