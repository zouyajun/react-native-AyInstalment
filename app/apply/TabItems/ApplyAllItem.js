/**
 * Created by Ryan on 2018/5/31.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    VirtualizedList,
    TouchableOpacity
} from 'react-native';

import Commoncell from '../ItemCell/CommonCell'
import LoadMoreFooter from '../../common/LoadMoreFooter'
import ApplyDetail from '../ApplyDetail'

let config = require('../../common/Config')
let request = require('../../common/Request')
let someStore = require('../../common/RNAsyncStorage')
let storage = someStore.storage
let that
/**数据缓冲池*/
let cachedResult = {
    defaultSize: 20,
    nextPage: 2,
    items: [], // 原始数据
    totalPages: 1,
    totalItems: 0,
    blobItems:[] // 添加key之后的数据
}
/**读取本地token*/
let loginData
export default class ApplyAllItem extends Component {

    constructor(props) {
        super(props)
        that = this
        this.state = {
            totalList: [], // 数据源
            isLoadingTail: false, // 是否显示加载更多
            isRefreshing: false, // 是否显示下拉刷新
        }
    }
    /**
     *  通知组件本身重新渲染
     */
    componentWillReceiveProps() {
        this._onRefresh()
    }
    componentDidMount() {
        this._loadStorageData()
    }
    /**
     *  下拉刷新
     */
    _onRefresh() {
        if (!that._hasMore || that.state.isRefreshing) {
            return
        }
        let timer = setTimeout(() => {
            clearTimeout(timer)
            // 重置nextPage
            cachedResult.nextPage = 2
            that._fetchData(1)
        },1500)
    }
    /**
     *   上拉加载
     */
    _fetchMoreData() {
        if (!that._hasMore|| that.state.isLoadingTail) {
            return
        }
        var page = cachedResult.nextPage
        that._fetchData(page)
    }
    /**
     *   是否有更多数据
     */
    _hasMore(){
        return cachedResult.items.length !== cachedResult.totalItems
    }
    /**
     *   加载网络数据
     */
    _fetchData(page) {
        let accessToken = loginData.Token.authorization
        let worker = loginData.Token.worker
        let applyListURL = `${config.api.base}${config.api.applyForList}`
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
            'Worker': worker,
            'ChannelId': '1000005',
            'Hospital': '130670'
        }
        var params = {
            pageSize: cachedResult.defaultSize,
            pageIndex: page,
            status: 0
        }
        if (page !== 1) {
            that.setState({
                isLoadingTail: true
            })
        } else {
            that.setState({
                isRefreshing: true
            })
        }
        request.get(applyListURL,params,headers)
            .then((data) => {
                console.log(data)
                var items = cachedResult.items.slice()
                if (page !== 1) {
                    items = data.Items.concat(items)
                    cachedResult.nextPage ++
                } else  {
                    items = data.Items
                }
                var dataBlob = []
                items.map((item,idx) => {
                    dataBlob.push({
                        key: idx,
                        value: item
                    })
                })
                cachedResult.items = items
                cachedResult.blobItems = dataBlob
                cachedResult.totalPages = data.TotalPages
                cachedResult.totalItems = data.TotalItems
                console.log(dataBlob)
                if (page !== 1) {
                    that.setState({
                        totalList:cachedResult.blobItems,
                        isLoadingTail: false
                    })
                } else {
                    that.setState({
                        totalList: cachedResult.blobItems,
                        isRefreshing: false
                    })
                }
            })
            .catch((error) => {
                console.log(error)
                if (page !== 1) {
                    that.setState({isLoadingTail: false})
                } else  {
                    that.setState({isRefreshing: false})
                }
            })
    }
    /**
     * 读取本地化登录数据
     */
    _loadStorageData() {
        storage.load({
            key:'loginState'
        }).then((data) => {
            loginData = data
            that._fetchData(1)
        }).catch((error) => {

        })
    }
    /**
     *  跳转分期详情页面
     */
    _pushNav(orderId,rowData) {
        this.props.navigator.push({
            component: ApplyDetail,
            title:'',
            params: {
                orderId:orderId,
                rowData: rowData
            }
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <VirtualizedList
                    automaticallyAdjustContentInsets={false}
                    data={this.state.totalList}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this._itemSeparatorComponent}
                    onRefresh={this._onRefresh}
                    ListFooterComponent={this._renderFooter}
                    onEndReachedThreshold={0}
                    onEndReached={this._fetchMoreData}
                    refreshing={false}
                    >
                </VirtualizedList>
            </View>
        );
    }
    /**
     *   指定刷新位置，减少重新渲染开销
     */
    _keyExtractor = (item,index) => index
    /**
     *   单个Cell组件
     */
    _renderItem = ({item}) => {
        return (
            <Commoncell
                rowData={item}
                clickItemCallBack={(orderId,rowData) => this._pushNav(orderId,rowData)}/>
        )
    }
    /**
     *  行内分割线
     */
    _itemSeparatorComponent() {
        return (
            <View style={{backgroundColor: "#f4f7fe", height: 10}}/>
        )
    }
    /**
     *  底部加载更多提示
     */
    _renderFooter() {
        if (!that._hasMore && cachedResult.totalItems !== 0) {
            return (
                <View style={styles.loadingMore}>
                    <Text style={styles.loadingText}>没有更多了</Text>
                </View>
            )
        }
        if (that.state.isRefreshing) {
            return <LoadMoreFooter
                title='正在刷新数据'/>
        }
        if (that.state.isLoadingTail) {
            return <LoadMoreFooter
                title='正在加载更多数据'/>
        }
        return <View></View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7fe',
    },
    loadingMore: {
        marginVertical: 20,
        backgroundColor: '#333'
    },
    loadingText: {
        color: '#777',
        textAlign:'center'
    }
});
