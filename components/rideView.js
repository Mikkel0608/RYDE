import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from "react-native";
import MapView, {Marker} from "react-native-maps";
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "firebase";

const RideView = (props) => {
    const [joinedRide, setJoinedRide] = useState(false)

    useEffect(() => {
        //Denne løber igennem attendees array og kigger i hvert object om uid property er ens med den aktive brugers uid
        if(Object.values(props.attendees).filter(e => e.uid === firebase.auth().currentUser.uid).length>0) {
            setJoinedRide(true);
        }
    },[])

    const dateString = () => {
        let date = new Date(props.date)
        let day = date.getDate();
        let month = date.getMonth()+1
        let year = date.getFullYear()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        return(day + "/" + month + "/" + year + " " + hours + ":" + minutes)
    }

    return (
        <View style={styles.container}>
                <View style={styles.mapContainer}>
                    <MapView
                        provider="google"
                        style={styles.map}
                        initialRegion={{
                            latitude: props.latitude,
                            longitude: props.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}

                    >
                            <Marker
                            coordinate={{latitude: props.latitude, longitude: props.longitude}}>
                            </Marker>
                    </MapView>
                    <View style={styles.mapBlocker}>
                        {joinedRide === true ?
                            <View style={styles.joinedRideContainer}>
                            <Text style={styles.joinedRideText}><Ionicons name="checkmark-circle" size={20} color={"white"}/>Joined Ride</Text>
                        </View> : null}
                        <View style={styles.rideNameContainer}>
                            <Text style={styles.rideName}> {props.name}</Text>
                        </View>
                    </View>
            </View>
            <View style={styles.textContainer}>
                <View style={styles.row}>
                    <Text style={styles.labelLeft}>From {props.from}</Text>
                    <Text style={styles.labelRight}>{props.distance}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.labelLeft}>{dateString()}</Text>
                    <Text style={styles.labelRight}>{props.speed}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderColor: "black",
        borderRadius: 20,
        marginHorizontal: 25,
        marginVertical: 15,
        overflow: "hidden",
        borderWidth: 0.2,
        borderBottomColor: "grey",
        borderTopColor: "grey",
        borderRightColor: "grey",
        borderLeftColor: "grey",
    },
    mapContainer: {
        height: 150,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    textContainer: {
        backgroundColor: "white",
        height: 75,
        marginBottom: 15,
    },
    row: {
        marginTop: 10,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        height: "50%",
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        height: "125%",
    },
    mapBlocker: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: 'rgba(240, 52, 52, 0.2)',
        zIndex: 1,
    },
    rideNameContainer: {
        position: "absolute",
        bottom: 0,
    },
    rideName: {
        position: "absolute",
        bottom: 10,
        left: 5,
        color: "white",
        fontSize: 30,
    },
    labelLeft: {
        flexShrink: 1,
        width: "50%",
        textAlign: "left",
    },
    labelRight: {
        flexShrink: 1,
        width: "50%",
        textAlign: "right"
    },
    joinedRideContainer: {
        position: "absolute",
        top: 0,
    },
    joinedRideText: {
        position: "absolute",
        top: 10,
        left: 10,
        color: "white",
        fontSize: 15,
    }
});


export default RideView;
