import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Touchable,
} from "react-native";
import { Button, Icon, makeStyles } from "@rneui/base";
import { Divider } from "@rneui/themed";
import { useEffect, useState } from 'react';

import { getAuth, signOut } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../Secrets';
import { onSnapshot, getFirestore, collection } from 'firebase/firestore';

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
  const mockData = [
    {
      song: "Anti-Hero",
      artist: "Taylor Swift",
      caption: "This is my go-to blah music.",
      mood: "Sad",
      userID: "bumgeebear",
      liked: false,
      replies: [
        {
          song: "Message in a Bottle",
          artist: "Taylor Swift",
          userID: "loyola250",
        },
      ],
    },
    {
      song: "Higher Power",
      artist: "ColdPlay",
      caption: "I am feeling Inspired!",
      mood: "Inspired",
      userID: "chillwinds",
      liked: true,
      replies: [{ song: "Humankind", artist: "Coldplay", userID: "sourpatch" }],
    },
    {
      song: "Hotel California",
      artist: "Eagles",
      caption: "Bored moments call for nostalgias.",
      mood: "Bored",
      userID: "michigansaddlers",
      liked: true,
      replies: [{ song: "My Love", artist: "Westlife", userID: "amandal1999" }],
    },
  ];

  const [displayName, setDisplayName] = useState('');
  const [currUserId, setCurrUserId] = useState(auth.currentUser?.uid);
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    onSnapshot(collection(db, 'users'), qSnap => {
      let newUsers = [];
      qSnap.forEach(docSnap => {
        let newUser = docSnap.data();
        newUser.key = docSnap.id;
        if (newUser.key === currUserId) {
          setDisplayName(newUser.displayName);
        }
        newUsers.push(newUser);
      });
      console.log('currUserId:', currUserId)
      console.log('updated users:', newUsers);
      setUsers(newUsers);
    })
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerText}>Moosic Feed</Text>
        <TouchableOpacity>
          <Text style={{ color: "#e84878", fontSize: 18, top: 20 }}>
            My Profile
          </Text>
        </TouchableOpacity>

      </View>


      <Button
        onPress={async () => {
          await signOut(auth);
          //navigation.navigate('Login');
        }}
      >
        Now sign out!
      </Button>

      <ScrollView style={styles.feed}>
        <Post
          song={mockData[0].song}
          artist={mockData[0].artist}
          caption={mockData[0].caption}
          mood={mockData[0].mood}
          userID={mockData[0].userID}
          liked={mockData[0].liked}
          replies={mockData[0].replies}
        />

        <Post
          song={mockData[1].song}
          artist={mockData[1].artist}
          caption={mockData[1].caption}
          mood={mockData[1].mood}
          userID={mockData[1].userID}
          liked={mockData[1].liked}
          replies={mockData[1].replies}
        />

        <Post
          song={mockData[2].song}
          artist={mockData[2].artist}
          caption={mockData[2].caption}
          mood={mockData[2].mood}
          userID={mockData[2].userID}
          liked={mockData[2].liked}
          replies={mockData[2].replies}
        />
      </ScrollView>
      <View style={styles.footerMenu}>
        <Button
          title ="Add Post"
        />
      </View>
    </View>
  );
}

function Post(props) {
  const { song, artist, caption, mood, userID, liked, replies } = props;
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
        {userID} is feeling: {mood}
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
            {replies[0].userID}
          </Text>
        </TouchableOpacity>
        <View style={styles.replyWidget}>
          <View style={{ flex: 0.3, justifyContent: "center" }}>
            <Icon name="image" size={48} type="material" />
          </View>
          <View style={{ flex: 0.5, justifyContent: "center" }}>
            <Text style={{ fontWeight: "600", fontSize: 18 }}>
              {replies[0].song}
            </Text>
            <Text>{replies[0].artist}</Text>
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
  headerText: {
    fontSize: 24,
    color: "#e84878",
    fontWeight: "bold",
    top: 20,
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
  footerMenu: {
    flex: 0.1,
  },

});

export default HomeScreen;
