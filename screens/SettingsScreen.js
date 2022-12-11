import { Icon, renderNode, Switch } from "@rneui/base";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Button } from "react-native";
import React from 'react';


function SettingsScreen(props) {
  
    return (

        <View>
            <View style = {styles.header}>
                <Text style = {styles.headerText}>Settings</Text>
            </View>
            <View style = {styles.list}>
                <Ionicons name = 'document-text-sharp' size = {40} color = 'gray'/>
                <Text style = {styles.listText}>Terms and Conditions</Text>
                <View style = {styles.listIcon1}>
                <Ionicons name = 'chevron-forward' size = {30} color = 'gray' paddingLeft = '10'/>
                </View>
            </View>


            <View style={{borderBottomColor: 'gray', borderBottomWidth: 1,}} />
            <View style = {styles.list}>
                <Ionicons name = 'lock-closed' size = {40} color = 'gray'/>
                <Text style = {styles.listText}>Privacy</Text>
                <View style = {styles.listIcon2}>
                <Ionicons name = 'chevron-forward' size = {30} color = 'gray' paddingLeft = '10'/>
                </View>
                

                
            </View>
            <View style={{borderBottomColor: 'gray', borderBottomWidth: 1,}} />
            <View style = {styles.list}>
                <Ionicons name = 'people-sharp' size = {40} color = 'gray'/>
                <Text style = {styles.listText}>Contact Us</Text>
                <View style = {styles.listIcon3}>
                <Ionicons name = 'chevron-forward' size = {30} color = 'gray' paddingLeft = '10'/>
                </View>

                
            </View>
            <View style={{borderBottomColor: 'gray', borderBottomWidth: 1,}} />
            <View style = {styles.list}>
                <Ionicons name = 'notifications' size = {40} color = 'gray'/>
                <Text style = {styles.listText}>Notification</Text>
                <View style={styles.container}>
            <Switch
                value={true}/>
            </View> 
              

            </View>

            <View style={{borderBottomColor: 'gray', borderBottomWidth: 1,}} />
            <View style = {styles.list}>
                <Ionicons name = 'remove-circle' size = {40} color = 'gray'/>
                <Text style = {styles.listText}>Do Not Disturb</Text>
        
                <View style={styles.container}>
            <Switch
                value={true}/>
            </View> 

    

            </View>


            <View style={{borderBottomColor: 'gray', borderBottomWidth: 1,}} />
            <View style = {styles.list}>
                <Ionicons name = 'md-grid-sharp' size = {40} color = 'gray'/>
                <Text style = {styles.listText}>Version</Text>
                <View style = {styles.listIcon6}>
                <Ionicons name = 'chevron-forward' size = {30} color = 'gray' paddingLeft = '10'/>
                </View>

            </View>
            
        </View>

    );
}

export default SettingsScreen;

const styles = StyleSheet.create({ 

    header: {
        height: 108,
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
      list: {
        //flex: 0.5,
        fontSize: 20,
        color: "black",
        flexDirection: "row",
        padding: 30
    
      },
      listText: {
        padding: 10,
        fontSize: 20
      },
      listIcon1:{
        paddingLeft: 60,
        paddingTop: 10
      },
      listIcon2:{
        paddingLeft: 180,
        paddingTop: 10
      },
      listIcon3:{
        paddingLeft: 140,
        paddingTop: 10
      },
      listIcon4:{
        paddingLeft: 140,
        paddingTop: 10
      },

        container: {
            flex: 1,
            paddingLeft: 90,
           // backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          },



      listIcon6:{
        paddingLeft: 170,
        paddingTop: 10
      }

})
