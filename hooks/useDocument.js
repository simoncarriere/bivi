import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

/* 
  Expected Arguments:
  c - collection name
  d - document name

  Expected usage:
  const { documents } = useDocument('rooms', currentRoom.id)
*/

export const useDocument = (c, d) => {
  const [document, setDocument] = useState(null);

  useEffect(() => {
    let ref = doc(db, c, d);

    const unsub = onSnapshot(ref, (doc) => {
      setDocument(doc.data());
    });

    return () => unsub();
  }, [c, d]);

  return { document };
};
