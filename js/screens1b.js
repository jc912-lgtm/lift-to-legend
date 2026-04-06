function CompScreen({c,setC,go}){
  const[phase,setPhase]=useState('select');
  const[ev,setEv]=useState(null);
  const[lift,setLift]=useState('snatch');
  const[aN,setAN]=useState(0);
  const[atts,setAtts]=useState({snatch:[],cleanJerk:[]});
  const[wt,setWt]=useState(0);
  const[showMeter,setShowMeter]=useState(false);
  const[msgs,setMsgs]=useState([]);
  const[opps,setOpps]=useState([]);
  const[bestSn,setBestSn]=useState(0);
  const[bestCJ,setBestCJ]=useState(0);
  const[coach,setCoach]=useState(null);
  const[countdown,setCountdown]=useState(null);
  const[oppFlash,setOppFlash]=useState(null);
  const[showingOpp,setShowingOpp]=useState(null);
  const[oppPhase,setOppPhase]=useState('lifting');

  const compBoost=c.inventory.filter(i=>i.effect?.type==='compBoost').reduce((s,i)=>s+(i.effect?.value||0),0);
  const prinBonus=principleLevelBonus(c.principles);

  function startEv(e){
    sfx('crowd');setTimeout(()=>sfx('cheer'),400);setEv(e);setPhase('lift');setLift('snatch');setAN(0);
    setAtts({snatch:[],cleanJerk:[]});setBestSn(0);setBestCJ(0);setShowMeter(false);
    const w=c.pb.snatch>0?c.pb.snatch-5:Math.round((c.stats.str+c.stats.tec)*.4);
    setWt(Math.max(20,w));
    setOpps(genOpps(e.id,c.weightClass));
    setMsgs([{text:`── ${e.emoji} ${e.name} 開始！──`,type:'gold'},{text:'抓舉第1把，選擇重量',type:'info'}]);
    setCoach({text:`${e.name}開始！深呼吸💪`});
    commentary(`Next attempt. ${Math.max(20,w)} kilograms.`);
  }

  function startAttempt(){
    sfx('breath');
    commentary(`Next attempt. ${wt} kilograms.`);
    setCountdown(3);
    setTimeout(()=>{sfx('countdown2');setCountdown(2)},800);
    setTimeout(()=>{sfx('countdown1');setCountdown(1)},1600);
    setTimeout(()=>{sfx('countdownGo');setCountdown(0);setShowMeter(true)},2400);
  }

  function handleLiftResult(res){
    setShowMeter(false);
    const success=res.success;
    const isPerfect=res.perfect;
    const na={...atts};
    na[lift]=[...na[lift],{weight:wt,success,perfect:isPerfect,perfects:res.perfectCount||0}];
    setAtts(na);

    if(success){
      if(isPerfect){sfx('cheer');setTimeout(()=>sfx('whoaaa'),300);spawnConfetti(20);setC(x=>({...x,perfectCount:(x.perfectCount||0)+1}))}
      else{sfx('stomp');sfx('cheer')}
      if(lift==='snatch')setBestSn(s=>Math.max(s,wt));
      else setBestCJ(s=>Math.max(s,wt));
      const isNewPB=lift==='snatch'?(wt>c.pb.snatch):(wt>c.pb.cleanJerk);
      if(isNewPB)commentary(`A new personal best!`);
      if(isPerfect){
        setC(x=>{
          const np={...x.principles};
          const rk=['near','fast','low','accurate','stable'];
          const k=rk[Math.floor(Math.random()*rk.length)];
          np[k]=Math.min(10,(np[k]||0)+1);
          return{...x,principles:np};
        });
      }
      const liftLabel=lift==='snatch'?'抓舉':'挺舉';
      setMsgs(m=>[...m,{text:`${isPerfect?'🌟🌟🌟 完美技術！':'✅'} ${wt}kg ${liftLabel}成功！`,type:'success'}]);
    }else{
      const failLabel={pull:'拉力不足',timing:'時機不對',stabilize:'沒站穩',jerk:'上挺失敗'}[res.phase]||'失敗';
      setMsgs(m=>[...m,{text:`❌ ${wt}kg 失敗... ${failLabel}`,type:'fail'}]);
    }

    // Show opponent results flash
    const oppResults=opps.slice(0,3).map(o=>{
      const oLift=lift==='snatch'?o.snatch:o.cleanJerk;
      const oWt=Math.round(oLift*(0.88+Math.random()*0.18));
      const oSuccess=Math.random()>0.3;
      return{name:o.name.length>12?o.name.slice(0,11)+'..':o.name,flag:o.flag,weight:oWt,success:oSuccess};
    });
    setOppFlash(oppResults);
    setTimeout(()=>setOppFlash(null),2500);

    // Show an opponent actually lifting on stage between player attempts
    setTimeout(()=>{
      if(opps.length>0){
        const oIdx=Math.floor(Math.random()*Math.min(3,opps.length));
        const opp=opps[oIdx];
        const oppWeight=Math.round(opp[lift==='snatch'?'snatch':'cleanJerk']*(0.85+Math.random()*0.2));
        const oppSuccess=Math.random()>0.35;
        setOppPhase('lifting');
        setShowingOpp({name:opp.name,flag:opp.flag,weight:oppWeight,success:oppSuccess});
        commentary(opp.name+'. '+oppWeight+' kilograms.');
        setTimeout(()=>{
          setOppPhase(oppSuccess?'success':'fail');
          if(oppSuccess)commentary('Good lift!');
          else commentary('No lift.');
          setTimeout(()=>{
            setShowingOpp(null);
            setOppPhase('lifting');
            advanceAttempt(success);
          },1500);
        },2000);
      }else{
        advanceAttempt(success);
      }
    },2000);
  }

  function advanceAttempt(success){
    const next=aN+1;
    if(next>=3){
      if(lift==='snatch'){
        setLift('cleanJerk');setAN(0);
        const cjw=c.pb.cleanJerk>0?c.pb.cleanJerk-5:Math.round((c.stats.str+c.stats.tec)*.5);
        setWt(Math.max(20,cjw));
        setMsgs(m=>[...m,{text:'── 挺舉開始 ──',type:'gold'}]);
        setCoach({text:'換挺舉了！加油💪'});
      }else{setPhase('result');sfx('cheer')}
    }else{
      setAN(next);
      if(success)setWt(w=>w+2);
      setMsgs(m=>[...m,{text:`${lift==='snatch'?'抓舉':'挺舉'}第${next+1}把`,type:'info'}]);
    }
  }

  function getFinal(){
    const mySn=atts.snatch.filter(a=>a.success).reduce((mx,a)=>Math.max(mx,a.weight),0);
    const myCJ=atts.cleanJerk.filter(a=>a.success).reduce((mx,a)=>Math.max(mx,a.weight),0);
    const myT=mySn+myCJ;
    const all=[...opps.map(o=>({name:o.name,total:o.total,snatch:o.snatch,cleanJerk:o.cleanJerk,flag:o.flag||'',country:o.country||''})),
      {name:c.name+'（你）',total:myT,snatch:mySn,cleanJerk:myCJ,isPlayer:true,flag:'🇹🇼',country:'TPE'}].sort((a,b)=>b.total-a.total);
    return{mySn,myCJ,myT,all,rank:all.findIndex(r=>r.isPlayer)+1};
  }

  function claim(){
    const{mySn,myCJ,myT,rank}=getFinal();
    const nc={...c,totalComps:c.totalComps+1};
    if(mySn>nc.pb.snatch)nc.pb={...nc.pb,snatch:mySn};
    if(myCJ>nc.pb.cleanJerk)nc.pb={...nc.pb,cleanJerk:myCJ};
    if(myT>nc.pb.total)nc.pb={...nc.pb,total:myT};
    const prize=rank<=3?Math.round(ev.prize*(4-rank)/3):50;
    nc.money+=prize;
    if(rank<=3){
      nc.medals=[...nc.medals,{event:ev.name,rank,total:myT,day:c.day}];
      if(rank===1&&ev.id>nc.eventLevel)nc.eventLevel=ev.id;
      else if(rank<=3&&ev.id>=4&&ev.id>nc.eventLevel)nc.eventLevel=ev.id;
    }
    nc.stats={...nc.stats,stb:Math.min(100,nc.stats.stb+2)};
    nc.fatigue=Math.min(100,nc.fatigue+15);
    setC(nc);go('hub');
  }

  // Play victory BGM when entering result phase (MUST be before any conditional returns!)
  const isResultPhase=phase==='result';
  useEffect(()=>{
    if(!isResultPhase)return;
    sfx('drumroll');
    const{rank}=getFinal();
    const isOlympicGold=rank===1&&ev?.id===6;
    playBGM('victory');
    if(rank<=3){sfx('medal');sfx('cheer');spawnConfetti(rank===1?50:20)}
    if(isOlympicGold)setTimeout(()=>{spawnConfetti(80);sfx('cheer')},1000);
  },[isResultPhase]);

  // SELECT
  if(phase==='select'){
    return(
      <div className="h-screen bg-pixel-dark flex flex-col overflow-auto">
        <div className="max-w-lg mx-auto">
          <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-4 py-1.5 text-[10px] font-pixel mb-2">← 返回</button>
          <h2 className="font-pixel text-pixel-gold text-[10px] mb-2">🏆 選擇賽事</h2>
          <div className="space-y-1.5">
            {EVENTS.map(e=>{
              const ok=e.reqLv<=c.eventLevel;
              return(
                <button key={e.id} onClick={()=>{if(ok){sfx('click');startEv(e)}}} disabled={!ok}
                  className={`w-full pixel-border p-2.5 text-left transition-colors ${ok?'bg-pixel-charcoal hover:bg-pixel-darkblue cursor-pointer':'bg-pixel-dark opacity-35 cursor-not-allowed'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className={`font-pixel text-[10px] ${ok?'text-pixel-gold':'text-pixel-gray'}`}>{e.emoji} Lv.{e.id} {e.name}</div>
                      <div className="font-vt text-pixel-gray text-sm mt-0.5">{ok?`🏆 獎金${e.prize} | ${'★'.repeat(e.id)}${'☆'.repeat(6-e.id)}`:`🔒 ${e.unlock}`}</div>
                    </div>
                    {ok&&<span className="text-xl">{e.emoji}</span>}
                  </div>
                </button>
              );
            })}
          </div>
          {c.fatigue>50&&<div className="mt-2 pixel-border bg-pixel-charcoal p-2 text-center"><div className="font-vt text-pixel-orange text-sm">⚠️ 疲勞度高，建議先休息！</div></div>}
        </div>
      </div>
    );
  }

  // LIFT
  if(phase==='lift'){
    const liftName=lift==='snatch'?'抓舉':'挺舉';
    const pb=lift==='snatch'?c.pb.snatch:c.pb.cleanJerk;
    const boosted={...c.stats,stb:c.stats.stb+compBoost};
    const rate=calcRate(boosted,wt,pb||wt,true,ev.id,c.luckBonus,prinBonus);

    // Last attempt result for referee lights
    const lastAtt=atts[lift][atts[lift].length-1];
    const showReferee=lastAtt&&!showMeter;
    // Referee: 3 judges, on success 2-3 green, on fail 1-3 red
    const refLights=lastAtt?(lastAtt.success?
      (lastAtt.perfect?['green','green','green']:Math.random()>.3?['green','green','green']:['green','green','red']):
      (Math.random()>.5?['red','red','red']:['red','red','green']))
      :['gray','gray','gray'];

    // Lifter pose
    const liftPose=showMeter?'lifting':lastAtt?(lastAtt.success?'success':'fail'):'ready';

    return(
      <div className="h-screen bg-pixel-dark flex flex-col overflow-hidden">
        {coach&&<CoachDialog text={coach.text} onClose={()=>setCoach(null)}/>}

        {/* ═══ MAIN STAGE AREA (SVG cartoon scene) ═══ */}
        <div className="flex-1 relative overflow-hidden" style={{minHeight:0,background:'linear-gradient(180deg,#2e7d32 0%,#388e3c 30%,#43a047 100%)'}}>
          {/* Floating top info */}
          <div className="absolute top-1 left-1 right-1 z-20 flex justify-between items-center pointer-events-none">
            <span className="font-pixel text-pixel-gold text-[8px] bg-black bg-opacity-40 px-2 py-0.5 rounded">{ev.emoji}{ev.name}</span>
            {showingOpp?(
              <span className="font-pixel text-red-400 text-[8px] bg-red-900 bg-opacity-60 px-2 py-0.5 rounded">對手試舉</span>
            ):(
              <span className="font-pixel text-white text-[8px] bg-black bg-opacity-40 px-2 py-0.5 rounded">{liftName} {aN+1}/3</span>
            )}
            <span className={`font-pixel text-[9px] bg-black bg-opacity-40 px-2 py-0.5 rounded ${showingOpp?'text-red-400':'text-pixel-gold'}`}>{showingOpp?showingOpp.weight:wt}kg</span>
          </div>
          <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="stageWall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5e6c8"/><stop offset="100%" stopColor="#e8d5b0"/>
              </linearGradient>
              <linearGradient id="platformG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff9800"/><stop offset="100%" stopColor="#e65100"/>
              </linearGradient>
              <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f4a236"/><stop offset="100%" stopColor="#d4841a"/>
              </linearGradient>
              <linearGradient id="curtainL" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1b5e20"/><stop offset="100%" stopColor="#2e7d32"/>
              </linearGradient>
              <linearGradient id="curtainR" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#1b5e20"/><stop offset="100%" stopColor="#2e7d32"/>
              </linearGradient>
              <filter id="ds"><feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity=".3"/></filter>
              <filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <clipPath id="arenaClip"><rect width="400" height="280"/></clipPath>
            </defs>

            <g clipPath="url(#arenaClip)">
            {/* ═══ BACK WALL with diagonal stripe pattern ═══ */}
            <rect x="0" y="0" width="400" height="190" fill="url(#stageWall)"/>
            {/* Diagonal stripes on wall */}
            {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i=>(
              <line key={`ws${i}`} x1={30+i*30} y1="0" x2={i*30-10} y2="190" stroke="#e0c89c" strokeWidth="8" opacity=".25"/>
            ))}

            {/* ═══ GREEN SIDE CURTAINS ═══ */}
            <rect x="0" y="0" width="35" height="195" fill="url(#curtainL)"/>
            <rect x="5" y="0" width="4" height="195" fill="#1b5e20" opacity=".5"/>
            <rect x="15" y="0" width="3" height="195" fill="#43a047" opacity=".3"/>
            <rect x="25" y="0" width="2" height="195" fill="#1b5e20" opacity=".4"/>
            <rect x="365" y="0" width="35" height="195" fill="url(#curtainR)"/>
            <rect x="391" y="0" width="4" height="195" fill="#1b5e20" opacity=".5"/>
            <rect x="382" y="0" width="3" height="195" fill="#43a047" opacity=".3"/>
            <rect x="373" y="0" width="2" height="195" fill="#1b5e20" opacity=".4"/>

            {/* ═══ PURPLE BANNER at top ═══ */}
            <rect x="60" y="4" width="280" height="28" rx="4" fill="#4a148c"/>
            <rect x="60" y="4" width="280" height="5" rx="2" fill="#7b1fa2" opacity=".6"/>
            <rect x="60" y="27" width="280" height="5" rx="2" fill="#311b92" opacity=".5"/>
            <text x="200" y="24" textAnchor="middle" fill="#ffd740" fontSize="13" fontWeight="bold" fontFamily="sans-serif">{ev.name}</text>
            {/* Banner side decorations */}
            <polygon points="56,4 60,4 60,32 52,18" fill="#7b1fa2"/>
            <polygon points="344,4 340,4 340,32 348,18" fill="#7b1fa2"/>

            {/* ═══ AUDIENCE — Row 1 (back row, higher) ═══ */}
            {[0,1,2,3,4,5,6,7,8,9].map(i=>{
              const cx=60+i*30;const cy=52;
              const colors=['#7b1fa2','#1565c0','#c62828','#2e7d32','#ef6c00','#ad1457','#00838f','#4527a0','#d84315','#1565c0'];
              const skinColors=['#ffcc80','#f5c5a3','#d4a373','#ffe0b2','#c8956c','#ffcc80','#f5c5a3','#ffe0b2','#d4a373','#ffcc80'];
              const waving=i===2||i===5||i===8;
              return(
                <React.Fragment key={`r1_${i}`}>
                  <circle cx={cx} cy={cy-8} r="6" fill={skinColors[i]}/>
                  <ellipse cx={cx} cy={cy-14} rx="6" ry="3" fill="#333"/>
                  <circle cx={cx-2} cy={cy-9} r="1" fill="#263238"/>
                  <circle cx={cx+2} cy={cy-9} r="1" fill="#263238"/>
                  <rect x={cx-6} y={cy-2} width="12" height="14" rx="3" fill={colors[i]}/>
                  {waving&&<line x1={cx+5} y1={cy-2} x2={cx+11} y2={cy-14} stroke={skinColors[i]} strokeWidth="3" strokeLinecap="round"/>}
                </React.Fragment>
              );
            })}

            {/* ═══ AUDIENCE — Row 2 (front row, lower, offset) ═══ */}
            {[0,1,2,3,4,5,6,7,8].map(i=>{
              const cx=75+i*30;const cy=80;
              const colors=['#1e88e5','#8e24aa','#43a047','#e53935','#fb8c00','#5e35b1','#00acc1','#c62828','#2e7d32'];
              const skinColors=['#ffe0b2','#ffcc80','#c8956c','#f5c5a3','#ffcc80','#d4a373','#ffe0b2','#ffcc80','#f5c5a3'];
              const waving=i===1||i===4||i===7;
              return(
                <React.Fragment key={`r2_${i}`}>
                  <circle cx={cx} cy={cy-8} r="7" fill={skinColors[i]}/>
                  <ellipse cx={cx} cy={cy-15} rx="7" ry="3.5" fill={i%3===0?'#5d4037':i%3===1?'#333':'#795548'}/>
                  <circle cx={cx-2.5} cy={cy-9} r="1.2" fill="#263238"/>
                  <circle cx={cx+2.5} cy={cy-9} r="1.2" fill="#263238"/>
                  <rect x={cx-7} y={cy-1} width="14" height="16" rx="3" fill={colors[i]}/>
                  {waving&&<>
                    <line x1={cx-5} y1={cy-1} x2={cx-12} y2={cy-14} stroke={skinColors[i]} strokeWidth="3" strokeLinecap="round"/>
                    <circle cx={cx-12} cy={cy-15} r="2.5" fill={skinColors[i]}/>
                  </>}
                </React.Fragment>
              );
            })}

            {/* ═══ Scattered extra audience on sides ═══ */}
            {[0,1,2].map(i=>(
              <React.Fragment key={`sl${i}`}>
                <circle cx={42} cy={55+i*25} r="5.5" fill={['#ffe0b2','#ffcc80','#d4a373'][i]}/>
                <rect x={37} y={59+i*25} width="10" height="13" rx="3" fill={['#e53935','#1e88e5','#7b1fa2'][i]}/>
              </React.Fragment>
            ))}
            {[0,1,2].map(i=>(
              <React.Fragment key={`sr${i}`}>
                <circle cx={358} cy={55+i*25} r="5.5" fill={['#ffcc80','#ffe0b2','#f5c5a3'][i]}/>
                <rect x={353} y={59+i*25} width="10" height="13" rx="3" fill={['#43a047','#fb8c00','#1565c0'][i]}/>
              </React.Fragment>
            ))}

            {/* ═══ GREEN HORIZONTAL RAILING / BARRIER ═══ */}
            <rect x="30" y="105" width="340" height="4" fill="#2e7d32" rx="2"/>
            <rect x="30" y="110" width="340" height="10" fill="#388e3c" rx="2"/>
            <rect x="30" y="121" width="340" height="3" fill="#1b5e20" rx="1"/>
            {/* Railing posts */}
            {[0,1,2,3,4,5,6].map(i=>(
              <rect key={`rp${i}`} x={55+i*47} y="100" width="4" height="26" rx="1" fill="#1b5e20"/>
            ))}

            {/* ═══ LOWER WALL SECTION (below railing) ═══ */}
            <rect x="30" y="124" width="340" height="66" fill="#c8b88a" opacity=".6"/>

            {/* ═══ FLOOR ═══ */}
            <rect x="0" y="188" width="400" height="92" fill="url(#floorG)"/>
            {/* Floor line markings */}
            <line x1="0" y1="188" x2="400" y2="188" stroke="#bf6c00" strokeWidth="2"/>

            {/* ═══ ORANGE COMPETITION PLATFORM ═══ */}
            <ellipse cx="200" cy="245" rx="145" ry="32" fill="#e65100" opacity=".5"/>
            <ellipse cx="200" cy="243" rx="135" ry="28" fill="#ff9800" opacity=".8"/>
            <ellipse cx="200" cy="241" rx="120" ry="24" fill="#ffb74d" opacity=".5"/>
            {/* Platform ring markings */}
            <ellipse cx="200" cy="243" rx="105" ry="20" fill="none" stroke="#e65100" strokeWidth="1.5" opacity=".6"/>
            <ellipse cx="200" cy="243" rx="70" ry="14" fill="none" stroke="#e65100" strokeWidth="1" opacity=".4"/>
            {/* Center line on platform */}
            <line x1="200" y1="220" x2="200" y2="268" stroke="#e65100" strokeWidth="1" opacity=".3"/>

            {/* ═══ LIFTER SHADOW ═══ */}
            <ellipse cx="200" cy="250" rx={showingOpp?(oppPhase==='fail'?'30':'35'):(liftPose==='fail'?'30':'35')} ry={showingOpp?(oppPhase==='fail'?'6':'8'):(liftPose==='fail'?'6':'8')} fill="#000" opacity=".15"/>

            {/* ═══ OPPONENT BANNER OVERLAY ═══ */}
            {showingOpp&&(
              <g>
                <rect x="80" y="96" width="240" height="22" rx="4" fill="#c62828" opacity=".85"/>
                <text x="200" y="112" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">{showingOpp.flag} {showingOpp.name} — {showingOpp.weight}kg</text>
              </g>
            )}

            {/* ═══ OPPONENT CHARACTER ═══ */}
            {showingOpp?(<g transform="translate(200,155)" filter="url(#ds)">
              {oppPhase==='lifting'&&<>
                {/* Legs wide squat */}
                <rect x="-22" y="52" width="14" height="28" rx="4" fill="#263238" transform="rotate(-10,-15,66)"/>
                <rect x="8" y="52" width="14" height="28" rx="4" fill="#263238" transform="rotate(10,15,66)"/>
                <rect x="-30" y="76" width="18" height="10" rx="3" fill="#e53935"/>
                <rect x="12" y="76" width="18" height="10" rx="3" fill="#e53935"/>
                <rect x="-30" y="83" width="18" height="3" rx="1" fill="#b71c1c"/>
                <rect x="12" y="83" width="18" height="3" rx="1" fill="#b71c1c"/>
                {/* Body RED singlet */}
                <rect x="-22" y="8" width="44" height="47" rx="8" fill="#c62828"/>
                <line x1="-18" y1="40" x2="18" y2="13" stroke="#ffcdd2" strokeWidth="5" opacity=".5" strokeLinecap="round"/>
                <rect x="-24" y="46" width="48" height="7" rx="3" fill="#5d4037"/>
                <rect x="-3" y="47" width="6" height="5" rx="1" fill="#ffd740"/>
                <rect x="-9" y="20" width="18" height="11" rx="2" fill="#b71c1c"/>
                <text x="0" y="29" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold" fontFamily="sans-serif">{(showingOpp.flag||'').slice(0,4)}</text>
                <rect x="-6" y="-2" width="12" height="12" rx="3" fill="#f5c5a3"/>
                {/* Arms UP */}
                <path d="M-22,12 Q-38,-25 -52,-68" stroke="#f5c5a3" strokeWidth="11" fill="none" strokeLinecap="round"/>
                <path d="M22,12 Q38,-25 52,-68" stroke="#f5c5a3" strokeWidth="11" fill="none" strokeLinecap="round"/>
                <circle cx="-54" cy="-70" r="7" fill="#f5c5a3"/>
                <circle cx="54" cy="-70" r="7" fill="#f5c5a3"/>
                {/* Barbell overhead */}
                <g transform="translate(0,-73)">
                  <path d="M-95,0 Q-48,3 0,4 Q48,3 95,0" stroke="#b0bec5" strokeWidth="5" fill="none" strokeLinecap="round"/>
                  <rect x="-108" y="-18" width="16" height="38" rx="5" fill="#ef5350" stroke="#c62828" strokeWidth="2"/>
                  <rect x="92" y="-18" width="16" height="38" rx="5" fill="#ef5350" stroke="#c62828" strokeWidth="2"/>
                  <rect x="-94" y="-13" width="10" height="28" rx="3" fill="#42a5f5" stroke="#1565c0" strokeWidth="1.5"/>
                  <rect x="84" y="-13" width="10" height="28" rx="3" fill="#42a5f5" stroke="#1565c0" strokeWidth="1.5"/>
                  <rect x="-81" y="-4" width="4" height="10" rx="1" fill="#78909c"/>
                  <rect x="77" y="-4" width="4" height="10" rx="1" fill="#78909c"/>
                </g>
                {/* Head — no headband, different hair */}
                <ellipse cx="0" cy="-14" rx="20" ry="18" fill="#f5c5a3"/>
                <ellipse cx="0" cy="-27" rx="19" ry="10" fill="#5d4037"/>
                <rect x="-19" y="-24" width="38" height="6" rx="3" fill="#5d4037"/>
                <ellipse cx="-20" cy="-10" rx="4" ry="6" fill="#f5c5a3"/>
                <ellipse cx="20" cy="-10" rx="4" ry="6" fill="#f5c5a3"/>
                {/* Strained face */}
                <line x1="-12" y1="-21" x2="-3" y2="-18" stroke="#5d4037" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="3" y1="-18" x2="12" y2="-21" stroke="#5d4037" strokeWidth="2.5" strokeLinecap="round"/>
                <ellipse cx="-7" cy="-12" rx="4" ry="4.5" fill="white"/>
                <ellipse cx="-7" cy="-11" rx="2.5" ry="3" fill="#263238"/>
                <ellipse cx="7" cy="-12" rx="4" ry="4.5" fill="white"/>
                <ellipse cx="7" cy="-11" rx="2.5" ry="3" fill="#263238"/>
                <ellipse cx="0" cy="-3" rx="5" ry="4" fill="#263238"/>
                <ellipse cx="24" cy="-14" rx="3" ry="6" fill="#bbdefb" opacity=".7"/>
              </>}

              {oppPhase==='success'&&<>
                {/* Legs wide */}
                <rect x="-22" y="52" width="14" height="28" rx="4" fill="#263238" transform="rotate(-10,-15,66)"/>
                <rect x="8" y="52" width="14" height="28" rx="4" fill="#263238" transform="rotate(10,15,66)"/>
                <rect x="-30" y="76" width="18" height="10" rx="3" fill="#e53935"/>
                <rect x="12" y="76" width="18" height="10" rx="3" fill="#e53935"/>
                <rect x="-30" y="83" width="18" height="3" rx="1" fill="#b71c1c"/>
                <rect x="12" y="83" width="18" height="3" rx="1" fill="#b71c1c"/>
                {/* Body RED singlet */}
                <rect x="-22" y="8" width="44" height="47" rx="8" fill="#c62828"/>
                <line x1="-18" y1="40" x2="18" y2="13" stroke="#ffcdd2" strokeWidth="5" opacity=".5" strokeLinecap="round"/>
                <rect x="-24" y="46" width="48" height="7" rx="3" fill="#5d4037"/>
                <rect x="-3" y="47" width="6" height="5" rx="1" fill="#ffd740"/>
                <rect x="-9" y="20" width="18" height="11" rx="2" fill="#b71c1c"/>
                <text x="0" y="29" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold" fontFamily="sans-serif">{(showingOpp.flag||'').slice(0,4)}</text>
                <rect x="-6" y="-2" width="12" height="12" rx="3" fill="#f5c5a3"/>
                {/* Arms UP success */}
                <path d="M-22,12 Q-38,-25 -52,-68" stroke="#f5c5a3" strokeWidth="11" fill="none" strokeLinecap="round"/>
                <path d="M22,12 Q38,-25 52,-68" stroke="#f5c5a3" strokeWidth="11" fill="none" strokeLinecap="round"/>
                <circle cx="-54" cy="-70" r="7" fill="#f5c5a3"/>
                <circle cx="54" cy="-70" r="7" fill="#f5c5a3"/>
                {/* Barbell overhead */}
                <g transform="translate(0,-73)">
                  <path d="M-95,0 Q-48,3 0,4 Q48,3 95,0" stroke="#b0bec5" strokeWidth="5" fill="none" strokeLinecap="round"/>
                  <rect x="-108" y="-18" width="16" height="38" rx="5" fill="#ef5350" stroke="#c62828" strokeWidth="2"/>
                  <rect x="92" y="-18" width="16" height="38" rx="5" fill="#ef5350" stroke="#c62828" strokeWidth="2"/>
                  <rect x="-94" y="-13" width="10" height="28" rx="3" fill="#42a5f5" stroke="#1565c0" strokeWidth="1.5"/>
                  <rect x="84" y="-13" width="10" height="28" rx="3" fill="#42a5f5" stroke="#1565c0" strokeWidth="1.5"/>
                  <rect x="-81" y="-4" width="4" height="10" rx="1" fill="#78909c"/>
                  <rect x="77" y="-4" width="4" height="10" rx="1" fill="#78909c"/>
                </g>
                {/* Head happy */}
                <ellipse cx="0" cy="-14" rx="20" ry="18" fill="#f5c5a3"/>
                <ellipse cx="0" cy="-27" rx="19" ry="10" fill="#5d4037"/>
                <rect x="-19" y="-24" width="38" height="6" rx="3" fill="#5d4037"/>
                <ellipse cx="-20" cy="-10" rx="4" ry="6" fill="#f5c5a3"/>
                <ellipse cx="20" cy="-10" rx="4" ry="6" fill="#f5c5a3"/>
                <path d="M-12,-19 Q-7,-21 -3,-19" stroke="#5d4037" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M3,-19 Q7,-21 12,-19" stroke="#5d4037" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M-10,-13 Q-7,-10 -4,-13" stroke="#263238" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M4,-13 Q7,-10 10,-13" stroke="#263238" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M-8,-3 Q0,6 8,-3" stroke="#c62828" strokeWidth="2" fill="#ef5350"/>
                <ellipse cx="-14" cy="-6" rx="5" ry="3" fill="#ef9a9a" opacity=".4"/>
                <ellipse cx="14" cy="-6" rx="5" ry="3" fill="#ef9a9a" opacity=".4"/>
                {/* Success sparkles */}
                <polygon points="-45,-55 -42,-63 -39,-55 -42,-58" fill="#ffd740"/>
                <polygon points="45,-60 48,-68 51,-60 48,-63" fill="#ffd740"/>
                <circle cx="-70" cy="-20" r="3" fill="#ffd740" opacity=".6"/>
                <circle cx="70" cy="-25" r="3" fill="#ffd740" opacity=".6"/>
              </>}

              {oppPhase==='fail'&&<>
                {/* Legs standing */}
                <rect x="-14" y="55" width="13" height="28" rx="4" fill="#263238"/>
                <rect x="1" y="55" width="13" height="28" rx="4" fill="#263238"/>
                <rect x="-17" y="80" width="17" height="9" rx="3" fill="#e53935"/>
                <rect x="1" y="80" width="17" height="9" rx="3" fill="#e53935"/>
                <rect x="-17" y="86" width="17" height="3" rx="1" fill="#b71c1c"/>
                <rect x="1" y="86" width="17" height="3" rx="1" fill="#b71c1c"/>
                {/* Body RED singlet hunched */}
                <rect x="-20" y="12" width="40" height="45" rx="7" fill="#c62828"/>
                <line x1="-16" y1="42" x2="16" y2="17" stroke="#ffcdd2" strokeWidth="4.5" opacity=".4" strokeLinecap="round"/>
                <rect x="-22" y="48" width="44" height="7" rx="3" fill="#5d4037"/>
                <rect x="-3" y="49" width="6" height="5" rx="1" fill="#ffd740"/>
                <rect x="-8" y="24" width="16" height="10" rx="2" fill="#b71c1c"/>
                <text x="0" y="33" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold" fontFamily="sans-serif">{(showingOpp.flag||'').slice(0,4)}</text>
                <rect x="-5" y="3" width="10" height="11" rx="3" fill="#f5c5a3"/>
                {/* Arms drooping */}
                <path d="M-20,18 Q-30,38 -24,52" stroke="#f5c5a3" strokeWidth="10" fill="none" strokeLinecap="round"/>
                <path d="M20,18 Q30,38 24,52" stroke="#f5c5a3" strokeWidth="10" fill="none" strokeLinecap="round"/>
                <circle cx="-24" cy="53" r="5.5" fill="#f5c5a3"/>
                <circle cx="24" cy="53" r="5.5" fill="#f5c5a3"/>
                {/* Head lowered sad */}
                <ellipse cx="0" cy="-8" rx="19" ry="17" fill="#f5c5a3"/>
                <ellipse cx="0" cy="-20" rx="18" ry="9" fill="#5d4037"/>
                <rect x="-18" y="-18" width="36" height="5" rx="2" fill="#5d4037"/>
                <ellipse cx="-19" cy="-4" rx="4" ry="5.5" fill="#f5c5a3"/>
                <ellipse cx="19" cy="-4" rx="4" ry="5.5" fill="#f5c5a3"/>
                <line x1="-12" y1="-14" x2="-4" y2="-11" stroke="#5d4037" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4" y1="-11" x2="12" y2="-14" stroke="#5d4037" strokeWidth="2" strokeLinecap="round"/>
                <ellipse cx="-7" cy="-6" rx="4" ry="3" fill="white"/>
                <ellipse cx="-7" cy="-5.5" rx="2" ry="2" fill="#263238"/>
                <ellipse cx="7" cy="-6" rx="4" ry="3" fill="white"/>
                <ellipse cx="7" cy="-5.5" rx="2" ry="2" fill="#263238"/>
                <path d="M-6,4 Q0,0 6,4" stroke="#795548" strokeWidth="2" fill="none"/>
                <ellipse cx="22" cy="-10" rx="2.5" ry="4" fill="#bbdefb" opacity=".6"/>
                {/* Dropped bar */}
                <g transform="translate(0,82)">
                  <rect x="-75" y="-2" width="150" height="5" rx="2" fill="#b0bec5" opacity=".7"/>
                  <rect x="-85" y="-12" width="14" height="26" rx="4" fill="#ef5350" opacity=".6" stroke="#c62828" strokeWidth="1"/>
                  <rect x="71" y="-12" width="14" height="26" rx="4" fill="#ef5350" opacity=".6" stroke="#c62828" strokeWidth="1"/>
                </g>
              </>}
            </g>):(
            /* ═══ PLAYER LIFTER CHARACTER — LARGE FRONT VIEW ═══ */
            <g transform="translate(200,155)" filter="url(#ds)">
              {liftPose==='ready'&&<>
                {/* ── READY POSE: Standing upright, bar on ground ── */}
                {/* Legs */}
                <rect x="-16" y="52" width="14" height="30" rx="4" fill="#263238"/>
                <rect x="2" y="52" width="14" height="30" rx="4" fill="#263238"/>
                {/* Shoes */}
                <rect x="-19" y="79" width="18" height="10" rx="3" fill="#1e88e5"/>
                <rect x="1" y="79" width="18" height="10" rx="3" fill="#1e88e5"/>
                <rect x="-19" y="86" width="18" height="3" rx="1" fill="#0d47a1"/>
                <rect x="1" y="86" width="18" height="3" rx="1" fill="#0d47a1"/>
                {/* Body / Singlet */}
                <rect x="-22" y="10" width="44" height="45" rx="8" fill="#1565c0"/>
                {/* White diagonal stripe on singlet */}
                <line x1="-18" y1="40" x2="18" y2="15" stroke="white" strokeWidth="5" opacity=".7" strokeLinecap="round"/>
                {/* Belt */}
                <rect x="-24" y="46" width="48" height="7" rx="3" fill="#5d4037"/>
                <rect x="-3" y="47" width="6" height="5" rx="1" fill="#ffd740"/>
                {/* TPE label */}
                <rect x="-9" y="22" width="18" height="11" rx="2" fill="#0d47a1"/>
                <text x="0" y="31" textAnchor="middle" fill="#ffd740" fontSize="7" fontWeight="bold" fontFamily="sans-serif">TPE</text>
                {/* Arms at sides */}
                <path d="M-22,15 Q-32,30 -28,48" stroke="#ffcc80" strokeWidth="11" fill="none" strokeLinecap="round"/>
                <path d="M22,15 Q32,30 28,48" stroke="#ffcc80" strokeWidth="11" fill="none" strokeLinecap="round"/>
                {/* Hands */}
                <circle cx="-28" cy="49" r="6" fill="#ffcc80"/>
                <circle cx="28" cy="49" r="6" fill="#ffcc80"/>
                {/* Neck */}
                <rect x="-6" y="0" width="12" height="12" rx="3" fill="#ffcc80"/>
                {/* Head */}
                <ellipse cx="0" cy="-12" rx="20" ry="18" fill="#ffcc80"/>
                {/* Hair */}
                <ellipse cx="0" cy="-25" rx="19" ry="10" fill="#37474f"/>
                <rect x="-19" y="-22" width="38" height="6" rx="3" fill="#37474f"/>
                {/* Headband */}
                <rect x="-20" y="-18" width="40" height="4" rx="2" fill="#ef5350"/>
                {/* Eyes — calm/focused */}
                <ellipse cx="-7" cy="-10" rx="4" ry="4.5" fill="white"/>
                <ellipse cx="-7" cy="-9" rx="2.5" ry="3" fill="#263238"/>
                <ellipse cx="7" cy="-10" rx="4" ry="4.5" fill="white"/>
                <ellipse cx="7" cy="-9" rx="2.5" ry="3" fill="#263238"/>
                {/* Eyebrows */}
                <line x1="-12" y1="-16" x2="-3" y2="-16" stroke="#37474f" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="-16" x2="12" y2="-16" stroke="#37474f" strokeWidth="2" strokeLinecap="round"/>
                {/* Mouth — slight smile */}
                <path d="M-5,-1 Q0,4 5,-1" stroke="#c62828" strokeWidth="1.5" fill="#ef5350"/>
                {/* Blush */}
                <ellipse cx="-14" cy="-4" rx="4" ry="2.5" fill="#ef9a9a" opacity=".35"/>
                <ellipse cx="14" cy="-4" rx="4" ry="2.5" fill="#ef9a9a" opacity=".35"/>
                {/* Ears */}
                <ellipse cx="-20" cy="-8" rx="4" ry="6" fill="#ffcc80"/>
                <ellipse cx="20" cy="-8" rx="4" ry="6" fill="#ffcc80"/>

                {/* Barbell on ground */}
                <g transform="translate(0,82)">
                  <rect x="-75" y="-2" width="150" height="5" rx="2" fill="#b0bec5" stroke="#78909c" strokeWidth="1"/>
                  {/* Red plates */}
                  <rect x="-85" y="-14" width="14" height="30" rx="4" fill="#ef5350" stroke="#c62828" strokeWidth="1.5"/>
                  <rect x="71" y="-14" width="14" height="30" rx="4" fill="#ef5350" stroke="#c62828" strokeWidth="1.5"/>
                  {/* Blue plates (inner) */}
                  <rect x="-73" y="-10" width="8" height="22" rx="3" fill="#42a5f5" stroke="#1565c0" strokeWidth="1"/>
                  <rect x="65" y="-10" width="8" height="22" rx="3" fill="#42a5f5" stroke="#1565c0" strokeWidth="1"/>
                  {/* Collars */}
                  <rect x="-66" y="-4" width="4" height="10" rx="1" fill="#78909c"/>
                  <rect x="62" y="-4" width="4" height="10" rx="1" fill="#78909c"/>
                </g>
              </>}

              {(liftPose==='jerkReady'||liftPose==='jerkLifting')&&<>
                {/* ── JERK READY: Bar at shoulders ── */}
                {/* Legs slightly bent */}
                <rect x="-18" y="52" width="14" height="28" rx="4" fill="#263238" transform="rotate(-5,-11,66)"/>
                <rect x="4" y="52" width="14" height="28" rx="4" fill="#263238" transform="rotate(5,11,66)"/>
                <rect x="-22" y="76" width="18" height="10" rx="3" fill="#1e88e5"/>
                <rect x="4" y="76" width="18" height="10" rx="3" fill="#1e88e5"/>
                <rect x="-22" y="83" width="18" height="3" rx="1" fill="#0d47a1"/>
                <rect x="4" y="83" width="18" height="3" rx="1" fill="#0d47a1"/>
                {/* Body */}
                <rect x="-22" y="10" width="44" height="45" rx="8" fill="#1565c0"/>
                <line x1="-18" y1="40" x2="18" y2="15" stroke="white" strokeWidth="5" opacity=".7" strokeLinecap="round"/>
                <rect x="-24" y="46" width="48" height="7" rx="3" fill="#5d4037"/>
                <rect x="-3" y="47" width="6" height="5" rx="1" fill="#ffd740"/>
                <rect x="-9" y="22" width="18" height="11" rx="2" fill="#0d47a1"/>
                <text x="0" y="31" textAnchor="middle" fill="#ffd740" fontSize="7" fontWeight="bold" fontFamily="sans-serif">TPE</text>
                {/* Neck */}
                <rect x="-6" y="0" width="12" height="12" rx="3" fill="#ffcc80"/>
                {/* Arms holding bar at shoulder height */}
                <path d="M-22,14 Q-35,-5 -48,-18" stroke="#ffcc80" strokeWidth="11" fill="none" strokeLinecap="round"/>
                <path d="M22,14 Q35,-5 48,-18" stroke="#ffcc80" strokeWidth="11" fill="none" strokeLinecap="round"/>
                <circle cx="-50" cy="-20" r="6" fill="#ffcc80"/>
                <circle cx="50" cy="-20" r="6" fill="#ffcc80"/>
                {/* Barbell at shoulder level */}
                <g transform="translate(0,-20)">
                  <path d="M-90,0 Q-45,-2 0,-3 Q45,-2 90,0" stroke="#b0bec5" strokeWidth="5" fill="none" strokeLinecap="round"/>
                  <rect x="-100" y="-14" width="14" height="30" rx="4" fill="#ef5350" stroke="#c62828" strokeWidth="1.5"/>
                  <rect x="86" y="-14" width="14" height="30" rx="4" fill="#ef5350" stroke="#c62828" strokeWidth="1.5"/>
                  <rect x="-88" y="-10" width="8" height="22" rx="3" fill="#42a5f5" stroke="#1565c0" strokeWidth="1"/>
                  <rect x="80" y="-10" width="8" height="22" rx="3" fill="#42a5f5" stroke="#1565c0" strokeWidth="1"/>
                  <rect x="-81" y="-4" width="4" height="10" rx="1" fill="#78909c"/>
                  <rect x="77" y="-4" width="4" height="10" rx="1" fill="#78909c"/>
                </g>
                {/* Head */}
                <ellipse cx="0" cy="-12" rx="20" ry="18" fill="#ffcc80"/>
                <ellipse cx="0" cy="-25" rx="19" ry="10" fill="#37474f"/>
                <rect x="-19" y="-22" width="38" height="6" rx="3" fill="#37474f"/>
                <rect x="-20" y="-18" width="40" height="4" rx="2" fill="#ef5350"/>
                <ellipse cx="-20" cy="-8" rx="4" ry="6" fill="#ffcc80"/>
                <ellipse cx="20" cy="-8" rx="4" ry="6" fill="#ffcc80"/>
                {/* Focused face */}
                <ellipse cx="-7" cy="-10" rx="4" ry="4.5" fill="white"/>
                <ellipse cx="-7" cy="-9" rx="2.5" ry="3" fill="#263238"/>
                <ellipse cx="7" cy="-10" rx="4" ry="4.5" fill="white"/>
                <ellipse cx="7" cy="-9" rx="2.5" ry="3" fill="#263238"/>
                <line x1="-12" y1="-17" x2="-3" y2="-14" stroke="#37474f" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="3" y1="-14" x2="12" y2="-17" stroke="#37474f" strokeWidth="2.5" strokeLinecap="round"/>
                <rect x="-5" y="-2" width="10" height="5" rx="2" fill="#263238"/>
                <ellipse cx="-14" cy="-4" rx="4" ry="2.5" fill="#ef9a9a" opacity=".4"/>
                <ellipse cx="14" cy="-4" rx="4" ry="2.5" fill="#ef9a9a" opacity=".4"/>
                {liftPose==='jerkLifting'&&<ellipse cx="23" cy="-12" rx="3" ry="5" fill="#bbdefb" opacity=".7"/>}
                <text x="0" y="-45" textAnchor="middle" fill="#38b764" fontSize="11" fontWeight="bold" fontFamily="sans-serif">CLEAN ✓</text>
              </>}

              {(liftPose==='lifting'||liftPose==='success')&&<>
                {/* ── LIFTING / SUCCESS: Bar overhead ── */}
                {/* Legs — wide squat stance */}
                <rect x="-22" y="52" width="14" height="28" rx="4" fill="#263238" transform="rotate(-10,-15,66)"/>
                <rect x="8" y="52" width="14" height="28" rx="4" fill="#263238" transform="rotate(10,15,66)"/>
                {/* Shoes */}
                <rect x="-30" y="76" width="18" height="10" rx="3" fill="#1e88e5"/>
                <rect x="12" y="76" width="18" height="10" rx="3" fill="#1e88e5"/>
                <rect x="-30" y="83" width="18" height="3" rx="1" fill="#0d47a1"/>
                <rect x="12" y="83" width="18" height="3" rx="1" fill="#0d47a1"/>
                {/* Body / Singlet */}
                <rect x="-22" y="8" width="44" height="47" rx="8" fill="#1565c0"/>
                {/* White diagonal stripe */}
                <line x1="-18" y1="40" x2="18" y2="13" stroke="white" strokeWidth="5" opacity=".7" strokeLinecap="round"/>
                {/* Belt */}
                <rect x="-24" y="46" width="48" height="7" rx="3" fill="#5d4037"/>
                <rect x="-3" y="47" width="6" height="5" rx="1" fill="#ffd740"/>
                {/* TPE label */}
                <rect x="-9" y="20" width="18" height="11" rx="2" fill="#0d47a1"/>
                <text x="0" y="29" textAnchor="middle" fill="#ffd740" fontSize="7" fontWeight="bold" fontFamily="sans-serif">TPE</text>
                {/* Neck */}
                <rect x="-6" y="-2" width="12" height="12" rx="3" fill="#ffcc80"/>
                {/* Arms reaching UP */}
                <path d="M-22,12 Q-38,-25 -52,-68" stroke="#ffcc80" strokeWidth="11" fill="none" strokeLinecap="round"/>
                <path d="M22,12 Q38,-25 52,-68" stroke="#ffcc80" strokeWidth="11" fill="none" strokeLinecap="round"/>
                {/* Bicep bulge */}
                <ellipse cx="-30" cy="-10" rx="7" ry="5" fill="#ffcc80" opacity=".5"/>
                <ellipse cx="30" cy="-10" rx="7" ry="5" fill="#ffcc80" opacity=".5"/>
                {/* Hands gripping bar */}
                <circle cx="-54" cy="-70" r="7" fill="#ffcc80"/>
                <circle cx="54" cy="-70" r="7" fill="#ffcc80"/>

                {/* ── BARBELL OVERHEAD ── */}
                <g transform="translate(0,-73)">
                  {/* Bar with slight bend */}
                  <path d="M-95,0 Q-48,3 0,4 Q48,3 95,0" stroke="#b0bec5" strokeWidth="5" fill="none" strokeLinecap="round"/>
                  <path d="M-95,0 Q-48,3 0,4 Q48,3 95,0" stroke="#cfd8dc" strokeWidth="2" fill="none" opacity=".5"/>
                  {/* Large RED plates (outer) */}
                  <rect x="-108" y="-18" width="16" height="38" rx="5" fill="#ef5350" stroke="#c62828" strokeWidth="2"/>
                  <rect x="-105" y="-14" width="10" height="30" rx="3" fill="#e53935" opacity=".5"/>
                  <rect x="92" y="-18" width="16" height="38" rx="5" fill="#ef5350" stroke="#c62828" strokeWidth="2"/>
                  <rect x="95" y="-14" width="10" height="30" rx="3" fill="#e53935" opacity=".5"/>
                  {/* BLUE plates (inner) */}
                  <rect x="-94" y="-13" width="10" height="28" rx="3" fill="#42a5f5" stroke="#1565c0" strokeWidth="1.5"/>
                  <rect x="84" y="-13" width="10" height="28" rx="3" fill="#42a5f5" stroke="#1565c0" strokeWidth="1.5"/>
                  {/* Small yellow plates */}
                  <rect x="-85" y="-8" width="5" height="18" rx="2" fill="#ffd740" stroke="#f9a825" strokeWidth="1"/>
                  <rect x="80" y="-8" width="5" height="18" rx="2" fill="#ffd740" stroke="#f9a825" strokeWidth="1"/>
                  {/* Collars */}
                  <rect x="-81" y="-4" width="4" height="10" rx="1" fill="#78909c"/>
                  <rect x="77" y="-4" width="4" height="10" rx="1" fill="#78909c"/>
                </g>

                {/* Head */}
                <ellipse cx="0" cy="-14" rx="20" ry="18" fill="#ffcc80"/>
                {/* Hair */}
                <ellipse cx="0" cy="-27" rx="19" ry="10" fill="#37474f"/>
                <rect x="-19" y="-24" width="38" height="6" rx="3" fill="#37474f"/>
                {/* Headband */}
                <rect x="-20" y="-20" width="40" height="4" rx="2" fill="#ef5350"/>
                {/* Ears */}
                <ellipse cx="-20" cy="-10" rx="4" ry="6" fill="#ffcc80"/>
                <ellipse cx="20" cy="-10" rx="4" ry="6" fill="#ffcc80"/>
                {/* Eyebrows — angled down (effort / happy) */}
                {liftPose==='success'?<>
                  <path d="M-12,-19 Q-7,-21 -3,-19" stroke="#37474f" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <path d="M3,-19 Q7,-21 12,-19" stroke="#37474f" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </>:<>
                  <line x1="-12" y1="-21" x2="-3" y2="-18" stroke="#37474f" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="3" y1="-18" x2="12" y2="-21" stroke="#37474f" strokeWidth="2.5" strokeLinecap="round"/>
                </>}
                {/* Eyes */}
                {liftPose==='success'?<>
                  {/* Happy squinting eyes */}
                  <path d="M-10,-13 Q-7,-10 -4,-13" stroke="#263238" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <path d="M4,-13 Q7,-10 10,-13" stroke="#263238" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </>:<>
                  {/* Strained eyes */}
                  <ellipse cx="-7" cy="-12" rx="4" ry="4.5" fill="white"/>
                  <ellipse cx="-7" cy="-11" rx="2.5" ry="3" fill="#263238"/>
                  <ellipse cx="7" cy="-12" rx="4" ry="4.5" fill="white"/>
                  <ellipse cx="7" cy="-11" rx="2.5" ry="3" fill="#263238"/>
                  <circle cx="-6" cy="-12" r="1" fill="white"/>
                  <circle cx="8" cy="-12" r="1" fill="white"/>
                </>}
                {/* Mouth */}
                {liftPose==='success'?
                  <path d="M-8,-3 Q0,6 8,-3" stroke="#c62828" strokeWidth="2" fill="#ef5350"/>:
                  <ellipse cx="0" cy="-3" rx="5" ry="4" fill="#263238"/>
                }
                {/* Blush */}
                <ellipse cx="-14" cy="-6" rx="5" ry="3" fill="#ef9a9a" opacity=".4"/>
                <ellipse cx="14" cy="-6" rx="5" ry="3" fill="#ef9a9a" opacity=".4"/>
                {/* Veins / Sweat for lifting */}
                {liftPose==='lifting'&&<>
                  <ellipse cx="24" cy="-14" rx="3" ry="6" fill="#bbdefb" opacity=".7"/>
                  <ellipse cx="-24" cy="-5" rx="2.5" ry="5" fill="#bbdefb" opacity=".5"/>
                  {/* Strain lines */}
                  <line x1="22" y1="-22" x2="26" y2="-26" stroke="#ef5350" strokeWidth="1.5" opacity=".6"/>
                  <line x1="26" y1="-20" x2="30" y2="-24" stroke="#ef5350" strokeWidth="1.5" opacity=".6"/>
                </>}

                {/* Success sparkles and stars */}
                {liftPose==='success'&&<>
                  <polygon points="-45,-55 -42,-63 -39,-55 -42,-58" fill="#ffd740"/>
                  <polygon points="45,-60 48,-68 51,-60 48,-63" fill="#ffd740"/>
                  <polygon points="-60,-35 -57,-43 -54,-35 -57,-38" fill="#ffd740" opacity=".7"/>
                  <polygon points="60,-40 63,-48 66,-40 63,-43" fill="#ffd740" opacity=".7"/>
                  <circle cx="-70" cy="-20" r="3" fill="#ffd740" opacity=".6"/>
                  <circle cx="70" cy="-25" r="3" fill="#ffd740" opacity=".6"/>
                  <circle cx="-30" cy="-80" r="2.5" fill="#fff" opacity=".8"/>
                  <circle cx="35" cy="-85" r="2" fill="#fff" opacity=".6"/>
                </>}
              </>}

              {liftPose==='fail'&&<>
                {/* ── FAIL POSE: Disappointed, bar dropped ── */}
                {/* Legs — standing straight, slightly hunched */}
                <rect x="-14" y="55" width="13" height="28" rx="4" fill="#263238"/>
                <rect x="1" y="55" width="13" height="28" rx="4" fill="#263238"/>
                {/* Shoes */}
                <rect x="-17" y="80" width="17" height="9" rx="3" fill="#1e88e5"/>
                <rect x="1" y="80" width="17" height="9" rx="3" fill="#1e88e5"/>
                <rect x="-17" y="86" width="17" height="3" rx="1" fill="#0d47a1"/>
                <rect x="1" y="86" width="17" height="3" rx="1" fill="#0d47a1"/>
                {/* Body — slightly hunched */}
                <rect x="-20" y="12" width="40" height="45" rx="7" fill="#1565c0"/>
                <line x1="-16" y1="42" x2="16" y2="17" stroke="white" strokeWidth="4.5" opacity=".5" strokeLinecap="round"/>
                <rect x="-22" y="48" width="44" height="7" rx="3" fill="#5d4037"/>
                <rect x="-3" y="49" width="6" height="5" rx="1" fill="#ffd740"/>
                <rect x="-8" y="24" width="16" height="10" rx="2" fill="#0d47a1"/>
                <text x="0" y="33" textAnchor="middle" fill="#ffd740" fontSize="6" fontWeight="bold" fontFamily="sans-serif">TPE</text>
                {/* Neck */}
                <rect x="-5" y="3" width="10" height="11" rx="3" fill="#ffcc80"/>
                {/* Arms drooping / on knees */}
                <path d="M-20,18 Q-30,38 -24,52" stroke="#ffcc80" strokeWidth="10" fill="none" strokeLinecap="round"/>
                <path d="M20,18 Q30,38 24,52" stroke="#ffcc80" strokeWidth="10" fill="none" strokeLinecap="round"/>
                <circle cx="-24" cy="53" r="5.5" fill="#ffcc80"/>
                <circle cx="24" cy="53" r="5.5" fill="#ffcc80"/>
                {/* Head — lowered */}
                <ellipse cx="0" cy="-8" rx="19" ry="17" fill="#ffcc80"/>
                <ellipse cx="0" cy="-20" rx="18" ry="9" fill="#37474f"/>
                <rect x="-18" y="-18" width="36" height="5" rx="2" fill="#37474f"/>
                <rect x="-19" y="-14" width="38" height="4" rx="2" fill="#ef5350"/>
                <ellipse cx="-19" cy="-4" rx="4" ry="5.5" fill="#ffcc80"/>
                <ellipse cx="19" cy="-4" rx="4" ry="5.5" fill="#ffcc80"/>
                {/* Sad eyebrows — angled up in middle */}
                <line x1="-12" y1="-14" x2="-4" y2="-11" stroke="#37474f" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4" y1="-11" x2="12" y2="-14" stroke="#37474f" strokeWidth="2" strokeLinecap="round"/>
                {/* Sad eyes */}
                <ellipse cx="-7" cy="-6" rx="4" ry="3" fill="white"/>
                <ellipse cx="-7" cy="-5.5" rx="2" ry="2" fill="#263238"/>
                <ellipse cx="7" cy="-6" rx="4" ry="3" fill="white"/>
                <ellipse cx="7" cy="-5.5" rx="2" ry="2" fill="#263238"/>
                {/* Sad mouth — frown */}
                <path d="M-6,4 Q0,0 6,4" stroke="#795548" strokeWidth="2" fill="none"/>
                {/* Blush */}
                <ellipse cx="-13" cy="0" rx="4" ry="2.5" fill="#ef9a9a" opacity=".35"/>
                <ellipse cx="13" cy="0" rx="4" ry="2.5" fill="#ef9a9a" opacity=".35"/>
                {/* Sweat drops */}
                <ellipse cx="22" cy="-10" rx="2.5" ry="4" fill="#bbdefb" opacity=".6"/>
                <ellipse cx="-22" cy="-6" rx="2" ry="3.5" fill="#bbdefb" opacity=".5"/>
                {/* Dizzy stars */}
                <text x="-20" y="-25" fontSize="10" opacity=".7">💫</text>
                <text x="12" y="-28" fontSize="8" opacity=".5">💫</text>

                {/* Barbell on ground (dropped) */}
                <g transform="translate(0,82)">
                  <rect x="-75" y="-2" width="150" height="5" rx="2" fill="#b0bec5" opacity=".7"/>
                  <rect x="-85" y="-12" width="14" height="26" rx="4" fill="#ef5350" opacity=".6" stroke="#c62828" strokeWidth="1"/>
                  <rect x="71" y="-12" width="14" height="26" rx="4" fill="#ef5350" opacity=".6" stroke="#c62828" strokeWidth="1"/>
                  <rect x="-73" y="-8" width="8" height="18" rx="3" fill="#42a5f5" opacity=".5"/>
                  <rect x="65" y="-8" width="8" height="18" rx="3" fill="#42a5f5" opacity=".5"/>
                </g>
              </>}
            </g>)}

            {/* ═══ FOREGROUND DETAILS ═══ */}
            {/* Camera flash effects during lifting */}
            {(liftPose==='lifting'||(showingOpp&&oppPhase==='lifting'))&&<>
              <circle cx="55" cy="65" r="4" fill="#fff" opacity=".6"><animate attributeName="opacity" values=".6;0;.6" dur="1.5s" repeatCount="indefinite"/></circle>
              <circle cx="340" cy="78" r="3" fill="#fff" opacity=".4"><animate attributeName="opacity" values=".4;0;.4" dur="2s" repeatCount="indefinite"/></circle>
            </>}
            {(liftPose==='success'||(showingOpp&&oppPhase==='success'))&&<>
              <circle cx="50" cy="60" r="5" fill="#fff" opacity=".7"><animate attributeName="opacity" values=".7;0;.7" dur="0.8s" repeatCount="indefinite"/></circle>
              <circle cx="350" cy="70" r="4" fill="#fff" opacity=".6"><animate attributeName="opacity" values=".6;0;.6" dur="1s" repeatCount="indefinite"/></circle>
              <circle cx="80" cy="85" r="3" fill="#fff" opacity=".5"><animate attributeName="opacity" values=".5;0;.5" dur="1.2s" repeatCount="indefinite"/></circle>
            </>}
            </g>
          </svg>

          {/* ═══ POWER BAR (left side, like reference) ═══ */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            {/* Lift icon */}
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 border-2 border-white border-opacity-40 flex items-center justify-center">
              <span className="text-lg">{lift==='snatch'?'🤸':'🏅'}</span>
            </div>
            {/* Vertical power bar */}
            <div className="w-6 h-36 bg-pixel-dark border-2 border-pixel-gray rounded-sm relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 transition-all duration-300 rounded-sm"
                style={{height:`${rate}%`,background:rate>=70?'linear-gradient(0deg,#38b764,#a7f070)':rate>=40?'linear-gradient(0deg,#ef7d57,#f4d03f)':'linear-gradient(0deg,#b13e53,#ef7d57)'}}/>
            </div>
            <span className="font-pixel text-white text-[7px]">{rate}%</span>
          </div>

          {/* ═══ REFEREE JUDGE LIGHTS (bottom right) ═══ */}
          <div className="absolute right-2 bottom-2 z-10">
            <div className="pixel-border bg-pixel-charcoal bg-opacity-90 p-2 rounded">
              <div className="font-pixel text-pixel-gold text-[7px] text-center mb-1">JUDGES</div>
              <div className="flex gap-2">
                {refLights.map((color,i)=>(
                  <div key={i} className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 transition-all duration-300 ${showReferee?'':'opacity-30'}`}
                    style={{
                      background:color==='green'?'#38b764':color==='red'?'#ef5350':'#566c86',
                      borderColor:color==='green'?'#2e7d32':color==='red'?'#c62828':'#333c57',
                      boxShadow:showReferee&&color!=='gray'?`0 0 8px ${color==='green'?'#38b764':'#ef5350'}`:'none'
                    }}/>
                ))}
              </div>
            </div>
          </div>

          {/* Weight display overlay */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            {showingOpp?(
              <div className="bg-pixel-dark bg-opacity-80 px-4 py-1 rounded border-2 border-red-500">
                <span className="font-pixel text-red-400 text-sm">{showingOpp.flag} {showingOpp.weight}kg</span>
              </div>
            ):(
              <div className="bg-pixel-dark bg-opacity-70 px-4 py-1 rounded border-2 border-pixel-gold">
                <span className="font-pixel text-pixel-gold text-sm">{wt}kg</span>
              </div>
            )}
          </div>

          {/* Countdown overlay */}
          {countdown!==null&&countdown>0&&(
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <div className="font-pixel text-7xl text-pixel-gold pop-in" style={{textShadow:'4px 4px 0 #000'}}>
                {countdown}
              </div>
            </div>
          )}
          {countdown===0&&(
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <div className="font-pixel text-5xl text-pixel-green pop-in" style={{textShadow:'4px 4px 0 #000'}}>
                GO!
              </div>
            </div>
          )}
        </div>

        {/* ═══ BOTTOM CONTROLS ═══ */}
        <div className="bg-pixel-charcoal border-t-4 border-pixel-gray p-2">
          <div className="max-w-lg mx-auto">
            {showMeter?(
              <LiftControl liftType={lift==='snatch'?'snatch':'cleanJerk'} difficulty={ev.diff} stats={c.stats} onResult={handleLiftResult} weight={wt}/>
            ):showingOpp?(
              <div className="text-center py-2">
                <div className="font-pixel text-red-400 text-[10px] mb-1">對手試舉中...</div>
                <div className="font-vt text-white text-sm">{showingOpp.flag} {showingOpp.name} — {showingOpp.weight}kg</div>
                {oppPhase!=='lifting'&&(
                  <div className={`font-pixel text-sm mt-1 ${showingOpp.success?'text-pixel-green':'text-pixel-red'}`}>
                    {showingOpp.success?'Good Lift!':'No Lift.'}
                  </div>
                )}
              </div>
            ):(
              <>
                {/* Opponent flash results */}
                {oppFlash&&(
                  <div className="flex gap-1 justify-center mb-1.5 slide-up">
                    {oppFlash.map((o,i)=>(
                      <div key={i} className={`px-1.5 py-0.5 rounded border font-vt text-xs ${o.success?'border-pixel-green text-pixel-green':'border-pixel-red text-pixel-red'} bg-pixel-dark`}>
                        {o.flag} {o.name} {o.weight}kg {o.success?'✓':'✗'}
                      </div>
                    ))}
                  </div>
                )}
                {/* Weight selector */}
                <div className="flex items-center gap-1.5 mb-2">
                  <button onClick={()=>{sfx('tap');setWt(w=>Math.max(20,w-5))}} className="pixel-btn bg-pixel-dark text-pixel-light px-2 py-1 font-vt text-base">-5</button>
                  <button onClick={()=>{sfx('tap');setWt(w=>Math.max(20,w-1))}} className="pixel-btn bg-pixel-dark text-pixel-light px-2 py-1 font-vt text-base">-1</button>
                  <div className="flex-1 text-center">
                    <span className="font-pixel text-pixel-gold text-sm">{wt}kg</span>
                    <span className={`font-vt text-sm ml-2 ${rate>=70?'text-pixel-green':rate>=40?'text-pixel-orange':'text-pixel-red'}`}>
                      成功率{rate}%
                    </span>
                    {prinBonus>0&&<span className="font-vt text-pixel-cyan text-xs ml-1">+{prinBonus.toFixed(1)}</span>}
                  </div>
                  <button onClick={()=>{sfx('tap');setWt(w=>w+1)}} className="pixel-btn bg-pixel-dark text-pixel-light px-2 py-1 font-vt text-base">+1</button>
                  <button onClick={()=>{sfx('tap');setWt(w=>w+5)}} className="pixel-btn bg-pixel-dark text-pixel-light px-2 py-1 font-vt text-base">+5</button>
                </div>
                <button onClick={startAttempt} className="w-full pixel-btn pixel-btn-gold bg-pixel-dark text-pixel-gold py-2 text-[10px] font-pixel mb-2">
                  💪 開始試舉！
                </button>
              </>
            )}

            {/* Attempt record */}
            <div className="flex gap-1.5">
              {[0,1,2].map(i=>{
                const a=atts[lift][i];
                return(
                  <div key={i} className={`flex-1 text-center font-vt text-sm border-2 py-0.5
                    ${!a?'border-pixel-gray text-pixel-gray':a.success?(a.perfect?'border-pixel-gold text-pixel-gold':'border-pixel-green text-pixel-green'):'border-pixel-red text-pixel-red'}`}>
                    {a?`${a.weight}kg ${a.success?(a.perfect?'★':'✓'):'✗'}`:`第${i+1}把`}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RESULT with Podium Animation
  if(phase==='result'){
    const{mySn,myCJ,myT,all,rank}=getFinal();
    const me=rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':'';
    const prize=rank<=3?Math.round(ev.prize*(4-rank)/3):50;
    const isOG=rank===1&&ev.id===6;
    const pGold=all[0]||{};const pSilver=all[1]||{};const pBronze=all[2]||{};

    function PodiumChar({entry,delay}){
      if(!entry||!entry.name)return null;
      const isP=!!entry.isPlayer;
      const cha=CHARACTERS.find(x=>x.id===c.avatar)||CHARACTERS[0];
      const bodyCol=isP?cha.bodyColor:'#566c86';
      const headCol=isP?(cha.accentColor||'#f4f4f4'):'#94b0c2';
      const label=entry.name.length>10?entry.name.slice(0,9)+'..':entry.name;
      return(
        <g style={{animation:`podiumRise 0.6s ease-out ${delay}s both`}}>
          <circle cx="0" cy="-28" r="12" fill={headCol} stroke={isP?'#f4d03f':'#333c57'} strokeWidth="2"/>
          <circle cx="-4" cy="-30" r={isP?2:1.5} fill={isP?'#333':'#333c57'}/>
          <circle cx="4" cy="-30" r={isP?2:1.5} fill={isP?'#333':'#333c57'}/>
          <rect x="-10" y="-16" width="20" height="24" rx="3" fill={bodyCol} stroke={isP?'#f4d03f':'#333c57'} strokeWidth="1.5"/>
          <rect x="-6" y="8" width="5" height="10" rx="2" fill={bodyCol}/>
          <rect x="1" y="8" width="5" height="10" rx="2" fill={bodyCol}/>
          <text x="0" y="28" textAnchor="middle" fill="#f4f4f4" fontSize="9">{entry.flag||''}</text>
          <text x="0" y="38" textAnchor="middle" fill={isP?'#f4d03f':'#94b0c2'} fontSize="6" fontFamily="VT323,monospace">{label}</text>
        </g>
      );
    }
    function PodiumSVG(){
      return(
        <svg viewBox="0 0 320 230" className="w-full max-w-sm mx-auto" style={{overflow:'visible'}}>
          {Array.from({length:18},(_,i)=><circle key={`cr${i}`} cx={16+i*17} cy={12+Math.sin(i*1.2)*6} r="4" fill="#333c57" opacity=".4"/>)}
          <g style={{animation:'podiumRise 0.6s ease-out 0.15s both'}}><rect x="216" y="160" width="85" height="40" fill="#ef7d57" stroke="#b13e53" strokeWidth="2" rx="2"/><text x="258" y="186" textAnchor="middle" fill="#1a1c2c" fontSize="18" fontWeight="bold" fontFamily="Press Start 2P,monospace">3</text></g>
          <g style={{animation:'podiumRise 0.6s ease-out 0.3s both'}}><rect x="20" y="145" width="85" height="55" fill="#94b0c2" stroke="#566c86" strokeWidth="2" rx="2"/><text x="62" y="180" textAnchor="middle" fill="#1a1c2c" fontSize="18" fontWeight="bold" fontFamily="Press Start 2P,monospace">2</text></g>
          <g style={{animation:'podiumRise 0.6s ease-out 0.6s both'}}><rect x="118" y="125" width="85" height="75" fill="#f4d03f" stroke="#c8a415" strokeWidth="2" rx="2"/><text x="160" y="172" textAnchor="middle" fill="#1a1c2c" fontSize="18" fontWeight="bold" fontFamily="Press Start 2P,monospace">1</text></g>
          <g transform="translate(62,145)"><PodiumChar entry={pSilver} delay={0.8}/></g>
          <g transform="translate(160,125)"><PodiumChar entry={pGold} delay={1.1}/></g>
          <g transform="translate(258,160)"><PodiumChar entry={pBronze} delay={0.7}/></g>
          <text x="62" y="75" textAnchor="middle" fontSize="16" style={{animation:'podiumRise 0.6s ease-out 1.3s both, float 2s ease-in-out 2s infinite'}}>🥈</text>
          <text x="160" y="48" textAnchor="middle" fontSize="22" style={{animation:'podiumRise 0.6s ease-out 1.5s both, float 2s ease-in-out 2s infinite'}}>🥇</text>
          <text x="258" y="92" textAnchor="middle" fontSize="14" style={{animation:'podiumRise 0.6s ease-out 1.2s both, float 2s ease-in-out 2s infinite'}}>🥉</text>
          <line x1="10" y1="200" x2="310" y2="200" stroke="#566c86" strokeWidth="2"/>
        </svg>
      );
    }

    return(
      <div className="h-screen bg-pixel-dark flex flex-col overflow-auto">
        <div className="max-w-lg mx-auto">
          <div className={`pixel-border-gold bg-pixel-charcoal p-5 mb-3 text-center ${isOG?'glow':''}`}>
            {isOG&&<div className="font-pixel text-pixel-gold text-sm mb-3 blink">🏆 恭喜！你是奧運金牌得主！！！🏆</div>}
            <h2 className="font-pixel text-pixel-gold text-[10px] mb-2">{ev.emoji} {ev.name}</h2>
            {rank<=3?(
              <div>
                <div className="mb-3" style={{minHeight:180}}><PodiumSVG/></div>
                <div className={`text-5xl mb-2 ${rank===1?'medal-spin':''}`} style={{animation:'podiumRise 0.5s ease-out 1.8s both'}}>{me}</div>
                <div className="font-pixel text-2xl mb-2" style={{color:rank===1?'#f4d03f':rank===2?'#94b0c2':rank===3?'#ef7d57':'#566c86',animation:'podiumRise 0.5s ease-out 2s both'}}>
                  第 {rank} 名{rank===1?' 🎉':''}
                </div>
              </div>
            ):(
              <div>
                <div className="font-pixel text-xl mb-2 text-pixel-gray" style={{animation:'podiumRise 0.5s ease-out 0.3s both'}}>第 {rank} 名</div>
                <div className="font-vt text-pixel-cyan text-lg mb-3" style={{animation:'podiumRise 0.5s ease-out 0.6s both'}}>繼續努力！下次一定能站上頒獎台！💪</div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 font-vt text-center mb-3" style={{animation:'podiumRise 0.5s ease-out 2.2s both'}}>
              {[['抓舉',mySn],['挺舉',myCJ],['總和',myT]].map(([n,v])=>(
                <div key={n}><div className="text-pixel-gray text-xs">{n}</div><div className="text-pixel-gold text-2xl">{v||0}<span className="text-sm">kg</span></div></div>
              ))}
            </div>
            <div className="font-vt text-pixel-orange text-xl mb-2">💰 +{prize}</div>
            {rank===1&&ev.id>c.eventLevel&&<div className="font-vt text-pixel-cyan text-lg blink">🔓 解鎖新賽事！</div>}
            {isOG&&<div className="font-vt text-pixel-gold text-base mt-2">🌟 從新手到奧運冠軍！近、快、低、準、穩 — 你做到了！🌟</div>}
          </div>
          <div className="pixel-border bg-pixel-charcoal p-2 mb-3" style={{animation:'podiumRise 0.5s ease-out 2.4s both'}}>
            <div className="font-pixel text-pixel-light text-[9px] mb-1">📊 排行榜</div>
            {all.slice(0,8).map((r,i)=>(
              <div key={i} className={`flex justify-between font-vt text-sm px-2 py-0.5 ${r.isPlayer?'bg-pixel-darkblue text-pixel-gold':'text-pixel-light'}`}>
                <span>#{i+1} {r.flag?r.flag+' ':''}{r.name}</span><span>{r.total}kg</span>
              </div>
            ))}
          </div>
          <button onClick={()=>{sfx('click');claim()}} className="w-full pixel-btn pixel-btn-gold bg-pixel-dark text-pixel-gold py-2.5 text-[10px] font-pixel" style={{animation:'podiumRise 0.5s ease-out 2.6s both'}}>確認 →</button>
        </div>
      </div>
    );
  }
  return null;
}
