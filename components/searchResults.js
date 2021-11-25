import React, {useEffect, useState} from 'react';
import {FlatList, Text, View, TouchableOpacity, StyleSheet, SafeAreaView} from "react-native";
import firebase from "firebase";
import RideView from "./rideView";
import getDistance from 'geolib/es/getDistance'


const searchResult = ({navigation, route}) => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchResultsKey, setSearchResultsKeys] = useState([]);
    let search = route.params.search;

    useEffect(() => {
        //console.log(route.params.location)
        //console.log(Object.values(search))

        try {



            firebase.database()
                .ref()
                .child("Rides")
                .orderByChild("date")
                .startAt(route.params.search.date.setHours(0,0,0,0))
                .endAt(route.params.search.date.setHours(23,59,59,59))
                .on('value', snapshot => {
                    if(snapshot.val() !== null){

                    //Laver et array af de forskellige filtre
                    //For at slippe for en masse if-statements når man skal filtrere forskellige søgninger
                    let filters = [];
                    let filterKeys = Object.keys(search);
                    let filterValues = Object.values(search)
                    for(let i=1; i<filterValues.length; i++){//i sættes til 1 da vi ikke skal bruge date, den er der allerede filtreret på

                        //if(filterValues[i] !== '' && filterKeys[i] !== 'radius'){ //Fjern her begrænsning på radius når det engang er lavet********************************************

                            filters.push(//array laves med filteret og værdien
                                {
                                    filter: filterKeys[i],
                                    val: filterValues[i]
                                }
                                )
                        //}
                    }


                    let res = Object.values(snapshot.val())
                    let key = Object.keys(snapshot.val())

                    let i;
                    let filteredResultValues = [];
                    let filteredResultKeys = [];
                    //console.log(res[0])

                    //let {longitude, latitude}; //HENT HER BRUGERENS LOKATION IND*******************************************

                    /*Der skal kun vises rides som ikke er cancelled*/
                    for (i=0; i<res.length; i++){
                        if(res[i].cancelled === 0){

                            //let {startLongitude, startLatitude} = res[i] //Her hentes turens startpunkter ind************************************************


                            let filterCount = 0;
                            filters.forEach((e, x) =>{
                                //Hvis der er et radius filter, gør da:
                                if (e.filter=== 'radius'){
                                    //let radius = e.val;

                                    let userLocation = {latitude: route.params.location.latitude, longitude: route.params.location.longitude};
                                    let rideLocation = {latitude: res[i].startLatitude, longitude: res[i].startLongitude}

                                    //bruger getDistance fra geolib library til at udregne afstanden i meter mellem user location og ride location
                                    let distanceToRide = getDistance(userLocation, rideLocation, 1);
                                    //Hvis afstanden er større end den angivne radius, skal de ikke med.
                                    if (distanceToRide<=e.val*1000) {
                                        filterCount++;
                                    }
                                    //Skriv her en funktion der kan finde afstanden i fugleflugt mellem de to punkter**************************************************
                                    //Hvis afstand i fugleflugt <= radius, øg da filterCount med én*********************************************************




                                } else if (res[i][e.filter] === e.val ){//Hvis det ikke er radius skal den bare kigge direkte på værdierne
                                        filterCount++;                      //Hvis filteret matcher resultatet øges filterCount for at holde styr på hvor mange 'matches' man har
                                }




                            })

                            if(filterCount === filters.length){//Hvis alle kriterierne er opfyldte, tilføjes turen til det endelige array

                                filteredResultValues.push(res[i]);
                                filteredResultKeys.push(key[i])

                            }
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
