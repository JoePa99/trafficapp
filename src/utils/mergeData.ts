import { TrafficRow } from '@/types/traffic'

interface NormalizedSpec {
  client: string
  product: string
  startDate: string
  endDate: string
  mediaType: string
  budget: number
  targetAudience: string
  campaignGoals: string
  specialInstructions: string
  platformType?: string
  dma?: string
}

interface NormalizedStation {
  station: string
  market: string
  dma: string
  platformType: string
  rate: number
  additionalInfo?: string
}

interface MergeOptions {
  filterByPlatformType?: boolean
  filterByDMA?: boolean
  selectedStations?: string[]
}

export function mergeSpecAndStationData(
  specData: NormalizedSpec[],
  stationData: NormalizedStation[],
  options: MergeOptions = {}
): TrafficRow[] {
  const mergedRows: TrafficRow[] = []

  for (const spec of specData) {
    for (const station of stationData) {
      // Apply filters if specified
      if (options.filterByPlatformType && spec.platformType !== station.platformType) {
        continue
      }
      if (options.filterByDMA && spec.dma !== station.dma) {
        continue
      }
      if (options.selectedStations && !options.selectedStations.includes(station.station)) {
        continue
      }

      // Create merged TrafficRow
      const mergedRow: TrafficRow = {
        client: spec.client,
        product: spec.product,
        station: station.station,
        market: station.market,
        dma: station.dma,
        platformType: station.platformType,
        startDate: spec.startDate,
        endDate: spec.endDate,
        rate: station.rate,
        mediaType: spec.mediaType,
        budget: spec.budget,
        targetAudience: spec.targetAudience,
        campaignGoals: spec.campaignGoals,
        specialInstructions: spec.specialInstructions,
        additionalInfo: station.additionalInfo || '',
      }

      mergedRows.push(mergedRow)
    }
  }

  return mergedRows
} 