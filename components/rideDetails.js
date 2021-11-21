import React, {useEffect, useState,} from 'react';
import {Alert, KeyboardAvoidingView, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Button, TextInput} from "react-native";
import firebase from "firebase";
import MapView, {Marker} from "react-native-maps";
import Constants from "expo-constants";
import Ionicons from "react-native-vector-icons/Ionicons";

const RideDetails = ({navigation, route}) => {
    const initialState = { name: '',
        date: new Date(),
        distance: '',
        speed: '',
        description: '',
        organizer: '',
        attendees: [],
        startLatitude: 0,
        startLongitude: 0,
        startAddress: "",
    };
    const [newComment, setNewComment] = useState('');
    const [user, setUser] = useState({});
    const [ride, setRide] = useState(initialState);
    const [attendees, setAttendees] = useState([])



    const dateString = (d) => {
        let date = new Date(d);
        let day = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        return(day + "/" + month + "/" + year + " " + hours + ":" + minutes);
    };


    useEffect(() => {
        let currUser = firebase.auth().currentUser;
        setUser(currUser);

        try {
            firebase.database()
                .ref()
                .child(`Rides/${route.params.id}`)
                .orderByKey()
                .on('value', snapshot => {
                    setRide(snapshot.val());
                    setAttendees(Object.values(snapshot.val().attendees))
                })
        } catch (error) {
            console.log(error.message)
        }
    }, []);

        if(!ride) {
            return(
                <Text> Fetching ride details...</Text>
            )
        }



    const handleJoinRide = () => {
        /*Skal bruge ride state i stedet for*/
        //if(joined === true){
        if(attendees.filter(e => e.uid === user.uid).length===0){
            firebase
                .database()
                .ref('Rides/'+route.params.id+'/attendees')
                    .push({uid: user.uid, username: user.displayName});
           try {
               firebase.database()
                   .ref()
                   .child(`Rides/${route.params.id}`)
                   .orderByKey()
                   .on('value', snapshot => {
                       setRide(snapshot.val());
                       setAttendees(Object.values(snapshot.val().attendees))
                   })
           } catch (error) {
               console.log(error.message)
           }
        }
    }

    function handleCancel (){
        let keys = Object.keys(ride.attendees);
        let values = Object.values(ride.attendees);

        let ride_key;
        let i;
        for(i=0; i<values.length; i++){
            if (values[i].uid === user.uid){
                ride_key = keys[i];
                break;
            }
        }

        let path = `Rides/${route.params.id}/attendees/${ride_key}`;
        try {
            firebase
                .database()
                .ref(path)
                .remove().then(data => console.log(data))
                Alert.alert('You are no longer signed up for this ride')
                navigation.navigate("HomePage")
        } catch(e){
            Alert.alert(error.message)
        }
    }

    const showParticipants = () => {
        navigation.navigate("Ride Participants", {attendees: ride.attendees, organizer: ride.organizer})
    }

    function showOrganizer (){
        navigation.navigate("Ryde Profile", {profile: ride.organizer})
    }

    function addComment (){
        if(newComment.length>0){

            var comment = {
                uid: user.uid,
                displayName: user.displayName,
                date: new Date().getTime(),
                comment: newComment
            }

            firebase
            .database()
            .ref(`Rides/${route.params.id}/comments`)
            .push(comment);
            setNewComment('');
        }
    }



    const deleteComment = (com_key, commenter) => {
        console.log(commenter)

        if(user.uid === commenter){
        Alert.alert(
            'Warning',
            'Delete the comment?',
             // <- this part is optional, you can pass an empty string
            [
              {text: 'OK', onPress: () => {
                let path = `Rides/${route.params.id}/comments/${com_key}`;
                try {
                    firebase
                        .database()
                        .ref(path)
                        .remove().then()
                } catch(e){
                    Alert.alert(error.message)
                }
              }},
              {text: 'No'}
            ],
          );
        }
      };

      const cancelRide = () =>{
        Alert.alert(
            'Warning',
            'Cancel the ride?',
            [
              {text: 'OK', onPress: () => {
                let path = `Rides/${route.params.id}`;
                try {
                    firebase
                        .database()
                        .ref(path)
                        .update({cancelled: 1}).then()
                        Alert.alert('cancelled')
                        navigation.navigate("HomePage")
                } catch(e){
                    Alert.alert(error.message)
                }
              }},
              {text: 'No'}
            ],
          );

      };






    const Comments = () =>{
        let commentArray;
        let commentKeys;

        if(ride.comments){
            commentArray = Object.values(ride.comments)
            commentKeys = Object.keys(ride.comments)

    }
        if(commentArray) {
        return (
            commentArray.map((item, index) => {
                return(
                <View style={styles.row2}>
                    <Text style={styles.dateText}>{dateString(item.date)}</Text>
                    <TouchableOpacity style={styles.rowText} onPress={()=> navigation.navigate("Ryde Profile", {profile: item})}>
                        <Text style={{fontSize: 15, color:'red'}}>{item.displayName}: </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rowText} onPress={()=>deleteComment(commentKeys[index], commentArray[index].uid)}>
                        <Text style={styles.rowText}>{item.comment}</Text>
                    </TouchableOpacity>
                </View>
                )
                })
        )
        } else {
            return (<Text/>)
        }
            /*
            <FlatList style={styles.container} data={commentArray} keyExtractor={(item, index) => commentKeys[index]} renderItem={({item, index}) => {
                return (
                    <View style={styles.row2}>
                        <Text style={styles.dateText}>{dateString(item.date)}</Text>
                        <TouchableOpacity style={styles.rowText} onPress={()=> navigation.navigate("Ryde Profile", {profile: item})}>
                            <Text style={{fontSize: 15, color:'red'}}>{item.displayName}: </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rowText} onPress={()=>deleteComment(commentKeys[index], commentArray[index].uid)}>
                            <Text style={styles.rowText}>{item.comment}</Text>
                        </TouchableOpacity>

                    </View>

                )
            }}
            />

             */


    }





    const JoinButton = () => {
        //if(joined === true){
        if(attendees.filter(e => e.uid === user.uid).length > 0) {
            return (
                <View style={styles.joinedButton}>
                    <Text style={styles.joinRideButtonText}>Ride joined</Text>
                </View>
            )
        } else {
            return (
               <TouchableOpacity style={styles.joinRideButton} onPress={handleJoinRide}>
                <Text style={styles.joinRideButtonText}>Join ride</Text>
            </TouchableOpacity>
            )
        }
    }


    const CancelButton = () => {
        if(ride.organizer.uid === user.uid){
            return (
                <TouchableOpacity style={styles.cancelButton} onPress={()=> cancelRide()}>
                    <Text style={styles.cancelRideButtonText}>Cancel ride</Text>
                </TouchableOpacity>
            )
        }

        if(attendees.filter(e => e.uid === user.uid).length === 1){
            return (
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelRideButtonText}>Unjoin</Text>
                </TouchableOpacity>
            )
        } else {
            return null;
        }
    }

    return (
        <ScrollView style={styles.ScrollContainer}>
            <KeyboardAvoidingView behavior="padding">

            <MapView
                provider="google"
                style={styles.map}
                initialRegion={{
                    latitude: ride.startLatitude,
                    longitude: ride.startLongitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}

            >
                <Marker
                    coordinate={{latitude: ride.startLatitude, longitude: ride.startLongitude}}>
                </Marker>
            </MapView>
                <View style={styles.textContainer}>
                        <Text style={styles.pageHeader}> {ride.name}</Text>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.participantContainer} onPress={showOrganizer}>
                            <Ionicons name="people-circle" size={30}/>
                            <Text> Organizer: {ride.organizer.username}</Text>
                            <Ionicons name="chevron-forward-outline" size={15}/>
                        </TouchableOpacity>
                        <Text>{dateString(ride.date)}</Text>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.participantContainer} onPress={showParticipants}>
                            <Ionicons name="people-circle" size={30}/>
                            <Text> {attendees.length} participant(s)</Text>
                            <Ionicons name="chevron-forward-outline" size={15}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <Text><Text style={{color:"red"}}>Start location:</Text> {ride.startAddress}, {ride.startPostal}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text><Text style={{color:"red"}}>Distance:</Text> {ride.distance}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text><Text style={{color:"red"}}>Average speed: </Text> {ride.speed}</Text>
                    </View>
                    <View style={styles.row}>
                        {ride.description.length===0?
                        <Text style={{fontStyle:"italic"}}> No description available.</Text>
                        : <Text><Text style={{color:"red"}}>Description:</Text> {ride.description}</Text>}

                    </View>
                    <View style={styles.row}>
                        {ride.comments ?
                        <Text style={{color:"black"}}>Comments:</Text>
                        : null }

                    </View>
                    <Comments/>



            <View style={styles.joinRideButtonContainer}>
                <TextInput style={styles.input}
                           selectionColor={"red"}
                           placeholder={"Add a comment!"}
                           onChangeText={(value) => setNewComment(value)}
                               />
                {newComment? <Button title="Add comment" onPress={addComment}></Button> : null }
                <JoinButton/>
                <CancelButton/>
            </View>
            </View>
            </KeyboardAvoidingView>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    ScrollContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    textContainer: {
        marginTop: 5,
        marginHorizontal: 10,
    },
    joinRideButton: {
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
    joinedButton: {
        backgroundColor: 'grey',
        width: 200,
        height: 50,
        borderRadius: 20,
        marginTop: 33,
        shadowColor: "grey",
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 2,
        },
        shadowRadius: 3.84,
        justifyContent: "center",
        alignItems: "center",
    },
    cancelButton: {
        width: 100,
        height: 30,
        borderRadius: 20,
        marginTop: 33,
        justifyContent: "center",
        alignItems: "center",
    },
    cancelRideButtonText: {
        color:"red",
        fontSize: 25,
    },
    joinRideButtonText: {
        color:"white",
        fontSize: 25,
    },
    joinRideButtonContainer: {
        alignItems: "center",
    },
    map: {
        flex: 1,
        height: 300,
    },
    pageHeader: {
        marginVertical: 10,
        fontSize: 35,
        fontWeight: "bold",
        color: "grey",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    participantContainer : {
        width: "50%",
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        width: 170,
        fontSize: 20,
        textAlign: "center",
    },
    row2: {
        marginVertical: 10,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
        textAlign: "left",
        height: 50,
    },
    rowText: {
        fontSize: 15,
    },
    dateText:{
        fontSize: 10,
        textAlign: 'right'
    },

});

export default RideDetails;
