/**
 * Created by Ryan on 2018/6/1.
 */


import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';

export default class LoadMoreFooter extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={true}
                    size='small'
                    style={{height: 40}}/>
                <Text style={styles.loadText}>{this.props.title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7fe',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'

    },
    loadText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10
    }
});
