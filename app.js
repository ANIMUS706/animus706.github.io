"use strict";

/* =====================================================
   STUDYTUNE
   ===================================================== */

const KEY = "studyTuneUltimateV1";

const GROUPS = [
  "همه",
  "تجربی",
  "ریاضی",
  "انسانی",
  "هنر",
  "زبان",
  "عمومی"
];

const SUBJECTS = [
  ["زیست‌شناسی","تجربی","#ec4899"],
  ["شیمی","تجربی","#22c55e"],
  ["فیزیک","تجربی","#06b6d4"],
  ["ریاضی","تجربی","#8b5cf6"],
  ["زمین‌شناسی","تجربی","#f59e0b"],

  ["ریاضی","ریاضی","#8b5cf6"],
  ["فیزیک","ریاضی","#06b6d4"],
  ["شیمی","ریاضی","#22c55e"],

  ["ریاضی و آمار","انسانی","#8b5cf6"],
  ["اقتصاد","انسانی","#22c55e"],
  ["علوم و فنون ادبی","انسانی","#ec4899"],
  ["عربی تخصصی","انسانی","#06b6d4"],
  ["تاریخ","انسانی","#f59e0b"],
  ["جغرافیا","انسانی","#14b8a6"],
  ["جامعه‌شناسی","انسانی","#ef4444"],
  ["روان‌شناسی","انسانی","#a855f7"],
  ["فلسفه و منطق","انسانی","#f97316"],

  ["درک عمومی هنر","هنر","#ec4899"],
  ["درک عمومی ریاضی و فیزیک","هنر","#06b6d4"],
  ["خلاقیت تصویری و تجسمی","هنر","#8b5cf6"],

  ["زبان انگلیسی","زبان","#06b6d4"],

  ["فارسی","عمومی","#f97316"],
  ["عربی","عمومی","#22c55e"],
  ["دینی و قرآن","عمومی","#a855f7"],
  ["زبان انگلیسی","عمومی","#06b6d4"],
  ["سلامت و بهداشت","عمومی","#ef4444"],
  ["علوم اجتماعی","عمومی","#f59e0b"]
].map((x,i)=>({
 id:"subject_"+i,
 name:x[0],
 group:x[1],
 color:x[2]
}));


const ACHIEVEMENTS = [
 {
  id:"first_session",
  icon:"🌱",
  name:"اولین جلسه",
  desc:"اولین جلسه مطالعه را ثبت کن.",
  check:d=>d.tasks.length>=1
 },
 {
  id:"five_sessions",
  icon:"📚",
  name:"۵ جلسه",
  desc:"۵ جلسه مطالعه.",
  check:d=>d.tasks.length>=5
 },
 {
  id:"ten_tests",
  icon:"📝",
  name:"۱۰ تست",
  desc:"حداقل ۱۰ تست ثبت کن.",
  check:d=>testTotal(d)>=10
 },
 {
  id:"hundred_tests",
  icon:"💯",
  name:"۱۰۰ تست",
  desc:"۱۰۰ تست ثبت کن.",
  check:d=>testTotal(d)>=100
 },
 {
  id:"ten_hours",
  icon:"⏱️",
  name:"۱۰ ساعت",
  desc:"۱۰ ساعت مطالعه.",
  check:d=>totalStudy(d)>=600
 },
 {
  id:"fifty_hours",
  icon:"🔥",
  name:"۵۰ ساعت",
  desc:"۵۰ ساعت مطالعه.",
  check:d=>totalStudy(d)>=3000
 },
 {
  id:"seven_streak",
  icon:"🔥",
  name:"۷ روز",
  desc:"هفت روز متوالی فعال باش.",
  check:d=>getStreak(d)>=7
 },
 {
  id:"thirty_streak",
  icon:"👑",
  name:"۳۰ روز",
  desc:"۳۰ روز متوالی فعال باش.",
  check:d=>getStreak(d)>=30
 },
 {
  id:"perfect_day",
  icon:"🎯",
  name:"روز کامل",
  desc:"تمام فعالیت‌های یک روز را انجام بده.",
  check:d=>d.tasks.some(t=>t.done)
 }
];


/* =====================================================
   DATA
   ===================================================== */

function defaultData(){

 return {
  subjects:SUBJECTS.map(x=>({...x})),
  tasks:[],
  tests:[],
  mistakes:[],
  reviews:[],
  routines:[],
  achievements:[],
  settings:{
   name:"",
   dailyGoal:360,
   weeklyGoal:2520,
   examDate:""
  },
  xp:0,
  theme:"purple"
 };

}


let data;

try{
 data=JSON.parse(
  localStorage.getItem(KEY)
 );
}catch{
 data=null;
}

if(!data){
 data=defaultData();
 save();
}

data.subjects ||= SUBJECTS.map(x=>({...x}));
data.tasks ||= [];
data.tests ||= [];
data.mistakes ||= [];
data.reviews ||= [];
data.routines ||= [];
data.achievements ||= [];
data.settings ||= {};
data.settings.name ||= "";
data.settings.dailyGoal ||= 360;
data.settings.weeklyGoal ||= 2520;
data.settings.examDate ||= "";
data.xp ||= 0;
data.theme ||= "purple";


function save(){

 localStorage.setItem(
  KEY,
  JSON.stringify(data)
 );

}


/* =====================================================
   HELPERS
   ===================================================== */

const $ = id =>
 document.getElementById(id);


function esc(value){

 return String(value ?? "")
  .replaceAll("&","&amp;")
  .replaceAll("<","&lt;")
  .replaceAll(">","&gt;")
  .replaceAll('"',"&quot;")
  .replaceAll("'","&#039;");

}


function pad(n){
 return String(n).padStart(2,"0");
}


function todayKey(){

 return dateKey(
  new Date()
 );

}


function dateKey(d){

 return [
  d.getFullYear(),
  pad(d.getMonth()+1),
  pad(d.getDate())
 ].join("-");
}


function parseDate(key){

 const [y,m,d]=
  key.split("-").map(Number);

 return new Date(y,m-1,d);

}


function faDate(date){

 return new Intl.DateTimeFormat(
  "fa-IR",
  {
   weekday:"long",
   day:"numeric",
   month:"long"
  }
 ).format(date);

}


function formatMinutes(minutes){

 minutes=Math.round(
  Number(minutes)||0
 );

 if(minutes<60)
  return `${minutes} دقیقه`;

 const h=Math.floor(minutes/60);
 const m=minutes%60;

 return m
  ?`${h}س ${m}د`
  :`${h} ساعت`;

}


function subjectById(id){

 return data.subjects.find(
  s=>s.id===id
 );

}


