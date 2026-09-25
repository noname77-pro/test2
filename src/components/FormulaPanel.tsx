import { motion } from 'framer-motion'
import { Tex } from './ui/Tex'

const FORMULAS = [
  { tex: 'P = mg', caption: 'Og‘irlik kuchi', note: 'vertikal pastga yo‘nalgan' },
  { tex: 'F_{\\parallel} = mg\\sin\\alpha', caption: 'Parallel tashkil etuvchi', note: 'jismni qiyalik bo‘ylab tortadi' },
  { tex: 'F_{\\perp} = mg\\cos\\alpha', caption: 'Perpendikulyar tashkil etuvchi', note: 'jismni tayanchga bosadi' },
  { tex: 'N = mg\\cos\\alpha', caption: 'Normal reaksiya kuchi', note: 'sirtga tik, tashqariga' },
  { tex: 'F_{\\text{ishq}} = \\mu N', caption: 'Ishqalanish kuchi', note: 'harakatga qarshi yo‘nalgan' },
  { tex: 'a = g(\\sin\\alpha - \\mu\\cos\\alpha)', caption: 'Tezlanish', note: 'Nyutonning II qonunidan', highlight: true },
  { tex: '\\tan\\alpha > \\mu_s', caption: 'Sirpanish sharti', note: 'mg sin α > μs mg cos α' },
  { tex: 'v = at,\\quad s = \\dfrac{at^2}{2}', caption: 'Kinematika', note: 'tinch holatdan boshlanganda' },
]

export function FormulaPanel() {
  return (
    <section aria-labelledby="formulas-title">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Nazariya</span>
          <h2 id="formulas-title" className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Asosiy formulalar
          </h2>
        </div>
        <p className="max-w-md text-fog">
          Qiya tekislikdagi harakat Nyutonning ikkinchi qonuni va og‘irlik kuchini ikki tashkil etuvchiga ajratish orqali
          tushuntiriladi.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {FORMULAS.map((f, i) => (
          <motion.div
            key={f.tex}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className={`card flex min-h-40 flex-col justify-between p-5 ${f.highlight ? 'card-glow' : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-graphite">{String(i + 1).padStart(2, '0')}</span>
              <span className="eyebrow">{f.caption}</span>
            </div>
            <div className={`my-4 overflow-x-auto text-[1.35rem] ${f.highlight ? 'text-glow' : 'text-snow'}`}>
              <Tex math={f.tex} display />
            </div>
            <p className="text-sm text-fog">{f.note}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
