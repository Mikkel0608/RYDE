import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TextInput, Button, TouchableOpacity, ScrollView, Alert} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ModalDropdown from "react-native-modal-dropdown";
import firebase from "firebase";
import {SafeAreaView} from "react-native-web";
import * as Location from 'expo-location';
import {Accuracy} from "expo-location";




const Search = ({navigation}) => {
    const initialState = { date: new Date(), distance: '', speed: '', radius: ''};
    const [search, setSearch] = useState(initialState);
    const [hasLocationPermission, setlocationPermission] = useState(false)
    const [currentLocation, setCurrentLocation] = useState(null)


    const getLocationPermission = async () => {
        await Location.requestForegroundPermissionsAsync().then((item)=>{
            setlocationPermission(item.granted)
        } );
    };

    const updateLocation = async () => {
        await Location.getCurrentPositionAsync({accuracy: Accuracy.Balanced}).then((item)=>{
            setCurrentLocation(item.coords)
        });
   };
   updateLocation().then()

    useEffect(() => {
        const response = getLocationPermission()
        
    }, []);

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || search.date;
        setSearch({...search, date: currentDate
        })};

    const handleSearch = () => {
        let d = search.date;
        d.setHours(23, 59, 59, 0);

        if(d.getTime() < new Date().getTime() ){
            Alert.alert('Please select a valid date')
        } else {
            //updateLocation().then(d => {
              //  navigation.navigate("Search Results", {search: search, location: currentLocation})
            //})
            navigation.navigate("Search Results", {search: search, location: currentLocation})
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.pageHeader}>Explore</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Create new ride')} style={styles.newRideButton}>
                    <Text style={styles.newRideButtonText}> New </Text>
                </TouchableOpacity>
            </View>
            <View>
                <View style={styles.row}>
                    <Text style={styles.textLabels}>Choose date</Text>
                    <DateTimePicker style={styles.datePicker}
                                    value={search.date}
                                    is24Hour={true}
                                    mode={"date"}
                                    display="default"
                                    onChange={onChangeDate}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.textLabels}> Distance (km) </Text>
                    <ModalDropdown dropdownTextStyle={styles.textLabels} dropdownStyle={styles.distancePicker} textStyle={styles.textLabels}
                                   options={['0-20 KM', '20-40 KM', '40-60 KM', '60-80 KM', '80-100 KM', '100-120 KM', '120-140 KM']}
                                   onSelect={(index, value) => setSearch({...search, distance: value})}/>
                </View>
                <View style={styles.row}>
                    <Text style={styles.textLabels}> Average Speed (km/t) </Text>
                    <ModalDropdown dropdownTextStyle={styles.textLabels} dropdownStyle={styles.distancePicker} textStyle={styles.textLabels}
                                   options={['Beginner: 20 km/h', 'Intermediate: 25 km/h', 'Experienced: 30 km/h', 'Pro: 35+ km/h']}
                                   onSelect={(index, value) => setSearch({...search, speed: value})}/>
                </View>
                {
                 currentLocation !== null ?
                <View style={styles.row}>
                    <Text style={styles.textLabels}>Radius (km)</Text>
                    <TextInput style={styles.input}
                               selectionColor={"red"}
                               placeholder={"Specify"}
                               maxLength={50}
                               keyboardType={'number-pad'}
                               returnKeyType='done'
                               onChangeText={(value) => 
                                    setSearch({...search, radius: value})
                                }
                    />
                </View>
                : null}

                <View style={styles.searchButtonContainer}>
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>

                    {/*<Button style title="update location" onPress={updateLocation} />
                    */}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    newRideButton: {
        backgroundColor: 'red',
        width: 70,
        height: 30,
        borderRadius: 15,
        marginTop: 33,
        shadowColor: "red",
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 2,
        },
        shadowRadius: 3.84,
        justifyContent: "center",
        alignItems: "center"


    },
    newRideButtonText: {
        color:"white",
        fontSize: 20,
    },
    row: {
        marginVertical: 10,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey"
    },
    datePicker: {
        flex: 1,
        marginVertical: 10
    },
    textLabels: {
        fontSize: 20,
        marginVertical: 10,
    },
    distancePicker: {
        width: 300,
        height: 250,
        fontSize: 20,
    },
    input: {
        width: 170,
        fontSize: 20,
        textAlign: "right",
    },
    searchButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    searchButton: {
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
    searchButtonText: {
        color:"white",
        fontSize: 25,
    },
    }
)


export default Search;
