import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
// Libraries
import { format, parseISO, parse } from "date-fns";
// Icons
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const Meeting = ({ event, deleteEvent }) => {
  // let startDatetime = parseISO(meeting.startDatetime);
  // let endDatetime = parseISO(meeting.endDatetime);

  let eventDate = parseISO(event.eventDate);
  let startTime = parse(event.startTime, "HH:mm", eventDate);
  let endTime = parse(event.endTime, "HH:mm", eventDate);
  return (
    <li
      key={event.id}
      className="flex items-center p-2.5 mb-2 space-x-4 group rounded-md bg-gray-50 focus-within:bg-gray-100 hover:bg-gray-100"
    >
      {/* <img
          src={meeting.imageUrl}
          alt=""
          className="flex-none w-10 h-10 rounded-full"
        /> */}
      <div className="flex-auto">
        <p className="text-gray-900">{event.title}</p>
        <p className="mt-0.5">
          <time dateTime={startTime}>{format(startTime, "h:mm ")}</time> -{" "}
          <time dateTime={endTime}>{format(endTime, "h:mm a")}</time>
          {/* <time dateTime={event.startDatetime}>
            {format(startDatetime, "h:mm a")}
          </time>{" "}
          -{" "}
          <time dateTime={meeting.endDatetime}>
            {format(endDatetime, "h:mm a")}
          </time> */}
        </p>
      </div>
      <Menu
        as="div"
        className="relative flex-shrink-0 inline-block ml-2 text-left"
      >
        <Menu.Button className="relative inline-flex items-center justify-center w-8 h-8 bg-white rounded-full group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
          <span className="sr-only">Open options menu</span>
          <span className="flex items-center justify-center w-full h-full rounded-full">
            <EllipsisVerticalIcon
              className="w-5 h-5 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
          </span>
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
          <Menu.Items className="absolute top-0 z-10 w-48 origin-top-right bg-white rounded-md shadow-lg right-9 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                <div
                  onClick={() => deleteEvent(event.id)}
                  className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
                >
                  Delete Meeting
                </div>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      {/* <Menu
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
          <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-gray-200 rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
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
      </Menu> */}
    </li>
  );
};

export default Meeting;
{
  /* <ol>
  {events.map((event) => {
    return (
      <div key={event.id} className="flex justify-between w-full gap-2">
        <p>{event.title}</p>
        <p>{event.description}</p>
        <p>{format(startTime, "H:mm a, dd MMM")}</p>
        <p>{format(endTime, "H:mm a, dd MMM")}</p>
        <time>{parseISO(event.eventDate)}</time>
      </div>
    );
  })}
</ol>; */
}
