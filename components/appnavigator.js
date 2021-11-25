import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Search from "./explore";
import NewRide from './newRide';
import Home from './home'
import searchResult from "./searchResults";
import MapScreen from "./mapScreen";
import RideDetails from "./rideDetails";
import RideParticipants from "./rideParticipants";
import LogoHeader from "./logoHeader";
import RydeProfile from './RydeProfile2';
import UpdateProfile from './updateInfo';


const AppNavigator = ({navigation}) => {

    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();

    function StackNavigationExplore() {
        return(
            <Stack.Navigator>
                <Stack.Screen name="Search" component={Search} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>
                <Stack.Screen name="Create new ride" component={NewRide} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>
                <Stack.Screen name="Pick start location" component={MapScreen} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>
                <Stack.Screen name="Pick destination" component={MapScreen} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>
                <Stack.Screen name="Search Results" component={searchResult} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>
                <Stack.Screen name="Ride Details" component={RideDetails} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}, headerTransparent: true, headerTitle:"", headerBackTitle:"Back"}}/>
                <Stack.Screen name="Ride Participants" component={RideParticipants} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>
                <Stack.Screen name="Ryde Profile" component={RydeProfile} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>
                <Stack.Screen name="Update Profile" component={UpdateProfile} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>

            </Stack.Navigator>
        )
    }
    function StackNavigationHome() {
        return(
            <Stack.Navigator>
                <Stack.Screen name="HomePage" component={Home} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}, headerTitle: () => <LogoHeader/>}}/>
                <Stack.Screen name="Ride Details" component={RideDetails} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}, headerTransparent: true, headerTitle:"", headerBackTitle:"Back"}}/>
                <Stack.Screen name="Ride Participants" component={RideParticipants} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>
                <Stack.Screen name="Ryde Profile" component={RydeProfile} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>
                <Stack.Screen name="Update Profile" component={UpdateProfile} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>

            </Stack.Navigator>
        )
    }

    function StackNavigationProfile() {
        return(
            <Stack.Navigator>
                <Stack.Screen name="Ryde Profile" component={RydeProfile} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>
                <Stack.Screen name="Update Profile" component={UpdateProfile} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>
            </Stack.Navigator>
        )
    }


    return (
        <View style={styles.container}>
            <NavigationContainer>
                <Tab.Navigator screenOptions={{headerShown: false, tabBarActiveTintColor: "red"}}>
                    <Tab.Screen name={'Home'} component={StackNavigationHome} options={{tabBarIcon: ({color}) => ( <Ionicons name="home-outline" size={20} color={color}/>)}} />
                    <Tab.Screen name={'Explore'} component={StackNavigationExplore} options={{tabBarIcon: ({color}) => ( <Ionicons name="bicycle-outline" size={20} color={color}/>)}}/>
                    <Tab.Screen name={'You'} component={StackNavigationProfile} options={{tabBarIcon: ({color}) => ( <Ionicons name="person-outline" size={20} color={color}/>)}} />
                </Tab.Navigator>
            </NavigationContainer>
            <StatusBar style="auto" />
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
    },
    tabNavigator: {
        color:"red"
    }

});

export default AppNavigator;
