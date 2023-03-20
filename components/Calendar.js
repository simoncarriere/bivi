import { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
// Hooks
import { useAuthContext } from "../hooks/useAuthContext";
// Libraries
import {
  startOfToday,
  format,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfHour,
  isSameDay,
  isSameWeek,
  parse,
  parseISO,
  add,
  differenceInMinutes,
} from "date-fns";
// Firebase
import { db } from "../lib/firebase";
import {
  doc,
  query,
  orderBy,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import Meeting from "./Meeting";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Calendar() {
  const { user, currentRoom } = useAuthContext();
  // Denomalize events locally
  const [events, setEvents] = useState([]);
  // Handle Calendar
  const container = useRef(null);
  const containerNav = useRef(null);
  const containerOffset = useRef(null);

  // Handle Dates
  let today = startOfToday();

  let [currentWeek, setCurrentWeek] = useState(format(today, "ww"));
  let firstDayCurrentWeek = parse(currentWeek, "ww", new Date());

  let thisWeek = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentWeek),
    end: endOfWeek(firstDayCurrentWeek),
  });
  function previousWeek() {
    let firstDayLastWeek = add(firstDayCurrentWeek, { weeks: -1 });
    setCurrentWeek(format(firstDayLastWeek, "ww"));
  }
  function nextWeek() {
    let firstDayNextWeek = add(firstDayCurrentWeek, { weeks: 1 });
    setCurrentWeek(format(firstDayNextWeek, "ww"));
  }

  // Grab the Events from the current room
  useEffect(() => {
    let ref = collection(db, "rooms", currentRoom.id, "meetings");
    let orderedRef = query(ref, orderBy("startTime", "asc"));

    const unsub = onSnapshot(orderedRef, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        let weekday = format(parseISO(doc.data().eventDate), "e");
        results.push({
          ...doc.data(),
          id: doc.id,
          weekday: weekday,
        });
        // console.log(weekday);
        // console.log(
        //   format(parseISO(doc.data().eventDate), "e"),
        //   format(firstDayCurrentWeek, "e")
        // );
      });
      setEvents(results);

      // console.log(results);
    });

    return () => unsub();
  }, [currentRoom]);

  // Grab the Members from the current room
  // useEffect(() => {
  //   const ref = collection(db, "rooms", currentRoom.id, "members");
  //   const unsub = onSnapshot(ref, (snapshot) => {
  //     let results = [];
  //     snapshot.docs.forEach((doc) => {
  //       results.push({
  //         ...doc.data(),
  //         id: doc.id,
  //         value: doc.data().uid,
  //         label: doc.data().displayName,
  //       });
  //     });
  //     setMembers(results);
  //   });
  //   return () => unsub();
  // }, [currentRoom, user.email]);

  // const deleteEvent = async (eventId) => {
  //   let eventRef = doc(db, "rooms", currentRoom.id, "meetings", eventId);
  //   try {
  //     deleteDoc(eventRef);
  //     console.log("Meeting successfully deleted!");
  //   } catch (e) {
  //     console.error("Error removing meeting: ", e);
  //   }
  // };

  return (
    <div className="flex flex-col h-full ">
      <header className="flex items-center justify-between flex-none px-6 py-4 ">
        <h1 className="text-lg font-semibold leading-6 text-gray-900">
          <time dateTime={format(firstDayCurrentWeek, "yyyy-MM")}>
            {format(firstDayCurrentWeek, "MMMM YYY")}
          </time>
          {/* <p>{format(currentTime, "HH:mm")}</p> */}
        </h1>
        <div className="flex items-center">
          {/* Select Week */}
          <div className="relative flex items-center bg-white rounded-md shadow-sm md:items-stretch">
            <div
              className="absolute inset-0 rounded-md pointer-events-none ring-1 ring-inset ring-gray-300"
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={previousWeek}
              className="flex items-center justify-center py-2 pl-3 pr-4 text-gray-400 rounded-l-md hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous week</span>
              <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentWeek(format(today, "ww"))}
              className="hidden px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
            >
              This Week
            </button>
            <span className="relative w-px h-5 -mx-px bg-gray-300 md:hidden" />
            <button
              onClick={nextWeek}
              type="button"
              className="flex items-center justify-center py-2 pl-4 pr-3 text-gray-400 rounded-r-md hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next week</span>
              <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      {/* Calendar */}
      <div
        ref={container}
        className="flex flex-col flex-auto overflow-auto bg-white "
        // className="flex flex-col flex-auto overflow-auto bg-white cursor-not-allowed isolate hover:brightness-90"
      >
        <div
          style={{ width: "165%" }}
          className="flex flex-col flex-none h-full max-w-full isolate sm:max-w-none md:max-w-full"
        >
          {/* Days */}
          <div
            ref={containerNav}
            className="sticky top-0 z-30 flex-none bg-white shadow sm:pr-8"
          >
            {/* MOBILE THIS WEEK */}
            <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
              {thisWeek.map((day) => (
                <button
                  type="button"
                  className="flex flex-col items-center pt-2 pb-3"
                  key={day.toString()}
                >
                  {format(day, "eee")}
                  <span className="flex items-center justify-center w-8 h-8 mt-1 font-semibold text-gray-900">
                    {format(day, "dd")}
                  </span>
                </button>
              ))}
            </div>
            {/* DESKTOP THIS WEEK */}
            <div className="hidden grid-cols-7 -mr-px text-sm leading-6 text-gray-500 sm:grid">
              <div className="col-end-1 w-14" />

              {thisWeek.map((day) => {
                const isToday = isSameDay(day, new Date());
                return (
                  <button
                    type="button"
                    className={classNames(
                      isToday
                        ? " text-gray-100 bg-gray-800 rounded-lg font-semibold"
                        : "text-gray-500",
                      "flex  mx-auto justify-center items-center w-full gap-2 my-2 py-1 "
                    )}
                    key={day.toString()}
                  >
                    {format(day, "eee")}
                    <span
                      className={classNames(
                        isToday
                          ? "text-gray-100 font-semibold "
                          : "text-gray-500",
                        ""
                      )}
                    >
                      {format(day, "dd")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Events */}
          <div className="flex flex-auto ">
            <div className="sticky left-0 z-10 flex-none bg-white w-14 ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1 ">
              {/* Horizontal lines */}
              <div
                className="grid col-start-1 col-end-2 row-start-1 divide-y divide-gray-100"
                style={{
                  gridTemplateRows: "repeat(48, minmax(3.5rem, 3rem))",
                }}
              >
                {/* <div ref={containerOffset} className="row-end-1 h-7 mb-7"></div> */}
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    12AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    1AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    2AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    3AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    4AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    5AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    6AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    7AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    8AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    9AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    10AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    11AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    12PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    1PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    2PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    3PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    4PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    5PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    6PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    7PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    8PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    9PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    10PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    11PM
                  </div>
                </div>
                <div />
              </div>

              {/* Vertical lines */}
              {/* divide-gray-100 divide-x*/}

              {/* const isToday = isSameDay(day, new Date()); */}
              <div
                className="hidden grid-cols-7 col-start-1 col-end-2 row-start-1 sm:grid sm:grid-cols-7"
                style={{
                  gridTemplateRows: "repeat(96, minmax(1.75rem, 0.875rem))",
                }}
              >
                {events
                  .filter((event) =>
                    isSameWeek(parseISO(event.eventDate), firstDayCurrentWeek)
                  )

                  .map((event) => {
                    // Check if user is attending event
                    let isUserAttending = event.eventAttendees.includes(
                      user.uid
                    );

                    let eventDate = parseISO(event.eventDate);
                    // Calculate position and duration of event
                    let startTime = parse(event.startTime, "HH:mm", eventDate);
                    let endTime = parse(event.endTime, "HH:mm", eventDate);
                    let duration = differenceInMinutes(endTime, startTime) / 15;
                    let startHour = format(startTime, "H:mm").split(":")[0];
                    let startMinute = format(startTime, "H:mm").split(":")[1];
                    let startHourNumber = Number(startHour) * 4 + 1;
                    let startMinuteNumber = Number(startMinute) / 15;

                    return (
                      <div
                        key={event.id}
                        style={{
                          gridRow: `${
                            startHourNumber + startMinuteNumber
                          } / span ${duration}`,
                        }}
                        className={`col-start-${
                          event.weekday
                        } cursor-pointer  border  px-1 py-0.5 ${
                          isUserAttending
                            ? "bg-indigo-100  hover:bg-indigo-200 border-indigo-200 "
                            : "bg-slate-100  hover:bg-slate-200 border-slate-200 "
                        } rounded-md `}
                      >
                        <p>
                          <time
                            dateTime={startTime}
                            className={
                              isUserAttending
                                ? "text-indigo-500 font-extralight text-xs"
                                : "text-gray-600 font-extralight text-xs"
                            }
                          >
                            {format(startTime, "h:mm ")}
                          </time>{" "}
                          -{" "}
                          <time
                            dateTime={endTime}
                            className={
                              isUserAttending
                                ? "text-indigo-500 font-extralight text-xs"
                                : "text-gray-600 font-extralight text-xs"
                            }
                            // className={`text-xs font-extralight text-gray-600 ${
                            //   isUserAttending && "text-emerald-600"
                            // }}`}
                          >
                            {format(endTime, "h:mm a")}
                          </time>
                        </p>
                        <p
                          className={
                            isUserAttending
                              ? "text-indigo-600  text-base"
                              : "text-gray-500  text-base"
                          }
                        >
                          {event.title}
                        </p>
                        {/* {isUserAttending && <p>YOU MUST ATTEDN</p>} */}
                        {/* <p className="text-xs text-emerald-600 ">
                          {duration} Hours
                        </p> */}
                      </div>
                    );
                  })}

                <div className="w-8 col-start-8 row-span-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
