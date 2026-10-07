/* =========================================================
   StudyTune
   JavaScript کامل
========================================================= */

"use strict";


/* =========================================================
   HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);

function id(id) {
  return document.getElementById(id);
}

function faNumber(value) {
  return String(value)
    .replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

function todayISO() {
  const d = new Date();

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
}

function dateFromISO(value) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isoFromDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

function uid() {
  return Date.now().toString(36) +
    Math.random().toString(36).slice(2);
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDateFa(date) {
  return new Intl.DateTimeFormat(
    "fa-IR",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  ).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat(
    "fa-IR",
    {
      month: "short",
      day: "numeric"
    }
  ).format(date);
}

function showModal(name) {
  const modal = id(name);

  if (modal) {
    modal.classList.add("show");
  }
}

function closeModal(name) {
  const modal = id(name);

  if (modal) {
    modal.classList.remove("show");
  }
}


/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultData = {

  settings: {
    name: "",
    dailyGoal: 360,
    weeklyGoal: 1800,
    examDate: "2027-06-25"
  },

  theme: "purple",

  subjects: [
    {
      id: uid(),
      name: "زیست‌شناسی",
      group: "تجربی",
      color: "#22c55e"
    },
    {
      id: uid(),
      name: "شیمی",
      group: "تجربی",
      color: "#06b6d4"
    },
    {
      id: uid(),
      name: "فیزیک",
      group: "تجربی",
      color: "#8b5cf6"
    },
    {
      id: uid(),
      name: "ریاضی",
      group: "ریاضی",
      color: "#f59e0b"
    }
  ],

  activities: [],

  tests: [],

  mistakes: [],

  routines: [],

  xp: 0
};


let data;


/* =========================================================
   STORAGE
========================================================= */

function loadData() {

  try {

    const saved = localStorage.getItem(
      "studytune-data"
    );

    if (saved) {

      const parsed = JSON.parse(saved);

      data = {
        ...defaultData,
        ...parsed,

        settings: {
          ...defaultData.settings,
          ...(parsed.settings || {})
        },

        subjects:
          Array.isArray(parsed.subjects)
            ? parsed.subjects
            : defaultData.subjects,

        activities:
          Array.isArray(parsed.activities)
            ? parsed.activities
            : [],

        tests:
          Array.isArray(parsed.tests)
            ? parsed.tests
            : [],

        mistakes:
          Array.isArray(parsed.mistakes)
            ? parsed.mistakes
            : [],

        routines:
          Array.isArray(parsed.routines)
            ? parsed.routines
            : []
      };

    } else {

      data = structuredClone(defaultData);

    }

  } catch (error) {

    console.error(error);
    data = structuredClone(defaultData);

  }

}


