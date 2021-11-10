import React, {useEffect, useState,} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import firebase from "firebase";
import MapView, {Marker} from "react-native-maps";
import Constants from "expo-constants";
import Ionicons from "react-native-vector-icons/Ionicons";

const RideDetails = ({navigation, route}) => {
    const initialState = { name: '',
        date: new Date(),
        distance: '',
        speed: '',
        description: '',
        organizer: '',
        attendees: [],
        startLatitude: 0,
        startLongitude: 0,
        startAddress: "",
    };
    const [user, setUser] = useState({});
    const [ride, setRide] = useState(initialState);
    const [attendees, setAttendees] = useState([])


    const dateString = () => {
        let date = new Date(ride.date);
        let day = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        return(day + "/" + month + "/" + year + " " + hours + ":" + minutes);
    };



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
                    setAttendees(Object.values(snapshot.val().attendees))
                })
        } catch (error) {
            console.log(error.message)
        }
    }, []);


    const handleJoinRide = () => {
        /*Skal bruge ride state i stedet for*/
       if(attendees.filter(e => e.uid === user.uid).length===0){
            firebase
                .database()
                .ref('Rides/'+route.params.id+'/attendees')
                    .push({uid: user.uid, username: user.displayName});
           try {
               firebase.database()
                   .ref()
                   .child(`Rides/${route.params.id}`)
                   .orderByKey()
                   .on('value', snapshot => {
                       setRide(snapshot.val());
                       setAttendees(Object.values(snapshot.val().attendees))
                   })
           } catch (error) {
               console.log(error.message)
           }
        } else {
        }
    }

    const showParticipants = () => {
        navigation.navigate("Ride Participants", {attendees: ride.attendees})
    }


    if(!ride) {
        return(
            <Text> Fetching ride details...</Text>
        )
    }

    const JoinButton = () => {
        if(Object.values(attendees).filter(e => e.uid === user.uid).length > 0) {
            return (
                <View style={styles.joinedButton}
                                  onPress={() => Alert.alert("You have already joined this ride")}>
                    <Text style={styles.joinRideButtonText}>Ride joined</Text>
                </View>
            )
        } else {
            return (
               <TouchableOpacity style={styles.joinRideButton} onPress={handleJoinRide}>
                <Text style={styles.joinRideButtonText}>Join ride</Text>
            </TouchableOpacity>
            )
        }
    }

    return (
        <ScrollView style={styles.ScrollContainer}>
            <MapView
                provider="google"
                style={styles.map}
                initialRegion={{
                    latitude: ride.startLatitude,
                    longitude: ride.startLongitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}

            >
                <Marker
                    coordinate={{latitude: ride.startLatitude, longitude: ride.startLongitude}}>
                </Marker>
            </MapView>
                <View style={styles.textContainer}>
                        <Text style={styles.pageHeader}> {ride.name}</Text>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.participantContainer} onPress={showParticipants}>
                            <Ionicons name="people-circle" size={30}/>
                            <Text> {attendees.length} participant(s)</Text>
                            <Ionicons name="chevron-forward-outline" size={15}/>
                        </TouchableOpacity>
                        <Text>{dateString()}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text><Text style={{color:"red"}}>Start location:</Text> {ride.startAddress}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text><Text style={{color:"red"}}>Distance:</Text> {ride.distance}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text><Text style={{color:"red"}}>Average speed: </Text> {ride.speed}</Text>
                    </View>
                    <View style={styles.row}>
                        {ride.description.length===0?
                        <Text style={{fontStyle:"italic"}}> No description available.</Text>
                        : <Text>{ride.description}</Text>}
                    </View>
            <View style={styles.joinRideButtonContainer}>
                <JoinButton/>
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
        backgroundColor: 'grey',
        width: 200,
        height: 50,
        borderRadius: 20,
        marginTop: 33,
        shadowColor: "grey",
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
