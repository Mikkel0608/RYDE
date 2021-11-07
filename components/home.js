import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import firebase from "firebase";
import RideView from "./rideView";
import RideViewSmall from "./rideViewSmall";

const Home = (props) => {
    const [user, setUser] = useState({});
    const [myRides, setMyRides] = useState([]);

    useEffect( () => {
        setUser(firebase.auth().currentUser);
        try {
            firebase.database()
                .ref()
                .child("Rides")
                .orderByChild("date")
                .startAt(new Date().getTime())
                .on('value', snapshot => {
                    const foundRides = Object.values(snapshot.val());
                    let filteredRides = [];
                   for (let i=0; i<foundRides.length; i++) {
                           for (let x = 0; x < foundRides[i].attendees.length; x++) {
                               try {
                               if (foundRides[i].attendees[x].uid === user.uid) {
                                   filteredRides.push(foundRides[i])
                                   setMyRides(filteredRides);
                               }
                           } catch(error) {
                       }
                       }
                   }
                })
        } catch (error) {
            console.log(error.message)
        }
        //Deps er sat til user, da det er det eneste der fungerer
        //Med tomt array loader den ikke turene nok. Uden deps ender den i infinite loop.
    },[user]);



    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.pageHeader}>Hello <Text style={{color:"red"}}>{firebase.auth().currentUser.displayName}</Text></Text>
            </View>

            <Text style={styles.label}>Your upcoming rides</Text>
            <View style={styles.horizontalScroller}>
                <FlatList horizontal={true} keyExtractor={(item, index) => index.toString()} data={myRides} renderItem={({item, index}) => {
                    return (
                        <View>
                            <TouchableOpacity>
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
