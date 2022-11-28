import { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Button, Image } from "react-native";
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

import { getAuth, signOut } from 'firebase/auth';


let app;
if (getApps().length == 0){
  app = initializeApp(firebaseConfig);
} 

const auth = getAuth(app);
const db = getFirestore(app);


let snapshotUnsubscribe = undefined;


function ProfileScreen(props) {

    const {navigation, route} = props;
    const dispatch = useDispatch();

    //state variables
    const [userName, setUserName] = useState('');
    const [userBio, setUserBio] = useState('');
   
    const [currUserId, setCurrUserId] = useState(auth.currentUser?.uid);

    const currentTabs = ['Your Songs', 'Liked']
    const [currentTab, setCurrentTab] = useState(currentTabs[0]);

    // maybe  use this
    const [currentTabList, setCurrentTabList] = useState([]);


    //This runs everytime I have a rerender (set state of any of my above variables)
    useEffect(()=> {
        const loadAction = {type: LOAD_USER};
        saveAndDispatch(loadAction, dispatch);
        subscribeToSnapshot();
        console.log("I'm on user: ", currUserId);
        //is there a way to run the laood lists in useEffect without it fucking up the first one???

    }, [currentTab]);


    const allUsers = useSelector((state)=> state.usersList);
    const allLikedSongs = useSelector((state) => state.likedSongsList);


    //This function grabs everything in the songCollections (your posts, likes)
    function subscribeToSnapshot () {
        //Will need to update userID to be the ID of the current user
        //REPLACE WITH CURRUSERID (state variable)
        //let userID = "me38ADJpJRVR25ILljkQ";

        if (snapshotUnsubscribe) {
          snapshotUnsubscribe();
        }
    
        const q = query(
        //   collection(db, 'users', userID, 'songCollection'),
        collection(db, 'users', currUserId, 'songCollection'),
        ); 


        snapshotUnsubscribe = onSnapshot(q, (qSnap) => {
        let songsList = [];
        
        qSnap.docs.forEach((docSnap)=>{
            let song_info = docSnap.data();
            song_info.key = docSnap.id;
            songsList.push(song_info);
            
        });

        //console.log("====MY UPDATED SONGS LIST: ", songsList);

        if (currentTab === 'Your Songs') {
            let filterYourPosts = songsList.filter(elem => elem.postedBy === 'me');
            setCurrentTabList(filterYourPosts);
        } else if (currentTab === 'Liked') {
            let filterLikedSongs = songsList.filter(elem => elem.liked === true);
            setCurrentTabList(filterLikedSongs);
        }
        });
    }    


    const deleteLikedSong = (songItem) => {
        let {key} = songItem;
        //console.log(key);
        console.log("LIKED SONG LIST IN DELETE FUNCTION: ", allLikedSongs);

        const action = {
            type: DELETE_LIKED_SONGS,
            payload: {
                key: key,
                currentLikedSongs: [...allLikedSongs]
            }
        }
        saveAndDispatch(action, dispatch);
    }


    // Thiis displays ALL songs (not just liked ones)
    function LikedSongListItem({item}) {
        console.log("THIS IS EACH ITEMGOIING INTO THE LIIST COMPONENT: ", item);
        return (
            <View style = {styles.listContainer}>
                <View style = {styles.individualSongContainer}>

                    <View>
                        <View style = {{flexDirection: 'row', marginVertical: 2}}>
                            <Ionicons name = 'person' size = {15} color = 'gray'/>
                            <Text>  {item.userID}</Text>
                        </View>
                        <Ionicons name = 'image' size = {80} color = 'gray'/>
                    </View>

                    <View style = {styles.songText}>

                        <Text style = {{fontSize: 20, fontWeight: '700'}}>{item.song}</Text>

                        <Text style = {{paddingTop: 5, paddingBottom: 15, fontWeight: '500'}}>{item.artist}</Text>

                        <Text style = {{fontSize: 15}}>I'm feeling {item.mood}</Text>
                    
                    </View>

                    <View style = {styles.likeButton}>

                        <TouchableOpacity
                            onPress={() => {
                                // console.log(item);
                                deleteLikedSong(item);
                            }}>
                                {item.liked == true?(<Ionicons name = 'heart' size = {25} color = 'red'/>): <Ionicons name = 'trash' size = {25} color = 'gray'/>}
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
                {/* Will need to update this with each user's own profile pic */}
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
    }, 
    header: {
        backgroundColor: "#f5d7e0",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row",
    }

});