function subjectName(id){

 return subjectById(id)?.name ||
  "درس نامشخص";

}


function subjectColor(id){

 return subjectById(id)?.color ||
  "#7c3aed";

}


function totalStudy(d=data){

 return d.tasks.reduce(
  (sum,t)=>sum+Number(t.duration||0),
  0
 );

}


function tasksForDate(key){

 return data.tasks
  .filter(t=>t.date===key)
  .sort((a,b)=>
   a.start.localeCompare(b.start)
  );

}


function totalMinutes(tasks){

 return tasks.reduce(
  (s,t)=>s+Number(t.duration||0),
  0
 );

}


function testTotal(d=data){

 return d.tests.reduce(
  (s,t)=>s+Number(t.total||0),
  0
 );

}


function testCorrect(d=data){

 return d.tests.reduce(
  (s,t)=>s+Number(t.correct||0),
  0
 );

}


function testWrong(d=data){

 return d.tests.reduce(
  (s,t)=>s+Number(t.wrong||0),
  0
 );

}


function testAccuracy(d=data){

 const total=testTotal(d);

 return total
  ?Math.round(testCorrect(d)/total*100)
  :0;

}


/* =====================================================
   NAVIGATION
   ===================================================== */

document
 .querySelectorAll("#nav button")
 .forEach(btn=>{

  btn.onclick=()=>{

   document
    .querySelectorAll("#nav button")
    .forEach(x=>
     x.classList.remove("active")
    );

   btn.classList.add("active");

   document
    .querySelectorAll(".page")
    .forEach(x=>
     x.classList.remove("active")
    );

   $("page-"+btn.dataset.page)
    .classList.add("active");

   renderAll();

  };

 });


function openPage(page){

 const btn=
  document.querySelector(
   `[data-page="${page}"]`
  );

 if(btn)btn.click();

}


/* =====================================================
   SELECTED DATE
   ===================================================== */

let selectedDate=new Date();

let calendarDate=new Date();


/* =====================================================
   TODAY
   ===================================================== */

function renderToday(){

 const key=dateKey(selectedDate);

 const tasks=tasksForDate(key);

 $("dayTitle").textContent=
  key===todayKey()
   ?"امروز"
   :faDate(selectedDate);

 $("dayDate").textContent=
  new Intl.DateTimeFormat(
   "fa-IR",
   {
    year:"numeric",
    month:"long",
    day:"numeric"
   }
  ).format(selectedDate);

 const done=
  tasks.filter(t=>t.done).length;

 const percent=
  tasks.length
   ?Math.round(done/tasks.length*100)
   :0;

 $("dailyPercent").textContent=
  percent+"٪";

 $("dailyProgress").style.width=
  percent+"%";

 if(!tasks.length){

  $("timeline").innerHTML=`
   <div class="empty">
    📅<br><br>
    برای این روز برنامه‌ای نداری.
   </div>
  `;

  return;

 }

 $("timeline").innerHTML=
  tasks.map(task=>{

   const endTime=taskEnd(task);

   return `
    <div class="timeline-item ${task.done?"done":""}">

     <div class="time">
      ${esc(task.start)}
     </div>

     <div class="line">
      <div
       class="dot"
       style="background:${subjectColor(task.subject)}">
      </div>
     </div>

     <div
      class="timeline-card"
      style="border-right-color:${subjectColor(task.subject)}">

      <div class="activity-main">

       <div class="activity-title">
        ${esc(subjectName(task.subject))}
       </div>

       <div class="activity-topic">
        ${esc(task.topic||"مطالعه")}
       </div>

       <div class="activity-meta">

        <span class="badge">
         ⏱ ${task.duration} دقیقه
        </span>

        <span class="badge">
         تا ${endTime}
        </span>

       </div>

      </div>

      <div class="activity-actions">

       <button
        class="small-btn"
        onclick="startTaskTimer('${task.id}')">
        ▶
       </button>

       <button
        class="small-btn"
        onclick="toggleTask('${task.id}')">
        ${task.done?"↩":"✓"}
       </button>

       <button
        class="small-btn"
        onclick="editTask('${task.id}')">
        ✎
       </button>

       <button
        class="small-btn"
        onclick="deleteTask('${task.id}')">
        🗑
       </button>

      </div>

     </div>

    </div>
   `;

  }).join("");

}


function taskEnd(task){

 const [h,m]=
  task.start.split(":").map(Number);

 const total=
  h*60+m+Number(task.duration);

 return `${pad(Math.floor(total/60)%24)}:${pad(total%60)}`;

}


window.toggleTask=id=>{

 const task=
  data.tasks.find(t=>t.id===id);

 if(!task)return;

 const before=task.done;

 task.done=!task.done;

 if(!before)
  addXP(10);

 save();

 renderAll();

};


window.deleteTask=id=>{

 if(!confirm("این فعالیت حذف شود؟"))
  return;

 data.tasks=
  data.tasks.filter(
   t=>t.id!==id
  );

 save();

 renderAll();

};


window.editTask=id=>{

 const task=
  data.tasks.find(t=>t.id===id);

 if(!task)return;

 $("editId").value=id;
 $("fDate").value=task.date;
 $("fSubject").value=task.subject;
 $("fTopic").value=task.topic||"";
 $("fStart").value=task.start;
 $("fDuration").value=task.duration;
 $("fRepeat").value=task.repeat||"none";
 $("fNote").value=task.note||"";

 $("activityModalTitle").textContent=
  "ویرایش فعالیت";

 showModal("activityModal");

};


$("prevDay").onclick=()=>{

 selectedDate.setDate(
  selectedDate.getDate()-1
 );

 renderToday();

};


$("nextDay").onclick=()=>{

 selectedDate.setDate(
  selectedDate.getDate()+1
 );

 renderToday();

};


$("todayBtn").onclick=()=>{

 selectedDate=new Date();

 renderToday();

};


/* =====================================================
   ACTIVITY FORM
   ===================================================== */

function fillSubjectSelect(id){

 $(id).innerHTML=
  data.subjects.map(s=>`
   <option value="${s.id}">
    ${esc(s.name)} — ${esc(s.group)}
   </option>
  `).join("");

}


function resetActivity(){

 $("activityForm").reset();

 $("editId").value="";

 $("fDate").value=
  dateKey(selectedDate);

 $("fDuration").value=60;

 fillSubjectSelect("fSubject");

 $("activityModalTitle").textContent=
  "افزودن فعالیت";

}


$("fab").onclick=()=>{

 resetActivity();

 showModal("activityModal");

};


