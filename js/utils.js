/* ═══════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════ */
function maxSta(sta){return 80+Math.floor(sta/5)*5}
function calcRate(stats,w,pb,isComp,evLv,luck=0,prinBonus=0){
  const base=(stats.str+stats.tec)/2;
  const ratio=pb>0?(w/pb)*100:100;
  const diff=ratio>100?(ratio-100)*2:(100-ratio)*.5;
  const stbMod=stats.stb*(isComp?.4:.2);
  const pwrMod=stats.pwr*.15;
  const evPen=isComp?(evLv||0)*3:0;
  return Math.max(5,Math.min(98,Math.round(base-diff+stbMod+pwrMod-evPen+luck+prinBonus)));
}
function baseTotal(wc){return Math.round((parseInt(wc)||120)*4.5+50)}
const OPPONENTS_DB=[
  // China
  {name:'Li Fabin',country:'CHN',flag:'🇨🇳',style:'technical',baseStr:78,baseTec:88,basePwr:75,gender:'male',wRange:['61kg','67kg']},
  {name:'Shi Zhiyong',country:'CHN',flag:'🇨🇳',style:'power',baseStr:85,baseTec:82,basePwr:88,gender:'male',wRange:['73kg','81kg']},
  {name:'Hou Zhihui',country:'CHN',flag:'🇨🇳',style:'technical',baseStr:75,baseTec:90,basePwr:78,gender:'female',wRange:['45kg','49kg']},
  {name:'Liao Qiuyun',country:'CHN',flag:'🇨🇳',style:'balanced',baseStr:76,baseTec:80,basePwr:77,gender:'female',wRange:['55kg','59kg']},
  {name:'Tian Tao',country:'CHN',flag:'🇨🇳',style:'power',baseStr:88,baseTec:78,basePwr:85,gender:'male',wRange:['89kg','96kg']},
  {name:'Lu Xiaojun',country:'CHN',flag:'🇨🇳',style:'balanced',baseStr:84,baseTec:86,basePwr:82,gender:'male',wRange:['73kg','81kg']},
  // Georgia
  {name:'Lasha Talakhadze',country:'GEO',flag:'🇬🇪',style:'power',baseStr:95,baseTec:80,basePwr:92,gender:'male',wRange:['109kg','+109kg']},
  // Korea
  {name:'Won Jeongshik',country:'KOR',flag:'🇰🇷',style:'balanced',baseStr:74,baseTec:78,basePwr:76,gender:'male',wRange:['73kg','81kg']},
  // Japan
  {name:'Miyake Hiromi',country:'JPN',flag:'🇯🇵',style:'technical',baseStr:68,baseTec:85,basePwr:70,gender:'female',wRange:['45kg','49kg']},
  {name:'Yoichi Itokazu',country:'JPN',flag:'🇯🇵',style:'balanced',baseStr:72,baseTec:76,basePwr:73,gender:'male',wRange:['61kg','67kg']},
  // Iran
  {name:'Moradi Sohrab',country:'IRI',flag:'🇮🇷',style:'power',baseStr:86,baseTec:75,basePwr:88,gender:'male',wRange:['89kg','96kg']},
  {name:'Rostami Kianoush',country:'IRI',flag:'🇮🇷',style:'power',baseStr:84,baseTec:77,basePwr:86,gender:'male',wRange:['81kg','89kg']},
  // Thailand
  {name:'Sopita Tanasan',country:'THA',flag:'🇹🇭',style:'technical',baseStr:70,baseTec:84,basePwr:72,gender:'female',wRange:['49kg','55kg']},
  // Indonesia
  {name:'Windy Cantika',country:'INA',flag:'🇮🇩',style:'balanced',baseStr:72,baseTec:78,basePwr:74,gender:'female',wRange:['49kg','55kg']},
  // Vietnam
  {name:'Hoang Thi Duyen',country:'VIE',flag:'🇻🇳',style:'technical',baseStr:71,baseTec:82,basePwr:73,gender:'female',wRange:['55kg','59kg']},
  // Philippines
  {name:'Hidilyn Diaz',country:'PHI',flag:'🇵🇭',style:'balanced',baseStr:74,baseTec:80,basePwr:76,gender:'female',wRange:['55kg','59kg']},
  // TPE
  {name:'Kuo Hsing-Chun',country:'TPE',flag:'🇹🇼',style:'power',baseStr:82,baseTec:85,basePwr:84,gender:'female',wRange:['55kg','59kg','64kg']},
  {name:'Chen Wei-Ling',country:'TPE',flag:'🇹🇼',style:'technical',baseStr:70,baseTec:83,basePwr:72,gender:'female',wRange:['55kg','59kg']},
  // Uzbekistan
  {name:'Ruslan Nurudinov',country:'UZB',flag:'🇺🇿',style:'power',baseStr:86,baseTec:74,basePwr:84,gender:'male',wRange:['102kg','109kg']},
  // Kazakhstan
  {name:'Ilya Ilyin',country:'KAZ',flag:'🇰🇿',style:'balanced',baseStr:83,baseTec:80,basePwr:82,gender:'male',wRange:['96kg','102kg']},
  // Bulgaria (legend)
  {name:'Naim Suleymanoglu',country:'BUL',flag:'🇧🇬',style:'technical',baseStr:80,baseTec:92,basePwr:85,gender:'male',wRange:['55kg','61kg']},
  // Turkey
  {name:'Halil Mutlu',country:'TUR',flag:'🇹🇷',style:'technical',baseStr:76,baseTec:90,basePwr:80,gender:'male',wRange:['55kg','61kg']},
  // Colombia
  {name:'Oscar Figueroa',country:'COL',flag:'🇨🇴',style:'power',baseStr:80,baseTec:76,basePwr:82,gender:'male',wRange:['61kg','67kg']},
  // North Korea
  {name:'Om Yun-Chol',country:'PRK',flag:'🇰🇵',style:'technical',baseStr:74,baseTec:88,basePwr:78,gender:'male',wRange:['55kg','61kg']},
  // Egypt
  {name:'Mohamed Ehab',country:'EGY',flag:'🇪🇬',style:'balanced',baseStr:80,baseTec:78,basePwr:80,gender:'male',wRange:['81kg','89kg']},
  // Armenia
  {name:'Simon Martirosyan',country:'ARM',flag:'🇦🇲',style:'power',baseStr:88,baseTec:76,basePwr:86,gender:'male',wRange:['102kg','109kg']},
  // India
  {name:'Mirabai Chanu',country:'IND',flag:'🇮🇳',style:'balanced',baseStr:73,baseTec:80,basePwr:75,gender:'female',wRange:['49kg','55kg']},
  // Ecuador
  {name:'Neisi Dajomes',country:'ECU',flag:'🇪🇨',style:'power',baseStr:76,baseTec:75,basePwr:78,gender:'female',wRange:['71kg','76kg']},
  // Dominican Republic
  {name:'Beatriz Piron',country:'DOM',flag:'🇩🇴',style:'balanced',baseStr:70,baseTec:76,basePwr:72,gender:'female',wRange:['49kg','55kg']},
  // Italy
  {name:'Giorgia Bordignon',country:'ITA',flag:'🇮🇹',style:'technical',baseStr:72,baseTec:80,basePwr:74,gender:'female',wRange:['64kg','71kg']},
];

