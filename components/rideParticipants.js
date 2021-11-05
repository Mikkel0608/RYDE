import React from 'react';
import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

const RideParticipants = ({navigation, route}) => {

    const attendeeArray = Object.values(route.params.attendees);
    const attendeeKeys = Object.keys(route.params.attendees);

    return (
        <FlatList style={styles.container} data={attendeeArray} keyExtractor={(item, index) => attendeeKeys[index]} renderItem={({item, index}) => {
            return (
                <View style={styles.row}>
                    <Text style={styles.rowText}>{item.username}</Text>
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
        fontSize: 18,
    }
});

export default RideParticipants;
