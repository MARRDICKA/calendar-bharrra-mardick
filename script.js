/* =====================================================
   MODERN CALENDAR
===================================================== */


/* =========================
   VARIABLES
========================= */

const calendar = document.getElementById("calendar");

const monthTitle = document.getElementById("monthTitle");

const agendaList = document.getElementById("agendaList");

const agendaDate = document.getElementById("agendaDate");

const eventModal = document.getElementById("eventModal");

const eventForm = document.getElementById("eventForm");

const modalTitle = document.getElementById("modalTitle");

const eventTitle = document.getElementById("eventTitle");

const eventDate = document.getElementById("eventDate");

const eventTime = document.getElementById("eventTime");

const eventCategory = document.getElementById("eventCategory");

const eventDescription =
    document.getElementById("eventDescription");


/* =========================
   BUTTONS
========================= */

const addEventBtn =
    document.getElementById("addEventBtn");

const closeModal =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const prevMonth =
    document.getElementById("prevMonth");

const nextMonth =
    document.getElementById("nextMonth");

const todayBtn =
    document.getElementById("todayBtn");


/* =========================
   DATE
========================= */

const today = new Date();

let currentMonth = today.getMonth();

let currentYear = today.getFullYear();

let selectedDate = formatDate(today);


/* =========================
   EDITING
========================= */

let editingEventId = null;


/* =========================
   STORAGE
========================= */

let events =
    JSON.parse(localStorage.getItem("calendarEvents")) || [];


/* =====================================================
   INITIALIZE
===================================================== */

renderCalendar();

showAgenda(selectedDate);


/* =====================================================
   RENDER CALENDAR
===================================================== */

function renderCalendar() {

    calendar.innerHTML = "";


    const firstDay =
        new Date(currentYear, currentMonth, 1).getDay();


    const daysInMonth =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();


    const daysInPreviousMonth =
        new Date(
            currentYear,
            currentMonth,
            0
        ).getDate();


    const monthName =
        new Date(
            currentYear,
            currentMonth
        ).toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    monthTitle.textContent = monthName;


    /* =========================
       PREVIOUS MONTH DAYS
    ========================= */

    for (
        let i = firstDay - 1;
        i >= 0;
        i--
    ) {

        const dayNumber =
            daysInPreviousMonth - i;


        const previousDate =
            new Date(
                currentYear,
                currentMonth - 1,
                dayNumber
            );


        createDay(
            dayNumber,
            previousDate,
            true
        );

    }


    /* =========================
       CURRENT MONTH
    ========================= */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                currentYear,
                currentMonth,
                day
            );


        createDay(
            day,
            date,
            false
        );

    }


    /* =========================
       NEXT MONTH DAYS
    ========================= */

    const totalCells =
        calendar.children.length;


    const remainingCells =
        42 - totalCells;


    for (
        let day = 1;
        day <= remainingCells;
        day++
    ) {

        const nextDate =
            new Date(
                currentYear,
                currentMonth + 1,
                day
            );


        createDay(
            day,
            nextDate,
            true
        );

    }

}


/* =====================================================
   CREATE DAY
===================================================== */

function createDay(
    dayNumber,
    date,
    otherMonth
) {

    const day = document.createElement("div");

    day.classList.add("day");


    if (otherMonth) {
        day.classList.add("other-month");
    }


    const dateString =
        formatDate(date);


    /* TODAY */

    if (
        dateString ===
        formatDate(today)
    ) {

        day.classList.add("today");

    }


    /* SELECTED */

    if (
        dateString === selectedDate
    ) {

        day.classList.add("selected");

    }


    /* DAY NUMBER */

    const number =
        document.createElement("div");

    number.className = "day-number";

    number.textContent = dayNumber;


    day.appendChild(number);


    /* EVENT LIST */

    const eventList =
        document.createElement("div");

    eventList.className = "event-list";


    const dayEvents =
        events.filter(
            event =>
                event.date === dateString
        );


    /* MAX 3 EVENTS */

    dayEvents
        .slice(0, 3)
        .forEach(event => {

            const eventElement =
                document.createElement("div");


            eventElement.className =
                `event ${event.category}`;


            eventElement.textContent =
                event.title;


            eventList.appendChild(
                eventElement
            );

        });


    /* MORE EVENTS */

    if (dayEvents.length > 3) {

        const more =
            document.createElement("div");


        more.className =
            "event more";


        more.textContent =
            `+${dayEvents.length - 3} more`;


        eventList.appendChild(more);

    }


    day.appendChild(eventList);


    /* CLICK */

    day.addEventListener(
        "click",
        () => {

            selectedDate =
                dateString;


            renderCalendar();

            showAgenda(dateString);

        }
    );


    calendar.appendChild(day);

}


/* =====================================================
   SHOW AGENDA
===================================================== */

