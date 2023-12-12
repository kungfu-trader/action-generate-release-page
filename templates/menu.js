const menus = [
  {
    products: ["kungfu-trader"],
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
        title: "功夫文档",
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
  },
];

const getMenu = (product) => {
  return menus.find((v) => v.products.includes(product))?.menu || [];
};

module.exports = getMenu;
