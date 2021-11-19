import React, { useEffect, useState } from 'react';
import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import firebase from "firebase";

function getUserData(id) {
    let data;
    firebase.database()
    .ref()
    .child(`users/${id}`)
    .orderByKey()
    .on('value', snapshot => {
        return snapshot;
    })
}

const RydeProfile = ({navigation, route}) => {

    const [profile, setProfile] = useState({});
    // console.log(route.params.profile)
    const uid = route.params.profile.uid

 
    useEffect(() => {
        try {
            firebase.database()
            .ref()
            .child(`users/${uid}`)
            .orderByKey()
            .on('value', snapshot => {
                let prof = Object.values(snapshot.val())[0]
                                
                setProfile(prof)
            })
        } catch (error){
            console.log(error.message)

        }
        

        
        

    }, []);

    return (
        <View>
            <Text>RYDE PROFILE</Text>
            <Text>Name: {profile.name}</Text>
            <Text>email: {profile.email}</Text>
            <Text>phone: {profile.phone}</Text>
            <Text>email: {profile.photoUrl}</Text>

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
