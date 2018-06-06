/**
 * Created by Ryan on 2018/5/29.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    WebView
} from 'react-native';

let config = require('../common/Config')
let request = require('../common/Request')
let someStore = require('../common/RNAsyncStorage')
let storage = someStore.storage
let that
import NavigationBar from '../common/NavBarCommon'
export default class ProduceDetail extends Component {
    constructor(props) {
        super(props)
        that = this
        this.state = {
            url: '',
            title: '',
        }
    }
    componentDidMount() {
        console.log(this.props)
        this.setState({
            url: this.props.route.params.title,
            title: this.props.route.params.navTitle
        })
        this._loadStorageData()
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.state.title}
                    leftImage={require('../images/nav_back.png')}
                    leftAction={() => this._popNav()}
                    rightImage={require('../images/nav_share.png')}
                    rightAction={() => {
                        alert('分享看看')
                    }}/>
                <WebView
                    automaticallyAdjustContentInsets={false}
                    style={styles.webViewStyle}
                    source={{uri: this.state.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    startInLoadingState={true}
                />
            </View>
        );
    }
    /**
     *  导航返回
     */
    _popNav(){
        this.props.navigator.pop()
    }
    /**
     *  获取显示的URL
     */
    _fetchProductDetail(loginData) {
        let accessToken = loginData.Token.authorization
        let worker = loginData.Token.worker
        let productDetailURL = `${config.api.base}${config.api.productDetail}`
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
            'Worker': worker,
            'ChannelId': '1000005',
            'Hospital': '130670'
        }
        var params = {
            productId: this.props.route.params.productId
        }
        request.get(productDetailURL,params,headers)
            .then((data) => {
                console.log(data)
                that.setState({
                    url: data.Url,
                    title: data.Title
                })
            })
            .catch((error) => {

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
            that._fetchProductDetail(data)
        }).catch((error) => {

        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7fe'
    },
    webViewStyle: {

    }
});
