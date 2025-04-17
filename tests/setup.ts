import '@testing-library/jest-dom'
import { beforeAll, afterAll, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
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
          choices: [{ message: { content: JSON.stringify({ mappings: {} }) } }],
        }),
      },
    }
  },
}))

// Setup MSW
const handlers = [
  rest.post('/api/upload', (req, res, ctx) => {
    return res(ctx.json({ success: true, rowCount: 1 }))
  }),
  rest.post('/api/generate', (req, res, ctx) => {
    return res(ctx.json({ success: true, pdfUrls: ['https://example.com/test.pdf'] }))
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close()) 