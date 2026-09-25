import type { ReactNode } from 'react'
import { Tex } from '../../components/ui/Tex'
import { InclineDiagram, type Camera, type VecKind, type VecState } from '../InclineDiagram'
import { C, Emphasis, Reveal, SlideShell, T } from '../ui'
import type { SlideProps } from './types'

/** Chapda katta diagramma, o‘ngda tushuntirish paneli */
function DiagramLayout({
  camera,
  vectors,
  showGuides,
  showBlockAngle,
  side,
}: {
  camera: Camera
  vectors: Partial<Record<VecKind, VecState>>
  showGuides?: boolean
  showBlockAngle?: boolean
  side: ReactNode
}) {
  return (
    <div className="grid h-full grid-cols-[1000px_1fr] items-center gap-12">
      <div className="card relative h-[562px] overflow-hidden">
        <InclineDiagram
          angle={30}
          camera={camera}
          vectors={vectors}
          showGuides={showGuides}
          showBlockAngle={showBlockAngle}
          showAngle={camera !== 'block'}
          className="h-full w-full"
        />
      </div>
      <div className="flex h-full flex-col justify-center gap-6">{side}</div>
    </div>
  )
}

function ForceRow({ show, color, tex, name, hint }: { show: boolean; color: string; tex: string; name: string; hint: string }) {
  return (
    <Reveal show={show} variant="right" className="card flex items-center gap-6 px-8 py-6">
      <span className="h-16 w-2 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 18px ${color}` }} />
      <Tex math={tex} className="w-[150px] shrink-0 text-[52px]" />
      <div>
        <div className="font-display text-[32px] font-semibold">{name}</div>
        <div className="text-[25px] text-fog">{hint}</div>
      </div>
    </Reveal>
  )
}

/* 5 — Jismga qanday kuchlar ta’sir qiladi? */
export function ForcesSlide({ step }: SlideProps) {
  const v: Partial<Record<VecKind, VecState>> = {}
  if (step >= 1) v.mg = step === 1 ? 'hi' : 'on'
  if (step >= 2) v.N = step === 2 ? 'hi' : 'on'
  if (step >= 3) v.Fishq = 'hi'
  return (
    <SlideShell number={5} eyebrow="Kuchlar" title="Jismga qanday kuchlar ta’sir qiladi?">
      <DiagramLayout
        camera="mid"
        vectors={v}
        side={
          <>
            <ForceRow show={step >= 1} color={C.mg} tex={T.mg} name="Og‘irlik kuchi" hint="vertikal pastga" />
            <ForceRow show={step >= 2} color={C.N} tex={T.N} name="Normal reaksiya kuchi" hint="sirtga tik, tashqariga" />
            <ForceRow show={step >= 3} color={C.Fishq} tex={T.Fishq} name="Ishqalanish kuchi" hint="harakatga qarshi" />
            <Reveal show={step === 0} variant="fade" className="text-[30px] text-fog">
              Jism qiya tekislikda turibdi. Unga qanday kuchlar ta’sir qiladi?
            </Reveal>
          </>
        }
      />
    </SlideShell>
  )
}

/* 6 — Og‘irlik kuchini tashkil etuvchilarga ajratamiz (kamera yaqinlashadi) */
export function DecompositionSlide({ step }: SlideProps) {
  const v: Partial<Record<VecKind, VecState>> = { mg: step >= 2 ? 'on' : 'hi' }
  if (step >= 2) v.Fx = step === 2 ? 'hi' : 'on'
  if (step >= 3) v.Fy = step === 3 ? 'hi' : 'on'
  const formulas = step >= 4

  return (
    <SlideShell number={6} eyebrow="Asosiy g‘oya" title="Og‘irlik kuchini tashkil etuvchilarga ajratamiz">
      <DiagramLayout
        camera={step >= 1 ? 'block' : 'wide'}
        vectors={v}
        showGuides={step >= 2}
        showBlockAngle={formulas}
        side={
          <>
            <Reveal show variant="right" className="card flex items-center gap-6 px-8 py-6">
              <span className="h-16 w-2 shrink-0 rounded-full bg-snow" />
              <Tex math={T.mg} className="text-[52px]" />
              <span className="text-[28px] text-fog">vertikal pastga</span>
            </Reveal>
            <ComponentCard
              show={step >= 2}
              active={step === 2}
              color={C.Fx}
              symbol={T.Fx}
              formula="= mg\sin\alpha"
              showFormula={formulas}
              hint="qiyalik bo‘ylab pastga"
            />
            <ComponentCard
              show={step >= 3}
              active={step === 3}
              color={C.Fy}
              symbol={T.Fy}
              formula="= mg\cos\alpha"
              showFormula={formulas}
              hint="qiyalikka tik, tekislik tomon"
            />
            <Reveal show={formulas} variant="fade" delay={0.4} className="pl-2 text-[26px] text-fog">
<Tex math="mg" /> va <Tex math={T.Fy} /> orasidagi burchak ham <Tex math="\alpha" className="text-glow" />
            </Reveal>
          </>
        }
      />
    </SlideShell>
  )
}

