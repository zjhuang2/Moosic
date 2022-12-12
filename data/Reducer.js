import { updateCurrentUser } from "firebase/auth";
import { loadBundle, startAfter } from "firebase/firestore";

const LOAD_USER = "LOAD_USER";
const ADD_USER = "ADD_USER";
const UPDATE_USER = "UPDATE_USER";

const LOAD_LIKED_SONGS = "LOAD_LIKED_SONGS";
const DELETE_LIKED_SONGS = "DELETE_LIKED_SONGS";
const ADD_LIKED_SONG = "ADD_LIKED_SONG";
const ADD_TO_YOUR_SONGS = "ADD_TO_YOUR_SONGS";

const LOAD_YOUR_SONGS = "LOAD_YOUR_SONGS";

const LOAD_FEED = "LOAD_FEED";
const ADD_POST_TO_FEED = "ADD_POST_TO_FEED";

const ADD_COMMENT = "ADD_COMMENT";

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

// the feed
const initialFeed = [
  {
    song: "mockSong",
    artist: "Mock Artist",
    caption: "mockCaption",
    liked: false,
    mood: "mockMood",
    userId: "mockId",
    replies: [
      { song: "commentSong", artist: "commentArtist", userId: "commentID" },
      { song: "commentSong2", artist: "commentArtist2", userId: "commentID2" },
    ],
    key: 10,
    postTime: Date.now(),
  },
];

const initialState = {
  usersList: initialUsersList,
  likedSongsList: initialLikedSongList,
  yourSongPostsList: initialYourSongs,
  feedList: initialFeed,
  updateVariable: ''
};

// load the feeds
const loadFeed = (state, payload) => {
  let { feedList } = payload;
  return {
    ...state,
    feedList: feedList,
  };
};

const addPostToFeed = (state, payload) => {
  let { song, artist, caption, liked, mood, userId, replies, postTime } =
    payload;
  let { feedList } = state;
  let updatedFeedList = feedList.concat({
    song: song,
    artist: artist,
    caption: caption,
    liked: liked,
    mood: mood,
    userId: userId,
    replies: replies,
    postTime: postTime,
  });
  return {
    ...state,
    feedList: updatedFeedList,
  };
};

const addPostToYourSongs = (state, payload) => {
  let { song, artist, caption, liked, mood, replies, userId, userDocID } =
    payload;
  let { yourSongPostsList } = state;
  let updatedYourSongsList = yourSongPostsList.concat({
    song: song,
    artist: artist,
    caption: caption,
    liked: liked,
    mood: mood,
    replies: replies,
    userID: userId,
    userDocID: userDocID,
  });
  return {
    ...state,
    yourSongPostsList: updatedYourSongsList,
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

const updateUser = () => {
  //console.log("not doing anything");
};

const loadLikedSongs = (state, payload) => {
  let { filteredLikedSongs } = payload;

  return {
    ...state,
    likedSongsList: filteredLikedSongs,
  };
};

const deleteLikedSongs = (state, payload) => {
  let { currentLikedSongs, key } = payload;
  let { likedSongsList } = state;

  let filteredLikedSongs = currentLikedSongs.filter((elem) => elem.key !== key);

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

const addLikedSong = (state, payload) => {
  const {
    song,
    artist,
    caption,
    mood,
    userID,
    liked,
    replies,
    userDocID,
    key,
  } = payload;

  const { likedSongsList } = state;

  let updatedSongList = likedSongsList.concat({
    song: song,
    artist: artist,
    caption: caption,
    mood: mood,
    userID: userID,
    liked: liked,
    replies: replies,
    userDocID: userDocID,
    key: key,
  });

  //console.log(updatedSongList);
  // console.log("UPDATED SONGS LIST: ", updatedSongList);
  // console.log("Current SONGS LIST: ", likedSongsList);

  return {
    ...state,
    likedSongsList: updatedSongList,
  };
};

const addComment = (state, payload) => {
  console.log(payload);
  const {song} = payload;

  return {
    ...state,
    updateVariable: song
  }

}

function rootReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_USER:
      return loadUser(state, payload);
    case ADD_USER:
      return addUser(state, payload);
    case UPDATE_USER:
      return updateUser(state, payload);
    case LOAD_LIKED_SONGS:
      return loadLikedSongs(state, payload);
    case DELETE_LIKED_SONGS:
      return deleteLikedSongs(state, payload);
    case LOAD_YOUR_SONGS:
      return loadYourSongs(state, payload);
    case ADD_LIKED_SONG:
      return addLikedSong(state, payload);
    case LOAD_FEED:
      return loadFeed(state, payload);
    case ADD_POST_TO_FEED:
      return addPostToFeed(state, payload);
    case ADD_TO_YOUR_SONGS:
      return addPostToYourSongs(state, payload);
    case ADD_COMMENT:
      return addComment(state, payload);
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
  ADD_LIKED_SONG,
  UPDATE_USER,
  LOAD_FEED,
  ADD_POST_TO_FEED,
  ADD_TO_YOUR_SONGS,
  ADD_COMMENT,
};
