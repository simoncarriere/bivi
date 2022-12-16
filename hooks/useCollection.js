import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore'

export const useCollection = (c, authUser) => {
    const [documents, setDocuments] = useState(null)

    useEffect(() => {

        // let q = query(collection(db,c))
        let q = query(collection(db,c), where('members', 'array-contains', authUser.uid))
        
        const unsub = onSnapshot(q, (snapshot) => {
            let results = []
            snapshot.docs.forEach(doc => {
                results.push({...doc.data(), id: doc.id})
            })
            setDocuments(results)
        })
        return () => unsub()  
    }, [c])
    
    return {documents}
}