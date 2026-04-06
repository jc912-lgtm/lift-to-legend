// ── PROGRESS CHART ──
function ProgressChart({history}){
  if(!history||(history.length<2))return <div className="font-vt text-pixel-gray text-center text-sm p-4">訓練更多天後會顯示進步曲線！</div>;
  const w=300,h=120,pad=30,plotH=h-pad*2,plotW=w-pad-10;
  const keys=['str','tec','pwr','stb','sta','rec'];
  const maxDay=history[history.length-1].day,minDay=history[0].day,dayRange=maxDay-minDay||1;
  return(
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{fontFamily:'VT323,monospace'}}>
      {[0,25,50,75,100].map(v=>(
        <g key={v}>
          <line x1={pad} y1={h-pad-(v/100)*plotH} x2={w-10} y2={h-pad-(v/100)*plotH} stroke="#566c86" strokeWidth=".5" opacity=".3"/>
          <text x={pad-3} y={h-pad-(v/100)*plotH+3} textAnchor="end" fill="#566c86" fontSize="8">{v}</text>
        </g>
      ))}
      {keys.map(key=>(
        <polyline key={key} fill="none" stroke={SC[key]} strokeWidth="1.5" opacity=".8"
          points={history.map(pt=>`${pad+(pt.day-minDay)/dayRange*plotW},${h-pad-(pt.stats[key]/100)*plotH}`).join(' ')}/>
      ))}
      {keys.map((key,i)=>(
        <g key={key}>
          <rect x={pad+i*45} y={h-10} width="8" height="8" fill={SC[key]}/>
          <text x={pad+i*45+10} y={h-3} fill="#94b0c2" fontSize="7">{SN[key]}</text>
        </g>
      ))}
      <text x={w/2} y={h} textAnchor="middle" fill="#566c86" fontSize="7">天數</text>
    </svg>
  );
}

