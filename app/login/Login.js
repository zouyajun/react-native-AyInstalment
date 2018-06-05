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
    TextInput,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast'
import Spinner from 'react-native-loading-spinner-overlay'
import Navigator from '../navigator/Navigator'

let someStore = require('../common/RNAsyncStorage')
let storage = someStore.storage
const {width,height} = Dimensions.get('window')
let that
let config = require('../common/Config')
let request = require('../common/Request')
let md5 = require('../common/md5')
var _ = require('lodash')

export default class Login extends Component {
    constructor(props) {
        super(props)
        that = this
        this.state = {
            userName: '',
            passWord:'',
            visible: false
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Toast
                    ref="toast"
                    position='center'
                    style={{padding: 15}}/>
                <Spinner
                    visible={this.state.visible}
                    textContent='登录中...'
                    textStyle={{color: '#fff'}}
                    />
                <Image
                    source={require('../images/login_logo@2x.png')}
                    style={styles.logoIconStyle}/>
                {/*用户名*/}
                {
                    this._renderInputItem(
                        '用户名',
                        require('../images/login_user.png'),
                        '请输入账号',
                        false
                    )
                }
                {/*密码*/}
                {
                    this._renderInputItem(
                        '密码',
                        require('../images/login_pwd.png'),
                        '请输入密码',
                        true
                    )
                }
                {/*登录*/}
                <TouchableOpacity onPress={() => this._loginAction()}>
                    <View style={styles.loginBtnStyle}>
                        <Text style={styles.loginTextStyle}>登录</Text>
                    </View>
                </TouchableOpacity>
                {/*注册、忘记密码*/}
                <View style={styles.registerContainerStyle}>
                    <TouchableOpacity onPress={() => this._registerAction()}>
                        <Text style={styles.registerTextStyle}>注册</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._forgotPassWordAction()}>
                        <Text style={styles.registerTextStyle}>忘记密码?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    /**
     * 渲染登录注册组件
     **/
    _renderInputItem(title,leftImage,placeHolder,isSecureText){
        return (
            <View style={styles.inputContentStyle}>
                <Image
                    source={leftImage}
                    style={styles.loginIconStyle}/>
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={placeHolder}
                    onChangeText={(text) => this._hasChanged(title,text)}
                    secureTextEntry={isSecureText}
                    clearButtonMode='while-editing'/>
            </View>
        )
    }
    /**
     * 监听输入框
     **/
    _hasChanged(title,text) {
        console.log(title + text)
        if (title == '用户名') {
            this.setState({
                userName: text
            })
        } else  {
            this.setState({
                passWord: text
            })
        }
    }
    /**
     * 登录事件
     **/
    _loginAction() {

        if (!this.state.userName.trim() || !this.state.passWord.trim()) {
            this.refs.toast.show('用户名或者密码不能为空',300)
        } else  {
            let signUpURL = `${config.api.base}${config.api.login}`
            let userName = this.state.userName;
            let securePassWord = md5.hexMD5(this.state.passWord)
            let body = {
                UserName: userName,
                Password: securePassWord
            }
            var options = _.extend(config.header,{
                body: JSON.stringify(body)
            })
            this._showHud(true)
            /**
             *  fetch网络请求接口调用
             */
            fetch(signUpURL,options)
                .then((response) => response.json())
                .then((data) =>{
                    if (data && !that._isString(data)) {
                        console.log('登录成功')
                        // 反向传值（数据回调）
                        console.log(data)
                        that._showHud(false)
                        that._saveData(data)
                    }
                    else {
                        that._showHud(false)
                        that.refs.toast.show(data,300)
                    }
                })
                .catch((error) => {
                    alert('登录失败了')
                    console.log('error',error)
                    that._showHud(false)
                })
        }
    }
    /**
     *  登录后数据本地化存储
     */
    _saveData = (data) => {
        /**
         *  此处可以设置全局变量，保存用户登录Token
         */
        global.accessToken = {
            authorization: data.Web.UserCookie.Value,
            worker: data.Web.Cookie.Value
        }
        // storage.remove({
        //     key: 'loginState'
        // })
        storage.save({
            key: 'loginState',
            id: 1001,
            data: {
                User: data.User,
                HospitalCode: '130670',
                Token: {
                    authorization: data.Web.UserCookie.Value,
                    worker: data.Web.Cookie.Value
                }
            },
            //expires为有效时间(一天)
            expires: 24 * 3600 * 1000
        }).then(() => {
            that.props.navigator.replace({
                component: Navigator
            })
        }).catch((error) => {
            console.log('数据保存失败了')
        })
    }
    /**
     * 注册
     **/
    _registerAction() {
        alert('注了个册')
    }
    /**
     * 忘记密码
     **/
    _forgotPassWordAction() {
        alert('忘记密码？你是猪吗')
    }
    /**
     *  判断对象是否是字符串
     */
    _isString(obj){
        return Object.prototype.toString.call(obj) === "[object String]";
    }
    /**
     *  hud显示隐藏
     **/
    _showHud(show) {
        this.setState({
            visible: show
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    logoIconStyle: {
        alignSelf: 'center',
        justifyContent: 'center',
        resizeMode: 'contain',
        marginTop: 64,
        marginBottom: 50
    },
    inputContentStyle: {
        flexDirection: 'row',
        justifyContent:'space-between',
        width: width - 100,
        height: 44,
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#dbdbdb',
        marginTop: 10

    },
    loginIconStyle: {
        position: 'absolute',
        bottom: 5,
        resizeMode: 'contain',
        height: 30,
        width: 30
    },
    textInputStyle: {
        flex: 1,
        marginLeft: 40
    },
    loginBtnStyle: {
        marginTop: 34,
        width: width - 100,
        height: 40,
        alignSelf: 'center',
        backgroundColor:'#605bf5',
        borderRadius: 4,
        justifyContent: 'center'
    },
    loginTextStyle: {
        fontSize: 20,
        color: '#fff',
        alignSelf: 'center'
    },
    registerContainerStyle: {
        marginTop: 10,
        width: width - 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center'
    },
    registerTextStyle: {
        fontSize: 16,
        color:'#999'
    }
});
