// pages/main-video/main-video.js
import { getVideoMV } from '../../services/video'
Page({
	data: {
    videoList: [],
    offset: 0,
    hasMore: true
  },

  onLoad() {
    // 发送网络请求
    this.fetchVideoMV()
  },

  async fetchVideoMV() {
    // 获取数据
    const res = await getVideoMV(this.data.offset)
    // 更新数据组
    const newVideoList = [...this.data.videoList, ...res.data]
    // 设置新数据
    this.setData({ videoList: newVideoList })
    // 跟新数据偏移量
    this.data.offset = this.data.videoList.length
    // 判断后面还有没有数据
    this.data.hasMore = res.hasMore
  },

  // 监听滚动到底部  加载更多数据
  onReachBottom() {
    // 判断是否还有数据
    if (!this.data.hasMore) return
    // 有就进行请求
    this.fetchVideoMV()
  },

  // 下拉加载新数据
  async onPullDownRefresh() {
    // 清空数据
    this.setData({ videoList: [] })
    // 重置偏移量...
    this.data.offset = 0
    this.data.hasMore = true
    // 请求数据
    await this.fetchVideoMV()
    // 结束下拉操作
    wx.stopPullDownRefresh()
  }

})