function saveData() {

  localStorage.setItem(
    "studytune-data",
    JSON.stringify(data)
  );

}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function setupNavigation() {

  $$("#nav button").forEach(button => {

    button.addEventListener("click", () => {

      const page = button.dataset.page;

      $$("#nav button").forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      $$(".page").forEach(section => {
        section.classList.remove("active");
      });

      const target = id(`page-${page}`);

      if (target) {
        target.classList.add("active");
      }

      renderAll();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  });

}


/* =========================================================
   THEME
========================================================= */

function applyTheme() {

  document.body.classList.remove(
    "theme-light",
    "theme-blue",
    "theme-green",
    "theme-amoled"
  );

  if (data.theme === "light") {
    document.body.classList.add("theme-light");
  }

  if (data.theme === "blue") {
    document.body.classList.add("theme-blue");
  }

  if (data.theme === "green") {
    document.body.classList.add("theme-green");
  }

  if (data.theme === "amoled") {
    document.body.classList.add("theme-amoled");
  }

  localStorage.setItem(
    "studytune-theme",
    data.theme
  );
}


function setupTheme() {

  id("themeBtn").addEventListener(
    "click",
    () => showModal("themeModal")
  );

  $$(".theme-grid button").forEach(button => {

    button.addEventListener("click", () => {

      data.theme = button.dataset.theme;

      saveData();
      applyTheme();

      closeModal("themeModal");

    });

  });

}


/* =========================================================
   SETTINGS
========================================================= */

function setupSettings() {

  id("settingsBtn").addEventListener(
    "click",
    () => {

      id("userName").value =
        data.settings.name;

      id("dailyGoalInput").value =
        data.settings.dailyGoal;

      id("weeklyGoalInput").value =
        data.settings.weeklyGoal;

      id("examDate").value =
        data.settings.examDate;

      showModal("settingsModal");

    }
  );


  id("settingsForm").addEventListener(
    "submit",
    event => {

      event.preventDefault();

      data.settings.name =
        id("userName").value.trim();

      data.settings.dailyGoal =
        Math.max(
          1,
          Number(id("dailyGoalInput").value) || 360
        );

      data.settings.weeklyGoal =
        Math.max(
          1,
          Number(id("weeklyGoalInput").value) || 1800
        );

      data.settings.examDate =
        id("examDate").value ||
        defaultData.settings.examDate;

      saveData();

      closeModal("settingsModal");

      renderAll();

    }
  );

}


/* =========================================================
   DASHBOARD
========================================================= */

function getMinutesForDate(date) {

  const iso = typeof date === "string"
    ? date
    : isoFromDate(date);

  return data.activities
    .filter(item => item.date === iso)
    .reduce(
      (sum, item) =>
        sum + Number(item.duration || 0),
      0
    );
}


function getAllStudyMinutes() {

  return data.activities.reduce(
    (sum, item) =>
      sum + Number(item.duration || 0),
    0
  );

}


function getAccuracy() {

  if (!data.tests.length) {
    return 0;
  }

  const total = data.tests.reduce(
    (sum, item) =>
      sum + Number(item.count || 0),
    0
  );

  const correct = data.tests.reduce(
    (sum, item) =>
      sum + Number(item.correct || 0),
    0
  );

  if (!total) {
    return 0;
  }

  return Math.round(
    correct / total * 100
  );

}


function getActiveDays() {

  return new Set(
    data.activities.map(item => item.date)
  ).size;

}


function getStreak() {

  let streak = 0;

  let date = new Date();

  while (true) {

    const iso = isoFromDate(date);

    if (getMinutesForDate(iso) > 0) {

      streak++;

      date.setDate(
        date.getDate() - 1
      );

    } else {

      break;

    }

  }

  return streak;

}


function updateGreeting() {

  const hour = new Date().getHours();

  let greeting = "سلام";

  if (hour >= 5 && hour < 12) {
    greeting = "صبح بخیر";
  } else if (hour >= 12 && hour < 18) {
    greeting = "ظهر بخیر";
  } else if (hour >= 18 && hour < 23) {
    greeting = "عصر بخیر";
  } else {
    greeting = "شب بخیر";
  }

  const name =
    data.settings.name
      ? ` ${data.settings.name}`
      : "";

  id("dashboardGreeting").textContent =
    `${greeting}${name} 👋`;

}


function updateCountdown() {

  const target = new Date(
    data.settings.examDate + "T00:00:00"
  );

  const now = new Date();

  const diff =
    target.getTime() - now.getTime();

  if (diff <= 0) {

    id("examCountdown").textContent =
      "کنکور فرا رسیده!";

    return;

  }

  const days =
    Math.ceil(
      diff / 86400000
    );

  id("examCountdown").textContent =
    `${faNumber(days)} روز`;

}


function renderDashboard() {

  updateGreeting();

  id("dashboardDate").textContent =
    formatDateFa(new Date());

  id("dashMinutes").textContent =
    faNumber(getMinutesForDate(todayISO()));

  id("dashTests").textContent =
    faNumber(
      data.tests.reduce(
        (sum, x) =>
          sum + Number(x.count || 0),
        0
      )
    );

  id("dashAccuracy").textContent =
    `${faNumber(getAccuracy())}٪`;

  id("dashStreak").textContent =
    faNumber(getStreak());

  updateCountdown();


  const todayMinutes =
    getMinutesForDate(todayISO());

  const dailyGoal =
    Number(data.settings.dailyGoal) || 360;

  const goalPercent =
    Math.min(
      100,
      Math.round(
        todayMinutes / dailyGoal * 100
      )
    );

  id("dashGoalText").textContent =
    `${faNumber(todayMinutes)} / ${faNumber(dailyGoal)}`;

  id("dashGoalPercent").textContent =
    `${faNumber(goalPercent)}٪`;

  id("dashGoalBar").style.width =
    `${goalPercent}%`;


  renderXP();

  renderSuggestion();

  renderAchievementsPreview();

  renderChart(
    id("dashboardChart"),
    7
  );

}


/* =========================================================
   XP
========================================================= */

function calculateXP() {

  const studyXP =
    Math.floor(
      getAllStudyMinutes() / 10
    ) * 5;

  const testXP =
    data.tests.length * 10;

  const mistakeXP =
    data.mistakes.length * 5;

  return studyXP + testXP + mistakeXP;

}


function renderXP() {

  const xp = calculateXP();

  const level =
    Math.floor(xp / 100) + 1;

  const current =
    xp % 100;

  id("levelText").textContent =
    `Level ${level}`;

  id("levelNumber").textContent =
    level;

  id("xpText").textContent =
    `${faNumber(xp)} XP`;

  id("xpBar").style.width =
    `${current}%`;

  id("xpNext").textContent =
    `${faNumber(100 - current)} XP تا سطح بعد`;

}


/* =========================================================
   SUGGESTIONS
========================================================= */

const suggestions = [

  [
    "زیست‌شناسی",
    "امروز یک مبحث کوچک را عمیق بخوان و سپس ۲۰ تست از همان مبحث بزن."
  ],

  [
    "مرور سریع",
    "مرور مطالبی که دیروز خوانده‌ای را قبل از شروع مطالعه جدید انجام بده."
  ],

  [
    "تست زمان‌دار",
    "یک مجموعه ۲۰ سوالی را با زمان مشخص حل کن."
  ],

  [
    "فیزیک",
    "قبل از تست‌زنی، فرمول‌های مهم مبحث فعلی را روی کاغذ بنویس."
  ],

  [
    "شیمی",
    "۱۰ تست آموزشی بزن و علت تمام غلط‌ها را یادداشت کن."
  ],

  [
    "استراحت",
    "بعد از هر ۵۰ تا ۶۰ دقیقه مطالعه، چند دقیقه استراحت کن."
  ]

];


function renderSuggestion() {

  const index =
    Math.floor(
      Math.random() *
      suggestions.length
    );

  const item =
    suggestions[index];

  id("suggestionBox").innerHTML = `
    <div class="suggestion">
      <strong>✨ ${escapeHTML(item[0])}</strong>
      <p>${escapeHTML(item[1])}</p>
    </div>
  `;

}


function setupSuggestion() {

  id("newSuggestion").addEventListener(
    "click",
    renderSuggestion
  );

}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

function getAchievements() {

  const totalMinutes =
    getAllStudyMinutes();

  const totalTests =
    data.tests.reduce(
      (sum, x) =>
        sum + Number(x.count || 0),
      0
    );

  const activeDays =
    getActiveDays();

  return [

    {
      icon: "🌱",
      title: "شروع قدرتمند",
      description: "حداقل ۱ دقیقه مطالعه",
      unlocked: totalMinutes >= 1
    },

    {
      icon: "🔥",
      title: "اولین ساعت",
      description: "۶۰ دقیقه مطالعه",
      unlocked: totalMinutes >= 60
    },

    {
      icon: "📚",
      title: "مطالعه جدی",
      description: "۱۰ ساعت مطالعه",
      unlocked: totalMinutes >= 600
    },

    {
      icon: "📝",
      title: "تست‌زن",
      description: "۱۰۰ تست",
      unlocked: totalTests >= 100
    },

    {
      icon: "🏆",
      title: "فعال",
      description: "۷ روز فعال",
      unlocked: activeDays >= 7
    },

    {
      icon: "💎",
      title: "استاد",
      description: "۵۰ ساعت مطالعه",
      unlocked: totalMinutes >= 3000
    }

  ];

}


function renderAchievementsPreview() {

  const achievements =
    getAchievements();

  const unlocked =
    achievements.filter(
      a => a.unlocked
    );

  id("achievementCount").textContent =
    faNumber(unlocked.length);

  id("achievementPreview").innerHTML =
    unlocked.length
      ? unlocked
          .slice(0, 4)
          .map(
            a => `
              <span
                title="${escapeHTML(a.title)}"
                style="font-size:30px;margin-left:8px"
              >
                ${a.icon}
              </span>
            `
          )
          .join("")
      : `<div class="empty">هنوز دستاوردی باز نشده</div>`;

}


function renderAchievementsModal() {

  id("achievementList").innerHTML =
    getAchievements()
      .map(
        a => `
          <div class="
            achievement-item
            ${a.unlocked ? "unlocked" : ""}
          ">

            <div class="achievement-icon">
              ${a.icon}
            </div>

            <div>
              <strong>
                ${escapeHTML(a.title)}
              </strong>

              <small>
                ${escapeHTML(a.description)}
              </small>
            </div>

          </div>
        `
      )
      .join("");

}


/* =========================================================
   CHART
========================================================= */

function renderChart(container, days) {

  if (!container) {
    return;
  }

  const result = [];

  for (
    let i = days - 1;
    i >= 0;
    i--
  ) {

    const date =
      addDays(new Date(), -i);

    result.push({
      date,
      minutes:
        getMinutesForDate(date)
    });

  }

  const max =
    Math.max(
      60,
      ...result.map(x => x.minutes)
    );

  container.innerHTML =
    result
      .map(item => {

        const height =
          Math.max(
            3,
            item.minutes / max * 100
          );

        return `
          <div class="chart-bar">

            <span class="chart-value">
              ${faNumber(item.minutes)}
            </span>

            <div
              class="chart-fill"
              style="height:${height}%"
            ></div>

            <span class="chart-label">
              ${escapeHTML(
                formatShortDate(item.date)
              )}
            </span>

          </div>
        `;

      })
      .join("");

}


/* =========================================================
   ACTIVITY
========================================================= */

let selectedDay =
  todayISO();


function populateSubjectSelects() {

  const selects = [
    id("fSubject"),
    id("testSubject"),
    id("mistakeSubject")
  ];

  selects.forEach(select => {

    if (!select) {
      return;
    }

    const old =
      select.value;

    select.innerHTML =
      data.subjects
        .map(
          subject => `
            <option value="${subject.id}">
              ${escapeHTML(subject.name)}
            </option>
          `
        )
        .join("");

    if (old) {
      select.value = old;
    }

  });

}


function openActivityModal(activity = null) {

  populateSubjectSelects();

  if (activity) {

    id("activityModalTitle").textContent =
      "ویرایش فعالیت";

    id("editId").value =
      activity.id;

    id("fDate").value =
      activity.date;

    id("fSubject").value =
      activity.subjectId;

    id("fTopic").value =
      activity.topic || "";

    id("fStart").value =
      activity.start || "08:00";

    id("fDuration").value =
      activity.duration || 60;

    id("fRepeat").value =
      activity.repeat || "none";

    id("fNote").value =
      activity.note || "";

  } else {

    id("activityModalTitle").textContent =
      "افزودن فعالیت";

    id("editId").value = "";

    id("fDate").value =
      selectedDay;

    id("fStart").value =
      "08:00";

    id("fDuration").value =
      60;

    id("fRepeat").value =
      "none";

    id("fTopic").value =
      "";

    id("fNote").value =
      "";

  }

  showModal("activityModal");

}


function setupActivity() {

  id("activityForm").addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const editId =
        id("editId").value;

      const activity = {

        id:
          editId || uid(),

        date:
          id("fDate").value,

        subjectId:
          id("fSubject").value,

        topic:
          id("fTopic").value.trim(),

        start:
          id("fStart").value,

        duration:
          Number(id("fDuration").value),

        repeat:
          id("fRepeat").value,

        note:
          id("fNote").value.trim()

      };


      if (editId) {

        const index =
          data.activities.findIndex(
            x => x.id === editId
          );

        if (index !== -1) {
          data.activities[index] =
            activity;
        }

      } else {

        data.activities.push(activity);

      }


      saveData();

      closeModal("activityModal");

      renderAll();

    }
  );

}


