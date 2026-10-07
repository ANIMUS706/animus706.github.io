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
].map((x, i) => ({
  id: "subject_" + i,
  name: x[0],
  group: x[1],
  color: x[2]
}));


/* =====================================================
   ACHIEVEMENTS
   ===================================================== */

const ACHIEVEMENTS = [

  {
    id: "first_session",
    icon: "🌱",
    name: "اولین جلسه",
    desc: "اولین جلسه مطالعه را ثبت کن.",
    check: d => d.tasks.length >= 1
  },

  {
    id: "five_sessions",
    icon: "📚",
    name: "۵ جلسه",
    desc: "۵ جلسه مطالعه.",
    check: d => d.tasks.length >= 5
  },

  {
    id: "ten_tests",
    icon: "📝",
    name: "۱۰ تست",
    desc: "حداقل ۱۰ تست ثبت کن.",
    check: d => testTotal(d) >= 10
  },

  {
    id: "hundred_tests",
    icon: "💯",
    name: "۱۰۰ تست",
    desc: "۱۰۰ تست ثبت کن.",
    check: d => testTotal(d) >= 100
  },

  {
    id: "ten_hours",
    icon: "⏱️",
    name: "۱۰ ساعت",
    desc: "۱۰ ساعت مطالعه.",
    check: d => totalStudy(d) >= 600
  },

  {
    id: "fifty_hours",
    icon: "🔥",
    name: "۵۰ ساعت",
    desc: "۵۰ ساعت مطالعه.",
    check: d => totalStudy(d) >= 3000
  },

  {
    id: "seven_streak",
    icon: "🔥",
    name: "۷ روز",
    desc: "هفت روز متوالی فعال باش.",
    check: d => getStreak(d) >= 7
  },

  {
    id: "thirty_streak",
    icon: "👑",
    name: "۳۰ روز",
    desc: "۳۰ روز متوالی فعال باش.",
    check: d => getStreak(d) >= 30
  },

  {
    id: "perfect_day",
    icon: "🎯",
    name: "روز کامل",
    desc: "تمام فعالیت‌های یک روز را انجام بده.",
    check: d => hasPerfectDay(d)
  }

];


/* =====================================================
   DATA
   ===================================================== */

function defaultData() {

  return {
    subjects: SUBJECTS.map(x => ({ ...x })),

    tasks: [],
    tests: [],
    mistakes: [],
    reviews: [],
    routines: [],

    achievements: [],

    settings: {
      name: "",
      dailyGoal: 360,
      weeklyGoal: 2520,
      examDate: ""
    },

    xp: 0,
    theme: "purple"
  };

}


let data = null;


/* =====================================================
   STORAGE
   ===================================================== */

function loadData() {

  try {

    const raw = localStorage.getItem(KEY);

    if (!raw)
      return defaultData();

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object")
      return defaultData();

    return normalizeData(parsed);

  } catch (error) {

    console.warn(
      "StudyTune: failed to load data.",
      error
    );

    return defaultData();

  }

}


function normalizeData(input) {

  const base = defaultData();

  const result = {
    ...base,
    ...input
  };

  result.subjects =
    Array.isArray(input.subjects) && input.subjects.length
      ? input.subjects
      : base.subjects;

  result.tasks =
    Array.isArray(input.tasks)
      ? input.tasks
      : [];

  result.tests =
    Array.isArray(input.tests)
      ? input.tests
      : [];

  result.mistakes =
    Array.isArray(input.mistakes)
      ? input.mistakes
      : [];

  result.reviews =
    Array.isArray(input.reviews)
      ? input.reviews
      : [];

  result.routines =
    Array.isArray(input.routines)
      ? input.routines
      : [];

  result.achievements =
    Array.isArray(input.achievements)
      ? input.achievements
      : [];

  result.settings = {
    ...base.settings,
    ...(input.settings || {})
  };

  result.settings.dailyGoal =
    Number(result.settings.dailyGoal) > 0
      ? Number(result.settings.dailyGoal)
      : 360;

  result.settings.weeklyGoal =
    Number(result.settings.weeklyGoal) > 0
      ? Number(result.settings.weeklyGoal)
      : 2520;

  result.settings.name =
    String(result.settings.name || "");

  result.settings.examDate =
    String(result.settings.examDate || "");

  result.xp =
    Math.max(
      0,
      Number(result.xp) || 0
    );

  result.theme =
    result.theme || "purple";

  return result;

}


data = loadData();


function save() {

  try {

    localStorage.setItem(
      KEY,
      JSON.stringify(data)
    );

  } catch (error) {

    console.error(
      "StudyTune: failed to save data.",
      error
    );

  }

}


/* =====================================================
   HELPERS
   ===================================================== */

const $ = id =>
  document.getElementById(id);


function esc(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function makeId() {

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {

    return crypto.randomUUID();

  }

  return (
    Date.now().toString(36) +
    "_" +
    Math.random()
      .toString(36)
      .slice(2)
  );

}


function pad(n) {

  return String(n).padStart(2, "0");

}


function todayKey() {

  return dateKey(new Date());

}


function dateKey(d) {

  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate())
  ].join("-");

}


function parseDate(key) {

  if (!key)
    return new Date();

  const [y, m, d] =
    String(key)
      .split("-")
      .map(Number);

  if (
    !y ||
    !m ||
    !d
  ) {

    return new Date();

  }

  return new Date(
    y,
    m - 1,
    d
  );

}


function faDate(date) {

  return new Intl.DateTimeFormat(
    "fa-IR",
    {
      weekday: "long",
      day: "numeric",
      month: "long"
    }
  ).format(date);

}


function formatMinutes(minutes) {

  minutes =
    Math.max(
      0,
      Math.round(
        Number(minutes) || 0
      )
    );

  if (minutes < 60)
    return `${minutes} دقیقه`;

  const h =
    Math.floor(minutes / 60);

  const m =
    minutes % 60;

  return m
    ? `${h}س ${m}د`
    : `${h} ساعت`;

}


function subjectById(id) {

  return data.subjects.find(
    s => s.id === id
  );

}


function subjectName(id) {

  return (
    subjectById(id)?.name ||
    "درس نامشخص"
  );

}


function subjectColor(id) {

  return (
    subjectById(id)?.color ||
    "#7c3aed"
  );

}


function totalStudy(d = data) {

  return d.tasks.reduce(
    (sum, t) =>
      sum +
      Math.max(
        0,
        Number(t.duration) || 0
      ),
    0
  );

}


function tasksForDate(key) {

  return data.tasks
    .filter(t => t.date === key)
    .sort((a, b) =>
      String(a.start || "")
        .localeCompare(
          String(b.start || "")
        )
    );

}


function totalMinutes(tasks) {

  return tasks.reduce(
    (s, t) =>
      s +
      Math.max(
        0,
        Number(t.duration) || 0
      ),
    0
  );

}


function testTotal(d = data) {

  return d.tests.reduce(
    (s, t) =>
      s +
      Math.max(
        0,
        Number(t.total) || 0
      ),
    0
  );

}


