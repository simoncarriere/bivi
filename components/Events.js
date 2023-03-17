import { useState, useEffect, Fragment } from "react";
// Hooks
import { useAuthContext } from "../hooks/useAuthContext";
import { useSubcollection } from "../hooks/useSubcollection";

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
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

const meetings = [
  {
    id: 1,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    start: "1:00 PM",
    startDatetime: "2023-03-21T13:00",
    end: "2:30 PM",
    endDatetime: "2023-03-21T14:30",
  },
  {
    id: 1,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    start: "1:00 PM",
    startDatetime: "2023-03-18T13:00",
    end: "2:30 PM",
    endDatetime: "2023-03-18T14:30",
  },
  {
    id: 1,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    start: "1:00 PM",
    startDatetime: "2023-04-01T13:00",
    end: "2:30 PM",
    endDatetime: "2023-04-01T14:30",
  },
  // More meetings...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Events = () => {
  const { user, currentRoom } = useAuthContext();
  const [events, setEvents] = useState([]);

  // Initialize Today
  let today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  // Form State
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

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

  // Grab the Meetings from the current room
  useEffect(() => {
    let ref = collection(db, "rooms", currentRoom.id, "meetings");
    // let ref = query(
    //   collection(db, "rooms", currentRoom.id, "meetings"),
    //   orderBy("sentAt", "desc"),
    //   limit(30)
    // );
    const unsub = onSnapshot(ref, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      console.log("Results", results);
      setEvents(results);
    });

    return () => unsub();
  }, [currentRoom]);

  // let a = events[0];
  // console.log(a);

  // const y = parseISO("2023-03-21T13:00");

  // console.log(parseISO("2023-03-21:19:03"));
  // let x = parseISO("2023-03-21");
  // console.log(x);
  // console.log(parse("17:00", "HH:mm", new Date()));
  // console.log(parse("17:00", "HH:mm", x));

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
      <div className="grid grid-cols-7 mt-4 text-xs leading-6 text-center text-gray-500">
        <div>S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
      </div>
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
            <Meeting event={event} key={event.id} />
          ))
        ) : (
          // <ol>
          //   {events.map((event) => {
          //     let eventDate = parseISO(event.eventDate);
          //     let startTime = parse(event.startTime, "HH:mm", eventDate);
          //     let endTime = parse(event.endTime, "HH:mm", eventDate);
          //     return (
          //       <div
          //         key={event.id}
          //         className="flex justify-between w-full gap-2"
          //       >
          //         <p>{event.title}</p>
          //         {/* <p>{event.description}</p> */}
          //         <p>{format(startTime, "H:mm a, dd MMM")}</p>
          //         {/* <p>{format(endTime, "H:mm a, dd MMM")}</p> */}
          //         {/* <time>{parseISO(event.eventDate)}</time> */}
          //       </div>
          //     );
          //   })}
          // </ol>
          <p>No meetings scheduled on selected day</p>
        )}
        {/* 
        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
          {selectedDayMeetings.length > 0 ? (
            selectedDayMeetings.map((meeting) => (
              <Meeting meeting={meeting} key={meeting.id} />
            ))
          ) : (
            <p>No meetings scheduled on selected day</p>
          )}
        </ol> */}
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
                    Start Time
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
                    End Time
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
