/**
 * Created by Ryan on 2018/5/28.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay'
import NavigationBar from '../common/NavBarCommon'
import SetRate from './SetRate'
import OrderList from './OrderItemList'
import App from '../App'
import Login from '../login/Login'


let config = require('../common/Config')
let request = require('../common/Request')
let someStore = require('../common/RNAsyncStorage')
let storage = someStore.storage
let that
export default class MineTab extends Component {
    constructor(props) {
        super(props)
        that = this
        this.state = {
            visible: false,
            totalLimit: '0.00',
            remainLimit: '0.00'
        }
    }
    componentDidMount() {
        this._loadStorageData()
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='分期管理'/>
                <View style={styles.headerContainerStyle}>
                    <Text style={styles.smallTitleStyle}>诊所剩余额度（元）</Text>
                    <Text style={styles.bigTitleStyle}>{`¥ ${this.state.remainLimit}`}</Text>
                    <Text style={
                        [styles.smallTitleStyle,
                        {marginTop:0,marginBottom: 30}]}>{`总额度 ¥ ${this.state.totalLimit}`}</Text>
                </View>
                {this._renderSelectedItem('明细')}
                {this._renderSelectedItem('利息承担设置')}
                <TouchableOpacity onPress={() => this._logout()}>
                    <View style={styles.logoutViewStyle}>
                        <Text style={styles.logoutTextStyle}>注销</Text>
                    </View>
                </TouchableOpacity>

                <Spinner
                    visible={this.state.visible}
                    textContent='登录中...'
                    textStyle={{color: '#fff'}}
                />
            </View>
        );
    }
    /**
     *  退出登录
     */
    _logout() {
        Alert.alert(
            '提示',
             '确定退出？',
            [
                {text:'取消',onPress: () => {
                }},
                {text:'确定',onPress: () => {
                    /**  !! 清空map，移除所有"key-id"数据（但会保留只有key的数据） */
                    // storage.clearMap()
                    /** 单个key清除 */
                    storage.remove({
                        key: 'loginState',
                        id: 1001
                    })
                    /** 退出登录页面导航跳转（用一个新的路由替换掉当前的场景） */
                    that.props.navigator.replace({
                        component: Login
                    })
                }},
            ]
        )
    }

    /**
     *   获取诊所限制额度
     */
    _fetchHospitalLimitData(loginData) {
        let accessToken = loginData.Token.authorization
        let worker = loginData.Token.worker
        let limitURL = `${config.api.base}${config.api.getHospitalLimit}`
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
            'Worker': worker,
            'ChannelId': '1000005',
            'Hospital': '130670'
        }
        this._showHud(true)
        request.get(limitURL,null,headers)
            .then((data) => {
                console.log(data)
                that.setState({
                    totalLimit: data.TotalLimit,
                    remainLimit: data.RemainLimit,
                    visible: false
                })
            })
            .catch((error) => {
                console.log(error)
                that._showHud(false)
            })
    }
    /**
     * 读取本地化登录数据
     */
    _loadStorageData() {
        storage.load({
            key:'loginState',
            id: 1001
        }).then((data) => {
            that._fetchHospitalLimitData(data)
        }).catch((error) => {

        })
    }
    /**
     *  pushItemCell
     **/
    _renderSelectedItem(title) {
        return (
            <TouchableOpacity onPress={() => this._pushNav(title)}>
                <View style={styles.itemContainerStyle}>
                    <Text style={{fontSize: 16}}>{title}</Text>
                    <Text style={styles.iconStyle}>&#xe627;</Text>
                </View>
            </TouchableOpacity>
        )
    }
    /**
     *  导航跳转
     */
    _pushNav(title) {
        if (title == '明细') {
            this.props.navigator.push({
                component: OrderList,
                title: ''
            })
        }
        else {
            this.props.navigator.push({
                component: SetRate,
                title: ''
            })
        }
    }
    /**
     *  hud显示隐藏
     */
    _showHud(show) {
       this.setState({
           visible: show
       })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7fe'
    },
    headerContainerStyle: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    smallTitleStyle: {
        fontSize: 14,
        color: '#999',
        marginTop: 30
    },
    bigTitleStyle: {
        fontSize: 30,
        color: 'red',
        fontWeight: '500',
        marginVertical: 20
    },
    itemContainerStyle: {
        backgroundColor: '#fff',
        height: 44,
        borderBottomWidth: 1,
        borderBottomColor: '#dbdbdb',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between'
    },
    iconStyle: {
        fontFamily: 'iconfont',
        fontSize: 12,
        color: '#666'
    },
    logoutViewStyle: {
        marginHorizontal: 15,
        height: 44,
        marginTop: 20,
        backgroundColor: '#FF236F',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoutTextStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        color: '#fff',
    }
});