const LOCAL_NAMES_M=['李明','王強','張偉','陳龍','林翔','黃勇','劉峰','楊銳','趙鵬','周傑','吳磊','許志豪','蔡承恩','鄭凱文','高銘宏'];
const LOCAL_NAMES_F=['陳芳','林慧','王雅婷','張怡萱','劉佳琪','黃雅琪','李欣怡','吳佩珊','楊心怡','鄭宜芬'];
const INTL_GENERIC_M=[
  {name:'Kim Junho',flag:'🇰🇷'},{name:'Tanaka Yuki',flag:'🇯🇵'},{name:'Nguyen Van Anh',flag:'🇻🇳'},
  {name:'Ahmad Reza',flag:'🇮🇷'},{name:'Bek Timur',flag:'🇺🇿'},{name:'Batbold Munkh',flag:'🇲🇳'},
  {name:'Carlos Santos',flag:'🇧🇷'},{name:'Petrov Ivan',flag:'🇷🇺'},{name:'Yusuf Ali',flag:'🇹🇷'},
];
const INTL_GENERIC_F=[
  {name:'Park Soojin',flag:'🇰🇷'},{name:'Sato Mika',flag:'🇯🇵'},{name:'Tran Thi Lan',flag:'🇻🇳'},
  {name:'Rattana Suk',flag:'🇹🇭'},{name:'Maria Lopez',flag:'🇲🇽'},{name:'Eka Putri',flag:'🇮🇩'},
  {name:'Devi Priya',flag:'🇮🇳'},{name:'Anna Petrova',flag:'🇷🇺'},{name:'Elif Yilmaz',flag:'🇹🇷'},
];
const NAMES=LOCAL_NAMES_M;
function rname(){return LOCAL_NAMES_M[Math.floor(Math.random()*LOCAL_NAMES_M.length)]}

