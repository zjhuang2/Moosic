import { updateCurrentUser } from "firebase/auth";
import { loadBundle, startAfter } from "firebase/firestore";

const LOAD_USER = 'LOAD_USER';
const ADD_USER = 'ADD_USER';
const UPDATE_USER = 'UPDATE_USER';

const LOAD_LIKED_SONGS = 'LOAD_LIKED_SONGS';
const DELETE_LIKED_SONGS = 'DELETE_LIKED_SONGS';

const ADD_LIKED_SONG = 'ADD_LIKED_SONG';

const LOAD_YOUR_SONGS = 'LOAD_YOUR_SONGS';



//initial list of Users (just for testing)
const initialUsersList = [
    {name: "Janice", bio: "hello, my name is Janice!", key: 2},
    {name: "Joe", bio: "hello, my name is Joe", key: 1},
];

// songs the user has liked
const initialLikedSongList = [
    {artist: 'Artist1', mood:'Mood1', title: 'Title1', liked: false, key: 10, postedBy: 'me'},
    {artist: 'Artist2', mood:'Mood2', title: 'Title2', liked: false, key: 11, postedBy: 'me'}

]

//the song posts user has made
const initialYourSongs = [
    {artist: 'Artist3', mood:'Mood3', title: 'Title3', liked: false, key: 12},
    {artist: 'Artist4', mood:'Mood4', title: 'Title4', liked: true, key: 13}
]


const initialState = {
    usersList : initialUsersList,
    likedSongsList: initialLikedSongList,
    yourSongPostsList: initialYourSongs,
}

const loadUser = (state, payload) => {
    // Will need to modify this so that it grabs the current user later
    let {userList} = payload;

    return {
        ...state,
        usersList: userList
    }

}

const addUser = () => {

}

const updateUser = () => {
    console.log("not doing anything");
}

const loadLikedSongs = (state, payload) => {
    
    let {filteredLikedSongs} = payload;

    return {
        ...state,
        likedSongsList: filteredLikedSongs
    }
}

const deleteLikedSongs = (state, payload) => {
    let {currentLikedSongs, key} = payload;
    let {likedSongsList} = state;

    let filteredLikedSongs = currentLikedSongs.filter(elem => elem.key !== key);
 
    return {
        ...state,
        likedSongsList: filteredLikedSongs
    }

}

const loadYourSongs = (state, payload) => {
    let {filteredYourSongs} = payload;

    return {
        ...state,
        yourSongPostsList:filteredYourSongs
    }
}

const addLikedSong = (state, payload) => {
    const { song, artist, caption, mood, userID, liked, replies, userDocID, key} = payload;

    const {likedSongsList} = state;

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
    })

    //console.log(updatedSongList);
    console.log("UPDATED SONGS LIST: ", updatedSongList);
    console.log("Current SONGS LIST: ", likedSongsList);

    return {
        ...state,
        likedSongsList: updatedSongList
    }

}

function rootReducer(state=initialState, action) {
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
            return loadYourSongs(state,payload);
        case ADD_LIKED_SONG:
            return addLikedSong(state, payload);
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
 };