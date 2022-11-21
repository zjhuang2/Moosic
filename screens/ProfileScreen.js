import { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Button } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { saveAndDispatch } from "../data/DB.js";
import { LOAD_USER, LOAD_LIKED_SONGS, DELETE_LIKED_SONGS, LOAD_YOUR_SONGS} from "../data/Reducer.js";
import Images from '../Images.js';

//Firebase stuff
import { 
    getFirestore, initializeFirestore, collection, getDocs, query, orderBy, limit,
    where, doc, addDoc, getDoc, onSnapshot
  } from "firebase/firestore";
  import { firebaseConfig } from '../Secrets';
  import { initializeApp, getApps } from 'firebase/app';

import { useSelector, useDispatch } from 'react-redux';


let app;
if (getApps().length == 0){
  app = initializeApp(firebaseConfig);
} 
const db = getFirestore(app);

let snapshotUnsubscribe = undefined;


function ProfileScreen(props) {


    const {navigation, route} = props;
    const dispatch = useDispatch();

    //state variables
    const [userName, setUserName] = useState('');
    const [userBio, setUserBio] = useState('');

    const currentTabs = ['Your Songs', 'Liked', 'Your Playlist']
    const [currentTab, setCurrentTab] = useState(currentTabs[0]);

    // maybe  use this
    const [currentTabList, setCurrentTabList] = useState([]);


    //This runs everytime I have a rerender (set state of any of my above variables)
    useEffect(()=> {
        const loadAction = {type: LOAD_USER};
        saveAndDispatch(loadAction, dispatch);
        subscribeToSnapshot();
        //is there a way to run the laood lists in useEffect without it fucking up the first one???

    }, [currentTab]);
    // maybe put currentTab into the [] -> when this changes, call the subscribe function
    // and then set it equal to the currentTabList - then display this

    const allUsers = useSelector((state)=> state.usersList);
    const allLikedSongs = useSelector((state) => state.likedSongsList);
   // const allPosts = useSelector((state) => state.yourSongPostsList);

    // const runYourSongs = () => {
    //     const loadAction3 = {type: LOAD_YOUR_SONGS};
    //     saveAndDispatch(loadAction3, dispatch);
    // }


    //This function grabs everything in the songCollections (your posts, likes)
    function subscribeToSnapshot () {
        let userID = "me38ADJpJRVR25ILljkQ";

        if (snapshotUnsubscribe) {
          snapshotUnsubscribe();
        }
    
        const q = query(
          collection(db, 'users', userID, 'songCollection'), //THIS S HOW IT NEW TO GRAB THE RIGHT MESSAGES!!!
        ); 

        snapshotUnsubscribe = onSnapshot(q, (qSnap) => {
        let songsList = [];
        
        qSnap.docs.forEach((docSnap)=>{
            let song_info = docSnap.data();
            song_info.key = docSnap.id;
            songsList.push(song_info);
        });
        //console.log(songsList);

        if (currentTab === 'Your Songs') {
            console.log('CURRENT TAB!!!');
            let filterYourPosts = songsList.filter(elem => elem.postedBy === 'me');
            console.log(filterYourPosts);
            setCurrentTabList(filterYourPosts);
        } else if (currentTab === 'Liked') {
            console.log('INSIDE LIKED');
            let filterLikedSongs = songsList.filter(elem => elem.liked === true);
            console.log(filterLikedSongs);
            setCurrentTabList(filterLikedSongs);
        }
        //setCurrentTabList(songsList);
        });

    }    

    const runLikedSongs = () => {
        const loadAction2 = {type: LOAD_LIKED_SONGS};
        saveAndDispatch(loadAction2, dispatch);
    }


    const deleteLikedSong = (songItem) => {
        console.log("====inside deletedLikedSongs function======");
        let {key} = songItem;
        console.log("key of deleted song: " + key);
        console.log("the current 'allLikedSongs: ");
        console.log([...allLikedSongs]);

        const action = {
            type: DELETE_LIKED_SONGS,
            payload: {
                key: key,
                currentLikedSongs: [...allLikedSongs]
            }
        }
        saveAndDispatch(action, dispatch);
    }

    const iconName = (songItem) => {
        if (songItem.liked === true) {
            return (<Ionicons name = 'heart' size = {30} color = 'red'/>)
        } else {
            return (<Ionicons name = 'trash' size = {30} color = 'gray'/>)
        }
    }

    // Thiis displays all of the liked songs
    function LikedSongListItem({item}) {
        return (
            <View style = {styles.listContainer}>
                <View style = {styles.individualSongContainer}>

                    <View>
                        <View style = {{flexDirection: 'row', marginVertical: 2}}>
                            <Ionicons name = 'person' size = {15} color = 'gray'/>
                            <Text>  {item.postedBy}</Text>
                        </View>
                        <Ionicons name = 'image' size = {80} color = 'gray'/>
                    </View>

                    <View style = {styles.songText}>

                        <Text style = {{fontSize: 20}}>{item.title}</Text>

                        <Text style = {{paddingTop: 5, paddingBottom: 15}}>{item.artist}</Text>

                        <Text style = {{fontSize: 15}}>I'm feeling {item.mood}</Text>
                    
                    </View>

                    <View style = {styles.likeButton}>
                        {/* <TouchableOpacity
                            onPress={() => {
                                if (item.liked === true) {
                                    deleteLikedSongs(item);
                                }
                            }}
                        >
                            {iconName(item)}
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            onPress={() => {
                                console.log(item);
                                deleteLikedSong(item);
                            }}>
                            <Ionicons name = 'heart' size = {30} color = 'red'/>
                        </TouchableOpacity>

                    </View>

                </View>
            </View>
        )

    }

    return (
        <View style = {styles.container}>

            <View style = {styles.profilePic}>
                <Images/>
            </View>

            <View style = {styles.userName}>
                <Text style = {{fontSize: 20}}>{allUsers[0].name}</Text>
            </View>


            <View style = {styles.bioText}>
                <Text>{allUsers[0].bio}</Text>
            </View>

            <View style = {styles.listItemsContainer}>
                <FlatList 
                    contentContainerStyle = {styles.flatListContents}
                    //before was currentTabs
                    data={currentTabs}
                    renderItem = {({item}) => {
                        return (
                            <Button
                                title = {item}
                                onPress = {() => {
                                    setCurrentTab(item);
                                    if (item === 'Liked') { //I could just run specific functions for each tab like this one
                                        //runLikedSongs();
                                        //setCurrentTabList(allLikedSongs);
                                        console.log('I JUST CLICKED ONO THE LIKE BUTTNO!!!')
                                    } 
                                    // else if(item === 'Your Songs') {
                                    //     runYourSongs(); //might have to combine this with the original useEffect function (load user)
                                    //     setCurrentTabList(allPosts);
                                    // }
                                }}
                                color = {item === currentTab ? '#3994c2': 'gray'}

                            />
                        )
                    }}
                />
            </View>

            <View style = {styles.allSongsLists}>
                <FlatList
                    contentContainerStyle = {styles.flatListSongs}
                    data = {currentTabList}
                    // data = {allLikedSongs}
                    renderItem = {({item}) => {
                        return (
                            <LikedSongListItem item = {item}/>
                        )
                    }}
                />
            </View>


        </View>
    )
}

export default ProfileScreen;


const styles = StyleSheet.create({ 

    container: {
        backgroundColor: '#EDEDED',
        paddingTop: 30,
    },
    profilePic : {
       // backgroundColor: 'yellow'
       alignItems: 'center',
       paddingTop: 20,
    },
    userName : {
        alignItems: 'center',
        paddingTop: 10
    },
    bioText : {
        alignItems: 'center',
        paddingTop: 20,
        paddingLeft: 30,
        paddingRight: 30,
    },
    flatListContents: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    listItemsContainer: {
        paddingTop: 20,
    },
    individualSongContainer : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderStyle: 'solid',
        borderColor: 'gray',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingLeft: 20,
        paddingRight: 30,
        paddingTop: 15,
        paddingBottom: 10,
        shadowRadius: 24,
        shadowOffset: {width: -7, height: 0},
        shadowOpacity: 0.1,
    },
    listContainer : {
        //backgroundColor: 'pink',
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 20,
        
    },
    songText : {

    },
    likeButton : {
        alignItems: 'flex-end',
        //backgroundColor: 'yellow',
        justifyContent: 'center',
    },
    allSongsLists : {
        paddingTop: 20,
    },
    flatListSongs: {
        height: '100%',
    }

});