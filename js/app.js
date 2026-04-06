/* ═══════════════════════════════════════
   APP
   ═══════════════════════════════════════ */
// ── Audio Control Panel ──
function AudioControl(){
  const[muted,setMuted]=useState(audioMuted);
  const[showPanel,setShowPanel]=useState(false);
  const[sv,setSv]=useState(sfxVol);
  const[bv,setBv]=useState(bgmVol);

  return(
    <div className="fixed top-2 right-2 z-40">
      <button onClick={()=>{
        if(!showPanel){ea();}
        setShowPanel(!showPanel);
      }} className="w-9 h-9 pixel-border bg-pixel-charcoal text-pixel-gold flex items-center justify-center text-lg cursor-pointer hover:bg-pixel-darkblue">
        {muted?'🔇':'🔊'}
      </button>
      {showPanel&&(
        <div className="pixel-border bg-pixel-charcoal p-3 mt-1 w-48 slide-up">
          <button onClick={()=>{const m=toggleMute();setMuted(m)}}
            className="w-full pixel-btn bg-pixel-dark text-pixel-light py-1 text-[8px] font-pixel mb-2">
            {muted?'🔇 已靜音':'🔊 有聲音'}
          </button>
          <div className="mb-2">
            <div className="font-cute text-pixel-light text-sm mb-1">🎵 背景音樂</div>
            <input type="range" min="0" max="100" value={bv*100}
              onChange={e=>{const v=e.target.value/100;setBv(v);setBgmVol(v)}}
              className="w-full h-2 accent-yellow-400"/>
          </div>
          <div>
            <div className="font-cute text-pixel-light text-sm mb-1">🔔 音效</div>
            <input type="range" min="0" max="100" value={sv*100}
              onChange={e=>{const v=e.target.value/100;setSv(v);setSfxVol(v)}}
              className="w-full h-2 accent-yellow-400"/>
          </div>
        </div>
      )}
    </div>
  );
}

function App(){
  const[screen,setScreen]=useState('title');
  const[c,setC]=useState(null);
  const hasSave=localStorage.getItem('wl_save')!==null;

  // BGM routing based on screen
  useEffect(()=>{
    const bgmMap={title:'title',create:'title',hub:'title',training:'training',comp:'competition',status:'shop',shop:'shop',jobs:'shop',achievements:'shop',pool:'shop',restaurant:'shop',friend:'shop',home:'shop',cafe:'shop',laundry:'shop',river:'shop',nstc:'training',wangfund:'shop',tianliao:'training',mituo:'shop',hengzhai:'training'};
    const track=bgmMap[screen];
    if(track)playBGM(track);
  },[screen]);

  function load(){
    try{const s=JSON.parse(localStorage.getItem('wl_save'));if(s){
      s.luckBonus=s.luckBonus||0;s.totalTrainings=s.totalTrainings||0;s.totalComps=s.totalComps||0;
      s.activeEffects=s.activeEffects||[];s.inventory=s.inventory||[];s.achievements=s.achievements||[];
      s.fatigue=s.fatigue||0;s.streak=s.streak||0;s.restStreak=s.restStreak||0;s.lastTrainDay=s.lastTrainDay||0;
      s.coachIdx=s.coachIdx||0;s.seenEv=s.seenEv||{};
      s.principles=s.principles||{near:0,fast:0,low:0,accurate:0,stable:0};
      s.tcjsCount=s.tcjsCount||0;s.perfectCount=s.perfectCount||0;s.motorStage=s.motorStage||0;
      s.pb=s.pb||s.personalBest||{snatch:0,cleanJerk:0,total:0};
      s.knowledge=s.knowledge||0;s.studyCount=s.studyCount||0;
      s.etf=s.etf||{shares:0,prices:[100],buyPrice:0};
      s.gachaCount=s.gachaCount||0;
      s.avatar=s.avatar||'cat';
      s.seenStories=s.seenStories||{};
      s.statHistory=s.statHistory||[];
      setC(s);setScreen('hub');
    }}catch(e){console.error(e)}
  }
  function create(name,gender,wc,avatar){const ch=newChar(name,gender,wc,avatar);setC(ch);localStorage.setItem('wl_save',JSON.stringify(ch));setScreen('hub')}

  useEffect(()=>{if(c)localStorage.setItem('wl_save',JSON.stringify(c))},[c]);

  const go=s=>setScreen(s);

  return(
    <>
      <AudioControl/>
      {(()=>{switch(screen){
        case'title':return<TitleScreen onNew={()=>go('create')} onLoad={load} hasSave={hasSave}/>;
        case'create':return<CreateScreen onConfirm={create}/>;
        case'hub':return<Hub c={c} setC={setC} go={go}/>;
        case'training':return<TrainingScreen c={c} setC={setC} go={go}/>;
        case'comp':return<CompScreen c={c} setC={setC} go={go}/>;
        case'status':return<StatusScreen c={c} go={go}/>;
        case'shop':return<ShopScreen c={c} setC={setC} go={go}/>;
        case'jobs':return<JobsScreen c={c} setC={setC} go={go}/>;
        case'pool':return<PoolScreen c={c} setC={setC} go={go}/>;
        case'restaurant':return<RestaurantScreen c={c} setC={setC} go={go}/>;
        case'friend':return<FriendScreen c={c} setC={setC} go={go}/>;
        case'home':return<HomeScreen c={c} setC={setC} go={go}/>;
        case'cafe':return<CafeScreen c={c} setC={setC} go={go}/>;
        case'laundry':return<LaundryScreen c={c} setC={setC} go={go}/>;
        case'river':return<RiverScreen c={c} setC={setC} go={go}/>;
        case'nstc':return<NstcScreen c={c} setC={setC} go={go}/>;
        case'wangfund':return<WangFundScreen c={c} setC={setC} go={go}/>;
        case'tianliao':return<TianliaoScreen c={c} setC={setC} go={go}/>;
        case'mituo':return<MituoScreen c={c} setC={setC} go={go}/>;
        case'hengzhai':return<HengzhaiScreen c={c} setC={setC} go={go}/>;
        case'achievements':return<AchScreen c={c} go={go}/>;
        default:return<TitleScreen onNew={()=>go('create')} onLoad={load} hasSave={hasSave}/>;
      }})()}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
