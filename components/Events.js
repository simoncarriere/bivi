import { useState, useEffect } from "react";
// Hooks
import { useAuthContext } from "../hooks/useAuthContext";
// Libraries
import {
  startOfToday,
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfHour,
  isSameDay,
  isSameMonth,
  isToday,
  isEqual,
  parse,
  add,
  getDay,
  parseISO,
} from "date-fns";
// Components
import Meeting from "./Meeting";
// Icons
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
// FIrebase
import { db } from "../lib/firebase";
import {
  doc,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Events = () => {
  const { currentRoom } = useAuthContext();

  // Form State
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  // Initialize Today
  let today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  // Denomalize events locally
  const [events, setEvents] = useState([]);

  // Handle calender days and months
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  let days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });
  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }
  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  // Grab the Events from the current room
  useEffect(() => {
    let ref = collection(db, "rooms", currentRoom.id, "meetings");

    const unsub = onSnapshot(ref, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      setEvents(results);
    });

    return () => unsub();
  }, [currentRoom]);

  // Filter events by selected day
  let selectedDayEvents = events.filter((event) =>
    isSameDay(parseISO(event.eventDate), selectedDay)
  );

  // Add a new meeting
  const addEvent = (e) => {
    e.preventDefault();

    const roomMeetingsRef = collection(db, "rooms", currentRoom.id, "meetings");

    try {
      addDoc(roomMeetingsRef, {
        title: eventTitle,
        description: eventDescription,
        startTime: startTime,
        endTime: endTime,
        eventDate: eventDate,
      }).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setEventTitle("");
    setEventDescription("");
    setEventDate("");
    setStartTime("");
    setEndTime("");
  };

  const deleteEvent = async (eventId) => {
    let eventRef = doc(db, "rooms", currentRoom.id, "meetings", eventId);
    try {
      deleteDoc(eventRef);
      console.log("Meeting successfully deleted!");
    } catch (e) {
      console.error("Error removing meeting: ", e);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center mt-3">
        <h2 className="flex-auto text-sm font-semibold text-gray-900">
          {format(firstDayCurrentMonth, "MMMM yyyy  ")}
        </h2>
        <button
          type="button"
          onClick={previousMonth}
          className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={nextMonth}
          className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      {/* Calendar */}
      {/* Days of Week */}
      <div className="grid grid-cols-7 mt-4 text-xs leading-6 text-center text-gray-500">
        <div>S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
      </div>
      {/* Days of Month */}
      <div className="grid grid-cols-7 mt-2 text-sm">
        {days.map((day, dayIdx) => (
          <div
            key={day.toString()}
            className={classNames(
              dayIdx > 6 && "",
              dayIdx === 0 && colStartClasses[getDay(day)],

              "py-1"
            )}
          >
            <button
              onClick={() => setSelectedDay(day)}
              type="button"
              className={classNames(
                isEqual(day, selectedDay) && "text-slate-50",
                !isEqual(day, selectedDay) &&
                  isToday(day) &&
                  "text-slate-600 bg-slate-100 ",
                !isEqual(day, selectedDay) &&
                  !isToday(day) &&
                  isSameMonth(day, firstDayCurrentMonth) &&
                  "text-gray-900",
                !isEqual(day, selectedDay) &&
                  !isToday(day) &&
                  !isSameMonth(day, firstDayCurrentMonth) &&
                  "text-gray-300",
                isEqual(day, selectedDay) && isToday(day) && "bg-slate-600",
                isEqual(day, selectedDay) && !isToday(day) && "bg-slate-600",
                !isEqual(day, selectedDay) && "hover:bg-slate-50",
                (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
                "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
              )}
            >
              <time dateTime={format(day, "yyyy-MM-dd")}>
                {format(day, "d")}
              </time>
            </button>

            <div className="w-1 h-1 mx-auto mt-1">
              {events.some((event) =>
                isSameDay(parseISO(event.eventDate), day)
              ) && (
                <div className="w-1 h-1 rounded-full bg-emerald-600 animate-pulse"></div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* List of events */}
      <section className="mt-12">
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          Schedule for{" "}
          <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
            {format(selectedDay, "MMM dd, yyyy")}
          </time>
        </h2>
        {selectedDayEvents.length > 0 ? (
          selectedDayEvents.map((event) => (
            <Meeting event={event} deleteEvent={deleteEvent} key={event.id} />
          ))
        ) : (
          <p className="mt-4 text-gray-400">
            No meetings scheduled on selected day
          </p>
        )}
      </section>
      {/* Add Event Form */}
      <div className="fixed bottom-0 pb-4 bg-white -right-1 w-96">
        <form
          onSubmit={addEvent}
          className="relative items-center px-4 mx-auto mt-2 rounded-md"
        >
          <div className="overflow-hidden border border-gray-100 rounded-sm shadow-sm focus-within:border-gray-200 focus-within:ring-1 focus-within:ring-gray-200">
            <label htmlFor="title" className="sr-only">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="block w-full border-0 pt-2.5 text-lg font-medium placeholder:text-gray-400 focus:ring-0"
              placeholder="Event Title"
            />
            <label htmlFor="description" className="sr-only">
              Description
            </label>
            <textarea
              rows={3}
              name="description"
              id="description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              className="block w-full py-0 text-gray-900 border-0 resize-none placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Event description..."
              // defaultValue={""}
            />
            <div className="px-2 pb-2">
              <div className="mt-2 mb-1">
                <label htmlFor="eventDate" className="text-xs text-gray-400">
                  Event Date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="border border-gray-100 rounded-md bg-gray-50"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 w-full mt-2 mb-1">
                  <label htmlFor="starttime" className="text-xs text-gray-400">
                    From
                  </label>
                  <input
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    type="time"
                    name="time"
                    id="starttime"
                    required
                    className="border border-gray-100 rounded-md bg-gray-50"
                  />
                </div>
                <div className="flex-1 w-full mt-2 mb-1">
                  <label htmlFor="endtime" className="text-xs text-gray-400">
                    To
                  </label>
                  <input
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    type="time"
                    name="time"
                    id="endtime"
                    required
                    className="border border-gray-100 rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

// Handle position of first day of month depending on day of week
let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export default Events;
