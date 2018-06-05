/**
 * Created by Ryan on 2018/5/28.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    StatusBar,
    NavigatorIOS
} from 'react-native';

import LaunchView from './login/LaunchView'

let that
export default class App extends Component {

    constructor(props) {
        super(props)
        that = this
        this.state = {
            logined: false
        }
    }
    componentDidMount() {
        /**
         *   设置状态栏颜色
         */
        <StatusBar barStyle={'light-content' }/>
    }
    render() {
        return (
            <NavigatorIOS
                initialRoute={{
                                    component: LaunchView,
                                    title:''
                                }}
                style={{flex: 1}}   // 此项不设置,创建的导航控制器只能看见导航条而看不到界面
                navigationBarHidden={true}
                interactivePopGestureEnabled = {true}
            />
        );
    }
}
