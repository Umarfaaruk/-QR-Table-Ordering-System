import { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Printer, QrCode } from 'lucide-react'
import toast from 'react-hot-toast'

/** Downloads a single table's QR code as a PNG. */
function downloadQR(tableId: string) {
  const canvas = document.getElementById(`qr-${tableId}`) as HTMLCanvasElement | null
  if (!canvas) return
  const url = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = url
  link.download = `cafe-spice-${tableId}.png`
  link.click()
}

export default function QRGenerator() {
  const [tableCount, setTableCount] = useState(10)
  const [tables, setTables] = useState<string[]>(() =>
    Array.from({ length: 10 }, (_, i) => `table-${i + 1}`),
  )
  const printRef = useRef<HTMLDivElement>(null)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const generate = () => {
    const n = Math.max(1, Math.min(100, tableCount))
    setTables(Array.from({ length: n }, (_, i) => `table-${i + 1}`))
    toast.success(`Generated ${n} QR code${n === 1 ? '' : 's'}`)
  }

  return (
    <div>
      {/* Controls */}
      <div className="no-print mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-600">
            Number of Tables
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={tableCount}
            onChange={(e) => setTableCount(Number(e.target.value))}
            className="w-32 rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <button
          onClick={generate}
          className="flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 font-bold text-white transition hover:bg-gold-dark"
        >
          <QrCode size={18} /> Generate QR Codes
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 font-bold text-gray-700 transition hover:bg-gray-50"
        >
          <Printer size={18} /> Print All
        </button>
        <p className="ml-auto self-center text-sm text-gray-400">
          Each code links to <code className="text-gray-600">/menu/&lt;table&gt;</code>
        </p>
      </div>

      {/* Grid */}
      <div ref={printRef} className="print-area">
        <div className="mb-4 hidden text-center print:block">
          <h1 className="text-2xl font-black">Café Spice — Scan to Order</h1>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {tables.map((tableId) => {
            const num = tableId.split('-')[1]
            const url = `${origin}/menu/${tableId}`
            return (
              <div
                key={tableId}
                className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm print:break-inside-avoid print:shadow-none"
              >
                <div className="rounded-xl bg-white p-2">
                  <QRCodeCanvas
                    id={`qr-${tableId}`}
                    value={url}
                    size={140}
                    level="M"
                    includeMargin
                    fgColor="#1a1a2e"
                  />
                </div>
                <p className="mt-3 text-lg font-extrabold text-gray-900">
                  Table {num}
                </p>
                <p className="text-[10px] text-gray-400">Scan to view menu</p>
                <button
                  onClick={() => downloadQR(tableId)}
                  className="no-print mt-3 flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  <Download size={14} /> Download
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
