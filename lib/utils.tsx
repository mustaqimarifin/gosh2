 
//@ts-nocheck
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* eslint-disable no-control-regex */
export const autosize = (target: HTMLTextAreaElement): void => {
  target.style.height = 'initial'
  target.style.height = +target.scrollHeight + 'px'
}

export const countLines = (el: HTMLElement): number => {
  if (!el) return -1
  // Get total height of the content
  const divHeight = el.offsetHeight

  // object.style.lineHeight, returns
  // the lineHeight property
  // height of one line
  const lineHeight = parseInt(
    window.getComputedStyle(el).getPropertyValue('line-height')
  )

  const lines = divHeight / lineHeight
  return lines
}

export const PAGE_SIZE = 10
export const SCROLL_OFFSET_PX = 400
export const MAX_DEPTH = 10

export const validateEmail = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g

export const isEmail = (email: string) => {
  return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(
    email
  )
}

export const User = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function formatDate(date: Date) {
  const currentDate = new Date()
  const targetDate = new Date(date)

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return `${fullDate} (${formattedDate})`
}

export function resizeTextArea(textarea: HTMLTextAreaElement | null) {
  const maxHeight = 270
  textarea.style.height = `0px`
  const height =
    textarea.scrollHeight <= maxHeight ? textarea.scrollHeight : maxHeight
  textarea.style.height = `${height}px`
}

export function toggleEmail(event: ReactMouseEvent<HTMLElement, MouseEvent>) {
  const element = event.target as HTMLElement
  const toggle = element.closest<HTMLAnchorElement>('.email-hidden-toggle a')
  if (toggle && event.currentTarget.contains(toggle)) {
    event.preventDefault()
    const container = element.closest('div')
    const content = container.querySelector('.email-hidden-reply')
    content.classList.toggle('expanded')
  }
}

export function handleClipboardCopy(
  event: ReactMouseEvent<HTMLElement, MouseEvent>
) {
  const element = event.target as HTMLElement
  const container = element.closest<HTMLDivElement>(
    '.snippet-clipboard-content, .highlight'
  )
  const button = element.closest<HTMLButtonElement>('button.ClipboardButton')

  if (container && button && event.currentTarget.contains(button)) {
    event.preventDefault()
    const contents =
      container.dataset.snippetClipboardCopyContent ||
      container.querySelector('pre').textContent ||
      ''

    clipboardCopy(contents).then(() => {
      const clipboardIcon = button.querySelector<SVGElement>(
        'svg.js-clipboard-copy-icon'
      )
      const checkIcon = button.querySelector<SVGElement>(
        'svg.js-clipboard-check-icon'
      )

      clipboardIcon.classList.add('d-none')
      checkIcon.classList.remove('d-none')

      setTimeout(() => {
        clipboardIcon.classList.remove('d-none')
        checkIcon.classList.add('d-none')
      }, 2000)
    })
  }
}

export function handleCommentClick(
  event: ReactMouseEvent<HTMLElement, MouseEvent>
) {
  toggleEmail(event)
  handleClipboardCopy(event)
}

export const environment = process.env.NODE_ENV || 'development'
export const isDev = environment === 'development'
export const isProd = environment === 'production'
