// pages/main-profile/main-profile.js
import { menuCollection } from "../../database/index"
import menuStore from "../../store/menuStore"
Page({
	data: {
		isLogin: false,
		userInfo: {},

		tabs: [{
				name: "我的收藏",
				type: "favor"
			},
			{
				name: "我的喜欢",
				type: "like"
			},
			{
				name: "历史记录",
				type: "history"
			},
		],

		isShowDialog: false,
		menuName: "",
		menuList: []
	},

	onLoad() {
		// 判断用户是否登录
		const openid = wx.getStorageSync('openid')
		const userInfo = wx.getStorageSync('userinfo')
		this.setData({
			isLogin: !!openid
		})
		if (this.data.isLogin) {
			this.setData({
				userInfo
			})
		}

		// 共享歌单数据
    menuStore.onState("menuList", this.handleMenuList)
	},

	// 事件监听
	// 获取用户的头像和昵称
	async onUserInfoTap() {
		const profile = await wx.getUserProfile({
			desc: '获取您的头像和昵称',
		})

		// 获取用户的openid
		const loginRes = await wx.cloud.callFunction({
			name: "music-login"
		})
		const openid = loginRes.result.openid

		// 保存在本地
		wx.setStorageSync('openid', openid)
		wx.setStorageSync('userinfo', profile.userInfo)

		// profile中的数据修改
		this.setData({ isLogin: true, userInfo: profile.userInfo })
	},

	// tabs点击事件
	onTabItemClick(event) {
    const item = event.currentTarget.dataset.item
    
    wx.navigateTo({
      url: `/pages/detail-song/detail-song?type=profile&tabname=${item.type}&title=${item.name}`,
    })
	},
	
	// 点击添加歌单
	onPlusTap() {
    this.setData({ isShowDialog: true })
	},
	async onConfirmTap() {
    // 获取歌单的名称
    const menuName = this.data.menuName

    // 模拟歌单数据
    const menuRecord = {
      name: menuName,
      songList: []
    }

    // 将歌单记录添加数据库中
    const res = await menuCollection.add(menuRecord)
    if (res) {
      wx.showToast({ title: "添加歌单成功~" })
      menuStore.dispatch("fetchMenuListAction")
    }
	},
	// 不写这个会报错
	onInputChange() {},

	// Store数据
	handleMenuList(value) {
    this.setData({ menuList: value })
  },

  onUnload() {
    menuStore.offState("menuList", this.handleMenuList)
  }
})