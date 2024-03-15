
// eventAPI contains all the functions that interact with the json server
const eventsAPIs = (function () {
    // API endpoint
    const API_URL = "http://localhost:3000/events";

    // Get all the events
    async function getEvents() {
        return fetch(API_URL).then((res) => res.json());
    }

    // newEvent: {eventName: "string", startDate: "string", endDate: "string"}
    async function addEvent(newEvent) {
        return fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newEvent),
            }).then((res) => res.json());
    }

    // Delete an event by id
    async function deleteEvent(id) {
        return fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            }).then((res) => res.json());
    }

    // return the functions that can be used outside of this module
    return {
        getEvents,
        addEvent,
        deleteEvent,
    };
})();

class EventsView {
    constructor() {
        this.eventBody = document.querySelector("#event-body");
        this.addEventRowBtn = document.querySelector("#add-event-row-btn");
        this.addNewEventRow(); // add the new event row to the table
    }

    // Add a new event row to the table
    addNewEventRow() {
        this.addEventRowBtn.addEventListener('click', () => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="text" class="event-name" placeholder="Event Name" /></td>
                <td><input type="date" class="event-start" /></td>
                <td><input type="date" class="event-end" /></td>
                <td>
                    <div class="action-buttons">
                        <button class="confirm-button">Confirm</button>
                        <button class="cancel-button">Cancel</button>
                    </div>
                </td>
            `;
            this.eventBody.appendChild(newRow);
            this.controller.setUpRowButtons(newRow);
        });
    }

    // Remove the event row from the table
    removeEventRow(eventRow) {
        this.eventBody.removeChild(eventRow);
    }


    // Display the events
    renderEvents(events) {
        // clear the eventBody before rendering the new events
        this.eventBody.innerHTML = "";
        events.forEach((event) => {
            this.renderNewEvent(event);
        });
    }

    renderNewEvent(newEvent) {
        this.eventBody.appendChild(this.createEventElement(newEvent));
    }

    createEventElement(newEvent) {
        const newRow = document.createElement('tr');
        newRow.classList.add("event-row");
        newRow.setAttribute("id", newEvent.id);
        newRow.innerHTML = `
        <td class="event-name" >${newEvent.eventName}</td>
        <td class="event-start" >${newEvent.startDate}</td>
        <td class="event-end" >${newEvent.endDate}</td>
        <td>
            <div class="action-buttons">
                <button class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>
            </div>
        </td>
        `;
        return newRow;
    }

}

class EventsModel {

}

class EventsController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        // Let the view know that this is the controller, when adding the event row
        this.view.controller = this;
        this.init();
    }

    init() {
        this.fetchEvents();
        this.setUpEvents();

    }

    setUpEvents() {
        this.setUpDeleteEvent();
    }

    // Fetches the event items using eventsAPIs.getEvents() 
    // and then renders them using the view
    async fetchEvents() {
        // using await to wait for the promise to resolve
        const events = await eventsAPIs.getEvents();
        this.view.renderEvents(events);
    }

    // When the confirm or cancel button is clicked, remove the input row from the table
    setUpRowButtons(row) {
        row.querySelector('.confirm-button').addEventListener('click', async () => {
            const eventNameInput = row.querySelector('.event-name');
            const startDateInput = row.querySelector('.event-start');
            const endDateInput = row.querySelector('.event-end');
            const newEvent = {
                eventName: eventNameInput.value,
                startDate: startDateInput.value,
                endDate: endDateInput.value
            };
            await this.addEvent(newEvent);
            row.remove(); // Remove the input row after adding the new event
        });

        row.querySelector('.cancel-button').addEventListener('click', () => {
            row.remove(); // Remove the input row on cancel
        });
    }

    // If the confirm button is clicked, add the new event to the table
    async addEvent(newEvent) {
        const addedEvent = await eventsAPIs.addEvent(newEvent);
        this.view.renderNewEvent(addedEvent);
    }

    setUpDeleteEvent() {
        this.view.eventBody.addEventListener("click", async (e) => {
            const elem = e.target;

            if (elem.classList.contains("delete-button")) {
                // Let the element find the ".event-row" class
                const eventRow = elem.parentElement.parentElement.parentElement;
                const eventId = eventRow.id;

                await eventsAPIs.deleteEvent(eventId);
                this.view.removeEventRow(eventRow);
            }
        });
    }

}

const eventsView = new EventsView();
const eventsModel = new EventsModel();
const eventsController = new EventsController(eventsView, eventsModel);