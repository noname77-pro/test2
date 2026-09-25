import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { useMemo } from 'react'
import { EASE, Reveal, SlideShell } from '../ui'

/** QR-kod shu manzilni kodlaydi (loyiha ichida yaratiladi, tashqi API ishlatilmaydi) */
const SIMULATOR_PUBLIC_URL = 'https://qiya-tekislik-lab.vercel.app/'
const SIMULATOR_PUBLIC_LABEL = 'qiya-tekislik-lab.vercel.app'

/** QR o‘lchami (1920×1080 kanvasda, px) va atrofidagi bo‘sh hoshiya (modul soni) */
const QR_SIZE = 420
const QUIET_ZONE = 4

const POINTS = [
  'qiyalik burchagini o‘zgartiring',
  'kuchlarning yo‘nalishini kuzating',
  'jismning sirpanish shartini tajribada tekshiring',
]

/** Oq fonda qora QR — SVG sifatida chiziladi */
function QrCode({ value, size }: { value: string; size: number }) {
  const { path, count } = useMemo(() => {
    const qr = QRCode.create(value, { errorCorrectionLevel: 'M' })
    const n = qr.modules.size
    let d = ''
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.modules.get(r, c)) d += `M${c + QUIET_ZONE} ${r + QUIET_ZONE}h1v1h-1z`
      }
    }
    return { path: d, count: n + QUIET_ZONE * 2 }
  }, [value])

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${count} ${count}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`QR-kod: ${value}`}
      className="block"
    >
      <rect width={count} height={count} fill="#FFFFFF" />
      <path d={path} fill="#000000" />
    </svg>
  )
}

/* 16 — Interaktiv simulyator */
export function SimulatorSlide() {
  return (
    <SlideShell number={16} eyebrow="Tajriba" title="Interaktiv simulyator">
      <div className="grid h-full grid-cols-[55fr_45fr] items-center gap-16">
        <div>
          <Reveal show variant="up" delay={0.25}>
            <p className="font-display text-[60px] leading-[1.06] font-bold tracking-[-0.025em]">
              Qiya tekislikni
              <br />
              <span className="text-glow">o‘zingiz</span> sinab ko‘ring
            </p>
          </Reveal>
          <Reveal show variant="up" delay={0.4} className="mt-7 max-w-[900px] text-[30px] leading-snug text-snow/80">
            Interaktiv simulyator yordamida qiyalik burchagi, massa va ishqalanish koeffitsientini o‘zgartirib, jismning
            harakatini kuzating.
          </Reveal>
          <Reveal show variant="up" delay={0.55} className="mt-8 space-y-3">
            {POINTS.map((p) => (
              <div key={p} className="flex items-center gap-5 text-[30px]">
                <span className="size-3 shrink-0 rounded-full bg-glow shadow-[0_0_12px_#E9FD87]" />
                {p}
              </div>
            ))}
          </Reveal>
          <Reveal show variant="up" delay={0.7} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
            <div>
              <div className="eyebrow">Sayt manzili</div>
              <a
                href={SIMULATOR_PUBLIC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block font-mono text-[28px] text-lime transition-colors hover:text-glow"
              >
                {SIMULATOR_PUBLIC_LABEL}
              </a>
            </div>
            <span className="rounded-full border border-lime/40 bg-lime/[0.08] px-6 py-3 text-[22px] text-glow">
              Telefon orqali ochish uchun QR-kodni skanerlang
            </span>
          </Reveal>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          className="flex flex-col items-center"
        >
          {/* Tashqi ramka — QR ustiga hech narsa tushmaydi */}
          <div className="rounded-[36px] border border-lime/35 bg-ink-3 p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
            <div className="rounded-[22px] bg-white p-4">
              <QrCode value={SIMULATOR_PUBLIC_URL} size={QR_SIZE} />
            </div>
          </div>
          <p className="mt-7 font-display text-[32px] font-semibold text-snow">QR-kodni skanerlang</p>
        </motion.div>
      </div>
    </SlideShell>
  )
}
