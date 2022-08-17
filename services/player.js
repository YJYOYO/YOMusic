import { yoRequest } from './index'

export function getSongDetail(ids) {
  return yoRequest.get({
    url: "/song/detail",
    data: {
      ids
    }
  })
} 

export function getSongLyric(id) {
  return yoRequest.get({
    url: "/lyric",
    data: {
      id
    }
  })
}