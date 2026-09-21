/* =====================================================
   NOVA CALENDAR
===================================================== */


/* =====================================================
   ELEMENT
===================================================== */

const calendar =
    document.getElementById("calendar");

const monthTitle =
    document.getElementById("monthTitle");

const monthButton =
    document.getElementById("monthButton");

const monthPicker =
    document.getElementById("monthPicker");

const pickerYear =
    document.getElementById("pickerYear");

const monthGrid =
    document.getElementById("monthGrid");

const eventOverlay =
    document.getElementById("eventOverlay");

const popupDate =
    document.getElementById("popupDate");

const popupDay =
    document.getElementById("popupDay");

const popupEventList =
    document.getElementById("popupEventList");

const eventView =
    document.getElementById("eventView");

const eventFormView =
    document.getElementById("eventFormView");

const eventForm =
    document.getElementById("eventForm");

const eventName =
    document.getElementById("eventName");

const eventDate =
    document.getElementById("eventDate");

const eventTime =
    document.getElementById("eventTime");

const eventCategory =
    document.getElementById("eventCategory");

const eventDescription =
    document.getElementById("eventDescription");

const formTitle =
    document.getElementById("formTitle");


/* =====================================================
   BUTTONS
===================================================== */

const previousMonth =
    document.getElementById("previousMonth");

const nextMonth =
    document.getElementById("nextMonth");

const todayButton =
    document.getElementById("todayButton");

const previousYear =
    document.getElementById("previousYear");

const nextYear =
    document.getElementById("nextYear");

const headerAdd =
    document.getElementById("headerAdd");

const popupAddButton =
    document.getElementById("popupAddButton");

const closePopup =
    document.getElementById("closePopup");

const formBack =
    document.getElementById("formBack");

const cancelForm =
    document.getElementById("cancelForm");

const backButton =
    document.getElementById("backButton");


/* =====================================================
   DATE
===================================================== */

const today =
    new Date();


let currentMonth =
    today.getMonth();


let currentYear =
    today.getFullYear();


let selectedDate =
    null;


let editingEventId =
    null;


/* =====================================================
   MONTH
===================================================== */

const monthNames = [

    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"

];


/* =====================================================
   CATEGORY
===================================================== */

const categoryNames = {

    blue: "Meeting",

    green: "Personal",

    yellow: "Important",

    red: "Deadline",

    purple: "Other"

};


/* =====================================================
   LOCAL STORAGE
===================================================== */

let events =
    JSON.parse(
        localStorage.getItem(
            "novaCalendarEvents"
        )
    ) || [];


/* =====================================================
   SAMPLE EVENTS
===================================================== */

if (
    events.length === 0
) {

    events = [

        {
            id: "1",
            title: "Design Review",
            date: formatDate(
                new Date(
                    currentYear,
                    currentMonth,
                    2
                )
            ),
            time: "09:00",
            category: "purple",
            description:
                "Review desain terbaru."
        },

        {
            id: "2",
            title: "Team Meeting",
            date: formatDate(
                new Date(
                    currentYear,
                    currentMonth,
                    2
                )
            ),
            time: "11:00",
            category: "blue",
            description:
                "Meeting bersama anggota team."
        },

        {
            id: "3",
            title: "Study Group",
            date: formatDate(
                new Date(
                    currentYear,
                    currentMonth,
                    5
                )
            ),
            time: "13:00",
            category: "green",
            description:
                "Belajar bersama."
        },

        {
            id: "4",
            title: "Deadline Project",
            date: formatDate(
                new Date(
                    currentYear,
                    currentMonth,
                    7
                )
            ),
            time: "18:00",
            category: "red",
            description:
                "Pengumpulan project."
        },

        {
            id: "5",
            title: "Important Task",
            date: formatDate(
                new Date(
                    currentYear,
                    currentMonth,
                    7
                )
            ),
            time: "10:00",
            category: "yellow",
            description:
                "Menyelesaikan tugas penting."
        }

    ];


    saveEvents();

}


/* =====================================================
   INITIAL
===================================================== */

renderCalendar();

renderMonthPicker();


/* =====================================================
   RENDER CALENDAR
===================================================== */

