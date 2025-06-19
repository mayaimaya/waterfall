import { LUT, ColorRGBA } from '@arction/lcjs'

export const createLutPalette = () =>
  new LUT({
    steps: [
      { value: 0.0, color: ColorRGBA(0, 0, 0) },
      { value: 0.2, color: ColorRGBA(0, 0, 255) },
      { value: 0.5, color: ColorRGBA(0, 255, 0) },
      { value: 0.8, color: ColorRGBA(255, 255, 0) },
      { value: 1.0, color: ColorRGBA(255, 0, 0) },
    ],
    interpolate: true,
  })
