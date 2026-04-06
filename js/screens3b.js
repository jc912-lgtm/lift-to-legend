function MituoScreen({c,setC,go}){
  const ms=maxSta(c.stats.sta);
  const[floats,setFloats]=useState(null);
  const[msg,setMsg]=useState(null);
  const[frame,setFrame]=useState(0);
  const[visited,setVisited]=useState({});
  const[reactAnim,setReactAnim]=useState(null);
  const[singNotes,setSingNotes]=useState(false);
  useEffect(()=>{const t=setInterval(()=>setFrame(f=>(f+1)%240),50);return()=>clearInterval(t)},[]);

  const breath=Math.sin(frame*0.04)*1.5;
  const waveSway=Math.sin(frame*0.03)*3;
  const palmSway=Math.sin(frame*0.02)*2;
  const noteY1=singNotes?(-10-frame%60):0;
  const noteY2=singNotes?(-15-(frame+15)%60):0;
  const noteY3=singNotes?(-8-(frame+30)%60):0;

  const ACTIVITIES=[
    {id:'cook',icon:'🍲',name:'阿嬤煮好料',cost:0,
      desc:'體力+35 疲勞-15 恢復+1',
      check:()=>!visited.cook,
      apply:(nc,fi)=>{
        nc.stamina=Math.min(ms,nc.stamina+35);nc.fatigue=Math.max(0,(nc.fatigue||0)-15);nc.stats.rec=Math.min(100,nc.stats.rec+1);
        fi.push({icon:'⚡',text:'+35體力',color:'#38b764'},{icon:'😌',text:'-15😤',color:'#73eff7'},{icon:'💚',text:'恢復+1',color:'#26c6da'});
        setReactAnim('cook');
        return '阿嬤：多吃一點！太瘦了啦';
      }},
    {id:'soup',icon:'🍗',name:'燉雞湯',cost:0,
      desc:'體力+40 疲勞-20 力量+1',
      check:()=>!visited.soup,
      apply:(nc,fi)=>{
        nc.stamina=Math.min(ms,nc.stamina+40);nc.fatigue=Math.max(0,(nc.fatigue||0)-20);nc.stats.str=Math.min(100,nc.stats.str+1);
        fi.push({icon:'⚡',text:'+40體力',color:'#38b764'},{icon:'😌',text:'-20😤',color:'#73eff7'},{icon:'💪',text:'力量+1',color:'#ef5350'});
        setReactAnim('cook');
        return '阿嬤：這雞是自己養的喔';
      }},
    {id:'redenv',icon:'🧧',name:'偷塞紅包',cost:0,
      desc:'30%機率 💰+200~500',
      check:()=>!visited.redenv,
      apply:(nc,fi)=>{
        if(Math.random()<0.3){
          const amt=200+Math.floor(Math.random()*301);
          nc.money+=amt;
          fi.push({icon:'💰',text:`+${amt}`,color:'#f4d03f'});
          setReactAnim('hug');
          return '阿嬤：(小聲) 不要跟阿公說喔';
        }else{
          nc.stats.stb=Math.min(100,nc.stats.stb+1);
          fi.push({icon:'🧠',text:'穩定+1',color:'#ab47bc'});
          setReactAnim('wave');
          return '阿嬤：乖孫，下次再給你';
        }
      }},
    {id:'temple',icon:'🙏',name:'去廟裡拜拜',cost:0,
      desc:'運氣+1 穩定+2 疲勞-10',
      check:()=>!visited.temple,
      apply:(nc,fi)=>{
        nc.luckBonus=(nc.luckBonus||0)+1;nc.stats.stb=Math.min(100,nc.stats.stb+2);nc.fatigue=Math.max(0,(nc.fatigue||0)-10);
        fi.push({icon:'🍀',text:'運氣+1',color:'#f4d03f'},{icon:'🧠',text:'穩定+2',color:'#ab47bc'},{icon:'😌',text:'-10😤',color:'#73eff7'});
        setReactAnim('pray');
        return '阿嬤：拜拜保佑你比賽順利！';
      }},
    {id:'sleep',icon:'😴',name:'阿嬤叫你早點睡',cost:0,
      desc:'疲勞-30 恢復+2 ⏩天+1',
      check:()=>!visited.sleep,
      apply:(nc,fi)=>{
        nc.fatigue=Math.max(0,(nc.fatigue||0)-30);nc.stats.rec=Math.min(100,nc.stats.rec+2);nc.day=(nc.day||0)+1;
        nc.activeEffects=(nc.activeEffects||[]).map(e=>({...e,dur:e.dur-1})).filter(e=>e.dur>0);
        fi.push({icon:'😌',text:'-30😤',color:'#73eff7'},{icon:'💚',text:'恢復+2',color:'#26c6da'},{icon:'📅',text:'+1天',color:'#f4d03f'});
        setReactAnim('wave');
        return '阿嬤：別練太晚！身體最重要';
      }},
    {id:'sing',icon:'🎤',name:'聽阿嬤唱「麗娜」',cost:0,
      desc:'全能力+1 體力+20 疲勞-20',
      check:()=>!visited.sing,
      apply:(nc,fi)=>{
        ['str','tec','pwr','stb','sta','rec'].forEach(s=>{nc.stats[s]=Math.min(100,nc.stats[s]+1)});
        nc.stamina=Math.min(ms,nc.stamina+20);nc.fatigue=Math.max(0,(nc.fatigue||0)-20);
        fi.push({icon:'✨',text:'全+1',color:'#f4d03f'},{icon:'⚡',text:'+20體力',color:'#38b764'},{icon:'😌',text:'-20😤',color:'#73eff7'});
        setSingNotes(true);setTimeout(()=>setSingNotes(false),3000);
        setReactAnim('sing');
        return '阿嬤：🎵 麗～娜～ 🎵';
      }},
  ];

  function doActivity(act){
    if(!act.check())return;
    if(act.id==='sing')sfx('cheer'); else sfx('rest');
    const nc={...c,stats:{...c.stats},activeEffects:[...(c.activeEffects||[])]};
    const fi=[];
    const txt=act.apply(nc,fi);
    setFloats(fi);setMsg(txt);setC(nc);
    setVisited(v=>({...v,[act.id]:true}));
    setTimeout(()=>setReactAnim(null),2000);
  }

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-hidden">
      <div className="max-w-lg mx-auto w-full flex flex-col h-full">
        {floats&&<FloatingNum items={floats} onDone={()=>setFloats(null)}/>}

        <div className="flex justify-between items-center mb-1">
          <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-3 py-1 text-[10px] font-pixel">← 返回</button>
          <h2 className="font-pixel text-pixel-gold text-[10px]">🌊 彌陀基地</h2>
          <span className="font-vt text-pixel-orange text-lg">💰{c.money}</span>
        </div>

        {/* SVG Scene */}
        <div className="pixel-border bg-pixel-charcoal p-1 mb-1">
          <svg viewBox="0 0 400 220" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mt-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#87CEEB"/>
                <stop offset="60%" stopColor="#e0f7fa"/>
                <stop offset="100%" stopColor="#80deea"/>
              </linearGradient>
              <linearGradient id="mt-ocean" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4fc3f7"/>
                <stop offset="100%" stopColor="#0288d1"/>
              </linearGradient>
              <linearGradient id="mt-sand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff8e1"/>
                <stop offset="100%" stopColor="#ffe0b2"/>
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="400" height="220" fill="url(#mt-sky)"/>

            {/* Sun */}
            <circle cx="60" cy="30" r="18" fill="#fff9c4" opacity="0.9"/>
            <circle cx="60" cy="30" r="28" fill="#fff176" opacity="0.12"/>

            {/* Ocean */}
            <rect x="0" y="80" width="400" height="50" fill="url(#mt-ocean)" opacity="0.7"/>
            {/* Waves */}
            <g style={{animation:'water-shimmer 3s ease-in-out infinite'}}>
              <path d={`M0,${90+waveSway} Q50,${85+waveSway} 100,${90+waveSway} Q150,${95+waveSway} 200,${90+waveSway} Q250,${85+waveSway} 300,${90+waveSway} Q350,${95+waveSway} 400,${90+waveSway}`} fill="none" stroke="white" strokeWidth="1.5" opacity="0.5"/>
              <path d={`M0,${100-waveSway*0.7} Q60,${95-waveSway*0.7} 120,${100-waveSway*0.7} Q180,${105-waveSway*0.7} 240,${100-waveSway*0.7} Q300,${95-waveSway*0.7} 360,${100-waveSway*0.7}`} fill="none" stroke="white" strokeWidth="1" opacity="0.4"/>
            </g>
            {/* Horizon shimmer */}
            <rect x="0" y="80" width="400" height="3" fill="white" opacity="0.15"/>

            {/* Beach/sand */}
            <path d="M0,125 Q100,120 200,125 Q300,120 400,125 L400,145 L0,145Z" fill="url(#mt-sand)"/>

            {/* Ground */}
            <rect x="0" y="140" width="400" height="80" fill="#8bc34a"/>

            {/* Palm trees */}
            <g transform={`translate(350,80) rotate(${palmSway})`} style={{transformOrigin:'350px 140px'}}>
              <rect x="-3" y="0" width="6" height="60" fill="#795548" rx="2"/>
              <path d="M0,0 Q-25,-5 -35,5" stroke="#4caf50" strokeWidth="3" fill="none"/>
              <path d="M0,0 Q25,-8 30,2" stroke="#4caf50" strokeWidth="3" fill="none"/>
              <path d="M0,0 Q-15,-15 -20,-5" stroke="#66bb6a" strokeWidth="2.5" fill="none"/>
              <path d="M0,0 Q10,-18 20,-8" stroke="#66bb6a" strokeWidth="2.5" fill="none"/>
              <path d="M0,0 Q-8,-20 -5,-10" stroke="#388e3c" strokeWidth="2" fill="none"/>
            </g>
            <g transform={`translate(30,90) rotate(${-palmSway*0.7})`} style={{transformOrigin:'30px 140px'}}>
              <rect x="-2" y="0" width="5" height="50" fill="#795548" rx="2"/>
              <path d="M0,0 Q-20,-4 -28,4" stroke="#4caf50" strokeWidth="2.5" fill="none"/>
              <path d="M0,0 Q20,-6 25,2" stroke="#4caf50" strokeWidth="2.5" fill="none"/>
              <path d="M0,0 Q-10,-14 -15,-5" stroke="#66bb6a" strokeWidth="2" fill="none"/>
              <path d="M0,0 Q8,-16 15,-7" stroke="#66bb6a" strokeWidth="2" fill="none"/>
            </g>

            {/* Fishing nets drying */}
            <g transform="translate(320,140)">
              <line x1="0" y1="0" x2="0" y2="-20" stroke="#795548" strokeWidth="2"/>
              <line x1="20" y1="0" x2="20" y2="-18" stroke="#795548" strokeWidth="2"/>
              <path d="M0,-18 Q5,-12 10,-16 Q15,-10 20,-16" stroke="#9e9e9e" strokeWidth="0.8" fill="none"/>
              <path d="M0,-14 Q5,-8 10,-12 Q15,-6 20,-12" stroke="#9e9e9e" strokeWidth="0.8" fill="none"/>
              <path d="M0,-10 Q5,-4 10,-8 Q15,-2 20,-8" stroke="#9e9e9e" strokeWidth="0.8" fill="none"/>
            </g>

            {/* Traditional house */}
            <g transform="translate(60,128)">
              {/* House body */}
              <rect x="0" y="10" width="70" height="45" rx="2" fill="#efebe9"/>
              <rect x="0" y="10" width="70" height="45" rx="2" fill="none" stroke="#bcaaa4" strokeWidth="1"/>
              {/* Tile roof */}
              <polygon points="-8,12 35,-8 78,12" fill="#c62828"/>
              <polygon points="-5,12 35,-5 75,12" fill="#ef5350" opacity="0.5"/>
              {/* Roof tiles pattern */}
              <path d="M0,8 Q8,4 16,8 Q24,4 32,8 Q40,4 48,8 Q56,4 64,8 Q72,4 75,8" stroke="#b71c1c" strokeWidth="1" fill="none" opacity="0.5"/>
              {/* Door */}
              <rect x="27" y="32" width="16" height="23" rx="1" fill="#5d4037"/>
              <circle cx="40" cy="44" r="1.5" fill="#f4d03f"/>
              {/* Window */}
              <rect x="6" y="24" width="14" height="12" rx="1" fill="#bbdefb" stroke="#8d6e3f" strokeWidth="1"/>
              <line x1="13" y1="24" x2="13" y2="36" stroke="#8d6e3f" strokeWidth="0.5"/>
              <line x1="6" y1="30" x2="20" y2="30" stroke="#8d6e3f" strokeWidth="0.5"/>
              {/* Window right */}
              <rect x="50" y="24" width="14" height="12" rx="1" fill="#bbdefb" stroke="#8d6e3f" strokeWidth="1"/>
              <line x1="57" y1="24" x2="57" y2="36" stroke="#8d6e3f" strokeWidth="0.5"/>
              <line x1="50" y1="30" x2="64" y2="30" stroke="#8d6e3f" strokeWidth="0.5"/>
              {/* Dining table visible through door */}
              <rect x="29" y="44" width="12" height="2" fill="#8d6e3f" opacity="0.5"/>
            </g>

            {/* Small temple/shrine */}
            <g transform="translate(355,150)">
              <rect x="0" y="8" width="25" height="22" fill="#e0e0e0"/>
              <polygon points="-3,10 12,-2 28,10" fill="#c62828"/>
              <polygon points="-1,10 12,0 26,10" fill="#ef5350" opacity="0.5"/>
              <rect x="9" y="18" width="7" height="12" fill="#5d4037"/>
              {/* Incense */}
              <rect x="12" y="12" width="1" height="5" fill="#ff8f00"/>
              <circle cx="12.5" cy="10" r="1.5" fill="#9e9e9e" opacity="0.5"/>
            </g>

            {/* ═══ LARGE CHIBI 阿嬤 ═══ */}
            <g transform={`translate(210,${92+breath})`}>
              {/* === BODY === */}
              {/* Floral dress */}
              <path d="M-18,10 Q-22,40 -24,65 Q0,70 24,65 Q22,40 18,10Z" fill="#e91e63"/>
              {/* Floral pattern on dress */}
              {[[-8,25,'#fff'],[5,30,'#ffeb3b'],[-12,40,'#ffeb3b'],[8,45,'#fff'],[-3,55,'#fff'],[10,35,'#ffeb3b'],[-6,50,'#ffeb3b'],[12,55,'#fff']].map(([fx,fy,fc],i)=>
                <circle key={'fl'+i} cx={fx} cy={fy} r="2" fill={fc} opacity="0.5"/>
              )}
              {/* Apron */}
              <path d="M-12,20 Q-14,40 -12,58 Q0,62 12,58 Q14,40 12,20Z" fill="white" opacity="0.85"/>
              <path d="M-12,20 Q0,18 12,20" fill="none" stroke="#e0e0e0" strokeWidth="0.8"/>
              {/* Apron ties */}
              <path d="M-12,20 Q-16,22 -18,20" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M12,20 Q16,22 18,20" stroke="white" strokeWidth="1.5" fill="none"/>
              {/* Apron pocket */}
              <rect x="-5" y="35" width="10" height="8" rx="1" fill="none" stroke="#e0e0e0" strokeWidth="0.5"/>

              {/* Legs */}
              <rect x="-12" y="60" width="10" height="15" rx="3" fill="#ffcc80"/>
              <rect x="2" y="60" width="10" height="15" rx="3" fill="#ffcc80"/>
              {/* Shoes */}
              <rect x="-14" y="72" width="12" height="6" rx="2" fill="#5d4037"/>
              <rect x="2" y="72" width="12" height="6" rx="2" fill="#5d4037"/>

              {/* Arms */}
              {reactAnim==='cook'?(
                <g>
                  {/* Left arm holding ladle up */}
                  <path d="M-18,15 Q-28,10 -30,0" stroke="#ffcc80" strokeWidth="8" fill="none" strokeLinecap="round"/>
                  <circle cx="-30" cy="0" r="4" fill="#ffcc80"/>
                  {/* Ladle */}
                  <rect x="-32" y="-15" width="2" height="15" fill="#8d6e3f"/>
                  <ellipse cx="-31" cy="-17" rx="5" ry="3" fill="#9e9e9e"/>
                  {/* Right arm waving */}
                  <path d="M18,15 Q28,8 26,0" stroke="#ffcc80" strokeWidth="8" fill="none" strokeLinecap="round"/>
                  <circle cx="26" cy="0" r="4" fill="#ffcc80"/>
                </g>
              ):reactAnim==='sing'?(
                <g>
                  {/* Both arms up singing */}
                  <path d="M-18,15 Q-30,5 -28,-5" stroke="#ffcc80" strokeWidth="8" fill="none" strokeLinecap="round"/>
                  <circle cx="-28" cy="-5" r="4" fill="#ffcc80"/>
                  <path d="M18,15 Q30,5 28,-5" stroke="#ffcc80" strokeWidth="8" fill="none" strokeLinecap="round"/>
                  <circle cx="28" cy="-5" r="4" fill="#ffcc80"/>
                </g>
              ):reactAnim==='hug'?(
                <g>
                  {/* Arms open for hug */}
                  <path d="M-18,15 Q-32,15 -32,25" stroke="#ffcc80" strokeWidth="8" fill="none" strokeLinecap="round"/>
                  <circle cx="-32" cy="25" r="4" fill="#ffcc80"/>
                  <path d="M18,15 Q32,15 32,25" stroke="#ffcc80" strokeWidth="8" fill="none" strokeLinecap="round"/>
                  <circle cx="32" cy="25" r="4" fill="#ffcc80"/>
                </g>
              ):(
                <g>
                  {/* Default: left hand holding ladle, right waving */}
                  <path d="M-18,15 Q-26,20 -24,30" stroke="#ffcc80" strokeWidth="8" fill="none" strokeLinecap="round"/>
                  <circle cx="-24" cy="30" r="4" fill="#ffcc80"/>
                  {/* Ladle in left hand */}
                  <rect x="-26" y="15" width="2" height="16" fill="#8d6e3f"/>
                  <ellipse cx="-25" cy="13" rx="5" ry="3" fill="#9e9e9e"/>
                  {/* Right arm waving */}
                  <path d={`M18,15 Q28,10 30,${5+Math.sin(frame*0.08)*3}`} stroke="#ffcc80" strokeWidth="8" fill="none" strokeLinecap="round"/>
                  <circle cx="30" cy={5+Math.sin(frame*0.08)*3} r="4" fill="#ffcc80"/>
                </g>
              )}

              {/* === HEAD === */}
              <g transform="translate(0,-15)">
                {/* Head shape - warm skin */}
                <ellipse cx="0" cy="0" rx="22" ry="20" fill="#ffcc80"/>
                {/* Permed short hair (grey/silver) */}
                <path d="M-20,-5 Q-22,-18 -15,-22 Q-8,-26 0,-24 Q8,-26 15,-22 Q22,-18 20,-5" fill="#9e9e9e"/>
                {/* Perm curls */}
                <circle cx="-16" cy="-15" r="4" fill="#bdbdbd" opacity="0.6"/>
                <circle cx="-8" cy="-20" r="4" fill="#bdbdbd" opacity="0.6"/>
                <circle cx="0" cy="-21" r="4" fill="#bdbdbd" opacity="0.6"/>
                <circle cx="8" cy="-20" r="4" fill="#bdbdbd" opacity="0.6"/>
                <circle cx="16" cy="-15" r="4" fill="#bdbdbd" opacity="0.6"/>
                <circle cx="-12" cy="-10" r="3" fill="#9e9e9e" opacity="0.5"/>
                <circle cx="12" cy="-10" r="3" fill="#9e9e9e" opacity="0.5"/>

                {/* Round glasses */}
                <circle cx="-7" cy="1" r="6" fill="none" stroke="#5d4037" strokeWidth="1.2"/>
                <circle cx="7" cy="1" r="6" fill="none" stroke="#5d4037" strokeWidth="1.2"/>
                <line x1="-1" y1="1" x2="1" y2="1" stroke="#5d4037" strokeWidth="1"/>
                <line x1="-13" y1="0" x2="-17" y2="-2" stroke="#5d4037" strokeWidth="0.8"/>
                <line x1="13" y1="0" x2="17" y2="-2" stroke="#5d4037" strokeWidth="0.8"/>
                {/* Lens glare */}
                <ellipse cx="-9" cy="-1" rx="1.5" ry="1" fill="white" opacity="0.3"/>
                <ellipse cx="5" cy="-1" rx="1.5" ry="1" fill="white" opacity="0.3"/>

                {/* Eyes behind glasses - warm kind */}
                <g>
                  <ellipse cx="-7" cy="1.5" rx="3" ry={reactAnim==='sing'?1.5:2.5} fill="white"/>
                  <ellipse cx="-7" cy={reactAnim==='sing'?1.5:2} rx="2" ry={reactAnim==='sing'?1:2} fill="#3e2723"/>
                  {reactAnim!=='sing'&&<circle cx="-6.5" cy="1" r="0.7" fill="white"/>}
                  <ellipse cx="7" cy="1.5" rx="3" ry={reactAnim==='sing'?1.5:2.5} fill="white"/>
                  <ellipse cx="7" cy={reactAnim==='sing'?1.5:2} rx="2" ry={reactAnim==='sing'?1:2} fill="#3e2723"/>
                  {reactAnim!=='sing'&&<circle cx="7.5" cy="1" r="0.7" fill="white"/>}
                </g>

                {/* Eyebrows - gentle arched */}
                <path d="M-11,-4 Q-7,-6 -3,-4" stroke="#9e9e9e" strokeWidth="1" fill="none"/>
                <path d="M3,-4 Q7,-6 11,-4" stroke="#9e9e9e" strokeWidth="1" fill="none"/>

                {/* Mouth - big warm smile */}
                {reactAnim==='sing'?(
                  <g>
                    <ellipse cx="0" cy="10" rx="6" ry="5" fill="#ef5350"/>
                    <ellipse cx="0" cy="8" rx="5" ry="2" fill="#ffcc80"/>
                  </g>
                ):(
                  <path d="M-7,9 Q0,16 7,9" stroke="#c62828" strokeWidth="1.5" fill="#ef5350" strokeLinecap="round"/>
                )}

                {/* Blush - warm rosy cheeks */}
                <ellipse cx="-14" cy="6" rx="5" ry="3" fill="#ef9a9a" opacity="0.5"/>
                <ellipse cx="14" cy="6" rx="5" ry="3" fill="#ef9a9a" opacity="0.5"/>

                {/* Wrinkles - smile lines */}
                <path d="M-16,4 Q-15,7 -14,9" stroke="#e0a050" strokeWidth="0.5" fill="none" opacity="0.4"/>
                <path d="M16,4 Q15,7 14,9" stroke="#e0a050" strokeWidth="0.5" fill="none" opacity="0.4"/>
              </g>

              {/* Musical notes when singing */}
              {singNotes&&(
                <g className="pop-in">
                  <text x="-20" y={noteY1} fill="#f4d03f" fontSize="10" opacity={0.8}>♪</text>
                  <text x="15" y={noteY2} fill="#e91e63" fontSize="12" opacity={0.7}>♫</text>
                  <text x="0" y={noteY3} fill="#f4d03f" fontSize="9" opacity={0.9}>♪</text>
                  <text x="-30" y={noteY2-5} fill="#4fc3f7" fontSize="8" opacity={0.6}>♬</text>
                  <text x="25" y={noteY1-8} fill="#ab47bc" fontSize="10" opacity={0.7}>♪</text>
                </g>
              )}

              {/* Label */}
              <text x="0" y="88" textAnchor="middle" fill="#f4d03f" fontSize="8" fontFamily="monospace" fontWeight="bold">阿嬤</text>
            </g>
          </svg>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-1">
          <span className="font-vt text-pixel-gold text-sm" style={{textShadow:'1px 1px 0 #000'}}>阿嬤的愛心補給站！</span>
        </div>

        {/* Message display */}
        {msg&&(
          <div className="pixel-border bg-pixel-charcoal p-2 mb-1 text-center">
            <span className="font-vt text-pixel-cyan text-sm">{msg}</span>
          </div>
        )}

        {/* Activities - scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0 mb-1">
          <div className="grid grid-cols-2 gap-1.5">
            {ACTIVITIES.map(act=>{
              const canDo=act.check();
              const done=visited[act.id];
              return(
                <button key={act.id} onClick={()=>canDo&&doActivity(act)} disabled={!canDo}
                  className={`pixel-border p-2 text-left relative ${canDo?'bg-pixel-charcoal hover:bg-pixel-darkblue cursor-pointer':done?'bg-pixel-gray opacity-50':'bg-pixel-charcoal opacity-60'}`}>
                  {done&&<span className="absolute top-1 right-1 text-[10px] font-vt text-pixel-green">✓</span>}
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xl ${!canDo?'grayscale':''}`}>{act.icon}</span>
                    <div>
                      <div className={`font-pixel text-[8px] ${!canDo?'text-pixel-gray':'text-pixel-light'}`}>{act.name}</div>
                      <div className="font-vt text-pixel-green text-xs">免費</div>
                    </div>
                  </div>
                  <div className={`font-vt text-[10px] mt-0.5 ${!canDo?'text-pixel-gray':'text-pixel-cyan'}`}>{act.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status bar */}
        <div className="pixel-border bg-pixel-charcoal p-2 flex justify-between">
          <span className="font-vt text-pixel-green text-sm">⚡ {c.stamina}/{ms}</span>
          <span className="font-vt text-pixel-orange text-sm">😓 {c.fatigue||0}</span>
          <span className="font-vt text-pixel-gold text-sm">💰 {c.money}</span>
        </div>
      </div>
    </div>
  );
}

