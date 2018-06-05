/**
 * Created by Ryan on 2018/5/28.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Platform
} from 'react-native';


export default class NavBarCommon extends Component {
    render() {
        // leftTitle和leftImage 优先判断leftTitle (即 文本按钮和图片按钮优先显示文本按钮)
        const {title,leftTitle,leftImage,leftAction,rightTitle,rightImage,rightAction} = this.props
        return (
            <View style={[styles.barViewStyle,this.props.style]}>
                <View style={styles.showViewStyle}>
                    {
                        leftTitle ?
                            <TouchableOpacity style={styles.leftNavStyle} onPress={ () => {leftAction()} }>
                                <View style={{alignItems: 'center'}}>
                                    <Text style={styles.barButtonStyle}>{leftTitle}</Text>
                                </View>
                            </TouchableOpacity>
                            : (
                                leftImage
                                    ?
                                    <TouchableOpacity style={styles.leftNavStyle} onPress={ () => {leftAction()}}>
                                        <View style={{alignItems: 'center'}}>
                                            <Image
                                                source={leftImage}
                                                resizeMode='contain'
                                                style={{width: 25,height: 30}}/>
                                        </View>
                                    </TouchableOpacity>
                                    : null
                            )
                    }
                    {
                        title ?
                            <Text style={styles.titleStyle}>{title || ''}</Text>
                            : null
                    }
                    {
                        rightTitle ?
                            <TouchableOpacity style={styles.rightNavStyle} onPress={ () => {rightAction()}}>
                                <View style={{alignItems: 'center'}}>
                                    <Text style={styles.barButtonStyle}>{rightTitle}</Text>
                                </View>
                            </TouchableOpacity>
                            : (
                                rightImage ?
                                    <TouchableOpacity style={styles.rightNavStyle} onPress={ () => {rightAction()}}>
                                        <View style={{alignItems: 'center'}}>
                                            <Image
                                                source={rightImage}
                                                resizeMode='contain'
                                                style={{width: 26,height: 26}}/>
                                        </View>
                                    </TouchableOpacity>
                                    : null
                            )
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    barViewStyle: {
        height: Platform.OS =='ios' ? 64 : 44,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#dbdbdb'
    },
    showViewStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: Platform.OS == 'ios' ? 20 : 0,
        height: 44
    },
    leftNavStyle: {
        position: 'absolute',
        top: 8,
        bottom: 8,
        left: 8,
        justifyContent: 'center'
    },
    barButtonStyle: {
        color: '#fff',
        fontSize: 18
    },
    titleStyle: {
        color: '#333',
        fontSize: 18,
        fontWeight: '600'
    },
    rightNavStyle: {
        position: 'absolute',
        top: 8,
        bottom: 8,
        right: 8,
        justifyContent: 'center',
    }
});
