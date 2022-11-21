import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image } from 'react-native';

import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';

import { Button } from '@rneui/themed';
import { firebaseConfig } from '../Secrets';

let app;
const apps = getApps();

if (apps.length == 0) { 
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}

const auth = getAuth(app);

function SigninBox({navigation}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.loginContainer}>
        <Image source={require('../picture/moosic.png')} 
        style = {styles.logo}
        />
      <Text style={styles.loginHeaderText}>Sign In</Text>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Email </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput 
            style={styles.loginInputBox}
            placeholder='enter email address' 
            autoCapitalize='none'
            spellCheck={false}
            onChangeText={text=>setEmail(text)}
            value={email}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Password </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput 
            style={styles.loginInputBox}
            placeholder='enter password' 
            autoCapitalize='none'
            spellCheck={false}
            secureTextEntry={true}
            onChangeText={text=>setPassword(text)}
            value={password}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <Button
          onPress={async () => {
            try {
              await signInWithEmailAndPassword(auth, email, password);
              navigation.navigate('Home');
            } catch(error) {
              Alert.alert("Sign Up Error", error.message,[{ text: "OK" }])
            }
          }}
        >
          Sign In
        </Button>  
      </View>
    </View>
  );
}


function SignupBox({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  return (
    <View style={styles.loginContainer}>
                <Image source={require('../picture/moosic.png')} 
        style = {styles.logo}
        />
      <Text style={styles.loginHeaderText}>Sign Up</Text>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Username </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput 
            style={styles.loginInputBox}
            placeholder='enter display name' 
            autoCapitalize='none'
            spellCheck={false}
            onChangeText={text=>setDisplayName(text)}
            value={displayName}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Email </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput 
            style={styles.loginInputBox}
            placeholder='enter email address' 
            autoCapitalize='none'
            spellCheck={false}
            onChangeText={text=>setEmail(text)}
            value={email}
          />
        </View>
      </View>

      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Password </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput 
            style={styles.loginInputBox}
            placeholder='enter password' 
            autoCapitalize='none'
            spellCheck={false}
            secureTextEntry={true}
            onChangeText={text=>setPassword(text)}
            value={password}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <Button
          onPress={async () => {
            try {
              const userCred = await createUserWithEmailAndPassword(auth, email, password);
              await updateProfile(userCred.user, {displayName: displayName});
            } catch(error) {
              Alert.alert("Sign Up Error", error.message,[{ text: "OK" }])
            }
          }}
        >
          Sign Up
        </Button>  
      </View>
    </View>
  );
}

function LoginScreen({navigation}) {

  const [loginMode, setLoginMode] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log('signed in! user:', user);
        navigation.navigate('Home');
      } else {
        console.log('user is signed out!');
        navigation.navigate('Login');
      }
    })
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        {loginMode?
          <SigninBox navigation={navigation}/>
        :
          <SignupBox/>
        }
        </View>
      <View styles={styles.modeSwitchContainer}>
        { loginMode ? 
          <Text>New user? 
            <Text 
              onPress={()=>{setLoginMode(!loginMode)}} 
              style={{color: 'blue'}}> Sign up </Text> 
            instead!
          </Text>
        :
          <Text>Already a user? 
            <Text 
              onPress={()=>{setLoginMode(!loginMode)}} 
              style={{color: '#FF5678'}}> Sign in </Text> 
            instead!
          </Text>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '50%'
  },
  bodyContainer: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'tan'
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: '30%',

    //backgroundColor: 'lightblue'
  },
  loginHeader: {
    width: '100%',
    padding: '3%',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'tan'
  },
  loginHeaderText: {
    fontSize: 20,
    color: 'black',
    paddingBottom: '5%',
    paddingTop: '10%',

  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    //backgroundColor: 'pink',
    padding: '3%'
  },
  loginLabelContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  loginLabelText: {
    fontSize: 18,
    padding: '10%'
  },
  loginInputContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%'
  },
  loginInputBox: {
    width: '100%',
    borderColor: '#FF5678',
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 12,
    padding: '5%'
  },
  modeSwitchContainer:{
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'black',
    paddingBottom: '50%'
  },
  loginButtonRow: {
    width: '100%',
    justifyContent: 'center', 
    alignItems: 'center',
    
  },
  listContainer: {
    flex: 1, 
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
  },
  logo: {
    height: 100,
    width: 100,

  },
  Button: {
    color: '#FF5678'
  }
});

export default LoginScreen;