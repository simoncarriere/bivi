import { useState, useEffect, Fragment } from "react";
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
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

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
  let today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");

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

  let selectedDayMeetings = meetings.filter((meeting) =>
    isSameDay(parseISO(meeting.startDatetime), selectedDay)
  );
  const addEvent = (e) => {
    e.preventDefault();
    console.log("add event", eventTitle, eventDescription);
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
              {meetings.some((meeting) =>
                isSameDay(parseISO(meeting.startDatetime), day)
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
        {/* {meetings.map((meeting) => (
            <Meeting meeting={meeting} key={meeting.id} />
          ))} */}
        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
          {selectedDayMeetings.length > 0 ? (
            selectedDayMeetings.map((meeting) => (
              <Meeting meeting={meeting} key={meeting.id} />
            ))
          ) : (
            <p>No meetings on selected day</p>
          )}
        </ol>
      </section>
      {/* Add Event Form */}
      <div className="fixed bottom-0 pb-4 bg-white -right-1 w-96">
        <form
          onSubmit={addEvent}
          className="relative items-center px-4 mx-auto mt-2"
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
          </div>

          <button type="submit" className="btn-primary">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

function Meeting({ meeting }) {
  let startDatetime = parseISO(meeting.startDatetime);
  let endDatetime = parseISO(meeting.endDatetime);
  return (
    <li
      key={meeting.id}
      className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100"
    >
      <img
        src={meeting.imageUrl}
        alt=""
        className="flex-none w-10 h-10 rounded-full"
      />
      <div className="flex-auto">
        <p className="text-gray-900">{meeting.name}</p>
        <p className="mt-0.5">
          <time dateTime={meeting.startDatetime}>
            {format(startDatetime, "h:mm a")}
          </time>{" "}
          -{" "}
          <time dateTime={meeting.endDatetime}>
            {format(endDatetime, "h:mm a")}
          </time>
        </p>
      </div>
      <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
      >
        <div>
          <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon className="w-6 h-6" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Edit
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Cancel
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  );
}

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
