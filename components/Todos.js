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
  doc,
  updateDoc,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// Filter Data
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
  //   const [dated, setDated] = useState(dueDates[0]);
  // Track todos
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  // Create new todo
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [assignTo, setAssignTo] = useState(assignees[0]);

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

  // Grab all todos from the current room
  useEffect(() => {
    let ref = collection(db, "rooms", currentRoom.id, "todos");

    const unsub = onSnapshot(ref, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      setTodos(results);
    });

    return () => unsub();
  }, [currentRoom]);

  // Filter todos by assignee
  useEffect(() => {
    if (assigned.uid !== 1) {
      let filteredTodos = todos.filter(
        (todo) => todo.assignTo === assigned.uid
      );
      setFilteredTodos(filteredTodos);
    } else {
      setFilteredTodos([]);
    }
  }, [assigned, todos]);

  const addTodo = (e) => {
    e.preventDefault();

    const roomTodoRef = collection(db, "rooms", currentRoom.id, "todos");
    try {
      addDoc(roomTodoRef, {
        title: todoTitle,
        desc: todoDescription,
        // assignTo: assignTo,
        assignTo: assignTo.uid,
        done: false,
        createdAt: serverTimestamp(),
      }).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setTodoTitle("");
    setTodoDescription("");
    setAssignTo(assignees[0]);
  };

  const markTodoDone = (todo) => {
    let isChecked = todo.done;
    console.log(isChecked);
    try {
      const todoDocRef = doc(db, "rooms", currentRoom.id, "todos", todo.id);
      updateDoc(todoDocRef, { done: !isChecked });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  return (
    <>
      {/* Filters */}
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
          {/* <Listbox
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
          </Listbox> */}
        </div>
      </div>

      {/* Todos */}
      <div className="mt-16 ">
        {todos && todos.length > 0 ? (
          <fieldset>
            <legend className="sr-only">Todos</legend>
            {filteredTodos.length > 0
              ? filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex p-2 mb-2 border border-gray-100 rounded-md hover:bg-gray-50"
                  >
                    <input
                      aria-describedby="todo-description"
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => markTodoDone(todo)}
                      className="w-4 h-4 m-1 text-gray-600 border-gray-300 rounded focus:ring-gray-600"
                    />
                    <div className="ml-2">
                      <h5>{todo.title}</h5>
                      <p>{todo.desc}</p>
                      <p>{todo.assignTo}</p>
                    </div>
                  </div>
                ))
              : todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex p-2 mb-2 border border-gray-100 rounded-md hover:bg-gray-50"
                  >
                    <input
                      aria-describedby="todo-description"
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => markTodoDone(todo)}
                      className="w-4 h-4 m-1 text-gray-600 border-gray-300 rounded focus:ring-gray-600"
                    />
                    <div className="ml-2">
                      <h5>{todo.title}</h5>
                      <p>{todo.desc}</p>
                      <p>{todo.assignTo}</p>
                    </div>
                  </div>
                ))}
          </fieldset>
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
              Task Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
              className="block w-full border-0 pt-2.5 text-lg font-medium placeholder:text-gray-400 focus:ring-0"
              placeholder="Task Title"
            />
            <label htmlFor="description" className="sr-only">
              Description
            </label>
            <textarea
              rows={4}
              name="description"
              id="description"
              value={todoDescription}
              onChange={(e) => setTodoDescription(e.target.value)}
              className="block w-full py-0 text-gray-900 border-0 resize-none placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Task description..."
              // defaultValue={""}
            />
            {/* Assign to */}
            <div className="absolute m-2">
              <Listbox
                as="div"
                value={assignTo}
                onChange={setAssignTo}
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
                        {assignTo.email === null ? (
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
                            assignTo.email === null ? "" : "text-gray-900",
                            "hidden truncate sm:ml-2 sm:block"
                          )}
                        >
                          {assignTo.email === null
                            ? "Assign to"
                            : assignTo.displayName}
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
