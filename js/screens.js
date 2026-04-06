/* ═══════════════════════════════════════
   SCREENS
   ═══════════════════════════════════════ */

// ── TITLE ──
function TitleScreen({onNew,onLoad,hasSave}){
  const[show,setShow]=useState(false);
  const[frame,setFrame]=useState(0);
  useEffect(()=>{setTimeout(()=>setShow(true),200)},[]);
  useEffect(()=>{const t=setInterval(()=>setFrame(f=>(f+1)%60),80);return()=>clearInterval(t)},[]);

  // Breathing / power animation
  const breathY=Math.sin(frame*.15)*2;
  const blink=frame%30===0||frame%30===1;
  const sparkOn=frame%15<8;

  return(
    <div className="h-screen relative overflow-hidden select-none" style={{background:'linear-gradient(180deg,#1a237e 0%,#283593 25%,#3949ab 50%,#5c6bc0 100%)'}}>
      {/* ═══ FULL SCREEN SVG CARTOON ═══ */}
      <svg viewBox="0 0 400 700" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Gradients */}
          <radialGradient id="spotlight" cx="50%" cy="20%" r="60%">
            <stop offset="0%" stopColor="#fff" stopOpacity=".12"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd740" stopOpacity=".6"/>
            <stop offset="100%" stopColor="#ffd740" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="platform" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8d6e3f"/>
            <stop offset="100%" stopColor="#5d4225"/>
          </linearGradient>
          <linearGradient id="singlet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1565c0"/>
            <stop offset="100%" stopColor="#0d47a1"/>
          </linearGradient>
          <filter id="shadow"><feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity=".3"/></filter>
          <filter id="titleglow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── Background: Arena ── */}
        <rect width="400" height="700" fill="url(#spotlight)"/>

        {/* Stadium tier rows */}
        <rect x="0" y="0" width="400" height="80" fill="#1a237e" opacity=".8"/>
        <rect x="0" y="80" width="400" height="50" fill="#283593" opacity=".5"/>
        {/* Audience dots (back rows) */}
        {Array.from({length:20},(_, i)=>(
          <React.Fragment key={`ab${i}`}>
            <circle cx={i*21+10} cy={50+Math.sin(i*1.5+frame*.12)*2} r="5" fill={['#e57373','#64b5f6','#81c784','#fff176','#ce93d8'][i%5]} opacity=".35"/>
            <circle cx={i*21+10} cy={90+Math.sin(i*1.2+frame*.1)*1.5} r="5.5" fill={['#64b5f6','#fff176','#e57373','#ce93d8','#81c784'][i%5]} opacity=".3"/>
          </React.Fragment>
        ))}

        {/* Olympic Rings */}
        <g transform="translate(145,25)" opacity=".7">
          {[{cx:0,cy:0,c:'#0081C8'},{cx:25,cy:0,c:'#000'},{cx:50,cy:0,c:'#EE334E'},{cx:12,cy:14,c:'#FCB131'},{cx:37,cy:14,c:'#00A651'}].map((r,i)=>(
            <circle key={i} cx={r.cx+18} cy={r.cy+10} r="10" fill="none" stroke={r.c} strokeWidth="2.5"/>
          ))}
        </g>

        {/* Spotlights */}
        <polygon points="170,0 230,0 300,300 100,300" fill="white" opacity=".04"/>
        <polygon points="190,0 210,0 260,250 140,250" fill="white" opacity=".03"/>

        {/* ── Platform ── */}
        <rect x="80" y="500" width="240" height="20" rx="3" fill="url(#platform)" filter="url(#shadow)"/>
        <rect x="90" y="510" width="220" height="8" rx="2" fill="#a0845c" opacity=".3"/>
        {/* Platform side */}
        <rect x="80" y="518" width="240" height="10" fill="#3e2b15" rx="2"/>

        {/* ── CUTE CHIBI LIFTER ── */}
        <g transform={`translate(200,${410+breathY})`} filter="url(#shadow)">
          {/* === BARBELL (overhead) === */}
          <g transform={`translate(0,${-90+breathY*0.5})`}>
            {/* Bar */}
            <rect x="-120" y="-3" width="240" height="6" rx="3" fill="#b0bec5" stroke="#78909c" strokeWidth="1"/>
            {/* Grip marks */}
            <rect x="-30" y="-4" width="8" height="8" rx="1" fill="#90a4ae"/>
            <rect x="22" y="-4" width="8" height="8" rx="1" fill="#90a4ae"/>
            {/* Left plates */}
            <rect x="-130" y="-22" width="14" height="44" rx="3" fill="#ef5350" stroke="#c62828" strokeWidth="1.5"/>
            <rect x="-118" y="-18" width="10" height="36" rx="2" fill="#42a5f5" stroke="#1565c0" strokeWidth="1.5"/>
            <rect x="-110" y="-14" width="8" height="28" rx="2" fill="#66bb6a" stroke="#2e7d32" strokeWidth="1.5"/>
            {/* Right plates */}
            <rect x="116" y="-22" width="14" height="44" rx="3" fill="#ef5350" stroke="#c62828" strokeWidth="1.5"/>
            <rect x="108" y="-18" width="10" height="36" rx="2" fill="#42a5f5" stroke="#1565c0" strokeWidth="1.5"/>
            <rect x="102" y="-14" width="8" height="28" rx="2" fill="#66bb6a" stroke="#2e7d32" strokeWidth="1.5"/>
          </g>

          {/* === ARMS (reaching up) === */}
          {/* Left arm */}
          <path d={`M-30,-20 Q-55,-60 -65,${-88+breathY*0.5}`} stroke="#ffcc80" strokeWidth="16" fill="none" strokeLinecap="round"/>
          {/* Right arm */}
          <path d={`M30,-20 Q55,-60 65,${-88+breathY*0.5}`} stroke="#ffcc80" strokeWidth="16" fill="none" strokeLinecap="round"/>
          {/* Hands */}
          <circle cx="-65" cy={-90+breathY*0.5} r="9" fill="#ffcc80" stroke="#f9a825" strokeWidth="1"/>
          <circle cx="65" cy={-90+breathY*0.5} r="9" fill="#ffcc80" stroke="#f9a825" strokeWidth="1"/>

          {/* === HEAD (big cute chibi head!) === */}
          <g transform="translate(0,-45)">
            {/* Head shape */}
            <ellipse cx="0" cy="0" rx="38" ry="35" fill="#ffcc80" stroke="#f9a825" strokeWidth="2"/>
            {/* Hair */}
            <ellipse cx="0" cy="-22" rx="36" ry="18" fill="#37474f"/>
            <rect x="-36" y="-28" width="72" height="12" rx="6" fill="#37474f"/>
            {/* Headband */}
            <rect x="-34" y="-12" width="68" height="6" rx="3" fill="#ef5350"/>
            {/* Sweat drop */}
            {sparkOn&&<ellipse cx="35" cy="-5" rx="4" ry="6" fill="#bbdefb" opacity=".8"/>}

            {/* Eyes (big cute anime eyes) */}
            <g>
              {/* Left eye */}
              <ellipse cx="-13" cy="2" rx={blink?"8":"8"} ry={blink?"2":"9"} fill="white"/>
              <ellipse cx="-13" cy={blink?"2":"3"} rx={blink?"6":"5.5"} ry={blink?"1.5":"6"} fill="#263238"/>
              {!blink&&<ellipse cx="-11" cy="0" rx="2" ry="2.5" fill="white"/>}
              {/* Right eye */}
              <ellipse cx="13" cy="2" rx={blink?"8":"8"} ry={blink?"2":"9"} fill="white"/>
              <ellipse cx="13" cy={blink?"2":"3"} rx={blink?"6":"5.5"} ry={blink?"1.5":"6"} fill="#263238"/>
              {!blink&&<ellipse cx="15" cy="0" rx="2" ry="2.5" fill="white"/>}
            </g>

            {/* Eyebrows (determined!) */}
            <line x1="-20" y1="-10" x2="-6" y2="-8" stroke="#37474f" strokeWidth="3" strokeLinecap="round"/>
            <line x1="6" y1="-8" x2="20" y2="-10" stroke="#37474f" strokeWidth="3" strokeLinecap="round"/>

            {/* Mouth (grinning!) */}
            <path d="M-10,16 Q0,26 10,16" stroke="#c62828" strokeWidth="2.5" fill="#ef5350" strokeLinecap="round"/>
            {/* Tooth */}
            <rect x="-3" y="15" width="6" height="4" rx="1" fill="white"/>

            {/* Blush */}
            <ellipse cx="-22" cy="12" rx="7" ry="4" fill="#ef9a9a" opacity=".5"/>
            <ellipse cx="22" cy="12" rx="7" ry="4" fill="#ef9a9a" opacity=".5"/>
          </g>

          {/* === BODY (singlet) === */}
          <rect x="-28" y="-15" width="56" height="55" rx="8" fill="url(#singlet)" stroke="#0d47a1" strokeWidth="2"/>
          {/* Singlet straps */}
          <line x1="-15" y1="-15" x2="-20" y2="-30" stroke="#1565c0" strokeWidth="6" strokeLinecap="round"/>
          <line x1="15" y1="-15" x2="20" y2="-30" stroke="#1565c0" strokeWidth="6" strokeLinecap="round"/>
          {/* Country badge */}
          <rect x="-14" y="5" width="28" height="14" rx="3" fill="#0d47a1" stroke="#ffd740" strokeWidth="1"/>
          <text x="0" y="15" textAnchor="middle" fill="#ffd740" fontSize="9" fontWeight="bold" fontFamily="sans-serif">TPE</text>

          {/* Belt */}
          <rect x="-30" y="30" width="60" height="10" rx="3" fill="#5d4037" stroke="#3e2723" strokeWidth="1"/>
          <rect x="-4" y="31" width="8" height="8" rx="1.5" fill="#ffd740"/>

          {/* === LEGS (squatting wide) === */}
          {/* Left leg */}
          <path d="M-15,40 Q-35,60 -40,80" stroke="#263238" strokeWidth="18" fill="none" strokeLinecap="round"/>
          {/* Right leg */}
          <path d="M15,40 Q35,60 40,80" stroke="#263238" strokeWidth="18" fill="none" strokeLinecap="round"/>

          {/* === SHOES === */}
          <rect x="-52" y="75" width="28" height="14" rx="4" fill="#ef5350" stroke="#c62828" strokeWidth="1.5"/>
          <rect x="24" y="75" width="28" height="14" rx="4" fill="#ef5350" stroke="#c62828" strokeWidth="1.5"/>
          <rect x="-52" y="75" width="28" height="6" rx="3" fill="#ef9a9a" opacity=".3"/>
          <rect x="24" y="75" width="28" height="6" rx="3" fill="#ef9a9a" opacity=".3"/>
        </g>

        {/* Power sparkles around lifter */}
        {sparkOn&&<>
          <polygon points="110,350 115,340 120,350 115,345" fill="#ffd740" opacity=".7"/>
          <polygon points="280,360 285,350 290,360 285,355" fill="#ffd740" opacity=".6"/>
          <polygon points="130,410 133,402 136,410 133,406" fill="#fff" opacity=".5"/>
          <polygon points="265,400 268,392 271,400 268,396" fill="#fff" opacity=".5"/>
          <circle cx="100" cy="380" r="3" fill="#ffd740" opacity=".4"/>
          <circle cx="300" cy="370" r="3" fill="#ffd740" opacity=".4"/>
        </>}

        {/* Golden glow behind lifter */}
        <ellipse cx="200" cy="400" rx="100" ry="60" fill="url(#glow)" opacity=".3"/>

        {/* ── Crowd front rows ── */}
        {Array.from({length:16},(_, i)=>{
          const cx=i*27+13;const colors=['#e57373','#64b5f6','#81c784','#fff176','#ce93d8','#ffcc80','#80deea','#a5d6a7'];
          const col=colors[i%colors.length];const wave=Math.sin(i*1.3+frame*.15)*3;
          return(
            <React.Fragment key={`cf${i}`}>
              {/* Head */}
              <circle cx={cx} cy={560+wave} r="8" fill={col} opacity=".5"/>
              {/* Body */}
              <rect x={cx-7} y={565+wave} width="14" height="18" rx="4" fill={col} opacity=".4"/>
              {/* Waving arm (some of them) */}
              {i%3===0&&<line x1={cx+6} y1={558+wave} x2={cx+12} y2={548+wave+Math.sin(frame*.3+i)*4} stroke={col} strokeWidth="3" strokeLinecap="round" opacity=".4"/>}
            </React.Fragment>
          );
        })}
        {/* Front row */}
        {Array.from({length:12},(_, i)=>{
          const cx=i*35+18;const colors=['#ffcc80','#80deea','#ce93d8','#a5d6a7','#ef9a9a','#90caf9','#fff59d','#b39ddb'];
          const col=colors[i%colors.length];const wave=Math.sin(i+frame*.12)*2;
          return(
            <React.Fragment key={`cf2${i}`}>
              <circle cx={cx} cy={600+wave} r="10" fill={col} opacity=".55"/>
              <rect x={cx-9} y={607+wave} width="18" height="25" rx="5" fill={col} opacity=".45"/>
              {i%2===0&&<line x1={cx-7} y1={598+wave} x2={cx-13} y2={585+wave+Math.sin(frame*.25+i)*5} stroke={col} strokeWidth="3.5" strokeLinecap="round" opacity=".45"/>}
            </React.Fragment>
          );
        })}

        {/* Floor */}
        <rect x="0" y="640" width="400" height="60" fill="#1a237e" opacity=".6"/>
      </svg>

      {/* ═══ TITLE TEXT ═══ */}
      <div className={`absolute inset-0 flex flex-col items-center pt-[12%] md:pt-[8%] transition-all duration-1000 ${show?'opacity-100':'opacity-0'}`} style={{pointerEvents:'none'}}>
        <h1 className="font-pixel text-3xl md:text-5xl text-center relative z-10"
          style={{color:'#ffd740',textShadow:'0 0 40px rgba(255,215,64,.5),4px 4px 0 #8a6010',animation:'glow 3s ease-in-out infinite'}}>
          一舉成名
        </h1>
      </div>

      {/* ═══ BUTTONS ═══ */}
      <div className={`absolute bottom-[10%] md:bottom-[12%] left-1/2 -translate-x-1/2 flex flex-col gap-3 items-center z-20 transition-all duration-700 ${show?'opacity-100 translate-y-0':'opacity-0 translate-y-6'}`}
        style={{transitionDelay:'1s'}}>
        <button onClick={()=>{sfx('click');onNew()}}
          className="pixel-btn pixel-btn-gold bg-pixel-dark bg-opacity-80 text-pixel-gold px-12 py-3 text-xs font-pixel backdrop-blur-sm hover:bg-opacity-100"
          style={{boxShadow:'inset -4px -4px 0 0 #c8a415,inset 4px 4px 0 0 #ffed8a,0 4px 0 0 #c8a415,0 0 25px rgba(255,215,64,.25)'}}>
          🎮 新遊戲
        </button>
        {hasSave&&(
          <button onClick={()=>{sfx('click');onLoad()}}
            className="pixel-btn bg-pixel-charcoal bg-opacity-80 text-pixel-light px-12 py-3 text-xs font-pixel backdrop-blur-sm">
            📂 繼續遊戲
          </button>
        )}
      </div>

      {/* Bottom text */}
      <div className={`absolute bottom-[3%] left-0 right-0 text-center z-10 transition-opacity duration-700 ${show?'opacity-100':'opacity-0'}`} style={{transitionDelay:'1.3s'}}>
        <p className="font-pixel text-white text-[7px] blink tracking-wider opacity-60">▶ PRESS START</p>
        <p className="font-vt text-white text-sm mt-1 opacity-50">從新手到奧運冠軍的舉重養成遊戲</p>
      </div>
    </div>
  );
}

