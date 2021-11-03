import React from 'react';
import {StyleSheet, Text, View} from "react-native";

const RideView = (props) => {

    const dateString = () => {
        let date = new Date(props.date)
        let day = date.getDate();
        let month = date.getMonth()+1
        let year = date.getFullYear()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        return(day + "/" + month + "/" + year + " " + hours + ":" + minutes)
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text>Name: {props.name}</Text>
            </View>
            <View style={styles.row}>
                <Text> From: {props.from}</Text>
                <Text> To: {props.to}</Text>
            </View>
            <View style={styles.row}>
                <Text> Date: {dateString()}</Text>
                <Text> Speed: {props.speed}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderColor: "black",
        borderRadius: 20,
        shadowColor: "black",
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 2,
        },
        shadowRadius: 3.84,
    },
    row: {
        marginVertical: 5,
        marginHorizontal: 5,
        flexDirection: "row",
        justifyContent: "space-between",
    },
});


export default RideView;
