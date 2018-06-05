/**
 * Created by Ryan on 2018/5/28.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    NavigatorIOS
} from 'react-native';

import TabBar from '../navigator/TabBar'
import Login from '../login/Login'
import LaunchView from '../login/LaunchView'

export default class Navigator extends Component {
    render() {
        return (
            <NavigatorIOS
                initialRoute={{
                                component: TabBar,    // TabBar页面
                                title:''
                            }}
                translucent={true}
                barTintColor={'#605bf5'}
                titleTextColor={'#fff'}
                shadowHidden={false}
                style={styles.pageStyle}   // 此项不设置,创建的导航控制器只能看见导航条而看不到界面
                navigationBarHidden={true}
                interactivePopGestureEnabled = {true}
            />
        );
    }
}

const styles = StyleSheet.create({
    pageStyle: {
        flex: 1
    }
});
