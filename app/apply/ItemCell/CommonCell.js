/**
 * Created by Ryan on 2018/6/1.
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

let that
export default class CommonCell extends Component {
    constructor(props) {
        super(props)
        that = this
    }
    /**
     *  itemCell点击回调函数
     */
    _clickCallBack(orderId) {
        var rowData = this.props.rowData
        if (this.props.clickItemCallBack == null) return
        this.props.clickItemCallBack(orderId,rowData)
    }
    render() {
        var rowData = this.props.rowData.value
        return (
            <TouchableOpacity onPress={()=>this._clickCallBack(rowData.OrderId)}>
                <View style={[styles.container,this.props.style]}>
                    <View style={styles.topViewStyle}>
                        <View style={styles.topLeftView}>
                            <Image
                                source={{uri: rowData.PhotoUrl}}
                                style={styles.iconStyle}/>
                            <Text style={styles.titleTextStyle}>{rowData.ProductName}</Text>
                        </View>
                        <Text style={
                [styles.stateTextStyle,
                rowData.Status == 1 ? {color: '#605bf5'} : null]}>{this._fetchStateNameWithState(rowData.Status)}</Text>
                    </View>
                    <View style={styles.bottomViewStyle}>
                        <View style={styles.bottomLeftView}>
                            {this._renderItemView(this._dealItemData(rowData))}
                        </View>
                        <Text style={styles.stateDescTextStyle}>{rowData.StepsName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    /**
     *  渲染单个tips
     */
    _renderItemView(itemList) {
        var itemArr = []
        itemList.forEach((item,idx) => {
            itemArr.push(
                <View
                    style={styles.itemViewStyle}
                    key={idx}>
                    <Text style={{color:'#999',width: 75}}>{item.title}</Text>
                    <Text style={[{color: '#333'},idx == 0 ? {color: 'red'}:null]}>{item.content}</Text>
                </View>
            )
        })
        return itemArr
    }
    /**
     *  处理单个tips数据
     **/
    _dealItemData(rowData) {
        var titleArr = ['贷款金额：','申请人：','申请日期：','申请单号：']
        var payAmount = `¥ ${rowData.AmountApp} ${rowData.InstalmentsNum}期`
        var applyName = rowData.CustomerRealName
        var applyDate = rowData.AddTime.split('T')[0]
        var orderNum = rowData.OrderNo
        var contentArr = [payAmount,applyName,applyDate,orderNum]
        var itemArr = []
        titleArr.forEach((item,idx) => {
            itemArr.push({
                title: item,
                content:contentArr[idx]
            })
        })
        return itemArr
    }
    /**
     *  关联订单状态文字
     */
    _fetchStateNameWithState(state) {
        switch (state) {
            case 1:
                return '申请中'
            break;
            case 2:
                return '已通过'
                break;
            case 3:
                return '未通过'
                break;
            case 1024:
                return '已过期'
                break;
            default:
                return ''
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topViewStyle: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#dbdbdb',
        justifyContent: 'space-between'
    },
    bottomViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    topLeftView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconStyle: {
        width: 30,
        height: 30
    },
    titleTextStyle: {
        marginLeft: 10,
        fontSize: 16
    },
    stateTextStyle: {
        fontSize: 16,
        color: '#666',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    bottomLeftView: {
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    itemViewStyle: {
        flexDirection: 'row',
        paddingVertical: 5
    },
    stateDescTextStyle: {
        width: 70,
        flexWrap: 'wrap',
        fontSize: 14,
        color: '#666',
        alignSelf: 'center'
    }
});