function testCorrect(d = data) {

  return d.tests.reduce(
    (s, t) =>
      s +
      Math.max(
        0,
        Number(t.correct) || 0
      ),
    0
  );

}


function testWrong(d = data) {

  return d.tests.reduce(
    (s, t) =>
      s +
      Math.max(
        0,
        Number(t.wrong) || 0
      ),
    0
  );

}


function testAccuracy(d = data) {

  const total =
    testTotal(d);

  return total
    ? Math.round(
        testCorrect(d) /
        total *
        100
      )
    : 0;

}


/* =====================================================
   NAVIGATION
   ===================================================== */

document
  .querySelectorAll("#nav button")
  .forEach(btn => {

    btn.onclick = () => {

      document
        .querySelectorAll("#nav button")
        .forEach(x =>
          x.classList.remove("active")
        );

      btn.classList.add("active");

      document
        .querySelectorAll(".page")
        .forEach(x =>
          x.classList.remove("active")
        );

      const page =
        $("page-" + btn.dataset.page);

      if (page)
        page.classList.add("active");

      renderAll();

    };

  });


function openPage(page) {

  const btn =
    document.querySelector(
      `[data-page="${page}"]`
    );

  if (btn)
    btn.click();

}


/* =====================================================
   SELECTED DATE
   ===================================================== */

let selectedDate = new Date();

let calendarDate = new Date();


/* =====================================================
   TODAY
   ===================================================== */

function renderToday() {

  const key =
    dateKey(selectedDate);

  const tasks =
    tasksForDate(key);

  if ($("dayTitle")) {

    $("dayTitle").textContent =
      key === todayKey()
        ? "امروز"
        : faDate(selectedDate);

  }

  if ($("dayDate")) {

    $("dayDate").textContent =
      new Intl.DateTimeFormat(
        "fa-IR",
        {
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      ).format(selectedDate);

  }

  const done =
    tasks.filter(t => t.done).length;

  const percent =
    tasks.length
      ? Math.round(
          done /
          tasks.length *
          100
        )
      : 0;

  if ($("dailyPercent"))
    $("dailyPercent").textContent =
      percent + "٪";

  if ($("dailyProgress"))
    $("dailyProgress").style.width =
      percent + "%";

  if (!$("timeline"))
    return;

  if (!tasks.length) {

    $("timeline").innerHTML = `
      <div class="empty">
        📅<br><br>
        برای این روز برنامه‌ای نداری.
      </div>
    `;

    return;

  }

  $("timeline").innerHTML =
    tasks.map(task => {

      const endTime =
        taskEnd(task);

      return `
        <div class="timeline-item ${task.done ? "done" : ""}">

          <div class="time">
            ${esc(task.start || "--:--")}
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
                ${esc(task.topic || "مطالعه")}
              </div>

              <div class="activity-meta">

                <span class="badge">
                  ⏱ ${Number(task.duration) || 0} دقیقه
                </span>

                <span class="badge">
                  تا ${endTime}
                </span>

              </div>

            </div>

            <div class="activity-actions">

              <button
                class="small-btn"
                onclick="startTaskTimer('${esc(task.id)}')">
                ▶
              </button>

              <button
                class="small-btn"
                onclick="toggleTask('${esc(task.id)}')">
                ${task.done ? "↩" : "✓"}
              </button>

              <button
                class="small-btn"
                onclick="editTask('${esc(task.id)}')">
                ✎
              </button>

              <button
                class="small-btn"
                onclick="deleteTask('${esc(task.id)}')">
                🗑
              </button>

            </div>

          </div>

        </div>
      `;

    }).join("");

}


function taskEnd(task) {

  const start =
    String(task.start || "00:00");

  const [h, m] =
    start
      .split(":")
      .map(Number);

  const safeH =
    Number.isFinite(h) ? h : 0;

  const safeM =
    Number.isFinite(m) ? m : 0;

  const duration =
    Math.max(
      0,
      Number(task.duration) || 0
    );

  const total =
    safeH * 60 +
    safeM +
    duration;

  return `${pad(
    Math.floor(total / 60) % 24
  )}:${pad(total % 60)}`;

}


window.toggleTask = id => {

  const task =
    data.tasks.find(
      t => t.id === id
    );

  if (!task)
    return;

  const before =
    Boolean(task.done);

  task.done =
    !before;

  if (!before)
    addXP(10);

  save();

  renderAll();

};


window.deleteTask = id => {

  if (!confirm("این فعالیت حذف شود؟"))
    return;

  data.tasks =
    data.tasks.filter(
      t => t.id !== id
    );

  data.reviews =
    data.reviews.filter(
      r => r.taskId !== id
    );

  save();

  renderAll();

};


window.editTask = id => {

  const task =
    data.tasks.find(
      t => t.id === id
    );

  if (!task)
    return;

  $("editId").value =
    id;

  $("fDate").value =
    task.date || todayKey();

  fillSubjectSelect("fSubject");

  $("fSubject").value =
    task.subject || data.subjects[0]?.id || "";

  $("fTopic").value =
    task.topic || "";

  $("fStart").value =
    task.start || "08:00";

  $("fDuration").value =
    Number(task.duration) || 60;

  $("fRepeat").value =
    task.repeat || "none";

  $("fNote").value =
    task.note || "";

  $("activityModalTitle").textContent =
    "ویرایش فعالیت";

  showModal("activityModal");

};


if ($("prevDay")) {

  $("prevDay").onclick = () => {

    selectedDate.setDate(
      selectedDate.getDate() - 1
    );

    renderToday();

  };

}


if ($("nextDay")) {

  $("nextDay").onclick = () => {

    selectedDate.setDate(
      selectedDate.getDate() + 1
    );

    renderToday();

  };

}


if ($("todayBtn")) {

  $("todayBtn").onclick = () => {

    selectedDate =
      new Date();

    renderToday();

  };

}


/* =====================================================
   ACTIVITY FORM
   ===================================================== */

function fillSubjectSelect(id) {

  const el = $(id);

  if (!el)
    return;

  el.innerHTML =
    data.subjects.map(s => `
      <option value="${esc(s.id)}">
        ${esc(s.name)} — ${esc(s.group)}
      </option>
    `).join("");

}


function resetActivity() {

  if (!$("activityForm"))
    return;

  $("activityForm").reset();

  $("editId").value = "";

  $("fDate").value =
    dateKey(selectedDate);

  $("fDuration").value =
    60;

  $("fStart").value =
    new Date()
      .toTimeString()
      .slice(0, 5);

  fillSubjectSelect("fSubject");

  $("activityModalTitle").textContent =
    "افزودن فعالیت";

}


if ($("fab")) {

  $("fab").onclick = () => {

    resetActivity();

    showModal("activityModal");

  };

}


if ($("activityForm")) {

  $("activityForm").onsubmit = e => {

    e.preventDefault();

    const id =
      $("editId").value.trim();

    const duration =
      Math.max(
        1,
        Number($("fDuration").value) || 60
      );

    const date =
      $("fDate").value || todayKey();

    const subject =
      $("fSubject").value ||
      data.subjects[0]?.id;

    const task = {

      id:
        id || makeId(),

      date,

      subject,

      topic:
        $("fTopic").value.trim(),

      start:
        $("fStart").value || "08:00",

      duration,

      repeat:
        $("fRepeat").value || "none",

      note:
        $("fNote").value.trim(),

      done:
        id
          ? Boolean(
              data.tasks.find(
                t => t.id === id
              )?.done
            )
          : false

    };

    if (id) {

      const index =
        data.tasks.findIndex(
          t => t.id === id
        );

      if (index >= 0) {

        data.tasks[index] = {
          ...data.tasks[index],
          ...task
        };

      }

    } else {

      data.tasks.push(task);

      generateRepeats(task);

      addXP(5);

    }

    save();

    hideModal("activityModal");

    renderAll();

  };

}


function generateRepeats(task) {

  if (task.repeat === "daily") {

    for (let i = 1; i <= 30; i++) {

      const d =
        parseDate(task.date);

      d.setDate(
        d.getDate() + i
      );

      data.tasks.push({

        ...task,

        id: makeId(),

        date: dateKey(d),

        repeat: "generated",

        done: false

      });

    }

  }


  if (task.repeat === "weekly") {

    for (let i = 1; i <= 12; i++) {

      const d =
        parseDate(task.date);

      d.setDate(
        d.getDate() + i * 7
      );

      data.tasks.push({

        ...task,

        id: makeId(),

        date: dateKey(d),

        repeat: "generated",

        done: false

      });

    }

  }

}


/* =====================================================
   WEEK
   ===================================================== */

/*
  هفته تقویمی StudyTune از شنبه شروع می‌شود.
*/

function saturdayOfWeek(d) {

  const x =
    new Date(d);

  const day =
    x.getDay();

  const diff =
    day === 6
      ? 0
      : -(day + 1);

  x.setDate(
    x.getDate() + diff
  );

  return x;

}


/*
  برای هدف هفتگی همچنان هفته را از دوشنبه
  محاسبه می‌کنیم.
*/

function mondayOfWeek(d) {

  const x =
    new Date(d);

  const day =
    x.getDay();

  x.setDate(
    x.getDate() +
    (day === 0 ? -6 : 1 - day)
  );

  return x;

}


function renderWeek() {

  const saturday =
    saturdayOfWeek(selectedDate);

  const names = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه"
  ];

  if (!$("weekGrid"))
    return;

  $("weekGrid").innerHTML = "";

  for (let i = 0; i < 7; i++) {

    const d =
      new Date(saturday);

    d.setDate(
      saturday.getDate() + i
    );

    const key =
      dateKey(d);

    const tasks =
      tasksForDate(key);

    const div =
      document.createElement("div");

    div.className =
      "week-day" +
      (
        key === dateKey(selectedDate)
          ? " active"
          : ""
      );

    div.innerHTML = `

      <div class="week-day-name">
        ${names[i]}
      </div>

      <div class="week-day-number">
        ${d.getDate()}
      </div>

      ${tasks.slice(0, 3).map(t => `

        <div
          class="week-task"
          style="border-right:2px solid ${subjectColor(t.subject)}">

          ${esc(subjectName(t.subject))}

        </div>

      `).join("")}

      ${
        tasks.length > 3
          ? `
            <small style="color:#64748b">
              +${tasks.length - 3}
            </small>
          `
          : ""
      }

    `;

    div.onclick = () => {

      selectedDate =
        new Date(d);

      openPage("today");

    };

    $("weekGrid")
      .appendChild(div);

  }

  renderMonth();

}


