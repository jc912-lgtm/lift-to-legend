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

    advanceAttempt(success);
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
            <span className="font-pixel text-white text-[8px] bg-black bg-opacity-40 px-2 py-0.5 rounded">{liftName} {aN+1}/3</span>
            <span className="font-pixel text-pixel-gold text-[9px] bg-black bg-opacity-40 px-2 py-0.5 rounded">{wt}kg</span>
          </div>
          <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="stageWall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8d5b0"/><stop offset="100%" stopColor="#d4b896"/>
              </linearGradient>
              <linearGradient id="platformG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff9800"/><stop offset="100%" stopColor="#e65100"/>
              </linearGradient>
              <filter id="ds"><feDropShadow dx="1" dy="2" stdDeviation="1.5" floodOpacity=".25"/></filter>
            </defs>

            {/* Background wall */}
            <rect x="0" y="0" width="400" height="200" fill="url(#stageWall)"/>
            {/* Wall stripes */}
            <rect x="0" y="0" width="20" height="200" fill="#2e7d32" opacity=".8"/>
            <rect x="380" y="0" width="20" height="200" fill="#2e7d32" opacity=".8"/>
            <rect x="40" y="10" width="320" height="10" rx="3" fill="#1565c0" opacity=".15"/>

            {/* Banner */}
            <rect x="100" y="5" width="200" height="28" rx="4" fill="#1a237e"/>
            <text x="200" y="24" textAnchor="middle" fill="#ffd740" fontSize="14" fontWeight="bold" fontFamily="sans-serif">{ev.name}</text>

            {/* Side audience (left) */}
            {[0,1,2,3].map(i=>(
              <React.Fragment key={`al${i}`}>
                <circle cx={35} cy={60+i*30} r="6" fill={['#e57373','#64b5f6','#81c784','#ce93d8'][i]} opacity=".5"/>
                <rect x={30} y={64+i*30} width="10" height="12" rx="3" fill={['#e57373','#64b5f6','#81c784','#ce93d8'][i]} opacity=".4"/>
              </React.Fragment>
            ))}
            {/* Side audience (right) */}
            {[0,1,2,3].map(i=>(
              <React.Fragment key={`ar${i}`}>
                <circle cx={365} cy={60+i*30} r="6" fill={['#fff176','#80deea','#ef9a9a','#a5d6a7'][i]} opacity=".5"/>
                <rect x={360} y={64+i*30} width="10" height="12" rx="3" fill={['#fff176','#80deea','#ef9a9a','#a5d6a7'][i]} opacity=".4"/>
              </React.Fragment>
            ))}

            {/* Green floor */}
            <rect x="0" y="200" width="400" height="120" fill="#2e7d32"/>
            {/* Platform (orange circle/rectangle) */}
            <ellipse cx="200" cy="250" rx="130" ry="30" fill="url(#platformG)" stroke="#bf360c" strokeWidth="2"/>
            <ellipse cx="200" cy="248" rx="120" ry="25" fill="#ff9800" opacity=".3"/>

            {/* ═══ LIFTER CHARACTER (cartoon) ═══ */}
            <g transform="translate(200,165)" filter="url(#ds)">
              {liftPose==='ready'&&<>
                {/* Standing ready pose */}
                <rect x="-22" y="20" width="44" height="45" rx="8" fill="#1565c0"/>
                <line x1="-15" y1="20" x2="-20" y2="-5" stroke="#1565c0" strokeWidth="5" strokeLinecap="round"/>
                <line x1="15" y1="20" x2="20" y2="-5" stroke="#1565c0" strokeWidth="5" strokeLinecap="round"/>
                <ellipse cx="0" cy="-15" rx="22" ry="20" fill="#ffcc80"/>
                <ellipse cx="0" cy="-28" rx="20" ry="10" fill="#37474f"/>
                <ellipse cx="-8" cy="-14" rx="4" ry="5" fill="white"/><ellipse cx="-8" cy="-13" rx="2.5" ry="3" fill="#263238"/>
                <ellipse cx="8" cy="-14" rx="4" ry="5" fill="white"/><ellipse cx="8" cy="-13" rx="2.5" ry="3" fill="#263238"/>
                <path d="M-5,0 Q0,6 5,0" stroke="#c62828" strokeWidth="1.5" fill="#ef5350"/>
                <ellipse cx="-15" cy="-2" rx="5" ry="3" fill="#ef9a9a" opacity=".4"/>
                <ellipse cx="15" cy="-2" rx="5" ry="3" fill="#ef9a9a" opacity=".4"/>
                <path d="M-12,65 Q-18,80 -25,85" stroke="#263238" strokeWidth="12" fill="none" strokeLinecap="round"/>
                <path d="M12,65 Q18,80 25,85" stroke="#263238" strokeWidth="12" fill="none" strokeLinecap="round"/>
                <rect x="-30" y="82" width="18" height="10" rx="3" fill="#1e88e5"/>
                <rect x="12" y="82" width="18" height="10" rx="3" fill="#1e88e5"/>
                <path d="M-20,-5 Q-25,20 -20,40" stroke="#ffcc80" strokeWidth="10" fill="none" strokeLinecap="round"/>
                <path d="M20,-5 Q25,20 20,40" stroke="#ffcc80" strokeWidth="10" fill="none" strokeLinecap="round"/>
              </>}

              {(liftPose==='jerkReady'||liftPose==='jerkLifting')&&<>
                {/* Jerk phase — barbell at shoulder height */}
                {/* Barbell at shoulders */}
                <g transform="translate(0,-25)">
                  <rect x="-90" y="-3" width="180" height="5" rx="2" fill="#b0bec5" stroke="#78909c" strokeWidth="1"/>
                  <rect x="-98" y="-16" width="12" height="32" rx="3" fill="#ef5350" stroke="#c62828" strokeWidth="1"/>
                  <rect x="-88" y="-12" width="8" height="24" rx="2" fill="#42a5f5" stroke="#1565c0" strokeWidth="1"/>
                  <rect x="86" y="-16" width="12" height="32" rx="3" fill="#ef5350" stroke="#c62828" strokeWidth="1"/>
                  <rect x="80" y="-12" width="8" height="24" rx="2" fill="#42a5f5" stroke="#1565c0" strokeWidth="1"/>
                </g>
                {/* Arms holding bar at shoulder */}
                <path d="M-18,-10 Q-30,-20 -40,-25" stroke="#ffcc80" strokeWidth="10" fill="none" strokeLinecap="round"/>
                <path d="M18,-10 Q30,-20 40,-25" stroke="#ffcc80" strokeWidth="10" fill="none" strokeLinecap="round"/>
                <circle cx="-42" cy="-27" r="6" fill="#ffcc80"/>
                <circle cx="42" cy="-27" r="6" fill="#ffcc80"/>
                {/* Body (singlet) */}
                <rect x="-22" y="-5" width="44" height="40" rx="8" fill="#1565c0"/>
                <rect x="-8" y="8" width="16" height="10" rx="2" fill="#0d47a1"/>
                <text x="0" y="16" textAnchor="middle" fill="#ffd740" fontSize="6" fontWeight="bold" fontFamily="sans-serif">TPE</text>
                {/* Belt */}
                <rect x="-24" y="28" width="48" height="8" rx="3" fill="#5d4037"/>
                <rect x="-3" y="29" width="6" height="6" rx="1" fill="#ffd740"/>
                {/* Head */}
                <ellipse cx="0" cy="-22" rx="20" ry="18" fill="#ffcc80"/>
                <ellipse cx="0" cy="-34" rx="18" ry="9" fill="#37474f"/>
                <rect x="-19" y="-28" width="38" height="4" rx="2" fill="#ef5350"/>
                {/* Focused face */}
                <ellipse cx="-8" cy="-19" rx="4" ry="4.5" fill="white"/>
                <ellipse cx="-8" cy="-18" rx="2.5" ry="3" fill="#263238"/>
                <ellipse cx="8" cy="-19" rx="4" ry="4.5" fill="white"/>
                <ellipse cx="8" cy="-18" rx="2.5" ry="3" fill="#263238"/>
                <rect x="-5" y="-10" width="10" height="4" rx="2" fill="#263238"/>
                <ellipse cx="-14" cy="-12" rx="5" ry="3" fill="#ef9a9a" opacity=".45"/>
                <ellipse cx="14" cy="-12" rx="5" ry="3" fill="#ef9a9a" opacity=".45"/>
                {/* Sweat */}
                {liftPose==='jerkLifting'&&<ellipse cx="22" cy="-20" rx="3" ry="5" fill="#bbdefb" opacity=".7"/>}
                {/* Legs (slightly bent for jerk dip) */}
                <path d="M-10,35 Q-18,55 -25,68" stroke="#263238" strokeWidth="12" fill="none" strokeLinecap="round"/>
                <path d="M10,35 Q18,55 25,68" stroke="#263238" strokeWidth="12" fill="none" strokeLinecap="round"/>
                <rect x="-33" y="63" width="20" height="10" rx="4" fill="#1e88e5"/>
                <rect x="13" y="63" width="20" height="10" rx="4" fill="#1e88e5"/>
                {/* Clean check indicator */}
                <text x="0" y="-50" textAnchor="middle" fill="#38b764" fontSize="11" fontWeight="bold" fontFamily="sans-serif">CLEAN ✓</text>
              </>}

              {(liftPose==='lifting'||liftPose==='success')&&<>
                {/* Overhead lift pose — arms up, squat */}
                {/* Barbell */}
                <g transform="translate(0,-75)">
                  <rect x="-90" y="-3" width="180" height="5" rx="2" fill="#b0bec5" stroke="#78909c" strokeWidth="1"/>
                  <rect x="-98" y="-16" width="12" height="32" rx="3" fill="#ef5350" stroke="#c62828" strokeWidth="1"/>
                  <rect x="-88" y="-12" width="8" height="24" rx="2" fill="#42a5f5" stroke="#1565c0" strokeWidth="1"/>
                  <rect x="86" y="-16" width="12" height="32" rx="3" fill="#ef5350" stroke="#c62828" strokeWidth="1"/>
                  <rect x="80" y="-12" width="8" height="24" rx="2" fill="#42a5f5" stroke="#1565c0" strokeWidth="1"/>
                </g>
                {/* Arms reaching up */}
                <path d="M-18,-10 Q-35,-45 -50,-73" stroke="#ffcc80" strokeWidth="10" fill="none" strokeLinecap="round"/>
                <path d="M18,-10 Q35,-45 50,-73" stroke="#ffcc80" strokeWidth="10" fill="none" strokeLinecap="round"/>
                <circle cx="-52" cy="-75" r="6" fill="#ffcc80"/>
                <circle cx="52" cy="-75" r="6" fill="#ffcc80"/>
                {/* Body (singlet) */}
                <rect x="-22" y="-5" width="44" height="40" rx="8" fill="#1565c0"/>
                <rect x="-8" y="8" width="16" height="10" rx="2" fill="#0d47a1"/>
                <text x="0" y="16" textAnchor="middle" fill="#ffd740" fontSize="6" fontWeight="bold" fontFamily="sans-serif">TPE</text>
                {/* Belt */}
                <rect x="-24" y="28" width="48" height="8" rx="3" fill="#5d4037"/>
                <rect x="-3" y="29" width="6" height="6" rx="1" fill="#ffd740"/>
                {/* Head */}
                <ellipse cx="0" cy="-22" rx="20" ry="18" fill="#ffcc80"/>
                <ellipse cx="0" cy="-34" rx="18" ry="9" fill="#37474f"/>
                <rect x="-19" y="-28" width="38" height="4" rx="2" fill="#ef5350"/>
                {/* Determined face */}
                <line x1="-14" y1="-26" x2="-5" y2="-24" stroke="#37474f" strokeWidth="2" strokeLinecap="round"/>
                <line x1="5" y1="-24" x2="14" y2="-26" stroke="#37474f" strokeWidth="2" strokeLinecap="round"/>
                <ellipse cx="-8" cy="-19" rx="4" ry={liftPose==='success'?'2':'4.5'} fill="white"/>
                <ellipse cx="-8" cy={liftPose==='success'?'-19':'-18'} rx="2.5" ry={liftPose==='success'?'1.5':'3'} fill="#263238"/>
                <ellipse cx="8" cy="-19" rx="4" ry={liftPose==='success'?'2':'4.5'} fill="white"/>
                <ellipse cx="8" cy={liftPose==='success'?'-19':'-18'} rx="2.5" ry={liftPose==='success'?'1.5':'3'} fill="#263238"/>
                {liftPose==='success'?
                  <path d="M-8,-8 Q0,2 8,-8" stroke="#c62828" strokeWidth="2" fill="#ef5350"/>:
                  <rect x="-5" y="-10" width="10" height="4" rx="2" fill="#263238"/>
                }
                <ellipse cx="-14" cy="-12" rx="5" ry="3" fill="#ef9a9a" opacity=".45"/>
                <ellipse cx="14" cy="-12" rx="5" ry="3" fill="#ef9a9a" opacity=".45"/>
                {/* Sweat */}
                {liftPose==='lifting'&&<ellipse cx="22" cy="-20" rx="3" ry="5" fill="#bbdefb" opacity=".7"/>}
                {/* Legs (squat) */}
                <path d="M-10,35 Q-22,55 -30,65" stroke="#263238" strokeWidth="12" fill="none" strokeLinecap="round"/>
                <path d="M10,35 Q22,55 30,65" stroke="#263238" strokeWidth="12" fill="none" strokeLinecap="round"/>
                <rect x="-38" y="60" width="20" height="10" rx="4" fill="#1e88e5"/>
                <rect x="18" y="60" width="20" height="10" rx="4" fill="#1e88e5"/>
                {/* Success sparkles */}
                {liftPose==='success'&&<>
                  <polygon points="-40,-50 -37,-58 -34,-50 -37,-53" fill="#ffd740"/>
                  <polygon points="40,-55 43,-63 46,-55 43,-58" fill="#ffd740"/>
                  <circle cx="-55" cy="-30" r="3" fill="#ffd740" opacity=".6"/>
                  <circle cx="55" cy="-35" r="3" fill="#ffd740" opacity=".6"/>
                </>}
              </>}

              {liftPose==='fail'&&<>
                {/* Failed lift — barbell dropped, sad face */}
                {/* Barbell on ground */}
                <g transform="translate(0,60)">
                  <rect x="-80" y="-2" width="160" height="5" rx="2" fill="#b0bec5"/>
                  <rect x="-88" y="-14" width="12" height="28" rx="3" fill="#ef5350" opacity=".7"/>
                  <rect x="76" y="-14" width="12" height="28" rx="3" fill="#ef5350" opacity=".7"/>
                </g>
                {/* Standing sad */}
                <rect x="-22" y="5" width="44" height="42" rx="8" fill="#1565c0"/>
                {/* Head */}
                <ellipse cx="0" cy="-12" rx="20" ry="18" fill="#ffcc80"/>
                <ellipse cx="0" cy="-24" rx="18" ry="9" fill="#37474f"/>
                {/* Sad eyes */}
                <ellipse cx="-8" cy="-10" rx="4" ry="3" fill="white"/>
                <ellipse cx="-8" cy="-9" rx="2" ry="2" fill="#263238"/>
                <ellipse cx="8" cy="-10" rx="4" ry="3" fill="white"/>
                <ellipse cx="8" cy="-9" rx="2" ry="2" fill="#263238"/>
                <line x1="-12" y1="-17" x2="-4" y2="-15" stroke="#37474f" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4" y1="-15" x2="12" y2="-17" stroke="#37474f" strokeWidth="2" strokeLinecap="round"/>
                <path d="M-6,0 Q0,-4 6,0" stroke="#795548" strokeWidth="1.5" fill="none"/>
                {/* Arms down */}
                <path d="M-20,10 Q-28,30 -22,45" stroke="#ffcc80" strokeWidth="10" fill="none" strokeLinecap="round"/>
                <path d="M20,10 Q28,30 22,45" stroke="#ffcc80" strokeWidth="10" fill="none" strokeLinecap="round"/>
                {/* Legs */}
                <path d="M-8,47 L-12,70" stroke="#263238" strokeWidth="12" fill="none" strokeLinecap="round"/>
                <path d="M8,47 L12,70" stroke="#263238" strokeWidth="12" fill="none" strokeLinecap="round"/>
                <rect x="-20" y="66" width="18" height="9" rx="3" fill="#1e88e5"/>
                <rect x="3" y="66" width="18" height="9" rx="3" fill="#1e88e5"/>
                {/* Dizzy stars */}
                <text x="-18" y="-30" fontSize="10" opacity=".7">💫</text>
                <text x="12" y="-33" fontSize="8" opacity=".5">💫</text>
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
            <div className="bg-pixel-dark bg-opacity-70 px-4 py-1 rounded border-2 border-pixel-gold">
              <span className="font-pixel text-pixel-gold text-sm">{wt}kg</span>
            </div>
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
