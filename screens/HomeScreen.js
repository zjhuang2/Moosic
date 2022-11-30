import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Icon, makeStyles, FAB, Overlay } from "@rneui/base";
import { Divider, Input } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { LOAD_FEED } from "../data/Reducer";
import { saveAndDispatch } from "../data/DB";
import { getApps } from "firebase/app";
import { firebaseConfig } from "../Secrets";
import { onSnapshot, getFirestore, query } from "firebase/firestore";

function HomeScreen(props) {
  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const { navigation } = props;
  const feedList = useSelector((state) => state.feedList);
  const dispatch = useDispatch();

  const [feedListRender, setFeedListRender] = useState(feedList.newFeed);

  // Inputs
  const [inputSong, setInputSong] = useState("");
  const [inputArtist, setInputArtist] = useState("");
  const [inputCaption, setInputCaption] = useState("");
  const [inputMood, setInputMood] = useState("");
  const [inputUserId, setInputUserId] = useState("");

  useEffect(() => {
    const loadAction = { type: LOAD_FEED };
    saveAndDispatch(loadAction, dispatch);
    setFeedListRender(feedList.newFeed);
    console.log("========");
    console.log(feedListRender);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTextApp}>Moosic Feed</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Text style={{ color: "#e84878", fontSize: 18, top: 20 }}>
            My Profile
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.feed}>
        <FlatList
          data={feedListRender}
          renderItem={(post) => {
            return (
              <Post
                song={post.song}
                artist={post.artist}
                caption={post.caption}
                mood={post.mood}
                userId={post.userId}
                liked={post.liked}
                replies={post.replies}
              />
            );
          }}
        />
      </ScrollView>

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
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={styles.addPostOverlay}
      >
        <View>
          <View>
            <Text style={styles.headerText}>Post new Moosic</Text>
          </View>
          <View>
            <Input placeholder="Song" />
            <Input placeholder="Artist" />
            <Input placeholder="Your comments!" />
            <Input placeholder="How are you feeling?" />
          </View>
        </View>
      </Overlay>
    </View>
  );
}

function Post(props) {
  const { song, artist, caption, mood, userId, liked, replies } = props;
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
            <Icon name="favorite" type="material" color="grey" />
          )}
        </View>
      </View>
      <View
        style={{
          alignSelf: "flex-start",
          left: 24,
          marginVertical: 20,
          width: "100%",
        }}
      >
        <TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 5 }}>
            {song}
          </Text>
        </TouchableOpacity>
        <View style={styles.replyWidget}>
          <View style={{ flex: 0.3, justifyContent: "center" }}>
            <Icon name="image" size={48} type="material" />
          </View>
          <View style={{ flex: 0.5, justifyContent: "center" }}>
            <Text style={{ fontWeight: "600", fontSize: 18 }}>
              {/* {replies[0].song} */}
            </Text>
            {/* <Text>{replies[0].artist}</Text> */}
          </View>
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
  headerTextApp: {
    fontSize: 24,
    color: "#e84878",
    fontWeight: "bold",
    top: 20,
  },
  headerText: {
    fontSize: 24,
    color: "#e84878",
    fontWeight: "bold",
    margin: 10,
  },
  feed: {
    flex: 0.65,
    width: "100%",
  },
  moosicWidget: {
    width: "90%",
    borderWidth: 0,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    height: 180,
  },
  replyWidget: {
    width: "90%",
    borderWidth: 0,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    height: 70,
  },
  addPostOverlay: {
    flexDirection: "column",
    width: "90%",
    backgroundColor: "white",
  },
});

export default HomeScreen;
