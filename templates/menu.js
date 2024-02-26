const items = [
  {
    products: ["kungfu-trader"],
    homePage: "https://www.kungfu-trader.com",
    logo: "https://s3.cn-northwest-1.amazonaws.com.cn/users.kungfu-trader.com/uploads/2024/01/cropped-cropped-log-18-300x82_副本.png",
    useArtifactName: true,
    menu: [
      {
        title: "首页",
        url: "https://www.kungfu-trader.com/",
      },
      {
        title: "历史版本",
        url: "https://releases.kungfu-trader.com/",
        class: "active",
      },
      {
        title: "博客",
        url: "https://www.kungfu-trader.com/index.php/blog/",
      },
      {
        title: "文档",
        url: "https://docs.kungfu-trader.com/latest/index.html",
        target: "_blank",
      },
      {
        title: "关于我们",
        url: "https://www.kungfu-trader.com/index.php/about-us/",
      },
      {
        title: "我的账户",
        url: "https://www.kungfu-trader.com/index.php/my-account-2/",
      },
    ],
    copyright: {
      year: "2017 - 2024",
      company: "北京功夫源科技发展有限责任公司",
      miitCode: "京ICP备19056728号-1",
      miitUrl: "https://beian.miit.gov.cn/#/Integrated/index",
      mpsCode: "京公网安备11010202010762",
      mpsUrl: "https://beian.mps.gov.cn/#/query/webSearch?code=11010202010762",
      icpIcon:
        "https://s3.cn-northwest-1.amazonaws.com.cn/users.kungfu-trader.com/uploads/2023/12/logo01.6189a29f1.png",
      agreementUrl: "https://www.kungfu-trader.com/index.php/user_agreement/",
      privacyPolicyUrl:
        "https://www.kungfu-trader.com/index.php/privacy_policy/",
      disclaimerUrl: "https://www.kungfu-trader.com/index.php/disclaimer/",
    },
  },
  {
    products: ["artifact-kungfu"],
    homePage: "https://www.libkungfu.cc",
    logo: "https://s3.cn-northwest-1.amazonaws.com.cn/users.kungfu-trader.com/uploads/2024/01/cropped-cropped-log-18-300x82_副本.png",
    menu: [
      {
        title: "首页",
        url: "https://www.libkungfu.cc/",
      },
      {
        title: "文档",
        url: "https://docs.kungfu-trader.com/latest/index.html",
        target: "_blank",
      },
      {
        title: "github",
        url: "https://github.com/kungfu-trader",
        target: "_blank",
      },
      {
        title: "功夫交易",
        url: "https://www.kungfu-trader.com/",
        target: "_blank",
      },
    ],
    copyright: {
      year: "2023 - 2024",
      company: "北京功夫源科技发展有限责任公司",
      miitCode: "京ICP备19056728号-2",
      miitUrl: "https://beian.miit.gov.cn/#/Integrated/index",
      mpsCode: "京公网安备11010202010763",
      mpsUrl: "https://beian.mps.gov.cn/#/query/webSearch?code=11010202010763",
      icpIcon:
        "https://s3.cn-northwest-1.amazonaws.com.cn/users.kungfu-trader.com/uploads/2023/12/logo01.6189a29f1.png",
      agreementUrl: "https://www.kungfu-trader.com/index.php/user_agreement/",
      privacyPolicyUrl:
        "https://www.kungfu-trader.com/index.php/privacy_policy/",
      disclaimerUrl: "https://www.kungfu-trader.com/index.php/disclaimer/",
    },
  }
];

const getMenu = (product) => {
  return items.find((v) => v.products.includes(product)) || items[0];
};

module.exports = getMenu;