$("activityForm").onsubmit=e=>{

 e.preventDefault();

 const id=$("editId").value;

 const task={
  id:id||crypto.randomUUID(),
  date:$("fDate").value,
  subject:$("fSubject").value,
  topic:$("fTopic").value.trim(),
  start:$("fStart").value,
  duration:Number($("fDuration").value),
  repeat:$("fRepeat").value,
  note:$("fNote").value.trim(),
  done:id
   ?data.tasks.find(t=>t.id===id)?.done||false
   :false
 };

 if(id){

  const index=
   data.tasks.findIndex(
    t=>t.id===id
   );

  if(index>=0)
   data.tasks[index]=task;

 }else{

  data.tasks.push(task);

  generateRepeats(task);

  addXP(5);

 }

 save();

 hideModal("activityModal");

 renderAll();

};


function generateRepeats(task){

 if(task.repeat==="daily"){

  for(let i=1;i<=30;i++){

   const d=parseDate(task.date);

   d.setDate(
    d.getDate()+i
   );

   data.tasks.push({
    ...task,
    id:crypto.randomUUID(),
    date:dateKey(d),
    repeat:"generated",
    done:false
   });

  }

 }

 if(task.repeat==="weekly"){

  for(let i=1;i<=12;i++){

   const d=parseDate(task.date);

   d.setDate(
    d.getDate()+i*7
   );

   data.tasks.push({
    ...task,
    id:crypto.randomUUID(),
    date:dateKey(d),
    repeat:"generated",
    done:false
   });

  }

 }


}


/* =====================================================
   WEEK
   ===================================================== */

function mondayOfWeek(d){

 const x=new Date(d);

 const day=x.getDay();

 x.setDate(
  x.getDate()+
  (day===0?-6:1-day)
 );

 return x;

}


function renderWeek(){

 const monday=
  mondayOfWeek(selectedDate);

 const names=[
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه"
 ];

 $("weekGrid").innerHTML="";

 for(let i=0;i<7;i++){

  const d=new Date(monday);

  d.setDate(
   monday.getDate()+i
  );

  const key=dateKey(d);

  const tasks=tasksForDate(key);

  const div=document.createElement("div");

  div.className=
   "week-day"+
   (
    key===dateKey(selectedDate)
     ?" active"
     :""
   );

  div.innerHTML=`
   <div class="week-day-name">
    ${names[i]}
   </div>

   <div class="week-day-number">
    ${d.getDate()}
   </div>

   ${tasks.slice(0,3).map(t=>`
    <div
     class="week-task"
     style="border-right:2px solid ${subjectColor(t.subject)}">
     ${esc(subjectName(t.subject))}
    </div>
   `).join("")}

   ${
    tasks.length>3
     ?`<small style="color:#64748b">
       +${tasks.length-3}
      </small>`
     :""
   }
  `;

  div.onclick=()=>{
   selectedDate=new Date(d);
   openPage("today");
  };

  $("weekGrid").appendChild(div);

 }

 renderMonth();

}


$("prevWeek").onclick=()=>{

 selectedDate.setDate(
  selectedDate.getDate()-7
 );

 renderWeek();

};


$("nextWeek").onclick=()=>{

 selectedDate.setDate(
  selectedDate.getDate()+7
 );

 renderWeek();

};


/* =====================================================
   MONTH CALENDAR
   ===================================================== */

function renderMonth(){

 const year=
  calendarDate.getFullYear();

 const month=
  calendarDate.getMonth();

 const first=
  new Date(year,month,1);

 let start=first.getDay();

 /*
   تبدیل یکشنبه به شنبه
 */
 start=start===0?6:start-1;

 const days=
  new Date(
   year,
   month+1,
   0
  ).getDate();

 const names=[
  "ش",
  "ی",
  "د",
  "س",
  "چ",
  "پ",
  "ج"
 ];

 let html=
  names.map(n=>
   `<div class="month-head">${n}</div>`
  ).join("");

 for(let i=0;i<start;i++)
  html+=`<div></div>`;

 for(let day=1;day<=days;day++){

  const d=
   new Date(year,month,day);

  const key=dateKey(d);

  const tasks=
   tasksForDate(key);

  const isToday=
   key===todayKey();

  const isSelected=
   key===dateKey(selectedDate);

  html+=`

   <div
    class="month-day ${
     isToday?"today":""
    } ${
     isSelected?"selected":""
    }"
    data-date="${key}">

    <div class="month-number">
     ${day}
    </div>

    ${
     tasks.slice(0,5).map(t=>
      `<span
       class="activity-dot"
       style="background:${subjectColor(t.subject)}">
      </span>`
     ).join("")
    }

   </div>
  `;

 }

 $("monthCalendar").innerHTML=html;

 $("monthCalendar")
  .querySelectorAll(".month-day")
  .forEach(day=>{

   day.onclick=()=>{

    selectedDate=
     parseDate(
      day.dataset.date
     );

    openPage("today");

   };

  });

}


$("prevMonth").onclick=()=>{

 calendarDate.setMonth(
  calendarDate.getMonth()-1
 );

 renderMonth();

};


$("nextMonth").onclick=()=>{

 calendarDate.setMonth(
  calendarDate.getMonth()+1
 );

 renderMonth();

};


/* =====================================================
   ROUTINES
   ===================================================== */

$("addRoutineBtn").onclick=()=>{
 showModal("routineModal");
};


$("routineForm").onsubmit=e=>{

 e.preventDefault();

 const days=
  [...$("routineDays").selectedOptions]
   .map(x=>Number(x.value));

 if(!days.length){

  alert("حداقل یک روز انتخاب کن.");

  return;

 }

 data.routines.push({
  id:crypto.randomUUID(),
  name:$("routineName").value.trim(),
  days
 });

 save();

 hideModal("routineModal");

 renderRoutines();

};


function renderRoutines(){

 if(!data.routines.length){

  $("routineList").innerHTML=
   `<div class="empty">
     هنوز روتینی ثبت نشده.
    </div>`;

  return;

 }

 const names=[
  "جمعه",
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه"
 ];

 $("routineList").innerHTML=
  data.routines.map(r=>`

   <div class="test-record">

    <div>
     <strong>🔄 ${esc(r.name)}</strong>

     <small>
      ${r.days.map(d=>names[d]).join("، ")}
     </small>
    </div>

    <button
     class="danger-btn"
     onclick="deleteRoutine('${r.id}')">
     🗑
    </button>

   </div>

  `).join("");

}


window.deleteRoutine=id=>{

 data.routines=
  data.routines.filter(
   r=>r.id!==id
  );

 save();

 renderRoutines();

};