// ── CREATE ──
function CreateScreen({onConfirm}){
  const[name,setName]=useState('');
  const[gender,setGender]=useState('male');
  const[wc,setWc]=useState(WC.male[3]);
  const[avatar,setAvatar]=useState('cat');
  const cls=WC[gender];
  useEffect(()=>{setWc(cls[Math.floor(cls.length/2)])},[gender]);
  const[coach,setCoach]=useState(true);
  return(
    <div className="h-screen flex flex-col items-center justify-center bg-pixel-dark p-4 overflow-auto">
      {coach&&<CoachDialog text="歡迎！我是教練，一起拿金牌吧！🏆"
        onClose={()=>setCoach(false)}/>}
      <div className="pixel-border-gold bg-pixel-charcoal p-5 md:p-8 w-full max-w-md slide-up">
        <h2 className="font-pixel text-pixel-gold text-center text-xs mb-4">✨ 創建你的選手 ✨</h2>
        <div className="flex justify-center mb-4">
          <CharAvatar charId={avatar} size={100} selected/>
        </div>
        <div className="mb-4">
          <label className="font-vt text-pixel-light text-lg block mb-2">選擇角色</label>
          <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
            {CHARACTERS.map(ch=>(
              <button key={ch.id} onClick={()=>{sfx('tap');setAvatar(ch.id)}}
                className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all min-w-[80px]
                  ${avatar===ch.id?'border-pixel-gold bg-pixel-darkblue scale-105':'border-pixel-gray bg-pixel-dark hover:border-pixel-light'}`}>
                <CharAvatar charId={ch.id} size={50} selected={avatar===ch.id}/>
                <span className="font-vt text-xs mt-1" style={{color:avatar===ch.id?'#f4d03f':'#94b0c2'}}>{ch.name}</span>
              </button>
            ))}
          </div>
          <div className="text-center font-vt text-pixel-cyan text-sm mt-1">
            {CHARACTERS.find(ch=>ch.id===avatar)?.desc}
          </div>
        </div>
        <div className="mb-4">
          <label className="font-vt text-pixel-light text-lg block mb-1">👤 選手姓名</label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="輸入你的名字..."
            className="w-full bg-pixel-dark border-2 border-pixel-gray text-pixel-white font-vt text-xl px-3 py-2 focus:border-pixel-gold focus:outline-none"/>
        </div>
        <div className="mb-4">
          <label className="font-vt text-pixel-light text-lg block mb-1">⚧ 性別</label>
          <div className="flex gap-2">
            {[['male','♂ 男子'],['female','♀ 女子']].map(([v,l])=>(
              <button key={v} onClick={()=>{sfx('tap');setGender(v)}}
                className={`flex-1 py-2 font-vt text-xl border-2 transition-colors ${gender===v?'bg-pixel-darkblue border-pixel-gold text-pixel-gold':'bg-pixel-dark border-pixel-gray text-pixel-light hover:border-pixel-light'}`}>{l}</button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <label className="font-vt text-pixel-light text-lg block mb-1">⚖️ 量級（IWF 2024）</label>
          <div className="grid grid-cols-2 gap-1.5">
            {cls.map(w=>(
              <button key={w} onClick={()=>{sfx('tap');setWc(w)}}
                className={`py-1 font-vt text-lg border-2 transition-colors ${wc===w?'bg-pixel-darkblue border-pixel-gold text-pixel-gold':'bg-pixel-dark border-pixel-gray text-pixel-light hover:border-pixel-light'}`}>{w}</button>
            ))}
          </div>
        </div>
        <button onClick={()=>{if(name.trim()){sfx('success');onConfirm(name.trim(),gender,wc,avatar)}}} disabled={!name.trim()}
          className={`w-full pixel-btn pixel-btn-gold py-3 text-[10px] font-pixel ${name.trim()?'bg-pixel-dark text-pixel-gold':'bg-pixel-charcoal text-pixel-gray cursor-not-allowed'}`}>
          💪 開始訓練之旅！
        </button>
      </div>
    </div>
  );
}

// ── HUB ──
function Hub({c,setC,go}){
  const ms=maxSta(c.stats.sta);
  const[toast,setToast]=useState(null);
  const[dailyEv,setDailyEv]=useState(null);
  const[coachTip,setCoachTip]=useState(null);
  const[newAch,setNewAch]=useState(null);
  const[hovered,setHovered]=useState(null);
  const[storyEvent,setStoryEvent]=useState(null);
  const season=getSeason(c.day);

  // Check achievements
  useEffect(()=>{
    for(const a of ACHIEVEMENTS){
      if(!c.achievements.includes(a.id)&&a.check(c)){
        setC(x=>({...x,achievements:[...x.achievements,a.id]}));setNewAch(a);break;
      }
    }
  },[c.day,c.totalTrainings,c.totalComps,c.medals.length]);

  // Check story events
  useEffect(()=>{
    if(!c)return;
    for(const ev of STORY_EVENTS){
      if(c.seenStories&&c.seenStories[ev.id])continue;
      let triggered=false;
      if(ev.trigger==='day'&&c.day>=ev.value)triggered=true;
      else if(ev.trigger==='trains'&&c.totalTrainings>=ev.value)triggered=true;
      else if(ev.trigger==='comps'&&c.totalComps>=ev.value)triggered=true;
      else if(ev.trigger==='medals'&&c.medals.length>=ev.value)triggered=true;
      else if(ev.trigger==='eventLevel'&&c.eventLevel>=ev.value)triggered=true;
      else if(ev.trigger==='fatigue'&&c.fatigue>=ev.value)triggered=true;
      else if(ev.trigger==='streak'&&c.streak>=ev.value)triggered=true;
      else if(ev.trigger==='money'&&c.money>=ev.value)triggered=true;
      else if(ev.trigger==='custom'){
        try{triggered=new Function('c','return '+ev.check)(c)}catch(e){}
      }
      if(triggered){
        setStoryEvent(ev);
        setC(x=>({...x,seenStories:{...(x.seenStories||{}), [ev.id]:true}}));
        sfx('levelup');
        break;
      }
    }
  },[c.day,c.totalTrainings,c.totalComps,c.medals.length,c.eventLevel]);

  // Update motor learning stage
  useEffect(()=>{
    const t=c.totalTrainings;
    const stage=t>=100?3:t>=50?2:t>=20?1:0;
    if(stage!==c.motorStage)setC(x=>({...x,motorStage:stage}));
  },[c.totalTrainings]);

  // Daily event
  useEffect(()=>{
    // Update ETF price each day
    if(c.etf&&c.etf.prices){
      const lastP=c.etf.prices[c.etf.prices.length-1]||100;
      const change=(Math.random()*20-9)/100; // avg +1% bias, range -9% to +11%
      const newP=Math.max(10,Math.round(lastP*(1+change)));
      const prices=[...c.etf.prices,newP].slice(-10);
      if(prices.length>c.etf.prices.length||prices[prices.length-1]!==c.etf.prices[c.etf.prices.length-1]){
        setC(x=>({...x,etf:{...x.etf,prices}}));
      }
    }
    if(c.day>1&&!c.seenEv[c.day]&&Math.random()<.35){
      const ev=EVENTS_RANDOM[Math.floor(Math.random()*EVENTS_RANDOM.length)];
      setDailyEv(ev);
      const nc={...c,seenEv:{...c.seenEv,[c.day]:true}};
      if(ev.effect==='sta')nc.stamina=Math.min(ms,nc.stamina+ev.value);
      else if(ev.effect==='money')nc.money+=ev.value;
      else if(ev.effect==='stb')nc.stats={...nc.stats,stb:Math.min(100,nc.stats.stb+ev.value)};
      else if(ev.effect==='rec')nc.stats={...nc.stats,rec:Math.min(100,nc.stats.rec+ev.value)};
      else if(ev.effect==='tec')nc.stats={...nc.stats,tec:Math.min(100,nc.stats.tec+ev.value)};
      setC(nc);
    }
  },[]);

  // Coach tip
  useEffect(()=>{
    if(c.day%3===0&&!coachTip){
      const tip=COACH_TIPS[c.coachIdx%COACH_TIPS.length];
      setCoachTip(tip);
    }
  },[]);

  // Map locations
  const locations=[
    // ── Row 1: Top (y:8) ──
    {id:'status',icon:'📊',label:'狀態',x:15,y:8,action:()=>{sfx('click');go('status')},tip:'查看能力值和成長紀錄'},
    {id:'wangfund',icon:'🏦',label:'老王基金會',x:50,y:8,locked:c.eventLevel<4,
      action:()=>{if(c.eventLevel<4){sfx('fail');setToast({text:'🔒 世界賽等級！',type:'fail'});return}sfx('click');go('wangfund')},tip:'🔒 世界賽解鎖'},
    {id:'arena',icon:'🏟️',label:'比賽場',x:85,y:8,action:()=>{sfx('click');go('comp')},tip:'參加舉重比賽！'},
    // ── Row 2 (y:28) ──
    {id:'friend',icon:'🏘️',label:'朋友家',x:10,y:28,action:()=>{sfx('click');go('friend')},tip:'麻將、電動、唱歌'},
    {id:'gym',icon:'🏋️',label:'訓練場',x:35,y:28,action:()=>{sfx('click');go('training')},tip:'訓練提升實力'},
    {id:'nstc',icon:'🏛️',label:'國訓中心',x:65,y:28,action:()=>{sfx('click');go('nstc')},tip:'國訓中心！可參觀'},
    {id:'hengzhai',icon:'🏗️',label:'衡宅',x:90,y:28,locked:(c.totalTrainings||0)<20,
      action:()=>{if((c.totalTrainings||0)<20){sfx('fail');setToast({text:'🔒 訓練20次！',type:'fail'});return}sfx('click');go('hengzhai')},tip:'🔒 訓練20次解鎖'},
    // ── Row 3 (y:48) ──
    {id:'jobs',icon:'💼',label:'打工',x:10,y:48,action:()=>{sfx('click');go('jobs')},tip:'打工賺錢'},
    {id:'shop',icon:'🏪',label:'商店',x:35,y:48,action:()=>{sfx('click');go('shop')},tip:'購買裝備'},
    {id:'laundry',icon:'👕',label:'C&R WASH',x:60,y:48,action:()=>{sfx('click');go('laundry')},tip:'洗衣服！'},
    {id:'restaurant',icon:'🍜',label:'餐廳',x:85,y:48,action:()=>{sfx('click');go('restaurant')},tip:'吃飯補體力'},
    // ── Row 4 (y:68) ──
    {id:'tianliao',icon:'⛰️',label:'田寮移訓',x:10,y:68,action:()=>{sfx('click');go('tianliao')},tip:'阿公闖關！'},
    {id:'pool',icon:'🎱',label:'撞球館',x:35,y:68,action:()=>{sfx('click');go('pool')},tip:'打撞球'},
    {id:'cafe',icon:'☕',label:'肆拾而立',x:60,y:68,action:()=>{sfx('click');go('cafe')},tip:'喝咖啡'},
    {id:'river',icon:'🎣',label:'釣魚河',x:85,y:68,action:()=>{sfx('click');go('river')},tip:'河邊放鬆'},
    // ── Row 5: Bottom (y:88) ──
    {id:'mituo',icon:'🌊',label:'彌陀基地',x:25,y:88,action:()=>{sfx('click');go('mituo')},tip:'阿嬤愛心補給'},
    {id:'home',icon:'🏠',label:'我的家',x:55,y:88,action:()=>{sfx('click');go('home')},tip:'回家休息'},
  ];

  function save(){localStorage.setItem('wl_save',JSON.stringify(c));sfx('coin');setToast({text:'💾 已存檔！',type:'success'})}

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-hidden">
      {toast&&<Toast text={toast.text} type={toast.type} onDone={()=>setToast(null)}/>}
      {newAch&&<AchievementPopup a={newAch} onClose={()=>setNewAch(null)}/>}
      {dailyEv&&<CoachDialog text={`${dailyEv.emoji} ${dailyEv.text}`} onClose={()=>setDailyEv(null)}/>}
      {coachTip&&<CoachDialog text={coachTip.text}
        onClose={()=>{setCoachTip(null);setC(x=>({...x,coachIdx:x.coachIdx+1}))}}/>}

      {storyEvent&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={()=>setStoryEvent(null)}>
          <div className="pop-in text-center p-6 max-w-xs">
            <div className="text-6xl mb-3">{storyEvent.emoji}</div>
            <div className="font-pixel text-pixel-gold text-sm mb-2" style={{textShadow:'2px 2px 0 #000'}}>
              {storyEvent.text}
            </div>
            <div className="font-vt text-pixel-light text-xs mt-3 blink">點擊繼續</div>
          </div>
        </div>
      )}

      {/* Map fills all space above bottom bar */}
      <div className="relative flex-1" style={{minHeight:0}}>
        {/* ════ CARTOON MAP ════ */}
        <div className="absolute inset-0 overflow-hidden" style={{background:'#87CEEB'}}>

          {/* Full SVG Map Background */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={season.name==='冬季'?'#b0c4de':season.name==='秋季'?'#e8c17a':season.name==='夏季'?'#5ec4f0':'#7ec8e3'}/>
                <stop offset="100%" stopColor={season.name==='冬季'?'#d0dce8':season.name==='秋季'?'#f0d8a0':season.name==='夏季'?'#a8e6f0':'#b8e6d0'}/>
              </linearGradient>
              <linearGradient id="grass1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7ec850"/>
                <stop offset="100%" stopColor="#5aad36"/>
              </linearGradient>
              <linearGradient id="grass2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6ab840"/>
                <stop offset="100%" stopColor="#4a9a2a"/>
              </linearGradient>
              <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8ed068"/>
                <stop offset="100%" stopColor="#6ab848"/>
              </linearGradient>
              <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#72c048"/>
                <stop offset="100%" stopColor="#58a830"/>
              </linearGradient>
              <linearGradient id="pond" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4fc3f7"/>
                <stop offset="100%" stopColor="#0288d1"/>
              </linearGradient>
              <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e8d5a3"/>
                <stop offset="100%" stopColor="#d4b880"/>
              </linearGradient>
              <filter id="mapShadow"><feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity=".15"/></filter>
              <radialGradient id="sun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff9c4"/>
                <stop offset="60%" stopColor="#fff176" stopOpacity=".6"/>
                <stop offset="100%" stopColor="#fff176" stopOpacity="0"/>
              </radialGradient>
            </defs>

            {/* Sky */}
            <rect width="1000" height="700" fill="url(#sky)"/>

            {/* Sun */}
            <circle cx="120" cy="80" r="60" fill="url(#sun)"/>
            <circle cx="120" cy="80" r="25" fill="#fff9c4"/>

            {/* Clouds - animated drift */}
            <g style={{animation:'cloud-drift 8s ease-in-out infinite alternate'}}>
              <ellipse cx="250" cy="65" rx="60" ry="22" fill="white" opacity=".85"/>
              <ellipse cx="225" cy="55" rx="35" ry="18" fill="white" opacity=".9"/>
              <ellipse cx="275" cy="58" rx="30" ry="16" fill="white" opacity=".88"/>
            </g>
            <g style={{animation:'cloud-drift2 10s ease-in-out infinite alternate'}}>
              <ellipse cx="700" cy="50" rx="50" ry="18" fill="white" opacity=".8"/>
              <ellipse cx="680" cy="42" rx="30" ry="15" fill="white" opacity=".85"/>
              <ellipse cx="730" cy="44" rx="28" ry="14" fill="white" opacity=".82"/>
            </g>
            <g style={{animation:'cloud-drift 12s ease-in-out infinite alternate'}}>
              <ellipse cx="500" cy="35" rx="45" ry="16" fill="white" opacity=".7"/>
              <ellipse cx="480" cy="28" rx="28" ry="13" fill="white" opacity=".75"/>
            </g>

            {/* Far hills */}
            <path d="M0,280 Q100,200 200,250 Q320,180 450,230 Q550,190 650,240 Q780,175 900,220 Q950,210 1000,250 L1000,350 L0,350Z" fill="url(#hillFar)" opacity=".7"/>
            {/* Mid hills */}
            <path d="M0,310 Q80,260 180,290 Q280,240 400,280 Q500,250 620,285 Q750,230 870,270 Q950,250 1000,290 L1000,380 L0,380Z" fill="url(#hillMid)" opacity=".8"/>

            {/* Main ground */}
            <path d="M0,350 Q200,330 400,345 Q600,325 800,340 Q900,330 1000,350 L1000,700 L0,700Z" fill="url(#grass1)"/>
            {/* Grass texture zones */}
            <path d="M0,400 Q150,380 300,395 Q500,375 700,390 Q850,380 1000,400 L1000,700 L0,700Z" fill="url(#grass2)" opacity=".5"/>

            {/* Dark grass accents */}
            {[[50,420,120],[200,480,90],[380,440,100],[550,500,80],[700,460,110],[850,520,95],[150,560,70],[450,580,85],[650,600,75],[900,580,60]].map(([cx,cy,w],i)=>
              <ellipse key={'ga'+i} cx={cx} cy={cy} rx={w} ry={12} fill="#4a9a2a" opacity=".2"/>
            )}

            {/* ── Winding paths ── */}
            <g fill="none" stroke="url(#pathGrad)" strokeLinecap="round">
              {/* Main vertical path: home(50%,78%) to center(50%,50%) */}
              <path d="M500,546 Q480,490 490,440 Q500,400 510,370 Q510,340 500,315" strokeWidth="28" opacity=".8"/>
              {/* Center to gym (25%,45%) */}
              <path d="M500,315 Q440,310 380,320 Q320,325 250,315" strokeWidth="24" opacity=".75"/>
              {/* Center to arena (78%,35%) */}
              <path d="M500,315 Q560,290 630,270 Q700,260 780,245" strokeWidth="24" opacity=".75"/>
              {/* Center to shop (55%,45%) */}
              <path d="M500,315 Q520,315 550,315" strokeWidth="20" opacity=".65"/>
              {/* Center to status (50%,22%) */}
              <path d="M500,315 Q490,270 495,230 Q498,200 500,154" strokeWidth="20" opacity=".65"/>
              {/* Home to restaurant (70%,70%) */}
              <path d="M500,546 Q560,530 620,510 Q670,498 700,490" strokeWidth="24" opacity=".75"/>
              {/* Home to pool (15%,70%) */}
              <path d="M500,546 Q420,540 330,520 Q230,505 150,490" strokeWidth="24" opacity=".75"/>
              {/* Arena to river (85%,58%) */}
              <path d="M780,245 Q810,290 830,340 Q845,370 850,406" strokeWidth="18" opacity=".6"/>
              {/* Gym to friend (30%,25%) */}
              <path d="M250,315 Q260,280 275,250 Q285,220 300,175" strokeWidth="18" opacity=".6"/>
              {/* Jobs (15%,40%) to gym */}
              <path d="M150,280 Q180,290 220,300 Q240,308 250,315" strokeWidth="18" opacity=".6"/>
              {/* Hengzhai (55%,30%) to center */}
              <path d="M550,210 Q530,250 515,280 Q508,300 500,315" strokeWidth="18" opacity=".6"/>
              {/* Tianliao (12%,50%) */}
              <path d="M150,280 Q135,310 125,340 Q120,350 120,350" strokeWidth="16" opacity=".55"/>
              {/* NSTC (80%,28%) */}
              <path d="M780,245 Q790,220 800,196" strokeWidth="16" opacity=".55"/>
              {/* Mituo (80%,60%) */}
              <path d="M850,406 Q830,415 810,420 Q800,420 800,420" strokeWidth="16" opacity=".55"/>
              {/* Cafe (62%,62%) from restaurant area */}
              <path d="M700,490 Q670,465 640,445 Q625,438 620,434" strokeWidth="16" opacity=".55"/>
              {/* Laundry (35%,60%) from home path */}
              <path d="M500,460 Q450,445 400,430 Q370,425 350,420" strokeWidth="16" opacity=".55"/>
            </g>
            {/* Path edge lines (subtle borders) */}
            <g fill="none" stroke="#c4a060" strokeLinecap="round" strokeDasharray="6,8" opacity=".2">
              <path d="M486,546 Q466,490 476,440 Q486,400 496,370 Q496,340 486,315" strokeWidth="2"/>
              <path d="M514,546 Q494,490 504,440 Q514,400 524,370 Q524,340 514,315" strokeWidth="2"/>
            </g>

            {/* ── Pond / Water near fishing spot (85%,58%) ── */}
            <ellipse cx="860" cy="410" rx="65" ry="40" fill="url(#pond)" opacity=".85"/>
            <ellipse cx="860" cy="410" rx="55" ry="32" fill="#4dd0e1" opacity=".3"/>
            {/* Water shimmer lines */}
            <g opacity=".4" style={{animation:'water-shimmer 3s ease-in-out infinite'}}>
              <path d="M820,400 Q840,395 860,400 Q880,405 900,400" fill="none" stroke="white" strokeWidth="2"/>
              <path d="M830,415 Q850,410 870,415 Q890,420 905,415" fill="none" stroke="white" strokeWidth="1.5"/>
              <path d="M840,425 Q855,421 870,425" fill="none" stroke="white" strokeWidth="1"/>
            </g>
            {/* Pond edge */}
            <ellipse cx="860" cy="410" rx="65" ry="40" fill="none" stroke="#2e7d32" strokeWidth="3" opacity=".3"/>
            {/* Reeds near pond */}
            <g opacity=".6">
              <line x1="810" y1="430" x2="808" y2="405" stroke="#558b2f" strokeWidth="2"/>
              <ellipse cx="807" cy="403" rx="3" ry="5" fill="#795548"/>
              <line x1="918" y1="420" x2="920" y2="395" stroke="#558b2f" strokeWidth="2"/>
              <ellipse cx="921" cy="393" rx="3" ry="5" fill="#795548"/>
            </g>
            {/* Dock for fishing */}
            <rect x="840" y="440" width="40" height="8" rx="2" fill="#8d6e3f"/>
            <rect x="845" y="448" width="4" height="10" fill="#6d4c1f"/>
            <rect x="871" y="448" width="4" height="10" fill="#6d4c1f"/>

            {/* ── Decorative Trees ── */}
            {[[40,360,18],[90,380,15],[940,370,17],[960,400,14],[30,500,16],[960,530,15],[70,620,13],[930,620,14],[500,640,12],[250,600,11]].map(([cx,cy,r],i)=>
              <g key={'tree'+i} filter="url(#mapShadow)">
                <rect x={cx-3} y={cy} width={6} height={r*1.2} rx={2} fill="#6d4c1f"/>
                <circle cx={cx} cy={cy-r*0.3} r={r} fill={i%3===0?'#388e3c':i%3===1?'#43a047':'#2e7d32'}/>
                <circle cx={cx-r*0.4} cy={cy-r*0.5} r={r*0.7} fill={i%3===0?'#43a047':i%3===1?'#4caf50':'#388e3c'}/>
                <circle cx={cx+r*0.3} cy={cy-r*0.6} r={r*0.6} fill={i%3===0?'#4caf50':i%3===1?'#66bb6a':'#43a047'}/>
              </g>
            )}

            {/* ── Flowers ── */}
            {[[100,440,'#e91e63'],[160,470,'#ff9800'],[300,560,'#e91e63'],[420,500,'#ffeb3b'],[600,540,'#ff5722'],[730,510,'#9c27b0'],[180,390,'#ffeb3b'],[650,380,'#e91e63'],[400,620,'#ff9800'],[820,540,'#9c27b0'],[550,450,'#e91e63'],[280,400,'#ff5722']].map(([cx,cy,c],i)=>
              <g key={'fl'+i} style={{animation:`flower-sway ${2+i%3}s ease-in-out infinite`,transformOrigin:`${cx}px ${cy}px`}}>
                <circle cx={cx} cy={cy} r="4" fill={c} opacity=".8"/>
                <circle cx={cx} cy={cy} r="2" fill="#fff9c4"/>
              </g>
            )}

            {/* ── Bushes ── */}
            {[[140,430],[330,470],[500,530],[670,450],[820,500],[60,560],[900,560],[400,390],[200,550],[750,580]].map(([cx,cy],i)=>
              <g key={'bush'+i}>
                <ellipse cx={cx} cy={cy} rx={14+i%4*2} ry={9+i%3*2} fill={i%2===0?'#388e3c':'#2e7d32'} opacity=".75"/>
                <ellipse cx={cx+5} cy={cy-3} rx={8+i%3} ry={6} fill={i%2===0?'#43a047':'#388e3c'} opacity=".7"/>
              </g>
            )}

            {/* ── Fences along main path ── */}
            <g stroke="#8d6e3f" strokeWidth="2" opacity=".4">
              {[370,390,410,430,450,470].map((y,i)=>
                <g key={'fn'+i}>
                  <line x1="470" y1={y} x2="470" y2={y+12}/>
                  <line x1="530" y1={y} x2="530" y2={y+12}/>
                </g>
              )}
              <line x1="470" y1="375" x2="470" y2="477" strokeWidth="1"/>
              <line x1="530" y1="375" x2="530" y2="477" strokeWidth="1"/>
            </g>

            {/* ── Lamp posts ── */}
            {[[470,350],[530,350],[470,520],[530,520]].map(([cx,cy],i)=>
              <g key={'lamp'+i}>
                <rect x={cx-2} y={cy} width={4} height={20} fill="#607d8b"/>
                <circle cx={cx} cy={cy-2} r={5} fill="#fff9c4" opacity=".6"/>
                <circle cx={cx} cy={cy-2} r={3} fill="#ffeb3b" opacity=".8"/>
              </g>
            )}

            {/* ── Park benches ── */}
            {[[430,480],[570,480]].map(([cx,cy],i)=>
              <g key={'bench'+i}>
                <rect x={cx-12} y={cy} width={24} height={4} rx={1} fill="#6d4c1f"/>
                <rect x={cx-10} y={cy+4} width={4} height={6} fill="#5d3c0f"/>
                <rect x={cx+6} y={cy+4} width={4} height={6} fill="#5d3c0f"/>
                <rect x={cx-13} y={cy-6} width={26} height={3} rx={1} fill="#8d6e3f"/>
              </g>
            )}

            {/* ── Mountain silhouette behind Tianliao (12%,50%) ── */}
            <g opacity=".5">
              <path d="M50,340 L100,240 L130,260 L170,210 L210,270 L240,340Z" fill="#607d8b"/>
              <path d="M70,340 L110,260 L140,275 L170,230 L200,280 L220,340Z" fill="#78909c" opacity=".7"/>
              <path d="M95,245 L105,235 L115,248" fill="white" opacity=".5"/>
            </g>

            {/* ── Small buildings / landmarks (SVG) ── */}

            {/* Home (50%,78%) = 500,546 */}
            <g transform="translate(488,530)" opacity=".35">
              <rect x="0" y="8" width="24" height="18" rx="2" fill="#e57373"/>
              <polygon points="0,10 12,-4 24,10" fill="#c62828"/>
              <rect x="9" y="18" width="7" height="8" fill="#8d6e3f"/>
              <rect x="3" y="12" width="5" height="5" fill="#bbdefb"/>
              {/* Chimney smoke */}
              <g style={{animation:'chimney-smoke 2s ease-out infinite'}}>
                <circle cx="18" cy="-2" r="3" fill="#9e9e9e" opacity=".3"/>
              </g>
            </g>

            {/* Gym (25%,45%) = 250,315 */}
            <g transform="translate(234,296)" opacity=".35">
              <rect x="0" y="6" width="32" height="22" rx="2" fill="#78909c"/>
              <rect x="0" y="0" width="32" height="8" rx="2" fill="#546e7a"/>
              <rect x="12" y="18" width="8" height="10" fill="#455a64"/>
            </g>

            {/* Arena (78%,35%) = 780,245 */}
            <g transform="translate(764,226)" opacity=".35">
              <ellipse cx="16" cy="22" rx="20" ry="10" fill="#e0e0e0"/>
              <rect x="0" y="8" width="32" height="16" rx="4" fill="#bdbdbd"/>
              <path d="M2,8 Q16,0 30,8" fill="#9e9e9e"/>
            </g>

            {/* Restaurant (70%,70%) = 700,490 */}
            <g transform="translate(686,474)" opacity=".35">
              <rect x="0" y="8" width="28" height="18" rx="2" fill="#ffcc80"/>
              <rect x="0" y="2" width="28" height="8" rx="1" fill="#ff8a65"/>
              <rect x="10" y="18" width="8" height="8" fill="#8d6e3f"/>
            </g>

            {/* Cafe (62%,62%) = 620,434 */}
            <g transform="translate(608,418)" opacity=".35">
              <rect x="0" y="6" width="24" height="18" rx="2" fill="#8d6e3f"/>
              <rect x="0" y="0" width="24" height="8" rx="2" fill="#6d4c41"/>
              <rect x="8" y="16" width="8" height="8" fill="#5d4037"/>
              <circle cx="18" cy="4" r="3" fill="#fff9c4" opacity=".7"/>
            </g>

            {/* Laundry (35%,60%) = 350,420 */}
            <g transform="translate(338,404)" opacity=".35">
              <rect x="0" y="4" width="24" height="18" rx="2" fill="#e0e0e0"/>
              <rect x="0" y="0" width="24" height="6" rx="2" fill="#90caf9"/>
              <circle cx="12" cy="14" r="5" fill="#bbdefb" stroke="#90caf9" strokeWidth="1"/>
              <rect x="8" y="18" width="8" height="6" fill="#bdbdbd"/>
            </g>

          </svg>

          {/* Map locations */}
          {locations.map(loc=>(
            <MapLocation key={loc.id} icon={loc.icon} label={loc.label}
              x={loc.x} y={loc.y}
              onClick={()=>{loc.action();setHovered(null)}}
              active={hovered===loc.id}
              locked={loc.locked||false}
            />
          ))}

          {/* Character on map (centered, interactive) */}
          <div className="absolute cursor-pointer" style={{left:'50%',top:'63%',transform:'translate(-50%,-50%)',zIndex:5}}
            onClick={()=>{
              sfx('tap');
              const reactions=['💪 今天也要加油！','😊 嗨！','🔥 練起來！','✨ 狀態很好！','😤 再來一組！','🎯 專注！','💭 想吃東西...','😴 有點累了','🏋️ 舉起來！'];
              setToast({text:reactions[Math.floor(Math.random()*reactions.length)],type:'success'});
            }}>
            <div className="float">
              <CharAvatar charId={c.avatar} size={70} lifting={c.streak>=3}/>
            </div>
            {/* Speech bubble when tapped */}
            {c.fatigue>50&&<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-lg">💦</div>}
            {c.streak>=5&&<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-lg bounce">🔥</div>}
          </div>
        </div>
      </div>

      {/* Bottom bar — all info merged here */}
      <div className="bg-pixel-charcoal border-t-2 border-pixel-gray px-2 py-1">
        {/* Row 1: Status bars + money + day */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs">❤️</span>
          <div className="flex-1 h-3 bg-pixel-dark border border-pixel-gray overflow-hidden rounded">
            <div className="h-full" style={{width:`${c.stamina/ms*100}%`,background:'linear-gradient(to right,#38b764,#a7f070)'}}/>
          </div>
          <span className="font-vt text-pixel-green text-xs">{c.stamina}/{ms}</span>
          <span className="text-xs">😤</span>
          <div className="w-16 h-3 bg-pixel-dark border border-pixel-gray overflow-hidden rounded">
            <div className="h-full" style={{width:`${c.fatigue}%`,background:c.fatigue>70?'#b13e53':c.fatigue>40?'#ef7d57':'#f4d03f'}}/>
          </div>
          <span className="font-vt text-pixel-orange text-xs">{c.fatigue}%</span>
          <span className="font-vt text-pixel-gold text-sm">💰{c.money}</span>
          <span className="font-vt text-pixel-light text-xs">📅{c.day}天</span>
        </div>
        {/* Row 2: Buttons + PB */}
        <div className="flex items-center gap-1">
          <button onClick={save} className="pixel-btn bg-pixel-dark text-pixel-light py-0.5 px-2 text-[7px] font-pixel">💾</button>
          <button onClick={()=>go('achievements')} className="pixel-btn bg-pixel-dark text-pixel-light py-0.5 px-2 text-[7px] font-pixel">🏆{c.achievements.length}</button>
          <button onClick={()=>go('title')} className="pixel-btn bg-pixel-dark text-pixel-light py-0.5 px-2 text-[7px] font-pixel">🏠</button>
          <div className="flex-1"/>
          <span className="font-vt text-pixel-gold text-xs">🏋️ 抓{c.pb.snatch||'--'} 挺{c.pb.cleanJerk||'--'} 總{c.pb.total||'--'}kg</span>
          {c.streak>=3&&<span className="font-vt text-pixel-orange text-xs">🔥{c.streak}</span>}
        </div>
      </div>
    </div>
  );
}

// ── TRAINING ──
function TrainingScreen({c,setC,go}){
  const[floats,setFloats]=useState(null);
  const[showTip,setShowTip]=useState(null);
  const[coach,setCoach]=useState(null);
  const[exerciseAnim,setExerciseAnim]=useState(null);
  const[selectedCat,setSelectedCat]=useState(TRAIN_CATEGORIES[0].id);
  const ms=maxSta(c.stats.sta);
  const hasBoost=c.activeEffects.some(e=>e.type==='trainBoost');
  const mult=hasBoost?1.2:1;
  const streakB=Math.min(5,Math.floor(c.streak/5))*.05+1;

  function doTrain(t){
    if(exerciseAnim)return;
    if(t.isRest){
      const rec=20+Math.floor(c.stats.rec/3);
      const fatDrop=Math.min(c.fatigue,25+Math.floor(c.stats.rec/5));
      sfx('rest');
      setExerciseAnim(t.id);
      setTimeout(()=>{
        setExerciseAnim(null);
        setC(x=>({...x,
          stamina:Math.min(ms,x.stamina+rec),
          stats:{...x.stats,rec:Math.min(100,x.stats.rec+1)},
          day:x.day+1,totalTrainings:x.totalTrainings+1,
          fatigue:Math.max(0,x.fatigue-fatDrop),streak:0,restStreak:(x.restStreak||0)+1,
          activeEffects:x.activeEffects.map(e=>({...e,dur:e.dur-1})).filter(e=>e.dur>0),
        }));
        setFloats([{icon:'😴',text:`+${rec}❤️`,color:'#38b764'},{icon:'😌',text:`-${fatDrop}😤`,color:'#73eff7'}]);
        if(c.fatigue>40)setCoach({text:'休息也是訓練👍'});
      },2000);
      return;
    }
    if(c.stamina<t.cost){sfx('fail');setFloats([{icon:'❌',text:'體力不足',color:'#b13e53'}]);return}

    // Overtraining risk
    const injuryChance=c.fatigue>80?.15:c.fatigue>60?.05:0;
    if(injuryChance>0&&Math.random()<injuryChance){
      sfx('hurt');
      setFloats([{icon:'🤕',text:'受傷！',color:'#b13e53'}]);
      setC(x=>({...x,stamina:Math.min(ms,x.stamina+10),day:x.day+1,fatigue:Math.max(0,x.fatigue-15),streak:0,
        activeEffects:x.activeEffects.map(e=>({...e,dur:e.dur-1})).filter(e=>e.dur>0)}));
      setCoach({text:'受傷了！要好好休息💤'});
      return;
    }

    sfx('train');
    setExerciseAnim(t.id);
    const floatItems=[];const ns={...c.stats};
    for(const[s,v]of Object.entries(t.primary)){const g=Math.round(v*mult*streakB);ns[s]=Math.min(100,ns[s]+g);floatItems.push({icon:SI[s],text:`+${g}`,color:SC[s]});}
    for(const[s,v]of Object.entries(t.secondary)){const g=Math.round(v*mult*streakB);ns[s]=Math.min(100,ns[s]+g);floatItems.push({icon:SI[s],text:`+${g}`,color:SC[s]});}

    // Principle growth based on exercise category and type
    const np={...c.principles};
    const tCat=TRAIN_CATEGORIES.find(cat=>cat.exercises.some(e=>e.id===t.id));
    const tCatId=tCat?tCat.id:null;
    if(tCatId==='snatch'){
      const prinToTrain=['near','fast','low','accurate','stable'];
      const chosen=prinToTrain[Math.floor(Math.random()*prinToTrain.length)];
      if(Math.random()<.4)np[chosen]=Math.min(10,(np[chosen]||0)+1);
    }
    if(t.id==='tcjs'){
      if(Math.random()<.5)np.near=Math.min(10,(np.near||0)+1);
      if(Math.random()<.3)np.fast=Math.min(10,(np.fast||0)+1);
    }
    if(tCatId==='clean'){
      const prinToTrain=['accurate','stable'];
      const chosen=prinToTrain[Math.floor(Math.random()*prinToTrain.length)];
      if(Math.random()<.35)np[chosen]=Math.min(10,(np[chosen]||0)+1);
    }
    if(tCatId==='pull'){
      const prinToTrain=['near','fast'];
      const chosen=prinToTrain[Math.floor(Math.random()*prinToTrain.length)];
      if(Math.random()<.3)np[chosen]=Math.min(10,(np[chosen]||0)+1);
    }
    if(tCatId==='technical'){
      const prinToTrain=['near','fast','low','accurate','stable'];
      const chosen=prinToTrain[Math.floor(Math.random()*prinToTrain.length)];
      if(Math.random()<.35)np[chosen]=Math.min(10,(np[chosen]||0)+1);
    }
    if(tCatId==='explosive'&&Math.random()<.3)np.fast=Math.min(10,(np.fast||0)+1);
    if(t.id==='flexibility'&&Math.random()<.3)np.low=Math.min(10,(np.low||0)+1);
    if(t.id==='mental'&&Math.random()<.3)np.stable=Math.min(10,(np.stable||0)+1);

    const fatGain=Math.round(t.cost*.35);
    const newStreak=c.lastTrainDay===c.day-1||c.lastTrainDay===c.day?c.streak+1:1;
    const isTcjs=t.id==='tcjs';

    // Check if principle grew
    for(const[k,v]of Object.entries(np)){
      if(v>(c.principles[k]||0)){
        const p=PRINCIPLES.find(x=>x.id===k);
        floatItems.push({icon:'📜',text:p.name+'↑',color:'#f4d03f'});
      }
    }
    if(streakB>1)floatItems.push({icon:'🔥',text:`x${streakB.toFixed(2)}`,color:'#ef7d57'});

    const showCoach=Math.random()<.25;
    setTimeout(()=>{
      setExerciseAnim(null);
      setC(x=>{const _sh=[...(x.statHistory||[])];if(x.day%5===0&&(_sh.length===0||_sh[_sh.length-1].day!==x.day)){_sh.push({day:x.day,stats:{...ns}});if(_sh.length>50)_sh.shift()}return{...x,stamina:x.stamina-t.cost,stats:ns,totalTrainings:x.totalTrainings+1,fatigue:Math.min(100,x.fatigue+fatGain),streak:newStreak,restStreak:0,lastTrainDay:x.day,principles:np,tcjsCount:isTcjs?(x.tcjsCount||0)+1:x.tcjsCount||0,statHistory:_sh}});
      setFloats(floatItems);
      if(showCoach)setTimeout(()=>setCoach({text:t.tip}),500);
    },2000);
  }

  function endDay(){
    const rec=15+Math.floor(c.stats.rec/4);
    const fatDrop=5+Math.floor(c.stats.rec/8);
    sfx('newday');
    setC(x=>{const _sh=[...(x.statHistory||[])];if((x.day+1)%5===0&&(_sh.length===0||_sh[_sh.length-1].day!==(x.day+1))){_sh.push({day:x.day+1,stats:{...x.stats}});if(_sh.length>50)_sh.shift()}return{...x,stamina:Math.min(ms,x.stamina+rec),day:x.day+1,fatigue:Math.max(0,x.fatigue-fatDrop),activeEffects:x.activeEffects.map(e=>({...e,dur:e.dur-1})).filter(e=>e.dur>0),statHistory:_sh}});
    setFloats([{icon:'🌙',text:`+${rec}❤️`,color:'#41a6f6'}]);
  }

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-auto">
      <div className="max-w-lg mx-auto">
        {coach&&<CoachDialog text={coach.text} onClose={()=>setCoach(null)}/>}
        {showTip&&<CoachDialog text={showTip.tip} onClose={()=>setShowTip(null)}/>}
        {floats&&<FloatingNum items={floats} onDone={()=>setFloats(null)}/>}
        {exerciseAnim&&<ExerciseAnim exerciseId={exerciseAnim} gender={c.gender} onDone={()=>setExerciseAnim(null)}/>}

        <div className="flex justify-between items-center mb-2">
          <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-3 py-1 text-[10px] font-pixel">←</button>
          <h2 className="font-pixel text-pixel-green text-[10px]">🏋️ 訓練場</h2>
          <button onClick={()=>{const cat=TRAIN_CATEGORIES.find(ct=>ct.id===selectedCat);if(cat&&cat.exercises[0])setShowTip(cat.exercises[0])}} className="pixel-btn bg-pixel-charcoal text-pixel-cyan px-3 py-1 text-[10px] font-pixel" title="運動科學知識">📖</button>
        </div>

        <div className="pixel-border bg-pixel-charcoal p-2 mb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-vt text-sm">❤️</span>
            <div className="flex-1 stamina-bar"><div className="stamina-fill" style={{width:`${c.stamina/ms*100}%`}}/></div>
            <span className="font-vt text-pixel-green text-sm">{c.stamina}/{ms}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-vt text-sm">😤</span>
            <div className="flex-1 h-3 bg-pixel-charcoal border-2 border-pixel-gray overflow-hidden">
              <div className="h-full transition-all" style={{width:`${c.fatigue}%`,background:c.fatigue>70?'#b13e53':c.fatigue>40?'#ef7d57':'#f4d03f'}}/>
            </div>
            <span className="font-vt text-pixel-orange text-sm">{c.fatigue}%</span>
          </div>
          <FatigueBar fatigue={c.fatigue}/>
        </div>

        <div className="flex gap-1 mb-2 overflow-x-auto pb-1" style={{scrollbarWidth:'thin'}}>
          {TRAIN_CATEGORIES.map(cat=>{
            const unlocked=c.totalTrainings>=cat.unlock;
            const isActive=selectedCat===cat.id;
            return(
              <button key={cat.id} onClick={()=>{if(unlocked){sfx('click');setSelectedCat(cat.id)}}}
                className={`flex-shrink-0 px-2 py-1 font-vt text-xs border-2 transition-colors whitespace-nowrap
                  ${!unlocked?'border-pixel-gray bg-pixel-dark text-pixel-gray opacity-50 cursor-not-allowed':
                    isActive?'border-pixel-gold bg-pixel-darkblue text-pixel-gold':'border-pixel-gray bg-pixel-charcoal text-pixel-light hover:bg-pixel-darkblue cursor-pointer'}`}>
                {unlocked?cat.icon:'🔒'} {cat.name}
                {!unlocked&&<span className="text-[9px] ml-1">({cat.unlock}次)</span>}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-1.5 mb-2">
          {(TRAIN_CATEGORIES.find(cat=>cat.id===selectedCat)||TRAIN_CATEGORIES[0]).exercises.map(t=>{
            const can=t.isRest||c.stamina>=t.cost;
            return(
              <button key={t.id} onClick={()=>doTrain(t)} disabled={!can}
                className={`pixel-border p-2 flex flex-col items-center gap-0.5 transition-colors
                  ${can?'bg-pixel-charcoal hover:bg-pixel-darkblue cursor-pointer':'bg-pixel-dark opacity-40 cursor-not-allowed'}
                  ${t.isSpecial?'border-pixel-gold':''}`}>
                <span className="text-2xl">{t.icon}</span>
                <span className="font-vt text-pixel-white text-xs">{t.name.length>4?t.name.slice(0,4):t.name}</span>
                <div className="flex gap-0.5 flex-wrap justify-center">
                  {Object.entries({...t.primary,...t.secondary}).map(([s,v])=>(
                    <span key={s} className="text-[10px]" style={{color:SC[s]}}>{SI[s]}{Math.round(v*mult*streakB)}</span>
                  ))}
                </div>
                {!t.isRest&&<span className="font-vt text-pixel-orange text-[10px]">-{t.cost}❤️</span>}
                {t.isRest&&<span className="font-vt text-pixel-green text-[10px]">+❤️</span>}
              </button>
            );
          })}
        </div>

        <button onClick={endDay} className="w-full pixel-btn bg-pixel-darkblue text-pixel-sky py-2 text-lg mb-2">🌙</button>
      </div>
    </div>
  );
}

// ── COMPETITION ──