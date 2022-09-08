import wx from 'weixin-js-sdk-ts';
import axios from 'axios';
import {
  HOST,
  WEIXIN_JSAPI_TICKET_API_BASE,
  WEIXIN_APP_ID,
} from '@/utils/config';

export interface IWXSHareCard {
  children?: any;
  link?: string;
  title: string;
  subtitle: string;
  iconUrl: string;
}

export const getWeixinJsApiSignature = async (
  title: string,
  description: string,
  pictureUrl: string,
  link: string,
) => {
  console.debug('WeixinJsApiSignature', {
    title,
    description,
    pictureUrl,
    link,
  });
  axios({
    url: `${WEIXIN_JSAPI_TICKET_API_BASE}/weixin_jsapi_signature`,
    method: 'GET',
    headers: {
      noncestr: 'RANDOMACCESSMEMORIES',
      timestamp: 1646967249,
      url: window.location.href.split('#')[0],
    },
  })
    .then(res => {
      const { signature } = res.data;
      wx.config({
        debug: false,
        appId: WEIXIN_APP_ID,
        timestamp: 1646967249,
        nonceStr: 'RANDOMACCESSMEMORIES',
        signature,
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 必填，需要使用的JS接口列表
        openTagList: [],
      });
      wx.ready(() => {
        wx.updateAppMessageShareData({
          title,
          desc: description,
          link,
          imgUrl: pictureUrl,
          success(): void {
            throw new Error('Function not implemented.');
          },
          cancel(): void {
            throw new Error('Function not implemented.');
          },
        });
        wx.updateTimelineShareData({
          title,
          link,
          imgUrl: pictureUrl,
          success(): void {
            throw new Error('Function not implemented.');
          },
          cancel(): void {
            throw new Error('Function not implemented.');
          },
        });
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      });
    })
    .catch(error => {
      console.error(error);
    });
};
