import { Fragment, useState, useEffect, useRef } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
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
  parse,
} from "date-fns";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Calendar() {
  const container = useRef(null);
  const containerNav = useRef(null);
  const containerOffset = useRef(null);
  // var [currentTime, setCurrentTime] = useState(new Date());

  let today = startOfToday();
  let [currentWeek, setCurrentWeek] = useState(format(today, "MMM ww, yyyy"));

  // let firstDayCurrentWeek = parse(currentWeek, "MMM dd, yyyy", new Date());
  // console.log(currentWeek);
  // console.log(firstDayCurrentWeek);

  let thisWeek = eachDayOfInterval({
    start: startOfWeek(today),
    end: endOfWeek(today),
  });
  // let thisMonth = eachDayOfInterval({
  //   start: startOfMonth(today),
  //   end: endOfMonth(today),
  // });

  // useEffect(() => {
  //   var timer = setInterval(() => setCurrentTime(new Date()), 1000);

  //   return function cleanup() {
  //     clearInterval(timer);
  //   };
  // });

  // Set the container scroll position based on the current time. (TAILWIND UTILITY)
  useEffect(() => {
    const currentMinute = new Date().getHours() * 60;
    container.current.scrollTop =
      ((container.current.scrollHeight -
        containerNav.current.offsetHeight -
        containerOffset.current.offsetHeight) *
        currentMinute) /
      1440;
  }, []);

  return (
    <div className="flex flex-col h-full ">
      <header className="flex items-center justify-between flex-none px-6 py-4 ">
        <h1 className="text-lg font-semibold leading-6 text-gray-900">
          <time dateTime={format(today, "yyyy-MM")}>
            {format(today, "MMMM YYY")}
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
              className="flex items-center justify-center py-2 pl-3 pr-4 text-gray-400 rounded-l-md hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous week</span>
              <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
            >
              Today
            </button>
            <span className="relative w-px h-5 -mx-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex items-center justify-center py-2 pl-4 pr-3 text-gray-400 rounded-r-md hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next week</span>
              <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div
        ref={container}
        className="flex flex-col flex-auto overflow-auto bg-white cursor-not-allowed isolate hover:brightness-90"
      >
        <div
          style={{ width: "165%" }}
          className="flex flex-col flex-none max-w-full sm:max-w-none md:max-w-full"
        >
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
                        ? " text-gray-900 border-b-2 border-emerald-300"
                        : "text-gray-700",
                      "flex  mx-auto justify-center items-center w-full pt-2 pb-3 gap-2"
                    )}
                    key={day.toString()}
                  >
                    {format(day, "eee")}
                    <span className="font-semibold">{format(day, "dd")}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 flex-none bg-white w-14 ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="grid col-start-1 col-end-2 row-start-1 divide-y divide-gray-100"
                style={{ gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))" }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
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
              <div className="hidden grid-cols-7 col-start-1 col-end-2 grid-rows-1 row-start-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
                <div className="col-start-1 row-span-full" />
                <div className="col-start-2 row-span-full" />
                <div className="col-start-3 row-span-full" />
                <div className="col-start-4 row-span-full" />
                <div className="col-start-5 row-span-full" />
                <div className="col-start-6 row-span-full" />
                <div className="col-start-7 row-span-full" />
                <div className="w-8 col-start-8 row-span-full" />
              </div>

              {/* Events */}
              {/* <ol
                className="grid grid-cols-1 col-start-1 col-end-2 row-start-1 sm:grid-cols-7 sm:pr-8"
                style={{
                  gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
                }}
              >
                <li
                  className="relative flex mt-px sm:col-start-3"
                  style={{ gridRow: "74 / span 12" }}
                >
                  <a
                    href="#"
                    className="absolute flex flex-col p-2 overflow-y-auto text-xs leading-5 rounded-lg group inset-1 bg-blue-50 hover:bg-blue-100"
                  >
                    <p className="order-1 font-semibold text-blue-700">
                      Breakfast
                    </p>
                    <p className="text-blue-500 group-hover:text-blue-700">
                      <time dateTime="2022-01-12T06:00">6:00 AM</time>
                    </p>
                  </a>
                </li>
                <li
                  className="relative flex mt-px sm:col-start-3"
                  style={{ gridRow: "92 / span 30" }}
                >
                  <a
                    href="#"
                    className="absolute flex flex-col p-2 overflow-y-auto text-xs leading-5 rounded-lg group inset-1 bg-pink-50 hover:bg-pink-100"
                  >
                    <p className="order-1 font-semibold text-pink-700">
                      Flight to Paris
                    </p>
                    <p className="text-pink-500 group-hover:text-pink-700">
                      <time dateTime="2022-01-12T07:30">7:30 AM</time>
                    </p>
                  </a>
                </li>
                <li
                  className="relative hidden mt-px sm:col-start-6 sm:flex"
                  style={{ gridRow: "122 / span 24" }}
                >
                  <a
                    href="#"
                    className="absolute flex flex-col p-2 overflow-y-auto text-xs leading-5 bg-gray-100 rounded-lg group inset-1 hover:bg-gray-200"
                  >
                    <p className="order-1 font-semibold text-gray-700">
                      Meeting with design team at Disney
                    </p>
                    <p className="text-gray-500 group-hover:text-gray-700">
                      <time dateTime="2022-01-15T10:00">10:00 AM</time>
                    </p>
                  </a>
                </li>
              </ol> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="hidden md:ml-4 md:flex md:items-center">
<Menu as="div" className="relative">
  <Menu.Button
    type="button"
    className="flex items-center gap-x-1.5 rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
  >
    Week view
    <ChevronDownIcon
      className="w-5 h-5 -mr-1 text-gray-400"
      aria-hidden="true"
    />
  </Menu.Button>

  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    <Menu.Items className="absolute right-0 z-10 mt-3 overflow-hidden origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1">
        <Menu.Item>
          {({ active }) => (
            <a
              href="#"
              className={classNames(
                active
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700",
                "block px-4 py-2 text-sm"
              )}
            >
              Day view
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              href="#"
              className={classNames(
                active
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700",
                "block px-4 py-2 text-sm"
              )}
            >
              Week view
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              href="#"
              className={classNames(
                active
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700",
                "block px-4 py-2 text-sm"
              )}
            >
              Month view
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              href="#"
              className={classNames(
                active
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700",
                "block px-4 py-2 text-sm"
              )}
            >
              Year view
            </a>
          )}
        </Menu.Item>
      </div>
    </Menu.Items>
  </Transition>
</Menu>
<div className="w-px h-6 ml-6 bg-gray-300" />
<button
  type="button"
  className="px-3 py-2 ml-6 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
>
  Add event
</button>
</div>
<Menu as="div" className="relative ml-6 md:hidden">
<Menu.Button className="flex items-center p-2 -mx-2 text-gray-400 border border-transparent rounded-full hover:text-gray-500">
  <span className="sr-only">Open menu</span>
  <EllipsisHorizontalIcon className="w-5 h-5" aria-hidden="true" />
</Menu.Button>

<Transition
  as={Fragment}
  enter="transition ease-out duration-100"
  enterFrom="transform opacity-0 scale-95"
  enterTo="transform opacity-100 scale-100"
  leave="transition ease-in duration-75"
  leaveFrom="transform opacity-100 scale-100"
  leaveTo="transform opacity-0 scale-95"
>
  <Menu.Items className="absolute right-0 z-10 mt-3 overflow-hidden origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
    <div className="py-1">
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700",
              "block px-4 py-2 text-sm"
            )}
          >
            Create event
          </a>
        )}
      </Menu.Item>
    </div>
    <div className="py-1">
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700",
              "block px-4 py-2 text-sm"
            )}
          >
            Go to today
          </a>
        )}
      </Menu.Item>
    </div>
    <div className="py-1">
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700",
              "block px-4 py-2 text-sm"
            )}
          >
            Day view
          </a>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700",
              "block px-4 py-2 text-sm"
            )}
          >
            Week view
          </a>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700",
              "block px-4 py-2 text-sm"
            )}
          >
            Month view
          </a>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700",
              "block px-4 py-2 text-sm"
            )}
          >
            Year view
          </a>
        )}
      </Menu.Item>
    </div>
  </Menu.Items>
</Transition>
</Menu> */
}
