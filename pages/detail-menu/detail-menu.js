// pages/detail-menu/detail-menu.js
import { getSongMenuTag, getSongMenuList } from "../../services/music"
Page({
	data: {
		songMenus: []
	},

	onLoad() {
		this.fetchAllMenuList()
	},
	// 网络请求
	async fetchAllMenuList() {
		// 获取tags
		const tagRes = await getSongMenuTag()
		console.log(tagRes);
		const tags = tagRes.tags

		//根据tags去获取对应的歌单
		const allPromises = []
		for (const tag of tags) {
			const promise = getSongMenuList(tag.name)
			allPromises.push(promise)
		}

		// 获取到数据  使用all方法
		Promise.all(allPromises).then(res => {
      this.setData({ songMenus: res })
      console.log(this.data.songMenus);
		})
	}
})