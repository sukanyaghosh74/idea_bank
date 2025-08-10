import type { ReactNode, ReactElement } from 'react'

type Tone = 'gray' | 'green' | 'yellow' | 'red' | 'blue' | 'purple'

const toneToClasses: Record<Tone, string> = {
  gray: 'badge badge-gray',
  green: 'badge badge-green',
  yellow: 'badge badge-yellow',
  red: 'badge badge-red',
  blue: 'badge badge-blue',
  purple: 'badge badge-purple',
}

interface BadgeProps {
  tone?: Tone
  children: ReactNode
  className?: string
}

export default function Badge({ tone = 'gray', children, className }: BadgeProps): ReactElement {
  return (
    <span className={`${toneToClasses[tone]} fade-in ${className ?? ''}`}>
      {children}
    </span>
  )
}


