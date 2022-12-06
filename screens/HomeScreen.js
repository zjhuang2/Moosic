import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Touchable,
} from "react-native";
import { Icon, makeStyles } from "@rneui/base";
import { Divider, Overlay, Input, Button } from "@rneui/themed";
import { useEffect, useState } from "react";

import { getAuth, signOut } from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "../Secrets";
import { onSnapshot, getFirestore, collection } from "firebase/firestore";
import {
  ADD_LIKED_SONG,
  ADD_POST_TO_FEED,
  ADD_TO_YOUR_SONGS,
} from "../data/Reducer.js";
import { saveAndDispatch } from "../data/DB.js";
import { useSelector, useDispatch } from "react-redux";
import { FAB } from "@rneui/base";

let app;
const apps = getApps();
if (apps.length == 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
const auth = getAuth(app);
const db = getFirestore(app);

function HomeScreen(props) {
  let feedList = useSelector((state) => state.feedList);

  const [displayName, setDisplayName] = useState("");
  const [currUserId, setCurrUserId] = useState(auth.currentUser?.uid);
  const [users, setUsers] = useState([]);
  const [feed, setFeed] = useState([]);

  // inputs
  const [inputSong, setInputSong] = useState("");
  const [inputArtist, setInputArtist] = useState("");
  const [inputCaption, setInputCaption] = useState("");
  const [inputMood, setInputMood] = useState("");

  const [overlayVisible, setOverlayVisible] = useState(false);
  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  useEffect(() => {
    onSnapshot(collection(db, "users"), (qSnap) => {
      let newUsers = [];
      qSnap.forEach((docSnap) => {
        let newUser = docSnap.data();
        newUser.key = docSnap.id;
        if (newUser.key === currUserId) {
          setDisplayName(newUser.displayName);
        }
        newUsers.push(newUser);
      });
      // console.log('currUserId:', currUserId)
      // console.log('updated users:', newUsers);
      setUsers(newUsers);
    });

    onSnapshot(collection(db, "moosicFeed"), (qSnap) => {
      let newFeed = [];
      qSnap.forEach((docSnap) => {
        let post = docSnap.data();
        post.key = post.id;
        newFeed.push(post);
      });
      setFeed(newFeed);
    });
  }, []);

  console.log(feed);

  const { navigation } = props;
  const dispatch = useDispatch();

  const addPost = (newSong, newArtist, newCaption, newMood, newUserId) => {
    const action = {
      type: ADD_POST_TO_FEED,
      payload: {
        song: newSong,
        artist: newArtist,
        caption: newCaption,
        liked: false,
        mood: newMood,
        userId: newUserId,
        replies: [],
        postTime: Date.now(),
      },
    };
    saveAndDispatch(action, dispatch);
  };

  const addToYourSong = (song, artist, caption, mood, replies, userId) => {
    const action = {
      type: ADD_TO_YOUR_SONGS,
      payload: {
        song: song,
        artist: artist,
        caption: caption,
        liked: false,
        mood: mood,
        replies: replies,
        userId: userId,
        userDocID: auth.currentUser?.uid,
      },
    };
    saveAndDispatch(action, dispatch);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Moosic Feed</Text>
        <TouchableOpacity
          onPress={async () => {
            await signOut(auth);
          }}
        >
          <Text style={{ color: "#e84878", fontSize: 18, top: 20 }}>
            Sign out
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.feed}>
        <FlatList
          data={feed}
          renderItem={(post) => {
            console.log("======");
            console.log(post);
            return (
              <Post
                song={post.item.song}
                artist={post.item.artist}
                caption={post.item.caption}
                liked={post.item.liked}
                mood={post.item.mood}
                userId={post.item.userId}
                replies={post.item.replies}
                postTime={post.item.postTime}
              />
            );
          }}
        />
      </View>

      <FAB
        title="Post"
        upperCase
        icon={{ name: "add", color: "white" }}
        color="#d14f8e"
        style={{ bottom: "10%", flex: 0.0001 }}
        size="large"
        onPress={toggleOverlay}
      />

      <Overlay
        isVisible={overlayVisible}
        onBackdropPress={toggleOverlay}
        overlayStyle={styles.addPostOverlay}
      >
        <View>
          <View>
            <Text style={styles.headerTextOverlay}>Post new Moosic</Text>
          </View>
          <View>
            <Input
              placeholder="Song"
              value={inputSong}
              onChangeText={(text) => setInputSong(text)}
            />
            <Input
              placeholder="Artist"
              value={inputArtist}
              onChangeText={(text) => setInputArtist(text)}
            />
            <Input
              placeholder="Your caption!"
              value={inputCaption}
              onChangeText={(text) => setInputCaption(text)}
            />
            <Input
              placeholder="How are you feeling?"
              value={inputMood}
              onChangeText={(text) => setInputMood(text)}
            />
          </View>
          <View>
            <Button
              color="secondary"
              onPress={() => {
                addPost(
                  inputSong,
                  inputArtist,
                  inputCaption,
                  inputMood,
                  displayName
                );

                addToYourSong(
                  inputSong,
                  inputArtist,
                  inputCaption,
                  inputMood,
                  [],
                  displayName
                );
                setInputArtist("");
                setInputSong("");
                setInputMood("");
                setInputCaption("");

                toggleOverlay();
              }}
            >
              Post
            </Button>
          </View>
        </View>
      </Overlay>
    </View>
  );
}

