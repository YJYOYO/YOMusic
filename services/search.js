import { yoRequest } from './index'

export function getSearchHot() {
  return yoRequest.get({
    url: "/search/hot"
  })
}

export function getSearchSuggest(keywords) {
  return yoRequest.get({
    url: "/search/suggest",
    data: {
      keywords,
      type: "mobile"
    }
  })
}

export function getSearchResult(keywords) {
  return yoRequest.get({
    url: "/search",
    data: {
      keywords
    }
  })
}