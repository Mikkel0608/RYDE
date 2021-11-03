import React, {useEffect, useState,} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import firebase from "firebase";

const RideDetails = ({navigation, route}) => {
    /*
    let currentUser = firebase.auth().currentUser
    let {displayName, email} = currentUser.providerData[0];
    let {uid} = currentUser;
    console.log(displayName, email, uid)
*/
    const [user, setUser] = useState({});


    let attendees = Object.values(route.params.item.attendees);

    /*Fjerner undefined værdi fra attendees*/
    attendees = attendees.filter(function(x) {
        return x !== undefined;
    });


    useEffect(() => {
        let currUser = firebase.auth().currentUser
        setUser(currUser)
    });


    const handleJoinRide = () => {

        /*Tjekker om brugeren allerede er tilmeldt*/
       if(attendees.find(id => id == user.uid) == undefined){
            firebase
                .database()
                .ref('Rides/'+route.params.id+'/attendees')
                    .push(user.uid);

            console.log("Ride joined")
        }else {
            console.log("du er allerede tilmeldt")
        }
    }




    return (
        <View>
            <Text>Dette er ride details for ride navn: {route.params.item.name} og id: {route.params.id}</Text>
            <Text>Organiseret af: {route.params.item.organizer}</Text>

            <Text>Curr user: {user.uid}</Text>
            <Text>attendees: {attendees.length}</Text>


            <TouchableOpacity style={styles.signOutButton} onPress={handleJoinRide}>
                <Text style={styles.signOutButtonText}>Join ride!</Text>
            </TouchableOpacity>
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

export default RideDetails;
