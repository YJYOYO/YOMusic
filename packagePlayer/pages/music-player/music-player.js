// pages/music-player/music-player.js
import playerStore, { audioContext } from "../../../store/playerStore"
import { throttle } from 'underscore'

const app = getApp()
// 播放模式
const modeNames = ["order", "repeat", "random"]

Page({
	data: {
		// 需要从Store中监听的数据
    stateKeys: ["id", "currentSong", "durationTime", "currentTime", "lyricInfos", "currentLyricText", "currentLyricIndex", "isPlaying", "playModeIndex"],

    id: 0,
    currentSong: {},
    currentTime: 0,
    durationTime: 0,
    lyricInfos: [],
    currentLyricText: "",
    currentLyricIndex: -1,
    
    isPlaying: true,
    
    playSongIndex: 0,
    playSongList: [],
    isFirstPlay: true,
    
    playModeName: "order",

    pageTitles: ["歌曲", "歌词"],
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSliderChanging: false,
    isWaiting: false,

    lyricScrollTop: 0
	},
	
	onLoad(options) {
		// 获取设备信息
		this.setData({
			// 拿到设备状态栏的高度 和 要设置内容的高度
			statusHeight: app.globalData.statusHeight,
      contentHeight: app.globalData.contentHeight
		})

		// 拿到跳转传入的id
		const id = options.id
		// 根据id播放歌曲
		if (id) {
      playerStore.dispatch("playMusicWithSongIdAction", id)
    }

		// 获取store共享数据
		playerStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
		playerStore.onStates(this.data.stateKeys, this.getPlayerInfosHandler)
	
	},

		// 记录当前的时间  修改滑块的值
		updateProgress: throttle(function(currentTime) {
			if (this.data.isSliderChanging) return
			const sliderValue = currentTime / this.data.durationTime * 100
			this.setData({ currentTime, sliderValue })
		}, 800, { leading: false, trailing: false }),




	// 事件监听
	// 左上返回图标
	onNavBackTap() {
    wx.navigateBack()
  },
	// 拿到轮播当前的索引
	onSwiperChange(event) {
		this.setData({ currentPage: event.detail.current })
	},
	// 拿到点击标题的索引
	onNavTabItemTap(event) {
		const index = event.currentTarget.dataset.index
		this.setData({ currentPage: index })
	},
	// 监听滑块的改变
	onSliderChange(event) {
    this.data.isWaiting = true
    setTimeout(() => {
      this.data.isWaiting = false
    }, 500)
    // 获取点击滑块位置对应value
    const value = event.detail.value

    // 计算出要播放的位置时间
    const currentTime = value / 100 * this.data.durationTime

    // 重新设置播放器, 播放计算出的时间
    audioContext.seek(currentTime / 1000)
    this.setData({ currentTime, isSliderChanging: false, sliderValue: value })
	},
	
  onSliderChanging: throttle(function(event) {
    // 获取滑动到的位置的value
    const value = event.detail.value

    // 根据当前的值, 计算出对应的时间
    const currentTime = value / 100 * this.data.durationTime
    this.setData({ currentTime })

    // 当前正在滑动
    this.data.isSliderChanging = true
	}, 100),
	// 音乐工具栏控制器的监听
	onPlayOrPauseTap() {
    playerStore.dispatch("changeMusicStatusAction")
  },
  onPrevBtnTap() {
    playerStore.dispatch("playNewMusicAction", false)
  },
  onNextBtnTap() {
    playerStore.dispatch("playNewMusicAction")
  },
  onModeBtnTap() {
    playerStore.dispatch("changePlayModeAction")
  },
	
	// Store共享数据
	// onstate回调函数的处理
  getPlaySongInfosHandler({ playSongList, playSongIndex }) {
    if (playSongList) {
      this.setData({ playSongList })
    }
    if (playSongIndex !== undefined) {
      this.setData({ playSongIndex })
    }
	},
	// onstate回调函数的处理
  getPlayerInfosHandler({ 
    id, currentSong, durationTime, currentTime,
    lyricInfos, currentLyricText, currentLyricIndex,
    isPlaying, playModeIndex
  }) {
    if (id !== undefined) {
      this.setData({ id })
    }
    if (currentSong) {
      this.setData({ currentSong })
    }
    if (durationTime !== undefined) {
      this.setData({ durationTime })
    }
    if (currentTime !== undefined) {
      // 根据当前时间改变进度
      this.updateProgress(currentTime)
    }
    if (lyricInfos) {
      this.setData({ lyricInfos })
    }
    if (currentLyricText) {
      this.setData({ currentLyricText })
    }
    if (currentLyricIndex !== undefined) { 
      // 修改lyricScrollTop
      this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
    }
    if (isPlaying !== undefined) {
      this.setData({ isPlaying })
    }
    if (playModeIndex !== undefined) {
      this.setData({ playModeName: modeNames[playModeIndex] })
    }
  },

  onUnload() {
    playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
    playerStore.offStates(this.data.stateKeys, this.getPlayerInfosHandler)
  }
})