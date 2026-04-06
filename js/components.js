/* ═══════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════ */

function PixelChar({gender,mood='normal',size=1,lifting=false}){
  const skin='#ffcd75',shirt=gender==='female'?'#b13e53':'#3b5dc9';
  const eyes=mood==='happy'?'◡':mood==='sad'?'╥':mood==='excited'?'★':mood==='focus'?'▪':'●';
  const mouth=mood==='happy'||mood==='excited'?'‿':mood==='sad'?'︵':mood==='focus'?'═':'─';
  const cls=lifting?'flex-anim':mood==='excited'?'bounce':mood==='happy'?'float':'';
  return(
    <div className={`flex flex-col items-center ${cls}`} style={{transform:`scale(${size})`}}>
      <div className="w-10 h-2 rounded-t-sm" style={{background:gender==='female'?'#5d275d':'#333c57'}}/>
      <div className="w-10 h-8 rounded-sm relative" style={{background:skin}}>
        <div className="absolute top-2 left-1.5 text-[8px] text-pixel-dark">{eyes}</div>
        <div className="absolute top-2 right-1.5 text-[8px] text-pixel-dark">{eyes}</div>
        {mood==='excited'&&<div className="absolute -top-1 -right-1 text-xs">✨</div>}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px]">{mouth}</div>
      </div>
      <div className="w-12 h-10 rounded-sm mt-0.5 relative flex justify-between px-0.5" style={{background:shirt}}>
        <div className={`w-3 h-7 rounded-sm mt-1 ${lifting?'-rotate-[25deg]':'rotate-3'}`} style={{background:skin,transition:'transform .3s'}}/>
        <div className="font-pixel text-[5px] text-pixel-white absolute top-3 left-1/2 -translate-x-1/2 opacity-60">
          {gender==='female'?'♀':'♂'}
        </div>
        <div className={`w-3 h-7 rounded-sm mt-1 ${lifting?'rotate-[25deg]':'-rotate-3'}`} style={{background:skin,transition:'transform .3s'}}/>
      </div>
      <div className="flex gap-1 mt-0.5"><div className="w-4 h-6 bg-pixel-charcoal rounded-sm"/><div className="w-4 h-6 bg-pixel-charcoal rounded-sm"/></div>
      <div className="flex gap-1 mt-0.5"><div className="w-5 h-2 bg-pixel-red rounded-sm"/><div className="w-5 h-2 bg-pixel-red rounded-sm"/></div>
    </div>
  );
}

// ── Character Avatar SVG Components ──
function CatSVG({colors,lifting}){
  return <g>
    <path d={lifting?"M25,85 Q5,60 15,40":"M25,85 Q5,75 10,60"} stroke={colors.bodyColor} strokeWidth="6" fill="none" strokeLinecap="round"/>
    <ellipse cx="50" cy="85" rx="22" ry="18" fill={colors.bodyColor}/>
    <rect x="32" y="95" width="10" height="14" rx="4" fill={colors.bodyColor}/>
    <rect x="58" y="95" width="10" height="14" rx="4" fill={colors.bodyColor}/>
    <ellipse cx="37" cy="108" rx="6" ry="3" fill="#9e9e9e"/>
    <ellipse cx="63" cy="108" rx="6" ry="3" fill="#9e9e9e"/>
    <circle cx="50" cy="50" r="28" fill={colors.bodyColor}/>
    <polygon points="28,30 22,8 40,25" fill={colors.bodyColor}/>
    <polygon points="72,30 78,8 60,25" fill={colors.bodyColor}/>
    <polygon points="30,28 26,14 38,25" fill="#e57373" opacity=".6"/>
    <polygon points="70,28 74,14 62,25" fill="#e57373" opacity=".6"/>
    <path d="M35,35 L40,30" stroke="#424242" strokeWidth="2" opacity=".4"/>
    <path d="M65,35 L60,30" stroke="#424242" strokeWidth="2" opacity=".4"/>
    <path d="M38,40 L42,35" stroke="#424242" strokeWidth="2" opacity=".4"/>
    <ellipse cx="40" cy="48" rx="7" ry="8" fill="white"/>
    <ellipse cx="60" cy="48" rx="7" ry="8" fill="white"/>
    <ellipse cx="40" cy="49" rx="3" ry="5" fill={colors.eyeColor}/>
    <ellipse cx="60" cy="49" rx="3" ry="5" fill={colors.eyeColor}/>
    <ellipse cx="40" cy="49" rx="1.5" ry="4" fill="#1b5e20"/>
    <ellipse cx="60" cy="49" rx="1.5" ry="4" fill="#1b5e20"/>
    <ellipse cx="38" cy="46" rx="2" ry="2" fill="white"/>
    <ellipse cx="58" cy="46" rx="2" ry="2" fill="white"/>
    <polygon points="50,54 47,58 53,58" fill="#e57373"/>
    <line x1="25" y1="55" x2="42" y2="56" stroke="#9e9e9e" strokeWidth="1"/>
    <line x1="25" y1="58" x2="42" y2="58" stroke="#9e9e9e" strokeWidth="1"/>
    <line x1="25" y1="61" x2="42" y2="60" stroke="#9e9e9e" strokeWidth="1"/>
    <line x1="75" y1="55" x2="58" y2="56" stroke="#9e9e9e" strokeWidth="1"/>
    <line x1="75" y1="58" x2="58" y2="58" stroke="#9e9e9e" strokeWidth="1"/>
    <line x1="75" y1="61" x2="58" y2="60" stroke="#9e9e9e" strokeWidth="1"/>
    <path d="M47,60 Q50,64 53,60" stroke="#795548" strokeWidth="1" fill="none"/>
    <rect x="36" y="68" width="28" height="5" rx="2" fill={colors.accentColor}/>
    <circle cx="50" cy="73" r="3" fill="#ffa000"/>
    <ellipse cx="33" cy="56" rx="5" ry="3" fill="#ef9a9a" opacity=".4"/>
    <ellipse cx="67" cy="56" rx="5" ry="3" fill="#ef9a9a" opacity=".4"/>
    {lifting&&<>
      <line x1="30" y1="78" x2="20" y2="50" stroke={colors.bodyColor} strokeWidth="7" strokeLinecap="round"/>
      <line x1="70" y1="78" x2="80" y2="50" stroke={colors.bodyColor} strokeWidth="7" strokeLinecap="round"/>
    </>}
  </g>;
}

