import { useState, useEffect } from "react";
// Hooks
// import { useCollection } from "../hooks/useCollection";
// Firebase
import { db } from "../lib/firebase";
import {
  doc,
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const Inbox = ({ authUser, currentRoom }) => {
  const [messages, setMessages] = useState();

  // Current Room Message Listener
  useEffect(() => {
    if (currentRoom !== undefined) {
      let ref = collection(db, "rooms", currentRoom.id, "messages");

      try {
        const unsub = onSnapshot(ref, (snapshot) => {
          let results = [];
          snapshot.docs.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
          });
          setMessages(results);
        });
        return () => unsub();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }, [currentRoom]);

  //   const submitMember = (e) => {
  //     e.preventDefault();
  //     const roomRef = doc(db, "spaces", currentRoom);
  //     try {
  //       updateDoc(roomRef, {
  //         members: arrayUnion(newMember),
  //       });
  //       setNewMember("");
  //     } catch (e) {
  //       console.error("Error adding document: ", e);
  //     }
  //   };

  //   const submitMessage = (e) => {
  //     e.preventDefault();
  //     const roomRef = collection(db, "spaces", currentRoom, "messages");
  //     try {
  //       addDoc(roomRef, {
  //         message: newMessage,
  //         sentBy: authUser.email,
  //         sentById: authUser.uid,
  //         createdAt: serverTimestamp(),
  //       });
  //       setNewMessage("");
  //     } catch (e) {
  //       console.error("Error adding document: ", e);
  //     }
  //   };

  return (
    <div className="relative flex flex-col h-full gap-6 p-4 overflow-y-auto border-r border-gray-200 bg-slate-50 w-80">
      {!currentRoom && (
        <p className="mt-0 error">
          No Room Selected: Create or request to join a room
        </p>
      )}
      <h1>Inbox</h1>
      {messages &&
        messages.map((message) => (
          <div key={message.id}>{message.message}</div>
        ))}

      {/* Add Member */}
      {/* <div>
        <h2 className="mb-2">Room Members</h2>
        <form onSubmit={submitMember} className="flex gap-2">
          <input
            onChange={(e) => setNewMember(e.target.value)}
            value={newMember}
            placeholder="Paste in user id"
            name="memberId"
            id="memberId"
            // className="block w-full rounded-md shadow-sm bg-slate-100 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button className="w-40 text-xs rounded text-lime-700 bg-lime-200">
            Add Member
          </button>
        </form>
      </div> */}
    </div>
  );
};

export default Inbox;

//   const { documents: rooms } = useCollection("rooms", [
//     "members",
//     "array-contains",
//     authUser.uid,
//   ]);
//   const { documents: messages } = useCollection("messages", [
//     "room",
//     "==",
//     currentRoom,
//   ]);
