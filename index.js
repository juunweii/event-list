
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

    // Get a single event by id
    async function getEventById(id) {
        return fetch(`${API_URL}/${id}`).then((res) => res.json());
    }    

    // Edit an event by id
    async function editEvent(id, updatedEvent) {
        return fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedEvent)
            }).then((res) => res.json());
    }

    // return the functions that can be used outside of this module
    return {
        getEvents,
        addEvent,
        deleteEvent,
        getEventById,
        editEvent,
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
                        <button class="confirm-button">
                            <svg focusable viewBox="0 0 24 24" aria-hidden="true xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 6V18M18 12H6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                        <button class="cancel-button">
                            <svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>
                        </button>
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

    // Edit the event, replace the event row with input fields
    editRow(eventRow, event, onSave) {
        eventRow.innerHTML = `
            <td><input type="text" class="event-name" value="${event.eventName}" /></td>
            <td><input type="date" class="event-start" value="${event.startDate}" /></td>
            <td><input type="date" class="event-end" value="${event.endDate}" /></td>
            <td>
                <div class="action-buttons">
                    <button class="confirm-edit-button">
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z">
                        </path>
                    </svg>
                    </button>
                    <button class="cancel-edit-button">
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>
                    </button>
                </div>
            </td>
        `;

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
                <button class="edit-button">
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z">
                    </path></svg>
                </button>
                <button class="delete-button">
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z">
                        </path>
                    </svg>
                </button>
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
        this.setUpEditEvent();
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

            // Call validateInput() to check if the input is valid
            if (!this.validateInput(eventNameInput.value, startDateInput.value, endDateInput.value)) {
                return;
            }

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

    // Check if the input is valid
    validateInput(eventNameInput, startDateInput, endDateInput) {
        // Check if the input is empty
        if (!eventNameInput.trim()) {
            alert('Input not valid: Event name is required');
            return false;
        }

        // Check if the start date is before the end date
        const start = new Date(startDateInput);
        const end = new Date(endDateInput);

        if (start >= end) {
            alert('Input not valid: End date should be after start date');
            return false; 
        }

        return true; 
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


    setUpEditEvent() {
        this.view.eventBody.addEventListener("click", async (e) => {
            const elem = e.target;

            if (elem.classList.contains("edit-button")) {
                const eventRow = elem.parentElement.parentElement.parentElement;
                const eventId = eventRow.id;

                const event = await eventsAPIs.getEventById(eventId);
                this.view.editRow(eventRow, event);
                this.setUpEditConfirmButtons(eventRow, eventId);
            }
        });
    }

    setUpEditConfirmButtons(eventRow, eventId) {
        const confirmButton = eventRow.querySelector('.confirm-edit-button');
        const cancelButton = eventRow.querySelector('.cancel-edit-button');
    
        confirmButton.addEventListener('click', async () => {
            const eventNameInput = eventRow.querySelector('.event-name').value;
            const startDateInput = eventRow.querySelector('.event-start').value;
            const endDateInput = eventRow.querySelector('.event-end').value;
    
            if (!this.validateInput(eventNameInput, startDateInput, endDateInput)) {
                return;
            }
    
            const updatedEvent = {
                eventName: eventNameInput,
                startDate: startDateInput,
                endDate: endDateInput
            };
    
            await eventsAPIs.editEvent(eventId, updatedEvent);
            // After updating, fetch and display the updated events list
            await this.fetchEvents();
        });
    
        // cancel button
        cancelButton.addEventListener('click', async () => {
            // Re-fetch and display the events to cancel editing
            await this.fetchEvents();
        });
    }
    

}

const eventsView = new EventsView();
const eventsModel = new EventsModel();
const eventsController = new EventsController(eventsView, eventsModel);