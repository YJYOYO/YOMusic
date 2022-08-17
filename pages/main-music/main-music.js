// pages/main-music/main-music.js
import { getMusicBanner, getSongMenuList} from '../../services/music'
import querySelect from '../../utils/query-select'
import recommendStore from '../../store/recommendStore'
import rankingStore from '../../store/rankingStore'
import playerStore from "../../store/playerStore"
import { throttle } from 'underscore'
// 节流返回新的函数
const querySelectThrottle = throttle(querySelect, 100)
const app = getApp()
Page({
	data: {
    searchValue: "",
    banners: [],
    bannerHeight: 0,
    screenWidth: 375,

    recommendSongs: [],

    // 歌单数据
    hotMenuList: [],
    recMenuList: [],
    // 巅峰榜数据
    isRankingData: false,
    rankingInfos: {},

    // 当前正在播放的歌曲信息
    currentSong: {},
		isPlaying: false,
		
		// 轮播图滚动当前图片
		currentIndex: 0,
	},

	onLoad() {
		// qingqiu轮播图数据
		this.fetchMusicBanner()
		//qingqiu推荐歌单数据
		this.fetchSongMenuList()

		// 先监听recommend  的   Store中的数据
		recommendStore.onState('recommendSongInfo', this.handleRecommendSongs)
		// 先监听ranking   的   Store中的数据
		rankingStore.onState('newRanking', this.handleNewRanking)
		rankingStore.onState('originRanking', this.handleOriginRanking)
		rankingStore.onState('upRanking', this.handleUpRanking)
		// 监听player   的  Store中的数据 
		// 再发起action
		recommendStore.dispatch('fetchRecommendSongsAction')
		rankingStore.dispatch('fetchRankingDataAction')

		playerStore.onStates(["currentSong", "isPlaying"], this.handlePlayInfos)

		// 获取屏幕的尺寸
		this.setData({ screenWidth: app.globalData.screenWidth })
		
	},



	// 网络请求的封装
	async fetchMusicBanner() {
		const res = await getMusicBanner()
		this.setData({
			banners: res.banners
		})
	},
	async fetchSongMenuList() {
		getSongMenuList().then(res => {
			// console.log(res);
			this.setData({ hotMenuList: res.playlists })
		})

		getSongMenuList('华语').then(res => {
			// console.log(res);
			this.setData({ recMenuList: res.playlists })
		})
	},


	// 界面的事件监听
	// 轮播图拿到currentIndex
	currentTab(event) {
		this.setData({ currentIndex: event.detail.current })
		console.log(this.data.currentIndex);
	},

	onSearchClick() {
		wx.navigateTo({
			url: '/pages/detail-search/detail-search',
		})
	},
	//获取到盒子架子的高度
	onBannerImageLoad(event) {
    querySelectThrottle(".banner-image").then(res => {
      this.setData({ bannerHeight: res[0].height })
    })
	},
	// 查看更多
	onRecommendMoreClick() {
		wx.navigateTo({
			url: '/pages/detail-song/detail-song?type=recommend',
		})
	},

	// 推荐歌单的点击
	onSongItemTap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playSongList", this.data.recommendSongs)
    playerStore.setState("playSongIndex", index)
	},
	// 首页音乐播放工具栏
	onPlayOrPauseBtnTap() {
    playerStore.dispatch("changeMusicStatusAction")
	},
	// 首页工具栏点击跳转
	onPlayBarAlbumTap() {
    wx.navigateTo({
      url: '/packagePlayer/pages/music-player/music-player',
    })
  },

//////////////////////////////////////

	// 从Store中获取数据
	// 推荐歌曲
	handleRecommendSongs(value) {
		if (!value.tracks) return
		this.setData({ recommendSongs: value.tracks.slice(0, 6) })
	},
	// 新歌榜
	handleNewRanking(value) {
		if (!value.name) return
		this.setData({ isRankingData: true })
		const newRankingInfos = { ...this.data.rankingInfos, newRanking: value }
		this.setData({ rankingInfos: newRankingInfos })
	},
	// 原创榜
	handleOriginRanking(value) {
		if (!value.name) return
		this.setData({ isRankingData: true })
		const newRankingInfos = { ...this.data.rankingInfos, originRanking: value }
		this.setData({ rankingInfos: newRankingInfos })
	},
	// 飙升榜
	handleUpRanking(value) {
		if (!value.name) return
		this.setData({ isRankingData: true })
		const newRankingInfos = { ...this.data.rankingInfos, upRanking: value }
		this.setData({ rankingInfos: newRankingInfos })
	},
	// onstate回调函数的处理
	handlePlayInfos({ currentSong, isPlaying }) {
    if (currentSong) {
      this.setData({ currentSong })
    }
    if (isPlaying !== undefined) {
      this.setData({ isPlaying })
    }
  },
	
	// 取消监听
	onUnload() {
    recommendStore.offState("recommendSongs", this.handleRecommendSongs)
    rankingStore.offState("newRanking", this.handleNewRanking)
    rankingStore.offState("originRanking", this.handleOriginRanking)
		rankingStore.offState("upRanking", this.handleUpRanking)
		
		playerStore.offStates(["currentSong", "isPlaying"], this.handlePlayInfos)
  }
})