function renderCalendar() {

    calendar.innerHTML = "";


    const firstDay =
        new Date(
            currentYear,
            currentMonth,
            1
        ).getDay();


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


    monthTitle.textContent =
        `${monthNames[currentMonth]} ${currentYear}`;


    pickerYear.textContent =
        currentYear;


    /* PREVIOUS MONTH */

    for (
        let i = firstDay - 1;
        i >= 0;
        i--
    ) {

        const day =
            daysInPreviousMonth - i;


        const date =
            new Date(
                currentYear,
                currentMonth - 1,
                day
            );


        createDay(
            day,
            date,
            true
        );

    }


    /* CURRENT MONTH */

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


    /* NEXT MONTH */

    const total =
        calendar.children.length;


    const remaining =
        42 - total;


    for (
        let day = 1;
        day <= remaining;
        day++
    ) {

        const date =
            new Date(
                currentYear,
                currentMonth + 1,
                day
            );


        createDay(
            day,
            date,
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

    const day =
        document.createElement("div");


    day.className =
        "day";


    const dateString =
        formatDate(date);


    /* OTHER MONTH */

    if (otherMonth) {

        day.classList.add(
            "other-month"
        );

    }


    /* TODAY */

    if (
        dateString ===
        formatDate(today)
    ) {

        day.classList.add(
            "today"
        );

    }


    /* SELECTED */

    if (
        dateString ===
        selectedDate
    ) {

        day.classList.add(
            "selected"
        );

    }


    /* NUMBER */

    const number =
        document.createElement("div");


    number.className =
        "day-number";


    number.textContent =
        dayNumber;


    day.appendChild(
        number
    );


    /* EVENT LIST */

    const eventList =
        document.createElement("div");


    eventList.className =
        "event-list";


    const dayEvents =
        events
            .filter(
                event =>
                    event.date ===
                    dateString
            )
            .sort(
                sortEvents
            );


    /* SHOW FIRST 3 */

    dayEvents
        .slice(0, 3)
        .forEach(
            event => {

                const eventElement =
                    document.createElement(
                        "div"
                    );


                eventElement.className =
                    `event ${event.category}`;


                eventElement.textContent =
                    event.title;


                eventElement.title =
                    event.title;


                eventList.appendChild(
                    eventElement
                );

            }
        );


    /* MORE */

    if (
        dayEvents.length > 3
    ) {

        const more =
            document.createElement(
                "div"
            );


        more.className =
            "event more";


        more.textContent =
            `+${dayEvents.length - 3} more`;


        eventList.appendChild(
            more
        );

    }


    day.appendChild(
        eventList
    );


    /* =================================================
       CLICK DATE
       
       LANGSUNG BUKA POPUP EVENT
    ================================================= */

    day.addEventListener(
        "click",
        () => {

            selectedDate =
                dateString;


            currentMonth =
                date.getMonth();


            currentYear =
                date.getFullYear();


            renderCalendar();


            openEventPopup(
                dateString
            );

        }
    );


    calendar.appendChild(
        day
    );

}


/* =====================================================
   OPEN EVENT POPUP
===================================================== */

function openEventPopup(
    dateString
) {

    selectedDate =
        dateString;


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    /* DATE */

    popupDate.textContent =
        date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    /* DAY */

    popupDay.textContent =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );


    /* RESET VIEW */

    eventView.classList.remove(
        "hidden"
    );


    eventFormView.classList.remove(
        "active"
    );


    /* LOAD EVENTS */

    renderPopupEvents();


    /* OPEN */

    eventOverlay.classList.add(
        "active"
    );

}


/* =====================================================
   RENDER POPUP EVENTS
===================================================== */

function renderPopupEvents() {

    popupEventList.innerHTML =
        "";


    const dayEvents =
        events
            .filter(
                event =>
                    event.date ===
                    selectedDate
            )
            .sort(
                sortEvents
            );


    /* NO EVENTS */

    if (
        dayEvents.length === 0
    ) {

        popupEventList.innerHTML = `

            <div class="empty-events">

                <div class="empty-icon">
                    ✦
                </div>

                <h3>
                    No events yet
                </h3>

                <p>
                    There are no events
                    scheduled for this date.
                </p>

            </div>

        `;


        return;

    }


    /* EVENTS */

    dayEvents.forEach(
        (event, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                `popup-event ${event.category}`;


            card.style.animationDelay =
                `${index * .06}s`;


            card.innerHTML = `

                <div class="event-icon">
                    ●
                </div>


                <div class="popup-event-content">

                    <div class="event-top">

                        <h3>
                            ${escapeHTML(
                                event.title
                            )}
                        </h3>

                        <span
                            class="category ${event.category}"
                        >
                            ${
                                categoryNames[
                                    event.category
                                ]
                            }
                        </span>

                    </div>


                    <div class="event-time">

                        ${
                            event.time
                                ? "◷ " + event.time
                                : "All day"
                        }

                    </div>


                    <div class="event-description">

                        ${
                            escapeHTML(
                                event.description ||
                                "No description"
                            )
                        }

                    </div>


                    <div class="event-actions">

                        <button
                            class="edit-button"
                            data-id="${event.id}"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-button"
                            data-id="${event.id}"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            `;


            /* EDIT */

            card
                .querySelector(
                    ".edit-button"
                )
                .addEventListener(
                    "click",
                    () => {

                        editEvent(
                            event.id
                        );

                    }
                );


            /* DELETE */

            card
                .querySelector(
                    ".delete-button"
                )
                .addEventListener(
                    "click",
                    () => {

                        deleteEvent(
                            event.id
                        );

                    }
                );


            popupEventList.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   ADD EVENT BUTTON
===================================================== */

popupAddButton.addEventListener(
    "click",
    () => {

        openAddForm();

    }
);


/* =====================================================
   HEADER ADD
===================================================== */

headerAdd.addEventListener(
    "click",
    () => {

        if (
            !selectedDate
        ) {

            selectedDate =
                formatDate(today);

        }


        openEventPopup(
            selectedDate
        );


        setTimeout(
            () => {

                openAddForm();

            },
            150
        );

    }
);


/* =====================================================
   OPEN ADD FORM
===================================================== */

function openAddForm() {

    editingEventId =
        null;


    formTitle.textContent =
        "Add Event";


    eventForm.reset();


    eventDate.value =
        selectedDate ||
        formatDate(today);


    eventView.classList.add(
        "hidden"
    );


    eventFormView.classList.add(
        "active"
    );


    setTimeout(
        () => {

            eventName.focus();

        },
        150
    );

}


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
                eventName.value.trim(),

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

        if (
            editingEventId
        ) {

            events =
                events.map(
                    item =>
                        item.id ===
                        editingEventId
                            ? newEvent
                            : item
                );

        }

        /* ADD */

        else {

            events.push(
                newEvent
            );

        }


        saveEvents();


        /* UPDATE CALENDAR */

        const newDate =
            new Date(
                newEvent.date +
                "T00:00:00"
            );


        currentMonth =
            newDate.getMonth();


        currentYear =
            newDate.getFullYear();


        selectedDate =
            newEvent.date;


        renderCalendar();


        /* BACK TO EVENT LIST */

        openEventPopup(
            selectedDate
        );

    }
);


/* =====================================================
   EDIT EVENT
===================================================== */

function editEvent(id) {

    const event =
        events.find(
            item =>
                item.id === id
        );


    if (!event) return;


    editingEventId =
        event.id;


    formTitle.textContent =
        "Edit Event";


    eventName.value =
        event.title;


    eventDate.value =
        event.date;


    eventTime.value =
        event.time;


    eventCategory.value =
        event.category;


    eventDescription.value =
        event.description;


    eventView.classList.add(
        "hidden"
    );


    eventFormView.classList.add(
        "active"
    );

}


/* =====================================================
   DELETE EVENT
===================================================== */

function deleteEvent(id) {

    const event =
        events.find(
            item =>
                item.id === id
        );


    if (!event) return;


    const confirmDelete =
        confirm(
            `Delete "${event.title}"?`
        );


    if (!confirmDelete) {

        return;

    }


    events =
        events.filter(
            item =>
                item.id !== id
        );


    saveEvents();


    renderCalendar();


    renderPopupEvents();

}


/* =====================================================
   FORM BACK
===================================================== */

formBack.addEventListener(
    "click",
    () => {

        eventFormView.classList.remove(
            "active"
        );


        eventView.classList.remove(
            "hidden"
        );


        renderPopupEvents();

    }
);


/* =====================================================
   CANCEL
===================================================== */

cancelForm.addEventListener(
    "click",
    () => {

        eventFormView.classList.remove(
            "active"
        );


        eventView.classList.remove(
            "hidden"
        );

    }
);


/* =====================================================
   CLOSE POPUP
===================================================== */

closePopup.addEventListener(
    "click",
    closeEventPopup
);


function closeEventPopup() {

    eventOverlay.classList.remove(
        "active"
    );


    editingEventId =
        null;

}


/* =====================================================
   CLICK OUTSIDE POPUP
===================================================== */

eventOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            eventOverlay
        ) {

            closeEventPopup();

        }

    }
);


