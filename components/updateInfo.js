import React, {useState} from 'react';
import {Text, View, Image, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import firebase from "firebase";

const UpdateProfile = ({navigation, route}) => {

    const [profile, setProfile] = useState(route.params.profile)
    

    //Creating states with initial states of the users' current data
    //If the properties don't exist in the database (they don't when a user is created), initial states are empty strings
    const [name, setName] = useState(profile.name);
    const [phone, setPhone] = useState(profile.phone);
    const [cyclingType, setCyclingType] = useState(profile.cyclingType !== undefined ? profile.cyclingType : '');
    const [description, setDescription] = useState(profile.description !== undefined ? profile.description : '');
    const [age, setAge] = useState(profile.age !== undefined ? profile.age : '');
    const [cyclingExperience, setCyclingExperience] = useState(profile.cyclingExperience !== undefined ? profile.cyclingExperience : '');



    //Updating user data in database using update method
    function updateUserData(updatedInfo) {
        const {phone, cyclingType, description, age, cyclingExperience} = updatedInfo;
        
        
        firebase.database()
            .ref(`users/${profile.uid}/${profile.key}`)
            .update({phone, cyclingType, description, age, cyclingExperience})
            .then(data =>{
                Alert.alert('Info updated!')

            navigation.navigate("Ryde Profile", {profile: profile});
        })
        .catch(error => {
            console.log(error.message)
        });
    }

    return (
        <ScrollView style={styles.ScrollContainer}>

        <View style={styles.container}>
            <View style={styles.loginContainer}>
                <Text style={styles.loginHeader}> Update RYDE Profile Info </Text>
                <Text style={styles.loginText}>Phone</Text>
                <TextInput style={styles.input}
                           placeholder={profile.phone}
                           onChangeText={(phone) => setPhone(phone)}
                />
                <Text style={styles.loginText}>Age</Text>
                <TextInput style={styles.input}
                           placeholder={profile.age === undefined ? '' : profile.age}
                           onChangeText={(age) => setAge(age)}
                />
                <Text style={styles.loginText}>Cycling experience (years)</Text>
                <TextInput style={styles.input}
                           placeholder={profile.cyclingExperience === undefined ? '' : profile.cyclingExperience}
                           onChangeText={(cyclingExperience) => setCyclingExperience(cyclingExperience)}
                />
                <Text style={styles.loginText}>Primary type of cycling</Text>
                <TextInput style={styles.input}
                           placeholder={profile.cyclingType === undefined ? '' : profile.cyclingType}
                           onChangeText={(cyclingType) => setCyclingType(cyclingType)}
                />
                <Text style={styles.loginText}>Short description</Text>
                <TextInput style={styles.input}
                           placeholder={profile.description === undefined ? '' : profile.description}
                           onChangeText={(description) => setDescription(description)}
                />
                <View style={styles.loginButtonContainer}>
                    <TouchableOpacity style={styles.loginButton} onPress={()=>updateUserData({name, phone, cyclingType, description, age, cyclingExperience})}>
                        <Text style={styles.loginButtonText}>Update</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    ScrollContainer: {
        flex: 1,
        backgroundColor: "white",
    },
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
            backgroundColor: '#ff3823',
            width: 200,
            height: 50,
            borderRadius: 20,
            marginTop: 33,
            shadowColor: "#ff3823",
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
            color: "#ff3823",
            fontSize: 20,
        }
    }
)

export default UpdateProfile;