const MALE_WCS=['55kg','61kg','67kg','73kg','81kg','89kg','96kg','102kg','109kg','+109kg'];
function genOpps(evLv,wc){
  const n=5+evLv,bt=baseTotal(wc);
  const isFemale=!MALE_WCS.includes(wc);
  const localNames=isFemale?LOCAL_NAMES_F:LOCAL_NAMES_M;
  const intlGeneric=isFemale?INTL_GENERIC_F:INTL_GENERIC_M;

  // Pick known opponents for higher-level events
  let knownPicks=[];
  if(evLv>=4){
    const wcMatch=OPPONENTS_DB.filter(o=>o.wRange.some(w=>w===wc));
    const genderMatch=OPPONENTS_DB.filter(o=>isFemale?(o.gender==='female'):(o.gender==='male'));
    knownPicks=(wcMatch.length>=2?wcMatch:genderMatch).slice();
    knownPicks.sort(()=>Math.random()-.5);
    knownPicks=knownPicks.slice(0,Math.min(knownPicks.length,Math.floor(n*.6)));
  }else if(evLv===3){
    const wcMatch=OPPONENTS_DB.filter(o=>o.wRange.some(w=>w===wc));
    knownPicks=wcMatch.sort(()=>Math.random()-.5).slice(0,Math.min(wcMatch.length,2));
  }

  const results=[];
  const usedNames=new Set();

  // Add known opponents
  for(const opp of knownPicks){
    usedNames.add(opp.name);
    const styleMod=opp.style==='power'?{str:5,tec:-3}:opp.style==='technical'?{str:-3,tec:5}:{str:0,tec:0};
    const lvScale=.6+evLv*.08;
    const baseAvg=(opp.baseStr+styleMod.str+opp.baseTec+styleMod.tec+opp.basePwr)/3;
    const sk=lvScale+baseAvg/500+Math.random()*.12-.06;
    const t=Math.round(bt*sk);
    const sRatio=opp.style==='technical'?.44:.42;
    const s=Math.round(t*(sRatio+Math.random()*.03));
    results.push({name:opp.name,country:opp.country,flag:opp.flag,snatch:s,cleanJerk:t-s,total:t,style:opp.style});
  }

  // Fill remaining with generic opponents
  const remaining=n-results.length;
  for(let i=0;i<remaining;i++){
    const sk=.6+evLv*.08+Math.random()*.25;
    const t=Math.round(bt*sk);
    const s=Math.round(t*(.42+Math.random()*.04));
    let name,flag,country;
    if(evLv<=2){
      const pool=localNames.filter(n=>!usedNames.has(n));
      name=pool.length>0?pool[Math.floor(Math.random()*pool.length)]:localNames[Math.floor(Math.random()*localNames.length)];
      flag='🇹🇼';country='TPE';
    }else{
      if(Math.random()<.4){
        const pool=localNames.filter(n=>!usedNames.has(n));
        name=pool.length>0?pool[Math.floor(Math.random()*pool.length)]:localNames[Math.floor(Math.random()*localNames.length)];
        flag='🇹🇼';country='TPE';
      }else{
        const pool=intlGeneric.filter(g=>!usedNames.has(g.name));
        const pick=pool.length>0?pool[Math.floor(Math.random()*pool.length)]:intlGeneric[Math.floor(Math.random()*intlGeneric.length)];
        name=pick.name;flag=pick.flag;country='';
      }
    }
    usedNames.add(name);
    results.push({name,country,flag,snatch:s,cleanJerk:t-s,total:t,style:'balanced'});
  }
  return results.sort((a,b)=>b.total-a.total);
}
function principleLevelBonus(principles){
  if(!principles)return 0;
  return Object.values(principles).reduce((s,v)=>s+v*.5,0);
}
function newChar(name,gender,wc,avatar='cat',coach='titan'){
  return{name,gender,weightClass:wc,avatar,coach,
    stats:{str:15,tec:10,pwr:12,stb:10,sta:20,rec:15},
    stamina:100,day:1,money:500,
    pb:{snatch:0,cleanJerk:0,total:0},
    eventLevel:0,medals:[],achievements:[],inventory:[],
    activeEffects:[],luckBonus:0,
    totalTrainings:0,totalComps:0,
    streak:0,restStreak:0,lastTrainDay:0,
    fatigue:0,coachIdx:0,seenEv:{},
    principles:{near:0,fast:0,low:0,accurate:0,stable:0},
    tcjsCount:0,perfectCount:0,
    seenStories:{},
    statHistory:[],
    motorStage:0,
    knowledge:0,studyCount:0,
    etf:{shares:0,prices:[100],buyPrice:0},
    gachaCount:0,
    injured:false,injuryDay:0,injuryType:null,
  };
}

// ── Season/Date ──
function getSeason(day){
  const m=((day-1)%120);
  if(m<30)return{name:'春季',emoji:'🌸',bg:'from-green-900/20 to-pixel-dark'};
  if(m<60)return{name:'夏季',emoji:'☀️',bg:'from-yellow-900/20 to-pixel-dark'};
  if(m<90)return{name:'秋季',emoji:'🍂',bg:'from-orange-900/20 to-pixel-dark'};
  return{name:'冬季',emoji:'❄️',bg:'from-blue-900/20 to-pixel-dark'};
}
function getYear(day){return Math.floor((day-1)/360)+1}
