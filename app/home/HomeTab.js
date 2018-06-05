/**
 * Created by Ryan on 2018/5/28.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    ListView,
    ScrollView
} from 'react-native';

import Picker from 'react-native-picker'

import NavigationBar from '../common/NavBarCommon'
import BottomList from './HomeBottomList'
import QrcScan from './QrcScan'
import ProduceDetail from './ProduceDetail'
import ApplyFirst from '../apply/ApplyFirst'

const {width,height} = Dimensions.get('window')
let that
const pickerData = ['诊所承担','客户承担','诊所客户各承担一半']

export default class HomeTab extends Component {
    constructor(props) {
        super(props)
        that = this
        this.state = {
            selectedIndex: 0
        }
    }
    componentDidMount() {
        /**
         *   获取登录之后设置的全局accessToken
         */
        console.log('全局变量accessToken:',global.accessToken)
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='爱牙分期'/>
                <ScrollView automaticallyAdjustContentInsets={false}>
                    <Image
                        source={{uri: 'http://clinicapi.qiezzitest.info/Images/QieZiJinRong_Home1_iOS.png'}}
                        style={{resizeMode: 'cover',width: width,height: 140}}/>
                    {this._renderSecondItem()}
                    <View style={styles.recommendTextStyle}>
                        <Text style={{fontSize: 16}}>推荐产品</Text>
                    </View>
                    {/*推荐产品列表*/}
                    <BottomList
                        callBack={(title,productId) => this._ItemClick(title,productId)}
                        applyCallBack={() => this._applyBtnClick()}/>
                </ScrollView>

            </View>
        );
    }
    /**
     *  渲染折扣信息组件
     */
    _renderSecondItem() {
        return (
            <View style={styles.secondItemStyle}>
                <Image
                    source={{uri: 'http://clinicapi.qiezzitest.info/Images/QieZiJinRong_Home2_iOS.png'}}
                    style={{resizeMode: 'contain',width: width,height: 100}}/>
                <TouchableOpacity onPress={() => this._qrcClick()}>
                    <View style={styles.qrcContainerStyle}>
                        <Text style={styles.qrcTextStyle}>诊所二维码</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    /**
     *  每个ItemCell点击事件
     */
    _ItemClick(title,productId) {
        this.props.navigator.push({
            component: ProduceDetail,
            title:'',
            params: {
                navTitle: title,
                productId: productId
            }
        })
    }
    /**
     *  立即申请点击事件
     */
    _applyBtnClick() {
        this.props.navigator.push({
            component: ApplyFirst,
            title:''
        })
    }
    /**
     *  二维码点击事件
     */
    _qrcClick() {
       Picker.init({
           pickerData: pickerData,
           selectedValue: [pickerData[this.state.selectedIndex]],
           pickerConfirmBtnText:'确认',
           pickerCancelBtnText:'取消',
           pickerTitleText:'请选择',
           pickerConfirmBtnColor: [96,91,245,1],
           pickerCancelBtnColor: [96,91,245,1],
           pickerRowHeight: 40,
           onPickerConfirm: pickerValue => {
                let selectIndex = this._fetchIndexOfValue(pickerValue[0],pickerData)
                this.setState({
                    selectedIndex: selectIndex
                })
               this._pushNav()
           },
           onPickerCancel: pickerValue => {

           },
           onPickerSelect: pickerValue => {

           }
       })
        Picker.show()

    }
    /**
     *  跳转二维码页面
     */
    _pushNav() {
        this.props.navigator.push({
            component: QrcScan,
            title:'',
            params: {
                type: this.state.selectedIndex
            }
        })
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7fe',
    },
    secondItemStyle: {
        marginTop: 10,
        backgroundColor: '#fff'
    },
    qrcContainerStyle: {
        width: width - 90,
        height: 35,
        alignSelf: 'center',
        marginVertical: 15,
        borderColor: '#605bf5',
        borderRadius: 5,
        borderWidth: 1,
        justifyContent: 'center'
    },
    qrcTextStyle: {
        fontSize: 16,
        color: '#605bf5',
        alignSelf: 'center',
        justifyContent:'center'
    },
    recommendTextStyle: {
        marginTop:10,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#dbdbdb',
        paddingLeft: 15
    }
});
