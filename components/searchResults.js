import React, {useEffect, useState} from 'react';
import {FlatList, Text, View, TouchableOpacity, StyleSheet, SafeAreaView} from "react-native";
import firebase from "firebase";
import RideView from "./rideView";
import getDistance from 'geolib/es/getDistance'


//Handling the search results that gets viewed on screen
const searchResult = ({navigation, route}) => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchResultsKey, setSearchResultsKeys] = useState([]);
    let search = route.params.search;

    useEffect(() => {
        try {
            //Getting all rides within the selected date
            firebase.database()
                .ref()
                .child("Rides")
                .orderByChild("date")
                .startAt(route.params.search.date.setHours(0,0,0,0))
                .endAt(route.params.search.date.setHours(23,59,59,59))
                .on('value', snapshot => {
                    if(snapshot.val() !== null){

                    //Creating an array of the filters used by the user
                    //Firebase won't let us do compound queries, so...
                    let filters = [];
                    let filterKeys = Object.keys(search);
                    let filterValues = Object.values(search)
                    for(let i=1; i<filterValues.length; i++){//i is set to 1, since date is the first filter, and that one has already been filtered using firebase

                        if(filterValues[i] !== ''){ //If something has actually been entered in the filters field

                            filters.push(//array laves med filteret og værdien
                                {
                                    filter: filterKeys[i],
                                    val: filterValues[i]
                                }
                                )
                        }
                    }


                    let res = Object.values(snapshot.val()) //result values and keys
                    let key = Object.keys(snapshot.val())
                    
                    let filteredResultValues = []; //filtered result values and keys
                    let filteredResultKeys = [];
                    let i;
                    for (i=0; i<res.length; i++){
                        if(res[i].cancelled === 0){ //If the ride has a cancelled value of 1, then it should not be shown

                            let filterCount = 0; //Creating a count for every time a filter matches one of the rides 
                            filters.forEach((e, x) =>{ //Checking that the rides match every filter

                                if (e.filter=== 'radius'){

                                    let userLocation = {latitude: route.params.location.latitude, longitude: route.params.location.longitude};
                                    let rideLocation = {latitude: res[i].startLatitude, longitude: res[i].startLongitude}

                                    //Using getDistance from geolib library to calculate the distance i meters between user location and ride location
                                    let distanceToRide = getDistance(userLocation, rideLocation, 1);

                                    //Hvis afstanden er større end den angivne radius, skal de ikke med.
                                    //If the distance is less than or equal to the radius chosen by user, they are included
                                    if (distanceToRide<=e.val*1000) {
                                        filterCount++;
                                    }
                                } else if (res[i][e.filter] === e.val ){//All other filters than radius just looks directly at the values
                                        filterCount++;                      
                                }

                            })

                            //filtercount shows how many matches with the filters a ride has
                            if(filterCount === filters.length){

                                filteredResultValues.push(res[i]);
                                filteredResultKeys.push(key[i])

                            }
                        }
                    }
                    setSearchResultsKeys(filteredResultKeys)
                    setSearchResults(filteredResultValues);
                }
                })
        } catch (error) {
            console.log(error.message)
        }
    }, []);



    const handleSelectResult = (id, item) => {
        navigation.navigate("Ride Details", {id})
    }



    const resultArray = searchResults;
    const resultKeys = searchResultsKey;
    return (
        <View style={styles.container}>
                {searchResults.length > 0 ?
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
