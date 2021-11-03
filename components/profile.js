import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import firebase from "firebase";

const Profile = ({navigation}) => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        setEmail(firebase.auth().currentUser.email)
    });

    const handleSignout = async () => {
        await firebase.auth().signOut();
    }

    return (
        <View style={styles.container}>
            <Text>Logget ind med bruger: {email}</Text>
            <View style={styles.signOutButtonContainer}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignout}>
                <Text style={styles.signOutButtonText}>Sign out</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    signOutButton: {
        backgroundColor: 'red',
        width: 200,
        height: 50,
        borderRadius: 20,
        marginTop: 33,
        shadowColor: "red",
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 2,
        },
        shadowRadius: 3.84,
        justifyContent: "center",
        alignItems: "center",
    },
    signOutButtonText: {
        color:"white",
        fontSize: 25,
    },
    signOutButtonContainer: {
        alignItems: "center",
    },

});

export default Profile;
