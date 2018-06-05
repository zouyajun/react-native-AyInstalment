/**
 * Created by Ryan on 2018/5/28.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';


import NavigationBar from '../common/NavBarCommon'
import ApplyAllItem from './TabItems/ApplyAllItem'
import ApplyingItem from './TabItems/ApplyingItem'
import ApplyedItem from './TabItems/ApplyedItem'
import ApplyFailedItem from './TabItems/ApplyFailedItem'

var ScrollableTabView = require('react-native-scrollable-tab-view')

let that
export default class ApplyTab extends Component {
    constructor(props) {
        super(props)
        that = this
        this.state = {
            selectedTab: 0
        }
    }
    componentDidMount() {

    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='分期申请'
                    style={{borderBottomWidth: 0}}/>
                <ScrollableTabView
                    tabBarActiveTextColor='#605bf5'
                    tabBarInactiveTextColor='#666'
                    tabBarTextStyle={{fontSize: 16}}
                    tabBarUnderlineStyle={{backgroundColor: '#605bf5',height:2}}
                    >
                    <ApplyAllItem
                        tabLabel='全部'
                        navigator={this.props.navigator}/>
                    <ApplyingItem
                        tabLabel='申请中'
                        navigator={this.props.navigator}/>
                    <ApplyedItem
                        tabLabel='已通过'
                        navigator={this.props.navigator}/>
                    <ApplyFailedItem
                        tabLabel='未通过'
                        navigator={this.props.navigator}/>
                </ScrollableTabView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
