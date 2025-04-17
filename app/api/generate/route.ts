import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import puppeteer from 'puppeteer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { campaignId, templateId } = await request.json()

    if (!campaignId || !templateId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Fetch traffic rows for the campaign
    const { data: trafficRows, error: fetchError } = await supabase
      .from('traffic_rows')
      .select('*')
      .eq('campaign_id', campaignId)

    if (fetchError) {
      throw fetchError
    }

    // Group rows by station
    const stations = trafficRows.reduce((acc: Record<string, any[]>, row) => {
      if (!acc[row.station]) {
        acc[row.station] = []
      }
      acc[row.station].push(row)
      return acc
    }, {})

    // Generate PDF for each station
    const browser = await puppeteer.launch()
    const pdfUrls: string[] = []

    for (const [station, rows] of Object.entries(stations)) {
      const page = await browser.newPage()
      
      // TODO: Implement HTML template rendering
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              .header { text-align: center; margin-bottom: 2rem; }
              .logo { max-width: 200px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="/assets/logo.svg" alt="Logo" class="logo">
              <h1>Traffic Instructions</h1>
              <h2>${station}</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ISCI</th>
                  <th>Creative Title</th>
                  <th>Length</th>
                  <th>Flight Dates</th>
                  <th>Rotations</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map(row => `
                  <tr>
                    <td>${row.isci}</td>
                    <td>${row.creative_title}</td>
                    <td>${row.length_secs}s</td>
                    <td>${row.flight_start} - ${row.flight_end}</td>
                    <td>${row.rotations}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `

      await page.setContent(html)
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
      })

      // Upload PDF to Supabase Storage
      const fileName = `reports/${campaignId}/${station.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('traffic-reports')
        .upload(fileName, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('traffic-reports')
        .getPublicUrl(fileName)

      pdfUrls.push(publicUrl)
      await page.close()
    }

    await browser.close()

    return NextResponse.json({
      success: true,
      pdfUrls,
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate reports' },
      { status: 500 }
    )
  }
} 