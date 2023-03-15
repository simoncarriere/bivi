import { useState, useEffect } from "react";
// Firebase hooks
import { useAuthContext } from "../hooks/useAuthContext";
// Components
import Onboard from "../components/Onboard";
import Sidebar from "../components/Sidebar";
import LandingPage from "../components/LandingPage";
import Calendar from "../components/Calendar";
import Aside from "../components/Aside";

export default function Home() {
  const { user, authIsReady, currentRoom } = useAuthContext();
  const [roomIsReady, setRoomIsReady] = useState(false);

  // 🚨 IS THIS A PROBLEM SINCE EVERY USER ON THE PLATFORM WILL CAUSE THE APP TO RERENDER

  useEffect(() => {
    // console.log(currentRoom);
    if (currentRoom !== null) {
      // console.log(currentRoom);
      setRoomIsReady(true);
    }
  }, [currentRoom]);

  return (
    <>
      {authIsReady &&
        (user ? (
          currentRoom === null ? (
            // roomIsReady ? (
            <Onboard
              user={user}
              currentRoom={currentRoom}
              // roomIsReady={roomIsReady}
              // setRoomIsReady={setRoomIsReady}
            />
          ) : (
            <div className="flex h-full">
              {/* Sidebar */}
              {currentRoom && <Sidebar />}

              {/* Main content */}
              <div className="flex items-stretch flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                  {/* Primary column */}
                  <div
                    aria-labelledby="primary-heading"
                    className="relative flex flex-col flex-1 h-screen min-w-0 overflow-y-auto lg:order-last"
                  >
                    <section
                      aria-labelledby="primary-heading"
                      className="flex flex-col flex-1 h-full min-w-0 lg:order-last"
                    >
                      <Calendar />
                    </section>
                  </div>
                </main>

                {/* Secondary column (hidden on smaller screens) */}
                <aside className="hidden overflow-y-auto transition-all duration-200 ease-in border-l border-gray-200 shadow w-96 hover:w-96 lg:block">
                  <Aside />
                </aside>
              </div>
            </div>
          )
        ) : (
          <LandingPage />
        ))}
    </>
  );
}

// User's Room Listener
// TODO: Trigger Notification when gets invited to a room. Real time listerer should get triggered
//       Rooms track array of invited UUIDs and object of members with (uuid, email, picture)

// useEffect(() => {
//   if (authUser) {
//     let q = query(
//       collection(db, "spaces"),
//       where("members", "array-contains", authUser.uid)
//     );

//     const unsub = onSnapshot(q, (snapshot) => {
//       let results = [];
//       snapshot.docs.forEach((doc) => {
//         results.push({ ...doc.data(), id: doc.id });
//       });
//       setSpaces(results);
//     });
//     return () => unsub();
//   }
// }, [authUser]);

{
  /* {currentRoom ? ( */
}
{
  /* <> */
}
{
  /* All Messages  */
}

{
  /* {messages &&
             messages.map((message) => (
               <div
                 key={message.id}
                 className={
                   message.sentById === authUser.uid
                     ? "justify-self-end my-4 text-end"
                     : "justify-self-start my-4"
                 }
               >
                 <p className="text-xs text-gray-400">
                   {message.sentBy}
                 </p>
                 <p className="mb-1">{message.message}</p>
                 {message.createdAt && (
                   <p className="text-xs text-gray-400">
                     (
                     <ReactTimeAgo
                       date={message.createdAt.toDate()}
                       locale="en-US"
                     />
                     )
                   </p>
                 )}
               </div>
               // <div className="flex gap-4 mb-6">
               //   <span className="flex items-center justify-center w-8 h-8 rounded-full ring-8 ring-white bg-slate-200">
               //     <UserIcon className="w-4 h-4 rounded-full text-slate-600" />
               //   </span>
               //   <div className="flex-1 space-y-1">
               //     <div className="flex items-center justify-between">
               //       <h3 className="text-xs ">{message.sentBy}</h3>
               //       {message.createdAt && (
               //         <p className="text-xs text-neutral-300">
               //           <ReactTimeAgo
               //             date={message.createdAt.toDate()}
               //             locale="en-US"
               //           />
               //         </p>
               //       )}
               //     </div>
               //     <p className="text-xs text-neutral-500">
               //       {message.message}
               //     </p>
               //   </div>
               // </div>
             ))} */
}
{
  /* New Message  */
}
{
  /* <form
                   onSubmit={submitMessage}
                   className="absolute left-0 right-0 flex mx-4 bottom-8"
                 >
                   <input
                     onChange={(e) => setNewMessage(e.target.value)}
                     value={newMessage}
                     name="comment"
                     id="comment"
                     placeholder="Your message..."
                     className="border-none bg-slate-200"
                   />
                   <button className="p-4 ml-2 text-sm border rounded bg-slate-800 text-slate-100">
                     Send
                   </button>
                 </form> */
}
{
  /* </>; */
}
{
  /* ) : ( */
}

{
  /* )} */
}