function deleteActivity(activityId) {

  if (!confirm("این فعالیت حذف شود؟")) {
    return;
  }

  data.activities =
    data.activities.filter(
      x => x.id !== activityId
    );

  saveData();

  renderAll();

}


function renderToday() {

  const date =
    dateFromISO(selectedDay);

  id("dayTitle").textContent =
    selectedDay === todayISO()
      ? "امروز"
      : formatDateFa(date);

  id("dayDate").textContent =
    formatDateFa(date);


  const items =
    data.activities
      .filter(
        item => item.date === selectedDay
      )
      .sort(
        (a, b) =>
          String(a.start)
            .localeCompare(String(b.start))
      );


  const minutes =
    getMinutesForDate(selectedDay);

  const goal =
    Number(data.settings.dailyGoal) || 360;

  const percent =
    Math.min(
      100,
      Math.round(
        minutes / goal * 100
      )
    );

  id("dailyPercent").textContent =
    `${faNumber(percent)}٪`;

  id("dailyProgress").style.width =
    `${percent}%`;


  if (!items.length) {

    id("timeline").innerHTML = `
      <div class="card empty">
        برای این روز برنامه‌ای ثبت نشده است.
      </div>
    `;

    return;

  }


  id("timeline").innerHTML =
    items.map(item => {

      const subject =
        data.subjects.find(
          s => s.id === item.subjectId
        );

      return `
        <div class="activity-card">

          <div class="activity-time">
            ${escapeHTML(item.start)}
          </div>

          <div class="activity-content">

            <strong>
              ${escapeHTML(
                subject?.name || "درس حذف شده"
              )}
            </strong>

            <span>
              ${escapeHTML(
                item.topic || "مطالعه"
              )}
              •
              ${faNumber(item.duration)}
              دقیقه
            </span>

            ${
              item.note
                ? `<span>${escapeHTML(item.note)}</span>`
                : ""
            }

          </div>

          <div class="activity-actions">

            <button
              class="small-btn edit-activity"
              data-id="${item.id}"
              type="button"
            >
              ✏️
            </button>

            <button
              class="danger-btn delete-activity"
              data-id="${item.id}"
              type="button"
            >
              🗑
            </button>

          </div>

        </div>
      `;

    }).join("");


  $$(".edit-activity").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const item =
          data.activities.find(
            x => x.id === button.dataset.id
          );

        if (item) {
          openActivityModal(item);
        }

      }
    );

  });


  $$(".delete-activity").forEach(button => {

    button.addEventListener(
      "click",
      () => deleteActivity(button.dataset.id)
    );

  });

}


