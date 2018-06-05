/**
 * Created by Ryan on 2018/5/29.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    SectionList,
    TouchableOpacity
} from 'react-native';

import NavigationBar from '../common/NavBarCommon'
import ApplyDetail from '../apply/ApplyDetail'

import Spinner from 'react-native-loading-spinner-overlay'
let config = require('../common/Config')
let request = require('../common/Request')
let someStore = require('../common/RNAsyncStorage')
let storage = someStore.storage
let that
export default class OrderItemList extends Component {
    constructor(props) {
        super(props)
        that = this
        this.state = {
            totalList:[], // 数据源
            visible: false
        }
    }
    componentDidMount() {
        this._loadStorageData()
    }
    /**
     *  跳转分期详情页面
     */
    _pushNav(orderId) {
        this.props.navigator.push({
            component: ApplyDetail,
            title: '',
            params: {
                orderId: orderId
            }
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='明细'
                    leftImage={require('../images/nav_back.png')}
                    leftAction={() => this._popNav()}/>
                <SectionList
                    automaticallyAdjustContentInsets={false}
                    keyExtractor={this._keyExtractor}
                    sections={this.state.totalList}
                    renderSectionHeader={this._sectionComp}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this._itemSeparatorComponent}
                    onRefresh={this._refreshing}
                    refreshing={false}
                    ref
                    />
                <Spinner
                    visible={this.state.visible}
                    textContent='登录中...'
                    textStyle={{color: '#fff'}}
                />
            </View>
        );
    }
    /**
     *   指定刷新位置，减少重新渲染开销
     */
    _keyExtractor = (item,index) => index
    /**
     *  分组section组件
     */
    _sectionComp = ({section}) => {
        return (
            <View style={styles.sectionHeaderStyle}>
                <Text style={styles.sectionTextStyle}>{section.title}</Text>
                <Text style={[styles.sectionTextStyle,{color: '#605bf5'}]}>{`¥${section.totalAmount}`}</Text>
            </View>
        )
    }
    /**
     *   单个Cell组件
     */
    _renderItem = ({item}) => {
        var formateDate = item.AddTime.split('T')[0]
        return (
            <TouchableOpacity onPress={() =>this._pushNav(item.OrderId)}>
                <View style={styles.itemContainerStyle}>
                    <View style={styles.topViewStyle}>
                        <Text style={styles.topLeftTextStyle}>{item.ProductName}</Text>
                        <Text style={styles.topRightTextStyle}>{`¥ ${item.AmountApp}`}</Text>
                    </View>
                    <View style={styles.bottomViewStyle}>
                        <Text style={styles.bottomLeftTextStyle}>{item.PatientName}</Text>
                        <Text style={styles.bottomRightTextStyle}>{formateDate}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    /**
     *  行内分割线
     */
    _itemSeparatorComponent() {
        return (
            <View style={{backgroundColor: "#dbdbdb", height: 1}}/>
        )
    }
    /**
     *   下拉刷新
     */
    _refreshing() {

    }
    /**
     *  加载更多
     */
    _loadMore(loginData) {
        let accessToken = loginData.Token.authorization
        let worker = loginData.Token.worker
        let productDetailURL = `${config.api.base}${config.api.DetailItemList}`
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
            'Worker': worker,
            'ChannelId': '1000005',
            'Hospital': '130670'
        }
        var params = {
            pageSize: 20,
            pageIndex: 1
        }
        that._showHud(true)
        request.get(productDetailURL,params,headers)
            .then((data) => {
                console.log(data)
                that._showHud(false)
                that._dealWithResData(data)
            })
            .catch((error) => {
                that._showHud(false)
                console.log(error)
            })
    }
    /**
     *  接口返回的数据进行分组处理
     */
    _dealWithResData(result) {
        var titleList = []  // 分组标题
        var sectionDic = {} // 分组标题数据绑定
        var totalAmountList = [] // 分组标题金额
        result.Items.forEach(item => {
            var keyStr = item.AddTime.split('T')[0].split('-')[1];
            keyStr = `${keyStr}月`
            if (titleList.indexOf(keyStr) > -1) {
                var list = sectionDic.keyStr
                list.push(item.List)
            } else {
                titleList.push(keyStr)
                var itemList = item.List
                sectionDic[keyStr] = itemList
                totalAmountList.push(item.AmountTotal)
            }
        });
        console.log("sectionDict:",sectionDic);
        var tempTotalList = []
        titleList.forEach((item,idx) => {
            var tempList = sectionDic[item]
            var total = totalAmountList[idx]
            var tempTitle = item;
            var arrItem = {
                title: tempTitle,
                data: tempList,
                key: idx,
                totalAmount: total
            };
            tempTotalList.push(arrItem);
        })
        this.setState({
            totalList: tempTotalList
        })
        console.log('TotalList:',tempTotalList);
    }
    /**
     * 读取本地化登录数据
     */
    _loadStorageData() {
        storage.load({
            key:'loginState'
        }).then((data) => {
            that._loadMore(data)
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
     *   显示隐藏HUD
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
    sectionHeaderStyle: {
        backgroundColor: '#f4f7fe',
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        alignItems: 'center'
    },
    sectionTextStyle: {
        fontSize: 14,
        color: '#666'
    },
    itemContainerStyle: {
        backgroundColor: '#fff',
        height: 70,
        paddingHorizontal: 15
    },
    topViewStyle: {
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    bottomViewStyle: {
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    topLeftTextStyle: {
        fontSize: 16,
        color: '#333'
    },
    topRightTextStyle: {
        fontSize: 14,
        color: '#666'
    },
    bottomLeftTextStyle: {
        fontSize: 14,
        color: '#666'
    },
    bottomRightTextStyle: {
        fontSize: 16,
        color: '#333'
    }
});