if ($("prevWeek")) {

  $("prevWeek").onclick = () => {

    selectedDate.setDate(
      selectedDate.getDate() - 7
    );

    renderWeek();

  };

}


if ($("nextWeek")) {

  $("nextWeek").onclick = () => {

    selectedDate.setDate(
      selectedDate.getDate() + 7
    );

    renderWeek();

  };

}


/* =====================================================
   MONTH CALENDAR
   ===================================================== */

function renderMonth() {

  if (!$("monthCalendar"))
    return;

  const year =
    calendarDate.getFullYear();

  const month =
    calendarDate.getMonth();

  const first =
    new Date(
      year,
      month,
      1
    );

  let start =
    first.getDay();

  /*
    شنبه = 0
  */

  start =
    start === 0
      ? 1
      : start === 1
        ? 0
        : start - 1;

  const days =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const names = [
    "ش",
    "ی",
    "د",
    "س",
    "چ",
    "پ",
    "ج"
  ];

  let html =
    names.map(n =>
      `<div class="month-head">${n}</div>`
    ).join("");

  for (let i = 0; i < start; i++)
    html += `<div></div>`;

  for (
    let day = 1;
    day <= days;
    day++
  ) {

    const d =
      new Date(
        year,
        month,
        day
      );

    const key =
      dateKey(d);

    const tasks =
      tasksForDate(key);

    const isToday =
      key === todayKey();

    const isSelected =
      key === dateKey(selectedDate);

    html += `

      <div
        class="month-day ${
          isToday ? "today" : ""
        } ${
          isSelected ? "selected" : ""
        }"
        data-date="${key}">

        <div class="month-number">
          ${day}
        </div>

        ${
          tasks
            .slice(0, 5)
            .map(t => `
              <span
                class="activity-dot"
                style="background:${subjectColor(t.subject)}">
              </span>
            `)
            .join("")
        }

      </div>

    `;

  }

  $("monthCalendar").innerHTML =
    html;

  $("monthCalendar")
    .querySelectorAll(".month-day")
    .forEach(day => {

      day.onclick = () => {

        selectedDate =
          parseDate(
            day.dataset.date
          );

        openPage("today");

      };

    });

}


if ($("prevMonth")) {

  $("prevMonth").onclick = () => {

    calendarDate.setMonth(
      calendarDate.getMonth() - 1
    );

    renderMonth();

  };

}


if ($("nextMonth")) {

  $("nextMonth").onclick = () => {

    calendarDate.setMonth(
      calendarDate.getMonth() + 1
    );

    renderMonth();

  };

}


/* =====================================================
   ROUTINES
   ===================================================== */

if ($("addRoutineBtn")) {

  $("addRoutineBtn").onclick = () => {

    showModal("routineModal");

  };

}


if ($("routineForm")) {

  $("routineForm").onsubmit = e => {

    e.preventDefault();

    const days =
      [
        ...$("routineDays")
          .selectedOptions
      ]
        .map(x =>
          Number(x.value)
        );

    if (!days.length) {

      alert(
        "حداقل یک روز انتخاب کن."
      );

      return;

    }

    data.routines.push({

      id: makeId(),

      name:
        $("routineName")
          .value
          .trim(),

      days

    });

    save();

    hideModal("routineModal");

    renderRoutines();

  };

}


