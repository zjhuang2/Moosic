import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { firebaseConfig } from "../Secrets";
import {
  LOAD_USER,
  ADD_USER,
  LOAD_LIKED_SONGS,
  DELETE_LIKED_SONGS,
  LOAD_YOUR_SONGS,
  ADD_LIKED_SONG,
  UPDATE_USER,
  LOAD_FEED,
  ADD_POST_TO_FEED,
  ADD_TO_YOUR_SONGS,
  ADD_COMMENT,
} from "./Reducer";

let app,
  db = undefined;
const USERSCOLLECTION = "users";
const SONGCOLLECTION = "songCollection";
const FEEDCOLLECTION = "moosicFeed";

let snapshotUnsubscribe = undefined;

if (getApps().length < 1) {
  app = initializeApp(firebaseConfig);
}
const auth = getAuth(app);
db = getFirestore(app);

const saveAndDispatch = async (action, dispatch) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_USER:
      loadUserAndDispatch(action, dispatch);
      return;

    case ADD_USER: // haven't written this yet
      addUserAndDisptch(action, dispatch);
      return;

    case UPDATE_USER:
      updateUserAndDispatch(action, dispatch);
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

    case LOAD_FEED:
      loadFeedAndDispatch(action, dispatch);
      return;

    case ADD_POST_TO_FEED:
      addPostToFeedAndDispatch(action, dispatch);
      return;

    case ADD_TO_YOUR_SONGS:
      addPostToYourSongsAndDispatch(action, dispatch);
      return;

    case ADD_COMMENT:
      addCommentAndDispatch(action, dispatch);
      return;
  }
};

export { saveAndDispatch };

//Need this
const loadUserAndDispatch = async (action, dispatch) => {
  //userID willl have too change later after authentication

  if (snapshotUnsubscribe) {
    snapshotUnsubscribe();
  }

  const q = query(collection(db, USERSCOLLECTION));

  snapshotUnsubscribe = onSnapshot(q, (qSnap) => {
    let userList = [];

    qSnap.docs.forEach((docSnap) => {
      let user_info = docSnap.data();
      user_info.key = docSnap.id; // grabs the auto generated id from firebase
      userList.push(user_info);
    });

    let newAction = {
      ...action,
      payload: {
        userList: userList,
      },
    };

    dispatch(newAction);
  });
};

const updateUserAndDispatch = async (action, dispatch) => {
  console.log(action);
  const { payload } = action;
  const { userBio, key } = payload;

  const docToUpdate = doc(collection(db, "users"), key);

  await updateDoc(docToUpdate, {
    userBio: userBio,
  });

  //dispatch(action);
};

const loadFeedAndDispatch = async (action, dispatch) => {
  if (snapshotUnsubscribe) {
    snapshotUnsubscribe();
  }
  const q = query(collection(db, FEEDCOLLECTION));
  snapshotUnsubscribe = onSnapshot(q, (qSnap) => {
    let newFeedList = [];
    qSnap.docs.forEach((docSnap) => {
      let post = docSnap.data();
      post.key = docSnap.id;
      newFeedList.push(post);
    });
    let newAction = {
      ...action,
      payload: {
        feedList: newFeedList,
      },
    };
    dispatch(newAction);
  });
};

const deleteLikedSongsAndDispatch = async (action, dispatch) => {
  let { payload } = action;
  let { currentLikedSongs, key } = payload;

  const docToDelete = doc(
    collection(db, USERSCOLLECTION, auth.currentUser?.uid, SONGCOLLECTION),
    key
  );
  await deleteDoc(docToDelete);

  // console.log("=======This is my action in DB.js when i try to delete a song=======");
  // console.log(action);

  dispatch(action);
};

const addLikedSongAndDispatch = async (action, dispatch) => {
  const { payload } = action;
  const { song, artist, caption, mood, userID, liked, replies, userDocID } =
    payload;

  console.log(action);
  const coll = collection(db, "users", userDocID, "songCollection");

  const newSongDocRef = await addDoc(coll, {
    song: song,
    artist: artist,
    caption: caption,
    mood: mood,
    userID: userID,
    liked: liked,
    replies: replies,
    userDocID: userDocID,
  });

  const newPayload = {
    ...payload,
    key: newSongDocRef.id,
  };

  const newAction = {
    ...action,
    payload: newPayload,
  };

  dispatch(newAction);
};

const addPostToFeedAndDispatch = async (action, dispatch) => {
  const { payload } = action;
  const { song, artist, caption, liked, mood, userId, replies, postTime, key } =
    payload;
  const feedColl = collection(db, "moosicFeed");

  const newPostDocRef = await addDoc(feedColl, {
    song: song,
    artist: artist,
    caption: caption,
    liked: liked,
    mood: mood,
    userId: userId,
    replies: replies,
    postTime: postTime,
    key: key,
  });

  const newPayload = {
    ...payload,
    key: newPostDocRef.id,
  };

  const newAction = {
    ...action,
    payload: newPayload,
  };
  dispatch(newAction);
};

const addPostToYourSongsAndDispatch = async (action, dispatch) => {
  const { payload } = action;
  const { song, artist, caption, liked, mood, replies, userId, userDocID } =
    payload;
  const feedColl = collection(db, "users", userDocID, "songCollection");

  const newPostDocRef = await addDoc(feedColl, {
    song: song,
    artist: artist,
    caption: caption,
    liked: liked,
    mood: mood,
    replies: replies,
    userID: userId,
    userDocID: userDocID,
  });

  const newPayload = {
    ...payload,
    key: newPostDocRef.id,
  };

  const newAction = {
    ...action,
    payload: newPayload,
  };
  dispatch(newAction);
};

const addCommentAndDispatch = async (action, dispatch) => {
  const { payload } = action;
  const { song, artist, caption, liked, mood, replies, userId, key } = payload;

  const docToUpdate = doc(collection(db, "moosicFeed"), key);
  await updateDoc(docToUpdate, {
    song: song,
    artist: artist,
    caption: caption,
    liked: liked,
    mood: mood,
    replies: replies,
    userId: userId,
    key: key,
  });
  dispatch(action);
};
