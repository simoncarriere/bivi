import { Fragment, useState, useContext, useEffect } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
// Firebase
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";
// Context
import { RoomContext } from "../context/RoomContext";
// Icons
import {
  CheckIcon,
  ChevronUpDownIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const FirstRoomModal = ({
  handleRoomsModal,
  showRoomsModal,
  authUser,
  currentRoom,
  setCurrentRoom,
}) => {
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const { documents: rooms } = useCollection("rooms", [
    "members",
    "array-contains",
    authUser.uid,
  ]);

  const submitRoom = (e) => {
    e.preventDefault();
    const roomRef = collection(db, "rooms");
    try {
      addDoc(roomRef, {
        name: newRoomName,
        desc: newRoomDescription,
        admin: authUser.uid,
        createdAt: serverTimestamp(),
        members: [authUser.uid],
      });
      setNewRoomName("");
      setNewRoomDescription("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <Transition.Root show={showRoomsModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        // initialFocus={roomNameRef}
        onClose={handleRoomsModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-800"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-800"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-500"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="my-8 text-center sm:mt-5">
                    <Dialog.Title
                      as="h1"
                      className="text-2xl font-medium leading-6 text-gray-900"
                    >
                      Manage Your Rooms
                    </Dialog.Title>
                    <div className="mt-4">
                      <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Eius aliquam laudantium explicabo pariatur iste
                        dolorem animi vitae error totam.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SELECT ROOM*/}
                <div className="pb-6 mb-6 border-b border-gray-200">
                  {rooms && rooms.length > 0 && (
                    <Listbox value={currentRoom} onChange={setCurrentRoom}>
                      {({ open }) => (
                        <>
                          <Listbox.Label>Your Rooms</Listbox.Label>
                          <div className="relative mt-3">
                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                              <span className="inline-flex w-full truncate jus">
                                <span className="truncate">
                                  {currentRoom.name}
                                </span>
                                {currentRoom.admin === authUser.uid ? (
                                  <span className="ml-2 tag-primary">
                                    Owner
                                  </span>
                                ) : (
                                  <span className="ml-2 tag-secondary">
                                    Member
                                  </span>
                                )}
                              </span>
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <ChevronUpDownIcon
                                  className="w-5 h-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>

                            <Transition
                              show={open}
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {rooms.map((room) => (
                                  <Listbox.Option
                                    key={room.name}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? "bg-blue-100 "
                                          : "text-gray-900",
                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                      )
                                    }
                                    value={room}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <div className="flex">
                                          <span
                                            className={classNames(
                                              selected
                                                ? "font-semibold"
                                                : "font-normal",
                                              "truncate"
                                            )}
                                          >
                                            {room.name}
                                          </span>
                                          {room.admin === authUser.uid ? (
                                            <span className="ml-2 tag-primary">
                                              Owner
                                            </span>
                                          ) : (
                                            <span className="ml-2 tag-secondary">
                                              Member
                                            </span>
                                          )}
                                        </div>

                                        {selected ? (
                                          <span
                                            className={classNames(
                                              active
                                                ? "text-white"
                                                : "text-blue-600",
                                              "absolute inset-y-0 right-0 flex items-center pr-4"
                                            )}
                                          >
                                            <CheckIcon
                                              className="w-4 h-4"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                          <div className="mt-6 bg-gray-50 sm:rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                              <h3 className="font-medium text-gray-900 ">
                                Delete Current Room
                              </h3>
                              <div className="flex items-center justify-between">
                                <div className="w-64 my-3 text-sm text-gray-400 ">
                                  <p>
                                    Are you sure you want to delete{" "}
                                    {currentRoom.name}? This action cannot be
                                    undone
                                  </p>
                                </div>
                                <div>
                                  <button
                                    type="button"
                                    className="flex items-center gap-2 btn-delete"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                    Delete Room
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </Listbox>
                  )}
                </div>

                {/* Create Room */}
                <form onSubmit={submitRoom} className="flex flex-col gap-3">
                  <label>Create New Room</label>
                  <div className="flex flex-col gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <div>
                      {/* <label htmlFor="room">Room Name</label> */}
                      <input
                        onChange={(e) => setNewRoomName(e.target.value)}
                        value={newRoomName}
                        placeholder="Room Name"
                        name="room-name"
                        id="room-name"
                        // ref={roomNameRef}
                        required
                      />
                    </div>
                    <div>
                      {/* <label htmlFor="room-desc">Room Description</label> */}
                      <input
                        onChange={(e) => setNewRoomDescription(e.target.value)}
                        value={newRoomDescription}
                        placeholder="Room Description"
                        name="room-desc"
                        id="room-desc"
                        required
                      />
                    </div>
                  </div>
                  <div className="gap-2 sm:flex">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleRoomsModal}
                    >
                      Done
                    </button>
                    <button type="submit" className="btn-primary">
                      Create Room
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default FirstRoomModal;
