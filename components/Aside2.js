import { useState, useEffect } from "react";
// Hooks
import { useAuthContext } from "../hooks/useAuthContext";
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
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
TimeAgo.addDefaultLocale(en);
import ReactTimeAgo from "react-time-ago";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const tabs = [
  { name: "Chat", href: "#", current: true },
  { name: "Todos", href: "#", current: false },
  { name: "Events", href: "#", current: false },
];

export default function Aside2() {
  const { user, currentRoom } = useAuthContext();
  // Message Input State
  const [newMessage, setNewMessage] = useState("");
  // Local messages state
  const [messages, setMessages] = useState();

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
    <div className="flex flex-col justify-between h-full max-h-screen pt-2 pb-5 bg-white">
      <div className="">
        {/* Tabs */}
        <div>
          <div className=" sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              id="tabs"
              name="tabs"
              className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              defaultValue={tabs.find((tab) => tab.current).name}
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="fixed top-0 hidden w-full pt-4 bg-white shadow sm:block">
            <div className="">
              <nav className="flex px-6 space-x-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <a
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      tab.current
                        ? "border-slate-500 text-slate-700 font-semibold"
                        : "border-transparent text-slate-400 hover:border-gray-300 hover:text-gray-700",
                      "whitespace-nowrap border-b-2 py-2  text-xs font-medium"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
        {/* Inbox */}
        <ul role="list" className="px-6 mt-12 overflow-y-automb-6">
          {messages && messages.length > 0 ? (
            <li key={message.id} className="py-2">
              {messages.map((message) =>
                message.sentAt ? (
                  <div className="flex space-x-2">
                    <div className="flex-shrink-0 pt-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="p-1 text-xs text-gray-400 truncate rounded-md ">
                        Simon - {``}
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
                )
              )}
            </li>
          ) : (
            <p className="pt-4 text-center text-gray-400">No messages yet</p>
          )}
        </ul>
      </div>
      <div className="fixed bottom-0 pb-4 bg-white w-96">
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
            className="block px-5 py-3 text-gray-900 border-0 rounded-md shadow-sm pr-14 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6"

            // className="flex-auto min-w-0 px-5 py-4 border-gray-100 rounded-md shadow-sm w-96 focus:ring-orange-500 outline-orange-500 sm:text-sm sm:leading-6"
          />

          <button
            type="submit"
            className="absolute flex items-center px-4 m-2 text-xs font-medium text-gray-600 rounded-md inset-y-4 top-2 bg-slate-100 right-4 "
          >
            Send
          </button>
        </form>
      </div>
      {/* <div className="mt-6">
        <a
          href="#"
          className="flex items-center justify-center w-full px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >
          View all
        </a>
      </div> */}
    </div>
  );
}

{
  /* <div>
<a
  href="#"
  className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
>
  View
</a>
</div> */
}
