import { AccelerationSlide, AngleCompareSlide, SlideConditionSlide } from './MotionSlides'
import { DecompositionSlide, ForcesSlide, FrictionSlide, NormalSlide } from './ForceSlides'
import { DefinitionSlide, ProblemSlide, RecallSlide, TitleSlide } from './IntroSlides'
import { ExampleSlide, LabSlide, QuizSlide, SummarySlide } from './PracticeSlides'
import type { SlideDef } from './types'

/** Slaydlar tartibi darslik mantiqiga mos. `steps` — Probel bilan ochiladigan qadamlar soni */
export const SLIDES: SlideDef[] = [
  { id: 'title', title: 'Jismning qiya tekislikdagi harakati', steps: 0, Component: TitleSlide },
  { id: 'recall', title: 'O‘tilgan mavzuni eslaymiz', steps: 7, Component: RecallSlide },
  { id: 'problem', title: 'Muammoli vaziyat', steps: 1, Component: ProblemSlide },
  { id: 'definition', title: 'Qiya tekislik nima?', steps: 2, Component: DefinitionSlide },
  { id: 'forces', title: 'Jismga qanday kuchlar ta’sir qiladi?', steps: 3, Component: ForcesSlide },
  { id: 'decomposition', title: 'Og‘irlik kuchini tashkil etuvchilarga ajratamiz', steps: 4, Component: DecompositionSlide },
  { id: 'normal', title: 'Normal reaksiya kuchi', steps: 3, Component: NormalSlide },
  { id: 'friction', title: 'Ishqalanish kuchi', steps: 2, Component: FrictionSlide },
  { id: 'condition', title: 'Jism qachon sirpanadi?', steps: 4, Component: SlideConditionSlide },
  { id: 'acceleration', title: 'Qiya tekislik bo‘ylab tezlanish', steps: 3, Component: AccelerationSlide },
  { id: 'angles', title: 'Burchak oshsa nima bo‘ladi?', steps: 3, Component: AngleCompareSlide },
  { id: 'lab', title: 'Interaktiv tajriba', steps: 0, Component: LabSlide },
  { id: 'example', title: 'Namunaviy masala', steps: 6, Component: ExampleSlide },
  { id: 'quiz', title: 'Tezkor tekshiruv', steps: 11, Component: QuizSlide },
  { id: 'summary', title: 'Xulosa', steps: 6, Component: SummarySlide },
]
