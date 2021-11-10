import React, { useEffect, useState } from 'react';
import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import firebase from "firebase";



const RydeProfile = ({navigation, route}) => {

    const [profile, setProfile] = useState({});
    console.log(route.params.profile)
    const uid_ = route.params.profile.uid
/*
    function getUserData(uid) {
        firebase.database().ref('users/' + uid).once("value", snap => {
            console.log(snap.val())
        })
    }
   */ 
    useEffect(() => {
        
        

    }, []);

    return (
        <View>
            <Text>RYDE PROFILE</Text>
            <Text>Name: {route.params.profile.username}</Text>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    row: {
        marginVertical: 10,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
        textAlign: "left",
        height: 50,
    },
    rowText: {
        fontSize: 18,
    }
});

export default RydeProfile;
