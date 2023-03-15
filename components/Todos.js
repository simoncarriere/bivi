import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import Image from "next/image";
// Icons
import {
  CheckIcon,
  ChevronUpDownIcon,
  CalendarIcon,
  PaperClipIcon,
  TagIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
// Hooks
import { useSubcollection } from "../hooks/useSubcollection";
import { useAuthContext } from "../hooks/useAuthContext";
// Firebase
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const assignees = [{ displayName: "Unassigned", email: null, uid: 1 }];
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

const Todos = () => {
  const { user, currentRoom } = useAuthContext();
  // Track members in the room
  const [members, setMembers] = useState([]);
  // Filter todos by
  const [assigned, setAssigned] = useState(assignees[0]);
  //   const [labelled, setLabelled] = useState(labels[0]);
  const [dated, setDated] = useState(dueDates[0]);
  // Create new todo
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState(assignees[0]);

  // POPULATE ROOM MEMBERS
  useEffect(() => {
    const ref = collection(db, "rooms", currentRoom.id, "members");
    const unsub = onSnapshot(ref, (snapshot) => {
      let results = [...assignees];
      snapshot.docs.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      setMembers(results);
    });
    return () => unsub();
  }, [currentRoom, user.email]);

  // Grab all the todos from the current room
  const { documents: todos } = useSubcollection(
    "rooms",
    currentRoom.id,
    "todos"
  );

  const addTodo = (e) => {
    e.preventDefault();

    const roomTodoRef = collection(db, "rooms", currentRoom.id, "todos");
    try {
      addDoc(roomTodoRef, {
        title: todoTitle,
        desc: todoDescription,
        // assignedTo: assignedTo,
        assignedTo: assignedTo.uid,
        createdAt: serverTimestamp(),
      }).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setTodoTitle("");
    setTodoDescription("");
    setAssignedTo(assignees[0]);
  };

  return (
    <>
      <div className="absolute">
        <div className="flex justify-end py-2 space-x-1 flex-nowrap ">
          {/* Filter Todos by assignee */}
          <Listbox
            as="div"
            value={assigned}
            onChange={setAssigned}
            className="flex-shrink-0"
          >
            {({ open }) => (
              <>
                <Listbox.Label className="sr-only"> Assigned to </Listbox.Label>

                <div className="relative">
                  <Listbox.Button className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 rounded-full whitespace-nowrap bg-gray-50 hover:bg-gray-100 sm:px-3">
                    {assigned.email === null ? (
                      <UserCircleIcon
                        className="flex-shrink-0 w-5 h-5 text-gray-300 sm:-ml-1"
                        aria-hidden="true"
                      />
                    ) : (
                      <UserCircleIcon
                        className="flex-shrink-0 w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                      // <Image
                      //   src={assigned.avatar}
                      //   alt=""
                      //   className="flex-shrink-0 w-5 h-5 rounded-full"
                      // />
                    )}

                    <span
                      className={classNames(
                        assigned.email === null ? "" : "text-gray-900",
                        "hidden truncate sm:ml-2 sm:block"
                      )}
                    >
                      {assigned.email === null
                        ? "Assigned to"
                        : assigned.displayName}
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute left-0 z-10 py-3 mt-1 overflow-auto text-base bg-white rounded-lg shadow max-h-56 w-52 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {members.map((assignee) => (
                        <Listbox.Option
                          key={assignee.uid}
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
                              <div className="flex-shrink-0 w-5 h-5 bg-gray-300 rounded-full" />
                            ) : (
                              // <Image
                              //   src={assignee.avatar}
                              //   alt=""
                              //   className="flex-shrink-0 w-5 h-5 rounded-full"
                              // />
                              <UserCircleIcon
                                className="flex-shrink-0 w-5 h-5 text-gray-400"
                                aria-hidden="true"
                              />
                            )}

                            <span className="block ml-3 font-medium truncate">
                              {assignee.displayName}
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
          {/* Filter by Tag */}
          {/* <Listbox
            as="div"
            value={labelled}
            onChange={setLabelled}
            className="flex-shrink-0"
          >
            {({ open }) => (
              <>
                <Listbox.Label className="sr-only"> Add a label </Listbox.Label>
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
                      {labelled.value === null ? "Labelled" : labelled.name}
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
          </Listbox> */}
          {/* Filter by due date */}
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
      </div>

      {/* Todos */}
      <div className="mt-16">
        {todos && todos.length > 0 ? (
          todos.map((todo) => (
            <div key={todo.id} className="">
              <div>
                <p>{todo.title}</p>
                <p>{todo.desc}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="mt-4 text-center text-gray-400">No tasks yet</p>
        )}
      </div>

      {/* Add todo */}
      <div className="fixed bottom-0 pb-4 bg-white -right-1 w-96">
        <form
          onSubmit={addTodo}
          className="relative items-center px-4 mx-auto mt-2"
        >
          <div className="overflow-hidden border border-gray-100 rounded-sm shadow-sm pb-14 focus-within:border-gray-200 focus-within:ring-1 focus-within:ring-gray-200">
            <label htmlFor="title" className="sr-only">
              Todo Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
              className="block w-full border-0 pt-2.5 text-lg font-medium placeholder:text-gray-400 focus:ring-0"
              placeholder="Todo Title"
            />
            <label htmlFor="description" className="sr-only">
              Description
            </label>
            <textarea
              required
              rows={4}
              name="description"
              id="description"
              value={todoDescription}
              onChange={(e) => setTodoDescription(e.target.value)}
              className="block w-full py-0 text-gray-900 border-0 resize-none placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Todo description..."
              // defaultValue={""}
            />
            {/* Assign to */}
            <div className="absolute m-2">
              <Listbox
                as="div"
                value={assignedTo}
                onChange={setAssignedTo}
                className="flex-shrink-0"
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className="sr-only">
                      {" "}
                      Assigned to{" "}
                    </Listbox.Label>

                    <div className="relative">
                      <Listbox.Button className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 rounded-full whitespace-nowrap bg-gray-50 hover:bg-gray-100 sm:px-3">
                        {assignedTo.email === null ? (
                          <UserCircleIcon
                            className="flex-shrink-0 w-5 h-5 text-gray-300 sm:-ml-1"
                            aria-hidden="true"
                          />
                        ) : (
                          <UserCircleIcon
                            className="flex-shrink-0 w-5 h-5 text-gray-400"
                            aria-hidden="true"
                          />
                          // <Image
                          //   src={assigned.avatar}
                          //   alt=""
                          //   className="flex-shrink-0 w-5 h-5 rounded-full"
                          // />
                        )}

                        <span
                          className={classNames(
                            assignedTo.email === null ? "" : "text-gray-900",
                            "hidden truncate sm:ml-2 sm:block"
                          )}
                        >
                          {assignedTo.email === null
                            ? "Assign to"
                            : assignedTo.displayName}
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 py-3 mt-1 overflow-auto text-base bg-white rounded-lg shadow bottom-10 max-h-56 w-52 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {members.map((assignee) => (
                            <Listbox.Option
                              key={assignee.uid}
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
                                  <div className="flex-shrink-0 w-5 h-5 bg-gray-300 rounded-full" />
                                ) : (
                                  // <Image
                                  //   src={assignee.avatar}
                                  //   alt=""
                                  //   className="flex-shrink-0 w-5 h-5 rounded-full"
                                  // />
                                  <UserCircleIcon
                                    className="flex-shrink-0 w-5 h-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                )}

                                <span className="block ml-3 font-medium truncate">
                                  {assignee.displayName}
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
          </div>

          <button type="submit" className="btn-primary">
            Create Todo
          </button>
        </form>
      </div>
    </>
  );
};

export default Todos;
