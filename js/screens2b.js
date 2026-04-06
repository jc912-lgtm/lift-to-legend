function PoolScreen({c,setC,go}){
  const maxShots=3;
  const[phase,setPhase]=useState('aim'); // aim, power, animate, result, done
  const[angle,setAngle]=useState(30);
  const[power,setPower]=useState(0);
  const[shots,setShots]=useState(0);
  const[earned,setEarned]=useState(0);
  const[cuePos,setCuePos]=useState({x:120,y:126});
  const[targetPos,setTargetPos]=useState({x:240,y:100});
  const[targetColor,setTargetColor]=useState('#e53935');
  const[targetVisible,setTargetVisible]=useState(true);
  const[animCue,setAnimCue]=useState(null);
  const[animTarget,setAnimTarget]=useState(null);
  const[result,setResult]=useState(null);
  const[floats,setFloats]=useState(null);
  const[neonFrame,setNeonFrame]=useState(0);
  const[pocketEffect,setPocketEffect]=useState(null);
  const powerRef=useRef(0);
  const phaseRef=useRef('aim');
  const holdRef=useRef(null);

  const BALL_R=7;
  const POCKET_R=13;
  const pockets=[
    {x:76,y:49},{x:200,y:47},{x:324,y:49},
    {x:76,y:203},{x:200,y:205},{x:324,y:203}
  ];
  const TABLE={left:80,right:320,top:53,bottom:199};
  const BALL_COLORS=['#e53935','#2196f3','#ff9800','#9c27b0','#ffeb3b','#4caf50','#f06292','#00bcd4'];

  function randTarget(){
    const x=130+Math.random()*150;
    const y=70+Math.random()*110;
    const col=BALL_COLORS[Math.floor(Math.random()*BALL_COLORS.length)];
    return{x,y,col};
  }

  // Neon sign flicker
  useEffect(()=>{const t=setInterval(()=>setNeonFrame(f=>(f+1)%40),120);return()=>clearInterval(t)},[]);

  // Power meter oscillation
  useEffect(()=>{
    if(phase!=='power')return;
    let p=0,d=1;
    const speed=1.6;
    const tick=()=>{
      p+=d*speed;
      if(p>=100){p=100;d=-1;}
      if(p<=0){p=0;d=1;}
      powerRef.current=p;
      setPower(p);
    };
    const id=setInterval(tick,20);
    return()=>clearInterval(id);
  },[phase]);

  // Keep phase ref in sync
  useEffect(()=>{phaseRef.current=phase;},[phase]);

  function adjustAngle(delta){
    if(phaseRef.current!=='aim')return;
    sfx('tap');
    setAngle(a=>{
      let na=(a+delta)%360;
      if(na<0)na+=360;
      return na;
    });
  }

  function startHold(delta){
    adjustAngle(delta);
    holdRef.current=setInterval(()=>adjustAngle(delta),80);
  }
  function stopHold(){
    if(holdRef.current){clearInterval(holdRef.current);holdRef.current=null;}
  }

  function startShoot(){
    if(phase!=='aim')return;
    sfx('click');
    setPhase('power');
  }

  // Ray-circle intersection: find where aim line hits target ball
  function lineCircleHit(ox,oy,dx,dy,cx,cy,r){
    const fx=ox-cx,fy=oy-cy;
    const a=dx*dx+dy*dy;
    const b=2*(fx*dx+fy*dy);
    const cc=fx*fx+fy*fy-r*r;
    let disc=b*b-4*a*cc;
    if(disc<0)return null;
    disc=Math.sqrt(disc);
    const t=(-b-disc)/(2*a);
    if(t<0.01)return null;
    return t;
  }

  // Clamp position to table bounds
  function clampTable(x,y){
    return{
      x:Math.max(TABLE.left+BALL_R,Math.min(TABLE.right-BALL_R,x)),
      y:Math.max(TABLE.top+BALL_R,Math.min(TABLE.bottom-BALL_R,y))
    };
  }

  function handleShoot(){
    if(phase!=='power')return;
    const p=powerRef.current;
    setPhase('animate');

    const rad=angle*Math.PI/180;
    const dx=Math.cos(rad),dy=Math.sin(rad);
    const dist=Math.abs(p-50);
    const powerQuality=dist<10?'perfect':dist<22?'good':'bad';
    const speed=60+(p/100)*180;

    const hitT=lineCircleHit(cuePos.x,cuePos.y,dx,dy,targetPos.x,targetPos.y,BALL_R*2);

    const steps=50;
    let step=0;
    const cx0=cuePos.x,cy0=cuePos.y;
    const tx0=targetPos.x,ty0=targetPos.y;

    const cueMaxDist=hitT!==null?Math.min(hitT,speed):speed;
    const cueFX=cx0+dx*cueMaxDist;
    const cueFY=cy0+dy*cueMaxDist;
    const cueClamped=clampTable(cueFX,cueFY);

    let targetDx=0,targetDy=0,targetSpeed=0;
    if(hitT!==null&&hitT<=speed){
      const contactX=cx0+dx*hitT;
      const contactY=cy0+dy*hitT;
      const tdx=tx0-contactX;
      const tdy=ty0-contactY;
      const tlen=Math.sqrt(tdx*tdx+tdy*tdy)||1;
      targetDx=tdx/tlen;
      targetDy=tdy/tlen;
      const remaining=speed-hitT;
      targetSpeed=remaining*0.95+(powerQuality==='perfect'?20:powerQuality==='good'?10:0);
    }

    let pocketHit=null;
    let pocketDist=Infinity;
    if(hitT!==null&&hitT<=speed){
      for(let s=0;s<=targetSpeed;s+=2){
        const bx=tx0+targetDx*s;
        const by=ty0+targetDy*s;
        for(let pi=0;pi<pockets.length;pi++){
          const pdx=bx-pockets[pi].x;
          const pdy=by-pockets[pi].y;
          const pd=Math.sqrt(pdx*pdx+pdy*pdy);
          if(pd<POCKET_R&&s<pocketDist){pocketDist=s;pocketHit=pi;}
        }
      }
    }

    let targetFinalX=tx0+targetDx*targetSpeed;
    let targetFinalY=ty0+targetDy*targetSpeed;
    if(pocketHit!==null){
      targetFinalX=pockets[pocketHit].x;
      targetFinalY=pockets[pocketHit].y;
    }else if(hitT!==null&&hitT<=speed){
      const clamped=clampTable(targetFinalX,targetFinalY);
      targetFinalX=clamped.x;
      targetFinalY=clamped.y;
    }

    const animId=setInterval(()=>{
      step++;
      const t=Math.min(step/steps,1);

      if(hitT!==null&&hitT<=speed){
        const cueT=Math.min(t*2.2,1);
        const cueEase=1-Math.pow(1-cueT,3);
        setAnimCue({x:cx0+(cueClamped.x-cx0)*cueEase,y:cy0+(cueClamped.y-cy0)*cueEase});

        if(t>0.3){
          const targetT=Math.min((t-0.3)/0.7,1);
          const targetEase=1-Math.pow(1-targetT,2.5);
          setAnimTarget({x:tx0+(targetFinalX-tx0)*targetEase,y:ty0+(targetFinalY-ty0)*targetEase});
          if(pocketHit!==null&&targetT>0.9)setTargetVisible(false);
        }
      }else{
        const ease=1-Math.pow(1-t,2);
        setAnimCue({x:cx0+(cueClamped.x-cx0)*ease,y:cy0+(cueClamped.y-cy0)*ease});
      }

      if(step>=steps){
        clearInterval(animId);
        let label,money,stbGain;
        if(pocketHit!==null&&powerQuality==='perfect'){
          label='perfect';money=80;stbGain=2;
        }else if(pocketHit!==null){
          label='good';money=40;stbGain=1;
        }else{
          label='miss';money=0;stbGain=1;
        }

        if(pocketHit!==null)setPocketEffect(pockets[pocketHit]);

        setResult(label);
        setShots(s=>s+1);
        setEarned(m=>m+money);
        const fItems=[];
        if(money>0)fItems.push({icon:'💰',text:`+${money}`,color:'#f4d03f'});
        fItems.push({icon:'🧘',text:`穩定+${stbGain}`,color:'#38b764'});
        setFloats(fItems);
        setC(x=>({...x,
          money:x.money+money,
          stats:{...x.stats,stb:Math.min(100,x.stats.stb+stbGain)},
          fatigue:Math.max(0,x.fatigue-2)
        }));
        if(label==='perfect')sfx('perfect');
        else if(label==='good')sfx('coin');
        else sfx('fail');

        setCuePos(cueClamped);
        setPhase('result');
        setTimeout(()=>{
          const nextShots=shots+1;
          if(nextShots>=maxShots){
            setPhase('done');
          }else{
            const nt=randTarget();
            setTargetPos({x:nt.x,y:nt.y});
            setTargetColor(nt.col);
            setTargetVisible(true);
            setAnimCue(null);
            setAnimTarget(null);
            setResult(null);
            setPocketEffect(null);
            setAngle(30);
            setPhase('aim');
          }
        },1500);
      }
    },20);
  }

  // Computed values for rendering
  const rad=angle*Math.PI/180;
  const aimLen=180;
  const lineEndX=cuePos.x+Math.cos(rad)*aimLen;
  const lineEndY=cuePos.y+Math.sin(rad)*aimLen;

  const stickLen=55;
  const stickGap=9;
  const stickStartX=cuePos.x-Math.cos(rad)*stickGap;
  const stickStartY=cuePos.y-Math.sin(rad)*stickGap;
  const stickEndX=cuePos.x-Math.cos(rad)*(stickGap+stickLen);
  const stickEndY=cuePos.y-Math.sin(rad)*(stickGap+stickLen);
  const stickMidX=cuePos.x-Math.cos(rad)*(stickGap+stickLen*0.65);
  const stickMidY=cuePos.y-Math.sin(rad)*(stickGap+stickLen*0.65);

  function nearestPocketToAim(){
    let best=-1,bestD=Infinity;
    for(let i=0;i<pockets.length;i++){
      const px=pockets[i].x-cuePos.x;
      const py=pockets[i].y-cuePos.y;
      const proj=px*Math.cos(rad)+py*Math.sin(rad);
      if(proj<0)continue;
      const perpDist=Math.abs(-px*Math.sin(rad)+py*Math.cos(rad));
      if(perpDist<bestD){bestD=perpDist;best=i;}
    }
    return best;
  }

  function getPredictedPath(){
    const dx=Math.cos(rad),dy=Math.sin(rad);
    const hitT=lineCircleHit(cuePos.x,cuePos.y,dx,dy,targetPos.x,targetPos.y,BALL_R*2);
    if(hitT===null)return null;
    const contactX=cuePos.x+dx*hitT;
    const contactY=cuePos.y+dy*hitT;
    const tdx=targetPos.x-contactX;
    const tdy=targetPos.y-contactY;
    const tlen=Math.sqrt(tdx*tdx+tdy*tdy)||1;
    return{
      fromX:targetPos.x,fromY:targetPos.y,
      toX:targetPos.x+(tdx/tlen)*120,toY:targetPos.y+(tdy/tlen)*120,
      contactX,contactY
    };
  }

  const nearPocket=phase==='aim'?nearestPocketToAim():-1;
  const predicted=phase==='aim'?getPredictedPath():null;
  const displayCue=animCue||cuePos;
  const displayTarget=animTarget||targetPos;

  const neonOn=neonFrame%6<4;
  const neonGlow=neonFrame%12<8;

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-auto p-2 select-none">
      <div className="max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-4 py-1.5 text-[10px] font-pixel">← 返回</button>
          <div className="font-pixel text-pixel-gold text-[10px]">🎱 撞球館</div>
          <div className="font-vt text-pixel-light text-sm">球數: {shots}/{maxShots}</div>
        </div>

        {/* SVG Pool Hall Scene */}
        <div className="pixel-border bg-pixel-charcoal p-1 mb-2">
          <svg viewBox="0 0 400 250" className="w-full" style={{display:'block'}}>
            <defs>
              <radialGradient id="poolLamp" cx="50%" cy="0%" r="70%">
                <stop offset="0%" stopColor="#fff8e1" stopOpacity=".35"/>
                <stop offset="60%" stopColor="#ffecb3" stopOpacity=".1"/>
                <stop offset="100%" stopColor="#000" stopOpacity="0"/>
              </radialGradient>
              <filter id="neonGlow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <radialGradient id="ballShine" cx="35%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#fff" stopOpacity=".5"/>
                <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
              </radialGradient>
              <filter id="pocketGlow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Background — dark wood paneled walls */}
            <rect width="400" height="250" fill="#2c1810"/>
            {/* Wall panels */}
            <rect x="0" y="0" width="400" height="28" fill="#3e2723"/>
            <line x1="0" y1="28" x2="400" y2="28" stroke="#5d4037" strokeWidth="2"/>
            {/* Floor */}
            <rect x="0" y="222" width="400" height="28" fill="#1a120d"/>

            {/* Neon POOL sign */}
            <g transform="translate(310,8)" filter={neonGlow?"url(#neonGlow)":"none"} opacity={neonOn?1:0.3}>
              <text x="0" y="16" fontFamily="monospace" fontSize="14" fontWeight="bold" fill={neonOn?"#00e5ff":"#004d5c"} letterSpacing="2">POOL</text>
            </g>

            {/* Scoreboard on wall */}
            <rect x="20" y="4" width="50" height="20" rx="2" fill="#1a1a1a" stroke="#5d4037" strokeWidth="1"/>
            <text x="28" y="17" fontFamily="monospace" fontSize="8" fill="#4caf50">{String(earned).padStart(4,'0')}</text>

            {/* Overhead lamp */}
            <rect x="180" y="0" width="40" height="6" rx="2" fill="#555"/>
            <line x1="200" y1="6" x2="200" y2="20" stroke="#777" strokeWidth="1"/>
            <polygon points="180,20 220,20 235,32 165,32" fill="#8d6e63" stroke="#5d4037" strokeWidth="1"/>
            <rect x="165" y="32" width="70" height="200" fill="url(#poolLamp)"/>

            {/* Bar stools */}
            <g transform="translate(25,195)">
              <rect x="-6" y="8" width="12" height="22" rx="1" fill="#4e342e"/>
              <circle cx="0" cy="6" r="8" fill="#795548" stroke="#4e342e" strokeWidth="1.5"/>
            </g>
            <g transform="translate(375,195)">
              <rect x="-6" y="8" width="12" height="22" rx="1" fill="#4e342e"/>
              <circle cx="0" cy="6" r="8" fill="#795548" stroke="#4e342e" strokeWidth="1.5"/>
            </g>

            {/* === Pool Table === */}
            {/* Outer frame (wood) */}
            <rect x="55" y="28" width="290" height="196" rx="8" fill="#5d4037" stroke="#3e2723" strokeWidth="3"/>
            {/* Green felt */}
            <rect x="67" y="40" width="266" height="172" rx="4" fill="#1b5e20"/>
            {/* Inner rail line */}
            <rect x="76" y="49" width="248" height="154" rx="3" fill="none" stroke="#2e7d32" strokeWidth="2"/>

            {/* Pockets with highlight for nearest during aim */}
            {pockets.map((pk,i)=>
              <React.Fragment key={'pk'+i}>
                <circle cx={pk.x} cy={pk.y} r="9" fill="#0d0d0d"/>
                <circle cx={pk.x} cy={pk.y} r="9" fill="none" stroke="#333" strokeWidth="1.5"/>
                {phase==='aim'&&nearPocket===i&&
                  <circle cx={pk.x} cy={pk.y} r="11" fill="none" stroke="#f4d03f" strokeWidth="1.5" opacity="0.7" filter="url(#pocketGlow)"/>
                }
              </React.Fragment>
            )}

            {/* Diamond markers on rails */}
            {[120,160,240,280].map(x=><React.Fragment key={'dm'+x}>
              <circle cx={x} cy="44" r="1.5" fill="#c8a96e"/>
              <circle cx={x} cy="208" r="1.5" fill="#c8a96e"/>
            </React.Fragment>)}
            {[80,125].map(y=><React.Fragment key={'dms'+y}>
              <circle cx="71" cy={y} r="1.5" fill="#c8a96e"/>
              <circle cx="329" cy={y} r="1.5" fill="#c8a96e"/>
            </React.Fragment>)}

            {/* Aim line and predicted collision path (during aim phase) */}
            {phase==='aim'&&<>
              {/* Main aim line from cue ball */}
              <line x1={cuePos.x} y1={cuePos.y} x2={lineEndX} y2={lineEndY}
                stroke="#fff" strokeWidth="1" strokeDasharray="5,4" opacity="0.4"/>
              {/* Predicted target path after collision */}
              {predicted&&<>
                <line x1={cuePos.x} y1={cuePos.y} x2={predicted.contactX} y2={predicted.contactY}
                  stroke="#fff" strokeWidth="1.5" opacity="0.25"/>
                <line x1={predicted.fromX} y1={predicted.fromY} x2={predicted.toX} y2={predicted.toY}
                  stroke={targetColor} strokeWidth="1" strokeDasharray="4,3" opacity="0.5"/>
              </>}
            </>}

            {/* Target ball */}
            {targetVisible&&<>
              <circle cx={displayTarget.x} cy={displayTarget.y} r={BALL_R} fill={targetColor}/>
              <circle cx={displayTarget.x} cy={displayTarget.y} r={BALL_R} fill="url(#ballShine)"/>
            </>}

            {/* Cue ball */}
            <circle cx={displayCue.x} cy={displayCue.y} r={BALL_R} fill="#fafafa" stroke="#bbb" strokeWidth="1"/>
            <circle cx={displayCue.x} cy={displayCue.y} r={BALL_R} fill="url(#ballShine)"/>

            {/* Cue stick (visible during aim and power phases) */}
            {(phase==='aim'||phase==='power')&&<>
              <line x1={stickEndX} y1={stickEndY} x2={stickStartX} y2={stickStartY}
                stroke="#deb887" strokeWidth="3" strokeLinecap="round"/>
              <line x1={stickEndX} y1={stickEndY} x2={stickMidX} y2={stickMidY}
                stroke="#8d6e63" strokeWidth="3" strokeLinecap="round"/>
            </>}

            {/* Pocket-in effect */}
            {pocketEffect&&(result==='perfect'||result==='good')&&
              <circle cx={pocketEffect.x} cy={pocketEffect.y} r="12" fill="none"
                stroke={result==='perfect'?'#f4d03f':'#4caf50'} strokeWidth="2" opacity="0.7">
                <animate attributeName="r" from="8" to="18" dur="0.5s" repeatCount="2"/>
                <animate attributeName="opacity" from="0.8" to="0" dur="0.5s" repeatCount="2"/>
              </circle>
            }
          </svg>
        </div>

        {/* Game Controls */}
        <div className="pixel-border bg-pixel-charcoal p-3 mb-2">
          {phase==='aim'&&(
            <div className="text-center">
              <div className="font-vt text-pixel-cyan text-sm mb-2">瞄準方向，然後按擊球！</div>
              <div className="flex items-center justify-center gap-3 mb-3">
                <button
                  onMouseDown={()=>startHold(-3)} onMouseUp={stopHold} onMouseLeave={stopHold}
                  onTouchStart={e=>{e.preventDefault();startHold(-3);}} onTouchEnd={stopHold}
                  className="pixel-btn bg-pixel-blue text-pixel-white px-5 py-3 text-base font-pixel active:bg-pixel-darkblue"
                >◀ 左</button>
                <div className="font-vt text-pixel-gold text-lg w-16 text-center">{angle}°</div>
                <button
                  onMouseDown={()=>startHold(3)} onMouseUp={stopHold} onMouseLeave={stopHold}
                  onTouchStart={e=>{e.preventDefault();startHold(3);}} onTouchEnd={stopHold}
                  className="pixel-btn bg-pixel-blue text-pixel-white px-5 py-3 text-base font-pixel active:bg-pixel-darkblue"
                >右 ▶</button>
              </div>
              <button onClick={startShoot}
                className="pixel-btn bg-pixel-gold text-pixel-dark px-10 py-2.5 text-[11px] font-pixel">
                🎯 擊球！
              </button>
            </div>
          )}

          {phase==='power'&&(
            <div className="text-center">
              <div className="font-vt text-pixel-cyan text-sm mb-2">調整力道 — 正中間最佳！</div>
              {/* Power meter */}
              <div className="relative w-full h-8 bg-pixel-dark border-2 border-pixel-gray rounded overflow-hidden mb-3 cursor-pointer"
                onClick={handleShoot} onTouchStart={e=>{e.preventDefault();handleShoot();}}>
                {/* Sweet spot zone */}
                <div className="absolute h-full bg-green-900 opacity-40" style={{left:'35%',width:'30%'}}/>
                <div className="absolute h-full bg-green-700 opacity-40" style={{left:'40%',width:'20%'}}/>
                {/* Power indicator */}
                <div className="absolute top-0 h-full bg-pixel-gold transition-none" style={{width:'4px',left:`${power}%`}}/>
                {/* Center marker */}
                <div className="absolute top-0 h-full border-l-2 border-dashed border-pixel-green opacity-60" style={{left:'50%'}}/>
              </div>
              <div className="flex justify-between font-vt text-xs text-pixel-gray px-1">
                <span>弱</span><span className="text-pixel-green">最佳</span><span>強</span>
              </div>
              <button onClick={handleShoot}
                className="pixel-btn bg-pixel-gold text-pixel-dark px-10 py-2.5 text-[11px] font-pixel mt-2">
                💥 出杆！
              </button>
            </div>
          )}

          {phase==='animate'&&(
            <div className="text-center">
              <div className="font-vt text-pixel-light text-lg">⏳ ...</div>
            </div>
          )}

          {phase==='result'&&(
            <div className="text-center">
              {result==='perfect'&&<div className="font-pixel text-pixel-gold text-sm mb-1">🌟 Perfect Shot! +80💰 穩定+2</div>}
              {result==='good'&&<div className="font-pixel text-pixel-green text-sm mb-1">✅ Good Shot! +40💰 穩定+1</div>}
              {result==='miss'&&<div className="font-pixel text-pixel-red text-sm mb-1">😅 Miss... 穩定+1（練習也有收穫）</div>}
              <div className="font-vt text-pixel-gray text-xs mt-1">準備下一球...</div>
            </div>
          )}

          {phase==='done'&&(
            <div className="text-center">
              {result==='perfect'&&<div className="font-pixel text-pixel-gold text-sm mb-1">🌟 Perfect Shot! +80💰 穩定+2</div>}
              {result==='good'&&<div className="font-pixel text-pixel-green text-sm mb-1">✅ Good Shot! +40💰 穩定+1</div>}
              {result==='miss'&&<div className="font-pixel text-pixel-red text-sm mb-1">😅 Miss... 穩定+1</div>}
              <div className="mt-2">
                <div className="font-vt text-pixel-gold text-base mb-2">本次收入：{earned}💰</div>
                <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-green text-pixel-dark px-8 py-2 text-[10px] font-pixel">
                  ← 回去
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Session stats */}
        <div className="pixel-border bg-pixel-charcoal p-2 flex justify-between items-center">
          <div className="font-vt text-pixel-light text-sm">💰 本次：{earned}</div>
          <div className="font-vt text-pixel-light text-sm">🎱 {shots}/{maxShots} 球</div>
          <div className="font-vt text-pixel-light text-sm">💰 總額：{c.money}</div>
        </div>

        {floats&&<FloatingNum items={floats} onDone={()=>setFloats(null)}/>}
      </div>
    </div>
  );
}

