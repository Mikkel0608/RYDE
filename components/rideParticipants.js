import React from 'react';
import {Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

const RideParticipants = ({navigation, route}) => {

    const attendeeArray = Object.values(route.params.attendees);
    const attendeeKeys = Object.keys(route.params.attendees);
    const organizer = route.params.organizer;


    function showAttendeeProfile(profile_){
        navigation.navigate("Ryde Profile", {profile: profile_})
    }        

        return (
            <FlatList style={styles.container} data={attendeeArray} keyExtractor={(item, index) => attendeeKeys[index]} renderItem={({item, index}) => {
                let org='';
                if(item.uid === route.params.organizer.uid){
                    org = 'Organizer'
                }
                return (
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.rowText} onPress={()=> showAttendeeProfile(item)}>
                            <Text style={styles.rowText}>{item.username}</Text>
                        </TouchableOpacity>
                        <Text style={styles.rowText2}>{org}</Text>
                    </View>
                    
                )
            }}
            />
        )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    row: {
        marginVertical: 10,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
        textAlign: "left",
        height: 50,
    },
    rowText: {
        fontSize: 20,
    },
    rowText2: {
        fontSize: 15,
        color: 'grey'
    }
});

export default RideParticipants;
