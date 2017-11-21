/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = '86666105.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `https://${host}/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `https://${host}/user`,

        // 测试的信道服务地址
        tunnelUrl: `https://${host}/tunnel`,
        
        // 获取房源资料接口
        getFangtolet: `https://${host}/Housestolet`,

        // 获取经纪人接口
        getAgents:`https://${host}/Agents`,

        // 获取所有房源数据（包括租房）
        getallhouses:`https://${host}/Housesall`,

        //登记新房源
        regnewhouse: `https://${host}/Reghouse`

        }
};

module.exports = config;