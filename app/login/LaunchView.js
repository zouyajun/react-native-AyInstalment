/**
 * Created by Ryan on 2018/6/5.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';


import Common from '../common/Common'
/** 主页面（含导航控制器） */
import Navigator from '../navigator/Navigator'
/** 登录页 */
import Login from '../login/Login'
/** 引导页 */
import Guide from '../login/Guide'

let someStore = require('../common/RNAsyncStorage')
let storage = someStore.storage
let that
export default class LaunchView extends Component {
    constructor(props) {
        super(props)
        that = this
    }
    componentDidMount() {
        console.log(this.props.navigator)
        setTimeout(this._openApp,1500)
    }
    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={require('../images/lanuch.png')}
                    style={{width: Common.screenW,height: Common.screenH}}/>
            </View>
        );
    }
    /**
     * 启动页之后页面导航跳转逻辑
     */
    _openApp() {
        storage.load({
            key: 'FirstLogin'
        }).then((data) => {
            if (data.isFirst == 'false') {
                that.props.navigator.replace({
                    component: Navigator
                })
            }
        }).catch((error) => {
            storage.save({
                key: 'FirstLogin',
                id: 1002,
                data: {
                    isFirst: 'false'
                },
            }).then(() => {
                that.props.navigator.replace({
                    component: Login
                })
            }).catch((error) => {
                console.log('error',error)
            })
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7fe'
    }
});