// ── HENGZHAI (衡宅) ──
function HengzhaiScreen({c,setC,go}){
  const ms=maxSta(c.stats.sta);
  const[floats,setFloats]=useState(null);
  const[msg,setMsg]=useState(null);
  const[frame,setFrame]=useState(0);
  const[visited,setVisited]=useState({});
  const[hengLine,setHengLine]=useState(null);
  useEffect(()=>{const t=setInterval(()=>setFrame(f=>(f+1)%240),50);return()=>clearInterval(t)},[]);

  const floor=Math.min(8,1+Math.floor(((c.totalTrainings||0)-20)/20));
  const breath=Math.sin(frame*0.04)*1.5;
  const craneSway=Math.sin(frame*0.015)*2;
  const sparkle1=Math.sin(frame*0.12)*0.5+0.5;
  const sparkle2=Math.sin(frame*0.12+2)*0.5+0.5;
  const sparkle3=Math.sin(frame*0.12+4)*0.5+0.5;

  const HENG_LINES=[
    "這棟房子蓋好就是我們的重訓基地！💪",
    "搬磚也是一種訓練啊",
    "衡哥帶你練，保證變壯",
    "今天的進度不錯！",
    "安全第一！戴好安全帽",
    "蓋房子跟舉重一樣，基礎最重要",
    "這工地就是最好的健身房",
    "流的汗越多，肌肉越大💪",
  ];

  function clickHeng(){
    sfx('click');
    setHengLine(HENG_LINES[Math.floor(Math.random()*HENG_LINES.length)]);
  }

  const ACTIVITIES=[
    {id:'brick',icon:'🧱',name:'搬磚塊上樓',cost:20,
      desc:`體力-20 力量+2 耐力+1 💰+${30+floor*10}`,
      check:()=>!visited.brick&&c.stamina>=20,
      apply:(nc,fi)=>{
        nc.stamina=Math.max(0,nc.stamina-20);nc.fatigue=Math.min(100,(nc.fatigue||0)+12);
        nc.stats.str=Math.min(100,nc.stats.str+2);nc.stats.sta=Math.min(100,nc.stats.sta+1);
        const reward=30+floor*10;nc.money+=reward;
        fi.push({icon:'💪',text:'力量+2',color:'#ef5350'},{icon:'🦵',text:'耐力+1',color:'#38b764'},{icon:'💰',text:`+${reward}`,color:'#f4d03f'});
        return '衡哥：搬磚也是練功！';
      }},
    {id:'cement',icon:'🏋️',name:'扛水泥袋',cost:25,
      desc:`體力-25 力量+3 💰+${40+floor*10}`,
      check:()=>!visited.cement&&c.stamina>=25,
      apply:(nc,fi)=>{
        nc.stamina=Math.max(0,nc.stamina-25);nc.fatigue=Math.min(100,(nc.fatigue||0)+15);
        nc.stats.str=Math.min(100,nc.stats.str+3);
        const reward=40+floor*10;nc.money+=reward;
        fi.push({icon:'💪',text:'力量+3',color:'#ef5350'},{icon:'💰',text:`+${reward}`,color:'#f4d03f'});
        return '衡哥：這袋50公斤，跟槓鈴差不多';
      }},
    {id:'scaffold',icon:'🦵',name:'爬鷹架練腿',cost:15,
      desc:`體力-15 耐力+2 爆發+1 💰+${25+floor*5}`,
      check:()=>!visited.scaffold&&c.stamina>=15,
      apply:(nc,fi)=>{
        nc.stamina=Math.max(0,nc.stamina-15);nc.fatigue=Math.min(100,(nc.fatigue||0)+10);
        nc.stats.sta=Math.min(100,nc.stats.sta+2);nc.stats.pwr=Math.min(100,nc.stats.pwr+1);
        const reward=25+floor*5;nc.money+=reward;
        fi.push({icon:'🦵',text:'耐力+2',color:'#38b764'},{icon:'⚡',text:'爆發+1',color:'#ff9800'},{icon:'💰',text:`+${reward}`,color:'#f4d03f'});
        return '衡哥：爬到頂樓看風景！';
      }},
    {id:'formwork',icon:'✊',name:'拆模板練握力',cost:15,
      desc:`體力-15 力量+1 穩定+1 💰+${20+floor*5}`,
      check:()=>!visited.formwork&&c.stamina>=15,
      apply:(nc,fi)=>{
        nc.stamina=Math.max(0,nc.stamina-15);nc.fatigue=Math.min(100,(nc.fatigue||0)+10);
        nc.stats.str=Math.min(100,nc.stats.str+1);nc.stats.stb=Math.min(100,nc.stats.stb+1);
        const reward=20+floor*5;nc.money+=reward;
        fi.push({icon:'💪',text:'力量+1',color:'#ef5350'},{icon:'🧠',text:'穩定+1',color:'#ab47bc'},{icon:'💰',text:`+${reward}`,color:'#f4d03f'});
        return '衡哥：手勁要夠！';
      }},
    {id:'rooftop',icon:'💪',name:'頂樓舉槓鈴',cost:30,
      desc:`體力-30 力量+2 爆發+2 技術+1 💰+${50+floor*15}`,
      check:()=>!visited.rooftop&&c.stamina>=30&&floor>=3,
      apply:(nc,fi)=>{
        nc.stamina=Math.max(0,nc.stamina-30);nc.fatigue=Math.min(100,(nc.fatigue||0)+15);
        nc.stats.str=Math.min(100,nc.stats.str+2);nc.stats.pwr=Math.min(100,nc.stats.pwr+2);nc.stats.tec=Math.min(100,nc.stats.tec+1);
        const reward=50+floor*15;nc.money+=reward;
        fi.push({icon:'💪',text:'力量+2',color:'#ef5350'},{icon:'⚡',text:'爆發+2',color:'#ff9800'},{icon:'🎯',text:'技術+1',color:'#4fc3f7'},{icon:'💰',text:`+${reward}`,color:'#f4d03f'});
        return '衡哥：頂樓風景配重訓，人生啊～';
      }},
  ];

  function doActivity(act){
    if(!act.check())return;
    sfx('train');
    const nc={...c,stats:{...c.stats},activeEffects:[...(c.activeEffects||[])]};
    const fi=[];
    const txt=act.apply(nc,fi);
    setFloats(fi);setMsg(txt);setC(nc);
    setVisited(v=>({...v,[act.id]:true}));
  }

  // Building floors rendering helper
  function renderBuilding(){
    const floorH=18;const buildX=20;const buildW=120;const baseY=195;
    const elements=[];
    // Foundation
    elements.push(<rect key="found" x={buildX-5} y={baseY} width={buildW+10} height={8} fill="#795548" rx="1"/>);
    // Ground details - safety cones
    elements.push(<g key="cone1" transform="translate(10,193)"><polygon points="0,10 4,0 8,10" fill="#ff6d00"/><rect x="0" y="10" width="8" height="2" fill="white"/><line x1="1" y1="6" x2="7" y2="6" stroke="white" strokeWidth="1"/></g>);
    elements.push(<g key="cone2" transform="translate(148,193)"><polygon points="0,10 4,0 8,10" fill="#ff6d00"/><rect x="0" y="10" width="8" height="2" fill="white"/><line x1="1" y1="6" x2="7" y2="6" stroke="white" strokeWidth="1"/></g>);
    // Brick piles
    elements.push(<g key="bricks" transform="translate(5,188)">
      <rect x="0" y="0" width="8" height="5" fill="#c62828" rx="0.5"/><rect x="9" y="0" width="8" height="5" fill="#d32f2f" rx="0.5"/>
      <rect x="4" y="-5" width="8" height="5" fill="#e53935" rx="0.5"/>
    </g>);
    // Cement bags
    elements.push(<g key="bags" transform="translate(145,185)">
      <rect x="0" y="0" width="12" height="8" fill="#9e9e9e" rx="1"/><text x="6" y="6" textAnchor="middle" fontSize="4" fill="#616161">水泥</text>
      <rect x="3" y="-7" width="12" height="8" fill="#bdbdbd" rx="1"/><text x="9" y="-1" textAnchor="middle" fontSize="4" fill="#616161">水泥</text>
    </g>);

    for(let i=0;i<8;i++){
      const fy=baseY-floorH*(i+1);
      if(i<floor){
        // Completed floor - solid
        elements.push(<rect key={`fl${i}`} x={buildX} y={fy} width={buildW} height={floorH} fill="#b0bec5" stroke="#78909c" strokeWidth="1"/>);
        // Windows
        for(let w=0;w<4;w++){
          elements.push(<rect key={`win${i}_${w}`} x={buildX+10+w*28} y={fy+4} width={12} height={10} fill="#bbdefb" stroke="#64b5f6" strokeWidth="0.5" rx="0.5"/>);
        }
        // Floor number
        elements.push(<text key={`fn${i}`} x={buildX+3} y={fy+12} fontSize="6" fill="#455a64" fontFamily="monospace">{i+1}F</text>);
      } else {
        // Steel frame only
        elements.push(<rect key={`fl${i}`} x={buildX} y={fy} width={buildW} height={floorH} fill="none" stroke="#90a4ae" strokeWidth="0.8" strokeDasharray="4,2"/>);
        // Steel beams
        elements.push(<line key={`hb${i}`} x1={buildX} y1={fy+floorH/2} x2={buildX+buildW} y2={fy+floorH/2} stroke="#b0bec5" strokeWidth="0.5" strokeDasharray="3,3"/>);
        elements.push(<line key={`vb${i}a`} x1={buildX+buildW/3} y1={fy} x2={buildX+buildW/3} y2={fy+floorH} stroke="#b0bec5" strokeWidth="0.5"/>);
        elements.push(<line key={`vb${i}b`} x1={buildX+2*buildW/3} y1={fy} x2={buildX+2*buildW/3} y2={fy+floorH} stroke="#b0bec5" strokeWidth="0.5"/>);
      }
    }

    // Scaffolding on the right side
    const scaffTop=baseY-floorH*Math.min(floor+1,8);
    elements.push(<g key="scaff">
      <rect x={buildX+buildW+2} y={scaffTop} width="3" height={baseY-scaffTop} fill="#ff8f00"/>
      <rect x={buildX+buildW+12} y={scaffTop} width="3" height={baseY-scaffTop} fill="#ff8f00"/>
      {Array.from({length:Math.min(floor+1,8)}).map((_,si)=>
        <rect key={`sp${si}`} x={buildX+buildW+2} y={baseY-floorH*(si+1)} width="13" height="2" fill="#ffb300"/>
      )}
      {/* Cross bracing */}
      {Array.from({length:Math.min(floor,7)}).map((_,si)=>
        <g key={`sx${si}`}>
          <line x1={buildX+buildW+3} y1={baseY-floorH*(si+1)} x2={buildX+buildW+14} y2={baseY-floorH*(si+2)} stroke="#ff8f00" strokeWidth="0.5"/>
          <line x1={buildX+buildW+14} y1={baseY-floorH*(si+1)} x2={buildX+buildW+3} y2={baseY-floorH*(si+2)} stroke="#ff8f00" strokeWidth="0.5"/>
        </g>
      )}
    </g>);

    // Crane on top
    const craneY=baseY-floorH*(floor+1)-15;
    elements.push(<g key="crane" transform={`translate(${buildX+buildW/2},${craneY})`}>
      {/* Crane mast */}
      <rect x="-3" y="-5" width="6" height="20" fill="#fdd835"/>
      {/* Crane jib (horizontal arm) */}
      <rect x="-40" y="-8" width="80" height="4" fill="#fdd835" rx="1"/>
      {/* Counter weight */}
      <rect x="-38" y="-14" width="12" height="6" fill="#f57f17" rx="1"/>
      {/* Cable */}
      <line x1={20+craneSway} y1="-4" x2={20+craneSway} y2={10} stroke="#424242" strokeWidth="0.8"/>
      {/* Hook */}
      <path d={`M${19+craneSway},10 Q${22+craneSway},15 ${19+craneSway},15`} stroke="#616161" strokeWidth="1.5" fill="none"/>
      {/* Cab */}
      <rect x="-6" y="-5" width="12" height="8" fill="#fbc02d" stroke="#f9a825" strokeWidth="0.5" rx="1"/>
      <rect x="-4" y="-3" width="4" height="4" fill="#e3f2fd" rx="0.5"/>
    </g>);

    return elements;
  }

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-hidden">
      <div className="max-w-lg mx-auto w-full flex flex-col h-full">
        {floats&&<FloatingNum items={floats} onDone={()=>setFloats(null)}/>}

        <div className="flex justify-between items-center mb-1">
          <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-3 py-1 text-[10px] font-pixel">← 返回</button>
          <h2 className="font-pixel text-pixel-gold text-[10px]">🏗️ 衡宅工地</h2>
          <span className="font-vt text-pixel-orange text-lg">💰{c.money}</span>
        </div>

        {/* SVG Scene */}
        <div className="pixel-border bg-pixel-charcoal p-1 mb-1">
          <svg viewBox="0 0 400 220" className="w-full" xmlns="http://www.w3.org/2000/svg" onClick={clickHeng} style={{cursor:'pointer'}}>
            <defs>
              <linearGradient id="hz-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64b5f6"/>
                <stop offset="60%" stopColor="#90caf9"/>
                <stop offset="100%" stopColor="#e3f2fd"/>
              </linearGradient>
              <linearGradient id="hz-ground" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a1887f"/>
                <stop offset="100%" stopColor="#8d6e63"/>
              </linearGradient>
              <linearGradient id="hz-skin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffcc80"/>
                <stop offset="100%" stopColor="#ffb74d"/>
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="400" height="220" fill="url(#hz-sky)"/>

            {/* Clouds */}
            <g opacity="0.7">
              <ellipse cx={50+Math.sin(frame*0.005)*10} cy="25" rx="25" ry="8" fill="white"/>
              <ellipse cx={55+Math.sin(frame*0.005)*10} cy="22" rx="15" ry="7" fill="white"/>
              <ellipse cx={320+Math.sin(frame*0.007)*8} cy="35" rx="20" ry="6" fill="white"/>
            </g>

            {/* Sun */}
            <circle cx="370" cy="25" r="15" fill="#fff9c4" opacity="0.9"/>
            <circle cx="370" cy="25" r="22" fill="#fff176" opacity="0.12"/>

            {/* Ground */}
            <rect x="0" y="195" width="400" height="25" fill="url(#hz-ground)"/>
            {/* Dirt texture */}
            <rect x="0" y="200" width="400" height="20" fill="#795548" opacity="0.3"/>

            {/* ═══ BUILDING ═══ */}
            {renderBuilding()}

            {/* ═══ LARGE HANDSOME 衡哥 NPC ═══ */}
            <g transform={`translate(280,${100+breath})`} onClick={e=>{e.stopPropagation();clickHeng()}} style={{cursor:'pointer'}}>

              {/* === BODY === */}
              {/* Work boots */}
              <rect x="-18" y="82" width="16" height="8" rx="2" fill="#5d4037"/>
              <rect x="2" y="82" width="16" height="8" rx="2" fill="#5d4037"/>
              <rect x="-18" y="82" width="16" height="3" rx="1" fill="#795548"/>
              <rect x="2" y="82" width="16" height="3" rx="1" fill="#795548"/>

              {/* Legs - work pants (khaki) */}
              <rect x="-14" y="55" width="13" height="30" rx="3" fill="#8d6e63"/>
              <rect x="1" y="55" width="13" height="30" rx="3" fill="#8d6e63"/>
              {/* Pants details - knee patches */}
              <rect x="-12" y="65" width="9" height="6" rx="1" fill="#7c6156" opacity="0.5"/>
              <rect x="3" y="65" width="9" height="6" rx="1" fill="#7c6156" opacity="0.5"/>

              {/* Tool belt */}
              <rect x="-20" y="48" width="40" height="7" rx="1" fill="#5d4037"/>
              <rect x="-18" y="49" width="5" height="5" rx="0.5" fill="#f9a825" opacity="0.8"/>
              <rect x="13" y="49" width="5" height="5" rx="0.5" fill="#9e9e9e" opacity="0.8"/>
              {/* Belt buckle */}
              <rect x="-3" y="49" width="6" height="5" rx="1" fill="#fdd835"/>

              {/* White tank top - muscular torso */}
              <path d="M-20,10 Q-22,30 -20,50 Q0,55 20,50 Q22,30 20,10Z" fill="white"/>
              {/* Tank top neckline */}
              <path d="M-12,10 Q0,14 12,10" fill="none" stroke="#e0e0e0" strokeWidth="0.8"/>
              {/* Chest definition visible through shirt */}
              <path d="M-5,18 Q0,22 5,18" stroke="#e0e0e0" strokeWidth="0.5" fill="none" opacity="0.6"/>
              <line x1="0" y1="18" x2="0" y2="35" stroke="#e0e0e0" strokeWidth="0.3" opacity="0.4"/>
              {/* Tank top straps */}
              <rect x="-14" y="6" width="7" height="6" rx="1" fill="white"/>
              <rect x="7" y="6" width="7" height="6" rx="1" fill="white"/>

              {/* Muscular arms */}
              {/* Left arm - holding blueprint */}
              <path d="M-20,14 Q-32,18 -34,32" stroke="url(#hz-skin)" strokeWidth="12" fill="none" strokeLinecap="round"/>
              <circle cx="-34" cy="32" r="5" fill="#ffb74d"/>
              {/* Forearm muscle definition */}
              <path d="M-25,18 Q-28,22 -30,26" stroke="#f5a623" strokeWidth="0.5" fill="none" opacity="0.3"/>
              {/* Blueprint roll in left hand */}
              <rect x="-40" y="22" width="18" height="5" rx="2" fill="#e3f2fd" stroke="#90caf9" strokeWidth="0.5"/>
              <rect x="-38" y="23" width="2" height="3" rx="0.5" fill="#64b5f6"/>

              {/* Right arm - flexed/relaxed */}
              <path d={`M20,14 Q32,16 34,${30+Math.sin(frame*0.06)*2}`} stroke="url(#hz-skin)" strokeWidth="12" fill="none" strokeLinecap="round"/>
              <circle cx="34" cy={30+Math.sin(frame*0.06)*2} r="5" fill="#ffb74d"/>
              {/* Bicep bump */}
              <ellipse cx="28" cy="18" rx="4" ry="3" fill="#ffcc80" opacity="0.5"/>

              {/* === HEAD === */}
              <g transform="translate(0,-18)">
                {/* Neck */}
                <rect x="-6" y="18" width="12" height="10" rx="3" fill="#ffcc80"/>

                {/* Head shape - handsome strong jaw */}
                <path d="M-18,0 Q-20,-8 -16,-16 Q-10,-22 0,-24 Q10,-22 16,-16 Q20,-8 18,0 Q16,10 10,15 Q4,18 0,18 Q-4,18 -10,15 Q-16,10 -18,0Z" fill="#ffcc80"/>

                {/* Strong jawline shadow */}
                <path d="M-14,8 Q-10,14 0,16 Q10,14 14,8" fill="#f5a623" opacity="0.15"/>

                {/* Styled dark hair - swept to side */}
                <path d="M-18,-2 Q-20,-12 -16,-18 Q-10,-24 0,-26 Q12,-25 18,-18 Q22,-10 20,-2 Q18,-6 12,-4" fill="#3e2723"/>
                {/* Hair volume on top */}
                <path d="M-14,-16 Q-8,-28 2,-27 Q14,-26 18,-16" fill="#4e342e"/>
                {/* Side swept bangs */}
                <path d="M-16,-10 Q-10,-20 0,-22 Q8,-21 14,-16 Q10,-14 6,-8 Q2,-12 -4,-12 Q-10,-10 -16,-6Z" fill="#3e2723"/>
                {/* Hair highlight */}
                <path d="M-4,-20 Q0,-22 6,-20" stroke="#5d4037" strokeWidth="1.5" fill="none" opacity="0.4"/>

                {/* Yellow hard hat */}
                <g transform="translate(0,-8)">
                  <ellipse cx="0" cy="-10" rx="22" ry="8" fill="#fdd835"/>
                  <ellipse cx="0" cy="-10" rx="22" ry="8" fill="none" stroke="#f9a825" strokeWidth="1"/>
                  {/* Hat brim */}
                  <ellipse cx="0" cy="-6" rx="24" ry="4" fill="#fdd835"/>
                  <ellipse cx="0" cy="-6" rx="24" ry="4" fill="none" stroke="#f9a825" strokeWidth="0.5"/>
                  {/* Hat ridge */}
                  <path d="M-8,-14 Q0,-18 8,-14" fill="none" stroke="#f9a825" strokeWidth="1"/>
                  {/* Hat shine */}
                  <ellipse cx="-5" cy="-13" rx="6" ry="2" fill="white" opacity="0.25"/>
                </g>

                {/* Eyebrows - strong confident */}
                <path d="M-13,-4 Q-9,-7 -5,-5" stroke="#3e2723" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                <path d="M5,-5 Q9,-7 13,-4" stroke="#3e2723" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

                {/* Eyes - sparkling confident */}
                <g>
                  {/* Left eye */}
                  <ellipse cx="-8" cy="1" rx="4" ry="3.5" fill="white"/>
                  <ellipse cx="-8" cy="1.5" rx="2.8" ry="2.8" fill="#1b5e20"/>
                  <circle cx="-8" cy="1.5" r="1.5" fill="#0d3010"/>
                  <circle cx="-7" cy="0.5" r="1" fill="white"/>
                  <circle cx="-9.5" cy="2.5" r="0.5" fill="white" opacity="0.6"/>
                  {/* Right eye */}
                  <ellipse cx="8" cy="1" rx="4" ry="3.5" fill="white"/>
                  <ellipse cx="8" cy="1.5" rx="2.8" ry="2.8" fill="#1b5e20"/>
                  <circle cx="8" cy="1.5" r="1.5" fill="#0d3010"/>
                  <circle cx="9" cy="0.5" r="1" fill="white"/>
                  <circle cx="5.5" cy="2.5" r="0.5" fill="white" opacity="0.6"/>
                </g>

                {/* Nose - defined */}
                <path d="M0,2 Q1,6 0,8" stroke="#e6a04a" strokeWidth="0.8" fill="none"/>
                <path d="M-2,8 Q0,9 2,8" stroke="#e6a04a" strokeWidth="0.6" fill="none"/>

                {/* Confident smile */}
                <path d="M-7,10 Q0,15 7,10" stroke="#c62828" strokeWidth="1.2" fill="#ef5350" strokeLinecap="round"/>
                {/* Teeth showing */}
                <path d="M-5,10.5 Q0,13 5,10.5" fill="white" opacity="0.8"/>

                {/* Blush - light */}
                <ellipse cx="-13" cy="5" rx="4" ry="2.5" fill="#ef9a9a" opacity="0.35"/>
                <ellipse cx="13" cy="5" rx="4" ry="2.5" fill="#ef9a9a" opacity="0.35"/>

                {/* ✨ Bishonen sparkle effects near face */}
                <g>
                  <text x="-26" y="-8" fontSize="7" opacity={sparkle1} fill="#fff9c4">✦</text>
                  <text x="22" y="-4" fontSize="9" opacity={sparkle2} fill="#fff9c4">✦</text>
                  <text x="18" y="14" fontSize="6" opacity={sparkle3} fill="#fff9c4">✦</text>
                  <text x="-22" y="10" fontSize="5" opacity={sparkle2} fill="#fdd835">✧</text>
                </g>
              </g>

              {/* Label */}
              <text x="0" y="100" textAnchor="middle" fill="#f4d03f" fontSize="9" fontFamily="monospace" fontWeight="bold">衡哥</text>
            </g>

            {/* Floor progress text */}
            <text x="80" y="215" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="monospace">目前 {floor}/8 樓</text>
          </svg>
        </div>

        {/* 衡哥 dialogue */}
        {(hengLine||msg)&&(
          <div className="pixel-border bg-pixel-charcoal p-2 mb-1 text-center">
            <span className="font-vt text-pixel-cyan text-sm">{msg||hengLine}</span>
          </div>
        )}

        {/* Floor progress bar */}
        <div className="pixel-border bg-pixel-charcoal p-1 mb-1">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-pixel-gold text-[8px] whitespace-nowrap">🏗️ {floor}/8樓</span>
            <div className="flex-1 h-3 bg-pixel-dark border border-pixel-gray overflow-hidden">
              <div className="h-full bg-pixel-gold transition-all" style={{width:`${floor/8*100}%`}}/>
            </div>
          </div>
        </div>

        {/* Activities - scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0 mb-1">
          <div className="grid grid-cols-2 gap-1.5">
            {ACTIVITIES.map(act=>{
              const canDo=act.check();
              const done=visited[act.id];
              const locked=act.id==='rooftop'&&floor<3;
              return(
                <button key={act.id} onClick={()=>canDo&&doActivity(act)} disabled={!canDo}
                  className={`pixel-border p-2 text-left relative ${canDo?'bg-pixel-charcoal hover:bg-pixel-darkblue cursor-pointer':done?'bg-pixel-gray opacity-50':'bg-pixel-charcoal opacity-60'}`}>
                  {done&&<span className="absolute top-1 right-1 text-[10px] font-vt text-pixel-green">✓</span>}
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xl ${!canDo?'grayscale':''}`}>{act.icon}</span>
                    <div>
                      <div className={`font-pixel text-[8px] ${!canDo?'text-pixel-gray':'text-pixel-light'}`}>{act.name}</div>
                      <div className="font-vt text-pixel-orange text-xs">
                        {locked?'🔒 需3樓以上':`⚡-${act.cost}`}
                      </div>
                    </div>
                  </div>
                  <div className={`font-vt text-[10px] mt-0.5 ${!canDo?'text-pixel-gray':'text-pixel-cyan'}`}>{act.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status bar */}
        <div className="pixel-border bg-pixel-charcoal p-2 flex justify-between">
          <span className="font-vt text-pixel-green text-sm">⚡ {c.stamina}/{ms}</span>
          <span className="font-vt text-pixel-orange text-sm">😓 {c.fatigue||0}</span>
          <span className="font-vt text-pixel-gold text-sm">💰 {c.money}</span>
        </div>
      </div>
    </div>
  );
}

