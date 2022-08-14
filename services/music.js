import { yoRequest } from '../services/index'

export function getMusicBanner(type = 0) {
  return yoRequest.get({
    url: "/banner",
    data: {
      type
    }
  })
}


export function getPlaylistDetail(id) {
  return yoRequest.get({
    url: "/playlist/detail",
    data: {
      id
    }
  })
}

export function getSongMenuList(cat = "全部", limit = 6, offset = 0) {
  return yoRequest.get({
    url: "/top/playlist",
    data: {
      cat,
      limit,
      offset
    }
  })
}


export function getSongMenuTag() {
  return yoRequest.get({
    url: "/playlist/hot"
  })
}