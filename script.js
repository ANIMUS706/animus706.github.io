// ================================
// برنامه مطالعه کنکور
// ================================

// گرفتن عناصر صفحه
const studyForm = document.getElementById("studyForm");
const dayInput = document.getElementById("day");
const subjectInput = document.getElementById("subject");
const topicInput = document.getElementById("topic");
const hoursInput = document.getElementById("hours");
const timeInput = document.getElementById("time");

const totalSubjects = document.getElementById("totalSubjects");
const completedSubjects = document.getElementById("completedSubjects");
const totalHours = document.getElementById("totalHours");
const progressPercent = document.getElementById("progressPercent");

const clearAllButton = document.getElementById("clearAll");


// لیست برنامه‌ها
let studyTasks = [];


// ================================
// اضافه کردن مطالعه
// ================================

studyForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const day = dayInput.value;
    const subject = subjectInput.value.trim();
    const topic = topicInput.value.trim();
    const hours = Number(hoursInput.value);
    const time = timeInput.value;

    // بررسی اطلاعات
    if (!subject) {
        alert("لطفاً نام درس را وارد کن.");
        return;
    }

    if (!hours || hours <= 0) {
        alert("لطفاً تعداد ساعت مطالعه را به‌درستی وارد کن.");
        return;
    }


    // ساخت یک مطالعه جدید
    const newTask = {
        id: Date.now(),
        day: day,
        subject: subject,
        topic: topic,
        hours: hours,
        time: time,
        completed: false
    };


    // اضافه کردن به لیست
    studyTasks.push(newTask);


    // نمایش مجدد برنامه
    renderSchedule();

    // به‌روزرسانی آمار
    updateStats();

    // پاک کردن فرم
    studyForm.reset();

});


// ================================
// نمایش برنامه
// ================================

function renderSchedule() {

    const dayCards = document.querySelectorAll(".day-card");


    dayCards.forEach(function (dayCard) {

        const day = dayCard.dataset.day;
        const tasksContainer = dayCard.querySelector(".tasks");
        const dayHoursElement = dayCard.querySelector(".day-hours");


        // پاک کردن محتوای قبلی
        tasksContainer.innerHTML = "";


        // پیدا کردن مطالعه‌های مربوط به این روز
        const tasks = studyTasks.filter(function (task) {
            return task.day === day;
        });


        // محاسبه ساعت این روز
        const hours = tasks.reduce(function (total, task) {
            return total + task.hours;
        }, 0);


        dayHoursElement.textContent = `${hours} ساعت`;


        // اگر مطالعه‌ای وجود نداشت
        if (tasks.length === 0) {

            const emptyMessage = document.createElement("div");

            emptyMessage.className = "empty-message";
            emptyMessage.textContent = "هنوز برنامه‌ای برای این روز ثبت نشده.";

            tasksContainer.appendChild(emptyMessage);

            return;
        }


        // ساخت کارت هر مطالعه
        tasks.forEach(function (task) {

            const taskElement = document.createElement("div");

            taskElement.className = "task";

            if (task.completed) {
                taskElement.classList.add("completed");
            }


            // چک‌باکس
            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.className = "task-checkbox";
            checkbox.checked = task.completed;


            checkbox.addEventListener("change", function () {

                task.completed = checkbox.checked;

                renderSchedule();
                updateStats();

            });


            // اطلاعات درس
            const taskInfo = document.createElement("div");

            taskInfo.className = "task-info";


            const subject = document.createElement("div");

            subject.className = "task-subject";
            subject.textContent = task.subject;


            taskInfo.appendChild(subject);


            // اگر مبحث وارد شده باشد
            if (task.topic) {

                const topic = document.createElement("div");

                topic.className = "task-topic";
                topic.textContent = task.topic;

                taskInfo.appendChild(topic);

            }


            // جزئیات
            const details = document.createElement("div");

            details.className = "task-details";


            const taskHours = document.createElement("span");

            taskHours.className = "task-hours";
            taskHours.textContent = `${task.hours} ساعت`;


            details.appendChild(taskHours);


            // اگر ساعت شروع وارد شده باشد
            if (task.time) {

                const taskTime = document.createElement("span");

                taskTime.className = "task-time";
                taskTime.textContent = task.time;

                details.appendChild(taskTime);

            }


            // دکمه حذف
            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "delete-task";
            deleteButton.textContent = "🗑️";
            deleteButton.title = "حذف مطالعه";


            deleteButton.addEventListener("click", function () {

                studyTasks = studyTasks.filter(function (item) {
                    return item.id !== task.id;
                });

                renderSchedule();
                updateStats();

            });


            // اضافه کردن عناصر
            taskElement.appendChild(checkbox);
            taskElement.appendChild(taskInfo);
            taskElement.appendChild(details);
            taskElement.appendChild(deleteButton);

            tasksContainer.appendChild(taskElement);

        });

    });

}


// ================================
// به‌روزرسانی آمار
// ================================

function updateStats() {

    // تعداد کل مطالعه‌ها
    const total = studyTasks.length;


    // تعداد انجام شده‌ها
    const completed = studyTasks.filter(function (task) {
        return task.completed;
    }).length;


    // مجموع ساعت‌ها
    const hours = studyTasks.reduce(function (total, task) {
        return total + task.hours;
    }, 0);


    // درصد پیشرفت
    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }


    // نمایش در صفحه
    totalSubjects.textContent = total;
    completedSubjects.textContent = completed;
    totalHours.textContent = hours;
    progressPercent.textContent = `${percentage}%`;

}


// ================================
// پاک کردن کل برنامه
// ================================

clearAllButton.addEventListener("click", function () {

    if (studyTasks.length === 0) {
        alert("برنامه‌ای برای پاک کردن وجود ندارد.");
        return;
    }


    const confirmed = confirm(
        "آیا مطمئنی می‌خواهی کل برنامه هفته را پاک کنی؟"
    );


    if (!confirmed) {
        return;
    }


    studyTasks = [];

    renderSchedule();
    updateStats();

});


// ================================
// اجرای اولیه
// ================================

renderSchedule();
updateStats();
