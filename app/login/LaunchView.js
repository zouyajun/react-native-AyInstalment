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
        /**
         *  延时加载（异步读取本地数据）
         */
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
            key: 'FirstLogin',
            id: 1002
        }).then((data) => {
            console.log('isFirstFlag',data)
            /** 获取用户是否登录 */
            storage.load({
                key: 'loginState',
                id: 1001
            }).then(() => {
                /** 登录过，直接加载首页 */
                that.props.navigator.replace({
                    component: Navigator
                })
            }).catch((error) => {
                console.log(error)
                /** 未登录过，加载登录页面 */
                that.props.navigator.replace({
                    component: Login
                })
            })
        }).catch((error) => {
            console.log('开启奇幻之旅吧')
            that._saveFirstFlag()
        })
    }
    /**
     *  本地存储第一次打开app标识
     */
    _saveFirstFlag = () => {
        storage.save({
            key: 'FirstLogin',
            id: 1002,
            data: {
                isFirst: 'false'
            },
        }).then(() => {
            that.props.navigator.replace({
                component: Guide
            })

        }).catch((error) => {
            console.log('error',error)
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7fe'
    }
});
