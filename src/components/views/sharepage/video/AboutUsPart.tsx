import React from 'react';
import LessonsInfoImage from './AC编程_品牌介绍_04.jpg';
import MarkdownBlock from '@/components/views/markdown/MarkdownBlock';

export default React.memo(() => (
  <MarkdownBlock
    style={{ padding: '10px 20px', userSelect: 'all' }}
    text={`
    ### 关于我们

    代码峡谷是由浙大校友创立的青少年在线编程教育平台，致力于用科技让编程学习更有趣、更高效、更实惠。

    我们拥有9年以上编程教学经验，师资力量雄厚。与杭州市若干知名中小学开展广泛的合作，培养学员在科技节、信息学奥赛、蓝桥杯、青少年等级考试等编程赛事中获奖无数。

    自主研发的代码峡谷AI趣味编程平台([daimaxiagu.com](https://daimaxiagu.com))是国内领先的游戏化编程产品。将抽象的知识转化为生动的关卡，让孩子轻轻松松学到更多知识。

    凭借丰富的编程教学经验和强大的自主研发能力，代码峡谷将会持续输出优质的教学内容、先进的编程工具、快乐的学习理念。希望和孩子们一起登上算法之巅，一览众山小！

    代码峡谷的大门已经打开，欢迎你随时来探险～

    ### 课程体系

    主打 C++ 语法和算法。精心打磨一套科学高效的课程体系，循序渐进带领孩子走进信奥赛场。

    ![课程体系介绍](${LessonsInfoImage})

    ### 联系我们

    谷老师: **18069786596** （微信同号，欢迎咨询）

    ![谷老师微信二维码](https://media.daimaxiagu.com/%E8%B0%B7%E8%80%81%E5%B8%88%E5%BE%AE%E4%BF%A1%E4%BA%8C%E7%BB%B4%E7%A0%81.JPG)

    微信长按图片扫描二维码进群了解：

    ![代码峡谷分享群](https://media.daimaxiagu.com/%E4%BB%A3%E7%A0%81%E5%B3%A1%E8%B0%B7%E9%AB%98%E5%85%89%E6%97%B6%E5%88%BB-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1.JPG)
  `
      .split('\n')
      .map(line => line.trim())
      .join('\n')}
  />
));
