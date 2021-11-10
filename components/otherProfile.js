import React from 'react';
import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

const otherProfile = ({navigation, route}) => {
    let organizer = route.params.organizer;


    return (
        <View>
            <Text>RYDE PROFILE</Text>
            <Text>Name: {organizer.username}</Text>

        </View>
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

export default otherProfile;