// ── ACHIEVEMENTS ──
function AchScreen({c,go}){
  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-auto">
      <div className="max-w-lg mx-auto">
        <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-4 py-1.5 text-[10px] font-pixel mb-2">← 返回</button>
        <h2 className="font-pixel text-pixel-gold text-[10px] mb-2">🏆 成就 ({c.achievements.length}/{ACHIEVEMENTS.length})</h2>
        <div className="pixel-border bg-pixel-charcoal p-2 mb-2">
          <div className="h-4 bg-pixel-dark border-2 border-pixel-gray overflow-hidden">
            <div className="h-full bg-pixel-gold transition-all" style={{width:`${c.achievements.length/ACHIEVEMENTS.length*100}%`}}/>
          </div>
        </div>
        <div className="space-y-1">
          {ACHIEVEMENTS.map(a=>{const done=c.achievements.includes(a.id);return(
            <div key={a.id} className={`pixel-border p-2 flex items-center gap-2 ${done?'bg-pixel-charcoal':'bg-pixel-dark opacity-40'}`}>
              <span className={`text-xl ${done?'':'grayscale opacity-30'}`}>{a.icon}</span>
              <div><div className={`font-pixel text-[9px] ${done?'text-pixel-gold':'text-pixel-gray'}`}>{a.name}</div><div className="font-vt text-pixel-light text-sm">{a.desc}</div></div>
              {done&&<span className="ml-auto text-pixel-green font-vt text-lg">✓</span>}
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}
