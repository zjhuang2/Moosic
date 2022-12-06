import { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Button } from "react-native";
import { FAB } from "@rneui/base";
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

function MoodScreen(props) {

    const {navigation, route} = props;

    const [currUserId, setCurrUserId] = useState(auth.currentUser?.uid);
    const [yourSongs, setYourSongs] = useState([]);
    const [maximumMood, setMaximumMood] = useState(undefined);
    const [minimumMood, setMinimumMood] = useState(undefined);
    const [recommendedSongs, setRecommendedSongs] = useState([]);
    //this will be an object of all the moods
    const [moods, setMoods] = useState();

    useEffect(()=> {
        subscribeToSnapshot();
    }, []);

    function subscribeToSnapshot () {

        if (snapshotUnsubscribe) {
          snapshotUnsubscribe();
        }

        const q = query(
            collection(db, 'users', currUserId, 'songCollection'),
        ); 


        snapshotUnsubscribe = onSnapshot(q, (qSnap) => {
        let songsList = [];
        
        qSnap.docs.forEach((docSnap)=>{
            
            let song_info = docSnap.data();
            song_info.key = docSnap.id;
            songsList.push(song_info);

        });

        let filteredList = songsList.filter(elem => elem.liked === false);

        let moodObject = {}
        for (let i = 0; i < filteredList.length; i++) {
            let currentSong = filteredList[i];
            let currentMood = currentSong.mood.toLowerCase();

            if (currentMood in moodObject) {
                moodObject[currentMood] = moodObject[currentMood] + 1;
            } else {
                moodObject[currentMood] = 0
            }
        }
        setMoods(moodObject);
        setYourSongs(filteredList);
        });
    }    


    const grabMostMood = () => {
        let maxMood = Object.keys(moods).reduce(function(a, b){ return moods[a] > moods[b] ? a : b });
        setMaximumMood(maxMood);
        grabSongRecommendations(maxMood)
        return maxMood;
    }

    const grabSongRecommendations = async(mood) => {

        let baseURI = 'https://itunes.apple.com/search?media=music&entity=song&term=' + mood + '&limit=8';
        let result = await fetch(baseURI);
        let myJson = await result.json()

        let results = myJson['results'];

        let searchTerm = mood;
        let songsList = [];
        let artistNameList = [];
        for (let i = 0; i < results.length; i++) {
            let songObj = results[i];
            let artistName = songObj['artistName'];
            let songName = songObj['trackName'];
            if (artistNameList.includes(artistName)) {
                continue;
            } else {
                artistNameList.push(artistName);
            }

            
            let newSongObj = {
                artist: artistName,
                song: songName,
                mood: searchTerm
            }

            songsList.push(newSongObj);
        }

        setRecommendedSongs(songsList);
    }


    function SongRecommendations(props) {
        let {item} = props;

        return(
            <View style = {{paddingTop: 15,}}>
                <View style = {styles.songRecContainer}>
                    <Text style = {styles.songs}>{item.song} by {item.artist}</Text>
                </View>
            </View>
        )
    };


    return (
        <View>

            <View style = {styles.header}>
                <Text style = {styles.headerText}>Mood</Text>
                
                <View style = {styles.backButton}>
                    <Button
                        title = "Back"
                        onPress = {() => {
                            navigation.goBack();
                        }}
                    />
                </View>

            </View>

            <View style = {styles.intro}>
                <Text style = {styles.introText}>Curious about your top mood?</Text>
            </View>

            <FAB
                title = "Generate Top Mood"
                onPress={() =>{
                    grabMostMood();
                }}
            />

            <View style = {styles.moodContainer}>
                {maximumMood ? (<Text style = {styles.moodText}>You've felt {maximumMood.toUpperCase()} the most!</Text>):''}
                {maximumMood ? (<Text style = {styles.checkRecsText}>Want to listen to more songs that make you {maximumMood}? Check out these songs:</Text>): ''}
            </View>

            <View style = {styles.songRecsList}>
                <FlatList
                    data = {recommendedSongs}
                    renderItem = {({item}) => {
                        return (
                            <SongRecommendations item = {item}/>
                        )
                    }}
                />
            </View>



        </View>
    )
}

export default MoodScreen;

const styles = StyleSheet.create({ 

    header: {
        height: 122,
        backgroundColor: "#f5d7e0",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row",
    },
    headerText: {
        fontSize: 24,
        color: "#e84878",
        fontWeight: "bold",
        top: 20,
        alignItems: 'flex-start',
        flex: 1,
        paddingLeft: 60
      },
      backButton : {
        top: 20,
        right: 30,
      },
      intro: {
        paddingTop: 20,
        alignItems: 'center',
        paddingBottom: 20,
      }, 
      introText: {
        fontSize: 20,
        color: "#e84878",
        fontWeight: "bold",
      },
      moodContainer : {
        alignItems: 'center'
      },
      moodText : {
        paddingTop: 20,
        paddingBottom: 10,
        fontSize: 20,
        color: "#e84878",
        fontWeight: "bold",
      },
      checkRecsText : {
        color: "#e84878",
        fontSize: 15,
        width: '85%',
      },
      songRecsList : {
        paddingTop: 20,
        paddingLeft: 15,
      },
      songs: {
        fontSize: 15,
        
      },
      songRecContainer : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderStyle: 'solid',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingLeft: 20,
        paddingTop: 15,
        paddingBottom: 15,
        shadowRadius: 24,
        shadowOffset: {width: -7, height: 0},
        width: '95%'
        // shadowOpacity: 0.1,
      },


})