/* =========================================================
   DAY CONTROLS
========================================================= */

function setupDayControls() {

  id("prevDay").addEventListener(
    "click",
    () => {

      selectedDay =
        isoFromDate(
          addDays(
            dateFromISO(selectedDay),
            -1
          )
        );

      renderToday();

    }
  );


  id("nextDay").addEventListener(
    "click",
    () => {

      selectedDay =
        isoFromDate(
          addDays(
            dateFromISO(selectedDay),
            1
          )
        );

      renderToday();

    }
  );


  id("todayBtn").addEventListener(
    "click",
    () => {

      selectedDay =
        todayISO();

      renderToday();

    }
  );

}


/* =========================================================
   WEEK
========================================================= */

let weekOffset = 0;


function renderWeek() {

  const base =
    addDays(
      new Date(),
      weekOffset * 7
    );

  const day =
    base.getDay();

  const saturday =
    addDays(
      base,
      day === 6
        ? 0
        : -(day + 1)
    );


  const names = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه"
  ];


  let html = "";

  for (let i = 0; i < 7; i++) {

    const date =
      addDays(saturday, i);

    const iso =
      isoFromDate(date);

    const items =
      data.activities
        .filter(
          x => x.date === iso
        )
        .slice(0, 3);

    html += `
      <div
        class="
          week-day
          ${iso === todayISO() ? "today" : ""}
        "
        data-date="${iso}"
      >

        <div class="week-day-name">
          ${names[i]}
        </div>

        <div class="week-day-number">
          ${new Intl.DateTimeFormat("fa-IR", {
            day: "numeric"
          }).format(date)}
        </div>

        ${
          items.map(
            item => `
              <div class="week-event">
                ${escapeHTML(
                  item.topic ||
                  data.subjects.find(
                    s => s.id === item.subjectId
                  )?.name ||
                  "مطالعه"
                )}
              </div>
            `
          ).join("")
        }

      </div>
    `;

  }


  id("weekGrid").innerHTML = html;


  $$(".week-day").forEach(dayElement => {

    dayElement.addEventListener(
      "click",
      () => {

        selectedDay =
          dayElement.dataset.date;

        document
          .querySelector(
            '[data-page="today"]'
          )
          .click();

      }
    );

  });

}


function setupWeek() {

  id("prevWeek").addEventListener(
    "click",
    () => {

      weekOffset--;

      renderWeek();

    }
  );


  id("nextWeek").addEventListener(
    "click",
    () => {

      weekOffset++;

      renderWeek();

    }
  );

}


/* =========================================================
   MONTH
========================================================= */

let monthOffset = 0;


function renderMonth() {

  const now =
    new Date();

  const first =
    new Date(
      now.getFullYear(),
      now.getMonth() + monthOffset,
      1
    );

  const year =
    first.getFullYear();

  const month =
    first.getMonth();

  const last =
    new Date(
      year,
      month + 1,
      0
    );


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
    names
      .map(
        n => `
          <div class="calendar-head">
            ${n}
          </div>
        `
      )
      .join("");


  let jsDay =
    first.getDay();

  let startIndex =
    jsDay === 6
      ? 0
      : jsDay + 1;


  for (let i = 0; i < startIndex; i++) {

    html += `
      <div class="calendar-day muted"></div>
    `;

  }


  for (
    let d = 1;
    d <= last.getDate();
    d++
  ) {

    const date =
      new Date(year, month, d);

    const iso =
      isoFromDate(date);

    const count =
      data.activities.filter(
        x => x.date === iso
      ).length;


    html += `
      <div
        class="
          calendar-day
          ${iso === todayISO() ? "today" : ""}
        "
        data-date="${iso}"
      >

        <strong>
          ${new Intl.DateTimeFormat("fa-IR", {
            day: "numeric"
          }).format(date)}
        </strong>

        ${
          count
            ? `<small>📚 ${faNumber(count)}</small>`
            : ""
        }

      </div>
    `;

  }


  id("monthCalendar").innerHTML =
    html;


  $$(".calendar-day[data-date]").forEach(
    cell => {

      cell.addEventListener(
        "click",
        () => {

          selectedDay =
            cell.dataset.date;

          document
            .querySelector(
              '[data-page="today"]'
            )
            .click();

        }
      );

    }
  );

}


function setupMonth() {

  id("prevMonth").addEventListener(
    "click",
    () => {

      monthOffset--;

      renderMonth();

    }
  );


  id("nextMonth").addEventListener(
    "click",
    () => {

      monthOffset++;

      renderMonth();

    }
  );

}


/* =========================================================
   ROUTINES
========================================================= */

