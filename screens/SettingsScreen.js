import { StyleSheet, View, Text, FlatList, TouchableOpacity, Button } from "react-native";


function SettingsScreen(props) {
    return (
        <View>
            <View style = {styles.header}>
                <Text style = {styles.headerText}>Settings</Text>
            </View>
        </View>
    )
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
})