function showAgenda(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    agendaDate.textContent =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    const dayEvents =
        events.filter(
            event =>
                event.date === dateString
        );


    agendaList.innerHTML = "";


    if (dayEvents.length === 0) {

        agendaList.innerHTML = `
            <div class="empty">
                No events on this date
            </div>
        `;

        return;

    }


    /* SORT BY TIME */

    dayEvents.sort(
        (a, b) =>
            (a.time || "").localeCompare(
                b.time || ""
            )
    );


    dayEvents.forEach(event => {

        const item =
            document.createElement("div");


        item.className =
            "agenda-item";


        item.innerHTML = `

            <div class="agenda-item-top">

                <div class="indicator ${event.category}">
                </div>

                <div class="agenda-info">

                    <div class="agenda-time">
                        ${event.time || "All day"}
                    </div>

                    <h3>
                        ${escapeHTML(event.title)}
                    </h3>

                    <p>
                        ${escapeHTML(
                            event.description ||
                            "No description"
                        )}
                    </p>

                </div>

            </div>

            <div class="agenda-actions">

                <button
                    class="small-btn edit-btn"
                    onclick="editEvent('${event.id}')"
                >
                    Edit
                </button>

                <button
                    class="small-btn delete-btn"
                    onclick="deleteEvent('${event.id}')"
                >
                    Delete
                </button>

            </div>
        `;


        agendaList.appendChild(item);

    });

}


/* =====================================================
   OPEN ADD EVENT MODAL
===================================================== */

function openAddModal(date = selectedDate) {

    editingEventId = null;


    modalTitle.textContent =
        "Add Event";


    eventForm.reset();


    eventDate.value =
        date || formatDate(today);


    eventModal.classList.add("active");

}


/* =====================================================
   ADD BUTTON
===================================================== */

addEventBtn.addEventListener(
    "click",
    () => {

        openAddModal();

    }
);


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeEventModal() {

    eventModal.classList.remove(
        "active"
    );

}


closeModal.addEventListener(
    "click",
    closeEventModal
);


cancelBtn.addEventListener(
    "click",
    closeEventModal
);


/* =====================================================
   CLICK OUTSIDE MODAL
===================================================== */

eventModal.addEventListener(
    "click",
    event => {

        if (
            event.target === eventModal
        ) {

            closeEventModal();

        }

    }
);


/* =====================================================
   SAVE EVENT
===================================================== */

eventForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const newEvent = {

            id:
                editingEventId ||
                Date.now().toString(),

            title:
                eventTitle.value.trim(),

            date:
                eventDate.value,

            time:
                eventTime.value,

            category:
                eventCategory.value,

            description:
                eventDescription.value.trim()

        };


        /* EDIT */

        if (editingEventId) {

            events =
                events.map(
                    event =>
                        event.id === editingEventId
                            ? newEvent
                            : event
                );

        }


        /* ADD */

        else {

            events.push(newEvent);

        }


        saveEvents();


        /* UPDATE CALENDAR */

        const savedDate =
            new Date(
                newEvent.date + "T00:00:00"
            );


        currentMonth =
            savedDate.getMonth();


        currentYear =
            savedDate.getFullYear();


        selectedDate =
            newEvent.date;


        renderCalendar();

        showAgenda(selectedDate);


        closeEventModal();

    }
);


/* =====================================================
   EDIT EVENT
===================================================== */

function editEvent(id) {

    const event =
        events.find(
            event =>
                event.id === id
        );


    if (!event) return;


    editingEventId =
        event.id;


    modalTitle.textContent =
        "Edit Event";


    eventTitle.value =
        event.title;


    eventDate.value =
        event.date;


    eventTime.value =
        event.time;


    eventCategory.value =
        event.category;


    eventDescription.value =
        event.description;


    eventModal.classList.add(
        "active"
    );

}


/* =====================================================
   DELETE EVENT
===================================================== */

function deleteEvent(id) {

    const event =
        events.find(
            event =>
                event.id === id
        );


    if (!event) return;


    const confirmation =
        confirm(
            `Delete "${event.title}"?`
        );


    if (!confirmation) return;


    events =
        events.filter(
            event =>
                event.id !== id
        );


    saveEvents();


    renderCalendar();

    showAgenda(selectedDate);

}


/* =====================================================
   SAVE LOCAL STORAGE
===================================================== */

function saveEvents() {

    localStorage.setItem(
        "calendarEvents",
        JSON.stringify(events)
    );

}


/* =====================================================
   PREVIOUS MONTH
===================================================== */

prevMonth.addEventListener(
    "click",
    () => {

        currentMonth--;


        if (currentMonth < 0) {

            currentMonth = 11;

            currentYear--;

        }


        renderCalendar();

    }
);


/* =====================================================
   NEXT MONTH
===================================================== */

nextMonth.addEventListener(
    "click",
    () => {

        currentMonth++;


        if (currentMonth > 11) {

            currentMonth = 0;

            currentYear++;

        }


        renderCalendar();

    }
);


/* =====================================================
   TODAY
===================================================== */

todayBtn.addEventListener(
    "click",
    () => {

        currentMonth =
            today.getMonth();

        currentYear =
            today.getFullYear();

        selectedDate =
            formatDate(today);


        renderCalendar();

        showAgenda(selectedDate);

    }
);


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


/* =====================================================
   KEYBOARD ESC
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeEventModal();

        }

    }
);