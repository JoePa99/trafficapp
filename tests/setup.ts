import '@testing-library/jest-dom'
import { beforeAll, afterAll, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { vi } from 'vitest'

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      insert: () => Promise.resolve({ data: null, error: null }),
      select: () => Promise.resolve({ data: [], error: null }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: { path: 'test.pdf' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'https://example.com/test.pdf' } }),
      }),
    },
  }),
}))

// Mock OpenAI client
vi.mock('openai', () => ({
  OpenAI: class {
    chat = {
      completions: {
        create: () => Promise.resolve({
          choices: [{
            message: {
              content: JSON.stringify({
                normalizedData: {
                  client: 'Test Client',
                  product: 'Test Product',
                  startDate: '2024-01-01',
                  endDate: '2024-01-31',
                  mediaType: 'Digital',
                  budget: 10000,
                  targetAudience: 'Adults 18-49',
                  campaignGoals: 'Brand Awareness',
                  specialInstructions: 'None',
                },
              }),
            },
          }],
        }),
      },
    }
  },
}))

// Setup MSW
const handlers = [
  http.post('/api/upload', () => {
    return HttpResponse.json({ success: true, rowCount: 1 })
  }),
  http.post('/api/generate', () => {
    return HttpResponse.json({ success: true, pdfUrls: ['https://example.com/test.pdf'] })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close()) 