function CorgiSVG({colors,lifting}){
  return <g>
    <ellipse cx="50" cy="88" rx="28" ry="16" fill={colors.bodyColor}/>
    <ellipse cx="50" cy="92" rx="20" ry="10" fill={colors.accentColor}/>
    <rect x="30" y="98" width="9" height="12" rx="4" fill={colors.bodyColor}/>
    <rect x="61" y="98" width="9" height="12" rx="4" fill={colors.bodyColor}/>
    <ellipse cx="34" cy="110" rx="6" ry="3" fill={colors.accentColor}/>
    <ellipse cx="66" cy="110" rx="6" ry="3" fill={colors.accentColor}/>
    <circle cx="50" cy="48" r="28" fill={colors.bodyColor}/>
    <path d="M38,35 Q50,20 62,35 L60,65 Q50,70 40,65 Z" fill={colors.accentColor} opacity=".7"/>
    <ellipse cx="24" cy="35" rx="12" ry="16" fill={colors.bodyColor} transform="rotate(-15,24,35)"/>
    <ellipse cx="76" cy="35" rx="12" ry="16" fill={colors.bodyColor} transform="rotate(15,76,35)"/>
    <ellipse cx="24" cy="37" rx="7" ry="10" fill="#f48fb1" opacity=".3" transform="rotate(-15,24,37)"/>
    <ellipse cx="76" cy="37" rx="7" ry="10" fill="#f48fb1" opacity=".3" transform="rotate(15,76,37)"/>
    <ellipse cx="40" cy="46" rx="6" ry="7" fill="white"/>
    <ellipse cx="60" cy="46" rx="6" ry="7" fill="white"/>
    <circle cx="41" cy="47" r="4" fill={colors.eyeColor}/>
    <circle cx="61" cy="47" r="4" fill={colors.eyeColor}/>
    <circle cx="41" cy="47" r="2" fill="#1a1a1a"/>
    <circle cx="61" cy="47" r="2" fill="#1a1a1a"/>
    <ellipse cx="39" cy="44" rx="2" ry="1.5" fill="white"/>
    <ellipse cx="59" cy="44" rx="2" ry="1.5" fill="white"/>
    <ellipse cx="50" cy="56" rx="4" ry="3" fill="#333"/>
    <ellipse cx="49" cy="55" rx="1.5" ry="1" fill="#666"/>
    <ellipse cx="50" cy="63" rx="5" ry="4" fill="#f48fb1"/>
    <path d="M45,60 Q50,58 55,60" stroke="#333" strokeWidth="1.5" fill="none"/>
    <ellipse cx="32" cy="54" rx="5" ry="3" fill="#ffab91" opacity=".4"/>
    <ellipse cx="68" cy="54" rx="5" ry="3" fill="#ffab91" opacity=".4"/>
    <rect x="40" y="70" width="20" height="8" rx="3" fill={colors.bodyColor}/>
    <circle cx="50" cy="76" r="2" fill="#f48fb1" opacity=".5"/>
    {lifting&&<>
      <line x1="30" y1="85" x2="18" y2="55" stroke={colors.bodyColor} strokeWidth="7" strokeLinecap="round"/>
      <line x1="70" y1="85" x2="82" y2="55" stroke={colors.bodyColor} strokeWidth="7" strokeLinecap="round"/>
    </>}
  </g>;
}

