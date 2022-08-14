import { yoRequest } from './index'

// 请求视频首页数据
export function getVideoMV(offset = 0, limit = 20) {
  return yoRequest.get({
    url: "/top/mv",
    data: {
      limit,
      offset
    }
  })
}

// 请求详情页MV数据
export function getMVUrl(id) {
  return yoRequest.get({
    url: "/mv/url",
    data: {
      id
    }
  })
}

// 请求详情页视频info
export function getMVInfo(mvid) {
  return yoRequest.get({
    url: "/mv/detail",
    data: {
      mvid
    }
  })
}

// 请求详情页推荐视频
export function getMVRelated(id) {
  return yoRequest.get({
    url: "/related/allvideo",
    data: {
      id
    }
  })
}