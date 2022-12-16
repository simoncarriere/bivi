import {useState, useEffect} from 'react'
import {db} from '../lib/firebase'
import {auth} from '../lib/firebase'
import { collection, doc, addDoc, serverTimestamp, updateDoc, arrayUnion, onSnapshot, query, where, orderBy} from 'firebase/firestore'
import {onAuthStateChanged, signOut} from 'firebase/auth'
// Components
import SignUp from '../components/SignUp'
import SignIn from '../components/SignIn'
import { useCollection } from '../hooks/useCollection'
// Libraries
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)


export default function Home() {
  
    const [authUser, setAuthUser] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const [newMember, setNewMember] = useState('')
    const [rooms, setRooms] = useState()
    const [newRoom, setNewRoom] = useState('')
    const [currentRoom, setCurrentRoom] = useState()
    const [messages, setMessages] = useState()
    // const {documents: rooms} = useCollection('rooms', authUser)

    // Auth Listener
    useEffect(() => {
      const listen = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthUser(user)
        } else {
          setAuthUser(null)
        }
      })
      return () => listen()
    },[])

    // Room Listener
    useEffect(() => {
      if (authUser){
          let q = query(collection(db,'rooms'), where('members', 'array-contains', authUser.uid))
          
          const unsub = onSnapshot(q, (snapshot) => {
              let results = []
              snapshot.docs.forEach(doc => {
                  results.push({...doc.data(), id: doc.id})
              })
              setRooms(results)
          })
          return () => unsub()  
        }

    }, [authUser])

    // Current Room Message Listener
    useEffect(() => {
          if (currentRoom !== undefined){
    
            const q = query(collection(db, 'rooms', currentRoom, "messages"), orderBy('createdAt', 'desc'));
            
            try {
              const unsub = onSnapshot(q, (snapshot) => {
                  let results = []
                  snapshot.docs.forEach(doc => {
                      results.push({...doc.data(), id: doc.id})
                  })
                  setMessages(results)
              })
              return () => unsub()  
            }
            catch(e){
              console.error("Error adding document: ", e)
            }
          }
    }, [currentRoom])

    const userSignOut = () => {
      signOut(auth)
        .then(() => {
          console.log('sign out successful')
        }).catch(err => console.log(err))
    }

    const submitRoom = (e) => {
      e.preventDefault()
      const roomRef = collection(db, 'rooms')
      if (newRoom.length > 4){
        try {
          addDoc(roomRef, {
            name: newRoom,
            roomOwner: authUser.uid,
            createdAt: serverTimestamp(),
            members: [authUser.uid]
          })
          setNewRoom('')
          // orderForm.current.reset()
          // console.log("Order written with ID: ", docRef.id)
        }
        catch(e){
          console.error("Error adding document: ", e)
        }
      }
      console.log('New Room Added', newRoom)
    }
  
    const submitMember = (e) => {
      e.preventDefault()
      const roomRef = doc(db, 'rooms', currentRoom)
      try {
        updateDoc(roomRef, {
          members: arrayUnion(newMember)
        })
        console.log('added', newMember)
        setNewMember('')
      }
      catch(e){
        console.error("Error adding document: ", e)
      }
    }

    const submitMessage = (e) => {
      e.preventDefault()
      const roomRef = collection(db, 'rooms', currentRoom, "messages")
     
      try {
        addDoc(roomRef, {
          message: newMessage,
          sentBy: authUser.email,
          sentById: authUser.uid,
          createdAt: serverTimestamp()
        })
        setNewMessage('')
      } catch(e) {
        console.error("Error adding document: ", e)
      }
    }


    return (
      <div className='m-8'>
        {authUser ? (
          <>
            <div className='flex justify-between w-full mb-8'>
              <p>{`Signed In ${authUser.email}, ${authUser.uid}`}</p> 
              <button type="text" onClick={userSignOut}>Sign Out</button>
            </div>

            <div className='grid grid-cols-12'>
                <div className='grid col-span-4 gap-6 p-8 rounded bg-slate-200'>
                  
                    {/* Select Room */}
                    <div>
                        <h1 className='mb-2'>Select Room</h1>
                        <select
                          id="rooms"
                          name="rooms"
                          value={currentRoom}
                          onChange={(e) => setCurrentRoom(e.target.value)}
                        >
                          <option  disabled>Select a room</option>

                          {rooms && rooms.map((room) => (
                            <option value={room.id} key={room.id}>{room.name}</option>
                          ))}
                        </select>
                    </div>
                    {/* Create Room */}
                    <div>
                      <h1 className='mb-2'>Create New Room</h1>
                        <form onSubmit={submitRoom} className="flex gap-2">
                          <input
                              onChange={(e) => setNewRoom(e.target.value)}
                              value={newRoom}
                              placeholder="New room name..."
                              name="room"
                              id="room"
                            />
                          <button className='p-4 text-sm rounded w-36 text-slate-100 bg-slate-800'>Create Room</button>
                        </form>      
                    </div>
                    {/* Add Member */}
                    <div>
                      <h1 className='mb-2'>Room Members {currentRoom ? currentRoom : 'SELECT ROOM FIRST'}</h1>
                      <form onSubmit={submitMember} className="flex gap-2">
                          <input
                            onChange={(e) => setNewMember(e.target.value)}
                            value={newMember}
                            placeholder="Paste in user id"
                            name="memberId"
                            id="memberId"
                            // className="block w-full rounded-md shadow-sm bg-slate-100 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          <button className='p-4 text-sm rounded w-36 text-slate-100 bg-slate-800'>Add Member</button>
                      </form>
                    </div>
                  
                </div>
                <div className='col-span-8 mx-8'>   
                    {currentRoom ? (
                      <>
                        {/* New Message  */}
                        <form onSubmit={submitMessage} className="flex">
                              <input
                                onChange={(e) => setNewMessage(e.target.value)}
                                value={newMessage}
                                name="comment"
                                id="comment"
                              />
                              <button  className='p-4 ml-2 text-sm border rounded text-slate-100 bg-slate-800'>Send</button>
                        </form>
                        {/* All Messages  */}
                        <div className=''>
                          {messages && messages.map((message) => (
                              <div key={message.id} className={(message.sentById === authUser.uid) ? 'justify-self-end my-4 text-end': 'justify-self-start my-4'}>
                                <p className='text-xs text-gray-400'>{message.sentBy}</p>
                                <p className='mb-1'>{message.message}</p>
                                {message.createdAt && <p className='text-xs text-gray-400'>(<ReactTimeAgo date={message.createdAt.toDate()} locale="en-US"/>)</p>}
                              </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className='mt-0 error'>
                        No Room Selected: Create or request to join a room
                      </p>
                    )}
                </div>
            </div>
          </>
        ) : (
          <div>
            <h1 className='my-4'>Firebase Barebones</h1>
            <SignUp/>
            <SignIn/>
          </div>
        )}
      </div>
    )
}