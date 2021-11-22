import React, { useState, useEffect } from 'react';
import firebase from "firebase";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Button,
    Modal,
    ScrollView
} from 'react-native';
import func from '../functions/helperFunctions';
import Ionicons from "react-native-vector-icons/Ionicons";
import {Touchable} from "react-native-web";

const RydeProfile = ({navigation, route}) => {
    const [profile, setProfile] = useState({});
    const [createdRidesCount, setCreatedRidesCount] = useState(0);
    const [user, setUser] = useState({});
    const [menuVisible, setMenuVisible] = useState(false);


    let uid;
    //let uid = route.params.profile.uid;
    React.useLayoutEffect(() => {
        if (!route.params) {
            uid = firebase.auth().currentUser.uid;
                navigation.setOptions({
                    headerRight: () => (
                        <TouchableOpacity style={{paddingRight: 15}} onPress={handleMenu}>
                            <Ionicons name="ellipsis-horizontal" size={25} color={"red"}/>
                        </TouchableOpacity>
                    ),
                });
        } else {
            uid = route.params.profile.uid;
        }
    },[])

    const handleMenu = () => {
        setMenuVisible(true);
    };

    const handleUpdateProfile = () => {
        setMenuVisible(false);
        navigation.navigate("Update Profile", {profile: profile});
    };

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
        setMenuVisible(false);
        await firebase.auth().signOut();
    }

    if (!profile){
        return(
            <Text> Fetching user details...</Text>
        )
    }

    return (
      <ScrollView style={styles.container}>
          <View style={styles.headerContainer}>
              <View style={styles.header}/>
              <Image style={styles.avatar} source={{uri: 'https://www.cbs.dk/files/cbs.dk/styles/medium/public/irfan-kanat.jpg?itok=twumhyn9'}}/>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.row}>User since: {func.date(profile.signedUp)} </Text>
          </View>
            {/*createdRidesCount > 0 ?
                <Text>Number of created rides: {createdRidesCount}</Text>
            :   <Text>Number of created rides: 'none'</Text>
            */}

          <View style={styles.body}>
              <View style={styles.row}>
                  <Text><Text style={{color:"red"}}>Email:</Text> {profile.email}</Text>
              </View>
              <View style={styles.row}>
                  <Text><Text style={{color:"red"}}>Phone:</Text> {profile.phone}</Text>
              </View>
              <View style={styles.row}>
                  <Text><Text style={{color:"red"}}>Favorite cycling type:</Text> {profile.cyclingType}</Text>
              </View>
              <View style={styles.row}>
                  <Text><Text style={{color:"red"}}>Age:</Text> {profile.age}</Text>
              </View>
              <View style={styles.row}>
                  <Text><Text style={{color:"red"}}>Years of cycling experience:</Text> {profile.cyclingExperience}</Text>
              </View>
              <View style={styles.row}>
                  <Text><Text style={{color:"red"}}>Description:</Text> {profile.description}</Text>
              </View>
        </View>
          <Modal transparent={true}
                 visible={menuVisible}
                 animationType={"slide"}>
              <TouchableOpacity style={styles.transparentModal} onPress={() => {setMenuVisible(false)}}/>
              <View style={styles.editMenu}>
                  <View style={styles.rowMenuContainer}>
                  <TouchableOpacity style={styles.rowMenu} onPress={handleUpdateProfile}>
                      <Text style={{fontSize: 20, color: "grey"}}>Update profile</Text>
                  </TouchableOpacity>
                  </View>
                  <View style={styles.rowMenuContainer}>
                  <TouchableOpacity style={styles.rowMenu} onPress={handleSignout}>
                      <Text style={{fontSize: 20, color: "grey"}}>Sign out</Text>
                  </TouchableOpacity>
                  </View>
                  <View style={styles.rowMenuContainer}>
                  <TouchableOpacity style={styles.rowMenu} onPress={()=> {setMenuVisible(false)}}>
                      <Text style={{fontSize: 20, color: "red"}}>Cancel</Text>
                  </TouchableOpacity>
                  </View>
              </View>
          </Modal>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
    },
  header:{
    backgroundColor: "red",
    height:100,
  },
    headerContainer: {
      paddingBottom: 10,
      borderBottomWidth: 1,
        borderBottomColor: "grey",
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
    fontWeight: "600",
      paddingTop: 10,
      paddingBottom: 20,
      paddingLeft: 10,
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
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    editMenu: {
        justifyContent: "center",
        height: "20%",
        marginTop: "auto",
        backgroundColor: "white",
        alignItems: "center",
        shadowOpacity: 0.2,
        shadowColor: "grey",
    },
    transparentModal: {
        height: "80%",
        flex: 1,
    },
    rowMenuContainer: {
        marginBottom: 22,
        marginHorizontal: 10,
        flexDirection: "row",
    },
    rowMenu: {
      width: "100%",
        alignItems: "center",
    },
});

export default RydeProfile;
