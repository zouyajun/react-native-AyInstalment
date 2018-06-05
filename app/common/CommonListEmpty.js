/**
 * Created by Ryan on 2018/6/1.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';

const {width,height} = Dimensions.get('window')
export default class CommonListEmpty extends Component {
    render() {
        return (
            <View style={styles.container}>
               <Image
                    source={require('../images/common_bg_kong_n@2x.png')}
                    style={styles.emptyIconStyle}
               />
                <Text style={styles.infoTextStyle}>暂无记录</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        height: height - 49 -64 - 40
    },
    emptyIconStyle: {
        width: 180,
        height: 130,
        resizeMode: 'contain'
    },
    infoTextStyle: {
        fontSize: 16,
        color: '#999',
        marginTop: 30,
        textAlign: 'center'
    }

});
