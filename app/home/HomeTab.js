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
import Swiper from 'react-native-swiper'

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
            selectedIndex: 0,
            itemImages: [], // 轮播图图片数组
        }
    }
    componentDidMount() {
        /**
         *   获取登录之后设置的全局accessToken
         */
        console.log('全局变量accessToken:',global.accessToken)
        var items = [
            'http://clinicapi.qiezzitest.info/Images/QieZiJinRong_Home1_iOS.png',
            'http://blogdailyherald.com/wp-content/uploads/2013/04/382065_560557460633306_930109857_n.jpg',
            'http://img0.pclady.com.cn/pclady/pet/choice/cat/1701/6.jpg',
            'https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/3812b31bb051f819dc048662dbb44aed2e73e7f1.jpg'
        ]
        this.setState({
            itemImages: items
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='爱牙分期'/>
                <ScrollView automaticallyAdjustContentInsets={false}>
                    {/*轮播图*/}
                    {this._renderSwiperItem()}
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
     *   渲染轮播图组件
     */
    _renderSwiperItem() {
        return (
            <Swiper
                autoplay = {true}
                height = {160}
                showsPagination = {true}
                dotColor='rgba(0,0,0,.2)'
                activeDotColor='#fff'
                horizontal={true}>
                {
                    this.state.itemImages.map((item, index) => {
                        //cover: 等比例放大; center:不变; contain:不变; stretch:填充;
                        return <Image
                                    source={{uri: item}}
                                    style={{resizeMode: 'cover',width: width,height: 160}}
                                    key={index}/>
                    })
                }

            </Swiper>
        )
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