/* =====================================================
   TESTS
   ===================================================== */

$("addTestBtn").onclick=()=>{

 fillSubjectSelect("testSubject");

 showModal("testModal");

};


$("testForm").onsubmit=e=>{

 e.preventDefault();

 const total=
  Number($("testCount").value);

 const correct=
  Number($("testCorrectInput").value);

 const wrong=
  Number($("testWrongInput").value);

 const blank=
  Number($("testBlankInput").value);

 if(correct+wrong+blank>total){

  alert(
   "مجموع درست، غلط و نزده نمی‌تواند بیشتر از کل تست باشد."
  );

  return;

 }

 const test={
  id:crypto.randomUUID(),
  date:todayKey(),
  subject:$("testSubject").value,
  topic:$("testTopic").value.trim(),
  total,
  correct,
  wrong,
  blank,
  time:Number($("testTime").value)||0
 };

 data.tests.push(test);

 addXP(
  Math.min(
   50,
   Math.max(5,Math.floor(total/5))
  )
 );

 save();

 hideModal("testModal");

 renderTests();

 renderDashboard();

};


function renderTests(){

 const total=testTotal();
 const correct=testCorrect();
 const wrong=testWrong();

 $("testTotal").textContent=total;
 $("testCorrect").textContent=correct;
 $("testWrong").textContent=wrong;
 $("testAccuracy").textContent=
  testAccuracy()+"٪";


 const map={};

 data.tests.forEach(t=>{

  if(!map[t.subject])
   map[t.subject]={
    total:0,
    correct:0
   };

  map[t.subject].total+=t.total;
  map[t.subject].correct+=t.correct;

 });

 $("subjectTestStats").innerHTML=
  Object.entries(map).length
   ?Object.entries(map).map(
    ([id,x])=>{

     const percent=
      x.total
       ?Math.round(x.correct/x.total*100)
       :0;

     return `
      <div class="subject-test-row">

       <div class="subject-test-head">
        <strong>
         ${esc(subjectName(id))}
        </strong>
        <span>${percent}٪</span>
       </div>

       <div class="big-progress">
        <div
         style="width:${percent}%">
        </div>
       </div>

       <small style="color:var(--muted)">
        ${x.correct} درست از ${x.total}
       </small>

      </div>
     `;

    }
   ).join("")
   :`<div class="empty">هنوز تستی ثبت نشده.</div>`;


 const history=
  [...data.tests]
   .reverse()
   .slice(0,20);

 $("testHistory").innerHTML=
  history.length
   ?history.map(t=>{

    const percent=
     t.total
      ?Math.round(t.correct/t.total*100)
      :0;

    return `
     <div class="test-record">

      <div>
       <strong>
        ${esc(subjectName(t.subject))}
       </strong>

       <small>
        ${esc(t.topic||"بدون مبحث")}
        • ${t.date}
       </small>
      </div>

      <div>
       <strong style="color:#c4b5fd">
        ${percent}٪
       </strong>

       <small>
        ${t.correct}/${t.total}
       </small>
      </div>

     </div>
    `;

   }).join("")
   :`<div class="empty">هنوز تستی ثبت نشده.</div>`;

}


/* =====================================================
   SMART REVIEW
   ===================================================== */

const REVIEW_DAYS=[1,3,7,14,30];


function createReview(task){

 REVIEW_DAYS.forEach(days=>{

  const d=parseDate(task.date);

  d.setDate(
   d.getDate()+days
  );

  data.reviews.push({
   id:crypto.randomUUID(),
   taskId:task.id,
   subject:task.subject,
   topic:task.topic,
   date:dateKey(d),
   interval:days,
   done:false
  });

 });

}


function renderReviews(){

 const today=todayKey();

 const reviews=
  data.reviews
   .filter(r=>!r.done)
   .sort((a,b)=>
    a.date.localeCompare(b.date)
   );

 $("reviewList").innerHTML=
  reviews.length
   ?reviews.map(r=>{

    const status=
     r.date<today
      ?"overdue"
      :r.date===today
       ?"today"
       :"";

    return `
     <div class="review-card ${status}">

      <div class="review-head">

       <strong>
        🔁 ${esc(subjectName(r.subject))}
       </strong>

       <span>
        ${r.date}
       </span>

      </div>

      <div class="review-body">
       ${esc(r.topic||"مرور کلی")}
       • مرور ${r.interval} روزه
      </div>

      <button
       class="primary-btn"
       style="margin-top:9px"
       onclick="completeReview('${r.id}')">
       ✓ انجام شد
      </button>

     </div>
    `;

   }).join("")
   :`<div class="empty">
      🎉 مرور عقب‌افتاده‌ای نداری.
    </div>`;

}


window.completeReview=id=>{

 const review=
  data.reviews.find(
   r=>r.id===id
  );

 if(!review)return;

 review.done=true;

 addXP(15);

 save();

 renderReviews();

 renderDashboard();

};


/*
  هنگام ایجاد فعالیت جدید،
  مرورها را نیز ایجاد می‌کنیم.
*/
const originalPushTask=
 null;


/* =====================================================
   MISTAKES
   ===================================================== */

$("addMistakeBtn").onclick=()=>{

 fillSubjectSelect("mistakeSubject");

 showModal("mistakeModal");

};


$("mistakeForm").onsubmit=e=>{

 e.preventDefault();

 data.mistakes.push({
  id:crypto.randomUUID(),
  date:todayKey(),
  subject:$("mistakeSubject").value,
  topic:$("mistakeTopic").value.trim(),
  reason:$("mistakeReason").value,
  note:$("mistakeNote").value.trim(),
  reviewed:false
 });

 addXP(8);

 save();

 hideModal("mistakeModal");

 renderMistakes();

};


function renderMistakes(){

 $("mistakeList").innerHTML=
  data.mistakes.length
   ?[...data.mistakes].reverse()
    .map(m=>`

     <div class="mistake">

      <div class="mistake-head">

       <strong>
        ${esc(subjectName(m.subject))}
        ${
         m.topic
          ?" — "+esc(m.topic)
          :""
        }
       </strong>

       <span class="mistake-reason">
        ${esc(m.reason)}
       </span>

      </div>

      <p>
       ${esc(m.note||"بدون یادداشت")}
      </p>

      <button
       class="secondary-btn"
       onclick="toggleMistake('${m.id}')">

       ${
        m.reviewed
         ?"✓ مرور شده"
         :"○ علامت‌گذاری به‌عنوان مرور شده"
       }

      </button>

     </div>

    `).join("")
   :`<div class="empty">
      هنوز اشتباهی ثبت نکرده‌ای.
    </div>`;

}