// ── RESTAURANT ──
function RestaurantScreen({c,setC,go}){
  const MEALS=[
    {id:'rice',name:'滷肉飯',icon:'🍚',price:30,sta:20,bonus:null,desc:'便宜又好吃！'},
    {id:'noodle',name:'牛肉麵',icon:'🍜',price:60,sta:35,bonus:{str:1},desc:'濃郁湯頭補體力'},
    {id:'pasta',name:'義大利麵',icon:'🍝',price:80,sta:40,bonus:{tec:1},desc:'優雅的一餐'},
    {id:'pizza',name:'Pizza',icon:'🍕',price:70,sta:35,bonus:{stb:1},desc:'和朋友分享！'},
    {id:'steak',name:'牛排大餐',icon:'🥩',price:150,sta:60,bonus:{str:2,pwr:1},desc:'蛋白質滿滿！'},
    {id:'bento',name:'健身餐盒',icon:'🥗',price:100,sta:45,bonus:{sta:1,rec:1},desc:'低脂高蛋白！'},
  ];
  const ms=maxSta(c.stats.sta);
  const[ate,setAte]=useState(false);
  const[floats,setFloats]=useState(null);
  const[eatAnim,setEatAnim]=useState(null);
  const[chefWave,setChefWave]=useState(false);
  const[chefMsg,setChefMsg]=useState(null);
  const[frame,setFrame]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setFrame(f=>(f+1)%120),60);return()=>clearInterval(t)},[]);

  const chefDialogs=(()=>{
    const normal=['今日特餐喔！','吃飽才有力氣練！','我的手藝可是師傅傳的','要不要加大份？','營養均衡最重要','這道菜我最拿手！','香吧？都是新鮮食材','坐坐坐，馬上來！','老闆兼主廚，包你滿意','吃完記得給五星好評喔'];
    const tired=['你臉色不太好...先吃飯吧','累了就要好好吃一頓！','補充營養最重要'];
    const won=c.medals&&c.medals.length>0?['聽說你比賽得獎了？恭喜！','冠軍來吃飯，我請客！（開玩笑的）','以後簽名牆要掛你的照片！']:[];
    return(c.fatigue||0)>60?[...normal,...tired]:[...normal,...won];
  })();
  function clickChef(){
    sfx('tap');setChefMsg(chefDialogs[Math.floor(Math.random()*chefDialogs.length)]);
    setChefWave(true);setTimeout(()=>setChefWave(false),1200);
    setTimeout(()=>setChefMsg(null),2500);
  }

  const steamY1=Math.sin(frame*0.08)*4;
  const steamY2=Math.sin(frame*0.08+2)*4;
  const steamY3=Math.sin(frame*0.08+4)*4;
  const lightFlicker=0.7+Math.sin(frame*0.06)*0.15;

  function eatMeal(meal){
    if(ate||c.money<meal.price)return;
    sfx('coin');
    setEatAnim(meal.icon);
    setChefWave(true);
    setTimeout(()=>setChefWave(false),1500);
    setTimeout(()=>{
      setEatAnim(null);
      setAte(true);
      const fatDrop=5+Math.floor(Math.random()*6);
      const nc={...c,
        money:c.money-meal.price,
        stamina:Math.min(ms,c.stamina+meal.sta),
        fatigue:Math.max(0,c.fatigue-fatDrop),
        stats:{...c.stats}
      };
      const fItems=[
        {icon:'💰',text:`-${meal.price}`,color:'#ef5350'},
        {icon:'⚡',text:`+${meal.sta} 體力`,color:'#38b764'},
        {icon:'😌',text:`-${fatDrop} 疲勞`,color:'#64b5f6'},
      ];
      if(meal.bonus){
        const STAT_NAMES={str:'力量',tec:'技術',pwr:'爆發力',stb:'穩定性',sta:'體力',rec:'恢復'};
        const STAT_COLORS={str:'#ef5350',tec:'#42a5f5',pwr:'#ff9800',stb:'#ab47bc',sta:'#66bb6a',rec:'#26c6da'};
        Object.entries(meal.bonus).forEach(([k,v])=>{
          nc.stats[k]=Math.min(100,nc.stats[k]+v);
          fItems.push({icon:'⬆',text:`${STAT_NAMES[k]}+${v}`,color:STAT_COLORS[k]});
        });
      }
      setFloats(fItems);
      setC(nc);
    },1500);
  }

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-auto">
      <div className="max-w-lg mx-auto">
        {floats&&<FloatingNum items={floats} onDone={()=>setFloats(null)}/>}

        {/* Eat animation overlay */}
        {eatAnim&&(
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div style={{fontSize:'120px',animation:'popIn .6s cubic-bezier(.17,.67,.35,1.5) forwards, floatUp 1.5s ease-out .6s forwards'}}>
              {eatAnim}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-3 py-1 text-[10px] font-pixel">← 返回</button>
          <h2 className="font-pixel text-pixel-orange text-[10px]">🍜 餐廳</h2>
          <span className="font-vt text-pixel-orange text-lg">💰{c.money}</span>
        </div>

        {/* Stamina bar */}
        <div className="pixel-border bg-pixel-charcoal p-1.5 mb-2 flex items-center gap-2">
          <span className="font-vt text-pixel-light text-sm">⚡體力</span>
          <div className="flex-1 h-4 bg-pixel-dark border-2 border-pixel-gray overflow-hidden">
            <div className="h-full transition-all duration-500 bg-pixel-green" style={{width:`${Math.min(100,c.stamina/ms*100)}%`}}/>
          </div>
          <span className="font-vt text-pixel-green text-sm">{c.stamina}/{ms}</span>
        </div>

        {/* SVG Restaurant Scene */}
        <div className="pixel-border bg-pixel-charcoal mb-2 overflow-hidden">
          <svg viewBox="0 0 400 220" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="restWall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8d6e63"/>
                <stop offset="100%" stopColor="#5d4037"/>
              </linearGradient>
              <linearGradient id="restCounter" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a1887f"/>
                <stop offset="100%" stopColor="#6d4c41"/>
              </linearGradient>
              <radialGradient id="warmGlow1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffcc02" stopOpacity=".35"/>
                <stop offset="100%" stopColor="#ffcc02" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="warmGlow2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff9800" stopOpacity=".2"/>
                <stop offset="100%" stopColor="#ff9800" stopOpacity="0"/>
              </radialGradient>
            </defs>

            {/* Background wall */}
            <rect width="400" height="220" fill="url(#restWall)"/>

            {/* Warm ambient glow */}
            <ellipse cx="200" cy="60" rx="180" ry="80" fill="url(#warmGlow2)"/>

            {/* Wall decorations - wooden panels */}
            <rect x="10" y="10" width="380" height="5" rx="2" fill="#4e342e" opacity=".4"/>
            <rect x="10" y="90" width="380" height="3" rx="1" fill="#4e342e" opacity=".3"/>

            {/* Menu board left */}
            <rect x="30" y="20" width="70" height="55" rx="3" fill="#3e2723" stroke="#5d4037" strokeWidth="2"/>
            <rect x="34" y="25" width="62" height="4" rx="1" fill="#ff8a65" opacity=".8"/>
            <rect x="34" y="33" width="50" height="3" rx="1" fill="#fff9c4" opacity=".6"/>
            <rect x="34" y="40" width="55" height="3" rx="1" fill="#fff9c4" opacity=".6"/>
            <rect x="34" y="47" width="42" height="3" rx="1" fill="#fff9c4" opacity=".6"/>
            <rect x="34" y="54" width="58" height="3" rx="1" fill="#a5d6a7" opacity=".6"/>
            <rect x="34" y="61" width="48" height="3" rx="1" fill="#a5d6a7" opacity=".6"/>
            <text x="65" y="72" textAnchor="middle" fill="#ffcc80" fontSize="6" fontFamily="sans-serif">MENU</text>

            {/* Menu board right */}
            <rect x="300" y="20" width="70" height="55" rx="3" fill="#3e2723" stroke="#5d4037" strokeWidth="2"/>
            <rect x="304" y="25" width="62" height="4" rx="1" fill="#ff8a65" opacity=".8"/>
            <rect x="304" y="33" width="52" height="3" rx="1" fill="#fff9c4" opacity=".6"/>
            <rect x="304" y="40" width="58" height="3" rx="1" fill="#fff9c4" opacity=".6"/>
            <rect x="304" y="47" width="44" height="3" rx="1" fill="#fff9c4" opacity=".6"/>
            <rect x="304" y="54" width="56" height="3" rx="1" fill="#a5d6a7" opacity=".6"/>
            <rect x="304" y="61" width="50" height="3" rx="1" fill="#a5d6a7" opacity=".6"/>
            <text x="335" y="72" textAnchor="middle" fill="#ffcc80" fontSize="6" fontFamily="sans-serif">TODAY</text>

            {/* Hanging lights */}
            {[100,200,300].map((lx,i)=>(
              <React.Fragment key={`light${i}`}>
                <line x1={lx} y1="0" x2={lx} y2="15" stroke="#5d4037" strokeWidth="2"/>
                <ellipse cx={lx} cy="12" rx="18" ry="14" fill="url(#warmGlow1)" opacity={lightFlicker}/>
                <rect x={lx-8} y="12" width="16" height="10" rx="3" fill="#ffcc80" stroke="#f9a825" strokeWidth="1"/>
                <ellipse cx={lx} cy="17" rx="6" ry="4" fill="#fff8e1" opacity=".8"/>
              </React.Fragment>
            ))}

            {/* Counter/bar */}
            <rect x="40" y="95" width="320" height="25" rx="3" fill="url(#restCounter)" stroke="#4e342e" strokeWidth="2"/>
            <rect x="45" y="97" width="310" height="6" rx="2" fill="#bcaaa4" opacity=".3"/>

            {/* Items on counter */}
            <rect x="60" y="85" width="12" height="14" rx="2" fill="#e57373" opacity=".8"/>
            <rect x="100" y="87" width="10" height="12" rx="2" fill="#81c784" opacity=".8"/>
            <circle cx="140" cy="90" r="6" fill="#fff9c4" opacity=".7"/>
            <rect x="280" y="86" width="14" height="13" rx="2" fill="#90caf9" opacity=".7"/>
            <circle cx="320" cy="90" r="5" fill="#ffcc80" opacity=".8"/>

            {/* Chef character — clickable */}
            <g transform={`translate(200,72)${chefWave?' scale(1.05)':''}`} style={{transition:'transform 0.3s',cursor:'pointer'}} onClick={clickChef}>
              {/* Chef body/apron */}
              <rect x="-14" y="2" width="28" height="26" rx="5" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="1"/>
              {/* Apron strings */}
              <line x1="-8" y1="8" x2="-14" y2="14" stroke="#e0e0e0" strokeWidth="1.5"/>
              <line x1="8" y1="8" x2="14" y2="14" stroke="#e0e0e0" strokeWidth="1.5"/>
              {/* Face */}
              <circle cx="0" cy="-2" r="14" fill="#ffcc80" stroke="#f9a825" strokeWidth="1.5"/>
              {/* Chef hat */}
              <rect x="-12" y="-26" width="24" height="18" rx="4" fill="white" stroke="#e0e0e0" strokeWidth="1"/>
              <rect x="-14" y="-12" width="28" height="6" rx="2" fill="white" stroke="#e0e0e0" strokeWidth="1"/>
              <circle cx="0" cy="-22" r="4" fill="white"/>
              {/* Eyes */}
              <circle cx="-5" cy="-3" r="2.5" fill="#263238"/>
              <circle cx="5" cy="-3" r="2.5" fill="#263238"/>
              <circle cx="-4" cy="-4" r="1" fill="white"/>
              <circle cx="6" cy="-4" r="1" fill="white"/>
              {/* Smile */}
              <path d="M-5,4 Q0,9 5,4" stroke="#c62828" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              {/* Blush */}
              <ellipse cx="-10" cy="2" rx="4" ry="2.5" fill="#ef9a9a" opacity=".5"/>
              <ellipse cx="10" cy="2" rx="4" ry="2.5" fill="#ef9a9a" opacity=".5"/>
              {/* Waving arm */}
              <g transform={chefWave?'rotate(-20,14,14)':'rotate(0,14,14)'} style={{transition:'transform 0.3s'}}>
                <line x1="14" y1="14" x2="28" y2="4" stroke="#ffcc80" strokeWidth="6" strokeLinecap="round"/>
                <circle cx="28" cy="4" r="4" fill="#ffcc80"/>
              </g>
              {/* Other arm */}
              <line x1="-14" y1="14" x2="-24" y2="20" stroke="#ffcc80" strokeWidth="6" strokeLinecap="round"/>
              <circle cx="-24" cy="20" r="4" fill="#ffcc80"/>
            </g>

            {/* Steam from kitchen */}
            <g opacity=".5">
              <path d={`M170,${78+steamY1} Q175,${68+steamY1} 172,${58+steamY1} Q169,${48+steamY1} 174,${38+steamY1}`} stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".4"/>
              <path d={`M230,${80+steamY2} Q234,${70+steamY2} 228,${60+steamY2} Q224,${50+steamY2} 230,${40+steamY2}`} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".35"/>
              <path d={`M250,${76+steamY3} Q254,${66+steamY3} 248,${56+steamY3} Q244,${46+steamY3} 250,${36+steamY3}`} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".3"/>
            </g>

            {/* Chef speech bubble */}
            {chefMsg&&<g className="pop-in">
              <rect x="245" y="30" width={Math.min(chefMsg.length*8+16,150)} height="24" rx="6" fill="#fff" stroke="#ddd" strokeWidth="1"/>
              <polygon points="244,48 238,58 252,50" fill="#fff" stroke="#ddd" strokeWidth="1"/>
              <polygon points="245,48 240,56 252,50" fill="#fff"/>
              <text x="253" y="46" fontSize="9" fill="#333" fontFamily="sans-serif">{chefMsg}</text>
              {(c.fatigue||0)>60&&<text x="232" y="36" fontSize="8">💧</text>}
              {c.medals&&c.medals.length>0&&(c.fatigue||0)<=60&&<text x="232" y="36" fontSize="8">✨</text>}
            </g>}

            {/* Checkered floor */}
            {Array.from({length:14},(_,col)=>
              Array.from({length:4},(_,row)=>(
                <rect key={`tile${col}_${row}`} x={col*30} y={140+row*22} width="30" height="22"
                  fill={(col+row)%2===0?'#6d4c41':'#5d4037'} opacity=".7"/>
              ))
            ).flat()}

            {/* Foreground table */}
            <rect x="100" y="155" width="200" height="12" rx="3" fill="#8d6e63" stroke="#5d4037" strokeWidth="2"/>
            {/* Table legs */}
            <rect x="120" y="167" width="8" height="30" fill="#6d4c41"/>
            <rect x="272" y="167" width="8" height="30" fill="#6d4c41"/>
            {/* Tablecloth edge */}
            <rect x="98" y="153" width="204" height="6" rx="2" fill="#ef9a9a" opacity=".5"/>

            {/* Plate on table */}
            <ellipse cx="200" cy="152" rx="20" ry="8" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="1"/>
            <ellipse cx="200" cy="151" rx="15" ry="6" fill="#fafafa"/>
            {/* Utensils */}
            <rect x="168" y="146" width="2" height="16" rx="1" fill="#bdbdbd" transform="rotate(-15,169,154)"/>
            <rect x="230" y="146" width="2" height="16" rx="1" fill="#bdbdbd" transform="rotate(15,231,154)"/>

            {/* Napkin */}
            <rect x="240" y="148" width="12" height="12" rx="1" fill="#ef5350" opacity=".6" transform="rotate(10,246,154)"/>

            {ate&&(
              <text x="200" y="155" textAnchor="middle" fontSize="12">😋</text>
            )}
          </svg>
        </div>

        {/* Meal selection or post-eat message */}
        {ate?(
          <div className="pixel-border-gold bg-pixel-charcoal p-4 text-center slide-up">
            <div className="text-4xl mb-2">😋</div>
            <h3 className="font-pixel text-pixel-gold text-[10px] mb-2">吃飽了！</h3>
            <p className="font-vt text-pixel-light text-lg mb-3">美味的一餐，精神充沛！</p>
            <button onClick={()=>go('hub')} className="pixel-btn pixel-btn-gold bg-pixel-dark text-pixel-gold px-6 py-2 text-[10px] font-pixel">
              ← 回到地圖
            </button>
          </div>
        ):(
          <div>
            <h3 className="font-pixel text-pixel-gold text-[9px] mb-1.5 text-center">~ 今日菜單 ~</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {MEALS.map(meal=>{
                const canAfford=c.money>=meal.price;
                const STAT_NAMES={str:'力量',tec:'技術',pwr:'爆發力',stb:'穩定性',sta:'體力',rec:'恢復'};
                return(
                  <button key={meal.id} onClick={()=>eatMeal(meal)} disabled={!canAfford}
                    className={`pixel-border p-2 flex flex-col items-center gap-0.5 transition-all
                      ${canAfford?'bg-pixel-charcoal hover:bg-pixel-darkblue hover:scale-105 cursor-pointer':'bg-pixel-dark opacity-40 cursor-not-allowed'}`}>
                    <span className="text-3xl">{meal.icon}</span>
                    <span className="font-vt text-pixel-white text-sm font-bold">{meal.name}</span>
                    <span className={`font-pixel text-[8px] ${canAfford?'text-pixel-orange':'text-pixel-red'}`}>💰{meal.price}</span>
                    <span className="font-vt text-pixel-green text-xs">⚡+{meal.sta}</span>
                    {meal.bonus&&(
                      <div className="flex flex-wrap justify-center gap-0.5">
                        {Object.entries(meal.bonus).map(([k,v])=>(
                          <span key={k} className="font-vt text-pixel-cyan text-[11px]">{STAT_NAMES[k]}+{v}</span>
                        ))}
                      </div>
                    )}
                    <span className="font-vt text-pixel-light text-[11px] opacity-70">{meal.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FRIEND'S HOUSE ──
function FriendScreen({c,setC,go}){
  const[floats,setFloats]=useState(null);
  const[activity,setActivity]=useState(null);
  const[done,setDone]=useState({});
  const[animResult,setAnimResult]=useState(null);
  const[tiles,setTiles]=useState([]);
  const[frame,setFrame]=useState(0);

  useEffect(()=>{const t=setInterval(()=>setFrame(f=>(f+1)%120),80);return()=>clearInterval(t)},[]);

  const doMahjong=()=>{
    if(done.mahjong)return;
    sfx('tap');
    setActivity('mahjong');
    const tileSet=['🀄','🀇','🀈','🀉','🀊','🀋','🀌','🀍','🀎','🀏','🀙','🀚','🀛','🀜','🀝','🀞','🀟','🀠','🀡'];
    const picked=[...Array(4)].map(()=>tileSet[Math.floor(Math.random()*tileSet.length)]);
    setTiles(picked);
    setTimeout(()=>{
      const winChance=0.5+c.stats.stb*0.003;
      const win=Math.random()<winChance;
      const reward=win?Math.floor(50+Math.random()*100):0;
      const msgs=win?['自摸！贏錢了！','碰！好牌！大贏！','胡了！今天手氣真好！']:['放槍了...','沒胡，下次再來！','差一張就胡了...'];
      const msg=msgs[Math.floor(Math.random()*msgs.length)];
      setAnimResult({type:'mahjong',win,msg,reward});
      if(win){
        sfx('coin');
        setC(x=>({...x,money:x.money+reward,stats:{...x.stats,stb:Math.min(100,x.stats.stb+1)}}));
        setFloats([{icon:'🀄',text:msg,color:'#f4d03f'},{icon:'💰',text:`+${reward}`,color:'#f4d03f'},{icon:'🧠',text:'穩定+1',color:'#81c784'}]);
      }else{
        sfx('fail');
        setC(x=>({...x,stats:{...x.stats,stb:Math.min(100,x.stats.stb+1)}}));
        setFloats([{icon:'🀄',text:msg,color:'#e57373'},{icon:'🧠',text:'穩定+1',color:'#81c784'}]);
      }
      setDone(d=>({...d,mahjong:true}));
      setTimeout(()=>{setActivity(null);setAnimResult(null)},2000);
    },1500);
  };

  const doGaming=()=>{
    if(done.gaming)return;
    sfx('tap');
    setActivity('gaming');
    const games=['格鬥天王','瑪利歐賽車','動物森友會','薩爾達傳說','寶可夢對戰'];
    const game=games[Math.floor(Math.random()*games.length)];
    setTimeout(()=>{
      sfx('success');
      setC(x=>({...x,fatigue:Math.max(0,x.fatigue-10),stats:{...x.stats,stb:Math.min(100,x.stats.stb+1)}}));
      setAnimResult({type:'gaming',msg:`玩了一場${game}！超紓壓！`});
      setFloats([{icon:'🎮',text:`玩了${game}`,color:'#64b5f6'},{icon:'😌',text:'疲勞-10',color:'#81c784'},{icon:'🧠',text:'穩定+1',color:'#81c784'}]);
      setDone(d=>({...d,gaming:true}));
      setTimeout(()=>{setActivity(null);setAnimResult(null)},2000);
    },1500);
  };

  const doKaraoke=()=>{
    if(done.karaoke)return;
    sfx('tap');
    setActivity('karaoke');
    const songs=['五月天-倔強','周杰倫-稻香','告五人-披星戴月的想你','林俊傑-江南','蔡依林-舞孃','茄子蛋-浪子回頭'];
    const song=songs[Math.floor(Math.random()*songs.length)];
    setTimeout(()=>{
      sfx('cheer');
      const pwrUp=Math.random()<0.2;
      const updates={stb:Math.min(100,c.stats.stb+1)};
      if(pwrUp)updates.pwr=Math.min(100,c.stats.pwr+1);
      setC(x=>({...x,fatigue:Math.max(0,x.fatigue-8),stats:{...x.stats,...updates}}));
      const fl=[{icon:'🎤',text:`唱了${song}`,color:'#ce93d8'},{icon:'😌',text:'疲勞-8',color:'#81c784'},{icon:'🧠',text:'穩定+1',color:'#81c784'}];
      if(pwrUp)fl.push({icon:'💪',text:'爆發+1！唱歌練肺活量！',color:'#ff8a65'});
      setAnimResult({type:'karaoke',msg:`唱了「${song}」！`,pwrUp});
      setFloats(fl);
      setDone(d=>({...d,karaoke:true}));
      setTimeout(()=>{setActivity(null);setAnimResult(null)},2000);
    },1500);
  };

  const breathY=Math.sin(frame*0.1)*2;
  const tvFlicker=frame%10<5;

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-hidden">
      {floats&&<FloatingNum items={floats} onDone={()=>setFloats(null)}/>}

      {/* SVG Living Room Scene */}
      <div className="flex-1 relative overflow-hidden" style={{background:'linear-gradient(180deg,#fff8e1,#ffe0b2)'}}>
        <svg viewBox="0 0 400 250" className="w-full h-full" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="fr-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe8cc"/>
              <stop offset="100%" stopColor="#ffd6a0"/>
            </linearGradient>
            <linearGradient id="fr-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c49a6c"/>
              <stop offset="100%" stopColor="#a0784c"/>
            </linearGradient>
            <radialGradient id="fr-light" cx="50%" cy="20%" r="70%">
              <stop offset="0%" stopColor="#fff9c4" stopOpacity=".4"/>
              <stop offset="100%" stopColor="#fff9c4" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* Wall */}
          <rect width="400" height="180" fill="url(#fr-wall)"/>
          {/* Floor */}
          <rect y="180" width="400" height="70" fill="url(#fr-floor)"/>
          {/* Floor line */}
          <line x1="0" y1="180" x2="400" y2="180" stroke="#b8956a" strokeWidth="2"/>
          {/* Warm light overlay */}
          <rect width="400" height="250" fill="url(#fr-light)"/>

          {/* Window with curtains */}
          <rect x="290" y="20" width="70" height="60" rx="3" fill="#87ceeb" stroke="#8d6e3f" strokeWidth="3"/>
          <line x1="325" y1="20" x2="325" y2="80" stroke="#8d6e3f" strokeWidth="2"/>
          <line x1="290" y1="50" x2="360" y2="50" stroke="#8d6e3f" strokeWidth="2"/>
          <path d="M285,15 Q290,40 285,80 L290,80 L290,15 Z" fill="#e57373" opacity=".8"/>
          <path d="M287,15 Q292,45 287,80" fill="none" stroke="#c62828" strokeWidth="1" opacity=".5"/>
          <path d="M365,15 Q360,40 365,80 L360,80 L360,15 Z" fill="#e57373" opacity=".8"/>
          <path d="M363,15 Q358,45 363,80" fill="none" stroke="#c62828" strokeWidth="1" opacity=".5"/>
          <rect x="293" y="23" width="30" height="25" fill="#fff9c4" opacity=".3"/>

          {/* TV on stand */}
          <rect x="15" y="75" width="70" height="15" rx="2" fill="#5d4037" stroke="#3e2723" strokeWidth="1.5"/>
          <rect x="20" y="25" width="60" height="50" rx="3" fill="#333" stroke="#222" strokeWidth="2"/>
          <rect x="24" y="29" width="52" height="42" rx="1" fill={activity==='gaming'?(tvFlicker?'#4caf50':'#66bb6a'):'#1a237e'} opacity={activity==='gaming'?1:0.6}/>
          {activity==='gaming'&&<>
            <text x="50" y="48" textAnchor="middle" fill="white" fontSize="6" fontFamily="monospace">GAME ON!</text>
            <rect x={30+frame%20} y="55" width="6" height="6" fill="#ff0" rx="1"/>
            <rect x={55-frame%15} y="52" width="5" height="5" fill="#f44" rx="1"/>
          </>}
          {!activity&&<>
            <rect x="35" y="40" width="20" height="12" fill="#42a5f5" opacity=".4" rx="1"/>
            <circle cx="50" cy="46" r="4" fill="#64b5f6" opacity=".5"/>
          </>}

          {/* Mahjong table */}
          <rect x="140" y="130" width="100" height="60" rx="4" fill="#2e7d32" stroke="#1b5e20" strokeWidth="2"/>
          <rect x="145" y="135" width="90" height="50" rx="2" fill="#388e3c" opacity=".6"/>
          <rect x="145" y="188" width="6" height="14" fill="#5d4037"/>
          <rect x="229" y="188" width="6" height="14" fill="#5d4037"/>
          {activity==='mahjong'&&tiles.length>0?
            tiles.map((t,i)=><g key={i}>
              <rect x={155+i*20} y={148} width="14" height="18" rx="2" fill="#fffde7" stroke="#bdbdbd" strokeWidth="1"/>
              <text x={162+i*20} y={161} textAnchor="middle" fill="#333" fontSize="10">{t}</text>
            </g>):
            <>
              <rect x="160" y="145" width="10" height="14" rx="1" fill="#fffde7" stroke="#bdbdbd" strokeWidth=".8"/>
              <rect x="173" y="148" width="10" height="14" rx="1" fill="#fffde7" stroke="#bdbdbd" strokeWidth=".8"/>
              <rect x="186" y="146" width="10" height="14" rx="1" fill="#fffde7" stroke="#bdbdbd" strokeWidth=".8"/>
              <rect x="199" y="149" width="10" height="14" rx="1" fill="#fffde7" stroke="#bdbdbd" strokeWidth=".8"/>
              <rect x="212" y="145" width="10" height="14" rx="1" fill="#fffde7" stroke="#bdbdbd" strokeWidth=".8"/>
            </>
          }

          {/* Sofa */}
          <rect x="10" y="105" width="80" height="35" rx="6" fill="#7b1fa2" stroke="#4a148c" strokeWidth="2"/>
          <rect x="14" y="110" width="72" height="20" rx="4" fill="#9c27b0" opacity=".7"/>
          <rect x="5" y="100" width="15" height="42" rx="5" fill="#7b1fa2" stroke="#4a148c" strokeWidth="1.5"/>
          <rect x="85" y="100" width="15" height="42" rx="5" fill="#7b1fa2" stroke="#4a148c" strokeWidth="1.5"/>
          <circle cx="30" cy="118" r="8" fill="#ba68c8" opacity=".6"/>
          <circle cx="70" cy="118" r="8" fill="#ce93d8" opacity=".6"/>

          {/* Karaoke mic stand */}
          <line x1="340" y1="110" x2="340" y2="170" stroke="#757575" strokeWidth="3"/>
          <circle cx="340" cy="105" r="8" fill={activity==='karaoke'?'#ff9800':'#616161'} stroke="#424242" strokeWidth="1.5"/>
          {activity==='karaoke'&&<>
            <circle cx="340" cy="105" r="12" fill="none" stroke="#ffeb3b" strokeWidth="1" opacity={tvFlicker?0.8:0.3}/>
            <circle cx="340" cy="105" r="16" fill="none" stroke="#ffeb3b" strokeWidth=".5" opacity={tvFlicker?0.5:0.1}/>
          </>}
          <circle cx="340" cy="102" r="4" fill="#9e9e9e"/>
          <ellipse cx="340" cy="172" rx="12" ry="4" fill="#616161"/>

          {/* Snack table */}
          <rect x="270" y="145" width="40" height="25" rx="2" fill="#8d6e3f" stroke="#5d4037" strokeWidth="1.5"/>
          <rect x="275" y="168" width="4" height="12" fill="#5d4037"/>
          <rect x="301" y="168" width="4" height="12" fill="#5d4037"/>
          <circle cx="280" cy="141" r="5" fill="#f44336"/>
          <circle cx="292" cy="140" r="4" fill="#ff9800"/>
          <circle cx="302" cy="141" r="5" fill="#4caf50"/>
          <rect x="285" y="133" width="6" height="10" rx="1" fill="#2196f3"/>
          <rect x="284" y="132" width="8" height="3" rx="1" fill="#1565c0"/>

          {/* Friend 1 (blue) */}
          <g transform={`translate(35,${92+breathY*0.5})`}>
            <circle cx="0" cy="0" r="9" fill="#ffe0b2"/>
            <circle cx="-3" cy="-2" r="1.5" fill="#333"/>
            <circle cx="3" cy="-2" r="1.5" fill="#333"/>
            <path d="M-3,3 Q0,6 3,3" fill="none" stroke="#333" strokeWidth="1"/>
            <rect x="-8" y="9" width="16" height="14" rx="3" fill="#42a5f5"/>
            <path d="M-9,-2 Q-9,-12 0,-12 Q9,-12 9,-2" fill="#3e2723"/>
          </g>

          {/* Friend 2 (green) */}
          <g transform={`translate(250,${125+breathY*0.3})`}>
            <circle cx="0" cy="0" r="9" fill="#ffccbc"/>
            <circle cx="-3" cy="-2" r="1.5" fill="#333"/>
            <circle cx="3" cy="-2" r="1.5" fill="#333"/>
            <path d="M-2,3 Q0,5 2,3" fill="none" stroke="#333" strokeWidth="1"/>
            <rect x="-8" y="9" width="16" height="14" rx="3" fill="#66bb6a"/>
            <path d="M-9,-2 Q-9,-12 0,-12 Q9,-12 9,-2" fill="#212121"/>
          </g>

          {/* Friend 3 (orange) */}
          <g transform={`translate(135,${125+breathY*0.7})`}>
            <circle cx="0" cy="0" r="9" fill="#ffe0b2"/>
            <circle cx="-3" cy="-2" r="1.5" fill="#333"/>
            <circle cx="3" cy="-2" r="1.5" fill="#333"/>
            <path d="M-3,2 L3,2" stroke="#333" strokeWidth="1"/>
            <rect x="-8" y="9" width="16" height="14" rx="3" fill="#ff7043"/>
            <path d="M-9,-2 Q-9,-11 0,-13 Q9,-11 9,-2" fill="#f57f17"/>
          </g>

          {/* Player character */}
          <g transform={`translate(190,${120+breathY})`}>
            <circle cx="0" cy="0" r="10" fill="#ffcc80"/>
            <circle cx="-3" cy="-2" r="2" fill="#333"/>
            <circle cx="3" cy="-2" r="2" fill="#333"/>
            <path d="M-3,3 Q0,7 3,3" fill="none" stroke="#333" strokeWidth="1.2"/>
            <rect x="-9" y="10" width="18" height="16" rx="3" fill="#e53935"/>
            <path d="M-10,-3 Q-10,-14 0,-14 Q10,-14 10,-3" fill={c.gender==='male'?'#333':'#5d4037'}/>
            <text x="0" y="-16" textAnchor="middle" fontSize="8" fill="#f4d03f">★</text>
          </g>

          {/* Ceiling light */}
          <line x1="200" y1="0" x2="200" y2="15" stroke="#757575" strokeWidth="2"/>
          <ellipse cx="200" cy="18" rx="15" ry="6" fill="#ffeb3b" opacity=".8"/>
          <ellipse cx="200" cy="20" rx="20" ry="10" fill="#fff9c4" opacity=".15"/>

          {/* Wall decorations */}
          <rect x="120" y="20" width="30" height="25" rx="2" fill="#fff" stroke="#8d6e3f" strokeWidth="2"/>
          <text x="135" y="37" textAnchor="middle" fontSize="8" fill="#e91e63">♥</text>
          <rect x="210" y="15" width="25" height="30" rx="2" fill="#fff" stroke="#8d6e3f" strokeWidth="2"/>
          <text x="222" y="35" textAnchor="middle" fontSize="10" fill="#4caf50">🌿</text>
        </svg>

        {/* Activity animation overlay */}
        {animResult&&(
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pixel-border bg-pixel-charcoal bg-opacity-90 px-4 py-3 pop-in text-center">
              <div className="font-pixel text-[10px] text-pixel-gold mb-1">
                {animResult.type==='mahjong'&&(animResult.win?'🀄 胡牌！':'🀄 沒胡...')}
                {animResult.type==='gaming'&&'🎮 超好玩！'}
                {animResult.type==='karaoke'&&'🎤 唱得好！'}
              </div>
              <div className="font-cute text-pixel-light text-sm">{animResult.msg}</div>
              {animResult.reward>0&&<div className="font-vt text-pixel-gold text-lg mt-1">+{animResult.reward} 💰</div>}
            </div>
          </div>
        )}
      </div>

      {/* Activity Buttons */}
      <div className="bg-pixel-charcoal border-t-4 border-pixel-gray p-3">
        <div className="max-w-lg mx-auto">
          <div className="font-pixel text-pixel-gold text-[10px] mb-2 text-center">🏘️ 朋友家 — 來玩吧！</div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button onClick={doMahjong} disabled={!!done.mahjong||!!activity}
              className={`pixel-border p-2 text-center transition-all ${done.mahjong?'bg-pixel-dark opacity-40':'bg-pixel-dark hover:bg-pixel-darkblue cursor-pointer'}`}>
              <div className="text-2xl mb-1">{activity==='mahjong'?'🔄':'🀄'}</div>
              <div className="font-pixel text-[8px] text-pixel-light">打麻將</div>
              <div className="font-vt text-[11px] text-pixel-cyan mt-1">贏錢+穩定</div>
              {done.mahjong&&<div className="font-vt text-[10px] text-pixel-green mt-0.5">✓ 已玩</div>}
            </button>
            <button onClick={doGaming} disabled={!!done.gaming||!!activity}
              className={`pixel-border p-2 text-center transition-all ${done.gaming?'bg-pixel-dark opacity-40':'bg-pixel-dark hover:bg-pixel-darkblue cursor-pointer'}`}>
              <div className="text-2xl mb-1">{activity==='gaming'?'📺':'🎮'}</div>
              <div className="font-pixel text-[8px] text-pixel-light">打電動</div>
              <div className="font-vt text-[11px] text-pixel-cyan mt-1">疲勞↓穩定↑</div>
              {done.gaming&&<div className="font-vt text-[10px] text-pixel-green mt-0.5">✓ 已玩</div>}
            </button>
            <button onClick={doKaraoke} disabled={!!done.karaoke||!!activity}
              className={`pixel-border p-2 text-center transition-all ${done.karaoke?'bg-pixel-dark opacity-40':'bg-pixel-dark hover:bg-pixel-darkblue cursor-pointer'}`}>
              <div className="text-2xl mb-1">{activity==='karaoke'?'🎵':'🎤'}</div>
              <div className="font-pixel text-[8px] text-pixel-light">唱歌</div>
              <div className="font-vt text-[11px] text-pixel-cyan mt-1">疲勞↓穩定↑</div>
              {done.karaoke&&<div className="font-vt text-[10px] text-pixel-green mt-0.5">✓ 已玩</div>}
            </button>
          </div>
          <button onClick={()=>{sfx('click');go('hub')}}
            className="pixel-btn bg-pixel-dark text-pixel-light px-4 py-1.5 text-[10px] font-pixel w-full hover:bg-pixel-darkblue cursor-pointer">
            ← 回去地圖
          </button>
        </div>
      </div>
    </div>
  );
}

// ── HOME (BEDROOM) ──