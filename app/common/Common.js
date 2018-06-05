/**
 * Created by Ryan on 2018/6/5.
 */


import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';


module.exports = {
    screenW: Dimensions.get('window').width,
    screenH: Dimensions.get('window').height
}