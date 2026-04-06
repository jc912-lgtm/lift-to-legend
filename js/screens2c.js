function HomeScreen({c,setC,go}){
  const ms=maxSta(c.stats.sta);
  const[floats,setFloats]=useState(null);
  const[sleeping,setSleeping]=useState(false);
  const[catMsg,setCatMsg]=useState(null);
  const[frame,setFrame]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setFrame(f=>(f+1)%120),60);return()=>clearInterval(t)},[]);

  const catBreath=Math.sin(frame*0.05)*2;
  const zzzY=sleeping?(-10-frame%60*0.8):0;
  const zzzOp=sleeping?Math.max(0,1-(frame%60)/60):0;
  const lampGlow=0.4+Math.sin(frame*0.04)*0.1;

  function doSleep(){
    if(sleeping)return;
    sfx('rest');setSleeping(true);
    setTimeout(()=>{
      const rec=20+Math.floor(c.stats.rec/3);
      const fatDrop=Math.min(c.fatigue,25+Math.floor(c.stats.rec/5));
      setC(x=>({...x,stamina:Math.min(ms,x.stamina+rec),day:x.day+1,
        fatigue:Math.max(0,x.fatigue-fatDrop),streak:0,restStreak:(x.restStreak||0)+1,
        stats:{...x.stats,rec:Math.min(100,x.stats.rec+1)},totalTrainings:x.totalTrainings+1,
        activeEffects:x.activeEffects.map(e=>({...e,dur:e.dur-1})).filter(e=>e.dur>0)}));
      setFloats([{icon:'😴',text:`+${rec}❤️`,color:'#38b764'},{icon:'😌',text:`-${fatDrop}😤`,color:'#73eff7'},{icon:'📅',text:'新的一天',color:'#f4d03f'}]);
      setSleeping(false);
    },2000);
  }

  function playCat(){
    sfx('tap');
    const msgs=['喵～貓咪磨蹭你的腿','貓咪追逐逗貓棒！','貓咪在你腿上睡著了...','貓咪翻肚肚要摸摸！'];
    setCatMsg(msgs[Math.floor(Math.random()*msgs.length)]);
    setC(x=>({...x,fatigue:Math.max(0,x.fatigue-10),stats:{...x.stats,stb:Math.min(100,x.stats.stb+1)}}));
    setFloats([{icon:'🐱',text:'-10😤',color:'#73eff7'},{icon:'🧠',text:'穩定+1',color:'#ab47bc'}]);
    setTimeout(()=>setCatMsg(null),2500);
  }

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-auto">
      <div className="max-w-lg mx-auto">
        {floats&&<FloatingNum items={floats} onDone={()=>setFloats(null)}/>}
        <div className="flex justify-between items-center mb-2">
          <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-3 py-1 text-[10px] font-pixel">← 返回</button>
          <h2 className="font-pixel text-pixel-cyan text-[10px]">🏠 我的家</h2>
          <span className="font-vt text-pixel-light text-sm">Day {c.day}</span>
        </div>

        {/* Bedroom SVG */}
        <div className="pixel-border bg-pixel-charcoal p-1 mb-2">
          <svg viewBox="0 0 320 200" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="lampLight" cx="50%" cy="0%" r="80%">
                <stop offset="0%" stopColor="#fff9c4" stopOpacity={lampGlow}/>
                <stop offset="100%" stopColor="#fff9c4" stopOpacity="0"/>
              </radialGradient>
            </defs>
            {/* Room */}
            <rect width="320" height="200" fill="#2c2137"/>
            <rect x="0" y="160" width="320" height="40" fill="#3e2723" rx="2"/>
            {/* Rug */}
            <ellipse cx="160" cy="178" rx="80" ry="14" fill="#8e24aa" opacity=".4"/>
            <ellipse cx="160" cy="178" rx="60" ry="10" fill="#ab47bc" opacity=".3"/>
            {/* Window */}
            <rect x="200" y="20" width="70" height="60" rx="3" fill="#1a1c2c" stroke="#8d6e3f" strokeWidth="3"/>
            <line x1="235" y1="20" x2="235" y2="80" stroke="#8d6e3f" strokeWidth="2"/>
            <line x1="200" y1="50" x2="270" y2="50" stroke="#8d6e3f" strokeWidth="2"/>
            <circle cx="215" cy="35" r="8" fill="#fff9c4" opacity=".8"/>
            {[{x:210,y:28},{x:250,y:40},{x:225,y:65},{x:260,y:30},{x:245,y:60}].map((s,i)=>
              <circle key={i} cx={s.x} cy={s.y} r="1.5" fill="white" opacity=".7"/>
            )}
            {/* Nightstand */}
            <rect x="30" y="95" width="40" height="50" rx="2" fill="#5d4037"/>
            <rect x="32" y="110" width="36" height="2" fill="#4e342e"/>
            {/* Lamp */}
            <rect x="46" y="75" width="4" height="20" fill="#bdbdbd"/>
            <path d="M36,75 Q48,60 60,75Z" fill="#fff9c4" opacity=".9"/>
            <circle cx="48" cy="68" r="15" fill="url(#lampLight)"/>
            {/* Bed */}
            <rect x="80" y="100" width="140" height="60" rx="4" fill="#5c6bc0"/>
            <rect x="80" y="100" width="140" height="15" rx="4" fill="#7986cb"/>
            <rect x="85" y="103" width="35" height="12" rx="6" fill="white" opacity=".9"/>
            <rect x="80" y="155" width="140" height="8" rx="2" fill="#3949ab"/>
            {/* Blanket fold */}
            <path d="M80,130 Q150,125 220,130 L220,155 L80,155Z" fill="#42a5f5" opacity=".5"/>
            {/* Cat on bed */}
            <g transform={`translate(170,${118+catBreath})`}>
              <ellipse cx="0" cy="0" rx="18" ry="10" fill="#9e9e9e"/>
              <ellipse cx="-14" cy="-4" rx="8" ry="7" fill="#9e9e9e"/>
              <polygon points="-20,-10 -16,-3 -12,-9" fill="#757575"/>
              <polygon points="-10,-10 -6,-3 -2,-9" fill="#757575"/>
              <ellipse cx="-14" cy="-2" rx="1.5" ry={catMsg?2:0.8} fill="#333"/>
              <ellipse cx="-9" cy="-2" rx="1.5" ry={catMsg?2:0.8} fill="#333"/>
              <path d="M16,2 Q22,6 18,10" stroke="#9e9e9e" strokeWidth="3" fill="none"/>
              {catMsg&&<ellipse cx="15" cy="-12" rx="4" ry="3" fill="#e91e63" opacity=".6"/>}
            </g>
            {/* ZZZ when sleeping */}
            {sleeping&&[0,1,2].map(i=>
              <text key={i} x={155+i*15} y={90+zzzY-i*12} fill="#fff9c4" fontSize={10+i*3} opacity={Math.max(0,zzzOp-i*0.2)} fontFamily="monospace">Z</text>
            )}
            {/* Warm glow overlay */}
            <rect width="320" height="200" fill="#fff9c4" opacity={sleeping?0.08:0.03}/>
          </svg>
        </div>

        {catMsg&&<div className="pixel-border bg-pixel-charcoal p-2 mb-2 text-center font-cute text-pixel-light text-sm pop-in">🐱 {catMsg}</div>}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={doSleep} disabled={sleeping}
            className={`pixel-btn py-3 text-center ${sleeping?'bg-pixel-gray text-pixel-light opacity-50':'bg-indigo-900 text-pixel-light hover:bg-indigo-800'}`}>
            <div className="text-2xl mb-1">😴</div>
            <div className="font-pixel text-[9px]">睡覺</div>
            <div className="font-vt text-pixel-green text-xs">恢復體力 +1天</div>
          </button>
          <button onClick={playCat}
            className="pixel-btn bg-purple-900 text-pixel-light py-3 text-center hover:bg-purple-800">
            <div className="text-2xl mb-1">🐱</div>
            <div className="font-pixel text-[9px]">跟貓咪玩</div>
            <div className="font-vt text-pixel-cyan text-xs">疲勞-10 穩定+1</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CAFE ──