function CoolBoySVG({colors,lifting}){
  return <g>
    <rect x="35" y="72" width="30" height="22" rx="4" fill={colors.accentColor}/>
    <rect x="32" y="72" width="12" height="22" rx="3" fill={colors.bodyColor}/>
    <rect x="56" y="72" width="12" height="22" rx="3" fill={colors.bodyColor}/>
    <rect x="37" y="94" width="11" height="16" rx="3" fill="#1565c0"/>
    <rect x="52" y="94" width="11" height="16" rx="3" fill="#1565c0"/>
    <rect x="35" y="108" width="14" height="6" rx="3" fill="#ff7043"/>
    <rect x="51" y="108" width="14" height="6" rx="3" fill="#eeeeee"/>
    <line x1="37" y1="111" x2="47" y2="111" stroke="#ffab91" strokeWidth="1"/>
    <line x1="53" y1="111" x2="63" y2="111" stroke="#bdbdbd" strokeWidth="1"/>
    <rect x="44" y="66" width="12" height="8" rx="3" fill="#ffcd75"/>
    <circle cx="50" cy="44" r="26" fill="#ffcd75"/>
    <path d="M24,38 Q50,18 76,38 Q74,30 50,25 Q26,30 24,38 Z" fill={colors.bodyColor}/>
    <rect x="55" y="30" width="18" height="6" rx="2" fill={colors.bodyColor}/>
    <rect x="56" y="33" width="16" height="2" rx="1" fill="#1e88e5"/>
    {!lifting?<>
      <rect x="30" y="40" width="17" height="11" rx="3" fill="#263238"/>
      <rect x="53" y="40" width="17" height="11" rx="3" fill="#263238"/>
      <rect x="47" y="43" width="6" height="3" rx="1" fill="#263238"/>
      <line x1="30" y1="44" x2="24" y2="42" stroke="#263238" strokeWidth="2"/>
      <line x1="70" y1="44" x2="76" y2="42" stroke="#263238" strokeWidth="2"/>
      <rect x="33" y="42" width="4" height="3" rx="1" fill="#546e7a" opacity=".5"/>
      <rect x="56" y="42" width="4" height="3" rx="1" fill="#546e7a" opacity=".5"/>
    </>:<>
      <rect x="30" y="48" width="17" height="11" rx="3" fill="#263238" opacity=".8"/>
      <rect x="53" y="48" width="17" height="11" rx="3" fill="#263238" opacity=".8"/>
      <rect x="47" y="51" width="6" height="3" rx="1" fill="#263238"/>
      <circle cx="39" cy="43" r="4" fill="white"/>
      <circle cx="61" cy="43" r="4" fill="white"/>
      <circle cx="39" cy="43" r="2" fill="#263238"/>
      <circle cx="61" cy="43" r="2" fill="#263238"/>
    </>}
    <path d={lifting?"M43,58 Q50,62 57,56":"M43,56 Q50,60 57,54"} stroke="#795548" strokeWidth="1.5" fill="none"/>
    {lifting&&<>
      <ellipse cx="33" cy="54" rx="4" ry="2" fill="#ef9a9a" opacity=".5"/>
      <ellipse cx="67" cy="54" rx="4" ry="2" fill="#ef9a9a" opacity=".5"/>
    </>}
    {lifting?<>
      <line x1="33" y1="78" x2="20" y2="50" stroke="#ffcd75" strokeWidth="7" strokeLinecap="round"/>
      <line x1="67" y1="78" x2="80" y2="50" stroke="#ffcd75" strokeWidth="7" strokeLinecap="round"/>
    </>:<>
      <line x1="33" y1="78" x2="25" y2="90" stroke="#ffcd75" strokeWidth="7" strokeLinecap="round"/>
      <line x1="67" y1="78" x2="75" y2="90" stroke="#ffcd75" strokeWidth="7" strokeLinecap="round"/>
    </>}
  </g>;
}

