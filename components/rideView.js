import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import MapView, {Marker} from "react-native-maps";
import Constants from 'expo-constants';
import * as Location from 'expo-location';

const RideView = (props) => {

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
                            coordinate={{latitude: props.latitude, longitude: props.longitude}}
                            >
                            </Marker>
                    </MapView>
                    <View style={styles.mapBlocker}>
                        <View style={styles.rideNameContainer}>
                            <Text style={styles.rideName}> {props.name}</Text>
                        </View>
                    </View>
            </View>
            <View style={styles.textContainer}>
                <View style={styles.row}>
                    <Text> From: {props.from}</Text>
                    <Text> To: {props.to}</Text>
                </View>
                <View style={styles.row}>
                    <Text> Date: {dateString()}</Text>
                    <Text> Speed: {props.speed}</Text>
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
        marginBottom: 10,
        backgroundColor: "white",

    },
    row: {
        marginVertical: 10,
        marginHorizontal: 5,
        flexDirection: "row",
        justifyContent: "space-between",
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
    }
});


export default RideView;
