/**
 * Created by Ryan on 2018/5/28.
 */

module.exports = {
    header: {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    },
    api: {
        base: 'http://clinicapi.qiezzitest.info/',
        login: 'api/User/Login',
        home:'api/GoldEggplant/RecommendProductList',
        productDetail: 'api/GoldEggplant/ProductDetail',
        getQRCImage: 'api/GoldEggplant/GetQrCodeWithInterestAssumeType',
        getHospitalLimit: 'api/GoldEggplant/GetHospitalLimit',
        getInstrumentSet: 'api/GoldEggplant/GetInterestAssumeSetting',
        setInstrument: 'api/GoldEggplant/SetInterestAssumeSetting',
        DetailItemList: 'api/GoldEggplant/DetailList',
        applyForList: 'api/GoldEggplant/ApplyforList',
        applyForDetail: 'api/GoldEggplant/ApplyforDetail'
    }
}