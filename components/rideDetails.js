import React from 'react';
import {Text} from "react-native";

const RideDetails = ({navigation, route}) => {
    return (
        <Text>Dette er ride details for ride navn: {route.params.item.name} og id: {route.params.id}</Text>
    )
}

export default RideDetails;
