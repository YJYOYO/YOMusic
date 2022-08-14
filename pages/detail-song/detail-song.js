// pages/detail-song/detail-song.js
import recommendStore from '../../store/recommendStore'
import rankingStore from '../../store/rankingStore'
import { getPlaylistDetail } from '../../services/music'
Page({
	data: {
		type: 'ranking',
		key: 'newRanking',
		id: '',

		songInfo: {}
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
		}
	},

	async fetchMenuSongInfo() {
		const res = await getPlaylistDetail(this.data.id)
		this.setData({ songInfo: res.playlist })
	},

	// 排行榜数据
	handleRanking(value) {
		this.setData({ songInfo: value })
	},

	onUnload() {
    if (this.data.type === "ranking") {
      rankingStore.offState(this.data.key, this.handleRanking)
    } else if (this.data.type === "recommend") {
      recommendStore.offState("recommendSongInfo", this.handleRanking)
    }
  }
})