function setupRoutine() {

  id("addRoutineBtn").addEventListener(
    "click",
    () => showModal("routineModal")
  );


  id("routineForm").addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const days =
        Array.from(
          id("routineDays").selectedOptions
        ).map(
          option => option.value
        );


      data.routines.push({

        id: uid(),

        name:
          id("routineName").value.trim(),

        days

      });


      saveData();

      id("routineForm").reset();

      closeModal("routineModal");

      renderRoutines();

    }
  );

}


function renderRoutines() {

  const names = {
    "0": "جمعه",
    "1": "شنبه",
    "2": "یکشنبه",
    "3": "دوشنبه",
    "4": "سه‌شنبه",
    "5": "چهارشنبه",
    "6": "پنجشنبه"
  };


  if (!data.routines.length) {

    id("routineList").innerHTML =
      `<div class="empty">هنوز روتینی نساخته‌اید.</div>`;

    return;

  }


  id("routineList").innerHTML =
    data.routines
      .map(
        routine => `
          <div class="routine">

            <div>

              <strong>
                ${escapeHTML(routine.name)}
              </strong>

              <small>
                ${
                  routine.days?.length
                    ? routine.days
                        .map(d => names[d])
                        .join("، ")
                    : "هر روز"
                }
              </small>

            </div>

            <button
              class="danger-btn delete-routine"
              data-id="${routine.id}"
              type="button"
            >
              🗑
            </button>

          </div>
        `
      )
      .join("");


  $$(".delete-routine").forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          if (
            !confirm("این روتین حذف شود؟")
          ) {
            return;
          }

          data.routines =
            data.routines.filter(
              x =>
                x.id !== button.dataset.id
            );

          saveData();

          renderRoutines();

        }
      );

    }
  );

}


/* =========================================================
   TESTS
========================================================= */

function setupTests() {

  id("addTestBtn").addEventListener(
    "click",
    () => {

      populateSubjectSelects();

      id("testForm").reset();

      showModal("testModal");

    }
  );


  id("testForm").addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const count =
        Number(id("testCount").value);

      const correct =
        Number(id("testCorrectInput").value);

      const wrong =
        Number(id("testWrongInput").value);

      const blank =
        Number(id("testBlankInput").value);


      if (
        correct + wrong + blank > count
      ) {

        alert(
          "مجموع درست، غلط و نزده نمی‌تواند بیشتر از تعداد کل باشد."
        );

        return;

      }


      data.tests.push({

        id: uid(),

        date: todayISO(),

        subjectId:
          id("testSubject").value,

        topic:
          id("testTopic").value.trim(),

        count,

        correct,

        wrong,

        blank,

        time:
          Number(id("testTime").value) || 0

      });


      saveData();

      closeModal("testModal");

      renderAll();

    }
  );

}


function renderTests() {

  const total =
    data.tests.reduce(
      (sum, x) =>
        sum + Number(x.count || 0),
      0
    );

  const correct =
    data.tests.reduce(
      (sum, x) =>
        sum + Number(x.correct || 0),
      0
    );

  const wrong =
    data.tests.reduce(
      (sum, x) =>
        sum + Number(x.wrong || 0),
      0
    );


  id("testTotal").textContent =
    faNumber(total);

  id("testCorrect").textContent =
    faNumber(correct);

  id("testWrong").textContent =
    faNumber(wrong);

  id("testAccuracy").textContent =
    `${faNumber(
      total
        ? Math.round(correct / total * 100)
        : 0
    )}٪`;


  const subjectStats = {};


  data.tests.forEach(test => {

    if (!subjectStats[test.subjectId]) {

      subjectStats[test.subjectId] = {
        total: 0,
        correct: 0
      };

    }

    subjectStats[test.subjectId].total +=
      Number(test.count || 0);

    subjectStats[test.subjectId].correct +=
      Number(test.correct || 0);

  });


  id("subjectTestStats").innerHTML =
    Object.entries(subjectStats)
      .map(([subjectId, stats]) => {

        const subject =
          data.subjects.find(
            s => s.id === subjectId
          );

        const percent =
          stats.total
            ? Math.round(
                stats.correct /
                stats.total *
                100
              )
            : 0;

        return `
          <div class="test-row">

            <div>
              <strong>
                ${escapeHTML(
                  subject?.name ||
                  "درس حذف شده"
                )}
              </strong>

              <small>
                ${faNumber(stats.total)}
                تست
              </small>
            </div>

            <div class="test-percent">
              ${faNumber(percent)}٪
            </div>

          </div>
        `;

      })
      .join("") ||
    `<div class="empty">هنوز تستی ثبت نشده است.</div>`;


  const history =
    [...data.tests]
      .reverse()
      .slice(0, 20);


  id("testHistory").innerHTML =
    history.length
      ? history.map(test => {

          const subject =
            data.subjects.find(
              s => s.id === test.subjectId
            );

          const percent =
            test.count
              ? Math.round(
                  test.correct /
                  test.count *
                  100
                )
              : 0;

          return `
            <div class="test-row">

              <div>

                <strong>
                  ${escapeHTML(
                    subject?.name ||
                    "درس حذف شده"
                  )}
                </strong>

                <small>
                  ${escapeHTML(
                    test.topic ||
                    "بدون مبحث"
                  )}
                  •
                  ${escapeHTML(test.date)}
                </small>

              </div>

              <div>

                <strong class="test-percent">
                  ${faNumber(percent)}٪
                </strong>

                <button
                  class="danger-btn delete-test"
                  data-id="${test.id}"
                  type="button"
                >
                  🗑
                </button>

              </div>

            </div>
          `;

        }).join("")
      : `<div class="empty">هنوز تستی ثبت نشده است.</div>`;


  $$(".delete-test").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (!confirm("این تست حذف شود؟")) {
          return;
        }

        data.tests =
          data.tests.filter(
            x => x.id !== button.dataset.id
          );

        saveData();

        renderAll();

      }
    );

  });

}


/* =========================================================
   MISTAKES
========================================================= */