function Post(props) {
  const { song, artist, caption, mood, userId, liked, replies } = props;

  const dispatch = useDispatch();

  const addNewLikedSong = (props) => {
    const { song, artist, caption, mood, userId, liked, replies } = props;
    const action = {
      type: ADD_LIKED_SONG,
      payload: {
        song: song,
        artist: artist,
        caption: caption,
        mood: mood,
        userID: userId,
        liked: true,
        replies: replies,
        userDocID: auth.currentUser?.uid,
      },
    };
    saveAndDispatch(action, dispatch);
  };

  return (
    <View
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
      }}
    >
      <Text
        style={{
          margin: 10,
          fontSize: 20,
          color: "#d93269",
          fontWeight: "bold",
          alignSelf: "flex-start",
          left: 12,
        }}
      >
        {userId} is feeling: {mood}
      </Text>
      <View style={styles.moosicWidget}>
        <View
          style={{
            flexDirection: "column",
            flex: 0.3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="image" size={96} type="material" />
        </View>
        <View
          style={{
            flexDirection: "column",
            flex: 0.5,
            justifyContent: "center",
          }}
        >
          <View style={{ flex: 0.4 }}>
            <Text style={{ fontWeight: "700", fontSize: 20 }}>{song}</Text>
            <Text style={{ fontWeight: "500", fontSize: 14 }}>{artist}</Text>
          </View>
          <View style={{ flex: 0.3 }}>
            <Text>{caption}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            flex: 0.2,
            justifyContent: "center",
          }}
        >
          {liked ? (
            <Icon name="favorite" type="material" color="red" />
          ) : (
            <TouchableOpacity
              onPress={() => {
                //add to my song collection
                addNewLikedSong(props);
              }}
            >
              <Icon name="favorite" type="material" color="grey" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{ width: "60%" }}>
        <Button
          buttonStyle={{
            backgroundColor: "pink",
            marginTop: 10,
            height: 35,
            borderRadius: 20,
          }}
          titleStyle={{ fontWeight: "600", fontSize: 14, color: "#821a36" }}
        >
          Recommend a Song
        </Button>
      </View>

      <View
        style={{
          alignSelf: "flex-start",
          left: 24,
          marginVertical: 20,
          width: "100%",
        }}
      >
        <View></View>
        <FlatList
          data={replies}
          renderItem={(reply) => {
            return (
              <Comment
                userId={reply.item.userID}
                song={reply.item.song}
                artist={reply.item.artist}
              />
            );
          }}
        />
      </View>
      <Divider color="#ab2448" style={{ width: "80%" }} />
    </View>
  );
}

function Comment(props) {
  const { userId, song, artist } = props;
  return (
    <View>
      <TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 5 }}>
          {userId} recommends:
        </Text>
      </TouchableOpacity>
      <View style={styles.replyWidget}>
        <View style={{ flex: 0.3, justifyContent: "center" }}>
          <Icon name="image" size={48} type="material" />
        </View>
        <View style={{ flex: 0.5, justifyContent: "center" }}>
          <Text style={{ fontWeight: "600", fontSize: 18 }}>{song}</Text>
          <Text>{artist}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    flex: 0.15,
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
  },
  headerTextOverlay: {
    fontSize: 24,
    color: "#e84878",
    fontWeight: "bold",
    margin: 10,
  },
  feed: {
    flex: 0.85,
    width: "100%",
  },
  moosicWidget: {
    width: "90%",
    borderWidth: 0,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    height: 100,
  },
  replyWidget: {
    width: "90%",
    borderWidth: 0,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    height: 55,
    marginBottom: 10,
  },
  footerMenu: {
    flex: 0.1,
  },
  addPostOverlay: {
    flexDirection: "column",
    width: "90%",
    backgroundColor: "white",
  },
});

export default HomeScreen;