function ComponentCard({
  show,
  active,
  color,
  symbol,
  formula,
  showFormula,
  hint,
}: {
  show: boolean
  active: boolean
  color: string
  symbol: string
  formula: string
  showFormula: boolean
  hint: string
}) {
  return (
    <Reveal show={show} variant="right" className={`card px-8 py-6 transition-shadow duration-500 ${active || showFormula ? 'card-glow' : ''}`}>
      <div className="flex items-center gap-6">
        <span className="h-16 w-2 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 18px ${color}` }} />
        <div className="flex items-baseline gap-3">
          <Tex math={symbol} className="text-[58px]" />
          <Reveal show={showFormula} variant="left" duration={0.6}>
            <Tex math={formula} className="text-[58px]" />
          </Reveal>
        </div>
      </div>
      <div className="mt-1 pl-8 text-[27px] text-fog">{hint}</div>
    </Reveal>
  )
}

/* 7 — Normal reaksiya kuchi */
export function NormalSlide({ step }: SlideProps) {
  return (
    <SlideShell number={7} eyebrow="Tik yo‘nalish" title="Normal reaksiya kuchi">
      <DiagramLayout
        camera="block"
        vectors={{ mg: 'dim', Fy: 'hi', N: 'hi' }}
        side={
          <>
            <Reveal show={step === 0} variant="fade" className="text-[32px] leading-snug text-fog">
              Qiyalikka tik yo‘nalishda ikki kuch bor: <Tex math={T.Fy} /> va <Tex math={T.N} />
            </Reveal>
            <Reveal show={step >= 1} variant="up" className="card px-8 py-6">
              <Tex math={`${T.Fy} = mg\\cos\\alpha`} className="text-[58px]" />
            </Reveal>
            <Reveal show={step >= 2} variant="up" className="card px-8 py-6">
              <p className="text-[27px] text-fog">Qiyalikka tik yo‘nalishda tezlanish yo‘q</p>
              <div className="mt-2 flex items-baseline gap-5">
                <Tex math="\Rightarrow" className="text-[44px] text-fog" />
                <Tex math={`${T.N} = ${T.Fy}`} className="text-[58px]" />
              </div>
            </Reveal>
            <Emphasis show={step >= 3} className="card card-glow px-8 py-7">
              <div className="eyebrow">Demak</div>
              <Tex math={`${T.N} = mg\\cos\\alpha`} className="mt-2 block text-[68px] text-glow" />
            </Emphasis>
          </>
        }
      />
    </SlideShell>
  )
}

/* 8 — Ishqalanish kuchi */
export function FrictionSlide({ step }: SlideProps) {
  return (
    <SlideShell number={8} eyebrow="Qarshilik" title="Ishqalanish kuchi">
      <DiagramLayout
        camera="block"
        vectors={{ mg: 'dim', N: 'dim', Fishq: 'hi' }}
        side={
          <>
            <Reveal show variant="up" delay={0.3} className="card px-8 py-6">
              <Tex math={`${T.Fishq} = \\mu ${T.N}`} className="text-[60px]" />
            </Reveal>
            <Reveal show={step >= 1} variant="up" className="card px-8 py-6">
              <p className="text-[27px] text-fog">O‘rniga qo‘yamiz:</p>
              <Tex math={`${T.N} = mg\\cos\\alpha`} className="mt-1 block text-[54px]" />
            </Reveal>
            <Emphasis show={step >= 2} className="card card-glow px-8 py-7">
              <Tex math={`${T.Fishq} = \\mu mg\\cos\\alpha`} className="block text-[62px]" />
            </Emphasis>
            <Reveal show={step >= 3} variant="blur" className="border-l-4 border-coral/70 pl-6 text-[30px] leading-snug text-snow/85">
              Ishqalanish kuchi harakatga yoki harakatga intilishga qarshi yo‘naladi.
            </Reveal>
          </>
        }
      />
    </SlideShell>
  )
}
