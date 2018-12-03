export const DEFAULT_WIDTH = 'auto'
export const DEFAULT_HEIGHT = 'auto'
export const MAX_WIDTH = 3000
export const MAX_HEIGHT = 4000
export const RESIZE_RATE = 1 / 2

const baseUrlRegex = new RegExp(/.+ids\/(\d+)(?:-(\d+)-(\d+)|)\//)
const sizeRegex = new RegExp(/-(\d+)-(\d+)/)

export function cleanImageUrl(imageUrl) {
  let resizedImageUrl = imageUrl
  const result = baseUrlRegex.exec(imageUrl)
  if (result.length > 0) {
    if (result.length === 4 && result[2] && result[3]) {
      resizedImageUrl = result[0].replace(sizeRegex, '')
    } else {
      resizedImageUrl = result[0]
    }
    return resizedImageUrl
  }
}

export function changeImageUrlSize(
  imageUrl,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
) {
  if (!imageUrl) return
  typeof width === 'number' && (width = Math.min(width, MAX_WIDTH))
  typeof height === 'number' && (height = Math.min(height, MAX_HEIGHT))

  imageUrl = cleanImageUrl(imageUrl)
  const resizedImageUrl = imageUrl.slice(0, -1) // Remove last "/"
  return `${resizedImageUrl}-${width}-${height}`
}

export const nextImageUrl = (imageUrl, initialWidth) => (tryCount) => {
  return changeImageUrlSize(imageUrl, Math.floor(initialWidth * Math.pow(RESIZE_RATE, tryCount)))
}