/* =====================================================
   PREVIOUS MONTH
===================================================== */

previousMonth.addEventListener(
    "click",
    () => {

        currentMonth--;


        if (
            currentMonth < 0
        ) {

            currentMonth = 11;

            currentYear--;

        }


        renderCalendar();

        renderMonthPicker();

    }
);


/* =====================================================
   NEXT MONTH
===================================================== */

nextMonth.addEventListener(
    "click",
    () => {

        currentMonth++;


        if (
            currentMonth > 11
        ) {

            currentMonth = 0;

            currentYear++;

        }


        renderCalendar();

        renderMonthPicker();

    }
);


/* =====================================================
   TODAY
===================================================== */

todayButton.addEventListener(
    "click",
    () => {

        currentMonth =
            today.getMonth();


        currentYear =
            today.getFullYear();


        selectedDate =
            formatDate(today);


        renderCalendar();

        renderMonthPicker();

        //kalo diklik tombol today, langsung buka popup event untuk tanggal hari ini
        // openEventPopup(
        //     selectedDate
        // );

    }
);


/* =====================================================
   BACK BUTTON
===================================================== */

backButton.addEventListener(
    "click",
    () => {

        currentMonth--;


        if (
            currentMonth < 0
        ) {

            currentMonth = 11;

            currentYear--;

        }


        renderCalendar();

        renderMonthPicker();

    }
);


