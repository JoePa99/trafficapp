import { TrafficRow, StationMeta, StationFlightDates } from '../types/traffic'

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
  contactName: string
  contactEmails: string[]
  phone?: string
  additionalInfo?: string
}

interface MergeOptions {
  filterByPlatformType?: boolean
  filterByDMA?: boolean
  selectedStations?: string[]
  agencyPhone?: string
}

export function mergeSpecAndStationData(
  specData: NormalizedSpec[],
  stationData: NormalizedStation[],
  options: MergeOptions = {}
): { mergedRows: TrafficRow[]; flightDates: StationFlightDates[] } {
  const mergedRows: TrafficRow[] = []
  const stationDates: Record<string, { startDates: string[]; endDates: string[] }> = {}

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

      // Track dates for each station
      if (!stationDates[station.station]) {
        stationDates[station.station] = { startDates: [], endDates: [] }
      }
      stationDates[station.station].startDates.push(spec.startDate)
      stationDates[station.station].endDates.push(spec.endDate)

      // Create merged TrafficRow
      const mergedRow: TrafficRow = {
        client: spec.client,
        product: spec.product,
        station: station.station,
        market: station.market,
        contactName: station.contactName,
        contactEmails: station.contactEmails,
        phone: station.phone || options.agencyPhone,
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

  // Compute overall flight dates for each station
  const flightDates: StationFlightDates[] = Object.entries(stationDates).map(([station, dates]) => {
    const startTimestamps = dates.startDates.map(date => new Date(date).getTime())
    const endTimestamps = dates.endDates.map(date => new Date(date).getTime())
    
    return {
      station,
      overallStartDate: new Date(Math.min(...startTimestamps)).toISOString().split('T')[0],
      overallEndDate: new Date(Math.max(...endTimestamps)).toISOString().split('T')[0],
    }
  })

  return { mergedRows, flightDates }
} 