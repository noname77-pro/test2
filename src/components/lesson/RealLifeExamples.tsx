import type { ComponentType, SVGProps } from 'react'
import { LoadingRampIcon, MountainRoadIcon, RampIcon, SlideIcon, StairsIcon } from './LessonIcons'

const EXAMPLES: { title: string; text: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { title: 'Pandus', text: 'Yuk yoki aravachani balandlikka kamroq kuch bilan olib chiqishga yordam beradi.', Icon: RampIcon },
  { title: 'Tog‘ yo‘li', text: 'Yo‘l ilon izi qilib qurilsa, qiyalik kichrayadi va yuqoriga chiqish osonlashadi.', Icon: MountainRoadIcon },
  { title: 'Zinapoya', text: 'Balandlikni kichik pog‘onalarga bo‘lib, ko‘tarilishni yengillashtiradi.', Icon: StairsIcon },
  { title: 'Yuk ortish rampasi', text: 'Og‘ir yuklarni mashinaga ko‘tarmasdan, tortib yoki dumalatib chiqarish mumkin.', Icon: LoadingRampIcon },
  { title: 'Sirpanchiq', text: 'Qiyalik tufayli bola pastga o‘zi sirpanib tushadi; burchak katta bo‘lsa — tezroq.', Icon: SlideIcon },
]

/** Qiya tekislik hayotda */
export function RealLifeExamples() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <span className="eyebrow">Hayotiy misollar</span>
      <h3 className="mt-1 font-display text-lg font-semibold tracking-tight">Qiya tekislik hayotda</h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {EXAMPLES.map(({ title, text, Icon }) => (
          <li key={title} className="flex gap-3.5 rounded-xl border border-white/[0.06] bg-ink/30 p-3.5 last:sm:col-span-2">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-lime">
              <Icon />
            </span>
            <span>
              <span className="block font-semibold">{title}</span>
              <span className="mt-0.5 block text-sm leading-snug text-fog">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
