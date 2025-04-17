import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { TrafficRowSchema } from '@/lib/schemas/trafficRow'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // TODO: Implement file parsing based on type (CSV/XLS/XLSX)
    const fileType = file.type
    let rows: any[] = []

    if (fileType === 'text/csv') {
      // Parse CSV
      const text = await file.text()
      // TODO: Implement CSV parsing
    } else if (
      fileType === 'application/vnd.ms-excel' ||
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      // Parse Excel
      // TODO: Implement Excel parsing
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      )
    }

    // Validate and normalize data
    const normalizedRows = rows.map(row => {
      try {
        return TrafficRowSchema.parse(row)
      } catch (error) {
        console.error('Validation error:', error)
        return null
      }
    }).filter(Boolean)

    // Store in Supabase
    const { data, error } = await supabase
      .from('traffic_rows')
      .insert(normalizedRows)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      rowCount: normalizedRows.length,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
} 