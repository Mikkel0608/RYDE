import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {LogBox, StyleSheet, Text, View} from 'react-native';
import firebase from 'firebase';
import { createStackNavigator } from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";
import LoginPage from "./components/auth/loginPage";
import SignUpPage from "./components/auth/signupPage";
import AppNavigator from "./components/appnavigator";


LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications'

const firebaseConfig = {
  apiKey: "AIzaSyBmGIDjwGzb-bh8jjREFXv6ZIdU3-tYarc",
  authDomain: "ryde-a6087.firebaseapp.com",
  projectId: "ryde-a6087",
  storageBucket: "ryde-a6087.appspot.com",
  messagingSenderId: "337215674321",
  appId: "1:337215674321:web:3bc3e00f16929c30c972f0",
  databaseURL: "https://ryde-a6087-default-rtdb.europe-west1.firebasedatabase.app/"
};


export default function App() {
    const [user, setUser] = useState({ loggedIn: false });

    const Stack = createStackNavigator();

    function StackNavigationAuth() {
        return(
            <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginPage} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>
                <Stack.Screen name="Sign Up" component={SignUpPage} options={{headerTintColor: "red", headerTitleStyle: {color: "black"}}}/>
            </Stack.Navigator>
            </NavigationContainer>
        )
    }

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    function onAuthStateChange(callback) {
        return firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback({loggedIn: true, user: user});
            } else {
                callback({loggedIn: false});
            }
        });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChange(setUser);
        return () => {
            unsubscribe();
        };
    }, []);

    //Tjekker om user state er sat til loggedin eller ej.
    return user.loggedIn ? <AppNavigator /> : <StackNavigationAuth />
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