function GirlSVG({colors,lifting}){
  return <g>
    <circle cx="50" cy="40" r="32" fill="#1a237e"/>
    <circle cx="22" cy="35" r="8" fill="#1a237e"/>
    <circle cx="78" cy="35" r="8" fill="#1a237e"/>
    <circle cx="25" cy="48" r="7" fill="#1a237e"/>
    <circle cx="75" cy="48" r="7" fill="#1a237e"/>
    <circle cx="30" cy="22" r="6" fill="#1a237e"/>
    <circle cx="70" cy="22" r="6" fill="#1a237e"/>
    <circle cx="50" cy="12" r="7" fill="#1a237e"/>
    <circle cx="38" cy="15" r="5" fill="#1a237e"/>
    <circle cx="62" cy="15" r="5" fill="#1a237e"/>
    <path d="M24,32 Q50,22 76,32" stroke={colors.accentColor} strokeWidth="4" fill="none"/>
    <polygon points="68,28 78,22 78,34" fill={colors.accentColor}/>
    <polygon points="68,28 58,22 58,34" fill={colors.accentColor} opacity=".7"/>
    <circle cx="68" cy="28" r="3" fill="#ffa000"/>
    <circle cx="50" cy="46" r="24" fill="#ffcd75"/>
    <ellipse cx="40" cy="44" rx="6" ry="7" fill="white"/>
    <ellipse cx="60" cy="44" rx="6" ry="7" fill="white"/>
    <circle cx="41" cy="45" r="4" fill={colors.eyeColor}/>
    <circle cx="61" cy="45" r="4" fill={colors.eyeColor}/>
    <circle cx="41" cy="45" r="2" fill="#0d47a1"/>
    <circle cx="61" cy="45" r="2" fill="#0d47a1"/>
    <ellipse cx="39" cy="42" rx="2" ry="1.5" fill="white"/>
    <ellipse cx="59" cy="42" rx="2" ry="1.5" fill="white"/>
    <line x1="34" y1="39" x2="36" y2="37" stroke="#1a237e" strokeWidth="1.5"/>
    <line x1="66" y1="39" x2="64" y2="37" stroke="#1a237e" strokeWidth="1.5"/>
    <circle cx="50" cy="50" r="1.5" fill="#e8a065"/>
    <path d={lifting?"M44,56 Q50,62 56,56":"M44,55 Q50,60 56,55"} stroke="#c62828" strokeWidth="1.5" fill={lifting?"#e57373":"none"}/>
    <ellipse cx="33" cy="52" rx="5" ry="3" fill="#ef9a9a" opacity=".5"/>
    <ellipse cx="67" cy="52" rx="5" ry="3" fill="#ef9a9a" opacity=".5"/>
    <rect x="44" y="66" width="12" height="6" rx="2" fill="#ffcd75"/>
    <path d="M34,72 L34,92 Q50,97 66,92 L66,72 Q50,68 34,72 Z" fill={colors.bodyColor}/>
    <path d="M38,72 L42,66 L50,68 L58,66 L62,72" stroke={colors.bodyColor} strokeWidth="2" fill={colors.bodyColor}/>
    <rect x="36" y="92" width="12" height="12" rx="3" fill="#283593"/>
    <rect x="52" y="92" width="12" height="12" rx="3" fill="#283593"/>
    <rect x="34" y="104" width="14" height="7" rx="3" fill="#e91e63"/>
    <rect x="52" y="104" width="14" height="7" rx="3" fill="#e91e63"/>
    <line x1="36" y1="108" x2="46" y2="108" stroke="white" strokeWidth="1"/>
    <line x1="54" y1="108" x2="64" y2="108" stroke="white" strokeWidth="1"/>
    {lifting?<>
      <line x1="34" y1="76" x2="20" y2="50" stroke="#ffcd75" strokeWidth="7" strokeLinecap="round"/>
      <line x1="66" y1="76" x2="80" y2="50" stroke="#ffcd75" strokeWidth="7" strokeLinecap="round"/>
    </>:<>
      <line x1="34" y1="76" x2="26" y2="90" stroke="#ffcd75" strokeWidth="6" strokeLinecap="round"/>
      <line x1="66" y1="76" x2="74" y2="90" stroke="#ffcd75" strokeWidth="6" strokeLinecap="round"/>
    </>}
    {lifting&&<>
      <circle cx="22" cy="30" r="6" fill="#1a237e"/>
      <circle cx="78" cy="30" r="6" fill="#1a237e"/>
    </>}
  </g>;
}

