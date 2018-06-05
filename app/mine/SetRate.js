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
    TouchableOpacity
} from 'react-native';

import Picker from 'react-native-picker'
import Toast, {DURATION} from 'react-native-easy-toast'
import Spinner from 'react-native-loading-spinner-overlay'
import NavigationBar from '../common/NavBarCommon'

var _ = require('lodash')
let config = require('../common/Config')
let request = require('../common/Request')
let someStore = require('../common/RNAsyncStorage')
let storage = someStore.storage
let that
const pickerData = ['诊所承担','客户承担','诊所客户各承担一半']
export default class SetRate extends Component {
    constructor(props) {
        super(props)
        that = this
        this.state = {
            visible: false,
            itemArray: [],
            loginData: ''
        }
    }
    componentDidMount() {
        this._loadStorageData()
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='利息承担比例设置'
                    leftImage={require('../images/nav_back.png')}
                    leftAction={() => this._popNav()}/>
                {this._renderAllItem()}
                <Spinner
                    visible={this.state.visible}
                    textContent='登录中...'
                    textStyle={{color: '#fff'}}
                />
                <Toast
                    ref="toast"
                    position='center'
                    style={{padding: 15}}/>
            </View>
        );
    }
    /**
     *  渲染所有Item
     */
    _renderAllItem() {
        let itemArr = []
        this.state.itemArray.forEach((item,idx) => {
            var title = `${item.Num}期`
            var detail = pickerData[item.InterestAssumeType]
            itemArr.push(
                <View
                    style={styles.itemContainerStyle}
                    key={idx}>
                    <TouchableOpacity
                        style={styles.leftItemStyle}
                        onPress={() => this._pickerSelectedAction(item,idx)}>
                        <View style={styles.leftItemStyle}>
                            <Text style={styles.textStyle}>{title}</Text>
                            <Text style={styles.textStyle}>{detail}</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.iconStyle}>&#xe627;</Text>
                </View>
            )
        })
        return itemArr
    }
    /**
     *  设置利息承担比例
     */
    _fetchSetInstrument(itemData) {
        let accessToken = this.state.loginData.Token.authorization
        let worker = this.state.loginData.Token.worker
        let setInstrumentURL = `${config.api.base}${config.api.setInstrument}`
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
            'Worker': worker,
            'ChannelId': '1000005',
            'Hospital': '130670'
        }
        var rateName = pickerData[itemData.InterestAssumeType]
        var params = _.extend(itemData,{
            rateName:rateName
        })
        var body = {
            InterestAssumeList: [params]
        }
        this._showHud(true)
        request.post(setInstrumentURL,body,headers)
            .then((data) => {
                console.log(data)
                this._showHud(false)
                if (data && data.status == 200) {
                    that.refs.toast.show('设置成功',300)
                } else {
                    that.refs.toast.show(data.json(),300)
                }
            })
            .catch((error) => {
                console.log(error)
                this._showHud(false)
            })
    }
    /**
     *   获取利息承担比例设置
     */
    _fetchInstrumentSet(loginData) {
        let accessToken = loginData.Token.authorization
        let worker = loginData.Token.worker
        let instrumentSetURL = `${config.api.base}${config.api.getInstrumentSet}`
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
            'Worker': worker,
            'ChannelId': '1000005',
            'Hospital': '130670'
        }
        this._showHud(true)
        request.get(instrumentSetURL,null,headers)
            .then((data) => {
                console.log(data)
                that.setState({
                    itemArray: data
                })
                that._showHud(false)
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
            key:'loginState'
        }).then((data) => {
            that.setState({
                loginData: data
            })
            that._fetchInstrumentSet(data)
        }).catch((error) => {

        })
    }
    /**
     *  选择器事件
     */
    _pickerSelectedAction(data,index) {
        let tempData = data
        Picker.init({
            pickerData: pickerData,
            selectedValue: [pickerData[tempData.InterestAssumeType]],
            pickerConfirmBtnText:'确认',
            pickerCancelBtnText:'取消',
            pickerTitleText:'请选择',
            pickerConfirmBtnColor: [96,91,245,1],
            pickerCancelBtnColor: [96,91,245,1],
            pickerRowHeight: 40,
            onPickerConfirm: pickerValue => {
                let selectIndex = this._fetchIndexOfValue(pickerValue[0],pickerData)
                tempData.InterestAssumeType = selectIndex
                var tempArr = this.state.itemArray
                // 数组元素替换
                tempArr.splice(index,1,tempData)
                that.setState({
                    itemArray: tempArr
                })
                that._fetchSetInstrument(tempData)
            },
            onPickerCancel: pickerValue => {

            },
            onPickerSelect: pickerValue => {

            }
        })
        Picker.show()
    }
    /**
     *  遍历数组查找元素下标
     */
    _fetchIndexOfValue(value,array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return i
            }
        }
        return -1
    }
    /**
     *  导航返回
     */
    _popNav(){
        this.props.navigator.pop()
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
    itemContainerStyle: {
        height: 44,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#dbdbdb'
    },
    leftItemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
        marginRight: 8
    },
    iconStyle: {
        fontFamily: 'iconfont',
        fontSize: 12,
        color: '#666',
        position: 'absolute',
        right: 15
    },
    textStyle: {
        fontSize: 16
    }

});
