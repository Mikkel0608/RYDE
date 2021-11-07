import React from 'react';
import {View, Image, StyleSheet, Text} from "react-native";

const LogoHeader = () => {
    return (
        <View style={styles.logoContainer}>
            <Image source={require('../assets/ryde-logo.png')} style={styles.logoStyle}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logoContainer: {
        alignItems: "center"
    },
    logoStyle: {
        height: 20,
        width: 100,
    },
});

export default LogoHeader;
