import { Rocket } from 'lucide-react'

type LogoProps = {
  light?: boolean
  size?: 'sm' | 'md'
}

export default function Logo({ light = false, size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? 16 : 20
  const textSize = size === 'sm' ? 'text-lg' : 'text-2xl'

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
        <Rocket size={iconSize} className="text-white" />
      </div>
      <span className={`font-serif font-bold ${textSize} ${light ? 'text-white' : 'text-ink'}`}>
        VendorBridge
      </span>
    </div>
  )
}
