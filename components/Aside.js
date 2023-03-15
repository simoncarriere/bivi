import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  PaperClipIcon,
  TagIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { useSubcollection } from "../hooks/useSubcollection";
import { useAuthContext } from "../hooks/useAuthContext";

const assignees = [
  { name: "Unassigned", value: null },
  {
    name: "Wade Cooper",
    value: "wade-cooper",
    avatar:
      "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  // More items...
];
const labels = [
  { name: "Unlabelled", value: null },
  { name: "Engineering", value: "engineering" },
  // More items...
];
const dueDates = [
  { name: "No due date", value: null },
  { name: "Today", value: "today" },
  // More items...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Aside() {
  const [assigned, setAssigned] = useState(assignees[0]);
  const [labelled, setLabelled] = useState(labels[0]);
  const [dated, setDated] = useState(dueDates[0]);
  const { currentRoom } = useAuthContext("rooms");
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");

  const { documents: todos } = useSubcollection(
    "rooms",
    currentRoom.id,
    "todos"
  );

  const addTodo = (e) => {
    e.preventDefault();
  };
  return (
    <div className="flex flex-col justify-between h-full px-6 py-4">
      <div className="">
        <h1 className="pb-2 mb-2 text-base font-semibold leading-6 text-gray-900 border-b border-gray-200">
          Todos
        </h1>
        {todos && todos.length > 1 ? (
          todos.map((todo) => {
            <p>Todo</p>;
          })
        ) : (
          <p>Add a todo to get started</p>
        )}
      </div>
      <form action="#" className="relative align-bottom flex-end">
        <div className="overflow-hidden border border-gray-300 rounded-lg shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
          <label htmlFor="title" className="sr-only">
            Todo Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            className="block w-full border-0 pt-2.5 text-lg font-medium placeholder:text-gray-400 focus:ring-0"
            placeholder="Title"
          />
          <label htmlFor="description" className="sr-only">
            Description
          </label>
          <textarea
            rows={2}
            name="description"
            id="description"
            value={todoDescription}
            onChange={(e) => setTodoDescription(e.target.value)}
            className="block w-full py-0 text-gray-900 border-0 resize-none placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Write a description..."
            // defaultValue={""}
          />

          {/* Spacer element to match the height of the toolbar */}
          <div aria-hidden="true">
            <div className="py-2">
              <div className="h-9" />
            </div>
            <div className="h-px" />
            <div className="py-2">
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-px">
          {/* Actions: These are just examples to demonstrate the concept, replace/wire these up however makes sense for your project. */}
          <div className="flex justify-end px-2 py-2 space-x-2 flex-nowrap sm:px-3">
            <Listbox
              as="div"
              value={assigned}
              onChange={setAssigned}
              className="flex-shrink-0"
            >
              {({ open }) => (
                <>
                  <Listbox.Label className="sr-only"> Assign </Listbox.Label>
                  <div className="relative">
                    <Listbox.Button className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 rounded-full whitespace-nowrap bg-gray-50 hover:bg-gray-100 sm:px-3">
                      {assigned.value === null ? (
                        <UserCircleIcon
                          className="flex-shrink-0 w-5 h-5 text-gray-300 sm:-ml-1"
                          aria-hidden="true"
                        />
                      ) : (
                        <img
                          src={assigned.avatar}
                          alt=""
                          className="flex-shrink-0 w-5 h-5 rounded-full"
                        />
                      )}

                      <span
                        className={classNames(
                          assigned.value === null ? "" : "text-gray-900",
                          "hidden truncate sm:ml-2 sm:block"
                        )}
                      >
                        {assigned.value === null ? "Assign" : assigned.name}
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute right-0 z-10 py-3 mt-1 overflow-auto text-base bg-white rounded-lg shadow max-h-56 w-52 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {assignees.map((assignee) => (
                          <Listbox.Option
                            key={assignee.value}
                            className={({ active }) =>
                              classNames(
                                active ? "bg-gray-100" : "bg-white",
                                "relative cursor-default select-none py-2 px-3"
                              )
                            }
                            value={assignee}
                          >
                            <div className="flex items-center">
                              {assignee.avatar ? (
                                <img
                                  src={assignee.avatar}
                                  alt=""
                                  className="flex-shrink-0 w-5 h-5 rounded-full"
                                />
                              ) : (
                                <UserCircleIcon
                                  className="flex-shrink-0 w-5 h-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              )}

                              <span className="block ml-3 font-medium truncate">
                                {assignee.name}
                              </span>
                            </div>
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>

            <Listbox
              as="div"
              value={labelled}
              onChange={setLabelled}
              className="flex-shrink-0"
            >
              {({ open }) => (
                <>
                  <Listbox.Label className="sr-only">
                    {" "}
                    Add a label{" "}
                  </Listbox.Label>
                  <div className="relative">
                    <Listbox.Button className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 rounded-full whitespace-nowrap bg-gray-50 hover:bg-gray-100 sm:px-3">
                      <TagIcon
                        className={classNames(
                          labelled.value === null
                            ? "text-gray-300"
                            : "text-gray-500",
                          "h-5 w-5 flex-shrink-0 sm:-ml-1"
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className={classNames(
                          labelled.value === null ? "" : "text-gray-900",
                          "hidden truncate sm:ml-2 sm:block"
                        )}
                      >
                        {labelled.value === null ? "Label" : labelled.name}
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute right-0 z-10 py-3 mt-1 overflow-auto text-base bg-white rounded-lg shadow max-h-56 w-52 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {labels.map((label) => (
                          <Listbox.Option
                            key={label.value}
                            className={({ active }) =>
                              classNames(
                                active ? "bg-gray-100" : "bg-white",
                                "relative cursor-default select-none py-2 px-3"
                              )
                            }
                            value={label}
                          >
                            <div className="flex items-center">
                              <span className="block font-medium truncate">
                                {label.name}
                              </span>
                            </div>
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>

            <Listbox
              as="div"
              value={dated}
              onChange={setDated}
              className="flex-shrink-0"
            >
              {({ open }) => (
                <>
                  <Listbox.Label className="sr-only">
                    {" "}
                    Add a due date{" "}
                  </Listbox.Label>
                  <div className="relative">
                    <Listbox.Button className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 rounded-full whitespace-nowrap bg-gray-50 hover:bg-gray-100 sm:px-3">
                      <CalendarIcon
                        className={classNames(
                          dated.value === null
                            ? "text-gray-300"
                            : "text-gray-500",
                          "h-5 w-5 flex-shrink-0 sm:-ml-1"
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className={classNames(
                          dated.value === null ? "" : "text-gray-900",
                          "hidden truncate sm:ml-2 sm:block"
                        )}
                      >
                        {dated.value === null ? "Due date" : dated.name}
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute right-0 z-10 py-3 mt-1 overflow-auto text-base bg-white rounded-lg shadow max-h-56 w-52 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {dueDates.map((dueDate) => (
                          <Listbox.Option
                            key={dueDate.value}
                            className={({ active }) =>
                              classNames(
                                active ? "bg-gray-100" : "bg-white",
                                "relative cursor-default select-none py-2 px-3"
                              )
                            }
                            value={dueDate}
                          >
                            <div className="flex items-center">
                              <span className="block font-medium truncate">
                                {dueDate.name}
                              </span>
                            </div>
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          </div>
          <div className="flex items-center justify-between px-2 py-2 space-x-3 border-t border-gray-200 sm:px-3">
            <div className="flex">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 -my-2 -ml-2 text-left text-gray-400 rounded-full group"
              >
                <PaperClipIcon
                  className="w-5 h-5 mr-2 -ml-1 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                <span className="text-sm italic text-gray-500 group-hover:text-gray-600">
                  Attach a file
                </span>
              </button>
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