// ── STATUS ──
function StatusScreen({c,go}){
  const stageNames=['泛化期','分化期','鞏固期','自動化'];
  const stageDescs=['動作還在學習中，多練習！','動作逐漸穩定，繼續加油！','技術成熟了，準備挑戰大賽！','大師級！動作已經是自然反應。'];
  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-auto">
      <div className="max-w-lg mx-auto">
        <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-4 py-1.5 text-[10px] font-pixel mb-2">← 返回</button>
        <h2 className="font-pixel text-pixel-sky text-[10px] mb-2">📊 選手狀態</h2>

        <div className="pixel-border bg-pixel-charcoal p-3 mb-2 flex items-center gap-3">
          <CharAvatar charId={c.avatar} size={50}/>
          <div>
            <div className="font-pixel text-pixel-gold text-[10px]">{c.name}</div>
            <div className="font-vt text-pixel-light text-sm">{c.gender==='male'?'男子':'女子'} {c.weightClass}</div>
            <div className="font-vt text-pixel-gray text-xs">📅{c.day}天 | 訓練{c.totalTrainings}次 | 比賽{c.totalComps}次</div>
            <div className="font-vt text-pixel-cyan text-xs">🎓 運動學習：{stageNames[c.motorStage]}— {stageDescs[c.motorStage]}</div>
          </div>
        </div>

        <div className="pixel-border bg-pixel-charcoal p-2 mb-2">
          <div className="font-pixel text-pixel-gold text-[9px] mb-1">⚖️ 體重管理</div>
          <div className="flex items-center gap-2">
            <span className="font-vt text-pixel-light text-sm">目前 {c.bodyWeight?.toFixed(1)}kg</span>
            <span className="font-vt text-pixel-gray text-sm">/ 量級 {c.weightClass}</span>
          </div>
          <div className="h-3 bg-pixel-dark border border-pixel-gray mt-1 rounded overflow-hidden">
            <div className="h-full transition-all" style={{
              width:`${Math.min(100,(c.bodyWeight/(parseInt(c.weightClass)||80))*100)}%`,
              background:c.bodyWeight>(parseInt(c.weightClass)||80)?'#b13e53':'#38b764'
            }}/>
          </div>
          {c.bodyWeight>(parseInt(c.weightClass)||80)&&
            <div className="font-vt text-pixel-red text-xs mt-1">⚠️ 超過量級！比賽會被取消資格</div>
          }
        </div>

        <div className="pixel-border bg-pixel-charcoal p-2 mb-2">
          <div className="font-pixel text-pixel-gold text-[8px] text-center mb-1">📜 舉重五字訣</div>
          <PrinciplesDisplay principles={c.principles}/>
          <div className="font-vt text-pixel-gray text-xs text-center mt-1">五字訣越高，比賽成功率加成越大！</div>
        </div>

        <div className="pixel-border bg-pixel-charcoal p-2 mb-2 flex justify-center">
          <Radar stats={c.stats} size={220}/>
        </div>

        <div className="pixel-border bg-pixel-charcoal p-2 mb-2">
          <div className="font-pixel text-pixel-gold text-[9px] mb-1">📈 進步曲線</div>
          <ProgressChart history={c.statHistory||[]}/>
        </div>

        <div className="pixel-border bg-pixel-charcoal p-2 mb-2">
          {Object.entries(SN).map(([k,n])=><StatBar key={k} label={n} icon={SI[k]} value={c.stats[k]} color={SC[k]}/>)}
        </div>

        <div className="pixel-border bg-pixel-charcoal p-2 mb-2">
          <div className="font-pixel text-pixel-gold text-[9px] mb-1">🏋️ 個人最佳</div>
          <div className="grid grid-cols-3 gap-2 font-vt text-center">
            {[['抓舉',c.pb.snatch],['挺舉',c.pb.cleanJerk],['總和',c.pb.total]].map(([n,v])=>(
              <div key={n}><div className="text-pixel-gray text-xs">{n}</div><div className="text-pixel-gold text-xl">{v||'--'}kg</div></div>
            ))}
          </div>
        </div>

        {c.medals.length>0&&(
          <div className="pixel-border bg-pixel-charcoal p-2 mb-2">
            <div className="font-pixel text-pixel-gold text-[9px] mb-1">🏅 獎牌</div>
            {c.medals.map((m,i)=>(
              <div key={i} className="flex justify-between font-vt text-sm text-pixel-light">
                <span>{m.rank===1?'🥇':m.rank===2?'🥈':'🥉'} {m.event}</span><span>{m.total}kg（第{m.day}天）</span>
              </div>
            ))}
          </div>
        )}

        <div className="pixel-border bg-pixel-charcoal p-2">
          <div className="font-pixel text-pixel-gold text-[9px] mb-1">🎯 賽事</div>
          {EVENTS.map(e=>{
            const ok=e.reqLv<=c.eventLevel;const won=c.medals.some(m=>m.event===e.name&&m.rank===1);
            return(
              <div key={e.id} className={`flex justify-between font-vt text-sm ${ok?'text-pixel-light':'text-pixel-gray'}`}>
                <span>{won?'🏆':ok?'🔓':'🔒'} {e.emoji} {e.name}</span><span>{won?'✅冠軍':ok?'可參加':e.unlock}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── SHOP ──
function ShopScreen({c,setC,go}){
  const[floats,setFloats]=useState(null);
  const[coach,setCoach]=useState(null);
  const shopDialogs=(()=>{
    const normal=['歡迎光臨！','看看有什麼需要的？','今天有特價喔！','好東西不怕貴！','買了就變強！','這個很多選手都在用喔','老闆推薦！絕對值得','品質保證，不滿意包退','每樣都是精挑細選的好貨'];
    const tired=['你看起來很累耶...休息一下再買？','要不要先吃個飯？','運動員要注意身體喔','別太勉強自己啊'];
    const rich=['大客戶來了！歡迎歡迎！','今天想買什麼盡管挑！','VIP待遇給你！'];
    const poor=['沒關係，先看看就好','下次比賽贏了再來！','夢想無價，慢慢來'];
    const npcMood=(c.fatigue||0)>60?'tired':c.money>=500?'rich':c.money<50?'poor':'normal';
    return npcMood==='tired'?[...normal,...tired]:npcMood==='rich'?[...normal,...rich]:npcMood==='poor'?[...normal,...poor]:normal;
  })();
  const[shopMsg,setShopMsg]=useState(()=>shopDialogs[Math.floor(Math.random()*shopDialogs.length)]);
  const[shopWave,setShopWave]=useState(false);
  const[sFrame,setSFrame]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setSFrame(f=>(f+1)%100),90);return()=>clearInterval(t)},[]);

  function clickShopkeeper(){
    sfx('tap');
    setShopMsg(shopDialogs[Math.floor(Math.random()*shopDialogs.length)]);
    setShopWave(true);setTimeout(()=>setShopWave(false),1200);
  }

  function buy(item){
    if(c.money<item.price){sfx('fail');setFloats([{icon:'💸',text:'不夠！',color:'#b13e53'}]);setShopMsg('不夠錢喔，多加油比賽吧！');return}
    sfx('buy');sfx('coin');const nc={...c,money:c.money-item.price};
    const ef=item.effect;const fItems=[];
    if(ef.type==='trainBoost'){nc.activeEffects=[...nc.activeEffects,{name:item.name,type:'trainBoost',value:ef.value,dur:ef.dur}];fItems.push({icon:'🥤',text:`${ef.dur}天加成`,color:'#38b764'})}
    else if(ef.type==='compBoost'){nc.inventory=[...nc.inventory,item];fItems.push({icon:'🩹',text:item.name,color:'#38b764'})}
    else if(ef.type==='perm'){nc.stats={...nc.stats,[ef.stat]:Math.min(100,nc.stats[ef.stat]+ef.value)};spawnConfetti(10);fItems.push({icon:SI[ef.stat],text:`+${ef.value}`,color:SC[ef.stat]})}
    else if(ef.type==='sta'){nc.stamina=Math.min(maxSta(nc.stats.sta),nc.stamina+ef.value);fItems.push({icon:'🧃',text:`+${ef.value}❤️`,color:'#38b764'})}
    else if(ef.type==='luck'){nc.luckBonus=(nc.luckBonus||0)+ef.value;fItems.push({icon:'🍀',text:`+${ef.value}%`,color:'#f4d03f'})}
    else if(ef.type==='allBoost'){nc.stats={...nc.stats};for(const k of Object.keys(SN)){nc.stats[k]=Math.min(100,nc.stats[k]+ef.value);fItems.push({icon:SI[k],text:`+${ef.value}`,color:SC[k]})}spawnConfetti(15)}
    else if(ef.type==='multi'){nc.stats={...nc.stats};for(const[k,v]of Object.entries(ef.stats)){nc.stats[k]=Math.min(100,nc.stats[k]+v);fItems.push({icon:SI[k],text:`+${v}`,color:SC[k]})}spawnConfetti(8)}
    const buyMsgs=['好眼光！','這個很好用！','謝謝惠顧！','識貨！','這款超熱賣的！','你一定會滿意！','回頭客都買這個！'];
    setShopMsg(buyMsgs[Math.floor(Math.random()*buyMsgs.length)]);
    setShopWave(true);setTimeout(()=>setShopWave(false),1200);
    setFloats(fItems);setC(nc);if(Math.random()<.4)setCoach({text:item.tip});
  }

  const breathe=Math.sin(sFrame*.08)*1.5;

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-auto">
      <div className="max-w-lg mx-auto">
        {coach&&<CoachDialog text={coach.text} onClose={()=>setCoach(null)}/>}
        {floats&&<FloatingNum items={floats} onDone={()=>setFloats(null)}/>}
        <div className="flex justify-between items-center mb-2">
          <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-3 py-1 text-[10px] font-pixel">←</button>
          <h2 className="font-pixel text-pixel-orange text-[10px]">🛒 商店</h2>
          <span className="font-vt text-pixel-orange text-lg">💰{c.money}</span>
        </div>

        {/* SVG Shop Scene */}
        <div className="pixel-border bg-pixel-charcoal p-1 mb-2 overflow-hidden">
          <svg viewBox="0 0 400 150" className="w-full" style={{display:'block'}}>
            <defs>
              <radialGradient id="shopWarm" cx="50%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#fff8e1" stopOpacity=".25"/>
                <stop offset="100%" stopColor="#000" stopOpacity="0"/>
              </radialGradient>
            </defs>
            {/* Background wall */}
            <rect width="400" height="150" fill="#5d4037"/>
            <rect y="110" width="400" height="40" fill="#4e342e"/>
            <rect width="400" height="150" fill="url(#shopWarm)"/>

            {/* SHOP sign */}
            <rect x="150" y="5" width="100" height="22" rx="3" fill="#b71c1c" stroke="#f44336" strokeWidth="1.5"/>
            <text x="200" y="20" textAnchor="middle" fontSize="12" fill="#ffc107" fontWeight="bold" fontFamily="monospace">SHOP</text>

            {/* Shelves on wall */}
            <rect x="15" y="32" width="130" height="5" fill="#8d6e63" stroke="#6d4c41" strokeWidth="1"/>
            <rect x="15" y="60" width="130" height="5" fill="#8d6e63" stroke="#6d4c41" strokeWidth="1"/>
            {/* Items on shelves */}
            <text x="25" y="30" fontSize="10">🥤</text>
            <text x="45" y="30" fontSize="10">🥛</text>
            <text x="65" y="30" fontSize="10">💊</text>
            <text x="85" y="30" fontSize="10">🧃</text>
            <text x="105" y="30" fontSize="10">🍀</text>
            <text x="25" y="58" fontSize="10">🩹</text>
            <text x="45" y="58" fontSize="10">🏋️</text>
            <text x="65" y="58" fontSize="10">👟</text>
            <text x="85" y="58" fontSize="10">🧴</text>
            <text x="105" y="58" fontSize="10">📦</text>

            {/* Right shelves */}
            <rect x="270" y="32" width="115" height="5" fill="#8d6e63" stroke="#6d4c41" strokeWidth="1"/>
            <rect x="270" y="60" width="115" height="5" fill="#8d6e63" stroke="#6d4c41" strokeWidth="1"/>
            <text x="280" y="30" fontSize="10">⚡</text>
            <text x="300" y="30" fontSize="10">🎯</text>
            <text x="320" y="30" fontSize="10">🏅</text>
            <text x="340" y="30" fontSize="10">💎</text>
            <text x="280" y="58" fontSize="10">🧲</text>
            <text x="300" y="58" fontSize="10">🔥</text>
            <text x="320" y="58" fontSize="10">👑</text>

            {/* Glass display counter */}
            <rect x="20" y="90" width="360" height="25" rx="3" fill="#795548" stroke="#5d4037" strokeWidth="2"/>
            <rect x="25" y="92" width="350" height="16" rx="2" fill="#e3f2fd" opacity=".15"/>
            <line x1="25" y1="108" x2="375" y2="108" stroke="#4e342e" strokeWidth="1"/>

            {/* Shopkeeper chibi — clickable */}
            <g transform={`translate(200,72)`} onClick={clickShopkeeper} style={{cursor:'pointer'}}>
              {/* Body (apron) */}
              <rect x="-10" y="10" width="20" height="18" rx="3" fill="#fff" stroke="#ddd" strokeWidth="1"/>
              <rect x="-8" y="12" width="16" height="14" rx="2" fill="#f5f5f5"/>
              <line x1="0" y1="12" x2="0" y2="26" stroke="#bbb" strokeWidth=".5"/>
              {/* Shirt behind apron */}
              <rect x="-12" y="8" width="24" height="22" rx="4" fill="#4caf50" style={{zIndex:-1}}/>
              {/* Head */}
              <circle cx="0" cy={-2+breathe} r="12" fill="#ffcc80"/>
              {/* Eyes */}
              <circle cx="-4" cy={-4+breathe} r="1.8" fill="#333"/>
              <circle cx="5" cy={-4+breathe} r="1.8" fill="#333"/>
              {/* Mustache */}
              <path d={`M-5,${1+breathe} Q-3,${4+breathe} 0,${2+breathe} Q3,${4+breathe} 5,${1+breathe}`} fill="#5d4037" stroke="#4e342e" strokeWidth=".5"/>
              {/* Smile */}
              <path d={`M-3,${3+breathe} Q0,${6+breathe} 3,${3+breathe}`} fill="none" stroke="#333" strokeWidth=".8"/>
              {/* Hat */}
              <rect x="-14" y={-15+breathe} width="28" height="6" rx="2" fill="#2e7d32"/>
              <rect x="-10" y={-20+breathe} width="20" height="8" rx="3" fill="#388e3c"/>
              {/* Waving arm */}
              <line x1="12" y1="14" x2={shopWave?28:20} y2={shopWave?-2+Math.sin(sFrame*.3)*4:8} stroke="#ffcc80" strokeWidth="4" strokeLinecap="round"/>
              <circle cx={shopWave?28:20} cy={shopWave?-2+Math.sin(sFrame*.3)*4:8} r="3" fill="#ffcc80"/>
              {/* Left arm */}
              <line x1="-12" y1="14" x2="-20" y2="10" stroke="#ffcc80" strokeWidth="4" strokeLinecap="round"/>
            </g>

            {/* Speech bubble */}
            {shopMsg&&<g>
              <rect x="245" y="20" width={Math.min(shopMsg.length*8+16,150)} height="24" rx="6" fill="#fff" stroke="#ddd" strokeWidth="1"/>
              <polygon points="244,38 238,50 252,40" fill="#fff" stroke="#ddd" strokeWidth="1"/>
              <polygon points="245,38 240,48 252,40" fill="#fff"/>
              <text x="253" y="36" fontSize="9" fill="#333" fontFamily="sans-serif">{shopMsg}</text>
            </g>}
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mb-2">
          {SHOP.map(item=>{const can=c.money>=item.price;return(
            <button key={item.id} onClick={()=>buy(item)} disabled={!can}
              className={`pixel-border p-2 flex flex-col items-center gap-0.5 ${can?'bg-pixel-charcoal hover:bg-pixel-darkblue cursor-pointer':'bg-pixel-dark opacity-40 cursor-not-allowed'}`}>
              <span className="text-2xl">{item.icon}</span>
              <span className="font-vt text-pixel-white text-xs text-center">{item.name}</span>
              <span className={`font-pixel text-[8px] ${can?'text-pixel-orange':'text-pixel-red'}`}>💰{item.price}</span>
            </button>
          )})}
        </div>
      </div>
    </div>
  );
}

// ── JOBS & LIFE ──
const JUNIOR_DIALOGS=[
  '學弟：「前輩！你好厲害！我也要像你一樣強！」',
  '學妹：「教練說要把槓鈴貼近身體...是這樣嗎？」',
  '學弟：「前輩，我昨天夢到自己在奧運比賽了！」',
  '學妹：「嗚嗚...抓舉好難，槓鈴一直飛走...」',
  '學弟：「前輩你看！我深蹲破紀錄了！雖然只有40公斤...」',
  '學妹：「前輩，挺舉的時候腳要分多開呀？」',
  '學弟：「我跟朋友說我在練舉重，他們都說我好酷！」',
  '學妹：「前輩帶的便當好香...可以分我吃嗎？」',
];
const GACHA_POOL=[
  {name:'能量飲料',icon:'🥤',weight:40,type:'stamina',value:20},
  {name:'小獎金',icon:'💰',weight:25,type:'money',value:0},// value randomized
  {name:'蛋白粉',icon:'🥛',weight:15,type:'trainBoost',value:2},
  {name:'屬性隨機+2',icon:'⬆️',weight:10,type:'statUp',value:2},
  {name:'稀有裝備',icon:'👑',weight:5,type:'permStat',value:3},
  {name:'大獎500💰',icon:'🎉',weight:5,type:'bigMoney',value:500},
];

function JobsScreen({c,setC,go}){
  const[msgs,setMsgs]=useState([{text:'💼 歡迎來到打工＆生活！賺錢的方式不只比賽喔！',type:'info'}]);
  const[coach,setCoach]=useState(null);
  const[tab,setTab]=useState('work');
  const[gachaAnim,setGachaAnim]=useState(false);
  const[gachaResult,setGachaResult]=useState(null);
  const[etfBuyAmt,setEtfBuyAmt]=useState(1);
  const[bossMsg,setBossMsg]=useState(null);
  const[cleanAnim,setCleanAnim]=useState(false);
  const[studyAnim,setStudyAnim]=useState(false);
  const ms=maxSta(c.stats.sta);

  const etfPrice=(c.etf&&c.etf.prices)?c.etf.prices[c.etf.prices.length-1]:100;

  function clickBoss(){
    sfx('tap');
    const talks=[
      '認真工作的人我最欣賞',
      '今天的進度不錯！',
      '要不要加班？(開玩笑的)',
      '記得準時下班去訓練啊',
      '年輕人有夢想很好'
    ];
    setBossMsg(talks[Math.floor(Math.random()*talks.length)]);
    setTimeout(()=>setBossMsg(null),2500);
  }

  // 1. Study & Exams
  function doStudy(){
    if(c.stamina<15){sfx('fail');setMsgs(m=>[...m,{text:'❌ 體力不足！需要15體力。',type:'fail'}]);return}
    sfx('click');setStudyAnim(true);setTimeout(()=>setStudyAnim(false),1500);
    const newKnow=Math.min(100,(c.knowledge||0)+Math.floor(8+Math.random()*5));
    const newCount=(c.studyCount||0)+1;
    const ns={...c.stats,stb:Math.min(100,c.stats.stb+1)};
    let nc={...c,stamina:c.stamina-15,knowledge:newKnow,studyCount:newCount,stats:ns};
    setMsgs(m=>[...m,{text:`📚 認真念書中...知識+${newKnow-(c.knowledge||0)}，穩定性+1`,type:'success'}]);

    // Every 5 study sessions = exam
    if(newCount%5===0){
      const examScore=Math.min(100,Math.floor(newKnow*0.6+ns.stb*0.3+Math.random()*15));
      if(examScore>=90){
        nc.money+=500;sfx('medal');spawnConfetti(15);
        setMsgs(m=>[...m,{text:`🎓 考試成績：${examScore}分！優等獎學金 +500💰！`,type:'gold'}]);
      }else if(examScore>=60){
        const reward=100+Math.floor(Math.random()*201);
        nc.money+=reward;sfx('coin');
        setMsgs(m=>[...m,{text:`📝 考試成績：${examScore}分！通過！獎學金 +${reward}💰`,type:'success'}]);
      }else{
        sfx('fail');
        setMsgs(m=>[...m,{text:`📝 考試成績：${examScore}分...不及格，再加油！`,type:'fail'}]);
      }
    }
    setC(nc);
  }

  // 2. Part-time Cleaning
  function doCleaning(){
    if(c.stamina<10){sfx('fail');setMsgs(m=>[...m,{text:'❌ 體力不足！需要10體力。',type:'fail'}]);return}
    sfx('train');setCleanAnim(true);setTimeout(()=>setCleanAnim(false),1500);
    let earn=30+Math.floor(Math.random()*51);
    const ns={...c.stats,sta:Math.min(100,c.stats.sta+1)};
    let extra='';
    if(Math.random()<0.10){earn+=50;extra=' 撿到遺失物品多賺50💰！';}
    const nc={...c,stamina:c.stamina-10,money:c.money+earn,stats:ns};
    sfx('coin');
    setMsgs(m=>[...m,{text:`🧹 打掃完畢！賺了${earn}💰，體力+1${extra}`,type:'success'}]);
    setC(nc);
  }

  // 3. Pool Competition
  function doPool(){
    if(c.money<50){sfx('fail');setMsgs(m=>[...m,{text:'❌ 報名費不夠！需要50💰。',type:'fail'}]);return}
    sfx('tap');
    const winChance=Math.min(85,50+c.stats.stb*0.3)/100;
    const won=Math.random()<winChance;
    if(won){
      sfx('success');spawnConfetti(8);
      const ns={...c.stats,stb:Math.min(100,c.stats.stb+1)};
      setC(x=>({...x,money:x.money+70,stats:ns}));
      setMsgs(m=>[...m,{text:`🎱 贏了撞球比賽！淨賺70💰，穩定性+1（勝率${Math.round(winChance*100)}%）`,type:'gold'}]);
    }else{
      sfx('fail');
      setC(x=>({...x,money:x.money-50}));
      setMsgs(m=>[...m,{text:`🎱 輸了...報名費-50💰。下次再來！（勝率${Math.round(winChance*100)}%）`,type:'fail'}]);
    }
  }

  // 4. ETF Investment
  function buyETF(){
    const cost=etfPrice*etfBuyAmt;
    if(c.money<cost){sfx('fail');setMsgs(m=>[...m,{text:`❌ 錢不夠！需要${cost}💰`,type:'fail'}]);return}
    sfx('buy');
    const avgPrice=c.etf.shares>0?((c.etf.buyPrice*c.etf.shares+cost)/(c.etf.shares+etfBuyAmt)):etfPrice;
    setC(x=>({...x,money:x.money-cost,etf:{...x.etf,shares:x.etf.shares+etfBuyAmt,buyPrice:Math.round(avgPrice)}}));
    setMsgs(m=>[...m,{text:`📈 買入${etfBuyAmt}股 ETF，花費${cost}💰（均價${Math.round(avgPrice)}）`,type:'success'}]);
  }
  function sellETF(){
    if(!c.etf.shares||c.etf.shares<etfBuyAmt){sfx('fail');setMsgs(m=>[...m,{text:'❌ 沒有足夠的股份可賣！',type:'fail'}]);return}
    const revenue=etfPrice*etfBuyAmt;
    sfx('coin');
    const newShares=c.etf.shares-etfBuyAmt;
    const profit=revenue-c.etf.buyPrice*etfBuyAmt;
    setC(x=>({...x,money:x.money+revenue,etf:{...x.etf,shares:newShares,buyPrice:newShares>0?x.etf.buyPrice:0}}));
    setMsgs(m=>[...m,{text:`📉 賣出${etfBuyAmt}股，收入${revenue}💰（${profit>=0?'賺':'虧'}${Math.abs(profit)}💰）`,type:profit>=0?'success':'fail'}]);
  }

  // 5. Coach Juniors
  function doCoach(){
    if(c.totalTrainings<30){sfx('fail');setMsgs(m=>[...m,{text:'❌ 需要累計訓練30次以上才能教學弟妹！',type:'fail'}]);return}
    if(c.stamina<15){sfx('fail');setMsgs(m=>[...m,{text:'❌ 體力不足！需要15體力。',type:'fail'}]);return}
    sfx('cheer');
    const earn=80+Math.floor(Math.random()*71);
    const ns={...c.stats,tec:Math.min(100,c.stats.tec+1),stb:Math.min(100,c.stats.stb+1)};
    setC(x=>({...x,stamina:x.stamina-15,money:x.money+earn,stats:ns}));
    setMsgs(m=>[...m,{text:`🏫 教學弟妹完成！賺${earn}💰，技術+1，穩定性+1`,type:'success'}]);
    if(Math.random()<0.5){
      const dialog=JUNIOR_DIALOGS[Math.floor(Math.random()*JUNIOR_DIALOGS.length)];
      setTimeout(()=>setCoach({text:dialog}),300);
    }
  }

  // 6. Gacha Machine
  function doGacha(){
    if(c.money<100){sfx('fail');setMsgs(m=>[...m,{text:'❌ 需要100💰才能轉扭蛋！',type:'fail'}]);return}
    sfx('click');
    setGachaAnim(true);setGachaResult(null);
    setTimeout(()=>{
      // Weighted random pick
      const totalW=GACHA_POOL.reduce((s,g)=>s+g.weight,0);
      let r=Math.random()*totalW;
      let picked=GACHA_POOL[0];
      for(const g of GACHA_POOL){r-=g.weight;if(r<=0){picked=g;break;}}

      let nc={...c,money:c.money-100,gachaCount:(c.gachaCount||0)+1};
      let resultText='';
      if(picked.type==='stamina'){
        nc.stamina=Math.min(ms,nc.stamina+picked.value);
        resultText=`${picked.icon} ${picked.name}！體力+${picked.value}`;
      }else if(picked.type==='money'){
        const amt=50+Math.floor(Math.random()*101);
        nc.money+=amt;
        resultText=`${picked.icon} 小獎金！+${amt}💰`;
      }else if(picked.type==='trainBoost'){
        nc.activeEffects=[...(nc.activeEffects||[]),{name:'蛋白粉',type:'trainBoost',value:1.2,dur:picked.value}];
        resultText=`${picked.icon} ${picked.name}！訓練加成${picked.value}天`;
      }else if(picked.type==='statUp'){
        const stats=['str','tec','pwr','stb','sta','rec'];
        const s=stats[Math.floor(Math.random()*stats.length)];
        nc.stats={...nc.stats,[s]:Math.min(100,nc.stats[s]+picked.value)};
        resultText=`${picked.icon} ${SN[s]}+${picked.value}！`;
      }else if(picked.type==='permStat'){
        const stats=['str','tec','pwr','stb','sta','rec'];
        const s=stats[Math.floor(Math.random()*stats.length)];
        nc.stats={...nc.stats,[s]:Math.min(100,nc.stats[s]+picked.value)};
        spawnConfetti(12);
        resultText=`${picked.icon} 稀有！${SN[s]}永久+${picked.value}！`;
      }else if(picked.type==='bigMoney'){
        nc.money+=picked.value;spawnConfetti(20);
        resultText=`${picked.icon} 大獎！+${picked.value}💰！！！`;
      }
      sfx(picked.weight<=10?'medal':'success');
      setGachaResult({text:resultText,rare:picked.weight<=10});
      setMsgs(m=>[...m,{text:`🎰 扭蛋結果：${resultText}`,type:picked.weight<=10?'gold':'success'}]);
      setC(nc);
      setGachaAnim(false);
    },1200);
  }

  const tabs=[{id:'work',label:'💼 打工',items:['study','clean','coach']},{id:'play',label:'🎮 娛樂',items:['pool','gacha']},{id:'invest',label:'📈 投資',items:['etf']}];
  const[jFrame,setJFrame]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setJFrame(f=>(f+1)%120),80);return()=>clearInterval(t)},[]);

  // Determine active activity for SVG scene
  const sceneMode=tab==='work'?'study':tab==='play'?(gachaAnim||gachaResult?'gacha':'pool'):'etf';

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-auto">
      <div className="max-w-lg mx-auto">
        {coach&&<CoachDialog text={coach.text} onClose={()=>setCoach(null)}/>}
        <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-4 py-1.5 text-[10px] font-pixel mb-2">← 返回</button>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-pixel text-pixel-orange text-[10px]">💼 打工＆生活</h2>
          <span className="font-vt text-pixel-orange text-xl">💰 {c.money}</span>
        </div>

        {/* SVG Campus/Office Scene */}
        <div className="pixel-border bg-pixel-charcoal p-1 mb-2 overflow-hidden">
          <svg viewBox="0 0 400 180" className="w-full" style={{display:'block'}}>
            <defs>
              <radialGradient id="jobLamp" cx="50%" cy="20%" r="60%">
                <stop offset="0%" stopColor="#fff8e1" stopOpacity=".3"/>
                <stop offset="100%" stopColor="#000" stopOpacity="0"/>
              </radialGradient>
            </defs>
            {/* Wall */}
            <rect width="400" height="180" fill="#3e2723"/>
            <rect width="400" height="140" fill="#5d4037"/>
            {/* Floor */}
            <rect y="140" width="400" height="40" fill="#4e342e"/>
            <line x1="0" y1="140" x2="400" y2="140" stroke="#6d4c41" strokeWidth="2"/>
            {/* Warm light overlay */}
            <rect width="400" height="180" fill="url(#jobLamp)"/>

            {/* Whiteboard on wall */}
            <rect x="20" y="15" width="80" height="55" rx="2" fill={sceneMode==='study'?'#e8e8e8':'#ccc'} stroke={tab==='work'?'#8d6e63':'#666'} strokeWidth="2"/>
            <text x="35" y="35" fontSize="7" fill="#333" fontFamily="monospace">STUDY</text>
            <line x1="28" y1="42" x2="88" y2="42" stroke="#999" strokeWidth="0.5"/>
            <line x1="28" y1="48" x2="78" y2="48" stroke="#999" strokeWidth="0.5"/>
            <line x1="28" y1="54" x2="85" y2="54" stroke="#999" strokeWidth="0.5"/>
            {tab==='work'&&<rect x="20" y="15" width="80" height="55" rx="2" fill="#f4d03f" opacity=".12"/>}

            {/* Research poster on wall */}
            <rect x="120" y="18" width="45" height="50" rx="1" fill="#e3f2fd" stroke="#90a4ae" strokeWidth="1"/>
            <text x="127" y="32" fontSize="5" fill="#1565c0" fontFamily="monospace">RESEARCH</text>
            <rect x="125" y="36" width="35" height="3" fill="#42a5f5" opacity=".5"/>
            <rect x="125" y="41" width="30" height="3" fill="#42a5f5" opacity=".3"/>
            <circle cx="142" cy="54" r="6" fill="none" stroke="#1565c0" strokeWidth="0.7"/>

            {/* Desk */}
            <rect x="160" y="95" width="140" height="8" rx="2" fill="#8d6e63" stroke="#5d4037" strokeWidth="1"/>
            <rect x="170" y="103" width="8" height="37" fill="#6d4c41"/>
            <rect x="282" y="103" width="8" height="37" fill="#6d4c41"/>

            {/* Laptop on desk */}
            <g opacity={sceneMode==='etf'?1:0.7}>
              <rect x="200" y="78" width="40" height="26" rx="2" fill="#263238" stroke="#37474f" strokeWidth="1"/>
              <rect x="203" y="81" width="34" height="20" rx="1" fill={sceneMode==='etf'?'#1b5e20':'#1a237e'}/>
              {sceneMode==='etf'&&<>
                <polyline points="206,96 212,90 218,93 224,85 230,88 234,82" fill="none" stroke="#4caf50" strokeWidth="1.5"/>
                <text x="210" y="89" fontSize="5" fill="#66bb6a" fontFamily="monospace">ETF</text>
              </>}
              {sceneMode!=='etf'&&<rect x="206" y="84" width="28" height="12" rx="1" fill="#283593" opacity=".5"/>}
              <rect x="205" y="95" width="36" height="2" rx="1" fill="#37474f"/>
            </g>

            {/* Books on desk — with opening animation when studying */}
            <g opacity={sceneMode==='study'?1:0.6}>
              <rect x="250" y="80" width="12" height="15" fill={sceneMode==='study'?'#f44336':'#c62828'} rx="1"/>
              <rect x="264" y="82" width="10" height="13" fill={sceneMode==='study'?'#2196f3':'#1565c0'} rx="1"/>
              <rect x="276" y="84" width="8" height="11" fill={sceneMode==='study'?'#4caf50':'#2e7d32'} rx="1"/>
              {sceneMode==='study'&&<circle cx="262" cy="78" r="6" fill="#f4d03f" opacity={.3+Math.sin(jFrame*.1)*.2}/>}
              {/* Book opening animation when studying */}
              {studyAnim&&<>
                <rect x="248" y={76-Math.sin(jFrame*0.15)*4} width="16" height="12" rx="1" fill="#fff" opacity=".9" transform={`rotate(${-10+Math.sin(jFrame*0.2)*8},256,82)`}/>
                <line x1="256" y1={74-Math.sin(jFrame*0.15)*4} x2="256" y2={86-Math.sin(jFrame*0.15)*4} stroke="#ddd" strokeWidth="0.5"/>
                <rect x="250" y={78-Math.sin(jFrame*0.15)*4} width="4" height="1" fill="#999" opacity=".6"/>
                <rect x="258" y={78-Math.sin(jFrame*0.15)*4} width="5" height="1" fill="#999" opacity=".6"/>
                <rect x="250" y={81-Math.sin(jFrame*0.15)*4} width="5" height="1" fill="#999" opacity=".6"/>
                <rect x="258" y={81-Math.sin(jFrame*0.15)*4} width="4" height="1" fill="#999" opacity=".6"/>
              </>}
            </g>

            {/* Mop & Bucket (left side) — with cleaning animation */}
            <g transform={`translate(${cleanAnim?30+Math.sin(jFrame*0.4)*8:30},90)`} opacity={tab==='work'?1:0.4}>
              <rect x="0" y="20" width="20" height="18" rx="3" fill={sceneMode==='study'?'#78909c':'#90a4ae'} stroke="#546e7a" strokeWidth="1"/>
              <rect x="2" y="22" width="16" height="8" fill="#b3e5fc" opacity=".5"/>
              <line x1="25" y1="-5" x2={cleanAnim?25+Math.sin(jFrame*0.5)*5:25} y2="38" stroke="#8d6e63" strokeWidth="3"/>
              <rect x="18" y="-5" width="14" height="6" rx="1" fill="#78909c"/>
            </g>
            {/* Sparkle effects when cleaning */}
            {cleanAnim&&[0,1,2,3,4].map(i=>
              <text key={'sp'+i} x={20+i*18+Math.sin(jFrame*0.2+i)*5} y={130+Math.sin(jFrame*0.15+i*1.5)*10}
                fontSize="8" opacity={0.4+Math.sin(jFrame*0.1+i)*0.4} style={{pointerEvents:'none'}}>✨</text>
            )}

            {/* Gacha machine (appears in play tab) */}
            {tab==='play'&&<g transform="translate(330,55)">
              <rect x="0" y="10" width="45" height="70" rx="5" fill="#e53935" stroke="#b71c1c" strokeWidth="2"/>
              <rect x="5" y="20" width="35" height="30" rx="12" fill="#263238"/>
              <circle cx="22" cy="35" r="10" fill="#1a1a1a" stroke="#555" strokeWidth="1"/>
              {[0,1,2,3,4].map(i=><circle key={i} cx={14+i*4} cy={32+Math.sin(jFrame*.15+i)*3} r="2.5"
                fill={['#f44336','#2196f3','#ffeb3b','#4caf50','#e91e63'][i]} opacity=".8"/>)}
              <circle cx="38" cy="60" r="5" fill="#ffc107" stroke="#f57f17" strokeWidth="1"/>
              <rect x="10" y="65" width="25" height="8" rx="2" fill="#212121"/>
              <text x="8" y="18" fontSize="6" fill="#fff" fontWeight="bold" fontFamily="monospace">GACHA</text>
            </g>}

            {/* Chibi character at desk */}
            <g transform="translate(220,100)">
              {/* Chair */}
              <rect x="-15" y="15" width="30" height="20" rx="3" fill="#5d4037"/>
              <rect x="-12" y="0" width="24" height="18" rx="3" fill="#6d4c41"/>
              {/* Body */}
              <rect x="-8" y="5" width="16" height="14" rx="3" fill="#42a5f5"/>
              {/* Head */}
              <circle cx="0" cy="-4" r="10" fill="#ffcc80"/>
              <circle cx="-3" cy="-6" r="1.5" fill="#333"/>
              <circle cx="4" cy="-6" r="1.5" fill="#333"/>
              <path d={sceneMode==='study'?'M-2,-1 Q0,2 2,-1':'M-3,-1 Q0,1 3,-1'} fill="none" stroke="#333" strokeWidth="1"/>
              {/* Hair */}
              <ellipse cx="0" cy="-12" rx="11" ry="5" fill="#4e342e"/>
              {/* Arms — reading vs working */}
              {sceneMode==='study'&&<>
                <line x1="-8" y1="10" x2="-18" y2="0" stroke="#ffcc80" strokeWidth="3" strokeLinecap="round"/>
                <line x1="8" y1="10" x2="18" y2="0" stroke="#ffcc80" strokeWidth="3" strokeLinecap="round"/>
              </>}
              {sceneMode!=='study'&&<>
                <line x1="-8" y1="10" x2="-14" y2="4" stroke="#ffcc80" strokeWidth="3" strokeLinecap="round"/>
                <line x1="8" y1="10" x2="14" y2="4" stroke="#ffcc80" strokeWidth="3" strokeLinecap="round"/>
              </>}
            </g>

            {/* Boss/Manager NPC — chibi, ~25% of scene, clickable */}
            <g transform={`translate(110,95)`} onClick={clickBoss} style={{cursor:'pointer'}}>
              {/* Legs */}
              <rect x="-5" y="28" width="5" height="10" rx="1" fill="#37474f"/>
              <rect x="2" y="28" width="5" height="10" rx="1" fill="#37474f"/>
              {/* Body — polo shirt */}
              <rect x="-10" y="8" width="22" height="22" rx="4" fill="#1565c0"/>
              {/* Collar */}
              <path d="M-4,8 L1,14 L6,8" fill="none" stroke="#0d47a1" strokeWidth="1.5"/>
              {/* Arms */}
              <line x1="-10" y1="14" x2="-18" y2="20" stroke="#ffcc80" strokeWidth="3" strokeLinecap="round"/>
              <line x1="12" y1="14" x2="20" y2="8" stroke="#ffcc80" strokeWidth="3" strokeLinecap="round"/>
              {/* Clipboard in right hand */}
              <rect x="17" y="2" width="10" height="14" rx="1" fill="#8d6e63" stroke="#5d4037" strokeWidth="0.8"/>
              <rect x="18" y="5" width="8" height="9" rx="0.5" fill="#fff"/>
              <line x1="19" y1="7" x2="25" y2="7" stroke="#ccc" strokeWidth="0.5"/>
              <line x1="19" y1="9" x2="24" y2="9" stroke="#ccc" strokeWidth="0.5"/>
              <line x1="19" y1="11" x2="25" y2="11" stroke="#ccc" strokeWidth="0.5"/>
              <rect x="19" y="1" width="6" height="2" rx="0.5" fill="#5d4037"/>
              {/* Head */}
              <circle cx="1" cy="-2" r="11" fill="#ffcc80"/>
              {/* Hair — neat short */}
              <ellipse cx="1" cy="-10" rx="10" ry="5" fill="#333"/>
              <rect x="-8" y="-12" width="18" height="5" rx="2" fill="#333"/>
              {/* Glasses */}
              <rect x="-7" y="-5" width="6" height="5" rx="1.5" fill="none" stroke="#455a64" strokeWidth="1"/>
              <rect x="2" y="-5" width="6" height="5" rx="1.5" fill="none" stroke="#455a64" strokeWidth="1"/>
              <line x1="-1" y1="-3" x2="2" y2="-3" stroke="#455a64" strokeWidth="0.8"/>
              {/* Eyes behind glasses */}
              <circle cx="-4" cy="-3" r="1.2" fill="#333"/>
              <circle cx="5" cy="-3" r="1.2" fill="#333"/>
              {/* Friendly smile */}
              <path d="M-3,2 Q1,5 5,2" fill="none" stroke="#333" strokeWidth="1"/>
            </g>
            {/* Boss speech bubble */}
            {bossMsg&&<g>
              <rect x="60" y="30" width={Math.min(bossMsg.length*8+16,140)} height="22" rx="6" fill="#fff" stroke="#ddd" strokeWidth="1"/>
              <polygon points="100,52 95,62 108,54" fill="#fff" stroke="#ddd" strokeWidth="1"/>
              <polygon points="101,52 97,60 108,54" fill="#fff"/>
              <text x="68" y="44" fontSize="8" fill="#333" fontFamily="sans-serif">{bossMsg}</text>
            </g>}

            {/* Teaching scene — junior students */}
            {tab==='work'&&sceneMode==='study'&&c.totalTrainings>=30&&<g opacity=".7">
              <circle cx="350" cy="120" r="7" fill="#ffcc80"/>
              <rect x="344" y="127" width="12" height="10" rx="2" fill="#66bb6a"/>
              <circle cx="370" cy="125" r="6" fill="#ffcc80"/>
              <rect x="365" y="131" width="10" height="8" rx="2" fill="#ef5350"/>
            </g>}
          </svg>
        </div>

        {/* Stamina bar */}
        <div className="pixel-border bg-pixel-charcoal p-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-vt text-sm">❤️</span>
            <div className="flex-1 stamina-bar"><div className="stamina-fill" style={{width:`${c.stamina/ms*100}%`}}/></div>
            <span className="font-vt text-pixel-green text-sm">{c.stamina}/{ms}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-2">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>{sfx('tap');setTab(t.id)}}
              className={`flex-1 pixel-btn py-1 text-[9px] font-pixel ${tab===t.id?'bg-pixel-darkblue text-pixel-cyan':'bg-pixel-charcoal text-pixel-gray'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-1.5 mb-2">
          {tab==='work'&&<>
            {/* Study */}
            <button onClick={doStudy} className="w-full pixel-border bg-pixel-charcoal hover:bg-pixel-darkblue p-2 text-left cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-xl">📚</span>
                <div className="flex-1">
                  <div className="font-vt text-pixel-white text-base">念書考試</div>
                  <div className="font-vt text-pixel-gray text-xs">消耗15體力 | 知識:{c.knowledge||0} | 已讀{c.studyCount||0}次（每5次考試）</div>
                  <div className="font-vt text-pixel-cyan text-xs">🧠穩定+1 | 考試及格得獎學金100~500💰</div>
                </div>
              </div>
            </button>

            {/* Cleaning */}
            <button onClick={doCleaning} className="w-full pixel-border bg-pixel-charcoal hover:bg-pixel-darkblue p-2 text-left cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧹</span>
                <div className="flex-1">
                  <div className="font-vt text-pixel-white text-base">打工掃地</div>
                  <div className="font-vt text-pixel-gray text-xs">消耗10體力 | 賺30~80💰</div>
                  <div className="font-vt text-pixel-cyan text-xs">❤️體力+1 | 10%機率撿到遺失物+50💰</div>
                </div>
              </div>
            </button>

            {/* Coach Juniors */}
            <button onClick={doCoach} className={`w-full pixel-border p-2 text-left transition-colors ${c.totalTrainings>=30?'bg-pixel-charcoal hover:bg-pixel-darkblue cursor-pointer':'bg-pixel-dark opacity-40 cursor-not-allowed'}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">🏫</span>
                <div className="flex-1">
                  <div className="font-vt text-pixel-white text-base flex items-center gap-1">
                    教學弟妹
                    {(c.totalTrainings<30)&&<span className="text-[9px] bg-pixel-purple text-pixel-white px-1 rounded font-pixel">🔒 訓練{c.totalTrainings}/30</span>}
                  </div>
                  <div className="font-vt text-pixel-gray text-xs">消耗15體力 | 賺80~150💰</div>
                  <div className="font-vt text-pixel-cyan text-xs">🎯技術+1 🧠穩定+1 | 教學相長！</div>
                </div>
              </div>
            </button>
          </>}

          {tab==='play'&&<>
            {/* Pool */}
            <button onClick={doPool} className="w-full pixel-border bg-pixel-charcoal hover:bg-pixel-darkblue p-2 text-left cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎱</span>
                <div className="flex-1">
                  <div className="font-vt text-pixel-white text-base">撞球比賽</div>
                  <div className="font-vt text-pixel-gray text-xs">報名費50💰 | 贏得120💰（淨賺70）</div>
                  <div className="font-vt text-pixel-cyan text-xs">勝率：{Math.min(85,Math.round(50+c.stats.stb*0.3))}% | 贏了🧠穩定+1</div>
                </div>
              </div>
            </button>

            {/* Gacha */}
            <div className="pixel-border bg-pixel-charcoal p-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🎰</span>
                <div className="flex-1">
                  <div className="font-vt text-pixel-white text-base">扭蛋機</div>
                  <div className="font-vt text-pixel-gray text-xs">每次100💰 | 已轉{c.gachaCount||0}次</div>
                </div>
              </div>
              <div className="font-vt text-pixel-light text-xs mb-2 grid grid-cols-2 gap-x-2">
                <span>🥤 能量飲料 40%</span><span>💰 小獎金 25%</span>
                <span>🥛 蛋白粉 15%</span><span>⬆️ 屬性+2 10%</span>
                <span>👑 稀有裝備 5%</span><span>🎉 大獎500💰 5%</span>
              </div>
              {gachaAnim&&(
                <div className="text-center py-4">
                  <div className="text-4xl bounce">🔮</div>
                  <div className="font-pixel text-pixel-gold text-[9px] mt-2 blink">轉轉轉...</div>
                </div>
              )}
              {gachaResult&&!gachaAnim&&(
                <div className={`text-center py-2 pop-in ${gachaResult.rare?'pixel-border-gold':''}`}>
                  <div className="font-vt text-lg" style={{color:gachaResult.rare?'#f4d03f':'#a7f070'}}>{gachaResult.text}</div>
                </div>
              )}
              <button onClick={doGacha} disabled={gachaAnim||(c.money<100)}
                className={`w-full pixel-btn py-1.5 text-[10px] font-pixel mt-1 ${c.money>=100&&!gachaAnim?'bg-pixel-purple text-pixel-white hover:bg-pixel-red':'bg-pixel-dark text-pixel-gray cursor-not-allowed'}`}>
                🎰 投幣轉蛋！（100💰）
              </button>
            </div>
          </>}

          {tab==='invest'&&<>
            {/* ETF */}
            <div className="pixel-border bg-pixel-charcoal p-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📈</span>
                <div className="flex-1">
                  <div className="font-vt text-pixel-white text-base">ETF 投資</div>
                  <div className="font-vt text-pixel-gray text-xs">目前股價：{etfPrice}💰/股 | 持有：{c.etf?.shares||0}股</div>
                  {c.etf?.shares>0&&<div className="font-vt text-xs" style={{color:etfPrice>=(c.etf.buyPrice||0)?'#38b764':'#b13e53'}}>
                    均價{c.etf.buyPrice} | 市值{(c.etf.shares||0)*etfPrice}💰 | {etfPrice>=(c.etf.buyPrice||0)?'▲':'▼'}{Math.abs((c.etf.shares||0)*(etfPrice-(c.etf.buyPrice||0)))}💰
                  </div>}
                </div>
              </div>
              {/* Simple price chart */}
              <div className="pixel-border bg-pixel-dark p-1 mb-2" style={{height:60}}>
                <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
                  {(c.etf?.prices||[100]).length>1&&(()=>{
                    const ps=c.etf.prices;
                    const mn=Math.min(...ps),mx=Math.max(...ps);
                    const range=mx-mn||1;
                    const pts=ps.map((p,i)=>`${i/(ps.length-1)*100},${50-(p-mn)/range*45}`).join(' ');
                    return <polyline points={pts} fill="none" stroke={ps[ps.length-1]>=ps[0]?'#38b764':'#b13e53'} strokeWidth="2"/>;
                  })()}
                </svg>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <span className="font-vt text-pixel-light text-sm">數量：</span>
                {[1,5,10].map(n=>(
                  <button key={n} onClick={()=>setEtfBuyAmt(n)}
                    className={`pixel-btn px-2 py-0.5 text-[9px] font-pixel ${etfBuyAmt===n?'bg-pixel-darkblue text-pixel-cyan':'bg-pixel-charcoal text-pixel-gray'}`}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                <button onClick={buyETF} disabled={c.money<etfPrice*etfBuyAmt}
                  className={`flex-1 pixel-btn py-1 text-[10px] font-pixel ${c.money>=etfPrice*etfBuyAmt?'bg-pixel-green text-pixel-dark':'bg-pixel-dark text-pixel-gray cursor-not-allowed'}`}>
                  買入 {etfBuyAmt}股（{etfPrice*etfBuyAmt}💰）
                </button>
                <button onClick={sellETF} disabled={!c.etf?.shares||c.etf.shares<etfBuyAmt}
                  className={`flex-1 pixel-btn py-1 text-[10px] font-pixel ${c.etf?.shares>=etfBuyAmt?'bg-pixel-red text-pixel-white':'bg-pixel-dark text-pixel-gray cursor-not-allowed'}`}>
                  賣出 {etfBuyAmt}股（{etfPrice*etfBuyAmt}💰）
                </button>
              </div>
            </div>
          </>}
        </div>

        <MsgLog messages={msgs}/>
      </div>
    </div>
  );
}

// ── POOL HALL ──