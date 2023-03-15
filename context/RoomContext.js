import { useState, createContext, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";

export const RoomContext = createContext();

export const RoomContextProvider = ({ children }) => {
  const [currentRoom, setCurrentRoom] = useState();
  const [roomIsReady, setRoomIsReady] = useState(false);
  const [noRooms, setNoRooms] = useState(true);
  const { user } = useAuthContext();

  const { documents: rooms } = useCollection("rooms", [
    "members",
    "array-contains",
    user.uid,
  ]);

  useEffect(() => {
    if (rooms && rooms.length > 0) {
      // if (rooms && rooms.length > 0) {
      setNoRooms(false);
      setCurrentRoom(rooms[0]);
      setRoomIsReady(true);
    } else {
      setNoRooms(true);
    }
  }, [rooms]);

  return (
    currentRoom && (
      <RoomContext.Provider
        value={{
          currentRoom,
          setCurrentRoom,
          roomIsReady,
          noRooms,
          setNoRooms,
        }}
      >
        {children}
      </RoomContext.Provider>
    )
  );
};
