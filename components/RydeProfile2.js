import React, { useState, useEffect } from 'react';
import firebase from "firebase";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import func from '../functions/helperFunctions';

const RydeProfile = ({navigation, route}) => {
    const [profile, setProfile] = useState({});
    const [createdRidesCount, setCreatedRidesCount] = useState(0);
    const [user, setUser] = useState({});
    const [ownProfile, setOwnProfile] = useState(false);
    let uid;

    //let uid = route.params.profile.uid;
    if (!route.params) {
        uid = firebase.auth().currentUser.uid;
    } else {
        uid = route.params.profile.uid;
    }

    useEffect(() => {
        let currUser = firebase.auth().currentUser;
        setUser(currUser);

        try {
            firebase.database()
            .ref()
            .child(`users/${uid}`)
            .orderByKey()
            .on('value', snapshot => {
                let prof = Object.values(snapshot.val())[0]
                prof.key = Object.keys(snapshot.val())[0]


                setProfile(prof)
            })
        } catch (error){
            console.log(error.message)

        }

        //Kan ikke få det her til at virke ordentligt
/*
        try{
            firebase
                .database()
                .ref()
                .child('Rides')
                //.orderByChild('organizer/uid')
                //.equalTo(profile.uid) Hvorfor virker det her lort ikke???
                .on('value', snapshot => {
                    if (snapshot.val() !== null){



                    let rides = Object.values(snapshot.val())

                    //Manuel optælling af rides som man selv har lavet
                    let count = 0;
                    let i;
                    for(i=0; i<rides.length; i++){
                        if(rides[i].organizer.uid === profile.uid){
                            count ++;
                        }
                    }

                    setCreatedRidesCount(count);
                    }
                })
        }catch(e){
            console.error(e)
        }
        */



    }, []);
    const handleSignout = async () => {
        await firebase.auth().signOut();
    }

    if (!profile){
        return(
            <Text> Fetching user details...</Text>
        )
    }

    return (
      <View style={styles.container}>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{uri: 'https://www.cbs.dk/files/cbs.dk/styles/cbs_staff_list_view_images/public/sine-pic-18-web.jpg?itok=fw54u1lE'}}/>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={{fontSize: 18}}>Stats:</Text>
          <Text>RYDE user since: {func.date(profile.signedUp)} </Text>
            {/*createdRidesCount > 0 ?
                <Text>Number of created rides: {createdRidesCount}</Text>
            :   <Text>Number of created rides: 'none'</Text>
            */}

          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>John Doe</Text>
              <Text style={styles.info}>UX Designer / Mobile developer</Text>
              <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>

              <TouchableOpacity style={styles.buttonContainer}>
                <Text>Email: {profile.email}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer}>
                <Text>Phone: {profile.phone}</Text>
              </TouchableOpacity>
              {user.uid === uid ?
              <TouchableOpacity style={styles.buttonContainer} onPress={()=> navigation.navigate("Update Profile", {profile: profile})}>
                 <Text>Update info</Text>
              </TouchableOpacity> : null }
                {user.uid === uid ?
                    <View style={styles.signOutButtonContainer}>
                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignout}>
                        <Text style={styles.signOutButtonText}>Sign out</Text>
                    </TouchableOpacity>
                    </View>
                    : null}
            </View>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "red",
    height:100,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:30
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "red",
  },
    signOutButton: {
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
    signOutButtonText: {
        color:"white",
        fontSize: 25,
    },
    signOutButtonContainer: {
        alignItems: "center",
    },
});

export default RydeProfile;
