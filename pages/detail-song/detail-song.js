// pages/detail-song/detail-song.js
import recommendStore from '../../store/recommendStore'
import rankingStore from '../../store/rankingStore'
import playerStore from "../../store/playerStore"
import menuStore from "../../store/menuStore"
import { getPlaylistDetail } from '../../services/music'
const db = wx.cloud.database()
Page({
	data: {
		type: 'ranking',
		key: 'newRanking',
		id: '',

		songInfo: {},
		menuList: []
	},

	onLoad(options) {
		// 确定获取数据类型
		// type: ranking -> 榜单数据
		// type: recommend -> 推荐数据
		// console.log(options);
		const type = options.type
		this.setData({ type })

		// 获取Store中榜单的数据
		if (type === 'ranking') {
			const key = options.key
			this.data.key = key
			rankingStore.onState(key, this.handleRanking)
		} else if (type === 'recommend') {
			recommendStore.onState('recommendSongInfo', this.handleRanking)
		} else if (type === 'menu') {
			const id = options.id
			this.data.id = id
			this.fetchMenuSongInfo()
		} else if (type === 'profile') {
			const tabname = options.tabname
			const title = options.title
      this.handleProfileTabInfo(tabname, title)
		}

		// 歌单数据
    menuStore.onState("menuList", this.handleMenuList)
		
	},

	async fetchMenuSongInfo() {
		const res = await getPlaylistDetail(this.data.id)
		this.setData({ songInfo: res.playlist })
	},
	// 处理数据库数据
	async handleProfileTabInfo(tabname, title) {
    // 动态获取集合
    const collection = db.collection(`c_${tabname}`)

    // 获取数据的结果
    const res = await collection.get()
    this.setData({
      songInfo: {
        name: title,
        tracks: res.data
      }
    })
	},
	
	// 事件监听
	onSongItemTap() {
		playerStore.setState('playSongList', this.data.songInfo.tracks)
	},

	// 排行榜数据
	handleRanking(value) {
		this.setData({ songInfo: value })

	},

	handleMenuList(value) {
		this.setData({menuList: value })
	},

	onUnload() {
    if (this.data.type === "ranking") {
      rankingStore.offState(this.data.key, this.handleRanking)
    } else if (this.data.type === "recommend") {
      recommendStore.offState("recommendSongInfo", this.handleRanking)
		}
		
		
    menuStore.offState("menuList", this.handleMenuList)
  }
})