window.toggleMistake=id=>{

 const m=
  data.mistakes.find(
   x=>x.id===id
  );

 if(!m)return;

 m.reviewed=!m.reviewed;

 if(m.reviewed)
  addXP(5);

 save();

 renderMistakes();

};


/* =====================================================
   TIMER
   ===================================================== */

let timerSeconds=0;
let timerInterval=null;
let timerMode="stopwatch";
let pomoMinutes=25;
let timerRunning=false;


document
 .querySelectorAll("[data-timer-mode]")
 .forEach(btn=>{

  btn.onclick=()=>{

   document
    .querySelectorAll("[data-timer-mode]")
    .forEach(x=>
     x.classList.remove("active")
    );

   btn.classList.add("active");

   timerMode=
    btn.dataset.timerMode;

   timerSeconds=0;

   if(timerMode==="pomodoro"){

    pomoMinutes=25;

    $("pomodoroOptions")
     .classList.add("show");

   }else{

    $("pomodoroOptions")
     .classList.remove("show");

   }

   updateTimer();

  };

 });


document
 .querySelectorAll("[data-pomo]")
 .forEach(btn=>{

  btn.onclick=()=>{

   pomoMinutes=
    Number(btn.dataset.pomo);

   timerSeconds=0;

   updateTimer();

  };

 });


$("timerStart").onclick=()=>{

 if(timerRunning)return;

 timerRunning=true;

 timerInterval=
  setInterval(
   tickTimer,
   1000
  );

 $("timerStatus").textContent=
  timerMode==="pomodoro"
   ?"پومودورو در حال اجرا..."
   :"در حال مطالعه...";

};


$("timerPause").onclick=()=>{

 if(!timerRunning)return;

 clearInterval(timerInterval);

 timerInterval=null;

 timerRunning=false;

 $("timerStatus").textContent=
  "تایمر متوقف شد";

};


$("timerStop").onclick=()=>{

 stopTimer(true);

};


function tickTimer(){

 if(timerMode==="pomodoro"){

  const max=pomoMinutes*60;

  if(timerSeconds<max)
   timerSeconds++;

  else{

   stopTimer(true);

   alert("🎉 زمان مطالعه تمام شد! وقت استراحت است.");

   return;

  }

 }else{

  timerSeconds++;

 }

 updateTimer();

}


function updateTimer(){

 const h=Math.floor(
  timerSeconds/3600
 );

 const m=Math.floor(
  (timerSeconds%3600)/60
 );

 const s=
  timerSeconds%60;

 $("timer").textContent=
  `${pad(h)}:${pad(m)}:${pad(s)}`;

 const minutes=
  Math.floor(timerSeconds/60);

 const today=
  totalMinutes(
   tasksForDate(todayKey())
  );

 const percent=
  Math.min(
   100,
   (today+minutes)/
   data.settings.dailyGoal*100
  );

 $("timerGoalBar").style.width=
  percent+"%";

 $("timerGoalText").textContent=
  `${today+minutes} / ${data.settings.dailyGoal} دقیقه`;

}


function stopTimer(saveIt){

 if(timerInterval)
  clearInterval(timerInterval);

 timerInterval=null;
 timerRunning=false;

 const minutes=
  Math.floor(timerSeconds/60);

 if(saveIt&&minutes>0){

  const subject=
   data.subjects[0]?.id;

  data.tasks.push({
   id:crypto.randomUUID(),
   date:todayKey(),
   subject,
   topic:"جلسه تایمر",
   start:new Date()
    .toTimeString()
    .slice(0,5),
   duration:minutes,
   repeat:"none",
   note:"ثبت‌شده با تایمر",
   done:true
  });

  addXP(
   Math.min(
    50,
    Math.max(5,minutes)
   )
  );

  save();

 }

 timerSeconds=0;

 $("timerStatus").textContent=
  "آماده شروع مطالعه";

 updateTimer();

 renderAll();

}


window.startTaskTimer=id=>{

 const task=
  data.tasks.find(t=>t.id===id);

 if(!task)return;

 $("timerSubject").textContent=
  `${subjectName(task.subject)} — ${task.topic||"مطالعه"}`;

 timerSeconds=0;

 openPage("timer");

 updateTimer();

};


/* =====================================================
   STREAK
   ===================================================== */

function getActiveDates(){

 return new Set(
  data.tasks
   .filter(t=>
    t.done ||
    Number(t.duration)>0
   )
   .map(t=>t.date)
 );

}


function getStreak(d=data){

 const active=
  new Set(
   d.tasks
    .filter(t=>
     t.done ||
     Number(t.duration)>0
    )
    .map(t=>t.date)
  );

 let date=new Date();

 let streak=0;

 /*
   اگر امروز هنوز مطالعه نشده،
   از دیروز شروع می‌کنیم.
 */

 if(!active.has(dateKey(date))){

  date.setDate(
   date.getDate()-1
  );

 }

 while(
  active.has(
   dateKey(date)
  )
 ){

  streak++;

  date.setDate(
   date.getDate()-1
  );

 }

 return streak;

}


/* =====================================================
   XP / LEVEL
   ===================================================== */

function getLevel(){

 return Math.floor(
  Math.sqrt(data.xp/100)
 )+1;

}


function levelBase(level){

 return (level-1)*(level-1)*100;

}


function addXP(amount){

 data.xp+=Number(amount)||0;

 checkAchievements();

 save();

}


function renderXP(){

 const level=getLevel();

 const base=levelBase(level);

 const next=
  levelBase(level+1);

 const progress=
  Math.max(
   0,
   data.xp-base
  );

 const needed=
  next-base;

 $("levelNumber").textContent=
  level;

 $("levelText").textContent=
  "Level "+level;

 $("xpText").textContent=
  `${data.xp} XP`;

 $("xpNext").textContent=
  `${Math.max(0,needed-progress)} XP تا سطح بعد`;

 $("xpBar").style.width=
  Math.min(
   100,
   progress/needed*100
  )+"%";

}


/* =====================================================
   ACHIEVEMENTS
   ===================================================== */

function checkAchievements(){

 ACHIEVEMENTS.forEach(a=>{

  if(
   !data.achievements.includes(a.id) &&
   a.check(data)
  ){

   data.achievements.push(a.id);

   data.xp+=50;

  }

 });

 save();

}