function setupMistakes() {

  id("addMistakeBtn").addEventListener(
    "click",
    () => {

      populateSubjectSelects();

      id("mistakeForm").reset();

      showModal("mistakeModal");

    }
  );


  id("mistakeForm").addEventListener(
    "submit",
    event => {

      event.preventDefault();

      data.mistakes.push({

        id: uid(),

        date: todayISO(),

        subjectId:
          id("mistakeSubject").value,

        topic:
          id("mistakeTopic").value.trim(),

        reason:
          id("mistakeReason").value,

        note:
          id("mistakeNote").value.trim()

      });


      saveData();

      closeModal("mistakeModal");

      renderMistakes();

      renderXP();

    }
  );

}


function renderMistakes() {

  if (!data.mistakes.length) {

    id("mistakeList").innerHTML =
      `<div class="empty">دفترچه اشتباهات خالی است.</div>`;

    return;

  }


  id("mistakeList").innerHTML =
    [...data.mistakes]
      .reverse()
      .map(item => {

        const subject =
          data.subjects.find(
            s => s.id === item.subjectId
          );

        return `
          <div class="mistake-row">

            <div class="card-title">

              <strong>
                ${escapeHTML(
                  subject?.name ||
                  "درس حذف شده"
                )}
              </strong>

              <button
                class="danger-btn delete-mistake"
                data-id="${item.id}"
                type="button"
              >
                🗑
              </button>

            </div>

            <div>
              <strong>مبحث:</strong>
              ${escapeHTML(
                item.topic || "نامشخص"
              )}
            </div>

            <div>
              <strong>علت:</strong>
              ${escapeHTML(item.reason)}
            </div>

            ${
              item.note
                ? `
                  <div style="margin-top:8px;color:#94a3b8">
                    ${escapeHTML(item.note)}
                  </div>
                `
                : ""
            }

          </div>
        `;

      })
      .join("");


  $$(".delete-mistake").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (
          !confirm("این اشتباه حذف شود؟")
        ) {
          return;
        }

        data.mistakes =
          data.mistakes.filter(
            x =>
              x.id !== button.dataset.id
          );

        saveData();

        renderAll();

      }
    );

  });

}


/* =========================================================
   SMART REVIEW
========================================================= */

function renderReviews() {

  const intervals = [
    1,
    3,
    7,
    14,
    30
  ];

  const reviews = [];


  data.activities.forEach(activity => {

    intervals.forEach(days => {

      const reviewDate =
        addDays(
          dateFromISO(activity.date),
          days
        );

      const iso =
        isoFromDate(reviewDate);

      if (
        iso <= todayISO()
      ) {

        const subject =
          data.subjects.find(
            s => s.id === activity.subjectId
          );

        reviews.push({
          ...activity,
          reviewDate: iso,
          days,
          subjectName:
            subject?.name ||
            "درس حذف شده"
        });

      }

    });

  });


  const unique =
    reviews.filter(
      (item, index, arr) =>
        arr.findIndex(
          x =>
            x.id === item.id &&
            x.days === item.days
        ) === index
    );


  if (!unique.length) {

    id("reviewList").innerHTML = `
      <div class="card empty">
        هنوز مرور آماده‌ای ندارید.
        <br>
        با ثبت فعالیت، مرورهای هوشمند ساخته می‌شوند.
      </div>
    `;

    return;

  }


  id("reviewList").innerHTML =
    unique
      .sort(
        (a, b) =>
          a.reviewDate.localeCompare(
            b.reviewDate
          )
      )
      .slice(0, 50)
      .map(
        item => `
          <div class="review-row">

            <strong>
              ${escapeHTML(
                item.subjectName
              )}
            </strong>

            <div style="margin-top:7px;color:#94a3b8">

              ${escapeHTML(
                item.topic ||
                "مطالعه"
              )}

              • مرور
              ${faNumber(item.days)}
              روزه

            </div>

            <small>
              تاریخ:
              ${escapeHTML(item.reviewDate)}
            </small>

          </div>
        `
      )
      .join("");

}


/* =========================================================
   SUBJECTS
========================================================= */

let selectedGroup = "همه";


function setupSubjects() {

  id("addSubjectBtn").addEventListener(
    "click",
    () => {

      id("subjectForm").reset();

      id("subjectColor").value =
        "#7c3aed";

      showModal("subjectModal");

    }
  );


  id("subjectForm").addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const name =
        id("subjectName").value.trim();

      if (!name) {
        return;
      }


      data.subjects.push({

        id: uid(),

        name,

        group:
          id("newSubjectGroup").value,

        color:
          id("subjectColor").value

      });


      saveData();

      closeModal("subjectModal");

      populateSubjectSelects();

      renderSubjects();

    }
  );

}


function renderSubjects() {

  const groups = [
    "همه",
    ...new Set(
      data.subjects.map(
        s => s.group
      )
    )
  ];


  id("subjectFilter").innerHTML =
    groups
      .map(
        group => `
          <button
            class="
              filter-btn
              ${selectedGroup === group ? "active" : ""}
            "
            data-group="${escapeHTML(group)}"
            type="button"
          >
            ${escapeHTML(group)}
          </button>
        `
      )
      .join("");


  $$(".filter-btn").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        selectedGroup =
          button.dataset.group;

        renderSubjects();

      }
    );

  });


  const subjects =
    selectedGroup === "همه"
      ? data.subjects
      : data.subjects.filter(
          s => s.group === selectedGroup
        );


  id("subjectList").innerHTML =
    subjects.length
      ? subjects
          .map(
            subject => `
              <div class="subject-row">

                <div
                  class="subject-color"
                  style="background:${subject.color}"
                ></div>

                <div class="subject-info">

                  <strong>
                    ${escapeHTML(
                      subject.name
                    )}
                  </strong>

                  <small>
                    ${escapeHTML(
                      subject.group
                    )}
                  </small>

                </div>

                <button
                  class="danger-btn delete-subject"
                  data-id="${subject.id}"
                  type="button"
                >
                  🗑
                </button>

              </div>
            `
          )
          .join("")
      : `<div class="empty">درسی وجود ندارد.</div>`;


  $$(".delete-subject").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (
          !confirm(
            "با حذف درس، اطلاعات قبلی آن باقی می‌ماند ولی نام درس حذف می‌شود. ادامه؟"
          )
        ) {
          return;
        }

        data.subjects =
          data.subjects.filter(
            s =>
              s.id !== button.dataset.id
          );

        saveData();

        populateSubjectSelects();

        renderAll();

      }
    );

  });


  renderSubjectStats();

}


