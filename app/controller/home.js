'use strict';

const Controller = require('egg').Controller;
const S = require('string')

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const { path } = ctx.params 

    const webhookUrl = process.env['WEBHOOK_URL' + (path ? '_' + path.toUpperCase() : '')];

    ctx.logger.info('request body: ', ctx.request.body);
    let message,result = ''
    
    ctx.logger.info('path is: ', path);

    //const { event_name } =  ctx.request.body
    //console.log(typeof(event_name))
    //if (event_name.indexOf('将在3分钟后重启')){
    if ( path.indexOf('alert80') != -1 ){
      console.log('reboot')
      let event_name = ''
      // if (path === 'alert80')
      event_name = path === 'alert80' ? 'NCC测试80服务器将在3分钟后重启' : 'NCC测试8088服务器将在3分钟后重启'

      message = await ctx.service.webhook.translateRebootAlert(event_name);
      // console.log(message)
      result = await ctx.curl(webhookUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json; charset=UTF-8',
        },
        // 自动解析 JSON response
        dataType: 'json',
        // 3 秒超时
        timeout: 3000,
  
        data: message,
      });
    }else{
      message = await ctx.service.webhook.translateMsg(ctx.request.body);

      if (!message) {
        ctx.logger.info('====> message is empty, suppressed.')
        ctx.body = { msg: 'message is empty or not supported, suppressed.' }
        return 
      }


      if (!webhookUrl) {
        ctx.logger.error('webhook url error, webhookUrl: ' + webhookUrl);
        ctx.body = {
          error: 'webhook url error, webhookUrl: ' + webhookUrl,
        };
        return
      }

      
      result = await ctx.curl(webhookUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json; charset=UTF-8',
        },
        // 自动解析 JSON response
        dataType: 'json',
        // 3 秒超时
        timeout: 3000,

        data: message,
      });
    }

    ctx.body = {
      webhook_url: webhookUrl,
      webhook_message: message,
      status: result.status,
      headers: result.headers,
      package: result.data,
    };

    ctx.logger.info('response body: ', ctx.body);
  }
}

module.exports = HomeController;
