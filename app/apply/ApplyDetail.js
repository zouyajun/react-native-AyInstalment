/**
 * Created by Ryan on 2018/6/1.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView
} from 'react-native';

var ScrollableTabView = require('react-native-scrollable-tab-view')
const {width,height} = Dimensions.get('window')
import NavigationBar from '../common/NavBarCommon'
import CommonCell from '../apply/ItemCell/CommonCell'
import Spinner from 'react-native-loading-spinner-overlay'

// 申请进度组件
import StatusList from './ItemCell/StatusList'
// 申请详情组件
import ApplyDescList from './ItemCell/ApplyDescList'

let config = require('../common/Config')
let request = require('../common/Request')
let someStore = require('../common/RNAsyncStorage')
let storage = someStore.storage
let loginData
let that

export default class ApplyDetail extends Component {
    constructor(props) {
        super(props)
        that = this
        this.state = {
            visible: false,
            data: ''
        }
    }
    componentDidMount() {
        console.log(this.props.route.params)
        this._loadStorageData()
    }
    /**
     * 读取本地化登录数据
     */
    _loadStorageData() {
        storage.load({
            key:'loginState',
            id: 1001
        }).then((data) => {
            loginData = data
            that._fetchData()
        }).catch((error) => {

        })
    }
    /**
     *  请求网络数据
     */
    _fetchData() {
        let accessToken = loginData.Token.authorization
        let worker = loginData.Token.worker
        let applyDetailURL = `${config.api.base}${config.api.applyForDetail}`
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
            'Worker': worker,
            'ChannelId': '1000005',
            'Hospital': '130670'
        }
        var params = {
            orderId: this.props.route.params.orderId
        }
        that._showHud(true)
        request.get(applyDetailURL,params,headers)
            .then((data) => {
                console.log('DetailData:',data)
                that.setState({data})
                that._showHud(false)
            })
            .catch((error) => {
                console.log(error)
                that._showHud(false)
            })
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='分期申请详情'
                    leftImage={require('../images/nav_back.png')}
                    leftAction={() => this._popNav()}/>
                <ScrollView
                     automaticallyAdjustContentInsets={false}>
                    {/*头部组件*/}
                    <View style={styles.headViewStyle}>
                        {this._renderHeadCell()}
                        <View style={{backgroundColor: '#f4f7fe',height: 10}}></View>
                    </View>
                    {/*滑动内容区组件*/}
                    {this._renderContentView()}
                </ScrollView>
                <Spinner
                    visible={this.state.visible}
                    textContent='loading...'
                    textStyle={{color: '#fff'}}
                />
            </View>
        );
    }
    /**
     *  头部组件
     */
    _renderHeadCell() {
        return (
            <CommonCell
                rowData={this.props.route.params.rowData}
                style={{width: width}}
                />
        )
    }
    /**
     *  滑动内容区
     */
    _renderContentView() {
        return (
            <ScrollableTabView
                style={styles.contentStyle}
                tabBarActiveTextColor='#605bf5'
                tabBarInactiveTextColor='#666'
                tabBarTextStyle={{fontSize: 16}}
                tabBarUnderlineStyle={{backgroundColor: '#605bf5',height:2}}
                tabBarBackgroundColor='#fff'
            >
                <StatusList
                    tabLabel='申请进度'
                    data={this.state.data.OrderStepsList}/>
                <ApplyDescList
                    tabLabel='申请详情'
                    data={this.state.data}/>
            </ScrollableTabView>
        )
    }
    /**
     *  导航返回
     */
    _popNav(){
        this.props.navigator.pop()
    }
    /**
     *  显示隐藏HUD
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
        backgroundColor: '#f4f7fe',
    },
    headViewStyle: {
        alignItems: 'flex-start',
        height:165,
        width: width
    },
    contentStyle: {
       marginTop: 10
    }
});
