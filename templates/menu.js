const items = [
  {
    products: ["kungfu-trader"],
    homePage: "https://www.kungfu-trader.com",
    logo: {
      url: "https://s3.cn-northwest-1.amazonaws.com.cn/users.kungfu-trader.com/uploads/2024/01/cropped-cropped-log-18-300x82_副本.png",
      height: 82,
      offset: -2,
      wrap: 79,
      position: "fixed",
    },
    useArtifactName: true,
    menu: [
      {
        title: "首页",
        url: "https://www.kungfu-trader.com/",
      },
      {
        title: "产品",
        class: "active",
        children: [
          {
            title: "解决方案",
            url: "https://www.kungfu-trader.com/index.php/solution/",
            target: "_blank",
            class: "",
          },
          {
            title: "功夫核心库",
            url: "https://www.libkungfu.cc/",
            target: "_blank",
            class: "",
          },
          {
            title: "历史版本",
            url: "https://releases.kungfu-trader.com/",
            target: "_blank",
            class: "active",
          },
        ],
      },
      {
        title: "文档",
        url: "https://docs.kungfu-trader.com/latest/index.html",
        target: "_blank",
      },
      {
        title: "博客",
        url: "https://www.kungfu-trader.com/index.php/blog/",
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
    docUrl: "https://docs.kungfu-trader.com",
  },
  {
    products: ["artifact-kungfu"],
    homePage: "https://www.libkungfu.cc",
    logo: {
      url: "https://s3.cn-northwest-1.amazonaws.com.cn/www.libkungfu.cc/uploads/2024/02/cropped-核心库3.png",
      height: 85,
      offset: -8,
      wrap: 72,
      position: "absolute",
    },
    menu: [
      {
        title: "文档",
        url: "https://docs.libkungfu.cc/latest/index.html",
        target: "_blank",
      },
      {
        title: "版本",
        url: "https://releases.libkungfu.cc/",
        target: "_blank",
        class: "active",
      },
      {
        title: "功夫量化",
        url: "https://www.kungfu-trader.com/",
        target: "_blank",
      },
      {
        title: "github",
        icon: "https://s3.cn-northwest-1.amazonaws.com.cn/www.libkungfu.cc/uploads/2024/02/github-mark-white.png",
        url: "https://github.com/kungfu-origin/kungfu",
        target: "_blank",
      },
    ],
    workingScheule: {
      imageUrl:
        "https://s3.cn-northwest-1.amazonaws.com.cn/www.libkungfu.cc/uploads/2024/02/working-schedule.png",
      data: Object.entries({
        "v2.4": {
          start: "2022-02-07",
          end: "2023-11-03",
          codename: "",
        },
        "v2.5": {
          start: "2023-02-28",
          end: "2024-02-01",
          codename: "",
        },
        "v2.6": {
          start: "2023-03-01",
          lts: "2023-05-22",
          maintenance: "2024-01-23",
          end: "2024-05-30",
          codename: "",
        },
        "v2.7": {
          start: "2023-05-29",
          lts: "2023-12-09",
          end: "2024-12-01",
        },
        "v3.0": {
          start: "2024-02-23",
          end: "2025-12-30",
        },
      }).map((v) => ({
        name: v[0],
        ...v[1],
      })),
    },
    detailUrl: "https://releases.libkungfu.cc/detail.html",
    copyright: {
      year: "2017 - 2024",
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
      bgcolor: "transparent",
      color: "#343434",
    },
    docUrl: "https://docs.libkungfu.cc",
  },
];

const getMenu = (product) => {
  return items.find((v) => v.products.includes(product)) || items[0];
};

module.exports = getMenu;
