/**
 * Created by Ryan on 2018/6/5.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native';


import AppIntro from 'react-native-app-intro'
import Login from '../login/Login'
const {width,height} = Dimensions.get('window')

export default class Guide extends Component {

    /**
     *  立即体验点击事件
     */
    showDoneClick = () => {
        this.props.navigator.replace({
            component: Login
        })
    }
    render() {
        return (
            <AppIntro
                dotColor='#999'
                activeDotColor="#605bf5"
                showSkipButton={false}
                showDoneButton={false} >
                {this._renderItemPage(require('../images/guide_1@2x.png'),1)}
                {this._renderItemPage(require('../images/guide_2@2x.png'),2)}
                {this._renderItemPage(require('../images/guide_3@2x.png'),3)}
            </AppIntro>
        );
    }
    /**
     *  引导页图片
     */
    _renderItemPage(image,index) {
        return (
            <View style={styles.slide} level={20}>
               <Image
                    source={image}
                    style={styles.swiperImageStyle}/>
                {
                    index == 3
                    ?  this._renderShowItem()
                    : <View></View>
                }
            </View>
        )
    }
    /**
     *  立即体验组件
     */
    _renderShowItem() {
        return (
            <TouchableOpacity onPress={() =>this.showDoneClick()}>
                <View style={styles.showContainer}>
                    <Text style={styles.showText}>立即体验</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7fe'
    },
    swiperImageStyle: {
        height: height - 120,
    },
    slide: {
        flex: 1,
        backgroundColor: '#fff'
    },
    text: {
        color: '#333',
        fontSize: 30,
        fontWeight: 'bold',
    },
    showContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        width: 120,
        height: 44,
        backgroundColor: '#7080fa',
        borderRadius: 4
    },
    showText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600'
    }
});
