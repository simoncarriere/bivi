import { useState, useEffect } from "react";
import Image from "next/image";
// Context
import { useAuthContext } from "../hooks/useAuthContext";
// Icons
import { BellIcon } from "@heroicons/react/24/outline";
// Firebase
import { db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
// Components
import RoomModal from "./RoomModal";
import NewMemberModal from "./NewMemberModel";
import UserDropdown from "./UserDropdown";
import MemberImage from "./MemberImage";

const Sidebar = () => {
  const [members, setMembers] = useState([]);

  const { user, currentRoom } = useAuthContext();

  // POPULATE ROOM MEMBERS
  useEffect(() => {
    const ref = collection(db, "rooms", currentRoom.id, "members");
    const unsub = onSnapshot(ref, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        // Check if the user is the current user
        if (doc.data().email !== user.email) {
          results.push({ ...doc.data(), id: doc.id });
        }
      });
      setMembers(results);
    });
    return () => unsub();
  }, [currentRoom, user.email]);

  return (
    <>
      <div className="z-10 flex flex-col w-20 h-screen">
        <div className="flex flex-col flex-1 min-h-0 border-r">
          <div className="flex-1">
            <div className="flex flex-col items-center justify-center gap-3 pb-4 m-4 border-b border-slate-200">
              <RoomModal />
              <div
                className="w-full transition-all ease-in-out  hover:scale-110 duration-400 cursor-pointer p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 "
                alt="Your Notifications"
              >
                <BellIcon />
              </div>
            </div>
            <nav
              aria-label="Sidebar"
              className="flex flex-col items-center gap-3"
            >
              {members &&
                members.map((member) => (
                  <div
                    className="relative flex transition-all ease-in-out group hover:scale-110 duration-400"
                    key={member.id}
                  >
                    <MemberImage member={member} />
                    <span className="z-10 absolute top-4 left-14 scale-0 opacity-0 rounded transition-all ease-in-out duration-400 bg-slate-900/80 px-2 py-1 text-[10px] text-slate-100 group-hover:scale-100 group-hover:opacity-100">
                      {member.displayName}
                    </span>
                  </div>
                ))}
              {currentRoom.admin === user.uid && <NewMemberModal />}
            </nav>
          </div>
          <div className="mx-auto mb-5 ">
            <UserDropdown user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
