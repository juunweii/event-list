
// eventAPI contains all the functions that interact with the json server
const eventAPI = (function () {
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
                // res is the http response
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

}

class EventsModel {

}

class EventsController {

}

const eventsView = new EventsView();
const eventsModel = new EventsModel();
const eventsController = new EventsController(eventsView, eventsModel);