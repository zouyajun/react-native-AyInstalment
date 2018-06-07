/**
 * Created by Ryan on 2018/6/2.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    Modal,
    TouchableOpacity
} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer'
const {width,height} = Dimensions.get('window')
var cols = 3
var boxWidth = 100
var vMargin = (width - cols * boxWidth) / (cols + 1)
var hMargin = 15

export default class ApplyDescList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataArr: [],
            imagesArray: [],  // 图片数组
            showImage: false, // 是否显示图片预览组件
            selectedIndex: 0  // 点击预览图片索引
        }
    }
    componentDidMount() {
        this._dealWithData(this.props.data)
    }
    render() {
        console.log(this.props.data)
        return (
            <View style={styles.container}>
                {this._renderAllInfoItems()}
                {/*影像资料*/}
                {
                    this.state.imagesArray.length > 0
                    ? <View style={styles.bottomContainerStyle}>
                            <View style={styles.bottomTopStyle}>
                                <Text style={styles.itemTextStyle}>医疗确认照</Text>
                            </View>
                            <View style={styles.bottomImageItemStyle}>
                                {this._renderAllImageItems()}
                            </View>
                        </View>
                    : null
                }
                {/*是否显示图片预览*/}
                {
                    this.state.showImage
                    ? <Modal visible={true} transparent={true}>
                            <ImageViewer
                                imageUrls={this.state.imagesArray}
                                index = {this.state.selectedIndex}
                                onClick={() =>{
                                    this.setState({
                                        showImage: false
                                    })
                                }}/>
                        </Modal> : null
                }
            </View>
        );
    }
    /**
     *  创建总的infoItems
     */
    _renderAllInfoItems() {
        var itemArr = []
        var titleArr = ['申请信息','贷款信息','还款计划']
        var dataArr = this.state.dataArr
        dataArr.forEach((item,idx) => {
            itemArr.push(
                <ItemDescView
                    data={item}
                    title={titleArr[idx]}
                    key={idx}/>
            )
        })
        return itemArr
    }
    /**
     *   图片九宫格布局
     */
    _renderAllImageItems() {
        var allItems = []
        var imagesArr = this.state.imagesArray
        imagesArr.forEach((item,idx) => {
            allItems.push(
                <TouchableOpacity onPress={() => this._showImageViewer(idx)} key={idx}>
                    <View style={styles.autoViewStyle}>
                        <Image
                            source={{uri: item.url}}
                            style={styles.imageStyle}/>
                    </View>
                </TouchableOpacity>
            )
        })
        return allItems
    }
    /**
     *   显示调用图片预览组件
     */
    _showImageViewer(index) {
       this.setState({
           selectedIndex: index,
           showImage: true
       })
    }
    /**
     *  处理数据
     */
    _dealWithData(data) {
        var dataArr = []
        var applyTitles = [{
            title: '申请人姓名',
            content: data.CustomerRealName
        },{
            title: '申请人电话',
            content: data.Mobile
        },{
            title: '与就诊人关系',
            content: data.PatientRelationName
        }]
        var loanTitles = [{
            title: '就诊诊所',
            content: data.HospitalName
        },{
            title: '申请产品',
            content: data.ProductName
        },{
            title: '贷款金额',
            content: data.AmountTotal
        },{
            title: '期数',
            content: `${data.InstalmentsNum}期`
        },{
            title: '手续费',
            content: `${data.CustomerRebate}元`
        }]
        var applysArr = []
        var loanArr = []
        var plansArr = []
        plansArr.push({
            title: '期数',
            content: '还款金额(元)',
            desc: '最迟还款日'
        })
        applyTitles.forEach((item,idx) => {
            applysArr.push({
                title: item.title,
                content:item.content,
                desc: ''
            })
        })
        loanTitles.forEach((item,idx) => {
            loanArr.push({
                title: item.title,
                content: item.content,
                desc: ''
            })
        })
        data.RefundPlanList.forEach((item,idx) => {
            plansArr.push({
                title: idx + 1,
                content: `¥ ${item.Money}`,
                desc: item.Date.split('T')[0]
            })
        })
        dataArr.push(applysArr)
        dataArr.push(loanArr)
        dataArr.push(plansArr)
        /** 处理图片数组 */
        var modelImages = data.Image
        var imagesArr = []
        modelImages.forEach((item,idx) => {
            imagesArr.push({
                url: item.ImgUrl
            })
        })
        this.setState({
            dataArr: dataArr,
            imagesArray: imagesArr
        })
    }
}

/**
 *  创建单个InfoItem
 */
class ItemDescView extends Component {
    render() {
        return (
            <View style={styles.itemDescContainer}>
                <View style={styles.itemTopContainer}>
                    <Text style={styles.topTitleTextStyle}>{this.props.title}</Text>
                </View>
                <View style={styles.itemBottomContainer}>
                    {this._renderItem()}
                </View>
            </View>
        )
    }
    _renderItem() {
        var itemArr = []
        var titleArr = this.props.data
        titleArr.forEach((item,idx) => {
            itemArr.push(
                <View
                    style={
                        [
                            styles.itemContainer,
                            idx == 0 ?{marginTop: 5}:null,
                            idx == titleArr.length - 1?{marginBottom:5}:null]
                    }
                    key={idx}>
                    <Text style={[styles.infoTextStyle,{textAlign:'left'}]}>{item.title}</Text>
                    <Text style={[styles.infoTextStyle,{color:'#333'}]}>{item.content}</Text>
                    <Text style={[styles.infoTextStyle,{color: '#333',textAlign: 'right'}]}>{item.desc}</Text>
                </View>
            )
        })
        return itemArr
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7fe'
    },
    itemDescContainer: {
        backgroundColor: '#fff',
        marginTop: 10
    },
    itemTopContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#dbdbdb',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    itemBottomContainer: {

    },
    topTitleTextStyle: {
        fontSize: 15,
        color: '#666'
    },
    itemContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        paddingVertical: 5
    },
    infoTextStyle: {
        fontSize: 13,
        color: '#999',
        width: (width - 30) / 3,
        textAlign: 'center'
    },
    autoViewStyle: {
        backgroundColor: '#999',
        alignItems: 'center',
        width: boxWidth,
        height: boxWidth,
        marginLeft: vMargin,
        marginTop: hMargin
    },
    imageStyle: {
        width: boxWidth,
        height: boxWidth,
        resizeMode: 'cover'
    },
    bottomContainerStyle: {
        backgroundColor: '#fff',
        marginVertical: 10
    },
    bottomTopStyle: {
        borderBottomWidth: 1,
        borderBottomColor: '#dbdbdb'
    },
    bottomImageItemStyle: {
        backgroundColor: '#f4f7fe',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    itemTextStyle: {
        fontSize: 16,
        color: '#666',
        paddingVertical: 10,
        paddingLeft: 15
    }
});
