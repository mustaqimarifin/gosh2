import { type LucideIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { cx } from 'lib/utils'

export interface IconButtonProps {
  Icon: LucideIcon
  children?: React.ReactNode
  color: string
  hoverbg?: string
  isActive?: boolean
  onClick: () => void
}

export const Button = (props: IconButtonProps) => {
  const { Icon, isActive, color, children, hoverbg } = props
  const { data: session } = useSession()

  return (
    <button
      className={cx(
        'flex items-center rounded bg-none p-1 focus:outline-purple-400',
        color,
        hoverbg,
        isActive && 'bg-slate-200',
        session ? 'cursor-pointer hover:bg-purple-50' : 'cursor-default'
      )}
      {...props}
    >
      <Icon
        className={cx(
          'h-4 w-4',
          !isActive && color,
          isActive && 'text-black',
          children?.toString() && 'mr-1'
        )}
      />
      <span className="text-sm">{children}</span>
    </button>
  )
}
