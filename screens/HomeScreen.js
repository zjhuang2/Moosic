import { Button} from '@rneui/themed';
import { View, Text, StyleSheet, Image } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../Secrets';

let app;
const apps = getApps();

if (apps.length == 0) { 
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}

const auth = getAuth(app);

function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>


        <Image source={require('../picture/moosic.png')} 
        style = {styles.logo}
        />
      <Text>
        You're signed in!
      </Text>
      <Button
        onPress={async () => {
          await signOut(auth);
          navigation.navigate('Login');
        }}
        style = {styles.button}
      >

        sign out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    padding: '5%'


  },
  logo: {
    height: 200,
    width: 200,
    paddingTop: '20%'

  },
  button: {
    padding: '10%',
    borderRadius: 10
  }
});

export default HomeScreen;