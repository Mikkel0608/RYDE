import React, {useState} from 'react';
import {Text, View, Image, StyleSheet, TextInput, TouchableOpacity, Alert} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import firebase from "firebase";

const LoginPage = ({navigation}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async() => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password).then((data)=>{
            });
        } catch (error){
            Alert.alert("An error occurred:" + error.message)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.loginContainer}>
                <Text style={styles.loginHeader}> Sign Up </Text>
                <Text style={styles.loginText}> Email </Text>
                <TextInput style={styles.input}
                           placeholder={"Type in email"}
                           onChangeText={(email) => setEmail(email)}
                           keyboardType={"email-address"}
                />
                <Text style={styles.loginText}> Password</Text>
                <TextInput style={styles.input}
                           placeholder={"Type in password"}
                           secureTextEntry={true}
                           onChangeText={(password) => setPassword(password)}
                />
                <View style={styles.loginButtonContainer}>
                    <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
                        <Text style={styles.loginButtonText}>Sign up</Text>
                    </TouchableOpacity>
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
        loginContainer: {
            marginHorizontal: 50,
        },
        loginText: {
            fontSize: 20,
            marginTop: 20,
        },
        loginHeader: {
            fontSize: 30,
            fontWeight: "bold",
            color: "grey",
            marginVertical: 20,
        },
        input: {
            height: 50,
            borderBottomColor: "grey",
            borderBottomWidth: 1,
        },
        loginButton: {
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
        loginButtonText: {
            color:"white",
            fontSize: 25,
        },
        loginButtonContainer: {
            alignItems: "center",
        },
        signupText: {
            marginTop: 30,
            color: "red",
            fontSize: 20,
        }
    }
)

export default LoginPage;