function renderRoutines() {

  if (!$("routineList"))
    return;

  if (!data.routines.length) {

    $("routineList").innerHTML =
      `
        <div class="empty">
          هنوز روتینی ثبت نشده.
        </div>
      `;

    return;

  }

  const names = [
    "جمعه",
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه"
  ];

  $("routineList").innerHTML =
    data.routines.map(r => `

      <div class="test-record">

        <div>

          <strong>
            🔄 ${esc(r.name)}
          </strong>

          <small>
            ${
              r.days
                .map(d => names[d] || "")
                .join("، ")
            }
          </small>

        </div>

        <button
          class="danger-btn"
          onclick="deleteRoutine('${esc(r.id)}')">
          🗑
        </button>

      </div>

    `).join("");

}


window.deleteRoutine = id => {

  data.routines =
    data.routines.filter(
      r => r.id !== id
    );

  save();

  renderRoutines();

};


/* =====================================================
   TESTS
   ===================================================== */

if ($("addTestBtn")) {

  $("addTestBtn").onclick = () => {

    fillSubjectSelect("testSubject");

    showModal("testModal");

  };

}


if ($("testForm")) {

  $("testForm").onsubmit = e => {

    e.preventDefault();

    const total =
      Math.max(
        0,
        Number($("testCount").value) || 0
      );

    const correct =
      Math.max(
        0,
        Number($("testCorrectInput").value) || 0
      );

    const wrong =
      Math.max(
        0,
        Number($("testWrongInput").value) || 0
      );

    const blank =
      Math.max(
        0,
        Number($("testBlankInput").value) || 0
      );

    if (total <= 0) {

      alert(
        "تعداد کل تست باید بیشتر از صفر باشد."
      );

      return;

    }

    if (
      correct +
      wrong +
      blank >
      total
    ) {

      alert(
        "مجموع درست، غلط و نزده نمی‌تواند بیشتر از کل تست باشد."
      );

      return;

    }

    const test = {

      id: makeId(),

      date: todayKey(),

      subject:
        $("testSubject").value,

      topic:
        $("testTopic").value.trim(),

      total,

      correct,

      wrong,

      blank,

      time:
        Math.max(
          0,
          Number($("testTime").value) || 0
        )

    };

    data.tests.push(test);

    addXP(
      Math.min(
        50,
        Math.max(
          5,
          Math.floor(total / 5)
        )
      )
    );

    save();

    hideModal("testModal");

    renderTests();

    renderDashboard();

  };

}


