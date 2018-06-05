/**
 * Created by Ryan on 2018/5/29.
 */


import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay'

const {width,height} =  Dimensions.get('window')
let someStore = require('../../app/common/RNAsyncStorage')
let storage = someStore.storage
let that
let config = require('../common/Config')
let request = require('../common/Request')

export default class HomeBottomList extends Component {
    constructor(props) {
        super(props)
        that = this
        let ds = new ListView.DataSource({
            rowHasChanged: (row1,row2) => row1 !== row2
        })
        this.state = {
            dataSource: ds.cloneWithRows([]),
            visible: false
        }
    }
    componentDidMount() {
        this._loadStorageData()
    }
    render() {
        return (
            <View style={styles.container}>
                <Spinner
                    visible={this.state.visible}
                    textContent='loading...'
                    textStyle={{color: '#333'}}
                />
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets = {false}
                />
            </View>
        );
    }
    /**
     *  渲染每个ItemCell
     */
    _renderRow(rowData) {
        return (
            <TouchableOpacity onPress={() => that._clickItemCell(rowData)}>
                <View style={styles.cellTopViewStyle}>
                    <Image
                        source={{uri:rowData.PhotoUrl}}
                        style={styles.iconStyle}/>
                    <Text style={styles.titleStyle}>{rowData.ProductName}</Text>
                    <Text style={styles.countTextStyle}>{rowData.NowNumber}人申请</Text>
                </View>
                <View style={styles.cellMiddleViewStyle}>
                    <View style={styles.itemStyle}>
                        <Text style={[styles.topTextStyle,{color: 'red'}]}>{`${rowData.AllowMinCost}~${rowData.AllowMaxCost}`}</Text>
                        <Text style={styles.topTextStyle}>{that._dealWithNumStr(rowData.InstalmentsNum)}</Text>
                        <Text style={styles.topTextStyle}>{`${rowData.SuccessRate}%`}</Text>
                    </View>
                </View>
                <View style={styles.cellBottomViewStyle}>
                    <View style={[styles.itemStyle,{marginBottom: 15}]}>
                        <Text style={styles.bottomTextStyle}>贷款额度（元）</Text>
                        <Text style={styles.bottomTextStyle}>期数</Text>
                        <Text style={styles.bottomTextStyle}>成功率</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => that._applyBtnClick()}>
                    <View style={styles.applyBtnStyle}>
                        <Text style={styles.applyTextStyle}>立即申请</Text>
                    </View>
                </TouchableOpacity>
                <View style={{height: 10}}></View>
            </TouchableOpacity>
        )
    }
    /**
     *  每个Item的点击事件
     */
    _clickItemCell(rowData) {
        if (this.props.callBack == null) return
        this.props.callBack(rowData.ProductName,rowData.ProductId)
    }
    /**
     *  立即申请点击事件
     */
    _applyBtnClick() {
        if (this.props.applyCallBack == null) return
        this.props.applyCallBack()
    }
    /**
     *  请求产品列表
     */
    _fetchMoreData(loginData) {

        let accessToken = loginData.Token.authorization
        let worker = loginData.Token.worker
        let homeURL = `${config.api.base}${config.api.home}`
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
            'Worker': worker,
            'ChannelId': '1000005',
            'Hospital': '130670'
        }
        this.setState({
            visible: true
        })
        request.get(homeURL, null, headers)
            .then((data) => {
                console.log('homeData', data.List)
                that.setState({
                    dataSource: that.state.dataSource.cloneWithRows(data.List),
                    visible: false
                })
            }).catch((error) => {
            this.setState({
                visible: false
            })
            console.log(error)
        })
    }
    /**
     * 读取本地化登录数据
     */
    _loadStorageData() {
        storage.load({
            key:'loginState'
        }).then((data) => {
            console.log('读取数据成功',data)
            that._fetchMoreData(data)
        }).catch((error) => {
            console.log('读取数据失败',error)
        })
    }
    /**
     *  处理分期数字符串
     */
    _dealWithNumStr(numStr) {
        var first = numStr.split(',')[0]
        return `${numStr.split(",")[0]}/${numStr.split(",")[1]}`
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7fe'
    },
    cellTopViewStyle: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingLeft: 15
    },
    cellMiddleViewStyle: {
        backgroundColor: '#fff'
    },
    cellBottomViewStyle: {
        backgroundColor: '#fff'
    },
    iconStyle: {
        width: 25,
        height: 25
    },
    titleStyle: {
        marginLeft: 10,
        fontSize: 16
    },
    countTextStyle: {
        fontSize: 12,
        color: '#666',
        borderColor: '#999',
        borderWidth: 0.5,
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 2,
        marginLeft: 10
    },
    itemStyle: {
        flexDirection: 'row',
        marginLeft: 50,
        width: width - 100,
        justifyContent: 'space-between',
        marginVertical: 5
    },
    topTextStyle: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500'
    },
    bottomTextStyle: {
        fontSize: 13,
        color: '#666',
    },
    applyBtnStyle: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopColor: '#dbdbdb',
        borderTopWidth: 1,
    },
    applyTextStyle: {
        fontSize: 16,
        color: '#605bf5',
        textAlign: 'center'
    }

});