/* =====================================================
   MONTH SELECTOR
===================================================== */

monthButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        monthPicker.classList.toggle(
            "active"
        );


        monthButton.classList.toggle(
            "active"
        );


        renderMonthPicker();

    }
);


/* =====================================================
   MONTH PICKER
===================================================== */

function renderMonthPicker() {

    pickerYear.textContent =
        currentYear;


    monthGrid.innerHTML =
        "";


    monthNames.forEach(
        (month, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "month-item";


            button.textContent =
                month;


            if (
                index ===
                currentMonth
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.addEventListener(
                "click",
                () => {

                    currentMonth =
                        index;


                    renderCalendar();


                    monthPicker.classList.remove(
                        "active"
                    );


                    monthButton.classList.remove(
                        "active"
                    );

                }
            );


            monthGrid.appendChild(
                button
            );

        }
    );

}


/* =====================================================
   PREVIOUS YEAR
===================================================== */

previousYear.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        currentYear--;


        renderCalendar();

        renderMonthPicker();

    }
);


/* =====================================================
   NEXT YEAR
===================================================== */

nextYear.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        currentYear++;


        renderCalendar();

        renderMonthPicker();

    }
);


/* =====================================================
   CLOSE MONTH PICKER
===================================================== */

document.addEventListener(
    "click",
    event => {

        if (
            !monthPicker.contains(
                event.target
            ) &&
            !monthButton.contains(
                event.target
            )
        ) {

            monthPicker.classList.remove(
                "active"
            );


            monthButton.classList.remove(
                "active"
            );

        }

    }
);


/* =====================================================
   LOCAL STORAGE
===================================================== */

function saveEvents() {

    localStorage.setItem(
        "novaCalendarEvents",
        JSON.stringify(events)
    );

}


/* =====================================================
   SORT
===================================================== */

function sortEvents(a, b) {

    return (
        (a.time || "")
            .localeCompare(
                b.time || ""
            )
    );

}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeEventPopup();


            monthPicker.classList.remove(
                "active"
            );


            monthButton.classList.remove(
                "active"
            );

        }

    }
);

// kerni