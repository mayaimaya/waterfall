import { ColorRGBA, LUT } from '@arction/lcjs'

import spectroXCmap from './spectroXCmap.json'

const stepsValues = { min: -170, max: -50 }

export const pallete = new LUT({
  steps: spectroXCmap.spectroXCmap.map(
    ({ val, rgb }) => ({
      value: val * (stepsValues.max - stepsValues.min) + stepsValues.min,
      color: ColorRGBA(rgb[0], rgb[1], rgb[2])
    })),
  units: 'dBm',
  interpolate: true
})
