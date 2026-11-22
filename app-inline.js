
const START = new Date('2026-11-23T00:00:00'), EXAM = new Date('2027-01-21T00:00:00');
const plan = [
["Electrostatics: charges, fields & Gauss law","Solutions: concentration, Raoult's law & colligative properties","Matrices: operations, inverse & properties"],
["Electrostatic potential, dipole & capacitance","Electrochemistry: Nernst equation & conductance","Determinants: properties & applications"],
["Current electricity: circuits, Kirchhoff & bridges","Chemical kinetics: rate laws & integrated equations","Relations, functions & inverse trigonometry"],
["Moving charges, magnetic field & force","Coordination compounds: nomenclature & bonding","Continuity, differentiability & AOD"],
["Magnetism, EMI & AC circuits","d- and f-block; inorganic NCERT revision","AOD: maxima, minima & applications"],
["Ray optics: mirrors, lenses, prism","Haloalkanes, haloarenes & mechanisms","Indefinite integration: methods & standard forms"],
["Wave optics: YDSE, diffraction & polarisation","Alcohols, phenols & ethers","Definite integration: properties & applications"],
["Modern physics: dual nature & atoms","Aldehydes, ketones & carboxylic acids","Differential equations & area under curves"],
["Nuclei, semiconductors & logic gates","Amines, biomolecules & named reactions","Vectors: dot, cross & scalar triple product"],
["Class 12 Physics formula revision + PYQs","Class 12 Chemistry NCERT + PYQs","3D geometry, probability & calculus revision"],
["Class 12 mixed timed practice + weak areas","Class 12 mixed timed practice + weak areas","Class 12 mixed timed practice + weak areas"],
["Class 12 full mock + detailed analysis","Repair weak Chemistry topics from mock","Repair weak Maths topics from mock"],
["Kinematics 1D/2D & Newton's laws","Mole concept & atomic structure","Quadratics, sequence & series"],
["Work, energy, power & collisions","Periodic table & chemical bonding","Binomial theorem & straight lines"],
["Centre of mass & rotational motion","Thermodynamics & chemical equilibrium","Circles & conic sections"],
["Gravitation, fluids & mechanical properties","Ionic equilibrium & redox","Parabola, ellipse & hyperbola"],
["Thermal physics, KTG & thermodynamics","GOC: effects, acidity/basicity & stability","Trigonometry, P&C & complex numbers"],
["SHM, waves & sound","Hydrocarbons: reactions & mechanisms","Class 11 algebra mixed PYQs"],
["Class 11 Physics high-yield PYQ drill","Class 11 Chemistry high-yield PYQ drill","Class 11 Maths high-yield PYQ drill"],
["Class 11 formula consolidation + weak topics","Class 11 reaction map + NCERT facts","Class 11 mixed timed practice"],
["Full mock test + deep analysis","Error-log repair & NCERT revision","Error-log repair & timed practice"],
["Full mock test + deep analysis","Organic/inorganic rapid revision","Calculus, algebra & coordinate revision"],
["Mixed PYQ sprint: Physics","Mixed PYQ sprint: Chemistry","Mixed PYQ sprint: Mathematics"],
["Full mock test + detailed analysis","Fix top 3 Chemistry weaknesses","Fix top 3 Maths weaknesses"],
["Final formula sheets & selected PYQs","NCERT facts, reactions & exceptions","Standard results & selected PYQs"],
["Final full mock / exam simulation","Analyse errors; no new heavy topic","Analyse errors; confidence & speed"],
["Light revision: formulae + error notebook","Light NCERT/reaction revision","Light formula revision; sleep on time"]
];
const defaults={tasks:{},sessions:[],mocks:[],alarm:null,dayIndex:0};
let state={...defaults,...JSON.parse(localStorage.getItem('jeeMissionState')||'{}')};
function save(){localStorage.setItem('jeeMissionState',JSON.stringify(state));renderAll()}
function dateFor(i){let d=new Date(START);d.setDate(d.getDate()+i);return d}
function fmt(d){return d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
function idxToday(){let n=Math.floor((new Date().setHours(0,0,0,0)-START.getTime())/86400000);return Math.max(0,Math.min(59,n))}
function key(i){return 'd'+i}
function tasksFor(i){let weekly=isCumulativeTestDay(i);let base=['Learn/revise core concepts (theory + short notes)','Solve 25–40 quality JEE questions / PYQs','Review every mistake and update error log','Recall formulas/reactions without looking','Board-focused revision / written practice'];base.push(weekly?'Complete scheduled 3-hour cumulative / full mock test':'Complete scheduled 60-minute topic test (9:30–10:30 PM)');base.push('Analyse wrong and skipped questions; add them to error log');return base.map((t,j)=>({id:key(i)+'_'+j,label:t,done:!!state.tasks[key(i)+'_'+j]}))}
const sprintTopics = [
// Days 1-6: Class 12 first (six study days, day 7 cumulative test)
[
['Electrostatics: charges, fields & Gauss law','Solutions: concentration & colligative properties','Matrices: operations & inverse'],
['Electrostatic potential, dipole & capacitance','Solutions: Raoult law & abnormal molar mass','Determinants: properties'],
['Current electricity: circuits & Kirchhoff laws','Electrochemistry: conductance','Determinants: applications'],
['Moving charges & magnetic field','Electrochemistry: Nernst equation','Relations, functions & inverse trigonometry'],
['Magnetism, EMI & AC circuits','Chemical kinetics: rate laws','Continuity & differentiability'],
['Ray optics: mirrors, lenses & prism','Chemical kinetics: integrated equations','Applications of derivatives']
],
[
['Wave optics: YDSE & diffraction','Coordination compounds: nomenclature','AOD: maxima & minima'],
['Dual nature & photoelectric effect','Coordination compounds: bonding','Indefinite integration: standard forms'],
['Atoms & Bohr model','d- and f-block elements','Indefinite integration: substitution & parts'],
['Nuclei & radioactivity','Haloalkanes & haloarenes','Definite integration: properties'],
['Semiconductors & logic gates','Alcohols, phenols & ethers','Definite integration: area'],
['Class 12 Physics formulae + PYQs','Organic reactions + NCERT recall','Differential equations']
],
[
['Kinematics: 1D & graphs','Mole concept & stoichiometry','Complex numbers'],
['Kinematics: 2D & projectile motion','Atomic structure','Quadratic equations'],
['Laws of motion & friction','Periodic table & periodicity','Sequences & series'],
['Work, energy & power','Chemical bonding: VSEPR & hybridisation','Binomial theorem'],
['Centre of mass & collisions','Chemical bonding: MOT','Straight lines'],
['Rotational motion','Mole concept + bonding PYQs','Circles']
],
[
['Gravitation','Thermodynamics: first law','Parabola'],
['Fluids & mechanical properties','Thermochemistry & Hess law','Ellipse & hyperbola'],
['Thermal properties & calorimetry','Chemical equilibrium','Trigonometric equations'],
['Kinetic theory of gases','Ionic equilibrium','Permutations & combinations'],
['Thermodynamics: kinetic theory links','Redox reactions','Complex numbers mixed practice'],
['SHM: equations & energy','GOC: electronic effects','Class 11 algebra mixed PYQs']
],
[
['Waves & sound','GOC: acidity/basicity','Vectors: dot & cross product'],
['Class 11 mechanics mixed PYQs','GOC: intermediates & isomerism','3D geometry: lines & planes'],
['Class 11 thermal physics revision','Hydrocarbons: alkanes & alkenes','Probability'],
['Class 11 Physics weak chapters','Hydrocarbons: alkynes & aromatic','Statistics'],
['Class 11 Chemistry NCERT + PYQs','Organic mechanisms & conversions','Trigonometry revision'],
['Class 11 Maths mixed PYQs','Chemical equilibrium revision','Coordinate geometry mixed PYQs']
],
[
['Class 12 electrostatics + current electricity revision','Physical chemistry revision','Matrices, determinants & functions revision'],
['Class 12 magnetism + EMI + AC revision','Inorganic chemistry NCERT revision','Calculus: limits to AOD revision'],
['Class 12 optics + modern physics revision','Organic chemistry reaction map','Integral calculus revision'],
['Class 11 mechanics full revision','Mole, atomic structure & bonding revision','Algebra & coordinate geometry revision'],
['Class 11 thermal physics + waves revision','Equilibrium, redox & GOC revision','Vectors, 3D & probability revision'],
['Mixed PYQ drill: Physics','Mixed PYQ drill: Chemistry','Mixed PYQ drill: Mathematics']
],
[
['Weak-area repair from cumulative tests','NCERT inorganic facts & exceptions','Calculus weak-area repair'],
['Mechanics advanced numericals','Organic named reactions & conversions','Algebra advanced problem set'],
['Electricity & magnetism PYQs','Physical chemistry numericals','Coordinate geometry PYQs'],
['Optics & modern physics PYQs','Inorganic + practical chemistry','Vectors, 3D & probability PYQs'],
['Full Class 11 formula revision','Full Class 11 reaction & NCERT revision','Full Class 11 maths formula revision'],
['Full Class 12 formula revision','Full Class 12 reaction & NCERT revision','Full Class 12 maths formula revision']
],
[
['Mixed Physics: all Class 11 + 12 units','Mixed Chemistry: all Class 11 + 12 units','Mixed Mathematics: all Class 11 + 12 units'],
['Repair mock-1 Physics errors','Repair mock-1 Chemistry errors','Repair mock-1 Mathematics errors'],
['High-yield Physics PYQs','High-yield Chemistry PYQs','High-yield Mathematics PYQs'],
['Final formula sheets + error notebook','NCERT facts, reactions & exceptions','Standard results & selected PYQs'],
['Light revision: Physics','Light revision: Chemistry','Light revision: Mathematics'],
['Exam strategy, accuracy & time allocation','Quick NCERT recall','Rest, sleep & confidence']
]
];
function isCumulativeTestDay(i){return [6,13,20,27,34,41,48,55,56,57,58,59].includes(i)}
function dayPlan(i){
 if(i>=56){const finals=[
 ['FULL MOCK 1: Class 11 + 12','FULL MOCK 1: Class 11 + 12','FULL MOCK 1: Class 11 + 12'],
 ['FULL MOCK 2: Class 11 + 12','FULL MOCK 2: Class 11 + 12','FULL MOCK 2: Class 11 + 12'],
 ['FULL MOCK 3: Class 11 + 12','FULL MOCK 3: Class 11 + 12','FULL MOCK 3: Class 11 + 12'],
 ['Final mixed revision & error repair','Final mixed revision & NCERT recall','Final mixed revision & formula recall']
 ];return finals[i-56];}
 if(i%7===6){const a=i-5,b=i;return [`CUMULATIVE TEST: Physics · Days ${a+1}–${b}`,`CUMULATIVE TEST: Chemistry · Days ${a+1}–${b}`,`CUMULATIVE TEST: Mathematics · Days ${a+1}–${b}`]}
 return sprintTopics[Math.floor(i/7)][i%7];
}
function renderPlan(){let i=state.dayIndex||0,p=dayPlan(i);document.getElementById('dayTitle').textContent=`Day ${i+1} of 60`;document.getElementById('dayDate').textContent=fmt(dateFor(i));['planPhy','planChem','planMath'].forEach((id,j)=>document.getElementById(id).textContent=p[j]);document.getElementById('prevDay').disabled=i===0;document.getElementById('nextDay').disabled=i===59;document.getElementById('planTasks').innerHTML=tasksFor(i).map(t=>`<div class="task"><input type="checkbox" data-task="${t.id}" ${t.done?'checked':''}><label>${t.label}<small>${t.done?'Completed':'Not completed yet'}</small></label></div>`).join('')}
function renderHome(){let i=idxToday(),p=dayPlan(i),ts=tasksFor(i),done=ts.filter(t=>t.done).length;document.getElementById('daysLeft').textContent=Math.max(0,Math.ceil((EXAM-new Date().setHours(0,0,0,0))/86400000));document.getElementById('homePhy').textContent=p[0];document.getElementById('homeChem').textContent=p[1];document.getElementById('homeMath').textContent=p[2];document.getElementById('doneCount').textContent=Object.values(state.tasks).filter(Boolean).length;document.getElementById('studyHours').textContent=(state.sessions.reduce((a,s)=>a+s.minutes,0)/60).toFixed(1)+'h';document.getElementById('latestScore').textContent=state.mocks.length?state.mocks[state.mocks.length-1].score:'—';document.getElementById('percent').textContent=Math.round(done/ts.length*100)+'%';document.getElementById('progressBar').style.width=(done/ts.length*100)+'%';document.getElementById('homeTasks').innerHTML=ts.map(t=>`<div class="task"><input type="checkbox" data-task="${t.id}" ${t.done?'checked':''}><label>${t.label}</label></div>`).join('')}
function renderRoutine(){let rows=[['06:30','Wake up + water'],['07:00–09:30','Physics · concept + questions'],['09:45–12:15','Chemistry · NCERT + practice'],['12:15–13:15','Lunch + rest'],['13:15–16:15','Mathematics · problem solving'],['16:15–17:00','Walk + refresh'],['17:00–19:00','PYQs + weak chapters'],['19:00–20:00','Dinner'],['20:00–21:30','Revision + error log'],['21:30–22:30','Wind down · sleep']];document.getElementById('routineList').innerHTML=rows.map(r=>`<div class="task"><b style="min-width:95px;color:var(--blue)">${r[0]}</b><span>${r[1]}</span></div>`).join('');if(state.alarm){document.getElementById('alarmTime').value=state.alarm.time;document.getElementById('alarmLabel').value=state.alarm.label;document.getElementById('alarmStatus').textContent=`Alarm saved for ${state.alarm.time}: ${state.alarm.label}`}}
function renderScores(){let m=state.mocks;let latest=m.length?m[m.length-1].score:null;document.getElementById('scoreBig').textContent=latest??'—';document.getElementById('scoreBar').style.width=(latest?Math.min(100,latest/300*100):0)+'%';document.getElementById('mockTable').innerHTML=m.length?`<table><thead><tr><th>Test</th><th>Date</th><th>Score</th><th>Accuracy</th><th>Lesson</th></tr></thead><tbody>${m.slice().reverse().map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.date)}</td><td><b>${x.score}/${x.maxScore||300}</b></td><td>${x.accuracy||'—'}%</td><td>${esc(x.note||'—')}</td></tr>`).join('')}</tbody></table>`:'<div class="empty">No mock tests logged yet. Add your first result above.</div>'}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderFocus(){document.getElementById('focusToday').textContent=state.sessions.filter(s=>s.date===new Date().toISOString().slice(0,10)).length;document.getElementById('focusTotal').textContent=(state.sessions.reduce((a,s)=>a+s.minutes,0)/60).toFixed(1)+'h';document.getElementById('focusStreak').textContent=new Set(state.sessions.map(s=>s.date)).size;document.getElementById('focusLog').innerHTML=state.sessions.slice(-6).reverse().map(s=>`<div class="task"><b>${s.minutes}m</b><span>${esc(s.subject)} · ${esc(s.type)}<small>${s.date}</small></span></div>`).join('')||'<p class="empty">Finish a focus session to start your log.</p>'}
function renderAll(){renderHome();renderPlan();renderRoutine();renderScores();renderFocus()}
function showTab(t){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('hidden',v.id!==t));document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));if(t==='plan')renderPlan()}
document.getElementById('tabs').addEventListener('click',e=>{let b=e.target.closest('[data-tab]');if(b)showTab(b.dataset.tab)});
document.addEventListener('change',e=>{if(e.target.matches('[data-task]')){state.tasks[e.target.dataset.task]=e.target.checked;save()}});
document.getElementById('prevDay').onclick=()=>{state.dayIndex=Math.max(0,(state.dayIndex||0)-1);save()};document.getElementById('nextDay').onclick=()=>{state.dayIndex=Math.min(59,(state.dayIndex||0)+1);save()};
let durations={theory:50,practice:90,revision:30,break:10},remaining=3000,interval=null,startedAt=0;
const clock=document.getElementById('clock');
function setTimer(){let m=Math.floor(remaining/60),s=remaining%60;clock.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');document.getElementById('timerPhase').textContent=document.getElementById('sessionType').selectedOptions[0].text.split(' · ')[0];}
document.getElementById('sessionType').onchange=()=>{remaining=durations[document.getElementById('sessionType').value]*60;setTimer()};
document.getElementById('startTimer').onclick=()=>{if(interval)return;startedAt=Date.now();interval=setInterval(()=>{remaining=Math.max(0,remaining-1);setTimer();if(!remaining){clearInterval(interval);interval=null;let type=document.getElementById('sessionType').value,mins=durations[type],subject=document.getElementById('sessionSubject').value;if(type!=='break'){state.sessions.push({date:new Date().toISOString().slice(0,10),minutes:mins,type,subject});save()}try{new AudioContext().resume();}catch(e){}alert(type==='break'?'Break complete. Return refreshed.':'Session complete. Take a short break.');}},1000)};
document.getElementById('pauseTimer').onclick=()=>{clearInterval(interval);interval=null};document.getElementById('resetTimer').onclick=()=>{clearInterval(interval);interval=null;remaining=durations[document.getElementById('sessionType').value]*60;setTimer()};
document.getElementById('addTest').onclick=()=>{let score=Number(document.getElementById('testScore').value);if(!Number.isFinite(score)||score<0||score>300){alert('Enter a score between 0 and 300.');return}state.mocks.push({name:document.getElementById('testName').value||'Mock test',date:document.getElementById('testDate').value||new Date().toISOString().slice(0,10),score,accuracy:Number(document.getElementById('testAccuracy').value)||0,note:document.getElementById('testNote').value});save();['testName','testScore','testAccuracy','testNote'].forEach(id=>document.getElementById(id).value='')};
document.getElementById('saveAlarm').onclick=()=>{state.alarm={time:document.getElementById('alarmTime').value,label:document.getElementById('alarmLabel').value};save();document.getElementById('alarmStatus').textContent=`Saved for ${state.alarm.time}. Keep app open for in-app reminder.`};
document.getElementById('testAlarm').onclick=()=>{try{let c=new AudioContext(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.value=.15;o.start();o.stop(c.currentTime+.35)}catch(e){alert('Sound unavailable in this browser.')}};
document.getElementById('notifyBtn').onclick=async()=>{if(!('Notification'in window)){alert('Notifications are not supported here.');return}let p=await Notification.requestPermission();document.getElementById('alarmStatus').textContent='Notification permission: '+p};
document.getElementById('exportBtn').onclick=()=>{let blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='jee-mission-backup.json';a.click();URL.revokeObjectURL(a.href)};
document.getElementById('importBtn').onclick=()=>document.getElementById('importFile').click();document.getElementById('importFile').onchange=async e=>{let f=e.target.files[0];if(!f)return;try{let d=JSON.parse(await f.text());if(!d||typeof d!=='object'||!d.tasks)throw Error();state={...defaults,...d};save();alert('Backup imported.')}catch(err){alert('That backup file could not be read.')}};
let deferred=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;document.getElementById('installBtn').classList.remove('hidden')});document.getElementById('installBtn').onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null}};
if('serviceWorker'in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
document.getElementById('testDate').value=new Date().toISOString().slice(0,10);renderAll();setTimer();

// Private sync client: explicit push/pull prevents accidental overwrites.
const syncConfig = JSON.parse(localStorage.getItem('jeeMissionSync') || '{"url":"","key":""}');
function loadSyncFields(){document.getElementById('syncUrl').value=syncConfig.url||'';document.getElementById('syncKey').value=syncConfig.key||'';}
function saveSyncConfig(){syncConfig.url=document.getElementById('syncUrl').value.trim().replace(/\/+$/,'');syncConfig.key=document.getElementById('syncKey').value.trim();localStorage.setItem('jeeMissionSync',JSON.stringify(syncConfig));syncMessage('Sync settings saved on this device.');}
function syncMessage(s){document.getElementById('syncStatus').textContent=s;}
async function syncRequest(method,body){if(!syncConfig.url||!syncConfig.key)throw Error('Enter and save the server address and access key first.');let r=await fetch(syncConfig.url+'/api/state',{method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+syncConfig.key},...(body?{body:JSON.stringify(body)}:{})});let data=await r.json().catch(()=>({}));if(!r.ok)throw Error(data.error||('Server returned '+r.status));return data;}
document.getElementById('saveSync').onclick=saveSyncConfig;
document.getElementById('testSync').onclick=async()=>{saveSyncConfig();try{await syncRequest('GET');syncMessage('Connection successful. Server is reachable and the key was accepted.');}catch(e){syncMessage('Connection failed: '+e.message)}};
document.getElementById('pushSync').onclick=async()=>{saveSyncConfig();if(!confirm('Replace the data currently stored on the sync server with this device’s data?'))return;try{await syncRequest('PUT',{state,updatedAt:new Date().toISOString()});syncMessage('Upload complete. This device is now the latest saved copy.');}catch(e){syncMessage('Upload failed: '+e.message)}};
document.getElementById('pullSync').onclick=async()=>{saveSyncConfig();if(!confirm('Replace this device’s current data with the latest data from the server? Export a backup first if needed.'))return;try{let d=await syncRequest('GET');if(!d.state||typeof d.state!=='object')throw Error('No saved state exists on the server yet.');state={...defaults,...d.state};save();syncMessage('Download complete. This device now matches the server copy.');}catch(e){syncMessage('Download failed: '+e.message)}};
loadSyncFields();

