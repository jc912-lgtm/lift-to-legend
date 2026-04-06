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
  const[selCoach,setSelCoach]=useState('titan');
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
          <label className="font-vt text-pixel-light text-lg block mb-2">選擇教練</label>
          <div className="flex gap-2 justify-center">
            {COACHES.map(co=>(
              <button key={co.id} onClick={()=>{sfx('tap');setSelCoach(co.id)}}
                className={`flex flex-col items-center p-2 rounded-lg border-2 w-24
                  ${selCoach===co.id?'border-pixel-gold bg-pixel-darkblue':'border-pixel-gray bg-pixel-dark'}`}>
                <div className="text-2xl mb-1">{co.id==='titan'?'🔥':co.id==='monk'?'🧘':'⚡'}</div>
                <div className="font-vt text-xs text-pixel-gold">{co.name}</div>
                <div className="font-vt text-[10px] text-pixel-light">{co.style==='power'?'爆發型':co.style==='technical'?'技術型':'力量型'}</div>
              </button>
            ))}
          </div>
          <div className="font-vt text-pixel-cyan text-sm text-center mt-1">
            {COACHES.find(co=>co.id===selCoach)?.desc}
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
        <button onClick={()=>{if(name.trim()){sfx('success');onConfirm(name.trim(),gender,wc,avatar,selCoach)}}} disabled={!name.trim()}
          className={`w-full pixel-btn pixel-btn-gold py-3 text-[10px] font-pixel ${name.trim()?'bg-pixel-dark text-pixel-gold':'bg-pixel-charcoal text-pixel-gray cursor-not-allowed'}`}>
          💪 開始訓練之旅！
        </button>
      </div>
    </div>
  );
}

