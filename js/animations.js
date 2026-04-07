/* ── Exercise Animation SVG (frame-by-frame side-view) ── */
function getExerciseSVG(eid,skin,shirt){
  const E=React.createElement;
  const hair='#333c57',shorts='#29366f',shoe='#ef7d57',barC='#94b0c2',plR='#b13e53',plB='#3b5dc9';
  const floorY=180;

  /* ── Helpers: draw side-view body parts ── */
  // Head with hair and eye (facing right)
  function head(cx,cy,k){
    return E('g',{key:'hd'+k},
      E('circle',{cx,cy,r:10,fill:skin}),
      E('path',{d:'M'+(cx-10)+' '+(cy-2)+' Q'+(cx-10)+' '+(cy-12)+' '+cx+' '+(cy-13)+' Q'+(cx+10)+' '+(cy-12)+' '+(cx+10)+' '+(cy-2),fill:hair}),
      E('circle',{cx:cx+4,cy:cy+1,r:1.8,fill:'#1a1c2c'})
    );
  }
  // Torso line from shoulder to hip
  function torso(sx,sy,hx,hy,k){
    return E('line',{key:'to'+k,x1:sx,y1:sy,x2:hx,y2:hy,stroke:shirt,strokeWidth:12,strokeLinecap:'round'});
  }
  // Upper arm from shoulder to elbow
  function uArm(sx,sy,ex,ey,k){
    return E('line',{key:'ua'+k,x1:sx,y1:sy,x2:ex,y2:ey,stroke:skin,strokeWidth:7,strokeLinecap:'round'});
  }
  // Lower arm from elbow to hand
  function lArm(ex,ey,hx,hy,k){
    return E('line',{key:'la'+k,x1:ex,y1:ey,x2:hx,y2:hy,stroke:skin,strokeWidth:6,strokeLinecap:'round'});
  }
  // Upper leg from hip to knee
  function uLeg(hx,hy,kx,ky,k){
    return E('line',{key:'ul'+k,x1:hx,y1:hy,x2:kx,y2:ky,stroke:shorts,strokeWidth:9,strokeLinecap:'round'});
  }
  // Lower leg from knee to ankle
  function lLeg(kx,ky,ax,ay,k){
    return E('line',{key:'ll'+k,x1:kx,y1:ky,x2:ax,y2:ay,stroke:shorts,strokeWidth:8,strokeLinecap:'round'});
  }
  // Foot
  function foot(ax,ay,dir,k){
    // dir: 1=right, -1=left
    return E('rect',{key:'ft'+k,x:ax-2,y:ay-2,width:12*Math.abs(dir),height:5,rx:2,fill:shoe});
  }
  // Horizontal barbell centered at (cx,cy) with width w
  function hBar(cx,cy,w,k){
    return E('g',{key:'hb'+k},
      E('line',{x1:cx-w/2,y1:cy,x2:cx+w/2,y2:cy,stroke:barC,strokeWidth:3,strokeLinecap:'round'}),
      E('rect',{x:cx-w/2-7,y:cy-7,width:5,height:14,rx:1,fill:plR}),
      E('rect',{x:cx-w/2-11,y:cy-5,width:4,height:10,rx:1,fill:plB}),
      E('rect',{x:cx+w/2+2,y:cy-7,width:5,height:14,rx:1,fill:plR}),
      E('rect',{x:cx+w/2+6,y:cy-5,width:4,height:10,rx:1,fill:plB})
    );
  }

  // Full side-view figure: all params are joint positions
  // p = { headX,headY, shoulderX,shoulderY, hipX,hipY, elbowX,elbowY, handX,handY, kneeX,kneeY, ankleX,ankleY }
  // Facing right: shoulder is roughly above hip, arm extends right
  function figure(p,k,withBar){
    const els=[
      // Draw legs first (behind torso)
      uLeg(p.hipX,p.hipY,p.kneeX,p.kneeY,k+'l'),
      lLeg(p.kneeX,p.kneeY,p.ankleX,p.ankleY,k+'l'),
      foot(p.ankleX,p.ankleY,1,k),
      // Torso
      torso(p.shoulderX,p.shoulderY,p.hipX,p.hipY,k),
      // Arms (behind or in front based on position)
      uArm(p.shoulderX,p.shoulderY,p.elbowX,p.elbowY,k),
      lArm(p.elbowX,p.elbowY,p.handX,p.handY,k),
      // Head
      head(p.headX,p.headY,k),
    ];
    if(withBar!==false){
      // barbell at hand position (both hands same spot for side view)
      els.push(hBar(p.handX,p.handY,56,k));
    }
    return els;
  }

  // Background: floor + gym wall
  const bg=[
    E('rect',{key:'wall',x:0,y:0,width:200,height:floorY,fill:'#1a1c2c',opacity:0.3}),
    E('rect',{key:'floor',x:0,y:floorY,width:200,height:20,fill:'#333c57'}),
  ];

  // Label text
  function label(txt,color){
    return E('text',{key:'lbl',x:100,y:floorY+15,textAnchor:'middle',fill:color||'#f4d03f',fontSize:12,fontFamily:'VT323'},txt);
  }

  /* ── Determine animation type from exercise ID ── */
  let at='squat'; // default to squat (not rest!)
  // Snatch family
  if(eid.includes('snatch')||eid.includes('Snatch')||['snatchDrill','tcjs','snatchBalance','muscleSnatch','snatchWide','snatchCombo','snatchDeadliftCombo','deficitSnatchDLCombo','noFeetSnatch','hangSnatchAbove','hangSnatchBelow','deficitSnatch','blockSnatch','lowBlockSnatch','muscleSnatchPressOHS','muscleSnatchBalance','contactSnatchBalance','hipSnatchBalance','continuousSnatchWide','muscleSnatchOHS','narrowMuscleSnatch'].includes(eid))at='snatch';
  else if(eid==='tcjs')at='tcjs';
  // Clean & Jerk family
  else if(eid.includes('clean')||eid.includes('Clean')||['cleanJerkDrill','hangClean','powerClean','hangCleanBelow','hangCleanAbove','deficitClean','blockClean','lowBlockClean','cleanWide','cleanFSJerk','cleanPushPress','cleanPushJerk','deficitCleanDL','cleanCombo','noFeetClean','hangMuscleCleanWide','continuousHangClean','muscleClean','powerCleanFS','powerCleanFSJerk','hangPowerClean','belowKneePowerClean','cleanDLPowerClean','deficitPowerClean','blockPowerClean','noFeetPowerClean'].includes(eid))at='clean';
  // Jerk family
  else if(eid.includes('jerk')||eid.includes('Jerk')||['jerkDrill','rackJerk','rackPushJerk','backRackJerk','backRackPushJerk','jerkDrive'].includes(eid))at='jerk';
  // Squat family
  else if(eid.includes('squat')||eid.includes('Squat')||['squat','frontSquat','overheadSquat','halfSquat','boxSquat','frontHalfSquat','frontBoxSquat','squatPause','frontSquatPause','squatJerk','frontSquatJerk','squatPushPress','frontSquatPushPress','squatPushJerk','frontSquatPushJerk','backSquatJump'].includes(eid))at='squat';
  // Pull/Deadlift family
  else if(eid.includes('pull')||eid.includes('Pull')||eid.includes('deadlift')||eid.includes('Deadlift')||['deadlift','snatchPull','cleanPull','slowPull','deficitPull','stiffSnatchPull','stiffCleanPull','snatchPullPause','cleanPullPause','blockSnatchPull','blockCleanPull','deficitStiffPull','mediumGripPull','mediumGripDL','hangSnatchPullCont'].includes(eid))at='pull';
  // Press family
  else if(eid.includes('press')||eid.includes('Press')||['press','benchPress','shoulderPress','rackPushPress','snatchGripPress','snatchGripPressOHS','overheadPress2','snatchPress','backRackDrive'].includes(eid))at='press';
  // Jump family
  else if(eid.includes('jump')||eid.includes('Jump')||['plyometric','boxJump','sqJump','backSquatJump','jumps'].includes(eid))at='jump';
  // Accessory
  else if(['pullUp','hyperext','grip','gripTraining2','sitUp','platetwist','dips','frenchPress','staticHold','stepTraining','goodMorning','benchPress'].includes(eid))at='accessory';
  // Recovery
  else if(eid==='flexibility')at='flexibility';
  else if(eid==='mental')at='mental';
  else if(eid==='rest')at='rest';

  /* =========================================================
     ANIMATION 1: SNATCH — 9 frames
     Side view, character faces right.
     Coordinate system: viewBox 0 0 200 200, floor at y=180
     ========================================================= */
  if(at==='snatch'){
    // Frame 1: START — Deep squat, bar at floor, torso tilted forward ~45°
    const f1=figure({
      headX:100,headY:95, shoulderX:98,shoulderY:108, hipX:85,hipY:140,
      elbowX:94,elbowY:140, handX:90,handY:170,
      kneeX:95,kneeY:155, ankleX:90,ankleY:175
    },'1');
    // Frame 2: FIRST PULL — Bar at knee height, knees straighter
    const f2=figure({
      headX:100,headY:85, shoulderX:100,shoulderY:100, hipX:88,hipY:130,
      elbowX:96,elbowY:130, handX:92,handY:148,
      kneeX:95,kneeY:150, ankleX:92,ankleY:175
    },'2');
    // Frame 3: TRANSITION — Bar at mid-thigh
    const f3=figure({
      headX:102,headY:78, shoulderX:102,shoulderY:92, hipX:92,hipY:122,
      elbowX:98,elbowY:122, handX:95,handY:128,
      kneeX:98,kneeY:148, ankleX:95,ankleY:175
    },'3');
    // Frame 4: SECOND PULL — Full extension, on toes, shoulders shrugged
    const f4=figure({
      headX:105,headY:60, shoulderX:105,shoulderY:75, hipX:100,hipY:105,
      elbowX:102,elbowY:105, handX:100,handY:105,
      kneeX:102,kneeY:140, ankleX:100,ankleY:168
    },'4');
    // Frame 5: TURNOVER — High elbows, bar at chin, feet leaving ground
    const f5=figure({
      headX:103,headY:65, shoulderX:103,shoulderY:78, hipX:98,hipY:108,
      elbowX:115,elbowY:70, handX:105,handY:75,
      kneeX:100,kneeY:140, ankleX:98,ankleY:170
    },'5');
    // Frame 6: Dropping under bar — bar going overhead, body descending
    const f6=figure({
      headX:102,headY:80, shoulderX:100,shoulderY:94, hipX:90,hipY:128,
      elbowX:108,elbowY:72, handX:102,handY:64,
      kneeX:96,kneeY:152, ankleX:92,ankleY:175
    },'6');
    // Frame 7: Entering catch — squat deepening, arms nearly overhead
    const f7=figure({
      headX:100,headY:92, shoulderX:98,shoulderY:106, hipX:86,hipY:138,
      elbowX:102,elbowY:80, handX:100,handY:62,
      kneeX:95,kneeY:156, ankleX:90,ankleY:175
    },'7');
    // Frame 8: CATCH — Deep squat with bar locked overhead
    const f8=figure({
      headX:100,headY:100, shoulderX:98,shoulderY:112, hipX:85,hipY:142,
      elbowX:100,elbowY:82, handX:100,handY:60,
      kneeX:95,kneeY:158, ankleX:90,ankleY:175
    },'8');
    // Frame 9: RECOVERY — Standing with bar overhead, arms locked straight
    const f9=figure({
      headX:102,headY:55, shoulderX:102,shoulderY:68, hipX:100,hipY:105,
      elbowX:102,elbowY:48, handX:102,handY:32,
      kneeX:100,kneeY:145, ankleX:100,ankleY:175
    },'9');

    return E('g',null,...bg,
      E('g',{key:'f1',className:'sn-f1'},...f1),
      E('g',{key:'f2',className:'sn-f2'},...f2),
      E('g',{key:'f3',className:'sn-f3'},...f3),
      E('g',{key:'f4',className:'sn-f4'},...f4),
      E('g',{key:'f5',className:'sn-f5'},...f5),
      E('g',{key:'f6',className:'sn-f6'},...f6),
      E('g',{key:'f7',className:'sn-f7'},...f7),
      E('g',{key:'f8',className:'sn-f8'},...f8),
      E('g',{key:'f9',className:'sn-f9'},...f9),
      label('SNATCH!','#f4d03f')
    );
  }

  /* =========================================================
     ANIMATION 2: TCJS — 7 frames
     ========================================================= */
  if(at==='tcjs'){
    // Frame 1: Standing tall, bar at hip height, arms straight
    const f1=figure({
      headX:102,headY:55, shoulderX:102,shoulderY:68, hipX:100,hipY:105,
      elbowX:102,elbowY:96, handX:102,handY:112,
      kneeX:100,kneeY:145, ankleX:100,ankleY:175
    },'1');
    // Frame 2: Slight dip, preparing to pull under
    const f2=figure({
      headX:102,headY:62, shoulderX:102,shoulderY:76, hipX:100,hipY:112,
      elbowX:102,elbowY:104, handX:102,handY:118,
      kneeX:100,kneeY:148, ankleX:100,ankleY:175
    },'2');
    // Frame 3: Explosive shrug, on toes, bar rising
    const f3=figure({
      headX:104,headY:56, shoulderX:104,shoulderY:70, hipX:100,hipY:104,
      elbowX:106,elbowY:68, handX:104,handY:80,
      kneeX:102,kneeY:138, ankleX:100,ankleY:168
    },'3');
    // Frame 4: High pull, elbows high, bar at chest
    const f4=figure({
      headX:103,headY:62, shoulderX:103,shoulderY:76, hipX:98,hipY:110,
      elbowX:115,elbowY:68, handX:108,handY:76,
      kneeX:100,kneeY:142, ankleX:100,ankleY:172
    },'4');
    // Frame 5: Turnover into front rack, dropping under
    const f5=figure({
      headX:102,headY:82, shoulderX:100,shoulderY:96, hipX:90,hipY:128,
      elbowX:114,elbowY:92, handX:106,handY:96,
      kneeX:96,kneeY:152, ankleX:94,ankleY:175
    },'5');
    // Frame 6: Front rack catch in deep squat, elbows forward
    const f6=figure({
      headX:100,headY:100, shoulderX:98,shoulderY:112, hipX:85,hipY:142,
      elbowX:112,elbowY:106, handX:104,handY:112,
      kneeX:95,kneeY:158, ankleX:90,ankleY:175
    },'6');
    // Frame 7: Standing recovery with bar on front shoulders
    const f7=figure({
      headX:102,headY:68, shoulderX:102,shoulderY:82, hipX:100,hipY:118,
      elbowX:114,elbowY:78, handX:108,handY:82,
      kneeX:100,kneeY:148, ankleX:100,ankleY:175
    },'7');

    return E('g',null,...bg,
      E('g',{key:'f1',className:'tc-f1'},...f1),
      E('g',{key:'f2',className:'tc-f2'},...f2),
      E('g',{key:'f3',className:'tc-f3'},...f3),
      E('g',{key:'f4',className:'tc-f4'},...f4),
      E('g',{key:'f5',className:'tc-f5'},...f5),
      E('g',{key:'f6',className:'tc-f6'},...f6),
      E('g',{key:'f7',className:'tc-f7'},...f7),
      label('TCJS!','#f4d03f')
    );
  }

  /* =========================================================
     ANIMATION 3: CLEAN & JERK — 10 frames
     Bar goes to shoulders (front rack), then jerk overhead
     ========================================================= */
  if(at==='clean'){
    // Frame 1: START — Deep squat, bar at floor, torso tilted forward
    const f1=figure({
      headX:100,headY:95, shoulderX:98,shoulderY:108, hipX:85,hipY:140,
      elbowX:94,elbowY:140, handX:90,handY:170,
      kneeX:95,kneeY:155, ankleX:90,ankleY:175
    },'1');
    // Frame 2: FIRST PULL — Bar at knee height
    const f2=figure({
      headX:100,headY:85, shoulderX:100,shoulderY:100, hipX:88,hipY:130,
      elbowX:96,elbowY:130, handX:92,handY:148,
      kneeX:95,kneeY:150, ankleX:92,ankleY:175
    },'2');
    // Frame 3: TRANSITION — Bar at mid-thigh
    const f3=figure({
      headX:102,headY:78, shoulderX:102,shoulderY:92, hipX:92,hipY:122,
      elbowX:98,elbowY:122, handX:95,handY:128,
      kneeX:98,kneeY:148, ankleX:95,ankleY:175
    },'3');
    // Frame 4: SECOND PULL — Full extension, on toes
    const f4=figure({
      headX:105,headY:60, shoulderX:105,shoulderY:75, hipX:100,hipY:105,
      elbowX:102,elbowY:105, handX:100,handY:105,
      kneeX:102,kneeY:140, ankleX:100,ankleY:168
    },'4');
    // Frame 5: FRONT RACK CATCH — Deep squat, elbows high, bar on shoulders
    const f5=figure({
      headX:100,headY:100, shoulderX:98,shoulderY:112, hipX:85,hipY:142,
      elbowX:112,elbowY:106, handX:104,handY:112,
      kneeX:95,kneeY:158, ankleX:90,ankleY:175
    },'5');
    // Frame 6: STANDING — Rising from squat with bar on front shoulders
    const f6=figure({
      headX:102,headY:68, shoulderX:102,shoulderY:82, hipX:100,hipY:118,
      elbowX:114,elbowY:78, handX:108,handY:82,
      kneeX:100,kneeY:148, ankleX:100,ankleY:175
    },'6');
    // Frame 7: DIP — Slight knee bend, bar on front shoulders
    const f7=figure({
      headX:102,headY:75, shoulderX:102,shoulderY:88, hipX:98,hipY:124,
      elbowX:114,elbowY:84, handX:108,handY:88,
      kneeX:98,kneeY:152, ankleX:96,ankleY:175
    },'7');
    // Frame 8: DRIVE — Explosive extension, bar leaving shoulders, on toes
    const f8=figure({
      headX:104,headY:62, shoulderX:104,shoulderY:76, hipX:100,hipY:110,
      elbowX:106,elbowY:58, handX:104,handY:48,
      kneeX:102,kneeY:142, ankleX:100,ankleY:168
    },'8');
    // Frame 9: SPLIT JERK — Front foot forward, back foot back, bar locked overhead
    const f9els=[
      // Back leg
      uLeg(100,110,82,145,'9bl'),
      lLeg(82,145,72,172,'9bl'),
      foot(72,172,1,'9b'),
      // Front leg
      uLeg(100,110,115,145,'9fl'),
      lLeg(115,145,112,175,'9fl'),
      foot(112,175,1,'9f'),
      // Torso
      torso(104,76,100,110,'9'),
      // Arms locked overhead
      uArm(104,76,104,52,'9'),
      lArm(104,52,104,36,'9'),
      // Head
      head(104,62,'9'),
      // Barbell overhead
      hBar(104,36,56,'9'),
    ];
    // Frame 10: RECOVER — Feet together, bar overhead, standing tall
    const f10=figure({
      headX:102,headY:55, shoulderX:102,shoulderY:68, hipX:100,hipY:105,
      elbowX:102,elbowY:48, handX:102,handY:32,
      kneeX:100,kneeY:145, ankleX:100,ankleY:175
    },'10');

    return E('g',null,...bg,
      E('g',{key:'f1',className:'cl-f1'},...f1),
      E('g',{key:'f2',className:'cl-f2'},...f2),
      E('g',{key:'f3',className:'cl-f3'},...f3),
      E('g',{key:'f4',className:'cl-f4'},...f4),
      E('g',{key:'f5',className:'cl-f5'},...f5),
      E('g',{key:'f6',className:'cl-f6'},...f6),
      E('g',{key:'f7',className:'cl-f7'},...f7),
      E('g',{key:'f8',className:'cl-f8'},...f8),
      E('g',{key:'f9',className:'cl-f9'},...f9els),
      E('g',{key:'f10',className:'cl-f10'},...f10),
      label('CLEAN & JERK!','#38b764')
    );
  }

  /* =========================================================
     ANIMATION 4: JERK — 7 frames (from front rack to overhead)
     ========================================================= */
  if(at==='jerk'){
    // Frame 1: Standing with bar on front shoulders (front rack), elbows forward
    const f1=figure({
      headX:102,headY:68, shoulderX:102,shoulderY:82, hipX:100,hipY:118,
      elbowX:114,elbowY:78, handX:108,handY:82,
      kneeX:100,kneeY:148, ankleX:100,ankleY:175
    },'1');
    // Frame 2: DIP — slight knee bend, bar on shoulders
    const f2=figure({
      headX:102,headY:75, shoulderX:102,shoulderY:88, hipX:98,hipY:124,
      elbowX:114,elbowY:84, handX:108,handY:88,
      kneeX:98,kneeY:152, ankleX:96,ankleY:175
    },'2');
    // Frame 3: DRIVE — explosive extension, on toes, bar leaving shoulders
    const f3=figure({
      headX:104,headY:60, shoulderX:104,shoulderY:74, hipX:100,hipY:108,
      elbowX:108,elbowY:58, handX:104,handY:50,
      kneeX:102,kneeY:140, ankleX:100,ankleY:168
    },'3');
    // Frame 4: Under the bar, arms extending overhead
    const f4=figure({
      headX:103,headY:68, shoulderX:103,shoulderY:82, hipX:100,hipY:116,
      elbowX:104,elbowY:56, handX:103,handY:42,
      kneeX:100,kneeY:146, ankleX:100,ankleY:174
    },'4');
    // Frame 5: SPLIT — front foot forward, back foot back, bar locked overhead
    const f5els=[
      uLeg(100,112,82,145,'5bl'),
      lLeg(82,145,72,172,'5bl'),
      foot(72,172,1,'5b'),
      uLeg(100,112,115,145,'5fl'),
      lLeg(115,145,112,175,'5fl'),
      foot(112,175,1,'5f'),
      torso(104,76,100,112,'5'),
      uArm(104,76,104,52,'5'),
      lArm(104,52,104,36,'5'),
      head(104,62,'5'),
      hBar(104,36,56,'5'),
    ];
    // Frame 6: RECOVERY — bringing feet together, bar still overhead
    const f6els=[
      uLeg(100,112,90,148,'6bl'),
      lLeg(90,148,85,175,'6bl'),
      foot(85,175,1,'6b'),
      uLeg(100,112,108,148,'6fl'),
      lLeg(108,148,105,175,'6fl'),
      foot(105,175,1,'6f'),
      torso(104,76,100,112,'6'),
      uArm(104,76,104,52,'6'),
      lArm(104,52,104,36,'6'),
      head(104,62,'6'),
      hBar(104,36,56,'6'),
    ];
    // Frame 7: Standing tall, feet together, bar overhead, arms locked
    const f7=figure({
      headX:102,headY:55, shoulderX:102,shoulderY:68, hipX:100,hipY:105,
      elbowX:102,elbowY:48, handX:102,handY:32,
      kneeX:100,kneeY:145, ankleX:100,ankleY:175
    },'7');

    return E('g',null,...bg,
      E('g',{key:'f1',className:'jk-f1'},...f1),
      E('g',{key:'f2',className:'jk-f2'},...f2),
      E('g',{key:'f3',className:'jk-f3'},...f3),
      E('g',{key:'f4',className:'jk-f4'},...f4),
      E('g',{key:'f5',className:'jk-f5'},...f5els),
      E('g',{key:'f6',className:'jk-f6'},...f6els),
      E('g',{key:'f7',className:'jk-f7'},...f7),
      label('JERK!','#ef7d57')
    );
  }

  /* =========================================================
     ANIMATION 5: SQUAT — 5 frames
     ========================================================= */
  if(at==='squat'){
    const isOH=eid==='overheadSquat';
    const isFront=eid==='frontSquat';
    const lbl=isOH?'OHS!':isFront?'FRONT SQUAT!':'SQUAT!';

    // Bar position helper: back squat = bar on upper back; front = on front delts; overhead = locked out
    function sqFrame(headX,headY,shoulderX,shoulderY,hipX,hipY,kneeX,kneeY,ankleX,ankleY,k){
      let elbowX,elbowY,handX,handY;
      if(isOH){
        // Arms locked overhead — nearly vertical
        elbowX=shoulderX+1; elbowY=shoulderY-20;
        handX=shoulderX; handY=shoulderY-40;
      } else if(isFront){
        // Front rack: elbows pointing forward and high, bar on front deltoids
        elbowX=shoulderX+12; elbowY=shoulderY-4;
        handX=shoulderX+6; handY=shoulderY;
      } else {
        // Back squat: hands on bar behind neck, elbows pointing down-back
        elbowX=shoulderX-6; elbowY=shoulderY+8;
        handX=shoulderX-2; handY=shoulderY-2;
      }
      return figure({headX,headY,shoulderX,shoulderY,hipX,hipY,elbowX,elbowY,handX,handY,kneeX,kneeY,ankleX,ankleY},k);
    }

    // Frame 1: Standing tall, bar on back/front/overhead
    const f1=sqFrame(102,60,102,74,100,110,100,145,100,175,'1');
    // Frame 2: Quarter squat descending
    const f2=sqFrame(102,72,102,86,98,120,98,150,98,175,'2');
    // Frame 3: Full deep squat — thighs below parallel, torso upright, feet flat
    const f3=sqFrame(100,95,98,108,85,140,95,158,90,175,'3');
    // Frame 4: Quarter squat rising
    const f4=sqFrame(102,72,102,86,98,120,98,150,98,175,'4');
    // Frame 5: Standing again
    const f5=sqFrame(102,60,102,74,100,110,100,145,100,175,'5');

    return E('g',null,...bg,
      E('g',{key:'f1',className:'sq-f1'},...f1),
      E('g',{key:'f2',className:'sq-f2'},...f2),
      E('g',{key:'f3',className:'sq-f3'},...f3),
      E('g',{key:'f4',className:'sq-f4'},...f4),
      E('g',{key:'f5',className:'sq-f5'},...f5),
      label(lbl,'#41a6f6')
    );
  }

  /* =========================================================
     ANIMATION 6: PULL / DEADLIFT — 5 frames
     ========================================================= */
  if(at==='pull'){
    // Frame 1: START — Deep squat, bar at floor, narrower grip than snatch
    const f1=figure({
      headX:100,headY:95, shoulderX:98,shoulderY:108, hipX:85,hipY:140,
      elbowX:96,elbowY:140, handX:92,handY:170,
      kneeX:95,kneeY:155, ankleX:90,ankleY:175
    },'1');
    // Frame 2: Bar at knee height, torso rising
    const f2=figure({
      headX:100,headY:82, shoulderX:100,shoulderY:96, hipX:90,hipY:128,
      elbowX:98,elbowY:128, handX:96,handY:148,
      kneeX:96,kneeY:150, ankleX:94,ankleY:175
    },'2');
    // Frame 3: LOCKOUT — Standing fully upright, arms hanging straight, bar at hip
    const f3=figure({
      headX:102,headY:55, shoulderX:102,shoulderY:68, hipX:100,hipY:105,
      elbowX:102,elbowY:96, handX:102,handY:112,
      kneeX:100,kneeY:145, ankleX:100,ankleY:175
    },'3');
    // Frame 4: Lowering — bar at mid-thigh, hinging forward
    const f4=figure({
      headX:100,headY:82, shoulderX:100,shoulderY:96, hipX:90,hipY:128,
      elbowX:98,elbowY:128, handX:96,handY:148,
      kneeX:96,kneeY:150, ankleX:94,ankleY:175
    },'4');
    // Frame 5: Back to start position
    const f5=figure({
      headX:100,headY:95, shoulderX:98,shoulderY:108, hipX:85,hipY:140,
      elbowX:96,elbowY:140, handX:92,handY:170,
      kneeX:95,kneeY:155, ankleX:90,ankleY:175
    },'5');

    return E('g',null,...bg,
      E('g',{key:'f1',className:'pl-f1'},...f1),
      E('g',{key:'f2',className:'pl-f2'},...f2),
      E('g',{key:'f3',className:'pl-f3'},...f3),
      E('g',{key:'f4',className:'pl-f4'},...f4),
      E('g',{key:'f5',className:'pl-f5'},...f5),
      label('PULL!','#ef7d57')
    );
  }

  /* =========================================================
     ANIMATION 7: PRESS — 5 frames
     ========================================================= */
  if(at==='press'){
    const isBench=eid==='benchPress';
    if(isBench){
      // Bench press: lying down side view
      const benchY=150;
      const f1els=[
        E('rect',{key:'bench1',x:50,y:benchY,width:80,height:6,rx:2,fill:'#566c86'}),
        E('rect',{key:'benchLeg1a',x:55,y:benchY+6,width:4,height:26,fill:'#566c86'}),
        E('rect',{key:'benchLeg1b',x:122,y:benchY+6,width:4,height:26,fill:'#566c86'}),
        // Lying body
        E('circle',{key:'hd1',cx:60,cy:benchY-8,r:9,fill:skin}),
        E('path',{key:'hr1',d:'M51 '+(benchY-14)+' Q51 '+(benchY-22)+' 60 '+(benchY-22)+' Q69 '+(benchY-22)+' 69 '+(benchY-14),fill:hair}),
        E('circle',{key:'ey1',cx:64,cy:benchY-7,r:1.5,fill:'#1a1c2c'}),
        E('line',{key:'to1',x1:68,y1:benchY-4,x2:110,y2:benchY-4,stroke:shirt,strokeWidth:10,strokeLinecap:'round'}),
        E('line',{key:'lg1a',x1:110,y1:benchY-4,x2:130,y2:benchY-4,stroke:shorts,strokeWidth:8,strokeLinecap:'round'}),
        // Arms holding bar above chest
        E('line',{key:'ua1',x1:80,y1:benchY-4,x2:80,y2:benchY-22,stroke:skin,strokeWidth:6,strokeLinecap:'round'}),
        E('line',{key:'la1',x1:80,y1:benchY-22,x2:82,y2:benchY-32,stroke:skin,strokeWidth:5,strokeLinecap:'round'}),
        hBar(82,benchY-32,50,'1'),
      ];
      const f2els=[
        E('rect',{key:'bench2',x:50,y:benchY,width:80,height:6,rx:2,fill:'#566c86'}),
        E('rect',{key:'benchLeg2a',x:55,y:benchY+6,width:4,height:26,fill:'#566c86'}),
        E('rect',{key:'benchLeg2b',x:122,y:benchY+6,width:4,height:26,fill:'#566c86'}),
        E('circle',{key:'hd2',cx:60,cy:benchY-8,r:9,fill:skin}),
        E('path',{key:'hr2',d:'M51 '+(benchY-14)+' Q51 '+(benchY-22)+' 60 '+(benchY-22)+' Q69 '+(benchY-22)+' 69 '+(benchY-14),fill:hair}),
        E('circle',{key:'ey2',cx:64,cy:benchY-7,r:1.5,fill:'#1a1c2c'}),
        E('line',{key:'to2',x1:68,y1:benchY-4,x2:110,y2:benchY-4,stroke:shirt,strokeWidth:10,strokeLinecap:'round'}),
        E('line',{key:'lg2a',x1:110,y1:benchY-4,x2:130,y2:benchY-4,stroke:shorts,strokeWidth:8,strokeLinecap:'round'}),
        E('line',{key:'ua2',x1:80,y1:benchY-4,x2:80,y2:benchY-16,stroke:skin,strokeWidth:6,strokeLinecap:'round'}),
        E('line',{key:'la2',x1:80,y1:benchY-16,x2:82,y2:benchY-22,stroke:skin,strokeWidth:5,strokeLinecap:'round'}),
        hBar(82,benchY-22,50,'2'),
      ];
      const f3els=[
        E('rect',{key:'bench3',x:50,y:benchY,width:80,height:6,rx:2,fill:'#566c86'}),
        E('rect',{key:'benchLeg3a',x:55,y:benchY+6,width:4,height:26,fill:'#566c86'}),
        E('rect',{key:'benchLeg3b',x:122,y:benchY+6,width:4,height:26,fill:'#566c86'}),
        E('circle',{key:'hd3',cx:60,cy:benchY-8,r:9,fill:skin}),
        E('path',{key:'hr3',d:'M51 '+(benchY-14)+' Q51 '+(benchY-22)+' 60 '+(benchY-22)+' Q69 '+(benchY-22)+' 69 '+(benchY-14),fill:hair}),
        E('circle',{key:'ey3',cx:64,cy:benchY-7,r:1.5,fill:'#1a1c2c'}),
        E('line',{key:'to3',x1:68,y1:benchY-4,x2:110,y2:benchY-4,stroke:shirt,strokeWidth:10,strokeLinecap:'round'}),
        E('line',{key:'lg3a',x1:110,y1:benchY-4,x2:130,y2:benchY-4,stroke:shorts,strokeWidth:8,strokeLinecap:'round'}),
        // Bar lowered to chest
        E('line',{key:'ua3',x1:80,y1:benchY-4,x2:82,y2:benchY-12,stroke:skin,strokeWidth:6,strokeLinecap:'round'}),
        E('line',{key:'la3',x1:82,y1:benchY-12,x2:82,y2:benchY-14,stroke:skin,strokeWidth:5,strokeLinecap:'round'}),
        hBar(82,benchY-14,50,'3'),
      ];
      // f4 = same as f2 (pushing back up), f5 = same as f1 (lockout)
      return E('g',null,...bg,
        E('g',{key:'f1',className:'pr-f1'},...f1els),
        E('g',{key:'f2',className:'pr-f2'},...f2els),
        E('g',{key:'f3',className:'pr-f3'},...f3els),
        E('g',{key:'f4',className:'pr-f4'},...f2els.map(function(el,i){return React.cloneElement(el,{key:el.key+'r'+i})})),
        E('g',{key:'f5',className:'pr-f5'},...f1els.map(function(el,i){return React.cloneElement(el,{key:el.key+'r'+i})})),
        label('BENCH!','#73eff7')
      );
    }
    // Standing overhead press
    // Frame 1: Bar at shoulders (front rack), elbows forward
    const f1=figure({
      headX:102,headY:68, shoulderX:102,shoulderY:82, hipX:100,hipY:118,
      elbowX:114,elbowY:78, handX:108,handY:82,
      kneeX:100,kneeY:148, ankleX:100,ankleY:175
    },'1');
    // Frame 2: Pressing, bar at forehead height
    const f2=figure({
      headX:102,headY:68, shoulderX:102,shoulderY:82, hipX:100,hipY:118,
      elbowX:106,elbowY:60, handX:102,handY:52,
      kneeX:100,kneeY:148, ankleX:100,ankleY:175
    },'2');
    // Frame 3: Lockout overhead — arms nearly vertical
    const f3=figure({
      headX:102,headY:68, shoulderX:102,shoulderY:82, hipX:100,hipY:118,
      elbowX:102,elbowY:56, handX:102,handY:38,
      kneeX:100,kneeY:148, ankleX:100,ankleY:175
    },'3');
    // Frame 4: Lowering back down
    const f4=figure({
      headX:102,headY:68, shoulderX:102,shoulderY:82, hipX:100,hipY:118,
      elbowX:106,elbowY:60, handX:102,handY:52,
      kneeX:100,kneeY:148, ankleX:100,ankleY:175
    },'4');
    // Frame 5: Back to front rack start
    const f5=figure({
      headX:102,headY:68, shoulderX:102,shoulderY:82, hipX:100,hipY:118,
      elbowX:114,elbowY:78, handX:108,handY:82,
      kneeX:100,kneeY:148, ankleX:100,ankleY:175
    },'5');

    return E('g',null,...bg,
      E('g',{key:'f1',className:'pr-f1'},...f1),
      E('g',{key:'f2',className:'pr-f2'},...f2),
      E('g',{key:'f3',className:'pr-f3'},...f3),
      E('g',{key:'f4',className:'pr-f4'},...f4),
      E('g',{key:'f5',className:'pr-f5'},...f5),
      label('PRESS!','#73eff7')
    );
  }

  /* =========================================================
     ANIMATION 8: JUMP — 5 frames
     ========================================================= */
  if(at==='jump'){
    // Frame 1: Standing ready (no barbell)
    const f1=figure({
      headX:94,headY:68, shoulderX:94,shoulderY:82, hipX:92,hipY:118,
      elbowX:100,elbowY:96, handX:98,handY:108,
      kneeX:92,kneeY:148, ankleX:90,ankleY:176
    },'1',false);
    // Frame 2: Squat down (loading)
    const f2=figure({
      headX:90,headY:98, shoulderX:90,shoulderY:110, hipX:84,hipY:140,
      elbowX:96,elbowY:126, handX:94,handY:140,
      kneeX:92,kneeY:158, ankleX:84,ankleY:176
    },'2',false);
    // Frame 3: Explosion - airborne, arms up
    const f3=figure({
      headX:96,headY:42, shoulderX:96,shoulderY:56, hipX:94,hipY:90,
      elbowX:102,elbowY:44, handX:98,handY:36,
      kneeX:92,kneeY:112, ankleX:90,ankleY:136
    },'3',false);
    // Frame 4: Peak of jump, arms high
    const f4=figure({
      headX:96,headY:36, shoulderX:96,shoulderY:50, hipX:94,hipY:86,
      elbowX:100,elbowY:38, handX:96,handY:28,
      kneeX:92,kneeY:108, ankleX:90,ankleY:130
    },'4',false);
    // Frame 5: Landing
    const f5=figure({
      headX:92,headY:90, shoulderX:92,shoulderY:104, hipX:86,hipY:136,
      elbowX:98,elbowY:120, handX:96,handY:132,
      kneeX:90,kneeY:156, ankleX:86,ankleY:176
    },'5',false);

    return E('g',null,...bg,
      E('g',{key:'f1',className:'jp-f1'},...f1),
      E('g',{key:'f2',className:'jp-f2'},...f2),
      E('g',{key:'f3',className:'jp-f3'},...f3),
      E('g',{key:'f4',className:'jp-f4'},...f4),
      E('g',{key:'f5',className:'jp-f5'},...f5),
      label('JUMP!','#a7f070')
    );
  }

  /* =========================================================
     ANIMATION 9: ACCESSORY — 4 frames (pullUp, hyperext, grip)
     ========================================================= */
  if(at==='accessory'){
    if(eid==='pullUp'){
      // Pull-up bar at top
      const barY=30;
      function puFrame(headY,shoulderY,hipY,kneeY,ankleY,elbowY,handY,k){
        return [
          E('line',{key:'pubar'+k,x1:40,y1:barY,x2:160,y2:barY,stroke:barC,strokeWidth:4,strokeLinecap:'round'}),
          uLeg(92,hipY,92,kneeY,k+'l'),
          lLeg(92,kneeY,90,ankleY,k+'l'),
          foot(90,ankleY,1,k),
          torso(94,shoulderY,92,hipY,k),
          uArm(94,shoulderY,98,elbowY,k),
          lArm(98,elbowY,96,handY,k),
          head(94,headY,k),
        ];
      }
      // Frame 1: Hanging (dead hang)
      const f1=puFrame(80,94,130,154,172,60,barY+2,'1');
      // Frame 2: Pulling up halfway
      const f2=puFrame(60,74,112,140,162,44,barY+2,'2');
      // Frame 3: Chin over bar
      const f3=puFrame(38,52,92,124,150,34,barY+2,'3');
      // Frame 4: Lowering back
      const f4=puFrame(60,74,112,140,162,44,barY+2,'4');

      return E('g',null,...bg,
        E('g',{key:'f1',className:'ac-f1'},...f1),
        E('g',{key:'f2',className:'ac-f2'},...f2),
        E('g',{key:'f3',className:'ac-f3'},...f3),
        E('g',{key:'f4',className:'ac-f4'},...f4),
        label('PULL UP!','#f4d03f')
      );
    }
    if(eid==='hyperext'){
      // Back extension on a GHD-like apparatus
      // Frame 1: Bent forward (torso hanging down)
      const f1els=[
        E('rect',{key:'ghd1',x:60,y:140,width:60,height:6,rx:2,fill:'#566c86'}),
        E('rect',{key:'ghdL1',x:62,y:146,width:4,height:30,fill:'#566c86'}),
        E('rect',{key:'ghdL2',x:114,y:146,width:4,height:30,fill:'#566c86'}),
        torso(80,142,70,160,'1h'),
        head(72,150,'1h'),
        uArm(80,142,74,154,'1h'),
        lArm(74,154,70,160,'1h'),
        uLeg(100,140,120,140,'1hl'),
        lLeg(120,140,136,140,'1hl'),
        foot(136,138,1,'1h'),
      ];
      // Frame 2: Rising
      const f2els=[
        E('rect',{key:'ghd2',x:60,y:140,width:60,height:6,rx:2,fill:'#566c86'}),
        E('rect',{key:'ghdL3',x:62,y:146,width:4,height:30,fill:'#566c86'}),
        E('rect',{key:'ghdL4',x:114,y:146,width:4,height:30,fill:'#566c86'}),
        torso(86,130,80,146,'2h'),
        head(84,120,'2h'),
        uArm(86,130,82,140,'2h'),
        lArm(82,140,78,146,'2h'),
        uLeg(100,140,120,140,'2hl'),
        lLeg(120,140,136,140,'2hl'),
        foot(136,138,1,'2h'),
      ];
      // Frame 3: Fully extended (torso horizontal or slightly above)
      const f3els=[
        E('rect',{key:'ghd3',x:60,y:140,width:60,height:6,rx:2,fill:'#566c86'}),
        E('rect',{key:'ghdL5',x:62,y:146,width:4,height:30,fill:'#566c86'}),
        E('rect',{key:'ghdL6',x:114,y:146,width:4,height:30,fill:'#566c86'}),
        torso(88,126,86,140,'3h'),
        head(86,116,'3h'),
        uArm(88,126,84,132,'3h'),
        lArm(84,132,80,138,'3h'),
        uLeg(100,140,120,140,'3hl'),
        lLeg(120,140,136,140,'3hl'),
        foot(136,138,1,'3h'),
      ];
      // Frame 4: Lowering back
      return E('g',null,...bg,
        E('g',{key:'f1',className:'ac-f1'},...f1els),
        E('g',{key:'f2',className:'ac-f2'},...f2els),
        E('g',{key:'f3',className:'ac-f3'},...f3els),
        E('g',{key:'f4',className:'ac-f4'},...f2els.map(function(el,i){return React.cloneElement(el,{key:el.key+'r'+i})})),
        label('HYPEREXT!','#94b0c2')
      );
    }
    // Grip training: squeezing a gripper
    const f1=figure({
      headX:94,headY:68, shoulderX:94,shoulderY:82, hipX:92,hipY:118,
      elbowX:106,elbowY:96, handX:110,handY:104,
      kneeX:92,kneeY:148, ankleX:90,ankleY:176
    },'1',false);
    const f2=figure({
      headX:94,headY:68, shoulderX:94,shoulderY:82, hipX:92,hipY:118,
      elbowX:106,elbowY:96, handX:112,handY:100,
      kneeX:92,kneeY:148, ankleX:90,ankleY:176
    },'2',false);
    const f3=figure({
      headX:94,headY:68, shoulderX:94,shoulderY:82, hipX:92,hipY:118,
      elbowX:106,elbowY:96, handX:110,handY:104,
      kneeX:92,kneeY:148, ankleX:90,ankleY:176
    },'3',false);
    const f4=figure({
      headX:94,headY:68, shoulderX:94,shoulderY:82, hipX:92,hipY:118,
      elbowX:106,elbowY:96, handX:112,handY:100,
      kneeX:92,kneeY:148, ankleX:90,ankleY:176
    },'4',false);
    // Add a gripper visual near hand
    function gripperAt(hx,hy,open,k){
      const gap=open?8:2;
      return E('g',{key:'grip'+k},
        E('line',{x1:hx+2,y1:hy-6,x2:hx+10,y2:hy-6-gap,stroke:'#566c86',strokeWidth:3,strokeLinecap:'round'}),
        E('line',{x1:hx+2,y1:hy-6,x2:hx+10,y2:hy-6+gap,stroke:'#566c86',strokeWidth:3,strokeLinecap:'round'})
      );
    }
    return E('g',null,...bg,
      E('g',{key:'f1',className:'ac-f1'},...f1,gripperAt(110,104,true,'1')),
      E('g',{key:'f2',className:'ac-f2'},...f2,gripperAt(112,100,false,'2')),
      E('g',{key:'f3',className:'ac-f3'},...f3,gripperAt(110,104,true,'3')),
      E('g',{key:'f4',className:'ac-f4'},...f4,gripperAt(112,100,false,'4')),
      label('GRIP!','#94b0c2')
    );
  }

  /* =========================================================
     ANIMATION 10: FLEXIBILITY — stretching side view
     ========================================================= */
  if(at==='flexibility'){
    // Simple stretch animation using CSS transform
    const bodyEls=[
      uLeg(92,118,92,148,'fl'),
      lLeg(92,148,90,176,'fl'),
      foot(90,176,1,'f'),
      torso(94,82,92,118,'f'),
      head(94,68,'f'),
    ];
    // One arm reaching up, one reaching down (side stretch)
    const armUp=[
      uArm(94,82,100,62,'fu'),
      lArm(100,62,106,50,'fu'),
    ];
    const armDown=[
      uArm(94,82,88,98,'fd'),
      lArm(88,98,84,112,'fd'),
    ];
    // Sparkles
    const sparkles=[
      E('circle',{key:'sp1',cx:60,cy:50,r:3,fill:'#a7f070',style:{animation:'mental-sparkle 1.5s ease infinite'}}),
      E('circle',{key:'sp2',cx:140,cy:45,r:2.5,fill:'#73eff7',style:{animation:'mental-sparkle 1.5s ease infinite 0.5s'}}),
      E('circle',{key:'sp3',cx:50,cy:80,r:2,fill:'#f4d03f',style:{animation:'mental-sparkle 1.5s ease infinite 1s'}}),
    ];
    return E('g',null,...bg,
      E('g',{key:'stretchBody',style:{transformOrigin:'93px 118px',animation:'flex-sway 2s ease-in-out infinite'}},...bodyEls,...armUp,...armDown),
      ...sparkles,
      label('STRETCH!','#a7f070')
    );
  }

  /* =========================================================
     ANIMATION 11: MENTAL — meditating (cross-legged, sparkles)
     ========================================================= */
  if(at==='mental'){
    // Cross-legged sitting position
    const sitY=140;
    const mentalEls=[
      // Crossed legs (simplified)
      E('line',{key:'mll',x1:88,y1:sitY+4,x2:78,y2:sitY+12,stroke:shorts,strokeWidth:8,strokeLinecap:'round'}),
      E('line',{key:'mll2',x1:78,y1:sitY+12,x2:92,y2:sitY+16,stroke:shorts,strokeWidth:7,strokeLinecap:'round'}),
      E('line',{key:'mlr',x1:96,y1:sitY+4,x2:106,y2:sitY+12,stroke:shorts,strokeWidth:8,strokeLinecap:'round'}),
      E('line',{key:'mlr2',x1:106,y1:sitY+12,x2:92,y2:sitY+16,stroke:shorts,strokeWidth:7,strokeLinecap:'round'}),
      // Feet
      E('rect',{key:'mfl',x:88,y:sitY+14,width:8,height:4,rx:2,fill:shoe}),
      E('rect',{key:'mfr',x:88,y:sitY+14,width:8,height:4,rx:2,fill:shoe}),
      // Torso
      torso(92,sitY-20,92,sitY+4,'m'),
      // Arms on knees (meditation pose)
      uArm(92,sitY-20,82,sitY-6,'ml'),
      lArm(82,sitY-6,80,sitY+6,'ml'),
      uArm(92,sitY-20,102,sitY-6,'mr'),
      lArm(102,sitY-6,104,sitY+6,'mr'),
      // Head
      head(92,sitY-32,'m'),
      // Closed eyes (meditation)
      E('line',{key:'meye',x1:95,y1:sitY-31,x2:98,y2:sitY-31,stroke:'#1a1c2c',strokeWidth:1.5,strokeLinecap:'round'}),
    ];
    // Sparkles and aura
    const sparkles=[
      E('ellipse',{key:'aura',cx:92,cy:sitY-10,rx:30,ry:22,fill:'none',stroke:'#f4d03f',strokeWidth:1,opacity:0.5,style:{animation:'mental-sparkle 2s ease infinite'}}),
      E('circle',{key:'ms1',cx:70,cy:sitY-40,r:3,fill:'#73eff7',style:{animation:'mental-sparkle 1.5s ease infinite 0.3s'}}),
      E('circle',{key:'ms2',cx:114,cy:sitY-44,r:2.5,fill:'#f4d03f',style:{animation:'mental-sparkle 1.5s ease infinite 0.7s'}}),
      E('circle',{key:'ms3',cx:92,cy:sitY-52,r:3,fill:'#a7f070',style:{animation:'mental-sparkle 1.5s ease infinite 1s'}}),
    ];
    return E('g',null,...bg,
      E('g',{key:'mentalBody',style:{animation:'mental-breathe 3s ease-in-out infinite'}},...mentalEls),
      ...sparkles,
      label('FOCUS...','#73eff7')
    );
  }

  /* =========================================================
     ANIMATION 12: REST — sleeping with ZZZ
     ========================================================= */
  // Default / rest
  const restY=148;
  const restEls=[
    // Lying on side (body horizontal)
    // Head (pillow implied)
    E('circle',{key:'rhd',cx:68,cy:restY-6,r:10,fill:skin}),
    E('path',{key:'rhr',d:'M58 '+(restY-12)+' Q58 '+(restY-20)+' 68 '+(restY-20)+' Q78 '+(restY-20)+' 78 '+(restY-12),fill:hair}),
    // Closed eyes
    E('line',{key:'reye',x1:72,y1:restY-5,x2:75,y2:restY-5,stroke:'#1a1c2c',strokeWidth:1.5,strokeLinecap:'round'}),
    // Torso (lying)
    E('line',{key:'rto',x1:78,y1:restY-2,x2:118,y2:restY-2,stroke:shirt,strokeWidth:12,strokeLinecap:'round'}),
    // Arm (draped)
    E('line',{key:'rua',x1:90,y1:restY-2,x2:92,y2:restY-12,stroke:skin,strokeWidth:6,strokeLinecap:'round'}),
    E('line',{key:'rla',x1:92,y1:restY-12,x2:96,y2:restY-8,stroke:skin,strokeWidth:5,strokeLinecap:'round'}),
    // Legs (curled up slightly)
    E('line',{key:'rul',x1:118,y1:restY-2,x2:128,y2:restY+6,stroke:shorts,strokeWidth:8,strokeLinecap:'round'}),
    E('line',{key:'rll',x1:128,y1:restY+6,x2:122,y2:restY+14,stroke:shorts,strokeWidth:7,strokeLinecap:'round'}),
    E('rect',{key:'rft',x:118,y:restY+12,width:8,height:4,rx:2,fill:shoe}),
  ];
  // ZZZ bubbles
  const zzz=[
    E('text',{key:'z1',x:105,y:restY-28,fill:'#41a6f6',fontSize:18,fontFamily:'VT323',style:{animation:'rest-zzz 2s ease-in-out infinite'}},'Z'),
    E('text',{key:'z2',x:118,y:restY-40,fill:'#41a6f6',fontSize:14,fontFamily:'VT323',style:{animation:'rest-zzz2 2s ease-in-out infinite 0.5s'}},'z'),
    E('text',{key:'z3',x:128,y:restY-50,fill:'#41a6f6',fontSize:11,fontFamily:'VT323',style:{animation:'rest-zzz 2s ease-in-out infinite 1s'}},'z'),
  ];
  return E('g',null,...bg,
    E('g',{key:'restBody',style:{animation:'rest-breathe 3s ease-in-out infinite'}},...restEls),
    ...zzz,
    label('REST...','#41a6f6')
  );
}

function ExerciseAnim({exerciseId,gender,onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2200);return()=>clearTimeout(t)},[]);
  const skin='#ffcc80',shirt=gender==='female'?'#b13e53':'#1565c0';
  return(
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40 pointer-events-none">
      <div className="pop-in">
        <svg viewBox="0 0 200 200" width="200" height="200">
          {getExerciseSVG(exerciseId,skin,shirt)}
        </svg>
      </div>
    </div>
  );
}
