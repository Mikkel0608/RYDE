import React, {useEffect, useState} from 'react';
import {FlatList, Text, View, TouchableOpacity, StyleSheet, SafeAreaView} from "react-native";
import firebase from "firebase";
import RideView from "./rideView";


const searchResult = ({navigation, route}) => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchResultsKey, setSearchResultsKeys] = useState([]);

    useEffect(() => {
        console.log(searchResults)
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

                    if(snapshot.val() !== null){

                    let res = Object.values(snapshot.val())
                    let key = Object.keys(snapshot.val())

                    let i;
                    let filteredResultValues = [];
                    let filteredResultKeys = [];

                    /*Der skal kun vises rides som ikke er cancelled*/
                    for (i=0; i<res.length; i++){
                        if(res[i].cancelled === 0){
                            filteredResultValues.push(res[i]);
                            filteredResultKeys.push(key[i])
                        }
                    }


                    setSearchResultsKeys(filteredResultKeys)
                    setSearchResults(filteredResultValues);

                    //gammel kode, hvis man ikke fjerner cancelled rides
                    //setSearchResults(snapshot.val());
                }
                })
        } catch (error) {
            console.log(error.message)
        }
    }, []);



    const handleSelectResult = (id, item) => {
        navigation.navigate("Ride Details", {id})
    }


    //gammel kode, før cancel
    //const resultArray = Object.values(searchResults);
    //const resultKeys = Object.keys(searchResults);


    const resultArray = searchResults;
    const resultKeys = searchResultsKey;

    return (
        <View style={styles.container}>
                {searchResults.length > 0 ?<FlatList data={resultArray} keyExtractor={(item, index) => resultKeys[index]} renderItem={({item, index}) => {
                    return (
                        <View>
                        <TouchableOpacity style={styles.container} onPress={() => handleSelectResult(resultKeys[index], item)}>
                            <RideView name={item.name} from={item.startAddress} distance={item.distance} date={item.date} speed={item.speed} latitude={item.startLatitude} longitude={item.startLongitude} attendees={item.attendees}/>
                        </TouchableOpacity>
                        </View>
                    )
                }}
                />
                :<Text> No trips found. Please search again. </Text>}
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
