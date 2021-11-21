import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import firebase from "firebase";
import RideView from "./rideView";
import RideViewSmall from "./rideViewSmall";


const Home = ({navigation}) => {
    const [user, setUser] = useState({});
    const [myRideValues, setMyRideValues] = useState([]);
    const [myRideKeys, setMyRideKeys] = useState([]);

    let filteredRideKeys = [];
    let filteredRideValues = [];


    useEffect( () => {
        setUser(firebase.auth().currentUser);
        try {
            firebase.database()
                .ref()
                .child("Rides")
                .orderByChild("date")
                .startAt(new Date().getTime())
                .on('value', snapshot => {

                    if(snapshot.val() !== null){

                    
                    /*pga firebase struktur bliver vi nødt til at dele det op sådanne: id'er og værdier*/
                    let rideKeys = Object.keys(snapshot.val());
                    let rideValues = Object.values(snapshot.val());

                    /*Der loopes gennem de forskellige rides for at tjekke om brugeren har joinet dem*/
                   for (let i=0; i<rideValues.length; i++) {
                       console.log(rideValues[i].cancelled)
                       let rideAttendeesValues = Object.values(rideValues[i].attendees);

                       if(rideAttendeesValues.filter(e => e.uid === user.uid).length>0 && rideValues[i].cancelled !== 1) {

                           filteredRideKeys.push(rideKeys[i]);
                            filteredRideValues.push(rideValues[i])
                       }

                   }
                    setMyRideValues(filteredRideValues);
                    setMyRideKeys(filteredRideKeys);
                    filteredRideKeys = [];
                    filteredRideValues = [];
                    }
                })
        } catch (error) {
            console.log(error.message)
        }
        //Deps er sat til user, da det er det eneste der fungerer
        //Med tomt array loader den ikke turene nok. Uden deps ender den i infinite loop.
    },[user]);


    const handleRideDetails = (id) => {
        navigation.navigate("Ride Details", {id})
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.pageHeader}>Hello <Text style={{color:"red"}}>{firebase.auth().currentUser.displayName}</Text></Text>
            </View>

            {myRideValues.length> 0 ? <Text style={styles.label}>Your upcoming rides</Text>
            : <Text style={styles.label}>You have not yet signed up for any upcoming rides!</Text>}
            <View style={styles.horizontalScroller}>
                <FlatList keyExtractor={(item, index) => myRideKeys[index]} data={myRideValues} renderItem={({item, index}) => {
                    return (
                        <View>
                            <TouchableOpacity onPress={() => handleRideDetails(myRideKeys[index])}>
                                <RideViewSmall name={item.name} from={item.startAddress} distance={item.distance} date={item.date} speed={item.speed} latitude={item.startLatitude} longitude={item.startLongitude} attendees={item.attendees}/>
                            </TouchableOpacity>
                        </View>
                    )
                }}
                />

            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: "row",
        marginBottom: 50,
        marginHorizontal: 15,
        justifyContent: "space-between"

    },
    pageHeader: {
        fontSize: 40,
        fontWeight: "bold",
        marginTop: 20,
        color: "grey"
    },
    label: {
        fontSize: 20,
        fontWeight: "bold",
        color: "grey",
        marginHorizontal: 10,
    },
    horizontalScroller: {
    }
});
export default Home;