// ── Building SVG helper for Hub map ──
function getBuildingSVG(id){
  switch(id){
    case 'home': return React.createElement('g',null,
      React.createElement('rect',{x:25,y:50,width:70,height:45,rx:3,fill:'#e8d5b0',stroke:'#8d6e3f',strokeWidth:2}),
      React.createElement('polygon',{points:'15,53 60,12 105,53',fill:'#c62828',stroke:'#8d2c2c',strokeWidth:2}),
      React.createElement('rect',{x:47,y:62,width:22,height:33,rx:2,fill:'#5d4037'}),
      React.createElement('circle',{cx:64,cy:80,r:2,fill:'#f4d03f'}),
      React.createElement('rect',{x:28,y:58,width:14,height:14,fill:'#bbdefb',stroke:'#64b5f6',strokeWidth:1.5}),
      React.createElement('rect',{x:78,y:58,width:14,height:14,fill:'#bbdefb',stroke:'#64b5f6',strokeWidth:1.5}),
      React.createElement('line',{x1:35,y1:58,x2:35,y2:72,stroke:'#64b5f6',strokeWidth:0.8}),
      React.createElement('line',{x1:28,y1:65,x2:42,y2:65,stroke:'#64b5f6',strokeWidth:0.8}),
      React.createElement('line',{x1:85,y1:58,x2:85,y2:72,stroke:'#64b5f6',strokeWidth:0.8}),
      React.createElement('line',{x1:78,y1:65,x2:92,y2:65,stroke:'#64b5f6',strokeWidth:0.8}),
      React.createElement('rect',{x:78,y:18,width:12,height:30,fill:'#795548'}),
      React.createElement('rect',{x:75,y:15,width:18,height:6,rx:1,fill:'#6d4c41'}),
      React.createElement('circle',{cx:84,cy:10,r:4,fill:'white',opacity:0.5}),
      React.createElement('circle',{cx:88,cy:4,r:3,fill:'white',opacity:0.35}),
      React.createElement('rect',{x:20,y:93,width:80,height:7,rx:2,fill:'#66bb6a',opacity:0.5}),
      React.createElement('circle',{cx:30,cy:92,r:4,fill:'#e91e63',opacity:0.7}),
      React.createElement('circle',{cx:40,cy:93,r:3,fill:'#ffeb3b',opacity:0.7}),
      React.createElement('circle',{cx:82,cy:92,r:4,fill:'#e91e63',opacity:0.7}),
      React.createElement('circle',{cx:90,cy:93,r:3,fill:'#ff9800',opacity:0.7})
    );
    case 'gym': return React.createElement('g',null,
      React.createElement('rect',{x:8,y:30,width:104,height:65,rx:3,fill:'#37474f',stroke:'#263238',strokeWidth:2}),
      React.createElement('rect',{x:5,y:18,width:110,height:18,rx:3,fill:'#1565c0'}),
      React.createElement('text',{x:60,y:33,textAnchor:'middle',fill:'white',fontSize:14,fontWeight:'bold',fontFamily:'monospace'},'GYM'),
      React.createElement('rect',{x:40,y:60,width:38,height:35,rx:2,fill:'#263238'}),
      React.createElement('rect',{x:40,y:60,width:18,height:35,fill:'#1a1a1a'}),
      React.createElement('rect',{x:14,y:45,width:18,height:18,fill:'#263238',rx:1}),
      React.createElement('rect',{x:86,y:45,width:18,height:18,fill:'#263238',rx:1}),
      React.createElement('rect',{x:16,y:47,width:14,height:14,fill:'#546e7a',opacity:0.5}),
      React.createElement('rect',{x:88,y:47,width:14,height:14,fill:'#546e7a',opacity:0.5}),
      React.createElement('rect',{x:30,y:24,width:10,height:5,rx:2,fill:'#f4d03f'}),
      React.createElement('rect',{x:78,y:24,width:10,height:5,rx:2,fill:'#f4d03f'}),
      React.createElement('rect',{x:38,y:25,width:42,height:3,rx:1,fill:'#f4d03f'}),
      React.createElement('circle',{cx:28,cy:26,r:6,fill:'#ef5350',stroke:'#c62828',strokeWidth:1}),
      React.createElement('circle',{cx:90,cy:26,r:6,fill:'#ef5350',stroke:'#c62828',strokeWidth:1}),
      React.createElement('rect',{x:35,y:92,width:48,height:5,rx:1,fill:'#455a64'})
    );
    case 'arena': return React.createElement('g',null,
      React.createElement('rect',{x:5,y:55,width:130,height:40,rx:4,fill:'#bdbdbd',stroke:'#9e9e9e',strokeWidth:2}),
      React.createElement('path',{d:'M5,55 Q70,5 135,55',fill:'#78909c',stroke:'#607d8b',strokeWidth:2}),
      React.createElement('path',{d:'M15,55 Q70,15 125,55',fill:'#90a4ae',opacity:0.5}),
      React.createElement('rect',{x:50,y:62,width:40,height:33,rx:3,fill:'#616161'}),
      React.createElement('path',{d:'M50,62 Q70,50 90,62',fill:'#757575'}),
      React.createElement('rect',{x:12,y:45,width:10,height:50,fill:'#9e9e9e'}),
      React.createElement('rect',{x:118,y:45,width:10,height:50,fill:'#9e9e9e'}),
      React.createElement('line',{x1:35,y1:20,x2:35,y2:40,stroke:'#5d4037',strokeWidth:2}),
      React.createElement('polygon',{points:'36,20 50,25 36,30',fill:'#c62828'}),
      React.createElement('line',{x1:105,y1:20,x2:105,y2:40,stroke:'#5d4037',strokeWidth:2}),
      React.createElement('polygon',{points:'104,20 90,25 104,30',fill:'#1565c0'}),
      React.createElement('rect',{x:20,y:65,width:10,height:8,rx:1,fill:'#e0e0e0'}),
      React.createElement('rect',{x:110,y:65,width:10,height:8,rx:1,fill:'#e0e0e0'}),
      React.createElement('rect',{x:45,y:92,width:50,height:5,rx:1,fill:'#9e9e9e'}),
      React.createElement('rect',{x:40,y:95,width:60,height:5,rx:1,fill:'#bdbdbd'})
    );
    case 'restaurant': return React.createElement('g',null,
      React.createElement('rect',{x:15,y:35,width:90,height:60,rx:3,fill:'#ffcc80',stroke:'#ff8a65',strokeWidth:2}),
      React.createElement('path',{d:'M10,38 L60,18 L110,38',fill:'#ff8a65',stroke:'#e65100',strokeWidth:1.5}),
      React.createElement('rect',{x:48,y:60,width:22,height:35,rx:2,fill:'#8d6e3f'}),
      React.createElement('rect',{x:20,y:48,width:18,height:15,fill:'#fff9c4',stroke:'#ffb74d',strokeWidth:1}),
      React.createElement('rect',{x:80,y:48,width:18,height:15,fill:'#fff9c4',stroke:'#ffb74d',strokeWidth:1}),
      React.createElement('rect',{x:35,y:22,width:48,height:14,rx:2,fill:'#d84315'}),
      React.createElement('text',{x:59,y:33,textAnchor:'middle',fill:'white',fontSize:9,fontWeight:'bold',fontFamily:'monospace'},'\u9910\u5EF3'),
      React.createElement('path',{d:'M70,15 Q73,8 70,2',fill:'none',stroke:'white',strokeWidth:1.5,opacity:0.6}),
      React.createElement('path',{d:'M78,18 Q81,10 78,4',fill:'none',stroke:'white',strokeWidth:1.5,opacity:0.5}),
      React.createElement('path',{d:'M62,17 Q59,10 62,3',fill:'none',stroke:'white',strokeWidth:1.5,opacity:0.5}),
      React.createElement('rect',{x:4,y:82,width:14,height:2,fill:'#8d6e3f'}),
      React.createElement('rect',{x:10,y:84,width:2,height:10,fill:'#6d4c1f'}),
      React.createElement('circle',{cx:11,cy:80,r:3,fill:'#ef5350',opacity:0.6})
    );
    case 'pool': return React.createElement('g',null,
      React.createElement('rect',{x:15,y:30,width:90,height:65,rx:3,fill:'#1a1a2e',stroke:'#16213e',strokeWidth:2}),
      React.createElement('rect',{x:12,y:25,width:96,height:10,rx:2,fill:'#0f3460'}),
      React.createElement('rect',{x:25,y:38,width:70,height:16,rx:2,fill:'#0a0a15'}),
      React.createElement('text',{x:60,y:51,textAnchor:'middle',fill:'#00e5ff',fontSize:12,fontWeight:'bold',fontFamily:'monospace'},'POOL'),
      React.createElement('rect',{x:25,y:38,width:70,height:16,rx:2,fill:'none',stroke:'#00e5ff',strokeWidth:1,opacity:0.6}),
      React.createElement('circle',{cx:88,cy:32,r:8,fill:'#111'}),
      React.createElement('circle',{cx:88,cy:32,r:4,fill:'white'}),
      React.createElement('text',{x:88,y:35,textAnchor:'middle',fill:'black',fontSize:6,fontWeight:'bold'},'8'),
      React.createElement('rect',{x:44,y:62,width:26,height:33,rx:2,fill:'#16213e'}),
      React.createElement('rect',{x:20,y:60,width:16,height:12,fill:'#1a1a2e',stroke:'#00e5ff',strokeWidth:0.8}),
      React.createElement('rect',{x:82,y:60,width:16,height:12,fill:'#1a1a2e',stroke:'#00e5ff',strokeWidth:0.8}),
      React.createElement('rect',{x:22,y:62,width:12,height:8,fill:'#0d47a1',opacity:0.4}),
      React.createElement('rect',{x:84,y:62,width:12,height:8,fill:'#0d47a1',opacity:0.4})
    );
    case 'cafe': return React.createElement('g',null,
      React.createElement('rect',{x:15,y:38,width:85,height:57,rx:3,fill:'#8d6e3f',stroke:'#6d4c41',strokeWidth:2}),
      React.createElement('path',{d:'M10,40 Q55,28 105,40',fill:'#f4d03f',stroke:'#e6b800',strokeWidth:1.5}),
      React.createElement('path',{d:'M10,40 L20,48 L35,40 L48,48 L60,40 L72,48 L85,40 L98,48 L105,40',fill:'none',stroke:'#e6b800',strokeWidth:1}),
      React.createElement('rect',{x:44,y:60,width:24,height:35,rx:2,fill:'#5d4037'}),
      React.createElement('circle',{cx:62,cy:78,r:2,fill:'#f4d03f'}),
      React.createElement('rect',{x:20,y:52,width:18,height:16,fill:'#fff9c4',stroke:'#d4a24e',strokeWidth:1}),
      React.createElement('rect',{x:76,y:52,width:18,height:16,fill:'#fff9c4',stroke:'#d4a24e',strokeWidth:1}),
      React.createElement('rect',{x:48,y:30,width:16,height:12,rx:2,fill:'white'}),
      React.createElement('path',{d:'M64,33 Q70,36 64,40',fill:'none',stroke:'white',strokeWidth:1.5}),
      React.createElement('path',{d:'M52,28 Q54,22 52,17',fill:'none',stroke:'#999',strokeWidth:1.2,opacity:0.6}),
      React.createElement('path',{d:'M58,27 Q60,20 58,14',fill:'none',stroke:'#999',strokeWidth:1.2,opacity:0.5}),
      React.createElement('rect',{x:2,y:86,width:10,height:2,fill:'#8d6e3f'}),
      React.createElement('rect',{x:6,y:88,width:2,height:8,fill:'#6d4c1f'}),
      React.createElement('rect',{x:100,y:86,width:10,height:2,fill:'#8d6e3f'}),
      React.createElement('rect',{x:104,y:88,width:2,height:8,fill:'#6d4c1f'})
    );
    case 'laundry': return React.createElement('g',null,
      React.createElement('rect',{x:12,y:30,width:96,height:65,rx:3,fill:'#e0e0e0',stroke:'#bdbdbd',strokeWidth:2}),
      React.createElement('rect',{x:8,y:22,width:104,height:14,rx:3,fill:'#90caf9',stroke:'#64b5f6',strokeWidth:1}),
      React.createElement('text',{x:60,y:33,textAnchor:'middle',fill:'#1565c0',fontSize:9,fontWeight:'bold',fontFamily:'monospace'},'C&R WASH'),
      React.createElement('rect',{x:18,y:44,width:84,height:25,fill:'#e3f2fd',stroke:'#90caf9',strokeWidth:1}),
      React.createElement('circle',{cx:35,cy:56,r:9,fill:'white',stroke:'#bdbdbd',strokeWidth:1.5}),
      React.createElement('circle',{cx:35,cy:56,r:5,fill:'#bbdefb'}),
      React.createElement('circle',{cx:60,cy:56,r:9,fill:'white',stroke:'#bdbdbd',strokeWidth:1.5}),
      React.createElement('circle',{cx:60,cy:56,r:5,fill:'#bbdefb'}),
      React.createElement('circle',{cx:85,cy:56,r:9,fill:'white',stroke:'#bdbdbd',strokeWidth:1.5}),
      React.createElement('circle',{cx:85,cy:56,r:5,fill:'#bbdefb'}),
      React.createElement('rect',{x:45,y:72,width:26,height:23,rx:2,fill:'#b0bec5'}),
      React.createElement('rect',{x:45,y:72,width:12,height:23,fill:'#90a4ae'}),
      React.createElement('rect',{x:40,y:93,width:36,height:4,rx:1,fill:'#bdbdbd'})
    );
    case 'river': return React.createElement('g',null,
      React.createElement('ellipse',{cx:60,cy:85,rx:55,ry:18,fill:'#4fc3f7',opacity:0.7}),
      React.createElement('ellipse',{cx:60,cy:85,rx:45,ry:12,fill:'#81d4fa',opacity:0.4}),
      React.createElement('path',{d:'M25,82 Q40,78 55,82 Q70,86 85,82',fill:'none',stroke:'white',strokeWidth:1.2,opacity:0.4}),
      React.createElement('path',{d:'M30,90 Q45,86 60,90 Q75,94 90,90',fill:'none',stroke:'white',strokeWidth:1,opacity:0.3}),
      React.createElement('rect',{x:40,y:55,width:40,height:28,rx:2,fill:'#8d6e3f',stroke:'#6d4c1f',strokeWidth:1.5}),
      React.createElement('line',{x1:40,y1:62,x2:80,y2:62,stroke:'#6d4c1f',strokeWidth:1}),
      React.createElement('line',{x1:40,y1:69,x2:80,y2:69,stroke:'#6d4c1f',strokeWidth:1}),
      React.createElement('line',{x1:40,y1:76,x2:80,y2:76,stroke:'#6d4c1f',strokeWidth:1}),
      React.createElement('rect',{x:42,y:80,width:5,height:12,fill:'#5d3c0f'}),
      React.createElement('rect',{x:73,y:80,width:5,height:12,fill:'#5d3c0f'}),
      React.createElement('line',{x1:70,y1:55,x2:70,y2:25,stroke:'#795548',strokeWidth:2.5}),
      React.createElement('line',{x1:70,y1:25,x2:95,y2:45,stroke:'#795548',strokeWidth:1.5}),
      React.createElement('path',{d:'M95,45 L95,75',fill:'none',stroke:'#bdbdbd',strokeWidth:0.8,strokeDasharray:'2,2'}),
      React.createElement('circle',{cx:95,cy:76,r:3,fill:'#ef5350'})
    );
    case 'friend': return React.createElement('g',null,
      React.createElement('rect',{x:20,y:45,width:75,height:50,rx:3,fill:'#ce93d8',stroke:'#9c27b0',strokeWidth:2}),
      React.createElement('polygon',{points:'12,48 58,10 103,48',fill:'#7b1fa2',stroke:'#6a1b9a',strokeWidth:2}),
      React.createElement('rect',{x:44,y:62,width:22,height:33,rx:2,fill:'#4a148c'}),
      React.createElement('circle',{cx:60,cy:80,r:2,fill:'#f4d03f'}),
      React.createElement('rect',{x:25,y:55,width:14,height:14,fill:'#ffeb3b',stroke:'#fbc02d',strokeWidth:1}),
      React.createElement('rect',{x:75,y:55,width:14,height:14,fill:'#81d4fa',stroke:'#4fc3f7',strokeWidth:1}),
      React.createElement('text',{x:58,y:20,textAnchor:'middle',fill:'#f48fb1',fontSize:10},'\u2665'),
      React.createElement('rect',{x:44,y:93,width:22,height:4,rx:1,fill:'#ffab91'})
    );
    case 'shop': return React.createElement('g',null,
      React.createElement('rect',{x:15,y:35,width:88,height:60,rx:3,fill:'#fff8e1',stroke:'#ffb74d',strokeWidth:2}),
      React.createElement('rect',{x:10,y:25,width:98,height:14,rx:3,fill:'#ff7043'}),
      React.createElement('rect',{x:10,y:25,width:14,height:14,fill:'#ef5350',opacity:0.7}),
      React.createElement('rect',{x:38,y:25,width:14,height:14,fill:'#ef5350',opacity:0.7}),
      React.createElement('rect',{x:66,y:25,width:14,height:14,fill:'#ef5350',opacity:0.7}),
      React.createElement('rect',{x:94,y:25,width:14,height:14,fill:'#ef5350',opacity:0.7}),
      React.createElement('rect',{x:20,y:45,width:35,height:25,fill:'#e3f2fd',stroke:'#90caf9',strokeWidth:1}),
      React.createElement('rect',{x:24,y:55,width:8,height:12,rx:1,fill:'#ef5350'}),
      React.createElement('rect',{x:35,y:58,width:8,height:9,rx:1,fill:'#42a5f5'}),
      React.createElement('rect',{x:44,y:52,width:6,height:15,rx:1,fill:'#66bb6a'}),
      React.createElement('rect',{x:64,y:52,width:24,height:43,rx:2,fill:'#8d6e3f'}),
      React.createElement('rect',{x:64,y:52,width:11,height:43,fill:'#7c5e35'}),
      React.createElement('circle',{cx:83,cy:74,r:2,fill:'#f4d03f'}),
      React.createElement('text',{x:59,y:22,textAnchor:'middle',fill:'white',fontSize:10,fontWeight:'bold',fontFamily:'monospace'},'SHOP')
    );
    case 'jobs': return React.createElement('g',null,
      React.createElement('rect',{x:15,y:25,width:88,height:70,rx:3,fill:'#78909c',stroke:'#546e7a',strokeWidth:2}),
      React.createElement('rect',{x:12,y:18,width:94,height:12,rx:2,fill:'#546e7a'}),
      React.createElement('rect',{x:22,y:35,width:12,height:10,fill:'#e3f2fd',stroke:'#90caf9',strokeWidth:0.8}),
      React.createElement('rect',{x:42,y:35,width:12,height:10,fill:'#e3f2fd',stroke:'#90caf9',strokeWidth:0.8}),
      React.createElement('rect',{x:62,y:35,width:12,height:10,fill:'#fff9c4',stroke:'#90caf9',strokeWidth:0.8}),
      React.createElement('rect',{x:82,y:35,width:12,height:10,fill:'#e3f2fd',stroke:'#90caf9',strokeWidth:0.8}),
      React.createElement('rect',{x:22,y:52,width:12,height:10,fill:'#fff9c4',stroke:'#90caf9',strokeWidth:0.8}),
      React.createElement('rect',{x:42,y:52,width:12,height:10,fill:'#e3f2fd',stroke:'#90caf9',strokeWidth:0.8}),
      React.createElement('rect',{x:62,y:52,width:12,height:10,fill:'#e3f2fd',stroke:'#90caf9',strokeWidth:0.8}),
      React.createElement('rect',{x:82,y:52,width:12,height:10,fill:'#fff9c4',stroke:'#90caf9',strokeWidth:0.8}),
      React.createElement('rect',{x:44,y:72,width:26,height:23,rx:2,fill:'#455a64'}),
      React.createElement('rect',{x:44,y:72,width:12,height:23,fill:'#37474f'}),
      React.createElement('rect',{x:48,y:20,width:18,height:10,rx:2,fill:'#f4d03f',stroke:'#e6b800',strokeWidth:1}),
      React.createElement('rect',{x:54,y:17,width:6,height:5,rx:1,fill:'none',stroke:'#e6b800',strokeWidth:1})
    );
    case 'status': return React.createElement('g',null,
      React.createElement('rect',{x:30,y:25,width:60,height:70,rx:3,fill:'#8d6e3f',stroke:'#6d4c1f',strokeWidth:2}),
      React.createElement('rect',{x:35,y:30,width:50,height:45,rx:2,fill:'#d7ccc8'}),
      React.createElement('rect',{x:38,y:34,width:20,height:14,fill:'#fff9c4',stroke:'#fbc02d',strokeWidth:0.5}),
      React.createElement('circle',{cx:48,cy:34,r:2,fill:'#f44336'}),
      React.createElement('rect',{x:62,y:34,width:18,height:12,fill:'#c8e6c9',stroke:'#66bb6a',strokeWidth:0.5}),
      React.createElement('circle',{cx:71,cy:34,r:2,fill:'#2196f3'}),
      React.createElement('rect',{x:40,y:52,width:16,height:10,fill:'#bbdefb',stroke:'#42a5f5',strokeWidth:0.5}),
      React.createElement('circle',{cx:48,cy:52,r:2,fill:'#4caf50'}),
      React.createElement('rect',{x:60,y:50,width:22,height:14,fill:'#ffccbc',stroke:'#ff8a65',strokeWidth:0.5}),
      React.createElement('circle',{cx:71,cy:50,r:2,fill:'#f44336'}),
      React.createElement('line',{x1:42,y1:66,x2:42,y2:72,stroke:'#42a5f5',strokeWidth:3}),
      React.createElement('line',{x1:48,y1:63,x2:48,y2:72,stroke:'#66bb6a',strokeWidth:3}),
      React.createElement('line',{x1:54,y1:60,x2:54,y2:72,stroke:'#f44336',strokeWidth:3}),
      React.createElement('line',{x1:60,y1:58,x2:60,y2:72,stroke:'#f4d03f',strokeWidth:3}),
      React.createElement('rect',{x:45,y:92,width:6,height:8,fill:'#6d4c1f'}),
      React.createElement('rect',{x:69,y:92,width:6,height:8,fill:'#6d4c1f'}),
      React.createElement('polygon',{points:'25,27 60,12 95,27',fill:'#5d4037'})
    );
    case 'nstc': return React.createElement('g',null,
      React.createElement('rect',{x:8,y:40,width:114,height:55,rx:2,fill:'#eceff1',stroke:'#90a4ae',strokeWidth:2}),
      React.createElement('polygon',{points:'5,42 65,8 125,42',fill:'#cfd8dc',stroke:'#90a4ae',strokeWidth:1.5}),
      React.createElement('rect',{x:18,y:42,width:8,height:53,fill:'#e0e0e0',stroke:'#bdbdbd',strokeWidth:0.8}),
      React.createElement('rect',{x:34,y:42,width:8,height:53,fill:'#e0e0e0',stroke:'#bdbdbd',strokeWidth:0.8}),
      React.createElement('rect',{x:50,y:42,width:8,height:53,fill:'#e0e0e0',stroke:'#bdbdbd',strokeWidth:0.8}),
      React.createElement('rect',{x:68,y:42,width:8,height:53,fill:'#e0e0e0',stroke:'#bdbdbd',strokeWidth:0.8}),
      React.createElement('rect',{x:84,y:42,width:8,height:53,fill:'#e0e0e0',stroke:'#bdbdbd',strokeWidth:0.8}),
      React.createElement('rect',{x:100,y:42,width:8,height:53,fill:'#e0e0e0',stroke:'#bdbdbd',strokeWidth:0.8}),
      React.createElement('rect',{x:5,y:38,width:120,height:6,rx:1,fill:'#b0bec5'}),
      React.createElement('rect',{x:48,y:65,width:30,height:30,rx:2,fill:'#78909c'}),
      React.createElement('path',{d:'M48,65 Q63,55 78,65',fill:'#90a4ae'}),
      React.createElement('line',{x1:65,y1:8,x2:65,y2:-5,stroke:'#795548',strokeWidth:2}),
      React.createElement('polygon',{points:'66,-5 82,0 66,5',fill:'#c62828'}),
      React.createElement('circle',{cx:65,cy:25,r:7,fill:'#f4d03f',stroke:'#e6b800',strokeWidth:1}),
      React.createElement('text',{x:65,y:28,textAnchor:'middle',fill:'#c62828',fontSize:8,fontWeight:'bold'},'\u570B'),
      React.createElement('rect',{x:30,y:93,width:66,height:4,rx:1,fill:'#b0bec5'}),
      React.createElement('rect',{x:25,y:96,width:76,height:4,rx:1,fill:'#cfd8dc'})
    );
    case 'tianliao': return React.createElement('g',null,
      React.createElement('polygon',{points:'10,95 60,15 110,95',fill:'#607d8b'}),
      React.createElement('polygon',{points:'25,95 60,30 95,95',fill:'#78909c',opacity:0.6}),
      React.createElement('polygon',{points:'45,35 60,15 75,35',fill:'white',opacity:0.7}),
      React.createElement('rect',{x:40,y:72,width:30,height:22,rx:2,fill:'#a1887f'}),
      React.createElement('polygon',{points:'35,74 55,58 75,74',fill:'#6d4c41'}),
      React.createElement('rect',{x:50,y:78,width:10,height:16,rx:1,fill:'#5d4037'}),
      React.createElement('rect',{x:43,y:77,width:6,height:6,fill:'#fff9c4'}),
      React.createElement('polygon',{points:'28,78 32,65 36,78',fill:'#388e3c',opacity:0.7}),
      React.createElement('polygon',{points:'78,72 82,60 86,72',fill:'#2e7d32',opacity:0.7}),
      React.createElement('polygon',{points:'22,88 26,76 30,88',fill:'#43a047',opacity:0.6}),
      React.createElement('path',{d:'M55,94 Q50,98 55,100',fill:'none',stroke:'#d4b880',strokeWidth:3,opacity:0.6})
    );
    case 'mituo': return React.createElement('g',null,
      React.createElement('ellipse',{cx:60,cy:90,rx:55,ry:12,fill:'#f5deb3',opacity:0.8}),
      React.createElement('path',{d:'M0,95 Q30,88 60,95 Q90,102 120,95',fill:'#4fc3f7',opacity:0.4}),
      React.createElement('path',{d:'M5,100 Q35,93 65,100 Q95,107 120,100',fill:'#81d4fa',opacity:0.3}),
      React.createElement('rect',{x:35,y:52,width:40,height:38,rx:2,fill:'#d7ccc8',stroke:'#a1887f',strokeWidth:1.5}),
      React.createElement('polygon',{points:'28,55 55,32 82,55',fill:'#8d6e3f',stroke:'#6d4c1f',strokeWidth:1}),
      React.createElement('rect',{x:48,y:65,width:14,height:25,rx:1,fill:'#6d4c41'}),
      React.createElement('rect',{x:38,y:60,width:10,height:10,fill:'#81d4fa'}),
      React.createElement('path',{d:'M100,90 Q98,60 102,35',fill:'none',stroke:'#795548',strokeWidth:5}),
      React.createElement('path',{d:'M102,35 Q85,30 75,38',fill:'none',stroke:'#388e3c',strokeWidth:3}),
      React.createElement('path',{d:'M102,35 Q115,28 120,38',fill:'none',stroke:'#388e3c',strokeWidth:3}),
      React.createElement('path',{d:'M102,35 Q95,22 88,28',fill:'none',stroke:'#2e7d32',strokeWidth:2.5}),
      React.createElement('path',{d:'M102,35 Q112,22 118,28',fill:'none',stroke:'#2e7d32',strokeWidth:2.5}),
      React.createElement('path',{d:'M102,35 Q100,20 105,18',fill:'none',stroke:'#43a047',strokeWidth:2}),
      React.createElement('circle',{cx:100,cy:37,r:3,fill:'#795548'}),
      React.createElement('circle',{cx:105,cy:36,r:3,fill:'#6d4c41'})
    );
    case 'hengzhai': return React.createElement('g',null,
      React.createElement('rect',{x:20,y:40,width:80,height:55,rx:2,fill:'#b0bec5',stroke:'#78909c',strokeWidth:2}),
      React.createElement('line',{x1:15,y1:40,x2:15,y2:95,stroke:'#ff8f00',strokeWidth:2}),
      React.createElement('line',{x1:105,y1:40,x2:105,y2:95,stroke:'#ff8f00',strokeWidth:2}),
      React.createElement('line',{x1:15,y1:55,x2:105,y2:55,stroke:'#ff8f00',strokeWidth:1.5}),
      React.createElement('line',{x1:15,y1:70,x2:105,y2:70,stroke:'#ff8f00',strokeWidth:1.5}),
      React.createElement('line',{x1:15,y1:85,x2:105,y2:85,stroke:'#ff8f00',strokeWidth:1.5}),
      React.createElement('rect',{x:85,y:5,width:6,height:90,fill:'#ffb300'}),
      React.createElement('rect',{x:55,y:5,width:40,height:5,fill:'#ffb300'}),
      React.createElement('line',{x1:55,y1:10,x2:55,y2:30,stroke:'#9e9e9e',strokeWidth:1,strokeDasharray:'3,2'}),
      React.createElement('rect',{x:50,y:28,width:10,height:8,fill:'#ef5350'}),
      React.createElement('line',{x1:85,y1:5,x2:91,y2:35,stroke:'#ff8f00',strokeWidth:1}),
      React.createElement('line',{x1:91,y1:5,x2:85,y2:35,stroke:'#ff8f00',strokeWidth:1}),
      React.createElement('rect',{x:28,y:48,width:12,height:10,fill:'#cfd8dc',stroke:'#90a4ae',strokeWidth:0.8}),
      React.createElement('rect',{x:48,y:48,width:12,height:10,fill:'#cfd8dc',stroke:'#90a4ae',strokeWidth:0.8}),
      React.createElement('rect',{x:68,y:48,width:12,height:10,fill:'#90a4ae',opacity:0.3}),
      React.createElement('rect',{x:28,y:65,width:12,height:10,fill:'#90a4ae',opacity:0.3}),
      React.createElement('rect',{x:48,y:65,width:12,height:10,fill:'#cfd8dc',stroke:'#90a4ae',strokeWidth:0.8}),
      React.createElement('rect',{x:68,y:65,width:12,height:10,fill:'#cfd8dc',stroke:'#90a4ae',strokeWidth:0.8}),
      React.createElement('rect',{x:20,y:88,width:80,height:7,fill:'#ffb300',opacity:0.6}),
      React.createElement('line',{x1:25,y1:88,x2:32,y2:95,stroke:'#111',strokeWidth:1.5,opacity:0.4}),
      React.createElement('line',{x1:40,y1:88,x2:47,y2:95,stroke:'#111',strokeWidth:1.5,opacity:0.4}),
      React.createElement('line',{x1:55,y1:88,x2:62,y2:95,stroke:'#111',strokeWidth:1.5,opacity:0.4}),
      React.createElement('line',{x1:70,y1:88,x2:77,y2:95,stroke:'#111',strokeWidth:1.5,opacity:0.4}),
      React.createElement('line',{x1:85,y1:88,x2:92,y2:95,stroke:'#111',strokeWidth:1.5,opacity:0.4})
    );
    case 'wangfund': return React.createElement('g',null,
      React.createElement('rect',{x:10,y:35,width:100,height:60,rx:3,fill:'#fff8e1',stroke:'#ffd54f',strokeWidth:2}),
      React.createElement('polygon',{points:'5,38 60,8 115,38',fill:'#f4d03f',stroke:'#e6b800',strokeWidth:1.5}),
      React.createElement('rect',{x:8,y:32,width:104,height:6,rx:1,fill:'#ffd54f'}),
      React.createElement('rect',{x:18,y:38,width:7,height:57,fill:'#fff8e1',stroke:'#ffd54f',strokeWidth:0.8}),
      React.createElement('rect',{x:38,y:38,width:7,height:57,fill:'#fff8e1',stroke:'#ffd54f',strokeWidth:0.8}),
      React.createElement('rect',{x:75,y:38,width:7,height:57,fill:'#fff8e1',stroke:'#ffd54f',strokeWidth:0.8}),
      React.createElement('rect',{x:95,y:38,width:7,height:57,fill:'#fff8e1',stroke:'#ffd54f',strokeWidth:0.8}),
      React.createElement('rect',{x:48,y:55,width:24,height:40,rx:3,fill:'#8d6e3f'}),
      React.createElement('rect',{x:48,y:55,width:11,height:40,fill:'#7c5e35'}),
      React.createElement('path',{d:'M48,55 Q60,45 72,55',fill:'#a1887f'}),
      React.createElement('circle',{cx:67,cy:76,r:2.5,fill:'#f4d03f'}),
      React.createElement('circle',{cx:53,cy:76,r:2.5,fill:'#f4d03f'}),
      React.createElement('circle',{cx:60,cy:22,r:8,fill:'#f4d03f',stroke:'#e6b800',strokeWidth:1.5}),
      React.createElement('text',{x:60,y:26,textAnchor:'middle',fill:'#8d6e3f',fontSize:10,fontWeight:'bold'},'\u738B'),
      React.createElement('rect',{x:35,y:93,width:50,height:4,rx:1,fill:'#ffd54f'}),
      React.createElement('rect',{x:30,y:96,width:60,height:4,rx:1,fill:'#ffe082'})
    );
    default: return React.createElement('g',null,
      React.createElement('rect',{x:25,y:45,width:70,height:50,rx:3,fill:'#e0e0e0',stroke:'#bdbdbd',strokeWidth:2}),
      React.createElement('polygon',{points:'15,48 60,15 105,48',fill:'#78909c'}),
      React.createElement('rect',{x:45,y:60,width:25,height:35,rx:2,fill:'#9e9e9e'}),
      React.createElement('rect',{x:30,y:55,width:12,height:12,fill:'#bbdefb'})
    );
  }
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
  const[playerPos,setPlayerPos]=useState(c.mapPos||{x:1200,y:1500});
  const[moving,setMoving]=useState(null);
  const moveSpeed=8;
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

  // Keep a ref for moving state so interval can read it
  const movingRef=useRef(null);
  useEffect(()=>{movingRef.current=moving},[moving]);

  // Keyboard + touch movement loop
  useEffect(()=>{
    const keys={};
    const down=e=>{keys[e.key]=true};
    const up=e=>{delete keys[e.key]};
    window.addEventListener('keydown',down);
    window.addEventListener('keyup',up);

    const loop=setInterval(()=>{
      let dx=0,dy=0;
      if(keys['w']||keys['W']||keys['ArrowUp'])dy=-1;
      if(keys['s']||keys['S']||keys['ArrowDown'])dy=1;
      if(keys['a']||keys['A']||keys['ArrowLeft'])dx=-1;
      if(keys['d']||keys['D']||keys['ArrowRight'])dx=1;
      const m=movingRef.current;
      if(m){dx+=m.dx;dy+=m.dy}
      if(dx||dy){
        const len=Math.sqrt(dx*dx+dy*dy);
        setPlayerPos(p=>({
          x:Math.max(100,Math.min(2300,p.x+dx/len*moveSpeed)),
          y:Math.max(100,Math.min(2300,p.y+dy/len*moveSpeed))
        }));
      }
    },16);

    return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);clearInterval(loop)};
  },[]);

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
      const mc=COACHES.find(co=>co.id===c.coach)||COACHES[0];
      const cLines=c.injured?mc.lines.injury:mc.lines.train;
      const tipText=cLines[Math.floor(Math.random()*cLines.length)];
      setCoachTip({text:mc.name+'：'+tipText});
    }
  },[]);

  // Map locations -- world coords (2400x2400)
  // Save player position before leaving hub
  function goSave(screen){setC(x=>({...x,mapPos:playerPos}));go(screen)}

  const locations=[
    // North area (y: 200-800) -- urban/arena zone
    {id:'status',icon:'📊',label:'狀態',x:1200,y:200,action:()=>{sfx('click');goSave('status')},tip:'查看能力值和成長紀錄'},
    {id:'wangfund',icon:'🏦',label:'老王基金會',x:1200,y:400,locked:c.eventLevel<4,
      action:()=>{if(c.eventLevel<4){sfx('fail');setToast({text:'🔒 世界賽等級！',type:'fail'});return}sfx('click');goSave('wangfund')},tip:'🔒 世界賽解鎖'},
    {id:'nstc',icon:'🏛️',label:'國訓中心',x:900,y:600,action:()=>{sfx('click');goSave('nstc')},tip:'國訓中心！可參觀'},
    {id:'arena',icon:'🏟️',label:'比賽場',x:1500,y:500,action:()=>{sfx('click');goSave('comp')},tip:'參加舉重比賽！'},
    // West area (x: 200-700) -- rural/mountains
    {id:'friend',icon:'🏘️',label:'朋友家',x:400,y:800,action:()=>{sfx('click');goSave('friend')},tip:'麻將、電動、唱歌'},
    {id:'jobs',icon:'💼',label:'打工',x:300,y:1000,action:()=>{sfx('click');goSave('jobs')},tip:'打工賺錢'},
    {id:'pool',icon:'🎱',label:'撞球館',x:500,y:1200,action:()=>{sfx('click');goSave('pool')},tip:'打撞球'},
    {id:'tianliao',icon:'⛰️',label:'田寮移訓',x:200,y:1300,action:()=>{sfx('click');goSave('tianliao')},tip:'阿公闖關！'},
    // Center area (around 1200,1500) -- home/town
    {id:'shop',icon:'🏪',label:'商店',x:1100,y:1400,action:()=>{sfx('click');goSave('shop')},tip:'購買裝備'},
    {id:'laundry',icon:'👕',label:'C&R WASH',x:1350,y:1450,action:()=>{sfx('click');goSave('laundry')},tip:'洗衣服！'},
    {id:'cafe',icon:'☕',label:'肆拾而立',x:1050,y:1550,action:()=>{sfx('click');goSave('cafe')},tip:'喝咖啡'},
    {id:'home',icon:'🏠',label:'我的家',x:1200,y:1600,action:()=>{sfx('click');goSave('home')},tip:'回家休息'},
    // East area (x: 1700-2200) -- industrial
    {id:'gym',icon:'🏋️',label:'訓練場',x:1800,y:1100,action:()=>{sfx('click');goSave('training')},tip:'訓練提升實力'},
    {id:'hengzhai',icon:'🏗️',label:'衡宅',x:1900,y:900,locked:(c.totalTrainings||0)<20,
      action:()=>{if((c.totalTrainings||0)<20){sfx('fail');setToast({text:'🔒 訓練20次！',type:'fail'});return}sfx('click');goSave('hengzhai')},tip:'🔒 訓練20次解鎖'},
    {id:'restaurant',icon:'🍜',label:'餐廳',x:2000,y:1300,action:()=>{sfx('click');goSave('restaurant')},tip:'吃飯補體力'},
    // South area (y: 1800-2200) -- beach/nature
    {id:'mituo',icon:'🌊',label:'彌陀基地',x:800,y:2000,action:()=>{sfx('click');goSave('mituo')},tip:'阿嬤愛心補給'},
    {id:'river',icon:'🎣',label:'釣魚河',x:1500,y:2100,action:()=>{sfx('click');goSave('river')},tip:'河邊放鬆'},
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

      {/* Open World Map with camera follow */}
      <div className="relative flex-1" style={{minHeight:0}}>
        <div className="absolute inset-0 overflow-hidden" style={{background:'#87CEEB'}}>

          {/* World container -- camera follows player */}
          <div style={{
            position:'absolute',
            width:2400,height:2400,
            transform:`translate(${-playerPos.x + window.innerWidth/2}px, ${-playerPos.y + (window.innerHeight-60)/2}px)`,
            transition:'transform 0.05s linear'
          }}>

          {/* SVG Background 2400x2400 */}
          <svg viewBox="0 0 2400 2400" width="2400" height="2400" className="absolute inset-0" xmlns="http://www.w3.org/2000/svg">
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
              <linearGradient id="pond" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4fc3f7"/>
                <stop offset="100%" stopColor="#0288d1"/>
              </linearGradient>
              <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e8d5a3"/>
                <stop offset="100%" stopColor="#d4b880"/>
              </linearGradient>
              <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5deb3"/>
                <stop offset="100%" stopColor="#deb887"/>
              </linearGradient>
              <filter id="mapShadow"><feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity=".15"/></filter>
              <radialGradient id="sun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff9c4"/>
                <stop offset="60%" stopColor="#fff176" stopOpacity=".6"/>
                <stop offset="100%" stopColor="#fff176" stopOpacity="0"/>
              </radialGradient>
            </defs>

            {/* Sky + ground */}
            <rect width="2400" height="2400" fill="url(#sky)"/>
            <rect x="0" y="300" width="2400" height="2100" fill="url(#grass1)"/>
            <rect x="0" y="500" width="2400" height="1900" fill="url(#grass2)" opacity=".4"/>

            {/* Terrain zones */}
            <rect x="600" y="100" width="1200" height="600" rx="40" fill="#a8d5a0" opacity=".25"/>
            <rect x="0" y="600" width="700" height="900" rx="30" fill="#4a9a2a" opacity=".15"/>
            <rect x="1600" y="700" width="800" height="800" rx="30" fill="#90a4ae" opacity=".12"/>
            <rect x="0" y="1800" width="2400" height="600" rx="20" fill="url(#sandGrad)" opacity=".3"/>
            <rect x="0" y="2100" width="2400" height="300" fill="url(#pond)" opacity=".35"/>

            {/* Sun */}
            <circle cx="400" cy="120" r="80" fill="url(#sun)"/>
            <circle cx="400" cy="120" r="35" fill="#fff9c4"/>

            {/* Clouds */}
            <g style={{animation:'cloud-drift 8s ease-in-out infinite alternate'}}>
              <ellipse cx="600" cy="100" rx="80" ry="28" fill="white" opacity=".85"/>
              <ellipse cx="570" cy="88" rx="45" ry="22" fill="white" opacity=".9"/>
              <ellipse cx="640" cy="92" rx="40" ry="20" fill="white" opacity=".88"/>
            </g>
            <g style={{animation:'cloud-drift2 10s ease-in-out infinite alternate'}}>
              <ellipse cx="1600" cy="80" rx="60" ry="22" fill="white" opacity=".8"/>
              <ellipse cx="1575" cy="70" rx="38" ry="18" fill="white" opacity=".85"/>
              <ellipse cx="1630" cy="72" rx="32" ry="16" fill="white" opacity=".82"/>
            </g>
            <g style={{animation:'cloud-drift 12s ease-in-out infinite alternate'}}>
              <ellipse cx="1100" cy="60" rx="55" ry="20" fill="white" opacity=".7"/>
              <ellipse cx="1080" cy="50" rx="35" ry="16" fill="white" opacity=".75"/>
            </g>

            {/* Mountains (west area) */}
            <g opacity=".5">
              <path d="M0,700 L100,450 L180,520 L280,380 L380,500 L450,700Z" fill="#607d8b"/>
              <path d="M30,700 L120,480 L200,540 L280,420 L360,530 L420,700Z" fill="#78909c" opacity=".7"/>
              <path d="M110,460 L130,440 L150,465" fill="white" opacity=".5"/>
            </g>
            <g opacity=".4">
              <path d="M100,900 L200,650 L300,750 L380,580 L480,720 L550,900Z" fill="#546e7a"/>
              <path d="M180,670 L200,650 L220,675" fill="white" opacity=".4"/>
            </g>

            {/* Dark grass accents spread across world */}
            {[[200,600,150],[500,800,120],[800,500,130],[1100,700,100],[1400,900,140],[1700,600,110],[300,1100,90],[600,1300,100],[900,1500,80],[1200,1100,120],[1500,1400,100],[1800,1200,90],[400,1700,80],[700,1900,110],[1000,1800,95],[1300,1600,85],[1600,1800,100],[1900,1500,75],[200,1500,70],[2100,900,100],[2100,1300,85]].map(([cx,cy,w],i)=>
              <ellipse key={'ga'+i} cx={cx} cy={cy} rx={w} ry={15} fill="#4a9a2a" opacity=".15"/>
            )}

            {/* Winding paths connecting locations */}
            <g fill="none" stroke="url(#pathGrad)" strokeLinecap="round">
              <path d="M1200,1600 Q1150,1500 1100,1400" strokeWidth="32" opacity=".8"/>
              <path d="M1200,1600 Q1280,1530 1350,1450" strokeWidth="28" opacity=".75"/>
              <path d="M1200,1600 Q1120,1580 1050,1550" strokeWidth="24" opacity=".7"/>
              <path d="M1100,1400 Q1150,1100 1200,800 Q1200,600 1200,400" strokeWidth="28" opacity=".7"/>
              <path d="M1200,400 Q1200,300 1200,200" strokeWidth="24" opacity=".65"/>
              <path d="M1200,400 Q1050,500 900,600" strokeWidth="24" opacity=".7"/>
              <path d="M1200,400 Q1350,450 1500,500" strokeWidth="24" opacity=".7"/>
              <path d="M1100,1400 Q1400,1300 1800,1100" strokeWidth="26" opacity=".7"/>
              <path d="M1800,1100 Q1850,1000 1900,900" strokeWidth="22" opacity=".65"/>
              <path d="M1800,1100 Q1900,1200 2000,1300" strokeWidth="22" opacity=".65"/>
              <path d="M1100,1400 Q700,1200 300,1000" strokeWidth="24" opacity=".65"/>
              <path d="M300,1000 Q350,900 400,800" strokeWidth="20" opacity=".6"/>
              <path d="M300,1000 Q400,1100 500,1200" strokeWidth="20" opacity=".6"/>
              <path d="M500,1200 Q350,1250 200,1300" strokeWidth="20" opacity=".6"/>
              <path d="M1200,1600 Q1000,1800 800,2000" strokeWidth="24" opacity=".65"/>
              <path d="M1200,1600 Q1350,1850 1500,2100" strokeWidth="24" opacity=".65"/>
              <path d="M1500,500 Q1700,700 1900,900" strokeWidth="20" opacity=".6"/>
              <path d="M900,600 Q650,700 400,800" strokeWidth="20" opacity=".6"/>
            </g>

            {/* Pond near fishing spot (1500,2100) */}
            <ellipse cx="1550" cy="2080" rx="120" ry="70" fill="url(#pond)" opacity=".85"/>
            <ellipse cx="1550" cy="2080" rx="100" ry="55" fill="#4dd0e1" opacity=".3"/>
            <g opacity=".4" style={{animation:'water-shimmer 3s ease-in-out infinite'}}>
              <path d="M1480,2070 Q1520,2062 1560,2070 Q1600,2078 1640,2070" fill="none" stroke="white" strokeWidth="2.5"/>
              <path d="M1500,2090 Q1535,2083 1570,2090 Q1605,2097 1630,2090" fill="none" stroke="white" strokeWidth="2"/>
            </g>
            <rect x="1480" y="2140" width="60" height="10" rx="2" fill="#8d6e3f"/>
            <rect x="1487" y="2150" width="6" height="14" fill="#6d4c1f"/>
            <rect x="1527" y="2150" width="6" height="14" fill="#6d4c1f"/>
            <g opacity=".6">
              <line x1="1440" y1="2110" x2="1438" y2="2080" stroke="#558b2f" strokeWidth="3"/>
              <ellipse cx="1437" cy="2077" rx="4" ry="6" fill="#795548"/>
              <line x1="1670" y1="2100" x2="1672" y2="2070" stroke="#558b2f" strokeWidth="3"/>
              <ellipse cx="1673" cy="2067" rx="4" ry="6" fill="#795548"/>
            </g>
            {/* Beach area south */}
            <ellipse cx="800" cy="2020" rx="200" ry="80" fill="#f5deb3" opacity=".5"/>
            <ellipse cx="800" cy="2060" rx="170" ry="50" fill="#deb887" opacity=".3"/>

            {/* Decorative Trees spread across world */}
            {[[80,500,22],[160,600,18],[2300,500,20],[2340,650,16],[60,900,19],[2320,850,17],[120,1100,15],[2280,1050,18],[700,350,20],[750,450,16],[1700,350,18],[1750,280,15],[650,1000,17],[680,1100,14],[1650,800,19],[1750,750,15],[900,1300,16],[950,1400,13],[1450,1300,17],[1500,1380,14],[400,1600,18],[450,1700,15],[1800,1600,16],[1850,1700,13],[600,1900,15],[650,2000,12],[1300,1900,16],[1350,1980,13],[200,800,14],[250,700,17],[2100,600,15],[2150,700,18],[1000,900,16],[1050,850,13],[1400,950,15],[1380,1050,12],[100,1500,17],[150,1400,14],[2200,1400,16],[2250,1500,13]].map(([cx,cy,r],i)=>
              <g key={'tree'+i} filter="url(#mapShadow)">
                <rect x={cx-4} y={cy} width={8} height={r*1.3} rx={3} fill="#6d4c1f"/>
                <circle cx={cx} cy={cy-r*0.3} r={r} fill={i%3===0?'#388e3c':i%3===1?'#43a047':'#2e7d32'}/>
                <circle cx={cx-r*0.4} cy={cy-r*0.5} r={r*0.7} fill={i%3===0?'#43a047':i%3===1?'#4caf50':'#388e3c'}/>
                <circle cx={cx+r*0.3} cy={cy-r*0.6} r={r*0.6} fill={i%3===0?'#4caf50':i%3===1?'#66bb6a':'#43a047'}/>
              </g>
            )}

            {/* Flowers */}
            {[[300,550,'#e91e63'],[500,700,'#ff9800'],[700,900,'#e91e63'],[900,1100,'#ffeb3b'],[1100,500,'#ff5722'],[1300,700,'#9c27b0'],[1500,1000,'#ffeb3b'],[1700,600,'#e91e63'],[400,1400,'#ff9800'],[600,1600,'#9c27b0'],[1000,1300,'#e91e63'],[1200,1200,'#ff5722'],[1600,1500,'#ffeb3b'],[1800,1400,'#e91e63'],[2000,1000,'#ff9800'],[2100,800,'#9c27b0'],[350,1800,'#ff5722'],[750,1700,'#ffeb3b'],[1100,1800,'#e91e63'],[1400,1700,'#ff9800'],[1700,1900,'#9c27b0'],[2000,1700,'#ffeb3b'],[200,1000,'#e91e63'],[2200,1100,'#ff5722']].map(([cx,cy,c],i)=>
              <g key={'fl'+i} style={{animation:`flower-sway ${2+i%3}s ease-in-out infinite`,transformOrigin:`${cx}px ${cy}px`}}>
                <circle cx={cx} cy={cy} r="5" fill={c} opacity=".8"/>
                <circle cx={cx} cy={cy} r="2.5" fill="#fff9c4"/>
              </g>
            )}

            {/* Bushes */}
            {[[250,650],[550,850],[850,1050],[1150,750],[1450,1150],[1750,950],[350,1100],[650,1300],[950,1500],[1250,1100],[1550,1350],[1850,1250],[150,1350],[450,1550],[750,1750],[1050,1650],[1350,1700],[1650,1600],[2050,900],[2150,1150],[2050,1500],[100,700],[2300,1300]].map(([cx,cy],i)=>
              <g key={'bush'+i}>
                <ellipse cx={cx} cy={cy} rx={16+i%4*3} ry={10+i%3*2} fill={i%2===0?'#388e3c':'#2e7d32'} opacity=".75"/>
                <ellipse cx={cx+6} cy={cy-4} rx={10+i%3} ry={7} fill={i%2===0?'#43a047':'#388e3c'} opacity=".7"/>
              </g>
            )}

            {/* Fences along center paths */}
            <g stroke="#8d6e3f" strokeWidth="2.5" opacity=".35">
              {[1350,1380,1410,1440,1470,1500].map((y,i)=>
                <g key={'fn'+i}>
                  <line x1="1170" y1={y} x2="1170" y2={y+16}/>
                  <line x1="1230" y1={y} x2="1230" y2={y+16}/>
                </g>
              )}
              <line x1="1170" y1="1350" x2="1170" y2="1510" strokeWidth="1.5"/>
              <line x1="1230" y1="1350" x2="1230" y2="1510" strokeWidth="1.5"/>
            </g>

            {/* Lamp posts */}
            {[[1170,1330],[1230,1330],[1170,1620],[1230,1620],[900,580],[1500,480]].map(([cx,cy],i)=>
              <g key={'lamp'+i}>
                <rect x={cx-3} y={cy} width={6} height={25} fill="#607d8b"/>
                <circle cx={cx} cy={cy-3} r={6} fill="#fff9c4" opacity=".6"/>
                <circle cx={cx} cy={cy-3} r={4} fill="#ffeb3b" opacity=".8"/>
              </g>
            )}

            {/* Park benches */}
            {[[1080,1500],[1320,1500],[1150,1700],[1250,1700]].map(([cx,cy],i)=>
              <g key={'bench'+i}>
                <rect x={cx-14} y={cy} width={28} height={5} rx={1} fill="#6d4c1f"/>
                <rect x={cx-12} y={cy+5} width={5} height={7} fill="#5d3c0f"/>
                <rect x={cx+7} y={cy+5} width={5} height={7} fill="#5d3c0f"/>
                <rect x={cx-15} y={cy-7} width={30} height={4} rx={1} fill="#8d6e3f"/>
              </g>
            )}

            {/* Building silhouettes removed - now rendered as large SVGs at location markers */}

          </svg>

          {/* Locations with proximity detection -- large SVG buildings */}
          {locations.map(loc=>{
            const dist=Math.sqrt((loc.x-playerPos.x)**2+(loc.y-playerPos.y)**2);
            const nearby=dist<200;
            const bw=loc.id==='arena'?140:loc.id==='nstc'||loc.id==='wangfund'?130:120;
            const bh=100;
            return(
              <div key={loc.id} className="absolute" style={{left:loc.x,top:loc.y,transform:'translate(-50%,-100%)',zIndex:nearby?7:5}}>
                <div className={`cursor-pointer transition-all ${nearby?'scale-110':''} ${loc.locked?'opacity-40 grayscale':''}`}
                  onClick={()=>{if(nearby&&!loc.locked){loc.action();setHovered(null)}else if(loc.locked){loc.action()}}}>
                  <svg viewBox={`0 0 ${bw} ${bh}`} width={bw} height={bh} xmlns="http://www.w3.org/2000/svg"
                    style={{filter:nearby?'drop-shadow(0 0 8px rgba(244,208,63,.6))':'drop-shadow(0 2px 4px rgba(0,0,0,.25))'}}>
                    {getBuildingSVG(loc.id)}
                    {loc.locked&&<React.Fragment>
                      <rect x="0" y="0" width={bw} height={bh} fill="black" opacity="0.3" rx="4"/>
                      <text x={bw/2} y={bh/2} textAnchor="middle" fontSize="24" dominantBaseline="central">🔒</text>
                    </React.Fragment>}
                  </svg>
                  <div className={`text-center font-vt text-xs mt-0 px-1.5 rounded whitespace-nowrap ${nearby&&!loc.locked?'bg-pixel-gold text-pixel-dark':'bg-pixel-dark bg-opacity-75 text-white'}`}
                    style={{boxShadow:'0 1px 3px rgba(0,0,0,.3)'}}>{loc.label}</div>
                  {nearby&&!loc.locked&&<div className="text-center font-vt text-[10px] text-pixel-gold blink">▶ 進入</div>}
                </div>
              </div>
            );
          })}

          {/* Player character at playerPos */}
          <div className="absolute cursor-pointer" style={{left:playerPos.x,top:playerPos.y,transform:'translate(-50%,-50%)',zIndex:10}}
            onClick={()=>{
              sfx('tap');
              const mood=c.fatigue>60?['好累...😮‍💨','想回家睡覺💤','需要休息','肚子好餓🍜']:
                c.streak>=5?['狀態超好🔥','要破紀錄！','停不下來💪','越練越強⚡']:
                (c.injured)?['好痛🤕','要小心','先去治療']:
                ['今天加油💪','嗨😊','練起來🔥','去哪好呢🤔','想吃東西🍜','天氣真好☀️','該訓練了🏋️','挑戰自我✨'];
              setToast({text:mood[Math.floor(Math.random()*mood.length)],type:'success'});
            }}>
            <div className="bounce" style={{animationDuration:'2s'}}>
              <CharAvatar charId={c.avatar} size={96} lifting={c.streak>=3}/>
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 items-center">
              {c.fatigue>50&&<span className="text-lg float">💦</span>}
              {c.streak>=5&&<span className="text-lg bounce">🔥</span>}
              {c.injured&&<span className="text-lg shake">🤕</span>}
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-pixel-dark bg-opacity-80 px-2 py-0.5 rounded whitespace-nowrap">
              <span className="font-vt text-pixel-gold text-xs">{c.name}</span>
            </div>
          </div>

          {/* Coach chibi near player */}
          {(()=>{const mc=COACHES.find(co=>co.id===c.coach)||COACHES[0];return(
            <div className="absolute" style={{left:playerPos.x+60,top:playerPos.y+10,transform:'translate(-50%,-50%)',zIndex:7,pointerEvents:'none'}}>
              <div className="float" style={{animationDelay:'0.5s'}}>
                <svg viewBox="0 0 40 50" width="45" height="56" xmlns="http://www.w3.org/2000/svg">
                  {mc.id==='titan'&&<g>
                    <ellipse cx="20" cy="48" rx="10" ry="2" fill="#000" opacity=".15"/>
                    <rect x="14" y="35" width="5" height="10" rx="1" fill="#1a237e"/>
                    <rect x="21" y="35" width="5" height="10" rx="1" fill="#1a237e"/>
                    <rect x="12" y="44" width="6" height="3" rx="1" fill="#ef5350"/>
                    <rect x="22" y="44" width="6" height="3" rx="1" fill="#ef5350"/>
                    <rect x="10" y="18" width="20" height="18" rx="4" fill="#ef5350"/>
                    <path d="M10,24 Q4,22 5,30" stroke={mc.appearance.skin} strokeWidth="4" fill="none" strokeLinecap="round"/>
                    <path d="M30,24 Q36,20 35,14" stroke={mc.appearance.skin} strokeWidth="4" fill="none" strokeLinecap="round"/>
                    <circle cx="20" cy="10" r="9" fill={mc.appearance.skin}/>
                    <path d="M11,7 Q11,1 20,0 Q29,1 29,7" fill={mc.appearance.hair}/>
                    <rect x="12" y="4" width="16" height="3" rx="1" fill="#ef5350"/>
                    <circle cx="17" cy="10" r="1.5" fill="#263238"/>
                    <circle cx="23" cy="10" r="1.5" fill="#263238"/>
                    <path d="M17,14 Q20,17 23,14" stroke="#c62828" strokeWidth="1.2" fill="#ef5350"/>
                  </g>}
                  {mc.id==='monk'&&<g>
                    <ellipse cx="20" cy="48" rx="10" ry="2" fill="#000" opacity=".15"/>
                    <rect x="14" y="36" width="5" height="10" rx="1" fill="#ff8f00"/>
                    <rect x="21" y="36" width="5" height="10" rx="1" fill="#ff8f00"/>
                    <rect x="13" y="44" width="6" height="3" rx="1" fill="#5d4037"/>
                    <rect x="21" y="44" width="6" height="3" rx="1" fill="#5d4037"/>
                    <rect x="10" y="18" width="20" height="20" rx="4" fill="#ff8f00"/>
                    <path d="M10,26 Q4,30 5,36" stroke={mc.appearance.skin} strokeWidth="4" fill="none" strokeLinecap="round"/>
                    <path d="M30,26 Q36,24 35,18" stroke={mc.appearance.skin} strokeWidth="4" fill="none" strokeLinecap="round"/>
                    <circle cx="20" cy="10" r="9" fill={mc.appearance.skin}/>
                    <ellipse cx="20" cy="4" rx="8" ry="4" fill={mc.appearance.hair} opacity=".2"/>
                    <circle cx="17" cy="10" r="1.2" fill="#263238"/>
                    <circle cx="23" cy="10" r="1.2" fill="#263238"/>
                    <path d="M18,14 Q20,16 22,14" stroke="#5d4037" strokeWidth="0.8" fill="none"/>
                    <ellipse cx="20" cy="22" rx="3" ry="1" fill="#8d6e63" opacity=".4"/>
                  </g>}
                  {mc.id==='thor'&&<g>
                    <ellipse cx="20" cy="48" rx="12" ry="2" fill="#000" opacity=".15"/>
                    <rect x="13" y="35" width="6" height="12" rx="2" fill="#1a237e"/>
                    <rect x="21" y="35" width="6" height="12" rx="2" fill="#1a237e"/>
                    <rect x="12" y="45" width="7" height="3" rx="1" fill="#5d4037"/>
                    <rect x="21" y="45" width="7" height="3" rx="1" fill="#5d4037"/>
                    <rect x="9" y="16" width="22" height="22" rx="4" fill="#546e7a"/>
                    <rect x="10" y="16" width="20" height="4" rx="1" fill="#78909c"/>
                    <path d="M9,24 Q2,20 3,30" stroke={mc.appearance.skin} strokeWidth="5" fill="none" strokeLinecap="round"/>
                    <path d="M31,24 Q38,18 37,12" stroke={mc.appearance.skin} strokeWidth="5" fill="none" strokeLinecap="round"/>
                    <circle cx="20" cy="8" r="10" fill={mc.appearance.skin}/>
                    <path d="M10,4 Q10,-2 15,-4 Q18,-5 20,-4 Q22,-5 25,-4 Q30,-2 30,4" fill={mc.appearance.hair}/>
                    <path d="M12,8 Q10,14 13,16" stroke={mc.appearance.hair} strokeWidth="2" fill="none"/>
                    <path d="M28,8 Q30,14 27,16" stroke={mc.appearance.hair} strokeWidth="2" fill="none"/>
                    <path d="M16,12 Q18,16 20,16 Q22,16 24,12" stroke={mc.appearance.hair} strokeWidth="1.5" fill={mc.appearance.hair}/>
                    <circle cx="17" cy="6" r="2" fill="#fff"/><circle cx="17" cy="6.5" r="1.2" fill="#2196f3"/>
                    <circle cx="23" cy="6" r="2" fill="#fff"/><circle cx="23" cy="6.5" r="1.2" fill="#2196f3"/>
                  </g>}
                </svg>
              </div>
            </div>
          );})()}

          </div>{/* End world container */}

          {/* Mobile D-pad overlay */}
          <div className="absolute bottom-20 left-4 z-30 opacity-50 md:hidden">
            <div className="relative w-28 h-28">
              <button onTouchStart={e=>{e.preventDefault();setMoving({dx:0,dy:-1})}} onTouchEnd={()=>setMoving(null)} onTouchCancel={()=>setMoving(null)}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-lg select-none active:bg-opacity-50">&#9650;</button>
              <button onTouchStart={e=>{e.preventDefault();setMoving({dx:0,dy:1})}} onTouchEnd={()=>setMoving(null)} onTouchCancel={()=>setMoving(null)}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-lg select-none active:bg-opacity-50">&#9660;</button>
              <button onTouchStart={e=>{e.preventDefault();setMoving({dx:-1,dy:0})}} onTouchEnd={()=>setMoving(null)} onTouchCancel={()=>setMoving(null)}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-lg select-none active:bg-opacity-50">&#9664;</button>
              <button onTouchStart={e=>{e.preventDefault();setMoving({dx:1,dy:0})}} onTouchEnd={()=>setMoving(null)} onTouchCancel={()=>setMoving(null)}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-lg select-none active:bg-opacity-50">&#9654;</button>
            </div>
          </div>

          {/* Minimap */}
          <div className="absolute top-2 right-2 z-20 opacity-70">
            <div className="relative w-20 h-20 bg-pixel-dark bg-opacity-60 border border-pixel-gray rounded overflow-hidden">
              <svg viewBox="0 0 2400 2400" width="80" height="80">
                <rect width="2400" height="2400" fill="#5aad36" opacity=".6"/>
                <rect x="0" y="2100" width="2400" height="300" fill="#0288d1" opacity=".4"/>
                {locations.map(loc=>(
                  <circle key={loc.id} cx={loc.x} cy={loc.y} r="60" fill={loc.locked?'#666':'#f4d03f'} opacity=".8"/>
                ))}
                <circle cx={playerPos.x} cy={playerPos.y} r="80" fill="#ef5350"/>
              </svg>
            </div>
          </div>

          {/* WASD hint (desktop) */}
          <div className="absolute top-2 left-2 z-20 hidden md:block">
            <div className="bg-pixel-dark bg-opacity-50 px-2 py-1 rounded">
              <span className="font-vt text-pixel-light text-[10px] opacity-60">WASD / &#8592;&#8593;&#8594;&#8595; 移動</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
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
  const[showProgram,setShowProgram]=useState(false);
  const ms=maxSta(c.stats.sta);
  const hasBoost=c.activeEffects.some(e=>e.type==='trainBoost');
  const mult=hasBoost?1.2:1;
  const streakB=Math.min(5,Math.floor(c.streak/5))*.05+1;
  const myCoach=COACHES.find(co=>co.id===c.coach)||COACHES[0];
  const injuryMult=c.injured?0.5:1;

  // Auto-recover from injury after 3-5 days (use day parity for pseudo-random threshold)
  useEffect(()=>{
    if(c.injured){
      const threshold=3+(c.injuryDay%3); // 3,4,5 based on injury start day
      if(c.day-c.injuryDay>=threshold){
        setC(x=>({...x,injured:false,injuryType:null,injuryDay:0}));
        setCoach({text:'傷好了！可以正常訓練了！'});
        sfx('success');
        setTimeout(()=>setCoach(null),2500);
      }
    }
  },[c.day]);

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
          bodyWeight:Math.round(((x.bodyWeight||parseInt(x.weightClass)||80)+0.05)*100)/100,
        }));
        setFloats([{icon:'😴',text:`+${rec}❤️`,color:'#38b764'},{icon:'😌',text:`-${fatDrop}😤`,color:'#73eff7'}]);
        if(c.fatigue>40){const rl=myCoach.lines.rest;setCoach({text:rl[Math.floor(Math.random()*rl.length)]});setTimeout(()=>setCoach(null),2000);}
      },2000);
      return;
    }
    if(c.stamina<t.cost){sfx('fail');setFloats([{icon:'❌',text:'體力不足',color:'#b13e53'}]);return}

    // Overtraining risk
    const injuryChance=c.fatigue>80?.15:c.fatigue>60?.05:0;
    if(injuryChance>0&&Math.random()<injuryChance){
      sfx('hurt');
      const injTypes=['肌肉拉傷','韌帶扭傷','腰部不適','膝蓋疼痛'];
      const injType=injTypes[Math.floor(Math.random()*injTypes.length)];
      setFloats([{icon:'🤕',text:'受傷！'+injType,color:'#b13e53'}]);
      setC(x=>({...x,stamina:Math.min(ms,x.stamina+10),day:x.day+1,fatigue:Math.max(0,x.fatigue-15),streak:0,
        injured:true,injuryDay:x.day,injuryType:injType,
        activeEffects:x.activeEffects.map(e=>({...e,dur:e.dur-1})).filter(e=>e.dur>0)}));
      const injLine=myCoach.lines.injury[Math.floor(Math.random()*myCoach.lines.injury.length)];
      setCoach({text:injLine});setTimeout(()=>setCoach(null),2500);
      return;
    }

    sfx('train');
    setExerciseAnim(t.id);
    const floatItems=[];const ns={...c.stats};
    for(const[s,v]of Object.entries(t.primary)){const cm=s===myCoach.bonusStat?myCoach.bonusValue:1;const g=Math.round(v*mult*streakB*injuryMult*cm);ns[s]=Math.min(100,ns[s]+g);floatItems.push({icon:SI[s],text:`+${g}`,color:SC[s]});}
    for(const[s,v]of Object.entries(t.secondary)){const cm=s===myCoach.bonusStat?myCoach.bonusValue:1;const g=Math.round(v*mult*streakB*injuryMult*cm);ns[s]=Math.min(100,ns[s]+g);floatItems.push({icon:SI[s],text:`+${g}`,color:SC[s]});}

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
      setC(x=>{const _sh=[...(x.statHistory||[])];if(x.day%5===0&&(_sh.length===0||_sh[_sh.length-1].day!==x.day)){_sh.push({day:x.day,stats:{...ns}});if(_sh.length>50)_sh.shift()}const wLoss=0.05+Math.random()*0.05;return{...x,stamina:x.stamina-t.cost,stats:ns,totalTrainings:x.totalTrainings+1,fatigue:Math.min(100,x.fatigue+fatGain),streak:newStreak,restStreak:0,lastTrainDay:x.day,principles:np,tcjsCount:isTcjs?(x.tcjsCount||0)+1:x.tcjsCount||0,statHistory:_sh,bodyWeight:Math.round(((x.bodyWeight||parseInt(x.weightClass)||80)-wLoss)*100)/100}});
      setFloats(floatItems);
      if(showCoach){setTimeout(()=>setCoach({text:t.tip}),500);setTimeout(()=>setCoach(null),2500);}
      else{const cLines=c.injured?myCoach.lines.injury:myCoach.lines.train;if(Math.random()<.4){setCoach({text:cLines[Math.floor(Math.random()*cLines.length)]});setTimeout(()=>setCoach(null),2000);}}
    },2000);
  }

  function endDay(){
    const rec=15+Math.floor(c.stats.rec/4);
    const fatDrop=5+Math.floor(c.stats.rec/8);
    sfx('newday');
    setC(x=>{const _sh=[...(x.statHistory||[])];if((x.day+1)%5===0&&(_sh.length===0||_sh[_sh.length-1].day!==(x.day+1))){_sh.push({day:x.day+1,stats:{...x.stats}});if(_sh.length>50)_sh.shift()}return{...x,stamina:Math.min(ms,x.stamina+rec),day:x.day+1,fatigue:Math.max(0,x.fatigue-fatDrop),activeEffects:x.activeEffects.map(e=>({...e,dur:e.dur-1})).filter(e=>e.dur>0),statHistory:_sh}});
    setFloats([{icon:'🌙',text:`+${rec}❤️`,color:'#41a6f6'}]);
  }

  function runProgram(prog){
    setShowProgram(false);
    const exercises=prog.exercises.map(eid=>TRAIN.find(t=>t.id===eid)).filter(Boolean);
    const nonRestExercises=exercises.filter(e=>!e.isRest);
    const totalCost=nonRestExercises.reduce((s,e)=>s+e.cost,0);
    if(c.stamina<totalCost*0.5){
      setCoach({text:'體力太低了，先休息吧！'});
      setTimeout(()=>setCoach(null),2000);
      return;
    }
    const allGains={};
    let staminaUsed=0;
    let completed=0;
    const nc={...c,stats:{...c.stats},principles:{...c.principles}};
    for(const ex of exercises){
      if(ex.isRest){
        const rec=20+Math.floor(nc.stats.rec/3);
        const fatDrop=Math.min(nc.fatigue||0,25+Math.floor(nc.stats.rec/5));
        nc.stamina=Math.min(ms,nc.stamina+rec);
        nc.stats.rec=Math.min(100,nc.stats.rec+1);
        nc.fatigue=Math.max(0,(nc.fatigue||0)-fatDrop);
        allGains['rec']=(allGains['rec']||0)+1;
        completed++;
        continue;
      }
      if(nc.stamina<ex.cost)break;
      nc.stamina-=ex.cost;
      staminaUsed+=ex.cost;
      for(const[s,v]of Object.entries({...ex.primary,...ex.secondary})){
        const gain=Math.round(v*mult*streakB*(s===myCoach.bonusStat?myCoach.bonusValue:1)*injuryMult);
        nc.stats[s]=Math.min(100,nc.stats[s]+gain);
        allGains[s]=(allGains[s]||0)+gain;
      }
      nc.fatigue=Math.min(100,(nc.fatigue||0)+Math.round(ex.cost*0.35));
      completed++;
    }
    nc.totalTrainings=(nc.totalTrainings||0)+completed;
    nc.lastTrainDay=nc.day;
    nc.streak=c.lastTrainDay===c.day-1||c.lastTrainDay===c.day?c.streak+completed:completed;
    nc.restStreak=0;
    setC(nc);
    const floatItems=Object.entries(allGains).map(([s,v])=>({icon:SI[s],text:'+'+v,color:SC[s]}));
    floatItems.push({icon:'📋',text:completed+'/'+exercises.length+'完成',color:'#f4d03f'});
    setFloats(floatItems);
    setCoach({text:completed===exercises.length?'課表全部完成！幹得好！':'體力不足，完成了'+completed+'/'+exercises.length});
    setTimeout(()=>setCoach(null),3000);
    sfx('success');
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

        {/* Injury Banner */}
        {c.injured&&<div className="pixel-border bg-red-900 border-red-500 p-2 mb-2 text-center">
          <span className="font-vt text-pixel-orange text-sm">🤕 受傷中：{c.injuryType}（第{c.day-c.injuryDay}天）訓練效果-50%</span>
        </div>}

        {/* Coach NPC */}
        <div className="pixel-border bg-pixel-charcoal p-1 mb-2 cursor-pointer relative"
          onClick={()=>{
            const cLines=c.injured?myCoach.lines.injury:myCoach.lines.train;
            setCoach({text:cLines[Math.floor(Math.random()*cLines.length)]});
            sfx('tap');
            setTimeout(()=>setCoach(null),2000);
          }}>
          <svg viewBox="0 0 400 100" className="w-full" xmlns="http://www.w3.org/2000/svg">
            {/* Gym background */}
            <rect width="400" height="100" fill="#2c3e50" rx="4"/>
            <rect x="0" y="85" width="400" height="15" fill="#34495e"/>

            {/* Weight rack in background */}
            <rect x="10" y="30" width="4" height="55" fill="#5d4037"/>
            <rect x="30" y="30" width="4" height="55" fill="#5d4037"/>
            <rect x="8" y="35" width="28" height="3" fill="#5d4037"/>
            <rect x="8" y="50" width="28" height="3" fill="#5d4037"/>
            <rect x="8" y="65" width="28" height="3" fill="#5d4037"/>
            <rect x="12" y="32" width="6" height="10" rx="1" fill="#ef5350"/>
            <rect x="20" y="32" width="6" height="10" rx="1" fill="#42a5f5"/>
            <rect x="12" y="47" width="6" height="10" rx="1" fill="#66bb6a"/>
            <rect x="20" y="47" width="6" height="10" rx="1" fill="#f4d03f"/>

            {/* Barbell on floor */}
            <rect x="300" y="78" width="80" height="3" rx="1" fill="#b0bec5"/>
            <rect x="295" y="72" width="8" height="14" rx="2" fill="#ef5350"/>
            <rect x="377" y="72" width="8" height="14" rx="2" fill="#ef5350"/>

            {/* COACH CHARACTER — adapts to selected coach */}
            {myCoach.id==='titan'&&<g transform="translate(250,28)">
              <ellipse cx="0" cy="58" rx="20" ry="4" fill="#000" opacity=".15"/>
              <rect x="-8" y="40" width="7" height="14" rx="2" fill="#1a237e"/>
              <rect x="1" y="40" width="7" height="14" rx="2" fill="#1a237e"/>
              <rect x="-10" y="52" width="9" height="5" rx="2" fill="#ef5350"/>
              <rect x="1" y="52" width="9" height="5" rx="2" fill="#ef5350"/>
              <rect x="-18" y="10" width="36" height="32" rx="6" fill="#ef5350"/>
              <path d="M-5,10 L0,15 L5,10" fill="none" stroke="#fff" strokeWidth="1.5"/>
              <path d="M-18,20 Q-30,18 -28,28" stroke={myCoach.appearance.skin} strokeWidth="7" fill="none" strokeLinecap="round"/>
              <path d="M18,20 Q30,12 35,8" stroke={myCoach.appearance.skin} strokeWidth="7" fill="none" strokeLinecap="round"/>
              <circle cx="35" cy="7" r="3.5" fill={myCoach.appearance.skin}/>
              <circle cx="0" cy="-2" r="14" fill={myCoach.appearance.skin}/>
              <path d="M-14,-6 Q-14,-14 0,-16 Q14,-14 14,-6" fill={myCoach.appearance.hair}/>
              <rect x="-13" y="-10" width="26" height="5" rx="2" fill="#ef5350"/>
              <ellipse cx="-6" cy="0" rx="3" ry="3.5" fill="#fff"/><ellipse cx="-6" cy="1" rx="2" ry="2.5" fill="#263238"/>
              <ellipse cx="6" cy="0" rx="3" ry="3.5" fill="#fff"/><ellipse cx="6" cy="1" rx="2" ry="2.5" fill="#263238"/>
              <line x1="-10" y1="-5" x2="-3" y2="-3" stroke="#5d4037" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="-3" x2="10" y2="-5" stroke="#5d4037" strokeWidth="2" strokeLinecap="round"/>
              <path d="M-5,6 Q0,12 5,6" stroke="#c62828" strokeWidth="2" fill="#ef5350"/>
            </g>}
            {myCoach.id==='monk'&&<g transform="translate(250,10)">
              <ellipse cx="0" cy="75" rx="25" ry="5" fill="#000" opacity=".15"/>
              <rect x="-10" y="55" width="8" height="18" rx="2" fill="#ff8f00"/>
              <rect x="2" y="55" width="8" height="18" rx="2" fill="#ff8f00"/>
              <rect x="-12" y="71" width="10" height="5" rx="2" fill="#5d4037"/>
              <rect x="2" y="71" width="10" height="5" rx="2" fill="#5d4037"/>
              <rect x="-18" y="22" width="36" height="36" rx="6" fill="#ff8f00"/>
              <path d="M-8,22 L0,28 L8,22" fill="none" stroke="#ffcc80" strokeWidth="1.5"/>
              <ellipse cx="0" cy="35" rx="3" ry="3" fill="#8d6e63" opacity=".5"/>
              <path d="M-18,32 Q-28,38 -26,48" stroke={myCoach.appearance.skin} strokeWidth="6" fill="none" strokeLinecap="round"/>
              <path d="M18,32 Q28,28 32,22" stroke={myCoach.appearance.skin} strokeWidth="6" fill="none" strokeLinecap="round"/>
              <circle cx="0" cy="8" r="15" fill={myCoach.appearance.skin}/>
              <ellipse cx="0" cy="-4" rx="14" ry="6" fill={myCoach.appearance.hair} opacity=".3"/>
              <ellipse cx="-6" cy="5" rx="3" ry="2" fill="#263238"/>
              <ellipse cx="6" cy="5" rx="3" ry="2" fill="#263238"/>
              <path d="M-4,12 Q0,15 4,12" stroke="#5d4037" strokeWidth="1.2" fill="none"/>
              <ellipse cx="0" cy="26" rx="8" ry="1.5" fill="#8d6e63" opacity=".4"/>
            </g>}
            {myCoach.id==='thor'&&<g transform="translate(250,8)">
              <ellipse cx="0" cy="78" rx="28" ry="5" fill="#000" opacity=".15"/>
              <rect x="-12" y="55" width="10" height="20" rx="3" fill="#1a237e"/>
              <rect x="2" y="55" width="10" height="20" rx="3" fill="#1a237e"/>
              <rect x="-14" y="73" width="12" height="5" rx="2" fill="#5d4037"/>
              <rect x="2" y="73" width="12" height="5" rx="2" fill="#5d4037"/>
              <rect x="-20" y="20" width="40" height="38" rx="6" fill="#546e7a"/>
              <rect x="-18" y="20" width="36" height="6" rx="2" fill="#78909c"/>
              <path d="M-20,30 Q-34,26 -32,40" stroke={myCoach.appearance.skin} strokeWidth="8" fill="none" strokeLinecap="round"/>
              <path d="M20,30 Q34,22 40,16" stroke={myCoach.appearance.skin} strokeWidth="8" fill="none" strokeLinecap="round"/>
              <circle cx="40" cy="15" r="4" fill={myCoach.appearance.skin}/>
              <circle cx="0" cy="6" r="16" fill={myCoach.appearance.skin}/>
              <path d="M-16,2 Q-16,-10 -10,-14 Q-4,-16 0,-14 Q4,-16 10,-14 Q16,-10 16,2" fill={myCoach.appearance.hair}/>
              <path d="M-14,6 Q-16,14 -12,18" stroke={myCoach.appearance.hair} strokeWidth="3" fill="none"/>
              <path d="M14,6 Q16,14 12,18" stroke={myCoach.appearance.hair} strokeWidth="3" fill="none"/>
              <path d="M-6,12 Q-4,18 0,18 Q4,18 6,12" stroke={myCoach.appearance.hair} strokeWidth="2" fill={myCoach.appearance.hair}/>
              <ellipse cx="-6" cy="2" rx="3.5" ry="3.5" fill="#fff"/><ellipse cx="-6" cy="3" rx="2.5" ry="2.5" fill="#2196f3"/>
              <ellipse cx="6" cy="2" rx="3.5" ry="3.5" fill="#fff"/><ellipse cx="6" cy="3" rx="2.5" ry="2.5" fill="#2196f3"/>
              <line x1="-12" y1="-3" x2="-3" y2="-1" stroke={myCoach.appearance.hair} strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="3" y1="-1" x2="12" y2="-3" stroke={myCoach.appearance.hair} strokeWidth="2.5" strokeLinecap="round"/>
              <rect x="-22" y="38" width="6" height="14" rx="1" fill="#1565c0" opacity=".3"/>
              <rect x="16" y="38" width="6" height="14" rx="1" fill="#1565c0" opacity=".3"/>
            </g>}

            {/* Coach name */}
            <text x="250" y="95" textAnchor="middle" fill="#f4d03f" fontSize="8" fontWeight="bold" fontFamily="LXGW WenKai TC,sans-serif">{myCoach.name}</text>
          </svg>

          {/* Coach speech bubble overlay */}
          {coach&&<div className="absolute top-1 left-2 bg-white bg-opacity-95 rounded-lg px-3 py-1 shadow-lg" style={{maxWidth:'60%'}}>
            <span className="font-vt text-pixel-dark text-sm font-bold">{coach.text}</span>
          </div>}
        </div>

        {/* Coach Program Button */}
        <div className="flex gap-1 mb-2">
          <button onClick={()=>setShowProgram(!showProgram)}
            className={`pixel-btn ${showProgram?'pixel-btn-gold':'bg-pixel-charcoal'} text-pixel-gold px-3 py-1 text-[9px] font-pixel flex-1`}>
            {showProgram?'✖ 收起課表':'📋 '+myCoach.name+'的課表'}
          </button>
        </div>

        {showProgram&&(
          <div className="pixel-border bg-pixel-charcoal p-2 mb-2 slide-up">
            <div className="font-vt text-pixel-gold text-sm mb-1">{'📋 '+myCoach.name+'的訓練課表'}</div>
            {myCoach.programs.map((prog,pi)=>{
              const exercises=prog.exercises.map(eid=>TRAIN.find(t=>t.id===eid)).filter(Boolean);
              const nonRestEx=exercises.filter(e=>!e.isRest);
              const totalCost=nonRestEx.reduce((s,e)=>s+e.cost,0);
              return(
                <div key={pi} className="mb-2 p-1.5 bg-pixel-dark rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-vt text-pixel-light text-sm">{'⭐'.repeat(prog.level)} {prog.name}</span>
                    <span className="font-vt text-pixel-gray text-xs">{prog.sets}</span>
                  </div>
                  <div className="font-vt text-pixel-cyan text-xs mb-1">「{prog.desc}」</div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {prog.exercises.map((eid,ei)=>{
                      const ex=TRAIN.find(t=>t.id===eid);
                      return ex?<span key={ei} className="text-xs bg-pixel-charcoal px-1 rounded font-vt text-pixel-light">{ex.icon} {ex.name.split(' ')[0]}</span>:null;
                    })}
                  </div>
                  <button onClick={()=>runProgram(prog)}
                    disabled={c.stamina<totalCost*0.5}
                    className={`w-full pixel-btn py-1 text-[9px] font-pixel ${c.stamina<totalCost*0.5?'bg-pixel-dark text-pixel-gray cursor-not-allowed':'bg-pixel-darkblue text-pixel-sky'}`}>
                    {'🏋️ 執行課表（需'+totalCost+'體力）'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

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
                    <span key={s} className="text-[10px]" style={{color:SC[s]}}>{SI[s]}{Math.round(v*mult*streakB*injuryMult*(s===myCoach.bonusStat?myCoach.bonusValue:1))}</span>
                  ))}
                </div>
                {!t.isRest&&<span className="font-vt text-pixel-orange text-[10px]">-{t.cost}❤️</span>}
                {t.isRest&&<span className="font-vt text-pixel-green text-[10px]">+❤️</span>}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 mb-2">
          <button onClick={()=>{
            if(c.fatigue<10){setCoach({text:'不累啊？去練！'});setTimeout(()=>setCoach(null),2000);return}
            sfx('rest');
            setC(x=>({...x,fatigue:Math.max(0,x.fatigue-15),stats:{...x.stats,stb:Math.min(100,x.stats.stb+1)}}));
            setFloats([{icon:'☕',text:'-15😤',color:'#73eff7'},{icon:'🧠',text:'+1',color:'#b13e53'}]);
            const cfLines=myCoach.lines.coffee;
            setCoach({text:cfLines[Math.floor(Math.random()*cfLines.length)]});
            setTimeout(()=>setCoach(null),2500);
          }} className="flex-1 pixel-btn bg-pixel-charcoal text-pixel-gold py-2 text-[10px] font-pixel">☕ 跟{myCoach.name}喝咖啡</button>
          <button onClick={endDay} className="flex-1 pixel-btn bg-pixel-darkblue text-pixel-sky py-2 text-lg">🌙</button>
        </div>
      </div>
    </div>
  );
}

// ── COMPETITION ──