function renderSubjectStats() {

  id("subjectStats").innerHTML =
    data.subjects
      .map(subject => {

        const tests =
          data.tests.filter(
            t =>
              t.subjectId === subject.id
          );

        const minutes =
          data.activities
            .filter(
              a =>
                a.subjectId === subject.id
            )
            .reduce(
              (sum, a) =>
                sum + Number(a.duration || 0),
              0
            );

        const total =
          tests.reduce(
            (sum, t) =>
              sum + Number(t.count || 0),
            0
          );

        const correct =
          tests.reduce(
            (sum, t) =>
              sum + Number(t.correct || 0),
            0
          );

        const percent =
          total
            ? Math.round(
                correct / total * 100
              )
            : 0;


        return `
          <div class="subject-row">

            <div
              class="subject-color"
              style="background:${subject.color}"
            ></div>

            <div class="subject-info">

              <strong>
                ${escapeHTML(subject.name)}
              </strong>

              <small>
                مطالعه:
                ${faNumber(minutes)}
                دقیقه
                •
                تست:
                ${faNumber(total)}
                •
                درصد:
                ${faNumber(percent)}٪
              </small>

            </div>

          </div>
        `;

      })
      .join("") ||
    `<div class="empty">درسی وجود ندارد.</div>`;

}


/* =========================================================
   TIMER
========================================================= */

let timerMode = "stopwatch";

let timerRunning = false;

let timerSeconds = 0;

let timerInterval = null;

let pomodoroSeconds = 25 * 60;


function formatTimer(seconds) {

  const h =
    Math.floor(seconds / 3600);

  const m =
    Math.floor(
      (seconds % 3600) / 60
    );

  const s =
    seconds % 60;

  return [
    h,
    m,
    s
  ]
    .map(
      x =>
        String(x).padStart(2, "0")
    )
    .join(":");

}


function updateTimerUI() {

  const seconds =
    timerMode === "pomodoro"
      ? pomodoroSeconds
      : timerSeconds;

  id("timer").textContent =
    formatTimer(seconds);


  id("timerStatus").textContent =
    timerRunning
      ? "در حال مطالعه..."
      : (
          seconds > 0
            ? "متوقف شده"
            : "آماده شروع مطالعه"
        );


  id("timerStart").textContent =
    timerRunning
      ? "▶ در حال اجرا"
      : "▶ شروع";


  const minutes =
    Math.floor(
      timerSeconds / 60
    );

  const goal =
    Number(data.settings.dailyGoal) || 360;

  const studied =
    getMinutesForDate(todayISO());

  const percent =
    Math.min(
      100,
      Math.round(
        studied / goal * 100
      )
    );

  id("timerGoalText").textContent =
    `${faNumber(studied)} / ${faNumber(goal)} دقیقه`;

  id("timerGoalBar").style.width =
    `${percent}%`;

}


function startTimer() {

  if (timerRunning) {
    return;
  }

  timerRunning = true;

  timerInterval =
    setInterval(() => {

      if (timerMode === "stopwatch") {

        timerSeconds++;

      } else {

        if (pomodoroSeconds > 0) {

          pomodoroSeconds--;

        } else {

          stopTimer();

          alert(
            "🎉 زمان پومودورو تمام شد!"
          );

          return;

        }

      }

      updateTimerUI();

    }, 1000);


  updateTimerUI();

}


function pauseTimer() {

  timerRunning = false;

  clearInterval(timerInterval);

  timerInterval = null;

  updateTimerUI();

}


function stopTimer() {

  pauseTimer();

  const minutes =
    Math.floor(
      timerSeconds / 60
    );

  if (minutes > 0) {

    data.activities.push({

      id: uid(),

      date: todayISO(),

      subjectId:
        data.subjects[0]?.id || "",

      topic:
        "مطالعه با تایمر",

      start:
        new Date().toTimeString()
          .slice(0, 5),

      duration:
        minutes,

      repeat:
        "none",

      note:
        "ثبت‌شده توسط تایمر"

    });

    saveData();

  }

  timerSeconds = 0;

  pomodoroSeconds = 25 * 60;

  updateTimerUI();

  renderAll();

}


function setupTimer() {

  id("timerStart").addEventListener(
    "click",
    startTimer
  );

  id("timerPause").addEventListener(
    "click",
    pauseTimer
  );

  id("timerReset").addEventListener(
    "click",
    stopTimer
  );


  $$(".timer-mode-tabs button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          if (timerRunning) {
            pauseTimer();
          }

          timerMode =
            button.dataset.timerMode;

          $$(".timer-mode-tabs button")
            .forEach(
              b =>
                b.classList.remove("active")
            );

          button.classList.add("active");

          timerSeconds = 0;

          pomodoroSeconds =
            25 * 60;

          updateTimerUI();

        }
      );

    });


  updateTimerUI();

}


/* =========================================================
   STATS
========================================================= */

