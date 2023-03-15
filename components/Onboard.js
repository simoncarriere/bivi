"use client";
import { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
//Context
import { useAuthContext } from "../hooks/useAuthContext";
// Hooks
import { useCollection } from "../hooks/useCollection";
import { useDocument } from "../hooks/useDocument";
// Firebase
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  setDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";

const Onboard = () => {
  const [showModal, setShowModal] = useState(true);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const { user, dispatch } = useAuthContext();
  // Input Ref
  const roomRef = useRef(null);
  // Used just to grab the current user's display name
  const { document: currentUser } = useDocument("users", user.uid);

  // Used to test if the user has any room and conditionally render the onboarding
  const { documents: rooms } = useCollection("rooms", [
    "membersId",
    "array-contains",
    user.uid,
  ]);

  // TODO : This is a temporary fix to set the current room to the first room in the list
  // Bugs:
  // - Flash renders the onboarding component before the rooms are fetched
  // Test :
  // - If a user gets invited to a room and the user has no room, the onboarding component will not be rendered
  useEffect(() => {
    if (rooms !== null && rooms.length > 0) {
      dispatch({ type: "SET_CURRENT_ROOM", payload: rooms[0] });
    }
  }, [rooms]);

  const submitRoom = (e) => {
    e.preventDefault();
    const roomRef = collection(db, "rooms");

    try {
      // Create a new room
      addDoc(roomRef, {
        name: newRoomName,
        desc: newRoomDescription,
        admin: user.uid,
        createdAt: serverTimestamp(),
        membersId: [user.uid],
      }).then((docRef) => {
        // Add the user to the room's members succollection
        const roomMembersRef = collection(db, "rooms", docRef.id, "members");
        setDoc(doc(roomMembersRef, user.uid), {
          displayName: currentUser.displayName,
          email: user.email,
          uid: user.uid,
          online: true,
          isEditor: true,
        }).catch((error) => {
          console.error("Error adding user document: ", error);
        });
      });
      setNewRoomName("");
      setNewRoomDescription("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    currentUser && (
      <Transition.Root show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={roomRef}
          onClose={() => setShowModal(true)}
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
            <div className="fixed inset-0 transition-opacity bg-gray-800/60" />
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
                <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg">
                  <form
                    onSubmit={submitRoom}
                    className="flex flex-col gap-2 p-6"
                  >
                    <Dialog.Title as="h1" className="text-2xl">
                      Hey {currentUser.displayName}! Create your first room.
                    </Dialog.Title>

                    <p className="px-4 pb-4">
                      You'll be able to invite your mates in a bit!
                    </p>
                    {/* <h1>Step 1 - Create your room</h1> */}
                    <div className="flex flex-col gap-2">
                      {/* <label htmlFor="room">Room Name</label> */}
                      <input
                        onChange={(e) => setNewRoomName(e.target.value)}
                        value={newRoomName}
                        placeholder="Room Name"
                        name="room-name"
                        id="room-name"
                        ref={roomRef}
                        required
                        className="py-4 text-sm bg-gray-100 border-none rounded-sm"
                      />

                      {/* <label htmlFor="room-desc">Room Description</label> */}
                      <input
                        onChange={(e) => setNewRoomDescription(e.target.value)}
                        value={newRoomDescription}
                        placeholder="Room Description"
                        name="room-desc"
                        id="room-desc"
                        required
                        className="py-4 text-sm bg-gray-100 border-none rounded-sm"
                      />
                    </div>
                    <div className="gap-2 sm:flex">
                      {/* <button type="button" className="btn-secondary">
                        Done
                      </button> */}
                      <button type="submit" className="btn-primary">
                        Done and dusted!
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    )
  );
};

export default Onboard;
