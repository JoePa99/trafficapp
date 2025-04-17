export interface StationMeta {
  station: string
  market: string
  contactName: string
  contactEmails: string[]
  phone?: string
}

export interface TrafficRow {
  client: string
  product: string
  station: string
  market: string
  contactName: string
  contactEmails: string[]
  phone?: string
  dma: string
  platformType: string
  startDate: string
  endDate: string
  rate: number
  mediaType: string
  budget: number
  targetAudience: string
  campaignGoals: string
  specialInstructions: string
  additionalInfo: string
}

export interface StationFlightDates {
  station: string
  overallStartDate: string
  overallEndDate: string
} 