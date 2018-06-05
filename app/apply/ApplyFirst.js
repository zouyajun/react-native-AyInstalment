/**
 * Created by Ryan on 2018/5/29.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import NavigationBar from '../common/NavBarCommon'
export default class ApplyFirst extends Component {
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='申请第一步'
                    leftImage={require('../images/nav_back.png')}
                    leftAction={() => this._popNav()}/>
            </View>
        );
    }
    /**
     *  导航返回
     */
    _popNav(){
        this.props.navigator.pop()
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7fe'
    }
});
