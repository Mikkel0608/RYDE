import React, {useEffect, useState} from 'react';
import { useFocusEffect } from '@react-navigation/native'
import {StyleSheet, Text, View, Platform, Button, Alert, TextInput, TouchableOpacity, ScrollView, SafeAreaView} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalDropdown from 'react-native-modal-dropdown';
import firebase from "firebase";
import MapScreen from "./mapScreen";

const NewRide = ({navigation, route}) => {
    const initialState = { name: '',
        date: new Date(),
        distance: '',
        speed: '',
        description: '',
        organizer: '',
        attendees: [],
        startLatitude:"",
        startLongitude:"",
        startAddress: "",
    };
    const [newRide, setNewRide] = useState(initialState);

    //Bruger useEffect til at opdatere organizer og attendees felterne af newRide.
    useEffect(() => {
        const user = firebase.auth().currentUser;
        setNewRide({...newRide,
            organizer: {uid: user.uid, username: user.displayName},
            attendees: [newRide.attendees, {uid: user.uid, username: user.displayName}],
        })
        if(route.params?.startAddress) {
            setNewRide({...newRide,
                startAddress: route.params?.startAddress,
                startLatitude: route.params?.startCoordinates.latitude,
                startLongitude: route.params?.startCoordinates.longitude,
            })
        }
        //setNewRide({...newRide, attendees: [newRide.attendees, userUID]})
    }, [route.params]);
 /*
    useEffect(() => {
        setNewRide({...newRide,
            startAddress: route.params?.startAddress,
            startLatitude: route.params?.startCoordinates.latitude,
            startLongitude: route.params?.startCoordinates.longitude,
        })
        //setNewRide({...newRide, attendees: [newRide.attendees, userUID]})
    }, [route.params?.startAddress]);

    useEffect(() => {
        setNewRide({...newRide,
            endAddress: route.params?.endAddress,
            endLatitude: route.params?.endCoordinates.latitude,
            endLongitude: route.params?.endCoordinates.longitude,
        })
        //setNewRide({...newRide, attendees: [newRide.attendees, userUID]})
    }, [route.params?.endAddress]);

  */


    /*
    const addStart = () => {
        navigation.addListener('focus', () => {
            console.log(route.params.address)
            setNewRide({...newRide, startAddress: route.params.address})
        });
        navigation.navigate('Map');
    };
     */

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || newRide.date;
        setNewRide({...newRide, date: currentDate
        })};


    const handleCreate = async () => {
        //Setting the organizer to be the uid of the current logged in user
        //await setNewRide({...newRide, organizer: firebase.auth().currentUser.uid});
        //Pushing the users uid into attendees array
        //setNewRide({...newRide, attendees: [newRide.attendees, firebase.auth().currentUser.uid]})
        //console.log(newRide.attendees);
        newRide.date = newRide.date.getTime();
        const {name, date, distance, speed, description, organizer, attendees, startLatitude, startLongitude, startAddress} = newRide;
        if(name.length === 0 || distance.length === 0 || speed.length === 0 || startAddress === "") {
            Alert.alert("Please fill out both name, distance, speed and start location!")
        } else {
            try {
                firebase
                    .database()
                    .ref('/Rides/')
                    .push({ name, date, distance, speed, description, organizer, attendees, startLatitude, startLongitude, startAddress});
                Alert.alert(`Saved`);
                setNewRide(initialState);
                navigation.popToTop();
            } catch (error) {
                console.log(`Error: ${error.message}`)
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
        <ScrollView>
            <View>
                <Text style={styles.pageHeader}>Create a new ride</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.textLabels}> Name </Text>
                <TextInput style={styles.input}
                           selectionColor={"red"}
                           placeholder={"Type name..."}
                           maxLength={50}
                           onChangeText={(value) => setNewRide({...newRide, name: value})}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.textLabels}>Choose date</Text>
                <DateTimePicker style={styles.datePicker}
                    value={newRide.date}
                    is24Hour={true}
                    mode={"datetime"}
                    display="default"
                    onChange={onChangeDate}
                />
            </View>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Pick start location')}>
                <Text style={styles.textLabels}> Start Location </Text>
                <Text style={styles.textLabels}>
                    {newRide.startAddress}
                </Text>
            </TouchableOpacity>
            <View style={styles.row}>
                <Text style={styles.textLabels}> Distance </Text>
                <ModalDropdown dropdownTextStyle={styles.textLabels} dropdownStyle={styles.distancePicker} textStyle={styles.textLabels}
                               options={['0-20 KM', '20-40 KM', '40-60 KM', '60-80 KM', '80-100 KM', '100-120 KM', '120-140 KM']}
                               onSelect={(index, value) => setNewRide({...newRide, distance: value})}/>
            </View>
            <View style={styles.row}>
                <Text style={styles.textLabels}> Average Speed </Text>
                <ModalDropdown dropdownTextStyle={styles.textLabels} dropdownStyle={styles.distancePicker} textStyle={styles.textLabels}
                               options={['Beginner: 20 km/h', 'Intermediate: 25 km/h', 'Experienced: 30 km/h', 'Pro: 35+ km/h']}
                               onSelect={(index, value) => setNewRide({...newRide, speed: value})}/>
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={styles.textLabels}> Give your ride a description</Text>
                <TextInput blurOnSubmit={true}
                           multiline={true}
                           style={styles.descriptionInput}
                           placeholder={"Type a short description of your ride..."}
                           selectionColor={"red"}
                           onChangeText={(value) => setNewRide({...newRide, description: value})}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.createRideButton} onPress={handleCreate}>
                    <Text style={styles.createRideButtonText}>Create Ride</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            //flexDirection: "column",
        },
        pageHeader: {
            fontSize: 40,
            fontWeight: "bold",
            marginHorizontal: 15,
            marginTop: 20,
            color: "grey"
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
        descriptionContainer: {
            marginVertical: 10,
            marginHorizontal: 10,
            borderBottomWidth: 1,
            borderBottomColor: "lightgrey",
            height: 200,
        },
        descriptionInput: {
            fontSize: 20,
            textAlign: "left",
            flex: 1,
        },
        buttonContainer: {
          justifyContent: "center",
          alignItems: "center",
        },
        createRideButton: {
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
            createRideButtonText: {
                color:"white",
                fontSize: 25,
        },
    }
)

export default NewRide;
