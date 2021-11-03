import React, {useState} from 'react';
import {Text, Button, SafeAreaView, View, StyleSheet, TouchableOpacity} from "react-native";
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import {Accuracy} from "expo-location";
import MapView, {Marker} from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";

const MapScreen = ({navigation, route}) => {
    const [userMarker, setUserMarker] = useState([])
    const [markerCoordinates, setMarkerCoordinates] = useState(null)
    const [markerAddress, setMarkerAddress] = useState(null)

    const handleLongPress = async event => {
        setUserMarker([]);
        const coordinate = event.nativeEvent.coordinate
        setUserMarker((oldArray) => [...oldArray, coordinate])
        setMarkerCoordinates(coordinate)
        await Location.reverseGeocodeAsync(coordinate).then((data) => {
                setMarkerAddress(data)
            }
        )
    };

    const handleSelectMarker = async coordinate =>{
        setMarkerCoordinates(coordinate)
        await Location.reverseGeocodeAsync(coordinate).then((data) => {
                setMarkerAddress(data)
            }
        )
    };

    const handleSubmit = () => {
        if(route.name==="Pick start location") {
            navigation.navigate("Create new ride", {startAddress: markerAddress[0].name, startCoordinates: markerCoordinates}, true)
        } else if (route.name==="Pick destination") {
            navigation.navigate("Create new ride", {endAddress: markerAddress[0].name, endCoordinates: markerCoordinates}, true)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                provider="google"
                style={styles.map}
                initialRegion={{
                    latitude: 55.9218,
                    longitude: 10.7472,
                    latitudeDelta: 5.22,
                    longitudeDelta: 5.0421,
                }}
                onLongPress={handleLongPress}
                >
                {userMarker.map((coordinate, index) => (
                    <Marker
                        coordinate={coordinate}
                        key={index.toString()}
                    />
                ))}
            </MapView>
            <View style={styles.addressBox}>
            {markerCoordinates && markerAddress && (
                    <Text style={styles.addressText}>
                        {markerAddress[0].name}, {markerAddress[0].region}
                    </Text>
            )}
                {!markerCoordinates && !markerAddress && (
                    <Text style={styles.addressText}>
                        Long press a location to select it
                    </Text>

                )}
            </View>
            {markerCoordinates && markerAddress && (
                <View>
                    <TouchableOpacity style={styles.acceptAddressButton} onPress={handleSubmit}>
                        <Ionicons name="checkmark-outline" size={30} color={"white"}/>
                    </TouchableOpacity>
                </View>
                )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    map: { flex: 1 },
    addressBox: {
        height: 50,
        width: 300,
        position: 'absolute',
        top: 20,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "center",
        flex: 1,
        borderRadius: 30,
        shadowColor: "red",
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 2,
        },
        shadowRadius: 3.84,
    },
    addressText: {
        fontSize: 15,
        color:"white"
    },
    acceptAddressButton: {
        backgroundColor: 'red',
        position: "absolute",
        width: 50,
        height: 50,
        bottom: 30,
        right: 30,
        borderRadius: 100,
        shadowColor: "red",
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 2,
        },
        shadowRadius: 3.84,
        justifyContent: "center",
        alignItems: "center",
    },
    acceptAddressButtonText: {
        color:"white",
        fontSize: 25,
    },
});

export default MapScreen;