function renderAchievements(){

 const unlocked=
  new Set(data.achievements);

 $("achievementCount").textContent=
  `${data.achievements.length}/${ACHIEVEMENTS.length}`;

 $("achievementPreview").innerHTML=
  ACHIEVEMENTS.slice(0,8)
   .map(a=>`

    <div class="achievement ${
     unlocked.has(a.id)
      ?""
      :"locked"
    }">

     <div class="achievement-icon">
      ${a.icon}
     </div>

     <span class="achievement-name">
      ${a.name}
     </span>

    </div>

   `).join("");

 $("achievementList").innerHTML=
  ACHIEVEMENTS.map(a=>`

   <div class="test-record">

    <div>
     <strong>
      ${a.icon} ${a.name}
     </strong>

     <small>
      ${a.desc}
     </small>
    </div>

    <strong>
     ${
      unlocked.has(a.id)
       ?"🏆"
       :"🔒"
     }
    </strong>

   </div>

  `).join("");

}


$("achievementPreview").onclick=()=>{
 showModal("achievementModal");
};


/* =====================================================
   DASHBOARD
   ===================================================== */

function renderDashboard(){

 const now=new Date();

 $("dashboardDate").textContent=
  new Intl.DateTimeFormat(
   "fa-IR",
   {
    weekday:"long",
    year:"numeric",
    month:"long",
    day:"numeric"
   }
  ).format(now);

 $("dashboardGreeting").textContent=
  data.settings.name
   ?`سلام ${data.settings.name} 👋`
   :"سلام 👋";

 const today=
  totalMinutes(
   tasksForDate(todayKey())
  );

 const todayTests=
  data.tests.filter(
   t=>t.date===todayKey()
  );

 const todayTotal=
  todayTests.reduce(
   (s,t)=>s+t.total,
   0
  );

 const todayCorrect=
  todayTests.reduce(
   (s,t)=>s+t.correct,
   0
  );

 $("dashMinutes").textContent=
  today;

 $("dashTests").textContent=
  todayTotal;

 $("dashAccuracy").textContent=
  (
   todayTotal
    ?Math.round(todayCorrect/todayTotal*100)
    :0
  )+"٪";

 $("dashStreak").textContent=
  getStreak();

 const goal=
  data.settings.dailyGoal;

 const percent=
  Math.min(
   100,
   today/goal*100
  );

 $("dashGoalBar").style.width=
  percent+"%";

 $("dashGoalPercent").textContent=
  Math.round(percent)+"٪";

 $("dashGoalText").textContent=
  `${today} / ${goal} دقیقه`;

 renderXP();
 renderAchievements();
 renderSuggestion();
 renderDashboardChart();
 renderCountdown();

}


function renderCountdown(){

 if(!data.settings.examDate){

  $("examCountdown").textContent=
   "تاریخ تعیین نشده";

  return;

 }

 const exam=
  parseDate(
   data.settings.examDate
  );

 const now=new Date();

 exam.setHours(23,59,59,999);

 const diff=
  exam-now;

 if(diff<=0){

  $("examCountdown").textContent=
   "آزمون گذشته";

  return;

 }

 const days=
  Math.ceil(
   diff/(1000*60*60*24)
  );

 $("examCountdown").textContent=
  `${days} روز`;

}


/* =====================================================
   SMART SUGGESTION
   ===================================================== */

function renderSuggestion(){

 const suggestion=
  makeSuggestion();

 if(!suggestion){

  $("suggestionBox").innerHTML=
   `<div class="empty">
     برای پیشنهاد مطالعه هنوز داده کافی نداریم.
    </div>`;

  return;

 }

 $("suggestionBox").innerHTML=`

  <div class="suggestion">

   <div class="suggestion-icon">
    ✨
   </div>

   <div class="suggestion-info">

    <strong>
     ${esc(subjectName(suggestion.subject))}
    </strong>

    <span>
     ${esc(suggestion.reason)}
    </span>

   </div>

   <button
    class="primary-btn"
    onclick="quickAddSuggestion('${suggestion.subject}')">
    + برنامه
   </button>

  </div>

 `;

}


function makeSuggestion(){

 /*
  اول درس‌هایی که تست ضعیف دارند.
 */

 const subjectScores=
  data.subjects.map(s=>{

   const tests=
    data.tests.filter(
     t=>t.subject===s.id
    );

   const total=
    tests.reduce(
     (x,t)=>x+t.total,
     0
    );

   const correct=
    tests.reduce(
     (x,t)=>x+t.correct,
     0
    );

   const score=
    total
     ?correct/total
     :null;

   const study=
    totalMinutes(
     data.tasks.filter(
      t=>t.subject===s.id
     )
    );

   return {
    subject:s.id,
    score,
    study
   };

  });


 const weak=
  subjectScores
   .filter(x=>x.score!==null)
   .sort(
    (a,b)=>a.score-b.score
   )[0];

 if(weak){

  return {
   subject:weak.subject,
   reason:
    `درصد تست این درس پایین‌تر است (${Math.round(weak.score*100)}٪). بهتر است امروز روی آن تمرکز کنی.`
  };

 }

 const least=
  subjectScores.sort(
   (a,b)=>a.study-b.study
  )[0];

 if(least){

  return {
   subject:least.subject,
   reason:
    "این درس نسبت به بقیه زمان مطالعه کمتری داشته است."
  };

 }

 return null;

}


window.quickAddSuggestion=subject=>{

 resetActivity();

 $("fSubject").value=subject;

 $("fTopic").value=
  "مطالعه پیشنهادی";

 $("fDuration").value=60;

 $("fStart").value=
  new Date()
   .toTimeString()
   .slice(0,5);

 showModal("activityModal");

};


$("newSuggestion").onclick=
 ()=>renderSuggestion();


/* =====================================================
   CHARTS
   ===================================================== */

function makeChart(containerId,days){

 const box=$(containerId);

 if(!box)return;

 box.innerHTML="";

 const values=[];

 for(let i=days-1;i>=0;i--){

  const d=new Date();

  d.setDate(
   d.getDate()-i
  );

  values.push({
   date:d,
   minutes:
    totalMinutes(
     tasksForDate(
      dateKey(d)
     )
    )
  });

 }

 const max=
  Math.max(
   60,
   ...values.map(x=>x.minutes)
  );

 values.forEach(x=>{

  const item=
   document.createElement("div");

  item.className="bar-item";

  const bar=
   document.createElement("div");

  bar.className="bar";

  const fill=
   document.createElement("div");

  fill.style.height=
   `${Math.min(
    100,
    x.minutes/max*100
   )}%`;

  bar.appendChild(fill);

  const label=
   document.createElement("div");

  label.className="bar-label";

  label.textContent=
   new Intl.DateTimeFormat(
    "fa-IR",
    {weekday:"short"}
   ).format(x.date);

  item.append(
   bar,
   label
  );

  box.appendChild(item);

 });

}