function BearSVG({colors,lifting}){
  return <g>
    <ellipse cx="50" cy="88" rx="25" ry="20" fill={colors.bodyColor}/>
    <ellipse cx="50" cy="90" rx="16" ry="14" fill={colors.accentColor}/>
    <ellipse cx="38" cy="106" rx="8" ry="6" fill={colors.bodyColor}/>
    <ellipse cx="62" cy="106" rx="8" ry="6" fill={colors.bodyColor}/>
    <circle cx="36" cy="108" r="2" fill="#795548"/>
    <circle cx="40" cy="108" r="2" fill="#795548"/>
    <circle cx="60" cy="108" r="2" fill="#795548"/>
    <circle cx="64" cy="108" r="2" fill="#795548"/>
    <circle cx="50" cy="45" r="28" fill={colors.bodyColor}/>
    <circle cx="28" cy="24" r="10" fill={colors.bodyColor}/>
    <circle cx="72" cy="24" r="10" fill={colors.bodyColor}/>
    <circle cx="28" cy="24" r="6" fill={colors.accentColor}/>
    <circle cx="72" cy="24" r="6" fill={colors.accentColor}/>
    <circle cx="40" cy="42" r="5" fill="white"/>
    <circle cx="60" cy="42" r="5" fill="white"/>
    <circle cx="40" cy="43" r="3" fill={colors.eyeColor}/>
    <circle cx="60" cy="43" r="3" fill={colors.eyeColor}/>
    <circle cx="39" cy="41" r="1.5" fill="white"/>
    <circle cx="59" cy="41" r="1.5" fill="white"/>
    <ellipse cx="50" cy="54" rx="10" ry="8" fill={colors.accentColor}/>
    <ellipse cx="50" cy="52" rx="4" ry="3" fill="#333"/>
    <ellipse cx="49" cy="51" rx="1.5" ry="1" fill="#555"/>
    <path d="M46,56 Q50,60 54,56" stroke="#5d4037" strokeWidth="1.5" fill="none"/>
    <ellipse cx="33" cy="50" rx="5" ry="3" fill="#ef9a9a" opacity=".35"/>
    <ellipse cx="67" cy="50" rx="5" ry="3" fill="#ef9a9a" opacity=".35"/>
    {lifting?<>
      <ellipse cx="22" cy="60" rx="8" ry="12" fill={colors.bodyColor} transform="rotate(-30,22,60)"/>
      <ellipse cx="78" cy="60" rx="8" ry="12" fill={colors.bodyColor} transform="rotate(30,78,60)"/>
    </>:<>
      <ellipse cx="25" cy="80" rx="8" ry="10" fill={colors.bodyColor} transform="rotate(-10,25,80)"/>
      <ellipse cx="75" cy="80" rx="8" ry="10" fill={colors.bodyColor} transform="rotate(10,75,80)"/>
    </>}
    {lifting&&<>
      <circle cx="18" cy="52" r="3" fill={colors.accentColor}/>
      <circle cx="82" cy="52" r="3" fill={colors.accentColor}/>
    </>}
  </g>;
}

function CharAvatar({charId,size=80,selected=false,lifting=false}){
  const ch=CHARACTERS.find(c=>c.id===charId)||CHARACTERS[0];
  const cls=lifting?'flex-anim':'';
  return(
    <svg viewBox="0 0 100 120" width={size} height={size*1.2} className={`${selected?'drop-shadow-lg':''} ${cls}`}>
      {charId==='cat'&&<CatSVG colors={ch} lifting={lifting}/>}
      {charId==='corgi'&&<CorgiSVG colors={ch} lifting={lifting}/>}
      {charId==='coolboy'&&<CoolBoySVG colors={ch} lifting={lifting}/>}
      {charId==='girl'&&<GirlSVG colors={ch} lifting={lifting}/>}
      {charId==='bear'&&<BearSVG colors={ch} lifting={lifting}/>}
    </svg>
  );
}

function PixelBarbell({weight}){
  return(
    <div className="flex flex-col items-center">
      <div className="font-pixel text-pixel-gold text-base mb-1">{weight}kg</div>
      <div className="flex items-center">
        <div className="w-3 h-14 bg-pixel-red rounded-sm"/><div className="w-2 h-12 bg-pixel-purple rounded-sm"/><div className="w-2 h-10 bg-pixel-blue rounded-sm"/>
        <div className="w-24 h-2 bg-pixel-light"/><div className="w-5 h-3 bg-pixel-gray rounded"/><div className="w-24 h-2 bg-pixel-light"/>
        <div className="w-2 h-10 bg-pixel-blue rounded-sm"/><div className="w-2 h-12 bg-pixel-purple rounded-sm"/><div className="w-3 h-14 bg-pixel-red rounded-sm"/>
      </div>
    </div>
  );
}

