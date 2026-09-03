import rawColors from '../data/wada-colors.json'

export interface WadaColor {
  name: string
  combinations: number[]
  swatch: number
  cmyk: [number, number, number, number]
  lab: [number, number, number]
  rgb: [number, number, number]
  hex: string
}

export const wadaColors = rawColors as WadaColor[]

export const wadaHexSet = new Set(wadaColors.map((c) => c.hex.toLowerCase()))

const combinationIndex = new Map<number, WadaColor[]>()
for (const color of wadaColors) {
  for (const comboId of color.combinations) {
    const list = combinationIndex.get(comboId) ?? []
    list.push(color)
    combinationIndex.set(comboId, list)
  }
}

export const combinationIds = [...combinationIndex.keys()].sort((a, b) => a - b)

/** Every color belonging to Wada combination `id`, in the source book's numbering. Throws if the id doesn't exist — combinations are never invented. */
export function getCombination(id: number): WadaColor[] {
  const colors = combinationIndex.get(id)
  if (!colors || colors.length === 0) {
    throw new Error(`Unknown Wada combination #${id}`)
  }
  return colors
}

export function isWadaHex(hex: string): boolean {
  return wadaHexSet.has(hex.toLowerCase())
}
