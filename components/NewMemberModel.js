import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
// Context
import { useAuthContext } from "../hooks/useAuthContext";
// Icons
import { PlusIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import {
  EllipsisVerticalIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/20/solid";
// Firebase
import { db } from "../lib/firebase";
import {
  collection,
  doc,
  query,
  setDoc,
  onSnapshot,
  addDoc,
  getDocs,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
// Components
import MemberImage from "./MemberImage";

const NewMemberModal = () => {
  const { user, currentRoom } = useAuthContext();
  // Modal State
  const [showMembersModal, setShowMembersModal] = useState(false);
  // Input Ref
  const memberEmailRef = useRef(null);
  // Input State
  const [newMember, setNewMember] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailInvite, setEmailInvite] = useState("");
  // Members State
  const [members, setMembers] = useState([]);
  // Handle Modal
  const handleMembersModal = () => {
    setShowMembersModal(false);
  };

  // POPULATE ROOM MEMBERS
  useEffect(() => {
    const ref = collection(db, "rooms", currentRoom.id, "members");
    const unsub = onSnapshot(ref, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        if (doc.data().email !== user.email) {
          results.push({ ...doc.data(), id: doc.id });
        }
      });
      setMembers(results);
    });
    return () => unsub();
  }, [currentRoom, user.email]);

  const submitMember = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setEmailInvite("");

    // Step 1 - Check if user is already in room || is current user  -> (user.email !== newMember)
    // Step 2 - Check if the user has an account on the platform
    // Step 3 - If they do, add them to the room
    // Step 4 - If not, send them an invite

    // Check if email is current user -> Check if user exists on platform -> if not, send invite, refactor into only members list -> User already in room
    if (user.email !== newMember) {
      const q = query(collection(db, "users"), where("email", "==", newMember));
      const querySnapshot = await getDocs(q);
      // CHECK IF USER EXISTS ON PLATFORM
      if (!querySnapshot.empty) {
        // GRAB THE NEW MEMBER'S ID
        let newMemberRef = querySnapshot.docs[0];
        let newMemberId = querySnapshot.docs[0].id;

        let newMemberData = newMemberRef.data();

        const roomRef = doc(db, "rooms", currentRoom.id);
        const roomMembersRef = collection(
          db,
          "rooms",
          currentRoom.id,
          "members"
        );
        try {
          // Add the new member to the rooms member's subcollection
          setDoc(doc(roomMembersRef, newMemberId), {
            ...newMemberData,
            online: false,
            isEditor: false,
          });
          // Denormalize the added User Id to the room members
          updateDoc(roomRef, {
            membersId: arrayUnion(newMemberId),
          });
          setSuccessMessage(`User ${newMemberData.email} added to room`);
          setNewMember("");
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      } else {
        // User doesn't have an account, send invite
        setEmailInvite(
          // `mailto:${newMember}?subject=${user.email} invites you to join them at Bivi!&body=You have been invited to join the room ${currentRoom.name} on Bivi! Join them today https://bivi.io/ !`
          `mailto:${newMember}?subject= Hey! join me in Bivi!&body=You have been invited to join the room ${currentRoom.name} on Bivi! Sign up here https://bivi.io/ !`
        );
      }
    } else {
      // Currently Logged in user -> TURN INTO USER IS ALREADY IN ROOM
      setNewMember("");
      setErrorMessage("You can't add yourself");
    }
  };

  const deleteUser = async (deleteMemberId) => {
    const roomRef = doc(db, "rooms", currentRoom.id);
    const membersRef = doc(
      db,
      "rooms",
      currentRoom.id,
      "members",
      deleteMemberId
    );

    await updateDoc(roomRef, {
      membersId: arrayRemove(deleteMemberId),
    }).then(() => {
      try {
        deleteDoc(membersRef);
        console.log("Member successfully deleted!");
      } catch {
        console.log("Member couldn't be deleted!");
      }
    });
  };

  return (
    <>
      <div
        className="w-12 h-12 p-4 text-gray-500 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50"
        alt="Your Company"
        onClick={() => setShowMembersModal(true)}
      >
        <PlusIcon />
      </div>
      {showMembersModal && (
        <Transition.Root show={showMembersModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={memberEmailRef}
            onClose={handleMembersModal}
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
                    <div className="my-8 text-center sm:mt-5">
                      <Dialog.Title
                        as="h1"
                        className="text-2xl font-medium leading-6 text-gray-900"
                      >
                        Manage Your Team
                      </Dialog.Title>
                      <Dialog.Description>
                        <p className="max-w-sm mx-auto mt-4 text-sm text-gray-400">
                          Give your team access to this room and start
                          collaborating in real time
                        </p>
                      </Dialog.Description>
                    </div>

                    {/* Add member to room */}
                    <form
                      onSubmit={submitMember}
                      className="flex flex-col gap-2 "
                    >
                      <div>
                        <label htmlFor="room" className="mb-2">
                          Invite New Member
                        </label>
                        <input
                          onChange={(e) => setNewMember(e.target.value)}
                          value={newMember}
                          placeholder="Member email"
                          name="member"
                          type="email"
                          ref={memberEmailRef}
                          className="py-4 text-sm bg-gray-100 border-none rounded-sm"
                          required
                        />
                      </div>
                      {errorMessage && <p className="error">{errorMessage}</p>}
                      {emailInvite && (
                        <a
                          className="w-full p-4 text-sm text-gray-800 border border-gray-200 rounded-sm hover:bg-gray-50"
                          href={emailInvite}
                        >
                          <>
                            {/* <h2 className="pb-1 mb-4 text-lg border-b border-gray-200">
                              Uh-oh!
                            </h2> */}
                            <div className="flex">
                              <PaperAirplaneIcon className="w-5 h-5 mr-2 text-gray-400" />
                              {newMember} doesn&apos;t have an account at Bivi.
                              Send them an invite!
                            </div>
                          </>
                        </a>
                      )}
                      {successMessage && (
                        <p className="success">{successMessage}</p>
                      )}

                      <div className="gap-2 sm:flex">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={handleMembersModal}
                        >
                          Done
                        </button>
                        <button type="submit" className="btn-primary">
                          Add Member
                        </button>
                      </div>
                    </form>

                    {/* Your Team */}
                    {members && members.length > 0 && (
                      <div className="pt-6 mt-6 border-t border-gray-200">
                        <h4>Members</h4>
                        <ul
                          role="list"
                          className="flex-1 divide-y divide-gray-200"
                        >
                          {members.map((person) => (
                            <li key={person.uid}>
                              <div className="relative flex items-center w-full py-4 group">
                                <div className="flex-1 block">
                                  <div
                                    className="absolute inset-0 "
                                    aria-hidden="true"
                                  />
                                  <div className="relative flex items-center flex-1 min-w-0">
                                    <MemberImage member={person} />
                                    <div className="ml-4 truncate">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {person.displayName}
                                      </p>
                                      <p className="text-xs text-gray-400 truncate ">
                                        {person.email}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <Menu
                                  as="div"
                                  className="relative flex-shrink-0 inline-block ml-2 text-left"
                                >
                                  <Menu.Button className="relative inline-flex items-center justify-center w-8 h-8 bg-white rounded-full group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                                    <span className="sr-only">
                                      Open options menu
                                    </span>
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
                                            onClick={() =>
                                              deleteUser(person.uid)
                                            }
                                            className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
                                          >
                                            Remove from team
                                          </div>
                                        </Menu.Item>
                                      </div>
                                    </Menu.Items>
                                  </Transition>
                                </Menu>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </>
  );
};

export default NewMemberModal;

// let x = currentRoom.members.filter((member) => member !== newMember);
// if (currentRoom.members.includes(newMember)) {
//   setErrorMessage("User already in room");
// } else {
// }
