import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs,
         doc, getDoc, query, addDoc, updateDoc, deleteDoc, onSnapshot } 
         from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { firebaseConfig } from '../Secrets';
import { LOAD_USER, ADD_USER, LOAD_LIKED_SONGS, DELETE_LIKED_SONGS, LOAD_YOUR_SONGS, ADD_LIKED_SONG } from './Reducer';

let app, db = undefined;
const USERSCOLLECTION = 'users';
const SONGCOLLECTION = 'songCollection';

let snapshotUnsubscribe = undefined;

if (getApps().length < 1) {
    app = initializeApp(firebaseConfig);
}
const auth = getAuth(app);
db = getFirestore(app);


const saveAndDispatch = async(action, dispatch) => {
    const {type,payload} = action;

    switch(type) {
        case LOAD_USER:
            loadUserAndDispatch(action, dispatch);
            return;

        case ADD_USER: // haven't written this yet
            addUserAndDisptch(action, dispatch);
            return;

        case LOAD_LIKED_SONGS:
            loadLikedSongsAndDispatch(action, dispatch);
            return;

        case DELETE_LIKED_SONGS:
            deleteLikedSongsAndDispatch(action, dispatch);
            return;

        case LOAD_YOUR_SONGS:
            loadYourSongsAndDispatch(action, dispatch);
            return;

        case ADD_LIKED_SONG:
            addLikedSongAndDispatch(action, dispatch);
            return;
    }

}

export {saveAndDispatch};


//goiong to try to make this loaod the user AND load your poosts
const loadUserAndDispatch = async (action, dispatch) => {
    //userID willl have too change later after authentication

    if (snapshotUnsubscribe) {
        snapshotUnsubscribe();
    }

    const q = query(
        collection(db, USERSCOLLECTION),
    )

    snapshotUnsubscribe = onSnapshot(q, (qSnap) => {

        let userList = [];
    
        qSnap.docs.forEach((docSnap) => {
            let user_info = docSnap.data(); 
            user_info.key = docSnap.id; // grabs the auto generated id from firebase
            userList.push(user_info);
        })

        let newAction = {
            ...action,
            payload: {
                userList:userList,
            }
        };

        dispatch(newAction);
    });
}

//II THINK THIS IS USELESS
// const loadLikedSongsAndDispatch = async (action, dispatch) => {
//     //I think I need the key of the user (document)
//     //EDIT THIS SO THAT IT'S THE CURRENT USER'S ID
//     let userID = "me38ADJpJRVR25ILljkQ";


//     if (snapshotUnsubscribe) {
//         snapshotUnsubscribe();
//     }

//     const q = query(
//         // collection(db, USERSCOLLECTION, userID , SONGCOLLECTION)
//         collection(db, USERSCOLLECTION, auth.currentUser?.uid, SONGCOLLECTION)
//     )

//     snapshotUnsubscribe = onSnapshot(q, (qSnap) => {

//         let allSongsList = [];

//         qSnap.docs.forEach((docSnap)=> {
//             let song_info = docSnap.data();
//             song_info.key = docSnap.id;
//             allSongsList.push(song_info);
//         })

//         //only grabs the liked songs
//         let filteredLikedSongs = allSongsList.filter(elem => elem.liked === true);

//         let newAction = {
//             ...action,
//             payload: {filteredLikedSongs:filteredLikedSongs}
//         };

//         console.log("??????????????? all of my songs ?????", allSongsList)
//         dispatch(newAction);
//     });
// }

const deleteLikedSongsAndDispatch = async (action, dispatch) => {
    let {payload} = action;
    let {currentLikedSongs, key} = payload;

    const docToDelete = doc(collection(db, USERSCOLLECTION,auth.currentUser?.uid, SONGCOLLECTION), key);
    await deleteDoc(docToDelete);

    // console.log("=======This is my action in DB.js when i try to delete a song=======");
    // console.log(action);

    dispatch(action);
}


//II THINK THIS IS USELESS
// const loadYourSongsAndDispatch = async (action, dispatch) => {

//     //I think I need the key of the user (document)
//     //EDIT THIS SO THAT IT'S THE CURRENT USER'S ID
//     let userID = "me38ADJpJRVR25ILljkQ";
    
//     if (snapshotUnsubscribe) {
//         snapshotUnsubscribe();
//     }

//     //makes a query for the songs collection
//     const q = query(
//         collection(db, USERSCOLLECTION, userID , SONGCOLLECTION)
//     )

//     //goes through the query and grabs snapshot oof doocuments
//     snapshotUnsubscribe = onSnapshot(q, (qSnap) => {

//         let allYourSongs = [];


//         qSnap.docs.forEach((docSnap)=> {
//             let song_info = docSnap.data();
//             song_info.key = docSnap.id;
//             allYourSongs.push(song_info);
//         })

//         //only grabs the songs YOU POSTED
//         let filteredYourSongs = allYourSongs.filter(elem => elem.postedBy === 'me');

//         let newAction = {
//             ...action,
//             payload: {filteredYourSongs:filteredYourSongs}
//         };

//         dispatch(newAction);
//     });

// }


const addLikedSongAndDispatch = async (action, dispatch) => {
    const {payload} = action;
    const { song, artist, caption, mood, userID, liked, replies, userDocID} = payload;

    console.log(action);
    const coll = collection(db, 'users', userDocID, 'songCollection');


    const newSongDocRef = await addDoc(coll, {
        song: song,
        artist: artist,
        caption: caption,
        mood: mood,
        userID: userID,
        liked: liked,
        replies: replies,
        userDocID: userDocID,
    })

    const newPayload = {
        ...payload,
        key: newSongDocRef.id
    }

    const newAction = {
        ...action, 
        payload: newPayload,
    }
    
    dispatch(newAction);


}




