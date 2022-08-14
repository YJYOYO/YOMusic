// pages/detail-video/detail-video.js
import { getMVUrl, getMVInfo, getMVRelated } from '../../services/video'
Page({
	data: {
		id: 0,
		mvUrl: '',
		mvInfo: {},
		relatedVideo: [],
	},
	onLoad(options) {
		// 拿到携带的id
		const id = options.id
		this.setData({ id })

		this.fetchMVUrl()
		this.fetchMVInfo()
		this.fetchMVRelated()
	},

	//请求MVUrl
	async fetchMVUrl() {
		const res = await getMVUrl(this.data.id)
		this.setData({ mvUrl: res.data.url })
		console.log(this.data.mvUrl);
	},

	// 请求MVInfo
	async fetchMVInfo() {
		const res = await getMVInfo(this.data.id)
		this.setData({ mvInfo: res.data })
	},

	async fetchMVRelated() {
		const res = await getMVRelated(this.data.id)
		this.setData({ relatedVideo: res.data })
	}
})