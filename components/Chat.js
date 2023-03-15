import { useState, useEffect } from "react";
// Hooks
import { useAuthContext } from "../hooks/useAuthContext";
import { useDocument } from "../hooks/useDocument";
// FIrebase
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  limit,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
// Libraries
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
TimeAgo.addDefaultLocale(en);
import ReactTimeAgo from "react-time-ago";

const Chat = () => {
  const { user, currentRoom } = useAuthContext();
  // Message Input State
  const [newMessage, setNewMessage] = useState("");
  // Local messages state
  const [messages, setMessages] = useState();

  // Grab the current user's document (denormalized)
  const { document: currentUser } = useDocument("users", user.uid);

  // Grab the messages from the current room
  useEffect(() => {
    let ref = query(
      collection(db, "rooms", currentRoom.id, "messages"),
      orderBy("sentAt", "desc"),
      limit(30)
    );

    const unsub = onSnapshot(ref, (snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      setMessages(results);
    });

    return () => unsub();
  }, [currentRoom]);

  const addMessage = (e) => {
    e.preventDefault();

    const roomInboxRef = collection(db, "rooms", currentRoom.id, "messages");
    try {
      addDoc(roomInboxRef, {
        message: newMessage,
        sentBy: currentUser.displayName,
        sender: user.uid,
        sentAt: serverTimestamp(),
      }).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setNewMessage("");
  };

  return (
    <>
      <ul role="list">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <li key={message.id} className="py-2">
              {message.sentAt ? (
                <div className="flex space-x-2">
                  <div className="flex-shrink-0 pt-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="p-1 text-xs text-gray-400 truncate rounded-md ">
                      {currentUser.sender} - {``}
                      <ReactTimeAgo
                        date={message.sentAt.toDate()}
                        locale="en-US"
                      />
                    </p>
                    <p className="min-w-0 px-3 py-2 text-gray-700 rounded-md bg-gray-50">
                      {message.message}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-8 bg-white animate-pulse" />
              )}
            </li>
          ))
        ) : (
          <p className="pt-4 text-center text-gray-400">No messages yet</p>
        )}
      </ul>
      <div className="fixed bottom-0 pb-4 bg-white -right-1 w-96">
        <form
          onSubmit={addMessage}
          className="flex items-center px-4 mx-auto mt-2 "
        >
          <label htmlFor="email-input" className="sr-only">
            Email address
          </label>
          <input
            name="text"
            placeholder="Your message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            required
            type="text"
            className="block px-5 py-3 text-gray-900 bg-gray-100 border-0 rounded-md shadow-sm pr-14 ring-0 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-200 sm:text-sm sm:leading-6"

            // className="flex-auto min-w-0 px-5 py-4 border-gray-100 rounded-md shadow-sm w-96 focus:ring-orange-500 outline-orange-500 sm:text-sm sm:leading-6"
          />

          <button
            type="submit"
            className="absolute flex items-center px-4 m-2 text-xs font-medium text-gray-600 bg-white rounded-md inset-y-4 top-2 right-4 "
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default Chat;
