const processes = [
  {pid:1240,name:"python3",user:"shinu",cpu:31.4,mem:4.8,threads:8,state:"Running"},
  {pid:2381,name:"chrome",user:"shinu",cpu:18.7,mem:9.6,threads:14,state:"Running"},
  {pid:4512,name:"sshd",user:"root",cpu:1.8,mem:0.8,threads:2,state:"Sleeping"},
  {pid:3190,name:"systemd",user:"root",cpu:2.1,mem:1.1,threads:1,state:"Sleeping"},
  {pid:5521,name:"backup.sh",user:"shinu",cpu:8.9,mem:2.4,threads:3,state:"Waiting"},
  {pid:6820,name:"unknown.py",user:"guest",cpu:76.2,mem:12.1,threads:5,state:"Running"},
  {pid:7312,name:"node",user:"dev",cpu:11.5,mem:6.7,threads:7,state:"Running"},
];

let alerts = [
  {sev:"critical",title:"High CPU process detected",detail:"unknown.py (PID 6820) is using 76.2% CPU.",time:"2 min ago"},
  {sev:"warning",title:"Elevated memory usage",detail:"Process memory crossed the configured review threshold.",time:"6 min ago"},
  {sev:"info",title:"System monitor heartbeat",detail:"Linux monitoring script completed successfully.",time:"11 min ago"}
];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function navigate(page){
  $$(".page").forEach(p=>p.classList.toggle("active-page",p.id===page));
  $$(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
  const titles={overview:"Security Overview",processes:"Process Monitor",scheduler:"CPU Scheduling Lab",alerts:"Security Alerts",shell:"Shell Monitor"};
  $("#pageTitle").textContent=titles[page];
  window.scrollTo({top:0,behavior:"smooth"});
}
$$(".nav").forEach(n=>n.onclick=()=>navigate(n.dataset.page));
$$("[data-page]").forEach(n=>n.onclick=()=>navigate(n.dataset.page));

function renderProcesses(){
  const q=($("#processSearch")?.value||"").toLowerCase();
  const rows=processes.filter(p=>String(p.pid).includes(q)||p.name.toLowerCase().includes(q));
  $("#processTable").innerHTML=rows.map(p=>`<tr><td>${p.pid}</td><td><b>${p.name}</b></td><td>${p.user}</td><td class="${p.cpu>50?"high":""}">${p.cpu.toFixed(1)}%</td><td>${p.mem.toFixed(1)}%</td><td>${p.threads}</td><td class="state">${p.state}</td></tr>`).join("");
  $("#topProcesses").innerHTML=processes.slice().sort((a,b)=>b.cpu-a.cpu).slice(0,5).map(p=>`<tr><td>${p.pid}</td><td><b>${p.name}</b></td><td>${p.user}</td><td class="${p.cpu>50?"high":""}">${p.cpu.toFixed(1)}%</td><td>${p.mem.toFixed(1)}%</td><td class="state">${p.state}</td></tr>`).join("");
}
function renderAlerts(){
  const html=alerts.map(a=>`<div class="alert-row"><i class="severity ${a.sev}"></i><div><strong>${a.title}</strong><small>${a.detail} • ${a.time}</small></div></div>`).join("");
  $("#alertList").innerHTML=html;
  $("#allAlerts").innerHTML=alerts.map(a=>`<div class="alert-card ${a.sev==="critical"?"critical-card":"warning-card"}"><div class="alert-meta">${a.sev} • ${a.time}</div><h3>${a.title}</h3><p>${a.detail}</p></div>`).join("");
}
function renderChart(){
  const cpu=[35,42,38,49,45,57,43,51,46,60,52,42], mem=[53,55,54,57,58,59,60,61,60,62,61,61];
  $("#resourceChart").innerHTML=cpu.map((v,i)=>`<div class="bar cpu" style="height:${v*1.75}px" title="CPU ${v}%"></div><div class="bar mem" style="height:${mem[i]*1.55}px" title="Memory ${mem[i]}%"></div>`).join("");
}
function readWorkload(){
  return $$(".input-row").map((r,i)=>{const x=r.querySelectorAll("input");return {id:"P"+(i+1),a:+x[0].value,b:+x[1].value,p:+x[2].value,remaining:+x[1].value}});
}
function scheduleFCFS(ps){
  const s=[...ps].sort((x,y)=>x.a-y.a), out=[]; let t=0;
  for(const p of s){t=Math.max(t,p.a);out.push({id:p.id,start:t,end:t+p.b});t+=p.b} return out;
}
function scheduleSJF(ps){
  const pending=[...ps],out=[];let t=0;
  while(pending.length){const ready=pending.filter(p=>p.a<=t);if(!ready.length){t=Math.min(...pending.map(p=>p.a));continue}const p=ready.sort((x,y)=>x.b-y.b||x.a-y.a)[0];pending.splice(pending.indexOf(p),1);out.push({id:p.id,start:t,end:t+p.b});t+=p.b}return out;
}
function schedulePriority(ps,preemptive=false){
  if(!preemptive){const pending=[...ps],out=[];let t=0;while(pending.length){const ready=pending.filter(p=>p.a<=t);if(!ready.length){t=Math.min(...pending.map(p=>p.a));continue}const p=ready.sort((x,y)=>x.p-y.p||x.a-y.a)[0];pending.splice(pending.indexOf(p),1);out.push({id:p.id,start:t,end:t+p.b});t+=p.b}return out;}
  const p=ps.map(x=>({...x,remaining:x.b})),out=[];let t=0,last=null;
  while(p.some(x=>x.remaining>0)){const ready=p.filter(x=>x.a<=t&&x.remaining>0);if(!ready.length){t++;continue}const cur=ready.sort((x,y)=>x.p-y.p||x.a-y.a)[0];if(last===cur.id&&out.length&&out.at(-1).end===t)out.at(-1).end++;else out.push({id:cur.id,start:t,end:t+1});cur.remaining--;last=cur.id;t++;}return out;
}
function scheduleSRTF(ps){
  const p=ps.map(x=>({...x,remaining:x.b})),out=[];let t=0,last=null;
  while(p.some(x=>x.remaining>0)){const ready=p.filter(x=>x.a<=t&&x.remaining>0);if(!ready.length){t++;continue}const cur=ready.sort((x,y)=>x.remaining-y.remaining||x.a-y.a)[0];if(last===cur.id&&out.length&&out.at(-1).end===t)out.at(-1).end++;else out.push({id:cur.id,start:t,end:t+1});cur.remaining--;last=cur.id;t++;}return out;
}
function runSchedule(){
  const ps=readWorkload(), alg=$("#algorithm").value;
  let g=alg==="FCFS"?scheduleFCFS(ps):alg==="SJF"?scheduleSJF(ps):alg==="SRTF"?scheduleSRTF(ps):schedulePriority(ps,alg==="Pre-emptive Priority");
  const completion={};g.forEach(x=>completion[x.id]=x.end);
  const waits=ps.map(p=>completion[p.id]-p.a-p.b), turns=ps.map(p=>completion[p.id]-p.a);
  const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
  $("#schedTitle").textContent=alg+" result";
  $("#gantt").innerHTML=g.map(x=>`<div class="gantt-block" style="flex:${x.end-x.start}">${x.id}<small>${x.start}</small></div>`).join("")+`<div class="gantt-block" style="flex:0"><small>${g.at(-1).end}</small></div>`;
  $("#schedMetrics").innerHTML=`<div class="metric"><span>AVG WAITING</span><strong>${avg(waits).toFixed(2)}</strong></div><div class="metric"><span>AVG TURNAROUND</span><strong>${avg(turns).toFixed(2)}</strong></div><div class="metric"><span>PROCESSES</span><strong>${ps.length}</strong></div>`;
}
function shellOutput(){
 return `$ ./system_monitor.sh
[CSOC] Linux System Monitor
--------------------------------
Hostname       : demo-linux
Uptime         : 5 hours, 42 minutes
CPU Usage      : 42%
Memory Usage   : 61%
Disk Usage     : 48%
Running Tasks  : 126

[PROCESS CHECK]
High CPU       : unknown.py (PID 6820)
High Memory    : chrome (PID 2381)

[SECURITY]
ALERT: abnormal CPU activity detected
Status: WATCH
--------------------------------
[CSOC] monitoring cycle complete`;
}
$("#processSearch").addEventListener("input",renderProcesses);
$("#runSchedule").onclick=runSchedule;
$("#refreshBtn").onclick=()=>{const c=42+Math.floor(Math.random()*14);$("#cpu").textContent=c+"%";renderProcesses();};
$("#simulateSpike").onclick=()=>{const p=processes.find(x=>x.pid===6820);p.cpu=91.7;alerts.unshift({sev:"critical",title:"CPU spike detected",detail:"unknown.py (PID 6820) reached 91.7% CPU.",time:"just now"});renderProcesses();renderAlerts();navigate("alerts");};
$("#addAlert").onclick=()=>{alerts.unshift({sev:"warning",title:"Demo security rule triggered",detail:"A monitored process exceeded the configured resource threshold.",time:"just now"});renderAlerts();};
$("#runShell").onclick=()=>{$("#terminalText").textContent=shellOutput();};
$("#terminalText").textContent="$ ./system_monitor.sh\nPress the button to run the monitoring script...";
renderProcesses();renderAlerts();renderChart();runSchedule();