function renderDashboardChart(){

 makeChart(
  "dashboardChart",
  7
 );

}


function renderStatsChart(){

 makeChart(
  "statsChart",
  14
 );

}


/* =====================================================
   STATS
   ===================================================== */

function renderStats(){

 $("statMinutes").textContent=
  formatMinutes(
   totalStudy()
  );

 $("statSessions").textContent=
  data.tasks.length;

 $("statTests").textContent=
  testTotal();

 $("statDays").textContent=
  getActiveDates().size;

 const today=
  totalMinutes(
   tasksForDate(todayKey())
  );

 const monday=
  mondayOfWeek(new Date());

 let week=0;

 for(let i=0;i<7;i++){

  const d=new Date(monday);

  d.setDate(
   d.getDate()+i
  );

  week+=
   totalMinutes(
    tasksForDate(
     dateKey(d)
    )
   );

 }

 const dp=
  Math.min(
   100,
   today/
   data.settings.dailyGoal*100
  );

 const wp=
  Math.min(
   100,
   week/
   data.settings.weeklyGoal*100
  );

 $("dailyGoal").style.width=
  dp+"%";

 $("weeklyGoal").style.width=
  wp+"%";

 $("dailyGoalText").textContent=
  `${today} / ${data.settings.dailyGoal} دقیقه`;

 $("weeklyGoalText").textContent=
  `${week} / ${data.settings.weeklyGoal} دقیقه`;

 renderStatsChart();

}


/* =====================================================
   SUBJECTS
   ===================================================== */

let selectedGroup="همه";


function renderSubjectFilter(){

 $("subjectFilter").innerHTML=
  GROUPS.map(g=>`

   <button
    class="filter-btn ${
     selectedGroup===g?"active":""
    }"
    onclick="selectGroup('${g}')">

    ${g}

   </button>

  `).join("");

}


window.selectGroup=group=>{

 selectedGroup=group;

 renderSubjects();

};


function renderSubjects(){

 renderSubjectFilter();

 const subjects=
  data.subjects.filter(
   s=>
    selectedGroup==="همه"||
    s.group===selectedGroup
  );

 $("subjectList").innerHTML=
  subjects.length
   ?subjects.map(s=>{

    const minutes=
     totalMinutes(
      data.tasks.filter(
       t=>t.subject===s.id
      )
     );

    const tests=
     data.tests.filter(
      t=>t.subject===s.id
     );

    const total=
     tests.reduce(
      (x,t)=>x+t.total,
      0
     );

    const correct=
     tests.reduce(
      (x,t)=>x+t.correct,
      0
     );

    const accuracy=
     total
      ?Math.round(correct/total*100)
      :0;

    return `
     <div class="subject-card">

      <div
       class="subject-color"
       style="background:${s.color}">
      </div>

      <div class="subject-info">

       <strong>
        ${esc(s.name)}
       </strong>

       <span>
        ${esc(s.group)}
        •
        ${formatMinutes(minutes)}
        •
        ${accuracy}٪ تست
       </span>

       <div class="subject-progress">
        <div class="big-progress">
         <div
          style="width:${accuracy}%;background:${s.color}">
         </div>
        </div>
       </div>

      </div>

      <div class="subject-actions">

       <button
        class="small-btn"
        onclick="quickAddSuggestion('${s.id}')">
        ＋
       </button>

       <button
        class="small-btn"
        onclick="deleteSubject('${s.id}')">
        🗑
       </button>

      </div>

     </div>
    `;

   }).join("")
   :`<div class="empty">درسی وجود ندارد.</div>`;

 renderSubjectStats();

}


function renderSubjectStats(){

 const subjects=
  data.subjects.filter(
   s=>
    selectedGroup==="همه"||
    s.group===selectedGroup
  );

 $("subjectStats").innerHTML=
  subjects.map(s=>{

   const minutes=
    totalMinutes(
     data.tasks.filter(
      t=>t.subject===s.id
     )
    );

   const max=
    Math.max(
     1,
     ...subjects.map(x=>
      totalMinutes(
       data.tasks.filter(
        t=>t.subject===x.id
       )
      )
     )
   );

   return `
    <div class="goal-row">

     <div>
      <strong>${esc(s.name)}</strong>
      <span>${formatMinutes(minutes)}</span>
     </div>

     <div class="big-progress">
      <div
       style="
        width:${minutes/max*100}%;
        background:${s.color}">
      </div>
     </div>

    </div>
   `;

  }).join("");

}


$("addSubjectBtn").onclick=()=>{

 $("subjectForm").reset();

 showModal("subjectModal");

};


$("subjectForm").onsubmit=e=>{

 e.preventDefault();

 const name=
  $("subjectName").value.trim();

 if(!name)return;

 data.subjects.push({
  id:crypto.randomUUID(),
  name,
  group:$("newSubjectGroup").value,
  color:$("subjectColor").value
 });

 save();

 hideModal("subjectModal");

 renderSubjects();

};


window.deleteSubject=id=>{

 if(data.subjects.length<=1){

  alert("حداقل یک درس باید وجود داشته باشد.");

  return;

 }

 if(!confirm("این درس حذف شود؟"))
  return;

 data.subjects=
  data.subjects.filter(
   s=>s.id!==id
  );

 save();

 renderSubjects();

};


/* =====================================================
   SETTINGS
   ===================================================== */

$("settingsBtn").onclick=()=>{

 $("userName").value=
  data.settings.name;

 $("dailyGoalInput").value=
  data.settings.dailyGoal;

 $("weeklyGoalInput").value=
  data.settings.weeklyGoal;

 $("examDate").value=
  data.settings.examDate;

 showModal("settingsModal");

};


$("settingsForm").onsubmit=e=>{

 e.preventDefault();

 data.settings.name=
  $("userName").value.trim();

 data.settings.dailyGoal=
  Number($("dailyGoalInput").value)||360;

 data.settings.weeklyGoal=
  Number($("weeklyGoalInput").value)||2520;

 data.settings.examDate=
  $("examDate").value;

 save();

 hideModal("settingsModal");

 renderAll();

};


/* =====================================================
   BACKUP
   ===================================================== */

$("exportBtn").onclick=()=>{

 const blob=
  new Blob(
   [JSON.stringify(data,null,2)],
   {type:"application/json"}
  );

 downloadBlob(
  blob,
  "studytune-backup.json"
 );

};


$("importBtn").onclick=()=>{

 $("importFile").click();

};


