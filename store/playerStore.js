import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from "../services/player"
import { parseLyric } from "../utils/parseLyric"

export const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state: {
    playSongList: [],
    playSongIndex: 0,

    id: 0,
    currentSong: {},
    currentTime: 0,
    durationTime: 0,
    lyricInfos: [],
    currentLyricText: "",
    currentLyricIndex: -1,

    isFirstPlay: true,

    isPlaying: false,
    playModeIndex: 0, // 0:顺序播放 1:单曲循环 2:随机播放
  },

  actions: {
    playMusicWithSongIdAction(ctx, id) {
      // 数据重置
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.durationTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ""
      ctx.lyricInfos = []

      // 保存id
      ctx.id = id
      ctx.isPlaying = true

      // 请求歌曲相关的数据
      // 根据id获取歌曲的详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
      })

      // 根据id获取歌词的信息
      getSongLyric(id).then(res => {
        const lrcString = res.lrc.lyric
        const lyricInfos = parseLyric(lrcString)
        ctx.lyricInfos = lyricInfos
      })

      // 播放当前的歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true

      // 监听播放的进度
      if (ctx.isFirstPlay) {
        ctx.isFirstPlay = false

        audioContext.onTimeUpdate(() => {
          // 获取当前播放的时间
          ctx.currentTime = audioContext.currentTime * 1000
    
          // 匹配正确的歌词
          if (!ctx.lyricInfos.length) return
          let index = ctx.lyricInfos.length - 1
          for (let i = 0; i < ctx.lyricInfos.length; i++) {
            const info = ctx.lyricInfos[i]
            if (info.time > audioContext.currentTime * 1000) {
              index = i - 1
              break
            }
          }
          // 解决调用频繁
          if (index === ctx.currentLyricIndex) return
    
          // 获取歌词的索引index和文本text
          // 改变歌词滚动页面的位置
          const currentLyricText = ctx.lyricInfos[index].text
          ctx.currentLyricText = currentLyricText
          ctx.currentLyricIndex = index
        })
        audioContext.onWaiting(() => {
          audioContext.pause()
        })
        audioContext.onCanplay(() => {
          audioContext.play()
        })
        audioContext.onEnded(() => {
          // 如果是单曲循环, 不需要切换下一首歌
          if (audioContext.loop) return

          // 切换下一首歌曲
          this.dispatch("playNewMusicAction")
        })
      }
    },

    changeMusicStatusAction(ctx) {
      if (!audioContext.paused) {
        audioContext.pause()
        ctx.isPlaying = false
      } else {
        audioContext.play()
        ctx.isPlaying = true
      }
    },
  
    changePlayModeAction(ctx) {
      // 计算新的模式
      let modeIndex = ctx.playModeIndex
      modeIndex = modeIndex + 1
      if (modeIndex === 3) modeIndex = 0
  
      // 设置是否是单曲循环
      if (modeIndex === 1) {
        audioContext.loop = true
      } else {
        audioContext.loop = false
      }
  
      // 保存当前的模式
      ctx.playModeIndex = modeIndex
    },
  
    playNewMusicAction(ctx, isNext = true) {
      // 获取之前的数据
      const length = ctx.playSongList.length
      let index = ctx.playSongIndex
  
      // 根据之前的数据计算最新的索引
      switch (ctx.playModeIndex) {
        case 1:
        case 0: // 顺序播放
          index = isNext ? index + 1: index - 1
          if (index === length) index = 0
          if (index === -1) index = length - 1
          break
        case 2: // 随机播放
          index = Math.floor(Math.random() * length)
          break
      }
  
      // 根据索引获取当前歌曲的信息
      const newSong = ctx.playSongList[index]
  
      // 开始播放新的歌曲
      this.dispatch("playMusicWithSongIdAction", newSong.id)
  
      // 保存最新的索引值
      ctx.playSongIndex = index
    }
  },
})

export default playerStore