// ── Radar Chart ──
function Radar({stats,size=220}){
  const keys=['str','tec','pwr','stb','sta','rec'],cx=size/2,cy=size/2,r=size*.36;
  const pts=keys.map((_,i)=>{const a=Math.PI*2*i/6-Math.PI/2;return{x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)}});
  const vps=keys.map((k,i)=>{const v=Math.min(stats[k],100)/100;const a=Math.PI*2*i/6-Math.PI/2;return{x:cx+r*v*Math.cos(a),y:cy+r*v*Math.sin(a)}});
  return(
    <svg width={size} height={size} style={{fontFamily:'VT323,monospace'}}>
      {[.25,.5,.75,1].map((l,i)=><polygon key={i} points={keys.map((_,j)=>{const a=Math.PI*2*j/6-Math.PI/2;return`${cx+r*l*Math.cos(a)},${cy+r*l*Math.sin(a)}`}).join(' ')} fill="none" stroke="#566c86" strokeWidth="1" opacity=".4"/>)}
      {pts.map((p,i)=><line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#566c86" strokeWidth="1" opacity=".3"/>)}
      <polygon points={vps.map(p=>`${p.x},${p.y}`).join(' ')} fill="rgba(244,208,63,.2)" stroke="#f4d03f" strokeWidth="2.5"/>
      {vps.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="4" fill={SC[keys[i]]}/>)}
      {pts.map((p,i)=>{const a=Math.PI*2*i/6-Math.PI/2;const lx=cx+(r+24)*Math.cos(a);const ly=cy+(r+24)*Math.sin(a);
        return<text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#94b0c2" fontSize="14">{SI[keys[i]]}{stats[keys[i]]}</text>})}
    </svg>
  );
}

function StatBar({label,icon,value,max=100,color}){
  return(
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-sm w-5">{icon}</span>
      <span className="font-vt text-pixel-light text-sm w-12 text-right">{label}</span>
      <div className="flex-1 h-4 bg-pixel-charcoal border-2 border-pixel-gray overflow-hidden">
        <div className="h-full transition-all duration-500" style={{width:`${Math.min(100,value/max*100)}%`,background:color}}/>
      </div>
      <span className="font-vt text-sm w-8" style={{color}}>{value}</span>
    </div>
  );
}

function FloatingNum({items,onDone}){
  useEffect(()=>{const t=setTimeout(onDone,1800);return()=>clearTimeout(t)},[]);
  return(
    <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 pointer-events-none">
      {items.map((item,i)=>(
        <div key={i} className="font-pixel text-lg pop-in" style={{
          color:item.color||'#f4d03f',
          animation:'floatUp 1.5s ease-out forwards',
          animationDelay:`${i*0.15}s`,
          textShadow:'2px 2px 0 rgba(0,0,0,.5)'
        }}>{item.icon} {item.text}</div>
      ))}
    </div>
  );
}

function MsgLog({messages}){
  const end=useRef(null);
  useEffect(()=>{end.current?.scrollIntoView({behavior:'smooth'})},[messages]);
  return(
    <div className="bg-pixel-dark border-2 border-pixel-gray p-2 h-28 overflow-y-auto font-vt text-sm">
      {messages.map((m,i)=>(
        <div key={i} className={`mb-0.5 ${m.type==='success'?'text-pixel-green':m.type==='fail'?'text-pixel-red':m.type==='gold'?'text-pixel-gold':m.type==='event'?'text-pixel-cyan':'text-pixel-light'}`}>{m.text}</div>
      ))}
      <div ref={end}/>
    </div>
  );
}

function CoachDialog({text,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t)},[]);
  return(
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-xs pop-in pointer-events-auto" onClick={onClose}>
      <div className="bg-pixel-charcoal border-2 border-pixel-gold rounded-lg p-2 relative">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧑‍🏫</span>
          <span className="font-vt text-pixel-white text-sm leading-tight">{text}</span>
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-pixel-gold"/>
      </div>
    </div>
  );
}

function Toast({text,type='info',onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2500);return()=>clearTimeout(t)},[]);
  const b=type==='success'?'border-pixel-green':type==='fail'?'border-pixel-red':type==='gold'?'border-pixel-gold':'border-pixel-sky';
  return <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 pop-in pixel-border ${b} bg-pixel-charcoal px-4 py-2 font-vt text-pixel-white text-lg`}>{text}</div>;
}

function AchievementPopup({a,onClose}){
  useEffect(()=>{sfx('levelup');spawnConfetti(20)},[]);
  return(
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="pixel-border-gold bg-pixel-charcoal p-6 text-center pop-in max-w-xs" onClick={e=>e.stopPropagation()}>
        <div className="text-5xl mb-3 medal-spin">{a.icon}</div>
        <div className="font-pixel text-pixel-gold text-[10px] mb-2">成就解鎖！</div>
        <div className="font-pixel text-pixel-white text-xs mb-1">{a.name}</div>
        <div className="font-vt text-pixel-light text-lg mb-4">{a.desc}</div>
        <button onClick={onClose} className="pixel-btn pixel-btn-gold bg-pixel-dark text-pixel-gold px-6 py-2 text-[10px] font-pixel">太棒了！</button>
      </div>
    </div>
  );
}

function FatigueBar({fatigue}){
  if(fatigue<20)return null;
  const lv=fatigue>=70?'danger':fatigue>=50?'warn':'caution';
  const txt=lv==='danger'?'⚠️ 過度訓練危險！快休息！':lv==='warn'?'😰 身體很累了...':'😅 有點疲勞';
  const col=lv==='danger'?'text-pixel-red':lv==='warn'?'text-pixel-orange':'text-pixel-gold';
  return <div className={`font-vt ${col} text-center text-sm ${lv==='danger'?'blink shake':''}`}>{txt}</div>;
}

// ── Five Principles Display ──
function PrinciplesDisplay({principles}){
  return(
    <div className="flex justify-center gap-1">
      {PRINCIPLES.map(p=>{
        const lv=principles?.[p.id]||0;
        return(
          <div key={p.id} className="text-center" title={`${p.full}：${p.desc}`}>
            <div className="w-10 h-10 border-2 rounded flex items-center justify-center font-pixel text-sm"
              style={{borderColor:p.color,color:p.color,background:lv>0?`${p.color}20`:'transparent',opacity:lv>0?1:.4}}>
              {p.name}
            </div>
            <div className="font-vt text-xs mt-0.5" style={{color:p.color}}>
              {'●'.repeat(Math.min(lv,5))}{'○'.repeat(Math.max(0,5-lv))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Pixel Body (changes shape based on stats!) ──
function PixelBody({gender,stats,size=1,mood='normal'}){
  const bulkW=10+Math.floor(stats.str/15);
  const armW=2+Math.floor(stats.str/25);
  const legH=6+Math.floor(stats.sta/25);
  const skin='#ffcd75';
  const shirt=gender==='female'?'#b13e53':'#3b5dc9';
  const eyes=mood==='happy'?'◡':mood==='sad'?'╥':mood==='excited'?'★':'●';
  const mouth=mood==='happy'||mood==='excited'?'‿':mood==='sad'?'︵':'─';
  const cls=mood==='excited'?'bounce':mood==='happy'?'float':'';
  return(
    <div className={`flex flex-col items-center ${cls}`} style={{transform:`scale(${size})`}}>
      <div className="w-10 h-2 rounded-t-sm" style={{background:gender==='female'?'#5d275d':'#333c57'}}/>
      <div className="w-10 h-8 rounded-sm relative" style={{background:skin}}>
        <div className="absolute top-2 left-1.5 text-[8px] text-pixel-dark">{eyes}</div>
        <div className="absolute top-2 right-1.5 text-[8px] text-pixel-dark">{eyes}</div>
        {mood==='excited'&&<div className="absolute -top-1 -right-1 text-xs">✨</div>}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px]">{mouth}</div>
      </div>
      <div className="flex items-start mt-0.5">
        <div className="rounded-sm mt-1" style={{width:armW*4,height:28,background:skin}}/>
        <div className="rounded-sm" style={{width:bulkW*3,height:40,background:shirt,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span className="font-pixel text-[5px] text-pixel-white opacity-60">{gender==='female'?'♀':'♂'}</span>
        </div>
        <div className="rounded-sm mt-1" style={{width:armW*4,height:28,background:skin}}/>
      </div>
      <div className="flex gap-1 mt-0.5">
        <div className="bg-pixel-charcoal rounded-sm" style={{width:16,height:legH*3}}/>
        <div className="bg-pixel-charcoal rounded-sm" style={{width:16,height:legH*3}}/>
      </div>
      <div className="flex gap-1 mt-0.5">
        <div className="w-5 h-2 bg-pixel-red rounded-sm"/>
        <div className="w-5 h-2 bg-pixel-red rounded-sm"/>
      </div>
    </div>
  );
}

// ── Map Location ──
function MapLocation({icon,label,x,y,onClick,active,locked}){
  return(
    <button onClick={locked?undefined:onClick}
      className={`absolute flex flex-col items-center transition-all duration-200 group
        ${locked?'cursor-not-allowed':'cursor-pointer'}
        ${active?'scale-110':''}`}
      style={{left:`${x}%`,top:`${y}%`,transform:'translate(-50%,-50%)',zIndex:6}}>
      <div className={`relative flex items-center justify-center
        w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-200
        ${locked?'bg-gray-600 bg-opacity-60':'bg-white bg-opacity-30'}
        ${!locked?'group-hover:bg-opacity-50 group-hover:scale-110':''}`}
        style={{
          boxShadow:locked?'none':active?'0 0 12px rgba(244,208,63,.5)':'0 2px 6px rgba(0,0,0,.2)',
          border:locked?'2px solid #555':active?'2px solid #f4d03f':'2px solid rgba(255,255,255,.4)',
          ...(locked?{filter:'grayscale(1)'}:{})
        }}>
        <span className={`text-lg md:text-2xl ${active?'bounce':''}`}
          style={locked?{filter:'grayscale(1) brightness(.7)'}:{}}>
          {icon}
        </span>
        {locked&&<span className="absolute text-xs">🔒</span>}
      </div>
      <div className={`font-vt text-[11px] md:text-xs mt-0.5 px-1.5 py-0 rounded whitespace-nowrap
        ${locked?'bg-gray-700 bg-opacity-80 text-gray-400':
          active?'bg-pixel-gold text-pixel-dark':
          'bg-pixel-dark bg-opacity-75 text-pixel-white'}
        ${!locked?'group-hover:bg-pixel-gold group-hover:text-pixel-dark':''}`}
        style={{boxShadow:'0 1px 3px rgba(0,0,0,.3)'}}>
        {label}
      </div>
    </button>
  );
}

// ── HUD Overlay ──
function HUD({c}){
  const ms=maxSta(c.stats.sta);
  const season=getSeason(c.day);
  const year=getYear(c.day);
  const stageNames=['泛化期','分化期','鞏固期','自動化'];
  return(
    <div className="absolute top-0 left-0 right-0 p-2 z-10 pointer-events-none">
      <div className="flex gap-2 pointer-events-auto">
        <div className="pixel-border bg-pixel-charcoal bg-opacity-95 p-2 flex-1">
          <div className="flex justify-between items-center mb-1">
            <div className="font-pixel text-pixel-gold text-[9px]">{c.name}</div>
            <div className="font-vt text-pixel-orange text-sm">💰{c.money}</div>
          </div>
          <div className="font-vt text-pixel-light text-xs mb-1">
            {c.gender==='male'?'♂':'♀'} {c.weightClass} | 🎓{stageNames[c.motorStage]}
          </div>
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-xs">❤️</span>
            <div className="flex-1 h-3 bg-pixel-dark border border-pixel-gray overflow-hidden">
              <div className="h-full transition-all" style={{width:`${c.stamina/ms*100}%`,background:`linear-gradient(to right,#38b764,#a7f070)`}}/>
            </div>
            <span className="font-vt text-pixel-green text-xs">{c.stamina}/{ms}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs">😤</span>
            <div className="flex-1 h-3 bg-pixel-dark border border-pixel-gray overflow-hidden">
              <div className="h-full transition-all" style={{width:`${c.fatigue}%`,background:c.fatigue>70?'#b13e53':c.fatigue>40?'#ef7d57':'#f4d03f'}}/>
            </div>
            <span className="font-vt text-pixel-orange text-xs">{c.fatigue}%</span>
          </div>
          {c.streak>=3&&<div className="font-vt text-pixel-orange text-xs text-center">🔥{c.streak}天連續</div>}
        </div>
        <div className="pixel-border bg-pixel-charcoal bg-opacity-95 p-2 w-28">
          <div className="font-vt text-pixel-light text-center text-sm">{season.emoji}{season.name}</div>
          <div className="font-pixel text-pixel-gold text-center text-[8px]">第{year}年 第{c.day}天</div>
          <div className="grid grid-cols-3 gap-0.5 mt-1">
            {['str','tec','pwr','stb','sta','rec'].map(k=>(
              <div key={k} className="text-center">
                <div className="text-[10px]">{SI[k]}</div>
                <div className="font-vt text-xs" style={{color:SC[k]}}>{c.stats[k]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