$("importFile").onchange=e=>{

 const file=e.target.files[0];

 if(!file)return;

 const reader=new FileReader();

 reader.onload=event=>{

  try{

   const imported=
    JSON.parse(
     event.target.result
    );

   if(
    !imported||
    !Array.isArray(imported.tasks)
   ){

    alert("فایل Backup معتبر نیست.");

    return;

   }

   data=imported;

   save();

   alert("Backup با موفقیت بازیابی شد.");

   renderAll();

  }catch{

   alert("خواندن فایل ناموفق بود.");

  }

 };

 reader.readAsText(file);

};


$("csvBtn").onclick=()=>{

 const rows=[
  [
   "date",
   "subject",
   "topic",
   "duration",
   "done"
  ]
 ];

 data.tasks.forEach(t=>{

  rows.push([
   t.date,
   subjectName(t.subject),
   t.topic||"",
   t.duration,
   t.done?"yes":"no"
  ]);

 });

 const csv=
  rows
   .map(row=>
    row.map(cell=>
     `"${String(cell).replaceAll('"','""')}"`
    ).join(",")
   )
   .join("\n");

 const blob=
  new Blob(
   ["\ufeff"+csv],
   {type:"text/csv;charset=utf-8"}
  );

 downloadBlob(
  blob,
  "studytune-study.csv"
 );

};


function downloadBlob(blob,name){

 const url=
  URL.createObjectURL(blob);

 const a=
  document.createElement("a");

 a.href=url;
 a.download=name;
 a.click();

 URL.revokeObjectURL(url);

}


$("resetBtn").onclick=()=>{

 if(!confirm(
  "تمام اطلاعات پاک شود؟ این کار قابل برگشت نیست."
 ))
  return;

 localStorage.removeItem(KEY);

 location.reload();

};


/* =====================================================
   THEME
   ===================================================== */

$("themeBtn").onclick=()=>{
 showModal("themeModal");
};


document
 .querySelectorAll("[data-theme]")
 .forEach(btn=>{

  btn.onclick=()=>{

   applyTheme(
    btn.dataset.theme
   );

   hideModal("themeModal");

  };

 });


function applyTheme(theme){

 document.body.classList.remove(
  "theme-light",
  "theme-amoled"
 );

 if(theme==="light")
  document.body.classList.add(
   "theme-light"
  );

 if(theme==="amoled")
  document.body.classList.add(
   "theme-amoled"
  );

 if(theme==="blue"){

  document.documentElement
   .style.setProperty(
    "--primary",
    "#2563eb"
   );

  document.documentElement
   .style.setProperty(
    "--primary2",
    "#0891b2"
   );

 }else if(theme==="green"){

  document.documentElement
   .style.setProperty(
    "--primary",
    "#16a34a"
   );

  document.documentElement
   .style.setProperty(
    "--primary2",
    "#0d9488"
   );

 }else{

  document.documentElement
   .style.setProperty(
    "--primary",
    "#7c3aed"
   );

  document.documentElement
   .style.setProperty(
    "--primary2",
    "#4f46e5"
   );

 }

 data.theme=theme;

 save();

}


/* =====================================================
   MODALS
   ===================================================== */

function showModal(id){

 $(id).classList.add("show");

}


function hideModal(id){

 $(id).classList.remove("show");

}


document
 .querySelectorAll("[data-close]")
 .forEach(btn=>{

  btn.onclick=()=>{
   hideModal(
    btn.dataset.close
   );
  };

 });


document
 .querySelectorAll(".modal")
 .forEach(modal=>{

  modal.onclick=e=>{

   if(e.target===modal)
    modal.classList.remove("show");

  };

 });


/* =====================================================
   NOTIFICATION
   ===================================================== */

function requestNotifications(){

 if(
  "Notification" in window &&
  Notification.permission==="default"
 ){

  Notification.requestPermission();

 }

}


function notify(title,body){

 if(
  "Notification" in window &&
  Notification.permission==="granted"
 ){

  new Notification(
   title,
   {body}
  );

 }

}


document.addEventListener(
 "visibilitychange",
 ()=>{
  if(!document.hidden)
   return;
 });


/* =====================================================
   DAILY REMINDER CHECK
   ===================================================== */

function checkReminder(){

 const now=new Date();

 const hour=now.getHours();

 /*
   یک یادآوری ساده در ساعات عصر.
 */

 if(
  hour>=18 &&
  hour<=22
 ){

  const today=
   totalMinutes(
    tasksForDate(todayKey())
   );

  if(
   today<
   data.settings.dailyGoal*.5
  ){

   /*
     فقط در هر بار لود، درخواست notification می‌کنیم.
   */

   if(
    localStorage.getItem(
     "studyTuneReminder_"+todayKey()
    )!=="1"
   ){

    notify(
     "StudyTune ⏰",
     "هنوز بخش زیادی از هدف مطالعه امروز باقی مانده است."
    );

    localStorage.setItem(
     "studyTuneReminder_"+todayKey(),
     "1"
    );

   }

  }

 }

}


/* =====================================================
   SMART REVIEW AUTO-GENERATION
   ===================================================== */

function ensureReviews(){

 /*
   برای فعالیت‌هایی که هنوز مرور ساخته نشده،
   مرورهای ۱/۳/۷/۱۴/۳۰ روزه ساخته می‌شود.
 */

 const existing=
  new Set(
   data.reviews.map(
    r=>r.taskId+"_"+r.interval
   )
  );

 data.tasks.forEach(task=>{

  REVIEW_DAYS.forEach(interval=>{

   const key=
    task.id+"_"+interval;

   if(existing.has(key))
    return;

   const d=
    parseDate(task.date);

   d.setDate(
    d.getDate()+interval
   );

   data.reviews.push({
    id:crypto.randomUUID(),
    taskId:task.id,
    subject:task.subject,
    topic:task.topic,
    date:dateKey(d),
    interval,
    done:false
   });

  });

 });

 save();

}


/* =====================================================
   GLOBAL RENDER
   ===================================================== */

function renderAll(){

 ensureReviews();

 renderDashboard();
 renderToday();
 renderWeek();
 renderTests();
 renderReviews();
 renderMistakes();
 renderStats();
 renderSubjects();
 renderRoutines();
 updateTimer();

}


/* =====================================================
   INITIALIZATION
   ===================================================== */

applyTheme(
 data.theme||"purple"
);

fillSubjectSelect("fSubject");
fillSubjectSelect("testSubject");
fillSubjectSelect("mistakeSubject");

$("fDate").value=
 todayKey();

requestNotifications();

checkReminder();

renderAll();

setInterval(
 checkReminder,
 5*60*1000
);
