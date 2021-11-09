import React, {useEffect, useState,} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import firebase from "firebase";
import MapView, {Marker} from "react-native-maps";
import Constants from "expo-constants";
import Ionicons from "react-native-vector-icons/Ionicons";

const RideDetails = ({navigation, route}) => {
    /*
    let currentUser = firebase.auth().currentUser
    let {displayName, email} = currentUser.providerData[0];
    let {uid} = currentUser;
    console.log(displayName, email, uid)
*/
    const [user, setUser] = useState({});
    const [joined, setJoined] = useState();
    const [ride, setRide] = useState();


    const dateString = () => {
        let date = new Date(route.params.item.date);
        let day = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        return(day + "/" + month + "/" + year + " " + hours + ":" + minutes);
    };

    /*Bliver nødt til at lave en query til databasen her i stedet, for ellers skal man gå ud og ind igen for at se ændringer i attendees*/
    /*og så lave en ny state for attendees der opdateres når der trykkes join*/
    let attendees = Object.values(route.params.item.attendees);



    useEffect(() => {
        let currUser = firebase.auth().currentUser;
        setUser(currUser);
        

        
        try {
            firebase.database()
                .ref()
                .child(`Rides/${route.params.id}`)
                .orderByKey()
                .on('value', snapshot => {
                    setRide(snapshot.val());
                })
        } catch (error) {
            console.log(error.message)
        }

    }, []);




    const handleJoinRide = () => {

        /*Skal bruge ride state i stedet for*/
       if(Object.values(ride.attendees).filter(e => e.uid === user.uid).length===0){
            firebase
                .database()
                .ref('Rides/'+route.params.id+'/attendees')
                    .push({uid: user.uid, username: user.displayName});
            navigation.navigate("Explore")
            Alert.alert("Ride joined")
           setJoined(true);
        } else {
                Alert.alert('Already joined')
            setJoined(true);
        }
    }

    const showParticipants = () => {
        navigation.navigate("Ride Participants", {attendees: route.params.item.attendees})
    }

    if(!ride) {
        return(
            <Text> Trip not found </Text>
        )
    } else{
        if(Object.values(ride.attendees).filter(e=> e.uid === user.uid).length ===1){
            //Her får jeg en fejl med at den re-render for mange gange
            //setJoined(true)
        }
    }

    return (
        <ScrollView style={styles.ScrollContainer}>
            <MapView
                provider="google"
                style={styles.map}
                initialRegion={{
                    latitude: route.params.item.startLatitude,
                    longitude: route.params.item.startLongitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}

            >
                <Marker
                    coordinate={{latitude: route.params.item.startLatitude, longitude: route.params.item.startLongitude}}>
                </Marker>
            </MapView>
                <View style={styles.textContainer}>
                        <Text style={styles.pageHeader}> {route.params.item.name}</Text>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.participantContainer} onPress={showParticipants}>
                            <Ionicons name="people-circle" size={30}/>
                            <Text> {Object.values(route.params.item.attendees).length} participant(s)</Text>
                            <Ionicons name="chevron-forward-outline" size={15}/>
                        </TouchableOpacity>
                        <Text>{dateString()}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text><Text style={{color:"red"}}>Start location:</Text> {route.params.item.startAddress}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text><Text style={{color:"red"}}>Distance:</Text> {route.params.item.distance}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text><Text style={{color:"red"}}>Average speed: </Text> {route.params.item.speed}</Text>
                    </View>
                    <View style={styles.row}>
                        {route.params.item.description.length===0?
                        <Text style={{fontStyle:"italic"}}> No description available.</Text>
                        : <Text>{route.params.item.description}</Text>}
                    </View>
            <View style={styles.joinRideButtonContainer}>

                {joined === true ?
                    <TouchableOpacity style={styles.joinedButton} onPress={()=> Alert.alert("You have already joined this ride")}>
                        <Text style={styles.joinRideButtonText}>Ride joined!</Text>
                    </TouchableOpacity>
                
                :   <TouchableOpacity style={styles.joinRideButton} onPress={handleJoinRide}>
                        <Text style={styles.joinRideButtonText}>Join ride</Text>
                    </TouchableOpacity> }

            </View>
            </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    ScrollContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    textContainer: {
        marginTop: 5,
        marginHorizontal: 10,
    },
    joinRideButton: {
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
    joinedButton: {
        backgroundColor: 'green',
        width: 200,
        height: 50,
        borderRadius: 20,
        marginTop: 33,
        shadowColor: "green",
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 2,
        },
        shadowRadius: 3.84,
        justifyContent: "center",
        alignItems: "center",
    },
    joinRideButtonText: {
        color:"white",
        fontSize: 25,
    },
    joinRideButtonContainer: {
        alignItems: "center",
    },
    map: {
        flex: 1,
        height: 300,
    },
    pageHeader: {
        marginVertical: 10,
        fontSize: 35,
        fontWeight: "bold",
        color: "grey",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    participantContainer : {
        width: "50%",
        flexDirection: "row",
        alignItems: "center",
    }

});

export default RideDetails;