function renderStats() {

  id("statMinutes").textContent =
    faNumber(getAllStudyMinutes());

  id("statSessions").textContent =
    faNumber(data.activities.length);

  id("statTests").textContent =
    faNumber(
      data.tests.reduce(
        (sum, x) =>
          sum + Number(x.count || 0),
        0
      )
    );

  id("statDays").textContent =
    faNumber(getActiveDays());


  renderChart(
    id("statsChart"),
    14
  );


  const today =
    getMinutesForDate(todayISO());

  const dailyGoal =
    Number(data.settings.dailyGoal) || 360;

  const dailyPercent =
    Math.min(
      100,
      Math.round(
        today / dailyGoal * 100
      )
    );


  id("dailyGoalText").textContent =
    `${faNumber(today)} / ${faNumber(dailyGoal)} دقیقه`;

  id("dailyGoal").style.width =
    `${dailyPercent}%`;


  let weekly =
    0;

  for (let i = 0; i < 7; i++) {

    weekly +=
      getMinutesForDate(
        addDays(
          new Date(),
          -i
        )
      );

  }


  const weeklyGoal =
    Number(data.settings.weeklyGoal) || 1800;

  const weeklyPercent =
    Math.min(
      100,
      Math.round(
        weekly / weeklyGoal * 100
      )
    );


  id("weeklyGoalText").textContent =
    `${faNumber(weekly)} / ${faNumber(weeklyGoal)} دقیقه`;

  id("weeklyGoal").style.width =
    `${weeklyPercent}%`;

}


/* =========================================================
   EXPORT JSON
========================================================= */

function setupExport() {

  id("exportBtn").addEventListener(
    "click",
    () => {

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
              "application/json;charset=utf-8"
          }
        );


      downloadBlob(
        blob,
        `studytune-backup-${todayISO()}.json`
      );

    }
  );

}


function downloadBlob(blob, filename) {

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download = filename;

  document.body.appendChild(a);

  a.click();

  a.remove();

  setTimeout(
    () => URL.revokeObjectURL(url),
    1000
  );

}


/* =========================================================
   IMPORT JSON
========================================================= */

function setupImport() {

  id("importBtn").addEventListener(
    "click",
    () => id("importFile").click()
  );


  id("importFile").addEventListener(
    "change",
    event => {

      const file =
        event.target.files[0];

      if (!file) {
        return;
      }


      const reader =
        new FileReader();


      reader.onload = () => {

        try {

          const imported =
            JSON.parse(reader.result);


          if (
            !imported ||
            typeof imported !== "object"
          ) {

            throw new Error(
              "invalid"
            );

          }


          data = {

            ...defaultData,

            ...imported,

            settings: {
              ...defaultData.settings,
              ...(imported.settings || {})
            }

          };


          saveData();

          applyTheme();

          renderAll();

          alert(
            "✅ اطلاعات با موفقیت وارد شد."
          );

        } catch (error) {

          console.error(error);

          alert(
            "❌ فایل JSON معتبر نیست."
          );

        }

      };


      reader.readAsText(file);

      event.target.value = "";

    }
  );

}


/* =========================================================
   CSV
========================================================= */

function setupCSV() {

  id("csvBtn").addEventListener(
    "click",
    () => {

      const rows = [
        [
          "تاریخ",
          "درس",
          "مبحث",
          "مدت",
          "ساعت شروع",
          "یادداشت"
        ]
      ];


      data.activities.forEach(item => {

        const subject =
          data.subjects.find(
            s =>
              s.id === item.subjectId
          );


        rows.push([
          item.date,
          subject?.name || "",
          item.topic || "",
          item.duration || 0,
          item.start || "",
          item.note || ""
        ]);

      });


      const csv =
        "\uFEFF" +
        rows
          .map(
            row =>
              row
                .map(
                  value =>
                    `"${String(value)
                      .replaceAll('"', '""')}"`
                )
                .join(",")
          )
          .join("\n");


      const blob =
        new Blob(
          [csv],
          {
            type:
              "text/csv;charset=utf-8"
          }
        );


      downloadBlob(
        blob,
        `studytune-${todayISO()}.csv`
      );

    }
  );

}


/* =========================================================
   RESET
========================================================= */

function setupReset() {

  id("resetBtn").addEventListener(
    "click",
    () => {

      const confirmed =
        confirm(
          "⚠️ تمام اطلاعات StudyTune پاک شود؟ این کار قابل برگشت نیست."
        );

      if (!confirmed) {
        return;
      }


      localStorage.removeItem(
        "studytune-data"
      );


      data =
        structuredClone(defaultData);


      saveData();

      applyTheme();

      closeModal("settingsModal");

      renderAll();

      alert(
        "اطلاعات پاک شد."
      );

    }
  );

}


/* =========================================================
   MODAL CLOSE
========================================================= */

function setupModals() {

  $$("[data-close]").forEach(button => {

    button.addEventListener(
      "click",
      () => {

        closeModal(
          button.dataset.close
        );

      }
    );

  });


  $$(".modal").forEach(modal => {

    modal.addEventListener(
      "click",
      event => {

        if (
          event.target === modal
        ) {

          modal.classList.remove("show");

        }

      }
    );

  });


  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") {
        return;
      }

      $$(".modal.show").forEach(
        modal =>
          modal.classList.remove("show")
      );

    }
  );

}


/* =========================================================
   FAB
========================================================= */

function setupFAB() {

  id("fab").addEventListener(
    "click",
    () => {

      openActivityModal();

    }
  );

}


/* =========================================================
   ACHIEVEMENTS BUTTON
========================================================= */

function setupAchievements() {

  id("showAchievements").addEventListener(
    "click",
    () => {

      renderAchievementsModal();

      showModal(
        "achievementModal"
      );

    }
  );

}


/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {

  populateSubjectSelects();

  renderDashboard();

  renderToday();

  renderWeek();

  renderMonth();

  renderRoutines();

  renderTests();

  renderMistakes();

  renderReviews();

  renderSubjects();

  renderStats();

  renderAchievementsModal();

  updateTimerUI();

}


/* =========================================================
   INITIALIZATION
========================================================= */

function init() {

  loadData();

  applyTheme();

  setupNavigation();

  setupTheme();

  setupSettings();

  setupSuggestion();

  setupAchievements();

  setupModals();

  setupFAB();

  setupActivity();

  setupDayControls();

  setupWeek();

  setupMonth();

  setupRoutine();

  setupTests();

  setupMistakes();

  setupSubjects();

  setupTimer();

  setupExport();

  setupImport();

  setupCSV();

  setupReset();

  renderAll();

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  init
);
