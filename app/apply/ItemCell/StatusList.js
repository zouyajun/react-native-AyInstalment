/**
 * Created by Ryan on 2018/6/2.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    FlatList
} from 'react-native';

let that
export default class StatusList extends Component {
    constructor(props) {
        super(props)
        that = this
    }
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.props.data}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}/>
            </View>
        );
    }

    _keyExtractor = (item,index) => index

    _renderItem = (item) => {
        var itemData = item.item
        var itemIndex = item.index
        var totalLength = that.props.data.length
        console.log(itemIndex)
        return (
            <View style={styles.itemContainerStyle}>
                <View style={styles.leftViewStyle}>
                    <View style={[styles.verTopLineStyle,itemIndex == 0?{ opacity: 0}:null]}></View>
                    <Text style={styles.iconTextStyle}>&#xe71e;</Text>
                    <View style={[styles.verBottomLineStyle,itemIndex == totalLength - 1?{opacity: 0}:null]}></View>
                </View>
                <View style={styles.rightViewStyle}>
                    <Text style={styles.titleTextStyle}>{itemData.Title}</Text>
                    <Text style={styles.descTextStyle}>{itemData.Content}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7fe'
    },
    itemContainerStyle: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingHorizontal: 15,

        alignItems:'center',
    },
    leftViewStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    verTopLineStyle: {
        width: 1,
        backgroundColor:'#7080fa',
        height: 15,
        marginBottom: 5
    },
    verBottomLineStyle: {
        width: 1,
        marginTop: 5,
        backgroundColor:'#7080fa',
        height: 15,
    },
    iconTextStyle: {
        fontFamily:'iconfont',
        fontSize: 20,
        color: '#7080fa'
    },
    rightViewStyle: {
        marginLeft: 15
    },
    titleTextStyle: {
        fontSize: 18,
        color: '#333'
    },
    descTextStyle: {
        fontSize: 13,
        color: '#999',
        marginTop: 10
    }

});
