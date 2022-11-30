import { loadBundle, startAfter } from "firebase/firestore";

const LOAD_USER = "LOAD_USER";
const ADD_USER = "ADD_USER";
const LOAD_LIKED_SONGS = "LOAD_LIKED_SONGS";
const DELETE_LIKED_SONGS = "DELETE_LIKED_SONGS";
const LOAD_FEED = "LOAD_FEED";

const LOAD_YOUR_SONGS = "LOAD_YOUR_SONGS";

//initial list of Users (just for testing)
const initialUsersList = [
  { name: "Janice", bio: "hello, my name is Janice!", key: 2 },
  { name: "Joe", bio: "hello, my name is Joe", key: 1 },
];

// songs the user has liked
const initialLikedSongList = [
  {
    artist: "Artist1",
    mood: "Mood1",
    title: "Title1",
    liked: false,
    key: 10,
    postedBy: "me",
  },
  {
    artist: "Artist2",
    mood: "Mood2",
    title: "Title2",
    liked: false,
    key: 11,
    postedBy: "me",
  },
];

//the song posts user has made
const initialYourSongs = [
  { artist: "Artist3", mood: "Mood3", title: "Title3", liked: false, key: 12 },
  { artist: "Artist4", mood: "Mood4", title: "Title4", liked: true, key: 13 },
];

const initialFeed = [
  {
    artist: "Artist 5",
    caption: "Caption5",
    liked: false,
    mood: "mood5",
    song: "song5",
    userId: "id5",
    replies: [{ artist: "artist6", song: "song6", userID: "id6" }],
    key: 15,
    timestamp: Date.now(),
  },
];

const initialState = {
  usersList: initialUsersList,
  likedSongsList: initialLikedSongList,
  yourSongPostsList: initialYourSongs,
  feedList: initialFeed,
};

const loadFeed = (state, newFeedList) => {
  return {
    ...state,
    feedList: newFeedList,
  };
};

const addToFeed = (state, payload) => {
  let { artist, caption, liked, mood, song, userId, replies } = payload;
  let { feedList } = state;
  let newFeedList = feedList.concat({
    artist: artist,
    caption: caption,
    liked: liked,
    mood: mood,
    song: song,
    userId: userId,
    replies: replies,
  });
  return {
    ...state,
    feedList: newFeedList,
  };
};

const loadUser = (state, payload) => {
  // Will need to modify this so that it grabs the current user later
  let { userList } = payload;

  return {
    ...state,
    usersList: userList,
  };
};

const addUser = () => {};

const loadLikedSongs = (state, payload) => {
  let { filteredLikedSongs } = payload;

  return {
    ...state,
    likedSongsList: filteredLikedSongs,
  };
};

const deleteLikedSongs = (state, payload) => {
  let { currentLikedSongs, key } = payload;

  console.log("=====these are my liked songs in reducer.js======");
  console.log(currentLikedSongs);

  let filteredLikedSongs = currentLikedSongs.filter((elem) => elem.key !== key);
  console.log("This is once I filtered out the songs (filteredLikedSongs): ");
  console.log(filteredLikedSongs);

  return {
    ...state,
    likedSongsList: filteredLikedSongs,
  };
};

const loadYourSongs = (state, payload) => {
  let { filteredYourSongs } = payload;

  return {
    ...state,
    yourSongPostsList: filteredYourSongs,
  };
};

function rootReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_USER:
      return loadUser(state, payload);
    case ADD_USER:
      return addUser(state, payload);
    case LOAD_LIKED_SONGS:
      return loadLikedSongs(state, payload);
    case DELETE_LIKED_SONGS:
      return deleteLikedSongs(state, payload);
    case LOAD_YOUR_SONGS:
      return loadYourSongs(state, payload);
    case LOAD_FEED:
      return loadFeed(state, payload);
    default:
      return state;
  }
}

export {
  rootReducer,
  LOAD_USER,
  ADD_USER,
  LOAD_LIKED_SONGS,
  DELETE_LIKED_SONGS,
  LOAD_YOUR_SONGS,
  LOAD_FEED,
};
