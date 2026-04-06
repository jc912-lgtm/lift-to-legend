function NstcScreen({c,setC,go}){
  const ms=maxSta(c.stats.sta);
  const canTrain=c.eventLevel>=2;
  const[floats,setFloats]=useState(null);
  const[msg,setMsg]=useState(null);
  const[frame,setFrame]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setFrame(f=>(f+1)%240),50);return()=>clearInterval(t)},[]);

  const coachBreath=Math.sin(frame*0.04)*1.5;
  const ath1Y=Math.sin(frame*0.08)*4;
  const ath2Y=Math.sin(frame*0.08+2)*4;
  const flagSway=Math.sin(frame*0.02)*2;
  const lightPulse=0.15+Math.sin(frame*0.03)*0.05;

  const ACTIVITIES=[
    {id:'coach',icon:'🏋️',name:'老母魔鬼訓練',cost:0,costType:'stamina',staCost:30,fatCost:20,
      desc:'全能力+2，超級累！',
      check:()=>c.stamina>=30,
      apply:(nc,fi)=>{
        nc.stamina=Math.max(0,nc.stamina-30);nc.fatigue=Math.min(100,(nc.fatigue||0)+20);
        ['str','tec','pwr','stb','sta','rec'].forEach(s=>{nc.stats[s]=Math.min(100,nc.stats[s]+2)});
        fi.push({icon:'💪',text:'全+2',color:'#f4d03f'},{icon:'😵',text:'+20😤',color:'#ef5350'});
        const lines=['給我蹲下去！再來！','技術不到位不准走！','你以為國手是這樣當的？','不錯嘛，有進步！','腰挺直！膝蓋推出去！','今天不練完不准回家！','重心再低一點！','速度！速度！速度！','接槓的時機要更快','肘要轉過來！聽到沒','呼吸的節奏要控制好'];
        return '老母：'+lines[Math.floor(Math.random()*lines.length)];
      }},
    {id:'physio',icon:'💆',name:'物理治療',cost:50,costType:'money',
      desc:c.injured?'疲勞-30，恢復+2，加速傷癒':'疲勞-30，恢復+2',
      check:()=>c.money>=50,
      apply:(nc,fi)=>{
        nc.money-=50;nc.fatigue=Math.max(0,(nc.fatigue||0)-30);nc.stats.rec=Math.min(100,nc.stats.rec+2);
        fi.push({icon:'💰',text:'-50',color:'#ef5350'},{icon:'😌',text:'-30😤',color:'#73eff7'},{icon:'💚',text:'恢復+2',color:'#26c6da'});
        if(nc.injured){nc.injuryDay=Math.max(0,nc.injuryDay-2);fi.push({icon:'🩹',text:'傷癒加速',color:'#38b764'});return '專業治療幫你加速恢復！傷快好了';}
        return '專業治療師幫你放鬆肌肉';
      }},
    {id:'sauna',icon:'🧖',name:'烤箱放鬆',cost:30,costType:'money',
      desc:'疲勞-25，體力+15，恢復+1',
      check:()=>c.money>=30,
      apply:(nc,fi)=>{
        nc.money-=30;nc.fatigue=Math.max(0,(nc.fatigue||0)-25);nc.stamina=Math.min(ms,nc.stamina+15);nc.stats.rec=Math.min(100,nc.stats.rec+1);
        fi.push({icon:'💰',text:'-30',color:'#ef5350'},{icon:'😌',text:'-25😤',color:'#73eff7'},{icon:'⚡',text:'+15體力',color:'#38b764'});
        return '熱氣蒸騰，全身放鬆～';
      }},
    {id:'hotspring',icon:'♨️',name:'溫泉恢復',cost:40,costType:'money',
      desc:'疲勞-35，體力+20，全屬性恢復',
      check:()=>c.money>=40,
      apply:(nc,fi)=>{
        nc.money-=40;nc.fatigue=Math.max(0,(nc.fatigue||0)-35);nc.stamina=Math.min(ms,nc.stamina+20);
        ['str','tec','pwr','stb','sta','rec'].forEach(s=>{nc.stats[s]=Math.min(100,nc.stats[s]+1)});
        fi.push({icon:'💰',text:'-40',color:'#ef5350'},{icon:'😌',text:'-35😤',color:'#73eff7'},{icon:'⚡',text:'+20體力',color:'#38b764'},{icon:'✨',text:'全+1',color:'#f4d03f'});
        return '溫泉水療，身心都恢復了';
      }},
    {id:'nutrition',icon:'🥗',name:'營養師諮詢',cost:60,costType:'money',
      desc:'體力+30，力量+1，訓練加成2天',
      check:()=>c.money>=60,
      apply:(nc,fi)=>{
        nc.money-=60;nc.stamina=Math.min(ms,nc.stamina+30);nc.stats.str=Math.min(100,nc.stats.str+1);
        nc.activeEffects=[...(nc.activeEffects||[]),{name:'營養計畫',type:'trainBoost',value:1.2,dur:2}];
        fi.push({icon:'💰',text:'-60',color:'#ef5350'},{icon:'⚡',text:'+30體力',color:'#38b764'},{icon:'💪',text:'力量+1',color:'#ef5350'},{icon:'🥤',text:'加成2天',color:'#38b764'});
        return '營養師幫你規劃飲食計畫';
      }},
    {id:'massage',icon:'💪',name:'按摩恢復',cost:40,costType:'money',
      desc:'疲勞-20，體力+10，恢復+1',
      check:()=>c.money>=40,
      apply:(nc,fi)=>{
        nc.money-=40;nc.fatigue=Math.max(0,(nc.fatigue||0)-20);nc.stamina=Math.min(ms,nc.stamina+10);nc.stats.rec=Math.min(100,nc.stats.rec+1);
        fi.push({icon:'💰',text:'-40',color:'#ef5350'},{icon:'😌',text:'-20😤',color:'#73eff7'},{icon:'⚡',text:'+10體力',color:'#38b764'},{icon:'💚',text:'恢復+1',color:'#26c6da'});
        return '運動按摩，消除乳酸堆積';
      }},
  ];

  function doActivity(act){
    if(!canTrain||!act.check())return;
    sfx('cheer');
    const nc={...c,stats:{...c.stats},activeEffects:[...(c.activeEffects||[])]};
    const fi=[];
    const txt=act.apply(nc,fi);
    setFloats(fi);setMsg(txt);setC(nc);
  }

  // Visit mode inspiration
  function visitInspire(){
    sfx('cheer');
    const visitMsgs=['哇！這就是國訓中心！好大！','看到國手在訓練，好厲害！','老母遠遠看了你一眼...','有一天我也要在這裡練！'];
    setMsg(visitMsgs[Math.floor(Math.random()*visitMsgs.length)]);
    setFloats([{icon:'🧠',text:'穩定+1',color:'#ab47bc'}]);
    setC(x=>({...x,stats:{...x.stats,stb:Math.min(100,x.stats.stb+1)}}));
  }

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-auto">
      <div className="max-w-lg mx-auto w-full">
        {floats&&<FloatingNum items={floats} onDone={()=>setFloats(null)}/>}

        <div className="flex justify-between items-center mb-2">
          <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-3 py-1 text-[10px] font-pixel">← 返回</button>
          <h2 className="font-pixel text-pixel-gold text-[10px]">🏛️ 國家運動訓練中心</h2>
          <span className="font-vt text-pixel-orange text-lg">💰{c.money}</span>
        </div>

        {/* SVG Scene — 老母 is the STAR */}
        <div className="pixel-border bg-pixel-charcoal p-1 mb-2 cursor-pointer"
          onClick={()=>{
            if(!msg){
              const tiredQuips=(c.fatigue||0)>60?['你今天臉色很差，去休息！','不要硬撐，受傷就完了','我不要帶傷的選手']:[];
              const wonQuips=c.medals&&c.medals.length>0?['上次比賽表現不錯嘛','有獎牌了還不夠！繼續練','你是我帶過最有潛力的（之一啦）']:[];
              const streakQuips=(c.streak||0)>=5?['最近很認真嘛！不錯','連續練這麼多天，有國手的樣子了']:[];
              const quips=canTrain?['看什麼看！去練！','站在那幹嘛？蹲下去！','你的技術還不行，多練！','態度不錯，繼續保持','我年輕的時候比你強多了','想拿金牌？先給我流汗！','膝蓋推出去！屁股夾緊！','穩定性不夠！心要定','挺舉的接槓要快！','我數到三，再蹲十下',...tiredQuips,...wonQuips,...streakQuips]:
                ['你是誰？先回去練再來','以後要來這裡練嗎？加油','看好了，這就是國手的水準','有夢想很好，去實現它！','國訓中心不是觀光景點','先拿到全國賽資格再來','我看你骨架不錯，好好練'];
              setMsg(quips[Math.floor(Math.random()*quips.length)]);
              sfx('tap');
              setTimeout(()=>setMsg(null),2500);
            }
          }}>
          <svg viewBox="0 0 400 240" className="w-full" xmlns="http://www.w3.org/2000/svg">
            {/* Background - facility */}
            <rect width="400" height="240" fill="#2c3e50"/>
            <rect x="0" y="0" width="400" height="20" fill="#1a1c2c"/>
            {/* Lights */}
            {[80,200,320].map((lx,i)=>
              <g key={i}>
                <rect x={lx-12} y="18" width="24" height="3" fill="#555"/>
                <ellipse cx={lx} cy="28" rx="18" ry="6" fill="#fff9c4" opacity={lightPulse}/>
              </g>
            )}
            {/* Sign */}
            <rect x="120" y="26" width="160" height="18" rx="2" fill="#1a1c2c" stroke="#f4d03f" strokeWidth="1.5"/>
            <text x="200" y="40" textAnchor="middle" fill="#f4d03f" fontSize="9" fontFamily="monospace" fontWeight="bold">國家運動訓練中心</text>
            {/* Flags */}
            <g transform={`translate(30,28) rotate(${flagSway})`}><rect x="0" y="0" width="2" height="25" fill="#8d6e3f"/><rect x="2" y="0" width="18" height="12" fill="#fff"/><circle cx="11" cy="6" r="3" fill="#1a237e"/></g>
            <g transform={`translate(355,28) rotate(${-flagSway})`}><rect x="0" y="0" width="2" height="25" fill="#8d6e3f"/><rect x="2" y="0" width="18" height="12" fill="#fff"/><circle cx="11" cy="6" r="3" fill="#1a237e"/></g>
            {/* Floor */}
            <rect x="0" y="160" width="400" height="80" fill="#34495e"/>
            {/* Platforms */}
            <rect x="15" y="170" width="70" height="8" rx="2" fill="#5d4037"/>
            <rect x="315" y="170" width="70" height="8" rx="2" fill="#5d4037"/>
            {/* Small athletes in background */}
            <g transform={`translate(50,${130+ath1Y})`} opacity=".6">
              <circle cx="0" cy="0" r="6" fill="#455a64"/><rect x="-5" y="6" width="10" height="16" rx="2" fill="#455a64"/>
              <line x1="-5" y1="10" x2="-14" y2="2" stroke="#455a64" strokeWidth="3" strokeLinecap="round"/>
              <line x1="5" y1="10" x2="14" y2="2" stroke="#455a64" strokeWidth="3" strokeLinecap="round"/>
              <rect x="-18" y="0" width="36" height="3" rx="1" fill="#777"/>
            </g>
            <g transform={`translate(350,${135+ath2Y})`} opacity=".6">
              <circle cx="0" cy="0" r="6" fill="#455a64"/><rect x="-5" y="6" width="10" height="14" rx="2" fill="#455a64"/>
            </g>

            {/* ════ COACH "老母" — LARGE CENTER CHARACTER ════ */}
            <g transform={`translate(200,${90+coachBreath})`}>
              {/* Shadow */}
              <ellipse cx="0" cy="110" rx="40" ry="8" fill="#000" opacity=".2"/>
              {/* Legs */}
              <rect x="-14" y="72" width="11" height="30" rx="3" fill="#1a237e"/>
              <rect x="3" y="72" width="11" height="30" rx="3" fill="#1a237e"/>
              {/* Shoes */}
              <rect x="-16" y="98" width="14" height="8" rx="3" fill="#333"/>
              <rect x="2" y="98" width="14" height="8" rx="3" fill="#333"/>
              {/* Body - red coach jacket */}
              <rect x="-22" y="20" width="44" height="55" rx="6" fill="#c62828"/>
              {/* Jacket detail */}
              <line x1="0" y1="20" x2="0" y2="75" stroke="#b71c1c" strokeWidth="1.5"/>
              {/* Whistle */}
              <circle cx="8" cy="30" r="4" fill="#f4d03f" stroke="#c8a415" strokeWidth="1"/>
              <line x1="4" y1="22" x2="8" y2="28" stroke="#c8a415" strokeWidth="1.5"/>
              {/* Badge */}
              <rect x="-10" y="40" width="20" height="12" rx="2" fill="#1a237e"/>
              <text x="0" y="50" textAnchor="middle" fill="#f4d03f" fontSize="7" fontWeight="bold">COACH</text>
              {/* Arms crossed (default) or pointing (when msg) */}
              {msg?<>
                {/* Pointing arm */}
                <path d="M-22,35 Q-40,25 -50,15" stroke="#ffcc80" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <circle cx="-52" cy="13" r="4" fill="#ffcc80"/>
                <path d="M22,35 Q30,45 25,55" stroke="#ffcc80" strokeWidth="8" fill="none" strokeLinecap="round"/>
              </>:<>
                {/* Arms crossed */}
                <path d="M-22,35 Q-32,42 -28,52" stroke="#ffcc80" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <path d="M22,35 Q32,42 28,52" stroke="#ffcc80" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <rect x="-28" y="46" width="56" height="8" rx="4" fill="#ffcc80"/>
              </>}
              {/* HEAD — big! */}
              <circle cx="0" cy="0" r="22" fill="#ffcc80" stroke="#e6b866" strokeWidth="1"/>
              {/* Hair */}
              <path d="M-22,-5 Q-22,-25 0,-25 Q22,-25 22,-5" fill="#3e2723"/>
              <rect x="-22" y="-25" width="44" height="10" rx="5" fill="#3e2723"/>
              {/* Stern eyebrows */}
              <line x1="-12" y1="-8" x2="-4" y2="-5" stroke="#3e2723" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="4" y1="-5" x2="12" y2="-8" stroke="#3e2723" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Eyes */}
              <ellipse cx="-8" cy="-1" rx="4" ry={msg?'3':'4'} fill="white"/>
              <ellipse cx="8" cy="-1" rx="4" ry={msg?'3':'4'} fill="white"/>
              <circle cx="-8" cy="0" r="2.5" fill="#333"/>
              <circle cx="8" cy="0" r="2.5" fill="#333"/>
              <circle cx="-7" cy="-1" r="1" fill="white"/>
              <circle cx="9" cy="-1" r="1" fill="white"/>
              {/* Mouth */}
              {msg?
                <path d="M-8,8 Q0,16 8,8" stroke="#333" strokeWidth="1.5" fill="#c62828"/>:
                <line x1="-6" y1="8" x2="6" y2="8" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
              }
              {/* Blush */}
              <ellipse cx="-14" cy="5" rx="5" ry="3" fill="#ef9a9a" opacity=".4"/>
              <ellipse cx="14" cy="5" rx="5" ry="3" fill="#ef9a9a" opacity=".4"/>
              {/* Name label */}
              <text x="0" y="118" textAnchor="middle" fill="#f4d03f" fontSize="10" fontWeight="bold" fontFamily="LXGW WenKai TC,sans-serif">老母教練</text>
            </g>

            {/* Speech bubble when msg */}
            {msg&&<g className="pop-in">
              <rect x="80" y="20" width="240" height="30" rx="8" fill="white" opacity=".95"/>
              <polygon points="200,50 190,55 210,55" fill="white" opacity=".95"/>
              <text x="200" y="40" textAnchor="middle" fill="#333" fontSize="11" fontFamily="LXGW WenKai TC,sans-serif" fontWeight="bold">{msg}</text>
              {(c.fatigue||0)>60&&<text x="72" y="40" fontSize="10">💧</text>}
              {(c.streak||0)>=5&&(c.fatigue||0)<=60&&<text x="72" y="40" fontSize="10">✨</text>}
            </g>}
            {/* Floor */}
            <rect x="0" y="123" width="400" height="77" fill="#263238"/>
            {/* Floor lines */}
            {[0,50,100,150,200,250,300,350].map((fx,i)=>
              <rect key={i} x={fx} y="123" width="48" height="75" fill={i%2===0?'#2c3e50':'#263238'} opacity=".4"/>
            )}
            {/* Mirror on back wall */}
            <rect x="100" y="55" width="60" height="55" rx="1" fill="#455a64" opacity=".5"/>
            <rect x="100" y="55" width="60" height="55" rx="1" fill="none" stroke="#78909c" strokeWidth="1"/>
            <rect x="240" y="55" width="50" height="55" rx="1" fill="#455a64" opacity=".5"/>
            <rect x="240" y="55" width="50" height="55" rx="1" fill="none" stroke="#78909c" strokeWidth="1"/>
            {/* Rack with dumbbells on wall */}
            <rect x="10" y="65" width="40" height="4" fill="#5d4037"/>
            <rect x="10" y="80" width="40" height="4" fill="#5d4037"/>
            {[14,22,30,38,44].map((dx,i)=>
              <rect key={i} x={dx} y={(i<3)?60:75} width="4" height={(i<3)?5:5} rx="1" fill="#616161"/>
            )}
          </svg>
        </div>

        {/* Message display */}
        {msg&&(
          <div className="pixel-border bg-pixel-charcoal p-2 mb-2 text-center pop-in">
            <span className="font-vt text-pixel-cyan text-sm">{msg}</span>
          </div>
        )}

        {/* Visit mode banner */}
        {!canTrain&&(
          <div className="pixel-border bg-pixel-darkblue p-2 mb-2 text-center">
            <div className="font-pixel text-pixel-gold text-[9px] mb-1">🔒 達到全國賽等級即可使用設施！</div>
            <div className="font-vt text-pixel-light text-sm">目前可參觀，感受國手訓練氛圍</div>
            <button onClick={visitInspire} className="pixel-btn bg-pixel-charcoal text-pixel-cyan px-4 py-1.5 text-[10px] font-pixel mt-2 cursor-pointer hover:bg-pixel-darkblue">👀 參觀一下（穩定+1）</button>
          </div>
        )}

        {/* Activity cards - 2x3 grid */}
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          {ACTIVITIES.map(act=>{
            const canDo=canTrain&&act.check();
            const locked=!canTrain;
            return(
              <button key={act.id} onClick={()=>canDo&&doActivity(act)} disabled={!canDo}
                className={`pixel-border p-2 text-left relative ${canDo?'bg-pixel-charcoal hover:bg-pixel-darkblue cursor-pointer':locked?'bg-pixel-gray opacity-50':'bg-pixel-charcoal opacity-60'}`}>
                {locked&&<span className="absolute top-1 right-1 text-sm">🔒</span>}
                <div className="flex items-center gap-1.5">
                  <span className={`text-xl ${locked?'grayscale':''}`}>{act.icon}</span>
                  <div>
                    <div className={`font-pixel text-[8px] ${locked?'text-pixel-gray':'text-pixel-light'}`}>{act.name}</div>
                    <div className="font-vt text-pixel-orange text-xs">
                      {act.costType==='money'?`💰${act.cost}`:`⚡${act.staCost||0} 😤+${act.fatCost||0}`}
                    </div>
                  </div>
                </div>
                <div className={`font-vt text-[10px] mt-0.5 ${locked?'text-pixel-gray':'text-pixel-cyan'}`}>{act.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Status bar */}
        <div className="pixel-border bg-pixel-charcoal p-2 flex justify-between">
          <span className="font-vt text-pixel-green text-sm">⚡ {c.stamina}/{ms}</span>
          <span className="font-vt text-pixel-orange text-sm">😓 {c.fatigue||0}</span>
          <span className="font-vt text-pixel-gold text-sm">💰 {c.money}</span>
          <span className="font-vt text-pixel-cyan text-sm">🏆 Lv{c.eventLevel||0}</span>
        </div>
      </div>
    </div>
  );
}

// ── WANG FUND ──
function WangFundScreen({c,setC,go}){
  const ms=maxSta(c.stats.sta);
  const[floats,setFloats]=useState(null);
  const[msg,setMsg]=useState(null);
  const[frame,setFrame]=useState(0);
  const[visited,setVisited]=useState({tea:false,sponsor:false,lecture:false});
  useEffect(()=>{const t=setInterval(()=>setFrame(f=>(f+1)%240),50);return()=>clearInterval(t)},[]);

  const steamY1=Math.sin(frame*0.06)*3;
  const steamY2=Math.sin(frame*0.06+1.5)*3;
  const chandelierGlow=0.4+Math.sin(frame*0.03)*0.1;
  const wangBreath=Math.sin(frame*0.04)*1;

  const[wangMsg,setWangMsg]=useState(null);
  const wangQuotes=(()=>{
    const normal=['年輕人，堅持就對了','我年輕時也是舉重的','慢慢來比較快','天分不夠，努力來湊','金牌不是終點，是旅程','舉重教會我最多的，是面對失敗','投資自己永遠不會虧','成功需要時間和耐心','我看好你的未來','基金會就是要支持年輕人'];
    const tired=(c.fatigue||0)>60?['你看起來很疲憊...要照顧身體','休息也是訓練的一部分']:[];
    const poor=c.money<50?['沒錢也沒關係，夢想無價','年輕就是最大的本錢']:[];
    const won=c.medals&&c.medals.length>0?['聽說你最近比賽得獎了？恭喜！','你讓基金會很驕傲']:[];
    return[...normal,...tired,...poor,...won];
  })();
  function clickWang(){
    sfx('tap');setWangMsg(wangQuotes[Math.floor(Math.random()*wangQuotes.length)]);
    setTimeout(()=>setWangMsg(null),2500);
  }

  const ACTIVITIES=[
    {id:'tea',icon:'🍵',name:'喝茶聊天',cost:0,costType:'free',
      desc:'穩定+2，疲勞-15，聽老王的智慧',
      check:()=>!visited.tea,
      apply:(nc,fi)=>{
        nc.fatigue=Math.max(0,(nc.fatigue||0)-15);nc.stats.stb=Math.min(100,nc.stats.stb+2);
        fi.push({icon:'🧠',text:'穩定+2',color:'#ab47bc'},{icon:'😌',text:'-15😤',color:'#73eff7'});
        setVisited(v=>({...v,tea:true}));
        return '老王：「'+wangQuotes[Math.floor(Math.random()*wangQuotes.length)]+'」';
      }},
    {id:'sponsor',icon:'💰',name:'申請贊助',cost:0,costType:'free',
      desc:'靠實力爭取基金會贊助！',
      check:()=>!visited.sponsor,
      apply:(nc,fi)=>{
        const chance=Math.min(95,30+(c.medals.length*5)+((c.eventLevel||0)*10));
        const success=Math.random()*100<chance;
        if(success){
          const amt=500+Math.floor(Math.random()*1501);
          nc.money+=amt;
          fi.push({icon:'💰',text:`+${amt}`,color:'#f4d03f'});
          setVisited(v=>({...v,sponsor:true}));
          return '老王：「看好你！這筆錢好好用」💰+'+amt;
        }else{
          nc.stats.stb=Math.min(100,nc.stats.stb+1);
          fi.push({icon:'🧠',text:'穩定+1',color:'#ab47bc'});
          setVisited(v=>({...v,sponsor:true}));
          return '老王：「再努力一點，下次再來」';
        }
      }},
    {id:'nutrition',icon:'📋',name:'營養計畫',cost:100,costType:'money',
      desc:'訓練加成5天！力量+1 恢復+1',
      check:()=>c.money>=100,
      apply:(nc,fi)=>{
        nc.money-=100;nc.stats.str=Math.min(100,nc.stats.str+1);nc.stats.rec=Math.min(100,nc.stats.rec+1);
        nc.activeEffects=[...(nc.activeEffects||[]),{name:'營養計畫',type:'trainBoost',value:1.2,dur:5}];
        fi.push({icon:'💰',text:'-100',color:'#ef5350'},{icon:'💪',text:'力量+1',color:'#ef5350'},{icon:'💚',text:'恢復+1',color:'#26c6da'},{icon:'🥤',text:'加成5天',color:'#38b764'});
        return '基金會營養師幫你訂製飲食計畫！';
      }},
    {id:'lecture',icon:'🎓',name:'運動科學講座',cost:0,costType:'free',
      desc:'全原則+1，技術+2',
      check:()=>!visited.lecture,
      apply:(nc,fi)=>{
        nc.stats.tec=Math.min(100,nc.stats.tec+2);
        const np={...(nc.principles||{near:0,fast:0,low:0,accurate:0,stable:0})};
        ['near','fast','low','accurate','stable'].forEach(k=>{np[k]=Math.min(10,(np[k]||0)+1)});
        nc.principles=np;
        fi.push({icon:'📖',text:'全原則+1',color:'#f4d03f'},{icon:'🔧',text:'技術+2',color:'#42a5f5'});
        setVisited(v=>({...v,lecture:true}));
        return '聽了國際級教練的講座，收穫滿滿！';
      }},
  ];

  function doActivity(act){
    if(!act.check())return;
    sfx('cheer');
    const nc={...c,stats:{...c.stats},activeEffects:[...(c.activeEffects||[])],principles:{...(c.principles||{near:0,fast:0,low:0,accurate:0,stable:0})}};
    const fi=[];
    const txt=act.apply(nc,fi);
    setFloats(fi);setMsg(txt);setC(nc);
  }

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-auto">
      <div className="max-w-lg mx-auto w-full">
        {floats&&<FloatingNum items={floats} onDone={()=>setFloats(null)}/>}

        <div className="flex justify-between items-center mb-2">
          <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-3 py-1 text-[10px] font-pixel">← 返回</button>
          <h2 className="font-pixel text-pixel-gold text-[10px]">🏦 老王基金會</h2>
          <span className="font-vt text-pixel-orange text-lg">💰{c.money}</span>
        </div>

        {/* SVG Scene */}
        <div className="pixel-border bg-pixel-charcoal p-1 mb-2">
          <svg viewBox="0 0 400 180" className="w-full" xmlns="http://www.w3.org/2000/svg">
            {/* Background - dark wood walls */}
            <rect width="400" height="180" fill="#3e2723"/>
            {/* Wainscoting */}
            <rect x="0" y="0" width="400" height="100" fill="#4e342e"/>
            <rect x="0" y="100" width="400" height="80" fill="#5d4037"/>
            {/* Wood panel lines */}
            {[0,80,160,240,320].map((px,i)=>
              <rect key={'wp'+i} x={px} y="0" width="78" height="100" fill="none" stroke="#3e2723" strokeWidth="1.5" rx="1"/>
            )}

            {/* Chandelier */}
            <g transform="translate(200,0)">
              <rect x="-1" y="0" width="2" height="15" fill="#8d6e3f"/>
              <ellipse cx="0" cy="18" rx="25" ry="8" fill="#8d6e3f"/>
              <ellipse cx="0" cy="16" rx="22" ry="6" fill="#a0845c"/>
              {/* Candle lights */}
              {[-15,-8,0,8,15].map((lx,i)=>
                <g key={'ch'+i}>
                  <rect x={lx-1} y="10" width="2" height="6" fill="#fff9c4"/>
                  <ellipse cx={lx} cy="8" rx="3" ry="4" fill="#fff9c4" opacity={chandelierGlow}/>
                  <ellipse cx={lx} cy="6" rx="5" ry="6" fill="#fff176" opacity={chandelierGlow*0.4}/>
                </g>
              )}
            </g>

            {/* Warm light overlay */}
            <rect width="400" height="180" fill="#fff9c4" opacity="0.04"/>

            {/* Bookshelf - left wall */}
            <g transform="translate(10,15)">
              <rect x="0" y="0" width="60" height="80" fill="#5d4037" stroke="#3e2723" strokeWidth="1.5" rx="1"/>
              {/* Shelves */}
              {[0,20,40,60].map((sy,i)=>
                <rect key={'sh'+i} x="0" y={sy} width="60" height="2" fill="#4e342e"/>
              )}
              {/* Books */}
              {[{x:3,h:16,c:'#c62828'},{x:9,h:14,c:'#1565c0'},{x:14,h:17,c:'#2e7d32'},{x:19,h:15,c:'#f9a825'},{x:24,h:16,c:'#6a1b9a'},
                {x:3,h:14,c:'#ef6c00'},{x:9,h:16,c:'#00695c'},{x:14,h:13,c:'#ad1457'},{x:19,h:15,c:'#283593'},{x:24,h:14,c:'#4e342e'},
                {x:3,h:15,c:'#1b5e20'},{x:9,h:13,c:'#b71c1c'},{x:14,h:16,c:'#0d47a1'},{x:19,h:14,c:'#e65100'},{x:24,h:15,c:'#4a148c'}].map((b,i)=>
                <rect key={'bk'+i} x={b.x+Math.floor(i/5)*0} y={2+Math.floor(i/5)*20+(18-b.h)} width="4" height={b.h} rx="0.5" fill={b.c}/>
              )}
              {/* Small trophy on shelf */}
              <polygon points="45,17 48,10 51,17" fill="#f4d03f"/>
              <rect x="46" y="17" width="4" height="2" fill="#f4d03f"/>
            </g>

            {/* Gold framed certificates on wall */}
            <g transform="translate(85,20)">
              <rect x="0" y="0" width="40" height="30" rx="1" fill="#fff8e1" stroke="#f4d03f" strokeWidth="2"/>
              <text x="20" y="12" textAnchor="middle" fill="#5d4037" fontSize="4" fontFamily="monospace">Certificate</text>
              <text x="20" y="20" textAnchor="middle" fill="#5d4037" fontSize="3" fontFamily="monospace">of Excellence</text>
              <circle cx="20" cy="26" r="2" fill="#f4d03f"/>
            </g>
            <g transform="translate(135,22)">
              <rect x="0" y="0" width="35" height="26" rx="1" fill="#fff8e1" stroke="#f4d03f" strokeWidth="2"/>
              <text x="17" y="11" textAnchor="middle" fill="#5d4037" fontSize="3.5" fontFamily="monospace">Foundation</text>
              <text x="17" y="18" textAnchor="middle" fill="#5d4037" fontSize="3" fontFamily="monospace">Award</text>
              <rect x="12" y="21" width="10" height="1.5" fill="#f4d03f"/>
            </g>

            {/* Sign - 老王基金會 */}
            <rect x="230" y="18" width="100" height="24" rx="2" fill="#1a1c2c" stroke="#f4d03f" strokeWidth="2"/>
            <text x="280" y="35" textAnchor="middle" fill="#f4d03f" fontSize="10" fontFamily="monospace" fontWeight="bold">老王基金會</text>

            {/* Floor - carpet */}
            <rect x="0" y="130" width="400" height="50" fill="#6d4c41"/>
            <rect x="30" y="135" width="340" height="40" rx="2" fill="#8d6e3f" opacity="0.6"/>
            {/* Carpet pattern */}
            <rect x="35" y="140" width="330" height="30" rx="1" fill="none" stroke="#a0845c" strokeWidth="1" opacity="0.5"/>
            <rect x="42" y="145" width="316" height="20" rx="1" fill="none" stroke="#a0845c" strokeWidth="0.5" opacity="0.4"/>

            {/* Large desk */}
            <rect x="150" y="105" width="160" height="30" rx="3" fill="#5d4037" stroke="#4e342e" strokeWidth="1.5"/>
            <rect x="155" y="108" width="150" height="24" rx="2" fill="#6d4c41"/>
            {/* Desk front panel detail */}
            <rect x="165" y="112" width="55" height="16" rx="1" fill="none" stroke="#8d6e3f" strokeWidth="0.8"/>
            <rect x="240" y="112" width="55" height="16" rx="1" fill="none" stroke="#8d6e3f" strokeWidth="0.8"/>
            {/* Desk legs */}
            <rect x="160" y="133" width="6" height="12" fill="#4e342e"/>
            <rect x="295" y="133" width="6" height="12" fill="#4e342e"/>

            {/* Tea set on desk */}
            <g transform="translate(175,95)">
              {/* Teapot */}
              <ellipse cx="0" cy="8" rx="10" ry="7" fill="#e0e0e0" stroke="#bdbdbd" strokeWidth="0.8"/>
              <rect x="-3" y="0" width="6" height="3" rx="1" fill="#e0e0e0"/>
              <ellipse cx="0" cy="1" rx="4" ry="1.5" fill="#bdbdbd"/>
              {/* Spout */}
              <path d="M10,6 Q16,4 14,0" stroke="#bdbdbd" strokeWidth="1.5" fill="none"/>
              {/* Handle */}
              <path d="M-10,4 Q-16,8 -10,12" stroke="#bdbdbd" strokeWidth="1.5" fill="none"/>
              {/* Steam from teapot */}
              <path d={`M-2,${-2+steamY1} Q0,${-6+steamY1} 2,${-9+steamY1}`} stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.5"/>
              <path d={`M1,${-1+steamY2} Q3,${-5+steamY2} 1,${-8+steamY2}`} stroke="#fff" strokeWidth="0.6" fill="none" opacity="0.4"/>
              {/* Cup 1 */}
              <ellipse cx="20" cy="8" rx="5" ry="4" fill="#e0e0e0" stroke="#bdbdbd" strokeWidth="0.5"/>
              <ellipse cx="20" cy="6" rx="4" ry="2" fill="#8d6e3f"/>
              {/* Steam from cup */}
              <path d={`M19,${2+steamY2*0.7} Q20,${-1+steamY2*0.7} 21,${-3+steamY2*0.7}`} stroke="#fff" strokeWidth="0.5" fill="none" opacity="0.4"/>
              {/* Cup 2 */}
              <ellipse cx="32" cy="8" rx="5" ry="4" fill="#e0e0e0" stroke="#bdbdbd" strokeWidth="0.5"/>
              <ellipse cx="32" cy="6" rx="4" ry="2" fill="#8d6e3f"/>
            </g>

            {/* Potted orchid - right side */}
            <g transform="translate(355,75)">
              <rect x="-8" y="20" width="16" height="14" rx="2" fill="#8d6e3f" stroke="#6d4c41" strokeWidth="1"/>
              <ellipse cx="0" cy="20" rx="9" ry="3" fill="#6d4c41"/>
              {/* Stems */}
              <path d="M0,18 Q-5,5 -12,-5" stroke="#4caf50" strokeWidth="1.2" fill="none"/>
              <path d="M0,18 Q3,8 8,0" stroke="#4caf50" strokeWidth="1" fill="none"/>
              {/* Orchid flowers */}
              <circle cx="-12" cy="-5" r="3.5" fill="#e1bee7"/>
              <circle cx="-12" cy="-5" r="1.5" fill="#ce93d8"/>
              <circle cx="-9" cy="-11" r="3" fill="#f3e5f5"/>
              <circle cx="-9" cy="-11" r="1.2" fill="#ce93d8"/>
              <circle cx="8" cy="0" r="3" fill="#e1bee7"/>
              <circle cx="8" cy="0" r="1.2" fill="#ce93d8"/>
              {/* Leaves */}
              <path d="M-2,20 Q-10,25 -6,30" stroke="#388e3c" strokeWidth="1.5" fill="#4caf50" opacity="0.7"/>
              <path d="M2,20 Q10,24 7,29" stroke="#388e3c" strokeWidth="1.5" fill="#4caf50" opacity="0.7"/>
            </g>

            {/* Old Wang - distinguished gentleman behind desk — clickable */}
            <g transform={`translate(230,${62+wangBreath})`} onClick={clickWang} style={{cursor:'pointer'}}>
              {/* Chair back */}
              <rect x="-18" y="-5" width="36" height="40" rx="4" fill="#4e342e" stroke="#3e2723" strokeWidth="1"/>
              <rect x="-15" y="-2" width="30" height="34" rx="3" fill="#6d4c41"/>
              {/* Body - suit */}
              <rect x="-12" y="15" width="24" height="22" rx="3" fill="#263238"/>
              {/* White shirt collar */}
              <path d="M-6,15 L0,20 L6,15" fill="#fff" stroke="#e0e0e0" strokeWidth="0.5"/>
              {/* Tie */}
              <rect x="-1.5" y="19" width="3" height="12" rx="0.5" fill="#c62828"/>
              {/* Head */}
              <circle cx="0" cy="5" r="10" fill="#ffcc80"/>
              {/* Hair - gray, neat */}
              <path d="M-10,2 Q-10,-8 -4,-10 Q0,-12 4,-10 Q10,-8 10,2" fill="#9e9e9e"/>
              <path d="M-9,0 Q-9,-6 0,-8 Q9,-6 9,0" fill="#bdbdbd"/>
              {/* Round glasses */}
              <circle cx="-4" cy="4" r="3.5" fill="none" stroke="#5d4037" strokeWidth="1"/>
              <circle cx="4" cy="4" r="3.5" fill="none" stroke="#5d4037" strokeWidth="1"/>
              <line x1="-0.5" y1="4" x2="0.5" y2="4" stroke="#5d4037" strokeWidth="0.8"/>
              <line x1="-7.5" y1="4" x2="-10" y2="3" stroke="#5d4037" strokeWidth="0.6"/>
              <line x1="7.5" y1="4" x2="10" y2="3" stroke="#5d4037" strokeWidth="0.6"/>
              {/* Eyes behind glasses - kind */}
              <circle cx="-4" cy="4.5" r="1" fill="#3e2723"/>
              <circle cx="4" cy="4.5" r="1" fill="#3e2723"/>
              <circle cx="-3.5" cy="4" r="0.4" fill="#fff"/>
              <circle cx="4.5" cy="4" r="0.4" fill="#fff"/>
              {/* Kind smile */}
              <path d="M-3,8 Q0,11 3,8" stroke="#5d4037" strokeWidth="0.8" fill="none"/>
              {/* Eyebrows - gentle */}
              <path d="M-6,1 Q-4,-0.5 -2,1" stroke="#9e9e9e" strokeWidth="0.7" fill="none"/>
              <path d="M2,1 Q4,-0.5 6,1" stroke="#9e9e9e" strokeWidth="0.7" fill="none"/>
              {/* Arms on desk */}
              <path d="M-12,25 Q-18,32 -14,38" stroke="#263238" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <path d="M12,25 Q18,32 14,38" stroke="#263238" strokeWidth="4" fill="none" strokeLinecap="round"/>
              {/* Hands */}
              <circle cx="-14" cy="38" r="3" fill="#ffcc80"/>
              <circle cx="14" cy="38" r="3" fill="#ffcc80"/>
              {/* Label */}
              <text x="0" y="52" textAnchor="middle" fill="#f4d03f" fontSize="6" fontFamily="monospace">老王</text>
            </g>

            {/* Wang speech bubble */}
            {wangMsg&&<g className="pop-in">
              <rect x="90" y="25" width={Math.min(wangMsg.length*7+14,170)} height="22" rx="6" fill="#fff" stroke="#f4d03f" strokeWidth="1"/>
              <polygon points="230,47 222,52 238,52" fill="#fff"/>
              <text x="98" y="40" fontSize="8" fill="#333" fontFamily="sans-serif">{wangMsg}</text>
              {(c.fatigue||0)>60&&<text x="80" y="36" fontSize="8">💧</text>}
              {c.medals&&c.medals.length>0&&(c.fatigue||0)<=60&&<text x="80" y="36" fontSize="8">✨</text>}
            </g>}

            {/* Warm ambient glow */}
            <ellipse cx="200" cy="18" rx="120" ry="40" fill="#fff9c4" opacity="0.03"/>
          </svg>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-2">
          <span className="font-vt text-pixel-gold text-sm" style={{textShadow:'1px 1px 0 #000'}}>世界級選手才能獲得基金會贊助</span>
        </div>

        {/* Message display */}
        {msg&&(
          <div className="pixel-border bg-pixel-charcoal p-2 mb-2 text-center">
            <span className="font-vt text-pixel-cyan text-sm">{msg}</span>
          </div>
        )}

        {/* Activity cards - 2x2 grid */}
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          {ACTIVITIES.map(act=>{
            const canDo=act.check();
            const done=!canDo&&act.costType==='free';
            return(
              <button key={act.id} onClick={()=>canDo&&doActivity(act)} disabled={!canDo}
                className={`pixel-border p-2 text-left relative ${canDo?'bg-pixel-charcoal hover:bg-pixel-darkblue cursor-pointer':done?'bg-pixel-gray opacity-50':'bg-pixel-charcoal opacity-60'}`}>
                {done&&<span className="absolute top-1 right-1 text-[10px] font-vt text-pixel-green">✓</span>}
                {!canDo&&!done&&<span className="absolute top-1 right-1 text-sm">💰</span>}
                <div className="flex items-center gap-1.5">
                  <span className={`text-xl ${!canDo?'grayscale':''}`}>{act.icon}</span>
                  <div>
                    <div className={`font-pixel text-[8px] ${!canDo?'text-pixel-gray':'text-pixel-light'}`}>{act.name}</div>
                    <div className="font-vt text-pixel-orange text-xs">
                      {act.costType==='money'?`💰${act.cost}`:'免費'}
                    </div>
                  </div>
                </div>
                <div className={`font-vt text-[10px] mt-0.5 ${!canDo?'text-pixel-gray':'text-pixel-cyan'}`}>{act.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Status bar */}
        <div className="pixel-border bg-pixel-charcoal p-2 flex justify-between">
          <span className="font-vt text-pixel-green text-sm">⚡ {c.stamina}/{ms}</span>
          <span className="font-vt text-pixel-orange text-sm">😓 {c.fatigue||0}</span>
          <span className="font-vt text-pixel-gold text-sm">💰 {c.money}</span>
          <span className="font-vt text-pixel-cyan text-sm">🏆 Lv{c.eventLevel||0}</span>
        </div>
      </div>
    </div>
  );
}

// ── TIANLIAO 田寮移訓 ──
function TianliaoScreen({c,setC,go}){
  const ms=maxSta(c.stats.sta);
  const[floats,setFloats]=useState(null);
  const[msg,setMsg]=useState(null);
  const[frame,setFrame]=useState(0);
  const[visited,setVisited]=useState({});
  const[reactAnim,setReactAnim]=useState(null);
  useEffect(()=>{const t=setInterval(()=>setFrame(f=>(f+1)%240),50);return()=>clearInterval(t)},[]);

  const[grandpaMsg,setGrandpaMsg]=useState(null);
  const breath=Math.sin(frame*0.04)*1.5;
  const chickenX=80+Math.sin(frame*0.06)*15;
  const chickenY=185+Math.sin(frame*0.09)*3;
  const cloudDrift=Math.sin(frame*0.015)*8;

  const grandpaDialogs=(()=>{
    const normal=['我種田種了一輩子','身體是練出來的','以前哪有什麼健身房','你阿嬤煮的最好吃','山上空氣好，多來','年輕人就是要吃苦','我年輕時也是壯漢','這田是我一個人開墾的','太陽底下才能長結實','做人跟種田一樣要腳踏實地'];
    const tired=(c.fatigue||0)>60?['你這樣不行...先休息','年輕人不要太拼命']:[];
    const won=c.medals&&c.medals.length>0?['聽說你比賽贏了？好孫！','阿公以你為榮！']:[];
    const streak=(c.streak||0)>=5?['不錯嘛，有在認真練','你現在跟我年輕時一樣拼']:[];
    return[...normal,...tired,...won,...streak];
  })();
  function clickGrandpa(){
    sfx('tap');setGrandpaMsg(grandpaDialogs[Math.floor(Math.random()*grandpaDialogs.length)]);
    setTimeout(()=>setGrandpaMsg(null),2500);
  }

  const ACTIVITIES=[
    {id:'rice',icon:'🏃',name:'扛米跑操場',cost:20,
      desc:'力量+2 體力+1 💰+80',
      check:()=>!visited.rice&&c.stamina>=20,
      apply:(nc,fi)=>{
        nc.stamina=Math.max(0,nc.stamina-20);
        const rate=Math.min(95,50+nc.stats.sta*0.4);
        if(Math.random()*100<rate){
          nc.money+=80;nc.stats.str=Math.min(100,nc.stats.str+2);nc.stats.sta=Math.min(100,nc.stats.sta+1);
          fi.push({icon:'💪',text:'力量+2',color:'#ef5350'},{icon:'❤️',text:'體力+1',color:'#38b764'},{icon:'💰',text:'+80',color:'#f4d03f'});
          setReactAnim('success');
          return '阿公：不錯嘛！像年輕時的我';
        }else{
          nc.stats.sta=Math.min(100,nc.stats.sta+1);
          fi.push({icon:'❤️',text:'體力+1',color:'#38b764'});
          setReactAnim('fail');
          return '阿公：太嫩了！再練';
        }
      }},
    {id:'mountain',icon:'⛰️',name:'爬山負重',cost:25,
      desc:'體力+2 恢復+1 💰+100',
      check:()=>!visited.mountain&&c.stamina>=25,
      apply:(nc,fi)=>{
        nc.stamina=Math.max(0,nc.stamina-25);
        const rate=Math.min(95,45+nc.stats.sta*0.3+nc.stats.str*0.2);
        if(Math.random()*100<rate){
          nc.money+=100;nc.stats.sta=Math.min(100,nc.stats.sta+2);nc.stats.rec=Math.min(100,nc.stats.rec+1);
          fi.push({icon:'❤️',text:'體力+2',color:'#38b764'},{icon:'💚',text:'恢復+1',color:'#26c6da'},{icon:'💰',text:'+100',color:'#f4d03f'});
          setReactAnim('success');
          return '阿公：山頂的風景值得！';
        }else{
          nc.stats.sta=Math.min(100,nc.stats.sta+1);
          fi.push({icon:'❤️',text:'體力+1',color:'#38b764'});
          setReactAnim('fail');
          return '阿公：半路就不行了？';
        }
      }},
    {id:'stone',icon:'💎',name:'搬石頭',cost:20,
      desc:'力量+2 💰+70',
      check:()=>!visited.stone&&c.stamina>=20,
      apply:(nc,fi)=>{
        nc.stamina=Math.max(0,nc.stamina-20);
        const rate=Math.min(95,50+nc.stats.str*0.4);
        if(Math.random()*100<rate){
          nc.money+=70;nc.stats.str=Math.min(100,nc.stats.str+2);
          fi.push({icon:'💪',text:'力量+2',color:'#ef5350'},{icon:'💰',text:'+70',color:'#f4d03f'});
          setReactAnim('success');
          return '阿公：這石頭跟你差不多重';
        }else{
          nc.stats.str=Math.min(100,nc.stats.str+1);
          fi.push({icon:'💪',text:'力量+1',color:'#ef5350'});
          setReactAnim('fail');
          return '阿公：手滑了齁';
        }
      }},
    {id:'radish',icon:'🥕',name:'拔蘿蔔',cost:10,
      desc:'爆發+1 恢復+1 💰+50',
      check:()=>!visited.radish&&c.stamina>=10,
      apply:(nc,fi)=>{
        nc.stamina=Math.max(0,nc.stamina-10);
        const rate=Math.min(95,70+nc.stats.pwr*0.2);
        if(Math.random()*100<rate){
          nc.money+=50;nc.stats.pwr=Math.min(100,nc.stats.pwr+1);nc.stats.rec=Math.min(100,nc.stats.rec+1);
          fi.push({icon:'⚡',text:'爆發+1',color:'#ef7d57'},{icon:'💚',text:'恢復+1',color:'#26c6da'},{icon:'💰',text:'+50',color:'#f4d03f'});
          setReactAnim('success');
          return '阿公：今晚加菜！';
        }else{
          fi.push({icon:'😅',text:'失敗',color:'#b13e53'});
          setReactAnim('fail');
          return '阿公：蘿蔔比你還頑固';
        }
      }},
    {id:'chicken',icon:'🐔',name:'追雞特訓',cost:15,
      desc:'爆發+2 體力+1 💰+120',
      check:()=>!visited.chicken&&c.stamina>=15,
      apply:(nc,fi)=>{
        nc.stamina=Math.max(0,nc.stamina-15);
        const rate=Math.min(95,40+nc.stats.pwr*0.3+nc.stats.sta*0.3);
        if(Math.random()*100<rate){
          nc.money+=120;nc.stats.pwr=Math.min(100,nc.stats.pwr+2);nc.stats.sta=Math.min(100,nc.stats.sta+1);
          fi.push({icon:'⚡',text:'爆發+2',color:'#ef7d57'},{icon:'❤️',text:'體力+1',color:'#38b764'},{icon:'💰',text:'+120',color:'#f4d03f'});
          setReactAnim('success');
          return '阿公：哈哈哈抓到了！';
        }else{
          nc.stats.pwr=Math.min(100,nc.stats.pwr+1);
          fi.push({icon:'⚡',text:'爆發+1',color:'#ef7d57'});
          setReactAnim('fail');
          return '阿公：連雞都追不到...';
        }
      }},
  ];

  function doActivity(act){
    if(!act.check())return;
    sfx('train');
    const nc={...c,stats:{...c.stats}};
    const fi=[];
    const txt=act.apply(nc,fi);
    setFloats(fi);setMsg(txt);setC(nc);
    setVisited(v=>({...v,[act.id]:true}));
    setTimeout(()=>setReactAnim(null),1500);
  }

  return(
    <div className="h-screen bg-pixel-dark flex flex-col overflow-hidden">
      <div className="max-w-lg mx-auto w-full flex flex-col h-full">
        {floats&&<FloatingNum items={floats} onDone={()=>setFloats(null)}/>}

        <div className="flex justify-between items-center mb-1">
          <button onClick={()=>go('hub')} className="pixel-btn bg-pixel-charcoal text-pixel-light px-3 py-1 text-[10px] font-pixel">← 返回</button>
          <h2 className="font-pixel text-pixel-gold text-[10px]">⛰️ 田寮移訓</h2>
          <span className="font-vt text-pixel-orange text-lg">💰{c.money}</span>
        </div>

        {/* SVG Scene */}
        <div className="pixel-border bg-pixel-charcoal p-1 mb-1">
          <svg viewBox="0 0 400 220" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tl-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#87CEEB"/>
                <stop offset="100%" stopColor="#b8e6d0"/>
              </linearGradient>
              <linearGradient id="tl-hill1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4caf50"/>
                <stop offset="100%" stopColor="#2e7d32"/>
              </linearGradient>
              <linearGradient id="tl-hill2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#66bb6a"/>
                <stop offset="100%" stopColor="#388e3c"/>
              </linearGradient>
              <linearGradient id="tl-ground" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8d6e3f"/>
                <stop offset="100%" stopColor="#6d4c1f"/>
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="400" height="220" fill="url(#tl-sky)"/>

            {/* Sun */}
            <circle cx="340" cy="35" r="20" fill="#fff9c4" opacity="0.9"/>
            <circle cx="340" cy="35" r="30" fill="#fff176" opacity="0.15"/>

            {/* Clouds */}
            <g transform={`translate(${cloudDrift},0)`}>
              <ellipse cx="80" cy="30" rx="30" ry="10" fill="white" opacity="0.8"/>
              <ellipse cx="65" cy="25" rx="18" ry="8" fill="white" opacity="0.85"/>
              <ellipse cx="95" cy="27" rx="15" ry="7" fill="white" opacity="0.82"/>
            </g>
            <g transform={`translate(${-cloudDrift*0.7},0)`}>
              <ellipse cx="250" cy="22" rx="25" ry="9" fill="white" opacity="0.7"/>
              <ellipse cx="238" cy="17" rx="16" ry="7" fill="white" opacity="0.75"/>
            </g>

            {/* Far mountains */}
            <path d="M0,120 Q30,60 80,80 Q120,50 160,75 Q200,40 250,70 Q300,45 350,65 Q380,55 400,80 L400,130 L0,130Z" fill="url(#tl-hill1)" opacity="0.6"/>
            {/* Mid hills */}
            <path d="M0,130 Q50,100 120,115 Q180,90 250,110 Q320,95 400,120 L400,150 L0,150Z" fill="url(#tl-hill2)" opacity="0.8"/>

            {/* Ground / farmland */}
            <rect x="0" y="145" width="400" height="75" fill="#7ec850"/>
            {/* Rice paddy rows */}
            {[150,158,166,174,182,190].map((y,i)=>
              <line key={'rp'+i} x1="0" y1={y} x2={i%2===0?180:160} y2={y} stroke="#5aad36" strokeWidth="1.5" opacity="0.5"/>
            )}

            {/* Dirt path */}
            <path d="M200,220 Q220,200 250,185 Q300,165 370,155" stroke="#c4a060" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d="M200,220 Q220,200 250,185 Q300,165 370,155" stroke="#d4b880" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.5"/>

            {/* Wooden training shed */}
            <g transform="translate(300,110)">
              {/* Posts */}
              <rect x="0" y="10" width="4" height="40" fill="#6d4c1f"/>
              <rect x="56" y="10" width="4" height="40" fill="#6d4c1f"/>
              {/* Roof */}
              <polygon points="-5,10 30,0 65,10" fill="#8d6e3f"/>
              <polygon points="-3,10 30,2 63,10" fill="#a0845c" opacity="0.6"/>
              {/* Cross beam */}
              <rect x="0" y="10" width="60" height="3" fill="#8d6e3f"/>
              {/* Barbell inside */}
              <rect x="8" y="35" width="44" height="2" rx="1" fill="#bdbdbd"/>
              <rect x="5" y="32" width="6" height="8" rx="1" fill="#c62828"/>
              <rect x="49" y="32" width="6" height="8" rx="1" fill="#c62828"/>
            </g>

            {/* Rice bags */}
            <g transform="translate(50,180)">
              <rect x="0" y="0" width="18" height="14" rx="2" fill="#e8d5a3" stroke="#c4a060" strokeWidth="1"/>
              <text x="9" y="10" textAnchor="middle" fill="#8d6e3f" fontSize="6" fontFamily="monospace">米</text>
              <rect x="14" y="-4" width="16" height="13" rx="2" fill="#e8d5a3" stroke="#c4a060" strokeWidth="1"/>
              <text x="22" y="6" textAnchor="middle" fill="#8d6e3f" fontSize="6" fontFamily="monospace">米</text>
            </g>

            {/* Stones */}
            <ellipse cx="370" cy="200" rx="10" ry="7" fill="#9e9e9e" stroke="#757575" strokeWidth="1"/>
            <ellipse cx="385" cy="205" rx="8" ry="5" fill="#bdbdbd" stroke="#9e9e9e" strokeWidth="1"/>
            <ellipse cx="360" cy="207" rx="6" ry="4" fill="#757575"/>

            {/* Chickens */}
            <g transform={`translate(${chickenX},${chickenY})`}>
              {/* Body */}
              <ellipse cx="0" cy="0" rx="7" ry="5" fill="#fff9c4"/>
              {/* Head */}
              <circle cx="7" cy="-3" r="3.5" fill="#fff9c4"/>
              {/* Eye */}
              <circle cx="8.5" cy="-3.5" r="0.8" fill="#000"/>
              {/* Beak */}
              <polygon points="10,-3 13,-2.5 10,-2" fill="#ff8f00"/>
              {/* Comb */}
              <path d="M6,-6 Q7,-8 8,-6 Q9,-8 10,-6" fill="#c62828"/>
              {/* Legs */}
              <line x1="-2" y1="4" x2="-3" y2="9" stroke="#ff8f00" strokeWidth="1"/>
              <line x1="2" y1="4" x2="3" y2="9" stroke="#ff8f00" strokeWidth="1"/>
              {/* Tail */}
              <path d="M-7,0 Q-12,-3 -10,-6" stroke="#8d6e3f" strokeWidth="1.5" fill="none"/>
            </g>
            {/* Second chicken */}
            <g transform={`translate(${chickenX+30},${chickenY+5}) scale(-0.8,0.8)`}>
              <ellipse cx="0" cy="0" rx="7" ry="5" fill="#ffe0b2"/>
              <circle cx="7" cy="-3" r="3.5" fill="#ffe0b2"/>
              <circle cx="8.5" cy="-3.5" r="0.8" fill="#000"/>
              <polygon points="10,-3 13,-2.5 10,-2" fill="#ff8f00"/>
              <path d="M6,-6 Q7,-8 8,-6" fill="#c62828"/>
              <line x1="-2" y1="4" x2="-3" y2="9" stroke="#ff8f00" strokeWidth="1"/>
              <line x1="2" y1="4" x2="3" y2="9" stroke="#ff8f00" strokeWidth="1"/>
            </g>

            {/* Radish patch */}
            <g transform="translate(15,195)">
              {[0,10,20].map((rx,i)=>
                <g key={'rad'+i}>
                  <ellipse cx={rx} cy="8" rx="3" ry="4" fill="#ef5350" opacity="0.7"/>
                  <line x1={rx} y1="4" x2={rx-1} y2="-2" stroke="#4caf50" strokeWidth="1.5"/>
                  <line x1={rx} y1="4" x2={rx+2} y2="-1" stroke="#4caf50" strokeWidth="1"/>
                </g>
              )}
            </g>

            {/* ═══ LARGE CHIBI 阿公 — clickable ═══ */}
            <g transform={`translate(200,${88+breath})`} onClick={clickGrandpa} style={{cursor:'pointer'}}>
              {/* === BODY === */}
              {/* Work pants */}
              <rect x="-18" y="32" width="36" height="30" rx="4" fill="#5d4037"/>
              {/* Left leg */}
              <rect x="-16" y="55" width="14" height="20" rx="3" fill="#5d4037"/>
              {/* Right leg */}
              <rect x="2" y="55" width="14" height="20" rx="3" fill="#5d4037"/>
              {/* Rubber boots */}
              <rect x="-18" y="70" width="16" height="10" rx="3" fill="#37474f"/>
              <rect x="2" y="70" width="16" height="10" rx="3" fill="#37474f"/>
              <rect x="-18" y="70" width="16" height="4" rx="2" fill="#546e7a" opacity="0.4"/>
              <rect x="2" y="70" width="16" height="4" rx="2" fill="#546e7a" opacity="0.4"/>

              {/* Torso - sleeveless undershirt */}
              <rect x="-16" y="5" width="32" height="30" rx="4" fill="#e0e0e0"/>
              {/* Undershirt neckline */}
              <path d="M-8,5 Q0,10 8,5" fill="none" stroke="#bdbdbd" strokeWidth="1"/>

              {/* Muscular arms (tanned skin) */}
              {/* Left arm - on hip */}
              <path d="M-16,10 Q-30,18 -24,32" stroke="#b87333" strokeWidth="10" fill="none" strokeLinecap="round"/>
              <circle cx="-24" cy="32" r="5" fill="#b87333"/>
              {/* Right arm - on hip */}
              <path d="M16,10 Q30,18 24,32" stroke="#b87333" strokeWidth="10" fill="none" strokeLinecap="round"/>
              <circle cx="24" cy="32" r="5" fill="#b87333"/>

              {/* Belt */}
              <rect x="-18" y="32" width="36" height="5" rx="1" fill="#3e2723"/>
              <rect x="-3" y="33" width="6" height="3" rx="1" fill="#8d6e3f"/>

              {/* Muscle definition on arms */}
              <path d="M-22,16 Q-26,22 -24,26" stroke="#a06020" strokeWidth="0.8" fill="none" opacity="0.4"/>
              <path d="M22,16 Q26,22 24,26" stroke="#a06020" strokeWidth="0.8" fill="none" opacity="0.4"/>

              {/* === HEAD === */}
              <g transform="translate(0,-18)">
                {/* Head shape - tanned */}
                <ellipse cx="0" cy="0" rx="22" ry="20" fill="#c8944a"/>
                {/* Straw hat */}
                <ellipse cx="0" cy="-14" rx="30" ry="8" fill="#e8d5a3"/>
                <ellipse cx="0" cy="-14" rx="28" ry="6" fill="#f0e0b0"/>
                <path d="M-18,-14 Q0,-26 18,-14" fill="#d4b880"/>
                <path d="M-16,-14 Q0,-24 16,-14" fill="#e8d5a3"/>
                {/* Hat band */}
                <rect x="-18" y="-16" width="36" height="3" rx="1" fill="#8d6e3f"/>

                {/* Wrinkles around eyes */}
                <path d="M-17,-2 Q-15,-3 -13,-2" stroke="#a06020" strokeWidth="0.6" fill="none"/>
                <path d="M13,-2 Q15,-3 17,-2" stroke="#a06020" strokeWidth="0.6" fill="none"/>
                {/* Forehead wrinkles */}
                <path d="M-8,-8 Q0,-9 8,-8" stroke="#a06020" strokeWidth="0.5" fill="none" opacity="0.5"/>

                {/* Eyes - friendly squint */}
                <g>
                  {/* Left eye */}
                  <ellipse cx="-8" cy="0" rx="5" ry={reactAnim==='success'?2:4} fill="white"/>
                  <ellipse cx="-8" cy={reactAnim==='success'?0:1} rx="3" ry={reactAnim==='success'?1.5:3} fill="#3e2723"/>
                  {reactAnim!=='success'&&<circle cx="-7" cy="-0.5" r="1" fill="white"/>}
                  {/* Right eye */}
                  <ellipse cx="8" cy="0" rx="5" ry={reactAnim==='success'?2:4} fill="white"/>
                  <ellipse cx="8" cy={reactAnim==='success'?0:1} rx="3" ry={reactAnim==='success'?1.5:3} fill="#3e2723"/>
                  {reactAnim!=='success'&&<circle cx="9" cy="-0.5" r="1" fill="white"/>}
                </g>

                {/* Eyebrows - thick */}
                <rect x="-14" y="-6" width="10" height="2.5" rx="1" fill="#5d4037"/>
                <rect x="4" y="-6" width="10" height="2.5" rx="1" fill="#5d4037"/>

                {/* Stubble/beard */}
                <g opacity="0.3">
                  {[[-6,10],[-3,11],[0,12],[3,11],[6,10],[-4,13],[0,14],[4,13]].map(([bx,by],i)=>
                    <circle key={'stb'+i} cx={bx} cy={by} r="0.6" fill="#5d4037"/>
                  )}
                </g>

                {/* Mouth */}
                {reactAnim==='success'?(
                  <g>
                    <path d="M-8,8 Q0,18 8,8" stroke="#5d4037" strokeWidth="1.5" fill="#ef5350"/>
                    <rect x="-2" y="8" width="4" height="3" rx="0.5" fill="white"/>
                  </g>
                ):reactAnim==='fail'?(
                  <path d="M-5,10 Q0,8 5,10" stroke="#5d4037" strokeWidth="1.5" fill="none"/>
                ):(
                  <g>
                    <path d="M-6,8 Q0,14 6,8" stroke="#5d4037" strokeWidth="1.5" fill="none"/>
                  </g>
                )}

                {/* Blush */}
                <ellipse cx="-14" cy="5" rx="4" ry="2.5" fill="#ef9a9a" opacity="0.4"/>
                <ellipse cx="14" cy="5" rx="4" ry="2.5" fill="#ef9a9a" opacity="0.4"/>
              </g>

              {/* Thumbs up on success */}
              {reactAnim==='success'&&(
                <g transform="translate(32,-5)" className="pop-in">
                  <circle cx="0" cy="0" r="8" fill="#b87333"/>
                  <rect x="-2" y="-12" width="4" height="10" rx="2" fill="#b87333"/>
                  <text x="12" y="4" fill="#f4d03f" fontSize="10" fontFamily="monospace" fontWeight="bold">!</text>
                </g>
              )}
              {/* Head shake on fail */}
              {reactAnim==='fail'&&(
                <text x="0" y="-42" textAnchor="middle" fill="#ef5350" fontSize="14" className="pop-in">✗</text>
              )}

              {/* Label */}
              <text x="0" y="90" textAnchor="middle" fill="#f4d03f" fontSize="8" fontFamily="monospace" fontWeight="bold">阿公</text>
            </g>

            {/* Grandpa speech bubble */}
            {grandpaMsg&&<g className="pop-in">
              <rect x="80" y="50" width={Math.min(grandpaMsg.length*7+14,160)} height="22" rx="6" fill="#fff" stroke="#8d6e3f" strokeWidth="1"/>
              <polygon points="200,72 192,76 208,76" fill="#fff"/>
              <text x="88" y="65" fontSize="8" fill="#333" fontFamily="sans-serif">{grandpaMsg}</text>
              {(c.fatigue||0)>60&&<text x="72" y="62" fontSize="8">💧</text>}
              {c.medals&&c.medals.length>0&&(c.fatigue||0)<=60&&<text x="72" y="62" fontSize="8">✨</text>}
            </g>}

            {/* Small tree left */}
            <g transform="translate(280,130)">
              <rect x="-2" y="0" width="4" height="18" fill="#6d4c1f"/>
              <circle cx="0" cy="-5" r="12" fill="#388e3c"/>
              <circle cx="-5" cy="-8" r="8" fill="#43a047"/>
              <circle cx="4" cy="-10" r="7" fill="#4caf50"/>
            </g>
            {/* Small tree right */}
            <g transform="translate(380,125)">
              <rect x="-2" y="0" width="4" height="15" fill="#6d4c1f"/>
              <circle cx="0" cy="-5" r="10" fill="#2e7d32"/>
              <circle cx="-4" cy="-8" r="7" fill="#388e3c"/>
            </g>
          </svg>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-1">
          <span className="font-vt text-pixel-gold text-sm" style={{textShadow:'1px 1px 0 #000'}}>阿公的戶外闖關挑戰！</span>
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
                      <div className="font-vt text-pixel-orange text-xs">-{act.cost}❤️</div>
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

// ── MITUO 彌陀基地 ──