function CafeScreen({c,setC,go}){
  const CAFE_MENU=[
    {id:'americano',name:'美式咖啡',icon:'☕',price:40,effect:{fatigue:-12},desc:'清醒一下！'},
    {id:'latte',name:'拿鐵',icon:'🥛',price:55,effect:{fatigue:-15,sta:10},desc:'溫暖滑順'},
    {id:'mocha',name:'摩卡',icon:'🍫',price:65,effect:{fatigue:-10,sta:15},desc:'巧克力+咖啡'},
    {id:'tea',name:'水果茶',icon:'🍵',price:50,effect:{fatigue:-10,rec:1},desc:'清爽解渴'},
    {id:'smoothie',name:'蛋白奶昔',icon:'🥤',price:80,effect:{sta:25,str:1},desc:'訓練後最佳！'},
    {id:'cake',name:'蜂蜜蛋糕',icon:'🍰',price:60,effect:{fatigue:-15,stb:1},desc:'甜甜的幸福感'},
    {id:'croissant',name:'可頌',icon:'🥐',price:45,effect:{sta:15,fatigue:-8},desc:'外酥內軟'},
  ];
  const ms=maxSta(c.stats.sta);
  const[floats,setFloats]=useState(null);
  const[buyAnim,setBuyAnim]=useState(null);
  const[frame,setFrame]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setFrame(f=>(f+1)%120),60);return()=>clearInterval(t)},[]);

  const steamY=Math.sin(frame*0.06)*3;
  const steamOp=0.3+Math.sin(frame*0.08)*0.15;
  const pendantSway=Math.sin(frame*0.03)*2;

  function buy(item){
    if(c.money<item.price)return;
    sfx('coin');setBuyAnim(item.icon);
    setTimeout(()=>{
      setBuyAnim(null);
      const nc={...c,money:c.money-item.price,stats:{...c.stats}};
      const fItems=[{icon:'💰',text:`-${item.price}`,color:'#ef5350'}];
      const eff=item.effect;
      if(eff.fatigue){nc.fatigue=Math.max(0,(nc.fatigue||0)+eff.fatigue);fItems.push({icon:'😌',text:`${eff.fatigue}😤`,color:'#73eff7'})}
      if(eff.sta){nc.stamina=Math.min(ms,nc.stamina+eff.sta);fItems.push({icon:'⚡',text:`+${eff.sta}體力`,color:'#38b764'})}
      if(eff.str){nc.stats.str=Math.min(100,nc.stats.str+eff.str);fItems.push({icon:'💪',text:`力量+${eff.str}`,color:'#ef5350'})}
      if(eff.stb){nc.stats.stb=Math.min(100,nc.stats.stb+eff.stb);fItems.push({icon:'🧠',text:`穩定+${eff.stb}`,color:'#ab47bc'})}
      if(eff.rec){nc.stats.rec=Math.min(100,nc.stats.rec+eff.rec);fItems.push({icon:'💚',text:`恢復+${eff.rec}`,color:'#26c6da'})}
      setFloats(fItems);setC(nc);
    },600);
  }

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-auto">
      <div className="max-w-lg mx-auto">
        {floats&&<FloatingNum items={floats} onDone={()=>setFloats(null)}/>}
        {buyAnim&&(
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div style={{fontSize:'80px',animation:'popIn .5s cubic-bezier(.17,.67,.35,1.5) forwards'}}>{buyAnim}</div>
          </div>
        )}
        <div className="flex justify-between items-center mb-2">
          <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-3 py-1 text-[10px] font-pixel">← 返回</button>
          <h2 className="font-pixel text-pixel-orange text-[10px]">☕ 肆拾而立咖啡廳</h2>
          <span className="font-vt text-pixel-orange text-lg">💰{c.money}</span>
        </div>

        {/* Cafe SVG */}
        <div className="pixel-border bg-pixel-charcoal p-1 mb-2">
          <svg viewBox="0 0 320 180" className="w-full" xmlns="http://www.w3.org/2000/svg">
            {/* Walls */}
            <rect width="320" height="180" fill="#4e342e"/>
            <rect x="0" y="0" width="320" height="130" fill="#6d4c41"/>
            {/* Chalkboard */}
            <rect x="20" y="10" width="70" height="50" rx="2" fill="#2e7d32" stroke="#8d6e3f" strokeWidth="2"/>
            <text x="55" y="28" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="monospace">MENU</text>
            <text x="55" y="40" textAnchor="middle" fill="#fff9c4" fontSize="5" fontFamily="monospace">Latte $55</text>
            <text x="55" y="50" textAnchor="middle" fill="#fff9c4" fontSize="5" fontFamily="monospace">Mocha $65</text>
            {/* Pendant lights */}
            {[120,200,280].map((lx,i)=>
              <g key={i} transform={`translate(${pendantSway*(i%2===0?1:-1)},0)`}>
                <line x1={lx} y1="0" x2={lx} y2="20" stroke="#333" strokeWidth="1"/>
                <path d={`M${lx-8},20 Q${lx},15 ${lx+8},20 L${lx+6},28 L${lx-6},28Z`} fill="#ffcc80"/>
                <circle cx={lx} cy="24" r="4" fill="#fff9c4" opacity=".7"/>
              </g>
            )}
            {/* Counter */}
            <rect x="0" y="100" width="320" height="30" rx="2" fill="#5d4037"/>
            <rect x="0" y="98" width="320" height="6" fill="#8d6e3f"/>
            {/* Espresso machine */}
            <rect x="240" y="70" width="40" height="30" rx="3" fill="#bdbdbd" stroke="#9e9e9e" strokeWidth="1"/>
            <rect x="248" y="75" width="10" height="8" rx="1" fill="#616161"/>
            <rect x="262" y="75" width="10" height="8" rx="1" fill="#616161"/>
            <rect x="255" y="65" width="6" height="8" rx="1" fill="#9e9e9e"/>
            {/* Coffee cup on counter */}
            <rect x="150" y="88" width="16" height="12" rx="2" fill="white"/>
            <ellipse cx="158" cy="88" rx="8" ry="2" fill="#e0e0e0"/>
            {/* Steam */}
            {[0,1,2].map(i=>
              <path key={i} d={`M${155+i*4},${84+steamY-i*3} Q${157+i*4},${80+steamY-i*3} ${155+i*4},${76+steamY-i*3}`}
                fill="none" stroke="white" strokeWidth="1" opacity={steamOp-i*0.08}/>
            )}
            {/* Potted plant */}
            <rect x="8" y="85" width="14" height="14" rx="2" fill="#8d6e3f"/>
            <circle cx="15" cy="78" r="10" fill="#388e3c"/>
            <circle cx="10" cy="75" r="6" fill="#43a047"/>
            {/* Tables */}
            <circle cx="80" cy="155" r="18" fill="#8d6e3f" opacity=".6"/>
            <rect x="76" y="140" width="8" height="18" fill="#6d4c41"/>
            <circle cx="200" cy="160" r="16" fill="#8d6e3f" opacity=".6"/>
            <rect x="196" y="146" width="8" height="18" fill="#6d4c41"/>
            {/* Barista */}
            <g transform="translate(260,92)">
              <circle cx="0" cy="-12" r="8" fill="#ffcc80"/>
              <rect x="-6" y="-4" width="12" height="14" rx="2" fill="#4caf50"/>
              <rect x="-8" y="0" width="16" height="3" fill="white" opacity=".7"/>
              <rect x="-4" y="-20" width="8" height="5" rx="2" fill="#5d4037"/>
              <circle cx="-2" cy="-13" r="1" fill="#333"/>
              <circle cx="3" cy="-13" r="1" fill="#333"/>
              <path d="M-1,-9 Q1,-8 3,-9" stroke="#333" strokeWidth=".8" fill="none"/>
            </g>
            {/* Floor */}
            <rect x="0" y="130" width="320" height="50" fill="#3e2723"/>
            {[0,40,80,120,160,200,240,280].map((tx,i)=>
              <rect key={i} x={tx} y="130" width="38" height="48" fill={i%2===0?'#4e342e':'#3e2723'} opacity=".5"/>
            )}
          </svg>
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {CAFE_MENU.map(item=>{
            const canBuy=c.money>=item.price;
            return(
              <button key={item.id} onClick={()=>canBuy&&buy(item)} disabled={!canBuy}
                className={`pixel-border p-2 text-left ${canBuy?'bg-pixel-charcoal hover:bg-pixel-darkblue cursor-pointer':'bg-pixel-gray opacity-50'}`}>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="font-pixel text-pixel-light text-[8px]">{item.name}</div>
                    <div className="font-vt text-pixel-orange text-xs">💰{item.price}</div>
                  </div>
                </div>
                <div className="font-vt text-pixel-cyan text-[10px] mt-0.5">{item.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── LAUNDRY ──
function LaundryScreen({c,setC,go}){
  const[floats,setFloats]=useState(null);
  const[washing,setWashing]=useState(false);
  const[result,setResult]=useState(null);
  const[frame,setFrame]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setFrame(f=>(f+1)%120),60);return()=>clearInterval(t)},[]);

  const spinAngle=washing?frame*12:0;
  const stinkY=Math.sin(frame*0.1)*3;
  const neonFlicker=0.7+Math.sin(frame*0.15)*0.3;

  function doWash(){
    if(washing||c.money<20)return;
    sfx('click');setWashing(true);setResult(null);
    setTimeout(()=>{
      setWashing(false);
      const roll=Math.random();
      const nc={...c,money:c.money-20,fatigue:Math.max(0,c.fatigue-5),stats:{...c.stats}};
      const fItems=[{icon:'💰',text:'-20',color:'#ef5350'},{icon:'😌',text:'-5😤',color:'#73eff7'}];
      let msg='';
      if(roll<0.3){
        msg='衣服洗好了！清清爽爽 ✨';
      }else if(roll<0.6){
        const found=10+Math.floor(Math.random()*41);
        nc.money+=found;
        fItems.push({icon:'💰',text:`+${found}`,color:'#f4d03f'});
        msg=`在口袋發現零錢！+${found}💰`;
      }else if(roll<0.8){
        const stat=Math.random()<0.5?'stb':'tec';
        nc.stats[stat]=Math.min(100,nc.stats[stat]+1);
        fItems.push({icon:'⬆',text:`${stat==='stb'?'穩定':'技術'}+1`,color:'#ab47bc'});
        msg='遇到同好聊訓練心得！';
      }else if(roll<0.9){
        nc.money-=10;
        nc.stats.rec=Math.min(100,nc.stats.rec+1);
        fItems.push({icon:'💰',text:'-10',color:'#ef5350'},{icon:'💚',text:'恢復+1',color:'#26c6da'});
        msg='洗衣機壞了...自己修好了！🔧';
      }else{
        nc.activeEffects=[...(nc.activeEffects||[]),{name:'蛋白粉',type:'trainBoost',value:1.2,dur:1}];
        fItems.push({icon:'🥤',text:'訓練加成1天',color:'#38b764'});
        msg='發現別人忘拿的蛋白粉！💪';
      }
      setResult(msg);setFloats(fItems);setC(nc);
    },2000);
  }

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-auto">
      <div className="max-w-lg mx-auto">
        {floats&&<FloatingNum items={floats} onDone={()=>setFloats(null)}/>}
        <div className="flex justify-between items-center mb-2">
          <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-3 py-1 text-[10px] font-pixel">← 返回</button>
          <h2 className="font-pixel text-pixel-cyan text-[10px]">👕 C&R WASH 洗衣店</h2>
          <span className="font-vt text-pixel-orange text-lg">💰{c.money}</span>
        </div>

        {/* Laundry SVG */}
        <div className="pixel-border bg-pixel-charcoal p-1 mb-2">
          <svg viewBox="0 0 320 200" className="w-full" xmlns="http://www.w3.org/2000/svg">
            {/* Room */}
            <rect width="320" height="200" fill="#e0e0e0"/>
            <rect x="0" y="160" width="320" height="40" fill="#bdbdbd"/>
            {/* Fluorescent lights */}
            <rect x="40" y="5" width="100" height="6" rx="2" fill="#fff" opacity={neonFlicker}/>
            <rect x="180" y="5" width="100" height="6" rx="2" fill="#fff" opacity={neonFlicker*0.9}/>
            {/* Neon sign */}
            <rect x="100" y="18" width="120" height="22" rx="3" fill="#1a1c2c"/>
            <text x="160" y="34" textAnchor="middle" fill="#e91e63" fontSize="11" fontFamily="monospace" opacity={neonFlicker}>C&R WASH</text>
            {/* Washing machines */}
            {[30,120,210].map((mx,i)=>{
              const isSpinning=i===1;
              return(
                <g key={i} transform={`translate(${mx},60)`}>
                  <rect x="0" y="0" width="70" height="80" rx="4" fill="white" stroke="#9e9e9e" strokeWidth="2"/>
                  <rect x="5" y="5" width="60" height="12" rx="2" fill="#e0e0e0"/>
                  <circle cx="15" cy="11" r="3" fill={i===0?'#4caf50':'#9e9e9e'}/>
                  <circle cx="55" cy="11" r="3" fill="#9e9e9e"/>
                  <circle cx="35" cy="55" r="22" fill="#e3f2fd" stroke="#90caf9" strokeWidth="2"/>
                  <circle cx="35" cy="55" r="18" fill="#bbdefb"/>
                  {(isSpinning&&washing)?
                    <g transform={`translate(35,55) rotate(${spinAngle})`}>
                      <rect x="-10" y="-3" width="20" height="6" rx="2" fill="#42a5f5"/>
                      <rect x="-3" y="-10" width="6" height="20" rx="2" fill="#ef5350"/>
                      <rect x="-8" y="-8" width="6" height="6" rx="1" fill="#66bb6a" transform="rotate(45)"/>
                    </g>:
                    <g>
                      <rect x="25" y="48" width="12" height="8" rx="1" fill="#42a5f5" opacity=".4"/>
                      <rect x="30" y="52" width="8" height="6" rx="1" fill="#ef5350" opacity=".3"/>
                    </g>
                  }
                </g>
              );
            })}
            {/* Detergent shelf */}
            <rect x="290" y="50" width="25" height="4" fill="#8d6e3f"/>
            <rect x="293" y="35" width="8" height="15" rx="1" fill="#42a5f5"/>
            <rect x="303" y="38" width="8" height="12" rx="1" fill="#ff9800"/>
            <rect x="290" y="80" width="25" height="4" fill="#8d6e3f"/>
            <rect x="293" y="68" width="8" height="12" rx="1" fill="#e91e63"/>
            {/* Folding table */}
            <rect x="10" y="148" width="80" height="4" fill="#8d6e3f"/>
            <rect x="15" y="152" width="4" height="16" fill="#6d4c41"/>
            <rect x="81" y="152" width="4" height="16" fill="#6d4c41"/>
            {/* Dirty laundry basket */}
            <g transform="translate(240,135)">
              <path d="M0,25 L5,0 L55,0 L60,25Z" fill="#8d6e3f" stroke="#6d4c41" strokeWidth="1"/>
              <rect x="8" y="-5" width="15" height="8" rx="1" fill="#78909c"/>
              <rect x="28" y="-8" width="12" height="10" rx="1" fill="#5c6bc0"/>
              <rect x="38" y="-3" width="14" height="6" rx="1" fill="#ef5350"/>
              {/* Stink lines */}
              {!washing&&[0,1,2].map(i=>
                <g key={i} opacity={0.4+Math.sin(frame*0.1+i)*0.2}>
                  <path d={`M${15+i*12},${-10+stinkY-i*3} Q${18+i*12},${-16+stinkY-i*3} ${15+i*12},${-22+stinkY-i*3}`}
                    fill="none" stroke="#8bc34a" strokeWidth="2"/>
                </g>
              )}
            </g>
            {/* Tile floor pattern */}
            {[0,40,80,120,160,200,240,280].map((tx,i)=>
              <rect key={i} x={tx} y="170" width="38" height="28" fill={i%2===0?'#cfd8dc':'#b0bec5'} opacity=".3"/>
            )}
          </svg>
        </div>

        <div className="pixel-border bg-pixel-charcoal p-3 mb-2 text-center">
          <div className="font-cute text-pixel-light text-sm mb-2">
            {washing?'🫧 洗衣中...':'💨 你的訓練服超臭的！'}
          </div>
          {result&&<div className="font-vt text-pixel-gold text-sm mb-2 pop-in">{result}</div>}
          <button onClick={doWash} disabled={washing||(c.money<20)}
            className={`pixel-btn py-2 px-6 font-pixel text-[10px] ${washing||c.money<20?'bg-pixel-gray text-pixel-light opacity-50':'bg-blue-800 text-pixel-light hover:bg-blue-700'}`}>
            {washing?'🌀 洗衣中...':'🫧 洗衣服！($20)'}
          </button>
          {(c.money<20)&&!washing&&<div className="font-vt text-pixel-fail text-xs mt-1">錢不夠洗衣服...</div>}
        </div>
      </div>
    </div>
  );
}

// ── RIVER ──
function RiverScreen({c,setC,go}){
  const[floats,setFloats]=useState(null);
  const[done,setDone]=useState({fish:false,picnic:false,sun:false,sketch:false});
  const[msg,setMsg]=useState('');
  const[rFrame,setRFrame]=useState(0);
  const[activity,setActivity]=useState(null); // 'fish','picnic','sun','sketch' during animation
  const ms=maxSta(c.stats.sta);
  useEffect(()=>{const t=setInterval(()=>setRFrame(f=>(f+1)%200),70);return()=>clearInterval(t)},[]);

  const waveOff=Math.sin(rFrame*.06)*3;
  const sunRay=.5+Math.sin(rFrame*.04)*.3;
  const butterfly1X=120+Math.sin(rFrame*.03)*30;
  const butterfly1Y=40+Math.cos(rFrame*.04)*15;
  const butterfly2X=300+Math.cos(rFrame*.025)*25;
  const butterfly2Y=55+Math.sin(rFrame*.035)*12;

  function doFish(){
    if(done.fish)return;
    sfx('rest');setActivity('fish');
    setTimeout(()=>{
      const big=Math.random()<.3;
      const fi=[];
      if(big){
        fi.push({icon:'🐟',text:'大魚！+80💰',color:'#f4d03f'});
        fi.push({icon:'🧠',text:'穩定+2',color:'#ab47bc'});
        setC(x=>({...x,money:x.money+80,stats:{...x.stats,stb:Math.min(100,x.stats.stb+2)},fatigue:Math.max(0,x.fatigue-10)}));
        sfx('medal');setMsg('釣到大魚！賣了好價錢！');
      }else{
        fi.push({icon:'🎣',text:'穩定+1',color:'#ab47bc'});
        fi.push({icon:'💚',text:'恢復+1',color:'#26c6da'});
        setC(x=>({...x,stats:{...x.stats,stb:Math.min(100,x.stats.stb+1),rec:Math.min(100,x.stats.rec+1)},fatigue:Math.max(0,x.fatigue-10)}));
        sfx('success');setMsg('釣到小魚～好悠閒！');
      }
      setFloats(fi);setDone(d=>({...d,fish:true}));setActivity(null);
    },1200);
  }

  function doPicnic(){
    if(done.picnic||c.money<30)return;
    sfx('coin');setActivity('picnic');
    setTimeout(()=>{
      setC(x=>({...x,money:x.money-30,stamina:Math.min(ms,x.stamina+25),fatigue:Math.max(0,x.fatigue-15),stats:{...x.stats,rec:Math.min(100,x.stats.rec+1)}}));
      setFloats([{icon:'🧺',text:'-30💰',color:'#ef5350'},{icon:'⚡',text:'+25體力',color:'#38b764'},{icon:'😌',text:'-15疲勞',color:'#64b5f6'},{icon:'💚',text:'恢復+1',color:'#26c6da'}]);
      sfx('success');setMsg('吃飽飽，好幸福～');setDone(d=>({...d,picnic:true}));setActivity(null);
    },1200);
  }

  function doSun(){
    if(done.sun)return;
    sfx('rest');setActivity('sun');
    setTimeout(()=>{
      const burn=Math.random()<.15;
      if(burn){
        setC(x=>({...x,fatigue:Math.max(0,x.fatigue-10),stats:{...x.stats,stb:Math.min(100,x.stats.stb+1)}}));
        setFloats([{icon:'😅',text:'曬傷！-10疲勞',color:'#ef5350'},{icon:'🧠',text:'穩定+1',color:'#ab47bc'}]);
        sfx('fail');setMsg('曬太久了！皮膚紅通通...');
      }else{
        setC(x=>({...x,fatigue:Math.max(0,x.fatigue-20),stats:{...x.stats,stb:Math.min(100,x.stats.stb+1)}}));
        setFloats([{icon:'☀️',text:'-20疲勞',color:'#f4d03f'},{icon:'🧠',text:'穩定+1',color:'#ab47bc'}]);
        sfx('success');setMsg('暖暖的陽光好舒服～');
      }
      setDone(d=>({...d,sun:true}));setActivity(null);
    },1200);
  }

  function doSketch(){
    if(done.sketch)return;
    sfx('click');setActivity('sketch');
    setTimeout(()=>{
      setC(x=>({...x,stats:{...x.stats,stb:Math.min(100,x.stats.stb+2),tec:Math.min(100,x.stats.tec+1)}}));
      setFloats([{icon:'🧠',text:'穩定+2',color:'#ab47bc'},{icon:'🎯',text:'技術+1',color:'#42a5f5'}]);
      sfx('success');setMsg('畫了一幅河邊風景畫！');
      setDone(d=>({...d,sketch:true}));setActivity(null);
    },1200);
  }

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-auto">
      <div className="max-w-lg mx-auto">
        {floats&&<FloatingNum items={floats} onDone={()=>setFloats(null)}/>}
        <div className="flex justify-between items-center mb-2">
          <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-3 py-1 text-[10px] font-pixel">← 返回</button>
          <h2 className="font-pixel text-pixel-cyan text-[10px]">🏞️ 河邊</h2>
          <span className="font-vt text-pixel-orange text-lg">💰{c.money}</span>
        </div>

        {/* SVG River Scene */}
        <div className="pixel-border bg-pixel-charcoal p-1 mb-2 overflow-hidden">
          <svg viewBox="0 0 400 200" className="w-full" style={{display:'block'}}>
            <defs>
              <linearGradient id="riverSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4fc3f7"/>
                <stop offset="100%" stopColor="#81d4fa"/>
              </linearGradient>
              <linearGradient id="riverWater" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1565c0"/>
                <stop offset="50%" stopColor="#1e88e5"/>
                <stop offset="100%" stopColor="#1565c0"/>
              </linearGradient>
            </defs>
            {/* Sky */}
            <rect width="400" height="200" fill="url(#riverSky)"/>

            {/* Mountains */}
            <polygon points="0,90 60,35 120,90" fill="#5d4037"/>
            <polygon points="80,90 160,20 240,90" fill="#6d4c41"/>
            <polygon points="200,90 300,30 400,90" fill="#5d4037"/>
            <polygon points="300,90 370,45 400,70 400,90" fill="#795548"/>
            {/* Snow caps */}
            <polygon points="55,38 60,35 65,38 60,45" fill="#fff" opacity=".6"/>
            <polygon points="155,23 160,20 165,23 160,30" fill="#fff" opacity=".6"/>

            {/* Sun */}
            <circle cx="350" cy="30" r="18" fill="#ffd54f" opacity={sunRay}/>
            <circle cx="350" cy="30" r="14" fill="#ffeb3b"/>
            {[0,45,90,135,180,225,270,315].map((a,i)=>{
              const rad=a*Math.PI/180;
              return <line key={i} x1={350+Math.cos(rad)*20} y1={30+Math.sin(rad)*20}
                x2={350+Math.cos(rad)*(26+Math.sin(rFrame*.1+i)*3)} y2={30+Math.sin(rad)*(26+Math.sin(rFrame*.1+i)*3)}
                stroke="#ffd54f" strokeWidth="1.5" opacity=".5"/>;
            })}

            {/* Trees left */}
            <rect x="15" y="75" width="6" height="25" fill="#5d4037"/>
            <polygon points="3,80 18,45 33,80" fill="#2e7d32"/>
            <polygon points="6,68 18,38 30,68" fill="#388e3c"/>
            <rect x="50" y="80" width="5" height="20" fill="#5d4037"/>
            <polygon points="40,84 52,55 65,84" fill="#388e3c"/>
            <polygon points="43,72 52,48 62,72" fill="#43a047"/>

            {/* Trees right */}
            <rect x="355" y="72" width="6" height="28" fill="#5d4037"/>
            <polygon points="343,78 358,42 373,78" fill="#2e7d32"/>
            <polygon points="346,65 358,35 370,65" fill="#388e3c"/>
            <rect x="380" y="78" width="5" height="22" fill="#5d4037"/>
            <polygon points="372,82 382,58 393,82" fill="#388e3c"/>

            {/* Grass bank */}
            <ellipse cx="80" cy="102" rx="90" ry="12" fill="#4caf50"/>
            <ellipse cx="340" cy="102" rx="70" ry="10" fill="#4caf50"/>
            <rect y="95" width="400" height="8" fill="#66bb6a" opacity=".3"/>

            {/* River water */}
            <rect y="100" width="400" height="100" fill="url(#riverWater)" opacity=".85"/>
            {/* Wave lines */}
            {[110,130,150,170].map((y,i)=>(
              <path key={i} d={`M0,${y+waveOff*(i%2?1:-1)} Q100,${y-3+waveOff*(i%2?-1:1)} 200,${y+waveOff*(i%2?1:-1)} Q300,${y+3+waveOff*(i%2?-1:1)} 400,${y+waveOff*(i%2?1:-1)}`}
                fill="none" stroke="#42a5f5" strokeWidth="1" opacity=".3"/>
            ))}

            {/* Wooden dock */}
            <rect x="130" y="92" width="60" height="6" rx="1" fill="#8d6e63" stroke="#6d4c41" strokeWidth="1"/>
            <rect x="135" y="98" width="6" height="20" fill="#6d4c41"/>
            <rect x="175" y="98" width="6" height="20" fill="#6d4c41"/>
            <rect x="130" y="98" width="60" height="3" fill="#795548"/>

            {/* Picnic blanket on grass */}
            <g transform="translate(55,85)">
              <rect x="-15" y="0" width="35" height="20" rx="2" fill="#ef5350" opacity=".8"/>
              <rect x="-15" y="0" width="35" height="20" rx="2" fill="none" stroke="#c62828" strokeWidth="1" strokeDasharray="5,5"/>
              {activity==='picnic'&&<>
                <text x="-5" y="-2" fontSize="8">🍱</text>
                <text x="8" y="5" fontSize="7">🥤</text>
                <text x="-10" y="8" fontSize="7">🍎</text>
              </>}
              {!activity&&<text x="0" y="10" fontSize="10">🧺</text>}
            </g>

            {/* Character on blanket when sunbathing */}
            {activity==='sun'&&<g transform="translate(60,82)">
              <ellipse cx="0" cy="5" rx="12" ry="4" fill="#ffcc80"/>
              <circle cx="-8" cy="3" r="5" fill="#ffcc80"/>
              <text x="-4" y="-3" fontSize="8">😊</text>
            </g>}

            {/* Fishing line from dock */}
            {activity==='fish'&&<g>
              <line x1="165" y1="92" x2="200" y2="140" stroke="#999" strokeWidth="1"/>
              <circle cx="200" cy={140+Math.sin(rFrame*.2)*3} r="3" fill="#f44336" stroke="#b71c1c" strokeWidth="1"/>
              <line x1="200" y1={143+Math.sin(rFrame*.2)*3} x2="200" y2="160" stroke="#999" strokeWidth=".5"/>
            </g>}

            {/* Easel when sketching */}
            {activity==='sketch'&&<g transform="translate(330,68)">
              <line x1="0" y1="0" x2="-8" y2="30" stroke="#8d6e63" strokeWidth="2"/>
              <line x1="0" y1="0" x2="8" y2="30" stroke="#8d6e63" strokeWidth="2"/>
              <line x1="0" y1="0" x2="0" y2="-5" stroke="#8d6e63" strokeWidth="2"/>
              <rect x="-10" y="-5" width="20" height="16" fill="#fff" stroke="#bbb" strokeWidth="1"/>
              <rect x="-7" y="-2" width="14" height="10" fill="#81d4fa"/>
              <polygon points="-4,4 0,-1 4,4" fill="#4caf50" opacity=".6"/>
            </g>}

            {/* Butterflies */}
            <g transform={`translate(${butterfly1X},${butterfly1Y})`} opacity=".7">
              <ellipse cx="-3" cy="0" rx="3" ry="2" fill="#ff80ab"/>
              <ellipse cx="3" cy="0" rx="3" ry="2" fill="#ff80ab"/>
              <circle cx="0" cy="0" r="1" fill="#333"/>
            </g>
            <g transform={`translate(${butterfly2X},${butterfly2Y})`} opacity=".6">
              <ellipse cx="-2.5" cy="0" rx="2.5" ry="1.8" fill="#ce93d8"/>
              <ellipse cx="2.5" cy="0" rx="2.5" ry="1.8" fill="#ce93d8"/>
              <circle cx="0" cy="0" r=".8" fill="#333"/>
            </g>

            {/* Chibi character on dock */}
            {activity!=='sun'&&<g transform="translate(160,72)">
              <circle cx="0" cy="0" r="8" fill="#ffcc80"/>
              <circle cx="-3" cy="-1" r="1.2" fill="#333"/>
              <circle cx="3" cy="-1" r="1.2" fill="#333"/>
              <path d="M-2,2 Q0,4 2,2" fill="none" stroke="#333" strokeWidth=".8"/>
              <ellipse cx="0" cy="-7" rx="9" ry="4" fill="#4e342e"/>
              <rect x="-6" y="8" width="12" height="10" rx="2" fill="#42a5f5"/>
              {activity==='fish'&&<line x1="6" y1="10" x2="25" y2="-5" stroke="#8d6e63" strokeWidth="2" strokeLinecap="round"/>}
            </g>}
          </svg>
        </div>

        {/* Message */}
        {msg&&<div className="pixel-border bg-pixel-charcoal p-2 mb-2 text-center">
          <span className="font-vt text-pixel-cyan text-sm">{msg}</span>
        </div>}

        {/* Activities */}
        <div className="space-y-1.5 mb-2">
          <button onClick={doFish} disabled={done.fish||!!activity}
            className={`w-full pixel-border p-2 text-left transition-colors ${!done.fish&&!activity?'bg-pixel-charcoal hover:bg-pixel-darkblue cursor-pointer':'bg-pixel-dark opacity-40 cursor-not-allowed'}`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎣</span>
              <div className="flex-1">
                <div className="font-vt text-pixel-white text-base">釣魚</div>
                <div className="font-vt text-pixel-gray text-xs">免費 | 70%小魚：穩定+1恢復+1 | 30%大魚：+80💰穩定+2</div>
              </div>
              {done.fish&&<span className="text-pixel-green font-vt text-lg">✓</span>}
            </div>
          </button>

          <button onClick={doPicnic} disabled={done.picnic||(c.money<30)||!!activity}
            className={`w-full pixel-border p-2 text-left transition-colors ${!done.picnic&&c.money>=30&&!activity?'bg-pixel-charcoal hover:bg-pixel-darkblue cursor-pointer':'bg-pixel-dark opacity-40 cursor-not-allowed'}`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">🧺</span>
              <div className="flex-1">
                <div className="font-vt text-pixel-white text-base">野餐</div>
                <div className="font-vt text-pixel-gray text-xs">30💰 | 體力+25 疲勞-15 恢復+1</div>
              </div>
              {done.picnic&&<span className="text-pixel-green font-vt text-lg">✓</span>}
            </div>
          </button>

          <button onClick={doSun} disabled={done.sun||!!activity}
            className={`w-full pixel-border p-2 text-left transition-colors ${!done.sun&&!activity?'bg-pixel-charcoal hover:bg-pixel-darkblue cursor-pointer':'bg-pixel-dark opacity-40 cursor-not-allowed'}`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">☀️</span>
              <div className="flex-1">
                <div className="font-vt text-pixel-white text-base">曬太陽</div>
                <div className="font-vt text-pixel-gray text-xs">免費 | 疲勞-20 穩定+1 | 15%曬傷：疲勞只-10</div>
              </div>
              {done.sun&&<span className="text-pixel-green font-vt text-lg">✓</span>}
            </div>
          </button>

          <button onClick={doSketch} disabled={done.sketch||!!activity}
            className={`w-full pixel-border p-2 text-left transition-colors ${!done.sketch&&!activity?'bg-pixel-charcoal hover:bg-pixel-darkblue cursor-pointer':'bg-pixel-dark opacity-40 cursor-not-allowed'}`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎨</span>
              <div className="flex-1">
                <div className="font-vt text-pixel-white text-base">寫生畫畫</div>
                <div className="font-vt text-pixel-gray text-xs">免費 | 穩定+2 技術+1 | 專注力與精準度！</div>
              </div>
              {done.sketch&&<span className="text-pixel-green font-vt text-lg">✓</span>}
            </div>
          </button>
        </div>

        {/* Stamina / Fatigue info */}
        <div className="pixel-border bg-pixel-charcoal p-2 flex justify-between">
          <span className="font-vt text-pixel-green text-sm">⚡ 體力 {c.stamina}/{ms}</span>
          <span className="font-vt text-pixel-orange text-sm">😓 疲勞 {c.fatigue||0}</span>
          <span className="font-vt text-pixel-gold text-sm">💰 {c.money}</span>
        </div>
      </div>
    </div>
  );
}

// ── NSTC (國訓中心) ──