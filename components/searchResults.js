import React, {useEffect, useState} from 'react';
import {FlatList, Text, View, TouchableOpacity, StyleSheet, SafeAreaView} from "react-native";
import firebase from "firebase";
import RideView from "./rideView";


const searchResult = ({navigation, route}) => {
    const [searchResults, setSearchResults] = useState();

    useEffect(() => {
        //const startDate = route.params.search.date.setHours(0,0,0,0);
        //const endDate = route.params.search.date.setHours(23,59,59,59);
        try {
            firebase.database()
                .ref()
                .child("Rides")
                .orderByChild("date")
                .startAt(route.params.search.date.setHours(0,0,0,0))
                .endAt(route.params.search.date.setHours(23,59,59,59))
                .on('value', snapshot => {
                    setSearchResults(snapshot.val());
                })
        } catch (error) {
            console.log(error.message)
        }
    }, []);

    if(!searchResults) {
        return(
            <Text> No trips found. Please search again. </Text>
        )
    }

    const handleSelectResult = (id, item) => {
        navigation.navigate("Ride Details", {id, item})
    }

    const resultArray = Object.values(searchResults);
    const resultKeys = Object.keys(searchResults);

    return (
        <View style={styles.container}>
                <FlatList data={resultArray} keyExtractor={(item, index) => resultKeys[index]} renderItem={({item, index}) => {
                    return (
                        <View>
                        <TouchableOpacity style={styles.container} onPress={() => handleSelectResult(resultKeys[index], item)}>
                            <RideView name={item.name} from={item.startAddress} distance={item.distance} date={item.date} speed={item.speed} latitude={item.startLatitude} longitude={item.startLongitude} attendees={item.attendees}/>
                        </TouchableOpacity>
                        </View>
                    )
                }}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tabBarLabelStyle: {
        color: "red",
    }

});

export default searchResult;
