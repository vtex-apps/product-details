import { values, map } from 'ramda'

const thumbnailsPosition = {
  DISPLAY_LEFT: {
    name: 'admin/editor.product-details.thumbnailsPosition.left',
    value: 'left',
  },
  DISPLAY_RIGHT: {
    name: 'admin/editor.product-details.thumbnailsPosition.right',
    value: 'right',
  },
}

export function getThumbnailsPositionNames() {
  return map(opt => opt.name, values(thumbnailsPosition))
}

export function getThumbnailsPositionValues() {
  return map(opt => opt.value, values(thumbnailsPosition))
}

export default thumbnailsPosition
