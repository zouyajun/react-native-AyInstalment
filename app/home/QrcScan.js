/**
 * Created by Ryan on 2018/5/29.
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

import NavigationBar from '../common/NavBarCommon'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast, {DURATION} from 'react-native-easy-toast'

let config = require('../common/Config')
let request = require('../common/Request')
let someStore = require('../common/RNAsyncStorage')
let storage = someStore.storage
const {width,height} = Dimensions.get('window')
let that
export default class QrcScan extends Component {
    constructor(props) {
        super(props)
        that = this
        this.state = {
            qrcImageUrl: '',
            visible: false
        }
    }
    componentDidMount() {

        this._loadStorageData()
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='爱牙分期申请二维码'
                    leftImage={require('../images/nav_back.png')}
                    leftAction={() => this._popNav()}/>
                <View style={{justifyContent: 'center',alignItems: 'center'}}>
                    <Text style={[styles.titleStyle,{marginTop: 30}]}>请申请人使用常用微信号</Text>
                    <Text style={styles.titleStyle}>扫描下方二维码进行扫描</Text>
                    <Image
                        source={{uri: this.state.qrcImageUrl}}
                        style={styles.qrcImageStyle}
                        defaultSource={require('../images/GQZ_QRCode@2x.png')}/>
                    <Text style={styles.tipInfoStyle}>温馨提示：您扫描的微信号为你后期接受账号提醒的唯一微信号</Text>
                </View>
                <Spinner
                    visible={this.state.visible}
                    textContent='登录中...'
                    textStyle={{color: '#fff'}}
                />
                <Toast
                    ref="toast"
                    position='center'
                    style={{padding: 15}}
                />
            </View>
        );
    }
    /**
     *  网络请求获取imageUrl
     */
    _fetchQRCImageUrl(loginData) {
        let accessToken = loginData.Token.authorization
        let worker = loginData.Token.worker
        let qrcURL = `${config.api.base}${config.api.getQRCImage}`
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
            'Worker': worker,
            'ChannelId': '1000005',
            'Hospital': '130670'
        }
        var params = {
            type: this.props.route.params.type
        }
        this._showSpannerHud(true)
        request.get(qrcURL,params,headers)
            .then((data) => {
                console.log(data)
                if (data && !that._isString(data)) {
                    that.setState({
                        qrcImageUrl: data.QrUrl,
                        visible: false
                    })
                } else  {
                    that._showSpannerHud(false)
                    that.refs.toast.show(data,300)
                }
            })
            .catch((error) => {
                console.log(error)
                that._showSpannerHud(false)
            })
    }
    /**
     * 读取本地化登录数据
     */
    _loadStorageData() {
        storage.load({
            key:'loginState'
        }).then((data) => {
            that._fetchQRCImageUrl(data)
        }).catch((error) => {

        })
    }
    /**
     *  导航返回
     */
    _popNav(){
        this.props.navigator.pop()
    }
    /**
     *  hud是否显示
     */
    _showSpannerHud(show) {
        this.setState({
            visible: show
        })
    }
    /**
     *  判断对象是否是字符串
     */
    _isString(obj){
        return Object.prototype.toString.call(obj) === "[object String]";
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    titleStyle: {
        fontSize: 18,
        marginTop: 20
    },
    qrcImageStyle: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginTop: 30
    },
    tipInfoStyle: {
        fontSize: 12,
        marginTop: 30,
        color: '#666',
        flexWrap: 'wrap',
        width: width - 80,
        textAlign: 'center',
        lineHeight: 20
    }
});