function renderTests() {

  if (!$("testTotal"))
    return;

  const total =
    testTotal();

  const correct =
    testCorrect();

  const wrong =
    testWrong();

  $("testTotal").textContent =
    total;

  $("testCorrect").textContent =
    correct;

  $("testWrong").textContent =
    wrong;

  $("testAccuracy").textContent =
    testAccuracy() + "٪";


  const map = {};

  data.tests.forEach(t => {

    if (!map[t.subject]) {

      map[t.subject] = {
        total: 0,
        correct: 0
      };

    }

    map[t.subject].total +=
      Number(t.total) || 0;

    map[t.subject].correct +=
      Number(t.correct) || 0;

  });


  if ($("subjectTestStats")) {

    $("subjectTestStats").innerHTML =
      Object.entries(map).length

        ? Object.entries(map)
            .map(([id, x]) => {

              const percent =
                x.total
                  ? Math.round(
                      x.correct /
                      x.total *
                      100
                    )
                  : 0;

              return `

                <div class="subject-test-row">

                  <div class="subject-test-head">

                    <strong>
                      ${esc(subjectName(id))}
                    </strong>

                    <span>
                      ${percent}٪
                    </span>

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

            }).join("")

        : `
          <div class="empty">
            هنوز تستی ثبت نشده.
          </div>
        `;

  }


  const history =
    [...data.tests]
      .reverse()
      .slice(0, 20);

  if ($("testHistory")) {

    $("testHistory").innerHTML =
      history.length

        ? history.map(t => {

            const percent =
              t.total
                ? Math.round(
                    t.correct /
                    t.total *
                    100
                  )
                : 0;

            return `

              <div class="test-record">

                <div>

                  <strong>
                    ${esc(subjectName(t.subject))}
                  </strong>

                  <small>
                    ${esc(t.topic || "بدون مبحث")}
                    • ${esc(t.date || "")}
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

        : `
          <div class="empty">
            هنوز تستی ثبت نشده.
          </div>
        `;

  }

}


/* =====================================================
   SMART REVIEW
   ===================================================== */

const REVIEW_DAYS = [
  1,
  3,
  7,
  14,
  30
];


function createReview(task) {

  REVIEW_DAYS.forEach(days => {

    const d =
      parseDate(task.date);

    d.setDate(
      d.getDate() + days
    );

    data.reviews.push({

      id: makeId(),

      taskId: task.id,

      subject: task.subject,

      topic: task.topic,

      date: dateKey(d),

      interval: days,

      done: false

    });

  });

}


function renderReviews() {

  if (!$("reviewList"))
    return;

  const today =
    todayKey();

  const reviews =
    data.reviews
      .filter(r => !r.done)
      .sort((a, b) =>
        String(a.date)
          .localeCompare(
            String(b.date)
          )
      );

  $("reviewList").innerHTML =
    reviews.length

      ? reviews.map(r => {

          const status =
            r.date < today
              ? "overdue"
              : r.date === today
                ? "today"
                : "";

          return `

            <div class="review-card ${status}">

              <div class="review-head">

                <strong>
                  🔁 ${esc(subjectName(r.subject))}
                </strong>

                <span>
                  ${esc(r.date)}
                </span>

              </div>

              <div class="review-body">
                ${esc(r.topic || "مرور کلی")}
                • مرور ${Number(r.interval) || 0} روزه
              </div>

              <button
                class="primary-btn"
                style="margin-top:9px"
                onclick="completeReview('${esc(r.id)}')">
                ✓ انجام شد
              </button>

            </div>

          `;

        }).join("")

      : `
        <div class="empty">
          🎉 مرور عقب‌افتاده‌ای نداری.
        </div>
      `;

}


window.completeReview = id => {

  const review =
    data.reviews.find(
      r => r.id === id
    );

  if (!review)
    return;

  review.done = true;

  addXP(15);

  save();

  renderReviews();

  renderDashboard();

};


/* =====================================================
   MISTAKES
   ===================================================== */

if ($("addMistakeBtn")) {

  $("addMistakeBtn").onclick = () => {

    fillSubjectSelect(
      "mistakeSubject"
    );

    showModal("mistakeModal");

  };

}


if ($("mistakeForm")) {

  $("mistakeForm").onsubmit = e => {

    e.preventDefault();

    data.mistakes.push({

      id: makeId(),

      date: todayKey(),

      subject:
        $("mistakeSubject").value,

      topic:
        $("mistakeTopic").value.trim(),

      reason:
        $("mistakeReason").value,

      note:
        $("mistakeNote").value.trim(),

      reviewed: false

    });

    addXP(8);

    save();

    hideModal("mistakeModal");

    renderMistakes();

  };

}


function renderMistakes() {

  if (!$("mistakeList"))
    return;

  $("mistakeList").innerHTML =
    data.mistakes.length

      ? [...data.mistakes]
          .reverse()
          .map(m => `

            <div class="mistake">

              <div class="mistake-head">

                <strong>

                  ${esc(subjectName(m.subject))}

                  ${
                    m.topic
                      ? " — " + esc(m.topic)
                      : ""
                  }

                </strong>

                <span class="mistake-reason">
                  ${esc(m.reason || "نامشخص")}
                </span>

              </div>

              <p>
                ${esc(m.note || "بدون یادداشت")}
              </p>

              <button
                class="secondary-btn"
                onclick="toggleMistake('${esc(m.id)}')">

                ${
                  m.reviewed
                    ? "✓ مرور شده"
                    : "○ علامت‌گذاری به‌عنوان مرور شده"
                }

              </button>

            </div>

          `).join("")

      : `
        <div class="empty">
          هنوز اشتباهی ثبت نکرده‌ای.
        </div>
      `;

}


window.toggleMistake = id => {

  const m =
    data.mistakes.find(
      x => x.id === id
    );

  if (!m)
    return;

  const before =
    Boolean(m.reviewed);

  m.reviewed =
    !before;

  if (!before)
    addXP(5);

  save();

  renderMistakes();

};


/* =====================================================
   TIMER
   ===================================================== */

let timerSeconds = 0;

let timerInterval = null;

let timerMode = "stopwatch";

let pomoMinutes = 25;

let timerRunning = false;

let timerSubjectId = null;

let timerTopic = "جلسه تایمر";


document
  .querySelectorAll("[data-timer-mode]")
  .forEach(btn => {

    btn.onclick = () => {

      document
        .querySelectorAll(
          "[data-timer-mode]"
        )
        .forEach(x =>
          x.classList.remove("active")
        );

      btn.classList.add("active");

      timerMode =
        btn.dataset.timerMode;

      stopTimer(false);

      if (
        timerMode === "pomodoro"
      ) {

        pomoMinutes = 25;

        if ($("pomodoroOptions"))
          $("pomodoroOptions")
            .classList.add("show");

      } else {

        if ($("pomodoroOptions"))
          $("pomodoroOptions")
            .classList.remove("show");

      }

      updateTimer();

    };

  });


document
  .querySelectorAll("[data-pomo]")
  .forEach(btn => {

    btn.onclick = () => {

      pomoMinutes =
        Math.max(
          1,
          Number(btn.dataset.pomo) || 25
        );

      timerSeconds = 0;

      updateTimer();

    };

  });


if ($("timerStart")) {

  $("timerStart").onclick = () => {

    if (timerRunning)
      return;

    timerRunning = true;

    timerInterval =
      setInterval(
        tickTimer,
        1000
      );

    if ($("timerStatus")) {

      $("timerStatus").textContent =
        timerMode === "pomodoro"
          ? "پومودورو در حال اجرا..."
          : "در حال مطالعه...";

    }

  };

}


if ($("timerPause")) {

  $("timerPause").onclick = () => {

    if (!timerRunning)
      return;

    clearInterval(
      timerInterval
    );

    timerInterval = null;

    timerRunning = false;

    if ($("timerStatus"))
      $("timerStatus").textContent =
        "تایمر متوقف شد";

  };

}


if ($("timerStop")) {

  $("timerStop").onclick = () => {

    stopTimer(true);

  };

}


function tickTimer() {

  if (
    timerMode === "pomodoro"
  ) {

    const max =
      pomoMinutes * 60;

    if (
      timerSeconds < max
    ) {

      timerSeconds++;

    } else {

      stopTimer(true);

      alert(
        "🎉 زمان مطالعه تمام شد! وقت استراحت است."
      );

      return;

    }

  } else {

    timerSeconds++;

  }

  updateTimer();

}


function updateTimer() {

  if (!$("timer"))
    return;

  const h =
    Math.floor(
      timerSeconds / 3600
    );

  const m =
    Math.floor(
      (timerSeconds % 3600) / 60
    );

  const s =
    timerSeconds % 60;

  $("timer").textContent =
    `${pad(h)}:${pad(m)}:${pad(s)}`;


  const minutes =
    Math.floor(
      timerSeconds / 60
    );

  const today =
    totalMinutes(
      tasksForDate(todayKey())
    );

  const goal =
    Math.max(
      1,
      Number(
        data.settings.dailyGoal
      ) || 360
    );

  const percent =
    Math.min(
      100,
      (today + minutes) /
      goal *
      100
    );

  if ($("timerGoalBar"))
    $("timerGoalBar").style.width =
      percent + "%";

  if ($("timerGoalText"))
    $("timerGoalText").textContent =
      `${today + minutes} / ${goal} دقیقه`;

}


function stopTimer(saveIt) {

  if (timerInterval)
    clearInterval(
      timerInterval
    );

  timerInterval = null;

  timerRunning = false;

  const minutes =
    Math.floor(
      timerSeconds / 60
    );

  if (
    saveIt &&
    minutes > 0
  ) {

    const subject =
      timerSubjectId ||
      data.subjects[0]?.id;

    if (subject) {

      data.tasks.push({

        id: makeId(),

        date: todayKey(),

        subject,

        topic:
          timerTopic ||
          "جلسه تایمر",

        start:
          new Date()
            .toTimeString()
            .slice(0, 5),

        duration: minutes,

        repeat: "none",

        note:
          "ثبت‌شده با تایمر",

        done: true

      });

      addXP(
        Math.min(
          50,
          Math.max(
            5,
            minutes
          )
        )
      );

    }

    save();

  }

  timerSeconds = 0;

  if ($("timerStatus"))
    $("timerStatus").textContent =
      "آماده شروع مطالعه";

  updateTimer();

  if (saveIt)
    renderAll();

}


window.startTaskTimer = id => {

  const task =
    data.tasks.find(
      t => t.id === id
    );

  if (!task)
    return;

  timerSubjectId =
    task.subject;

  timerTopic =
    task.topic ||
    "مطالعه";

  if ($("timerSubject")) {

    $("timerSubject").textContent =
      `${subjectName(task.subject)} — ${timerTopic}`;

  }

  timerSeconds = 0;

  timerRunning = false;

  if (timerInterval) {

    clearInterval(
      timerInterval
    );

    timerInterval = null;

  }

  openPage("timer");

  updateTimer();

};


/* =====================================================
   STREAK
   ===================================================== */

function getActiveDates(d = data) {

  return new Set(
    d.tasks
      .filter(t =>
        t.done ||
        Number(t.duration) > 0
      )
      .map(t => t.date)
  );

}


function getStreak(d = data) {

  const active =
    getActiveDates(d);

  let date =
    new Date();

  let streak = 0;

  /*
    اگر امروز هنوز فعالیتی ثبت نشده،
    از دیروز محاسبه می‌کنیم.
  */

  if (
    !active.has(
      dateKey(date)
    )
  ) {

    date.setDate(
      date.getDate() - 1
    );

  }

  while (
    active.has(
      dateKey(date)
    )
  ) {

    streak++;

    date.setDate(
      date.getDate() - 1
    );

  }

  return streak;

}


/* =====================================================
   PERFECT DAY
   ===================================================== */

function hasPerfectDay(d = data) {

  const grouped = {};

  d.tasks.forEach(task => {

    if (!task.date)
      return;

    if (!grouped[task.date])
      grouped[task.date] = [];

    grouped[task.date].push(task);

  });

  return Object.values(grouped)
    .some(tasks =>
      tasks.length > 0 &&
      tasks.every(t => Boolean(t.done))
    );

}


/* =====================================================
   XP / LEVEL
   ===================================================== */

function getLevel() {

  return Math.floor(
    Math.sqrt(
      Math.max(
        0,
        data.xp
      ) / 100
    )
  ) + 1;

}


function levelBase(level) {

  return (
    (level - 1) *
    (level - 1) *
    100
  );

}


function addXP(amount) {

  const value =
    Number(amount) || 0;

  if (value <= 0)
    return;

  data.xp += value;

  checkAchievements();

  save();

}


function renderXP() {

  if (!$("levelNumber"))
    return;

  const level =
    getLevel();

  const base =
    levelBase(level);

  const next =
    levelBase(level + 1);

  const progress =
    Math.max(
      0,
      data.xp - base
    );

  const needed =
    Math.max(
      1,
      next - base
    );

  $("levelNumber").textContent =
    level;

  $("levelText").textContent =
    "Level " + level;

  $("xpText").textContent =
    `${data.xp} XP`;

  $("xpNext").textContent =
    `${Math.max(
      0,
      needed - progress
    )} XP تا سطح بعد`;

  $("xpBar").style.width =
    Math.min(
      100,
      progress / needed * 100
    ) + "%";

}


/* =====================================================
   ACHIEVEMENTS
   ===================================================== */

function checkAchievements() {

  ACHIEVEMENTS.forEach(a => {

    if (
      !data.achievements.includes(
        a.id
      ) &&
      a.check(data)
    ) {

      data.achievements.push(
        a.id
      );

      /*
        پاداش Achievement
      */

      data.xp += 50;

    }

  });

}


function renderAchievements() {

  if (!$("achievementCount"))
    return;

  const unlocked =
    new Set(
      data.achievements
    );

  $("achievementCount").textContent =
    `${data.achievements.length}/${ACHIEVEMENTS.length}`;

  if ($("achievementPreview")) {

    $("achievementPreview").innerHTML =
      ACHIEVEMENTS
        .slice(0, 8)
        .map(a => `

          <div class="achievement ${
            unlocked.has(a.id)
              ? ""
              : "locked"
          }">

            <div class="achievement-icon">
              ${a.icon}
            </div>

            <span class="achievement-name">
              ${a.name}
            </span>

          </div>

        `).join("");

  }

  if ($("achievementList")) {

    $("achievementList").innerHTML =
      ACHIEVEMENTS
        .map(a => `

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
                  ? "🏆"
                  : "🔒"
              }
            </strong>

          </div>

        `).join("");

  }

}


if ($("achievementPreview")) {

  $("achievementPreview").onclick =
    () => {

      showModal(
        "achievementModal"
      );

    };

}


/* =====================================================
   DASHBOARD
   ===================================================== */

function renderDashboard() {

  const now =
    new Date();

  if ($("dashboardDate")) {

    $("dashboardDate").textContent =
      new Intl.DateTimeFormat(
        "fa-IR",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      ).format(now);

  }

  if ($("dashboardGreeting")) {

    $("dashboardGreeting").textContent =
      data.settings.name
        ? `سلام ${esc(
            data.settings.name
          )} 👋`
        : "سلام 👋";

  }


  const today =
    totalMinutes(
      tasksForDate(todayKey())
    );

  const todayTests =
    data.tests.filter(
      t =>
        t.date === todayKey()
    );

  const todayTotal =
    todayTests.reduce(
      (s, t) =>
        s +
        (Number(t.total) || 0),
      0
    );

  const todayCorrect =
    todayTests.reduce(
      (s, t) =>
        s +
        (Number(t.correct) || 0),
      0
    );


  if ($("dashMinutes"))
    $("dashMinutes").textContent =
      today;

  if ($("dashTests"))
    $("dashTests").textContent =
      todayTotal;

  if ($("dashAccuracy"))
    $("dashAccuracy").textContent =
      (
        todayTotal
          ? Math.round(
              todayCorrect /
              todayTotal *
              100
            )
          : 0
      ) + "٪";

  if ($("dashStreak"))
    $("dashStreak").textContent =
      getStreak();


  const goal =
    Math.max(
      1,
      Number(
        data.settings.dailyGoal
      ) || 360
    );

  const percent =
    Math.min(
      100,
      today / goal * 100
    );

  if ($("dashGoalBar"))
    $("dashGoalBar").style.width =
      percent + "%";

  if ($("dashGoalPercent"))
    $("dashGoalPercent").textContent =
      Math.round(percent) + "٪";

  if ($("dashGoalText"))
    $("dashGoalText").textContent =
      `${today} / ${goal} دقیقه`;


  renderXP();
  renderAchievements();
  renderSuggestion();
  renderDashboardChart();
  renderCountdown();

}


/* =====================================================
   COUNTDOWN
   ===================================================== */

function renderCountdown() {

  if (!$("examCountdown"))
    return;

  if (!data.settings.examDate) {

    $("examCountdown").textContent =
      "تاریخ تعیین نشده";

    return;

  }

  const exam =
    parseDate(
      data.settings.examDate
    );

  const now =
    new Date();

  exam.setHours(
    23,
    59,
    59,
    999
  );

  const diff =
    exam - now;

  if (diff <= 0) {

    $("examCountdown").textContent =
      "آزمون گذشته";

    return;

  }

  const days =
    Math.ceil(
      diff /
      (1000 * 60 * 60 * 24)
    );

  $("examCountdown").textContent =
    `${days} روز`;

}


/* =====================================================
   SMART SUGGESTION
   ===================================================== */

function renderSuggestion() {

  if (!$("suggestionBox"))
    return;

  const suggestion =
    makeSuggestion();

  if (!suggestion) {

    $("suggestionBox").innerHTML =
      `
        <div class="empty">
          برای پیشنهاد مطالعه هنوز داده کافی نداریم.
        </div>
      `;

    return;

  }

  $("suggestionBox").innerHTML = `

    <div class="suggestion">

      <div class="suggestion-icon">
        ✨
      </div>

      <div class="suggestion-info">

        <strong>
          ${esc(
            subjectName(
              suggestion.subject
            )
          )}
        </strong>

        <span>
          ${esc(suggestion.reason)}
        </span>

      </div>

      <button
        class="primary-btn"
        onclick="quickAddSuggestion('${esc(suggestion.subject)}')">
        + برنامه
      </button>

    </div>

  `;

}


function makeSuggestion() {

  const subjectScores =
    data.subjects.map(s => {

      const tests =
        data.tests.filter(
          t =>
            t.subject === s.id
        );

      const total =
        tests.reduce(
          (x, t) =>
            x +
            (Number(t.total) || 0),
          0
        );

      const correct =
        tests.reduce(
          (x, t) =>
            x +
            (Number(t.correct) || 0),
          0
        );

      const score =
        total
          ? correct / total
          : null;

      const study =
        totalMinutes(
          data.tasks.filter(
            t =>
              t.subject === s.id
          )
        );

      return {
        subject: s.id,
        score,
        study
      };

    });


  const weak =
    subjectScores
      .filter(
        x =>
          x.score !== null
      )
      .sort(
        (a, b) =>
          a.score - b.score
      )[0];

  if (weak) {

    return {

      subject:
        weak.subject,

      reason:
        `درصد تست این درس پایین‌تر است (${Math.round(
          weak.score * 100
        )}٪). بهتر است امروز روی آن تمرکز کنی.`

    };

  }


  const least =
    [...subjectScores]
      .sort(
        (a, b) =>
          a.study - b.study
      )[0];

  if (least) {

    return {

      subject:
        least.subject,

      reason:
        "این درس نسبت به بقیه زمان مطالعه کمتری داشته است."

    };

  }

  return null;

}


window.quickAddSuggestion =
  subject => {

    resetActivity();

    $("fSubject").value =
      subject;

    $("fTopic").value =
      "مطالعه پیشنهادی";

    $("fDuration").value =
      60;

    $("fStart").value =
      new Date()
        .toTimeString()
        .slice(0, 5);

    showModal(
      "activityModal"
    );

  };


if ($("newSuggestion")) {

  $("newSuggestion").onclick =
    () =>
      renderSuggestion();

}


/* =====================================================
   CHARTS
   ===================================================== */

function makeChart(
  containerId,
  days
) {

  const box =
    $(containerId);

  if (!box)
    return;

  box.innerHTML = "";

  const values = [];

  for (
    let i = days - 1;
    i >= 0;
    i--
  ) {

    const d =
      new Date();

    d.setDate(
      d.getDate() - i
    );

    values.push({

      date: d,

      minutes:
        totalMinutes(
          tasksForDate(
            dateKey(d)
          )
        )

    });

  }

  const max =
    Math.max(
      60,
      ...values.map(
        x => x.minutes
      )
    );

  values.forEach(x => {

    const item =
      document.createElement(
        "div"
      );

    item.className =
      "bar-item";

    const bar =
      document.createElement(
        "div"
      );

    bar.className =
      "bar";

    const fill =
      document.createElement(
        "div"
      );

    fill.style.height =
      `${Math.min(
        100,
        x.minutes / max * 100
      )}%`;

    bar.appendChild(fill);

    const label =
      document.createElement(
        "div"
      );

    label.className =
      "bar-label";

    label.textContent =
      new Intl.DateTimeFormat(
        "fa-IR",
        {
          weekday: "short"
        }
      ).format(x.date);

    item.append(
      bar,
      label
    );

    box.appendChild(item);

  });

}


function renderDashboardChart() {

  makeChart(
    "dashboardChart",
    7
  );

}


function renderStatsChart() {

  makeChart(
    "statsChart",
    14
  );

}


/* =====================================================
   STATS
   ===================================================== */

function renderStats() {

  if (!$("statMinutes"))
    return;

  $("statMinutes").textContent =
    formatMinutes(
      totalStudy()
    );

  $("statSessions").textContent =
    data.tasks.length;

  $("statTests").textContent =
    testTotal();

  $("statDays").textContent =
    getActiveDates().size;


  const today =
    totalMinutes(
      tasksForDate(
        todayKey()
      )
    );

  const monday =
    mondayOfWeek(
      new Date()
    );

  let week = 0;

  for (
    let i = 0;
    i < 7;
    i++
  ) {

    const d =
      new Date(monday);

    d.setDate(
      d.getDate() + i
    );

    week +=
      totalMinutes(
        tasksForDate(
          dateKey(d)
        )
      );

  }


  const dailyGoal =
    Math.max(
      1,
      Number(
        data.settings.dailyGoal
      ) || 360
    );

  const weeklyGoal =
    Math.max(
      1,
      Number(
        data.settings.weeklyGoal
      ) || 2520
    );


  const dp =
    Math.min(
      100,
      today /
      dailyGoal *
      100
    );

  const wp =
    Math.min(
      100,
      week /
      weeklyGoal *
      100
    );


  if ($("dailyGoal"))
    $("dailyGoal").style.width =
      dp + "%";

  if ($("weeklyGoal"))
    $("weeklyGoal").style.width =
      wp + "%";

  if ($("dailyGoalText"))
    $("dailyGoalText").textContent =
      `${today} / ${dailyGoal} دقیقه`;

  if ($("weeklyGoalText"))
    $("weeklyGoalText").textContent =
      `${week} / ${weeklyGoal} دقیقه`;


  renderStatsChart();

}


/* =====================================================
   SUBJECTS
   ===================================================== */

let selectedGroup = "همه";


function renderSubjectFilter() {

  if (!$("subjectFilter"))
    return;

  $("subjectFilter").innerHTML =
    GROUPS.map(g => `

      <button
        class="filter-btn ${
          selectedGroup === g
            ? "active"
            : ""
        }"
        onclick="selectGroup('${esc(g)}')">

        ${esc(g)}

      </button>

    `).join("");

}


window.selectGroup = group => {

  selectedGroup =
    group;

  renderSubjects();

};


function renderSubjects() {

  if (!$("subjectList"))
    return;

  renderSubjectFilter();

  const subjects =
    data.subjects.filter(
      s =>
        selectedGroup === "همه" ||
        s.group === selectedGroup
    );

  $("subjectList").innerHTML =
    subjects.length

      ? subjects.map(s => {

          const minutes =
            totalMinutes(
              data.tasks.filter(
                t =>
                  t.subject === s.id
              )
            );

          const tests =
            data.tests.filter(
              t =>
                t.subject === s.id
            );

          const total =
            tests.reduce(
              (x, t) =>
                x +
                (Number(t.total) || 0),
              0
            );

          const correct =
            tests.reduce(
              (x, t) =>
                x +
                (Number(t.correct) || 0),
              0
            );

          const accuracy =
            total
              ? Math.round(
                  correct /
                  total *
                  100
                )
              : 0;

          return `

            <div class="subject-card">

              <div
                class="subject-color"
                style="background:${esc(s.color)}">
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
                      style="
                        width:${accuracy}%;
                        background:${esc(s.color)}
                      ">
                    </div>

                  </div>

                </div>

              </div>

              <div class="subject-actions">

                <button
                  class="small-btn"
                  onclick="quickAddSuggestion('${esc(s.id)}')">
                  ＋
                </button>

                <button
                  class="small-btn"
                  onclick="deleteSubject('${esc(s.id)}')">
                  🗑
                </button>

              </div>

            </div>

          `;

        }).join("")

      : `
        <div class="empty">
          درسی وجود ندارد.
        </div>
      `;

  renderSubjectStats();

}


function renderSubjectStats() {

  if (!$("subjectStats"))
    return;

  const subjects =
    data.subjects.filter(
      s =>
        selectedGroup === "همه" ||
        s.group === selectedGroup
    );

  const minutesMap =
    subjects.map(s =>
      totalMinutes(
        data.tasks.filter(
          t =>
            t.subject === s.id
        )
      )
    );

  const max =
    Math.max(
      1,
      ...minutesMap
    );

  $("subjectStats").innerHTML =
    subjects.map((s, index) => {

      const minutes =
        minutesMap[index];

      return `

        <div class="goal-row">

          <div>

            <strong>
              ${esc(s.name)}
            </strong>

            <span>
              ${formatMinutes(minutes)}
            </span>

          </div>

          <div class="big-progress">

            <div
              style="
                width:${minutes / max * 100}%;
                background:${esc(s.color)}
              ">
            </div>

          </div>

        </div>

      `;

    }).join("");

}


if ($("addSubjectBtn")) {

  $("addSubjectBtn").onclick = () => {

    if ($("subjectForm"))
      $("subjectForm").reset();

    showModal(
      "subjectModal"
    );

  };

}


if ($("subjectForm")) {

  $("subjectForm").onsubmit = e => {

    e.preventDefault();

    const name =
      $("subjectName")
        .value
        .trim();

    if (!name)
      return;

    data.subjects.push({

      id: makeId(),

      name,

      group:
        $("newSubjectGroup").value,

      color:
        $("subjectColor").value

    });

    save();

    hideModal(
      "subjectModal"
    );

    renderSubjects();

  };

}


window.deleteSubject = id => {

  if (
    data.subjects.length <= 1
  ) {

    alert(
      "حداقل یک درس باید وجود داشته باشد."
    );

    return;

  }

  if (
    !confirm(
      "این درس حذف شود؟"
    )
  )
    return;

  data.subjects =
    data.subjects.filter(
      s => s.id !== id
    );

  /*
    فعالیت‌ها و تست‌های قدیمی را حذف نمی‌کنیم.
    در نتیجه اطلاعات آماری قبلی همچنان حفظ می‌شود.
  */

  save();

  renderSubjects();

  renderAll();

};


/* =====================================================
   SETTINGS
   ===================================================== */

if ($("settingsBtn")) {

  $("settingsBtn").onclick = () => {

    $("userName").value =
      data.settings.name;

    $("dailyGoalInput").value =
      data.settings.dailyGoal;

    $("weeklyGoalInput").value =
      data.settings.weeklyGoal;

    $("examDate").value =
      data.settings.examDate;

    showModal(
      "settingsModal"
    );

  };

}


if ($("settingsForm")) {

  $("settingsForm").onsubmit = e => {

    e.preventDefault();

    data.settings.name =
      $("userName")
        .value
        .trim();

    data.settings.dailyGoal =
      Math.max(
        1,
        Number(
          $("dailyGoalInput").value
        ) || 360
      );

    data.settings.weeklyGoal =
      Math.max(
        1,
        Number(
          $("weeklyGoalInput").value
        ) || 2520
      );

    data.settings.examDate =
      $("examDate").value;

    save();

    hideModal(
      "settingsModal"
    );

    renderAll();

  };

}


/* =====================================================
   BACKUP
   ===================================================== */

if ($("exportBtn")) {

  $("exportBtn").onclick = () => {

    const blob =
      new Blob(
        [
          JSON.stringify(
            data,
            null,
            2
          )
        ],
        {
          type:
            "application/json"
        }
      );

    downloadBlob(
      blob,
      "studytune-backup.json"
    );

  };

}


if ($("importBtn")) {

  $("importBtn").onclick = () => {

    if ($("importFile"))
      $("importFile").click();

  };

}


if ($("importFile")) {

  $("importFile").onchange =
    e => {

      const file =
        e.target.files?.[0];

      if (!file)
        return;

      const reader =
        new FileReader();

      reader.onload =
        event => {

          try {

            const imported =
              JSON.parse(
                event.target.result
              );

            if (
              !imported ||
              typeof imported !==
                "object" ||
              !Array.isArray(
                imported.tasks
              )
            ) {

              alert(
                "فایل Backup معتبر نیست."
              );

              return;

            }

            data =
              normalizeData(
                imported
              );

            save();

            alert(
              "Backup با موفقیت بازیابی شد."
            );

            fillSubjectSelect(
              "fSubject"
            );

            fillSubjectSelect(
              "testSubject"
            );

            fillSubjectSelect(
              "mistakeSubject"
            );

            renderAll();

          } catch (error) {

            console.error(
              error
            );

            alert(
              "خواندن فایل ناموفق بود."
            );

          } finally {

            e.target.value = "";

          }

        };

      reader.readAsText(file);

    };

}


if ($("csvBtn")) {

  $("csvBtn").onclick = () => {

    const rows = [

      [
        "date",
        "subject",
        "topic",
        "duration",
        "done"
      ]

    ];

    data.tasks.forEach(t => {

      rows.push([

        t.date,

        subjectName(
          t.subject
        ),

        t.topic || "",

        t.duration,

        t.done
          ? "yes"
          : "no"

      ]);

    });

    const csv =
      rows
        .map(row =>
          row
            .map(cell =>
              `"${String(cell)
                .replaceAll(
                  '"',
                  '""'
                )}"`
            )
            .join(",")
        )
        .join("\n");

    const blob =
      new Blob(
        [
          "\ufeff" +
          csv
        ],
        {
          type:
            "text/csv;charset=utf-8"
        }
      );

    downloadBlob(
      blob,
      "studytune-study.csv"
    );

  };

}


function downloadBlob(
  blob,
  name
) {

  const url =
    URL.createObjectURL(
      blob
    );

  const a =
    document.createElement(
      "a"
    );

  a.href = url;

  a.download = name;

  document.body.appendChild(a);

  a.click();

  a.remove();

  setTimeout(
    () =>
      URL.revokeObjectURL(url),
    100
  );

}


if ($("resetBtn")) {

  $("resetBtn").onclick = () => {

    if (
      !confirm(
        "تمام اطلاعات پاک شود؟ این کار قابل برگشت نیست."
      )
    )
      return;

    localStorage.removeItem(
      KEY
    );

    location.reload();

  };

}


/* =====================================================
   THEME
   ===================================================== */

if ($("themeBtn")) {

  $("themeBtn").onclick = () => {

    showModal(
      "themeModal"
    );

  };

}


document
  .querySelectorAll("[data-theme]")
  .forEach(btn => {

    btn.onclick = () => {

      applyTheme(
        btn.dataset.theme
      );

      hideModal(
        "themeModal"
      );

    };

  });


function applyTheme(theme) {

  document.body.classList.remove(
    "theme-light",
    "theme-amoled"
  );

  if (theme === "light") {

    document.body.classList.add(
      "theme-light"
    );

  }

  if (theme === "amoled") {

    document.body.classList.add(
      "theme-amoled"
    );

  }


  let primary =
    "#7c3aed";

  let primary2 =
    "#4f46e5";


  if (theme === "blue") {

    primary =
      "#2563eb";

    primary2 =
      "#0891b2";

  }


  if (theme === "green") {

    primary =
      "#16a34a";

    primary2 =
      "#0d9488";

  }


  document.documentElement
    .style
    .setProperty(
      "--primary",
      primary
    );

  document.documentElement
    .style
    .setProperty(
      "--primary2",
      primary2
    );


  data.theme =
    theme || "purple";

 
