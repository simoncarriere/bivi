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
// import "react-select/dist/react-select.css";
import Select from "react-select";
// Components
import Meeting from "./Meeting";
// Icons
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
// Firebase
import { db } from "../lib/firebase";
import {
  doc,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Events = () => {
  const { currentRoom, user } = useAuthContext();

  // Denomalize events & members locally
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);

  // Form State
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventAttendees, setEventAttendees] = useState([]);
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Initialize Today
  let today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);

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
    let orderedRef = query(ref, orderBy("startTime", "asc"));

    const unsub = onSnapshot(orderedRef, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      setEvents(results);
    });

    return () => unsub();
  }, [currentRoom]);

  // Grab the Members from the current room
  useEffect(() => {
    const ref = collection(db, "rooms", currentRoom.id, "members");
    const unsub = onSnapshot(ref, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push({
          ...doc.data(),
          id: doc.id,
          value: doc.data().uid,
          label: doc.data().displayName,
        });
      });
      setMembers(results);
    });
    return () => unsub();
  }, [currentRoom, user.email]);

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
        eventAttendees: eventAttendees,
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
    setEventFormOpen(false);
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

  // Styles for react-select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "rgb(249, 250, 251)",
      border: "border-none",
      fontSize: "14px",
      padding: "6px 0px",
      // match with the menu
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      // Overwrittes the different states of border
      borderColor: state.isFocused
        ? "rgb(243, 244, 246)"
        : "rgb(243, 244, 246)",
      // Removes weird border around container
    }),
    menu: (base) => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0,
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
    }),
  };

  const handleAttendeesMultiSelect = (selectedOption) => {
    // setEventAttendees(selectedOption);
    let results = [];
    setEventAttendees(
      selectedOption.map((attendee) => results.push(attendee.uid))
    );
    setEventAttendees(results);
  };

  // useEffect(() => {
  //   console.log("attendees", eventAttendees);
  // }, [eventAttendees]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center ">
        <h2 className="flex-auto my-2 text-sm font-semibold text-gray-900">
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
      <section className="py-4">
        <h2 className="flex-auto text-sm font-semibold leading-6 text-gray-900">
          Team Schedule for{" "}
          <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
            {format(selectedDay, "MMM dd, yyyy")}
          </time>
        </h2>
        {selectedDayEvents.length > 0 ? (
          selectedDayEvents.map((event) => (
            <Meeting event={event} deleteEvent={deleteEvent} key={event.id} />
          ))
        ) : (
          <p className="flex justify-center pt-4 text-gray-400">
            No meetings scheduled on selected day
          </p>
        )}
      </section>

      {/* Add Event Form */}
      <div className="fixed bottom-0 pb-4 bg-white -right-0.5 w-96">
        {eventFormOpen ? (
          <form
            onSubmit={addEvent}
            className="relative items-center px-4 mx-auto mt-2 rounded-md "
          >
            <div className="overflow-hidden border border-gray-200 rounded-md shadow-sm focus-within:border-gray-200 focus-within:ring-1 focus-within:ring-gray-200">
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
                className="block w-full pt-3 text-lg font-medium border-0 placeholder:text-gray-400 focus:ring-0"
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
              {/* Select */}
              {members.length > 0 && (
                <div className="px-2 pb-2">
                  <div className="mt-2 mb-1">
                    <label
                      htmlFor="eventDate"
                      className="text-xs text-gray-400"
                    >
                      Attendees
                    </label>
                    <Select
                      styles={customStyles}
                      defaultValue={null}
                      placeholder="Select Members"
                      isMulti
                      name="colors"
                      options={members}
                      className="rounded-md bg-gray-50"
                      onChange={handleAttendeesMultiSelect}
                    />
                  </div>
                </div>
              )}
              {/* Dates */}
              <div className="px-2 pb-2">
                <div className="mt-2 mb-1">
                  <label htmlFor="eventDate" className="text-xs text-gray-400">
                    Happening On
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="pt-3 border border-gray-100 rounded-md bg-gray-50"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 w-full mt-2 mb-1">
                    <label
                      htmlFor="starttime"
                      className="text-xs text-gray-400"
                    >
                      From
                    </label>
                    <input
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      type="time"
                      name="time"
                      id="starttime"
                      required
                      className="pt-3 border border-gray-100 rounded-md bg-gray-50"
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
                      className="pt-3 border border-gray-100 rounded-md bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className=" btn-secondary"
                onClick={() => setEventFormOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="px-2 btn-primary">
                Create Event
              </button>
            </div>
          </form>
        ) : (
          <div className="px-4">
            <button
              type="submit"
              className="px-2 btn-primary"
              onClick={() => setEventFormOpen(true)}
            >
              New Event
            </button>
          </div>
        )}
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
