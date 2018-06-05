/**
 * Created by Ryan on 2018/5/28.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Platform,
    Image
} from 'react-native';

const {width,height} = Dimensions.get('window')
import TabNavigator from 'react-native-tab-navigator'

import Home from '../home/HomeTab'
import ApplyList from '../apply/ApplyTab'
import Mine from  '../mine/MineTab'

export default class TabBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTab: 'home',
            tabBarHeight: 49
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <TabNavigator
                    hidesTabTouch={true}
                    tabBarStyle={
                        [styles.tabBar,{height: this.state.tabBarHeight}]
                    }>
                    {/*首页*/}
                    {
                        this._renderTabBarItem(
                            '爱牙分期',
                            '&#xe70b;',
                            '&#xe70a;',
                            'home',
                            Home)
                    }
                    {/*分期申请列表*/}
                    {
                        this._renderTabBarItem(
                            '申请',
                            require('../images/board.png'),
                            require('../images/board-actived.png'),
                            'apply',
                            ApplyList)
                    }
                    {/*分期管理*/}
                    {
                        this._renderTabBarItem(
                            '分期管理',
                            require('../images/profile.png'),
                            require('../images/profile-actived.png'),
                            'mine',
                            Mine)
                    }
                </TabNavigator>
            </View>
        );
    }
    /**
     *  抽取每个tabBarItem
     */
    _renderTabBarItem(title,iconName,selectedIconName,selectedTab,component) {
        var name = '&#xe70b;'
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                renderIcon={() => this._renderNormalItemIcon(title)}
                renderSelectedIcon={() => this._renderSelectedItemIcon(title)}
                titleStyle={styles.tabText}
                selectedTitleStyle={styles.selectedTabText}
                onPress={() => this.setState({ selectedTab: selectedTab })}>
                {
                    this._renderItemPage(title)
                }
            </TabNavigator.Item>
        )
    }
    /**
     *  普通状态Icon
     */
    _renderNormalItemIcon(title) {
        if (title == '爱牙分期') {
            return <Text style={styles.iconFontStyle}>&#xe70b;</Text>
        } else if (title == '申请') {
            return <Text style={styles.iconFontStyle}>&#xe711;</Text>
        } else  {
            return <Text style={styles.iconFontStyle}>&#xe70e;</Text>
        }
    }
    /**
     *  选中状态Icon
     */
    _renderSelectedItemIcon(title) {
        if (title == '爱牙分期') {
            return <Text style={[styles.iconFontStyle,{color: '#605bf5'}]}>&#xe70a;</Text>
        } else if (title == '申请') {
            return <Text style={[styles.iconFontStyle,{color: '#605bf5'}]}>&#xe712;</Text>
        } else  {
            return <Text style={[styles.iconFontStyle,{color: '#605bf5'}]}>&#xe70d;</Text>
        }
    }

    /**
     * 渲染Tab页面
     */
    _renderItemPage(title) {
        if (title == '爱牙分期') {
            return (
                <Home
                    navigator={this.props.navigator}/>
            )
        } else if (title == '申请') {
            return (
                <ApplyList
                    navigator={this.props.navigator}/>
            )
        } else {
            return (
                <Mine
                    navigator={this.props.navigator}/>
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabText: {
        color:'#999',
        fontSize:14
    },
    selectedTabText: {
        color:'#605bf5'
    },
    iconFontStyle: {
        fontFamily: 'iconfont',
        fontSize: 24,
        color: '#999'
    },
    tabBar: {
        backgroundColor: '#fff'
    },

});

