import {
  autosize,
  cx,
  handleCommentClick,
  resizeTextArea,
  User,
} from 'lib/utils'
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { BookMarkedIcon, GithubIcon, TypeIcon } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useAutoAnimate } from '@formkit/auto-animate/react'

interface CommentFormProps {
  autoFocus?: boolean
  buttonText?: string
  initialValue?: string
  className?: string
  context?: string
  error?: string
  onSubmit: (text: string) => Promise<void>
  parentId?: string
  placeholder?: string
  submitLabel?: string
  handleResetCallback?: () => void
  hideEarlyCallback?: () => void
}
export function processCommentBody(bodyHTML: string) {
  if (typeof document === 'undefined') {
    return bodyHTML.replace(
      /<a (href="[^"]*")/g,
      '<a $1 rel="noopener noreferrer nofollow" target="_top"'
    )
  }
}
export const CommentForm = ({
  className,
  autoFocus = false,
  context,
  submitLabel = 'Post',
  hideEarlyCallback,
  handleResetCallback,
  error,
  initialValue = '',
  parentId,
  onSubmit,
}: CommentFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [text, setText] = useState(initialValue)
  const { data: session } = useSession()
  const [parent] = useAutoAnimate<HTMLDivElement>()
  const textRef = useRef<HTMLTextAreaElement | null>(null)
  const [isPreview, setIsPreview] = useState<boolean | string>(false)
  const [input, setInput] = useState('')
  const [lastInput, setLastInput] = useState('')
  const [preview, setPreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [isFixedWidth, setIsFixedWidth] = useState(false)
  const [lastHeight, setLastHeight] = useState('')
  const textarea = useRef<HTMLTextAreaElement>(null)
  const isReply = !!parentId
  const placeHolderText = isReply ? 'writeAReply' : 'writeAComment'

  useEffect(() => {
    if (isPreview && input !== lastInput) {
      if (input) {
        setIsLoading(true)
        // renderMarkdown(input, session, context).then((value) => {
        const processed = processCommentBody(input)
        setPreview(processed!)
        setIsLoading(false)
        //});
      }
      setLastInput(input)
    }
  }, [isPreview, input, lastInput, session, context])

  const reset = useCallback(() => {
    setInput('')
    setPreview('')
    setIsPreview(false)
    setIsSubmitting(false)
    setIsReplyOpen(false)
  }, [])

  /* const handleSubmit = useCallback(async () => {
    if (isSubmitting || (!slug && !onDiscussionCreateRequest)) return;
    setIsSubmitting(true);

    const id = slug ? slug : await onDiscussionCreateRequest();
    const payload = { body: input, slug: id, parentId };

    if (parentId) {
      addDiscussionReply(payload, session).then(({ data: { addDiscussionReply } }) => {
        const { reply } = addDiscussionReply;
        const adapted = adaptReply(reply);

        onSubmit(adapted);
        reset();
      });
    } else {
      addDiscussionComment(payload, session).then(({ data: { addDiscussionComment } }) => {
        const { comment } = addDiscussionComment;
        const adapted = adaptComment(comment);

        onSubmit(adapted);
        reset();
      });
    }
  }, [
    isSubmitting,
    slug,
    input,
    parentId,
    onDiscussionCreateRequest,
    session,
    onSubmit,
    reset,
  ]); */

  const handleReplyOpen = () => {
    setIsReplyOpen(true)
  }

  const handleTextAreaChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setInput(event.target.value)
      // Only resize if it hasn't been resized manually.
      if (!lastHeight || lastHeight === textarea.current?.style.height) {
        resizeTextArea(textarea.current)
        setLastHeight(textarea.current!.style.height)
      }
    },
    [lastHeight]
  )

  useEffect(() => {
    if (!textarea.current) return
    if (isReplyOpen) textarea.current.focus()
  }, [isReplyOpen])
  useEffect(() => {
    if (autoFocus) {
      if (textRef && textRef.current) {
        textRef.current.focus()
      }
    }
  }, [autoFocus])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setText(e.target.value)
    if (textRef?.current) {
      autosize(textRef.current)
    }
  }

  function handleReset(): void {
    setText('')
    if (textRef && textRef.current) {
      textRef.current.style.height = 'initial'
    }
    setIsLoading(false)
  }
  const handleSubmit = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault()
      onSubmit(input).then(() => {
        setText('')
        setIsLoading(true)
        hideEarlyCallback?.()
        //handleReset()
        handleResetCallback?.()
        reset()
      })
    },
    [isSubmitting, input, parentId, session, onSubmit, reset]
  )

  return !isReply || isReplyOpen ? (
    <form
      className={`color-bg-primary color-border-primary gsc-comment-box ${
        isReply ? 'gsc-comment-box-is-reply' : ''
      } ${className}`}
      onSubmit={handleSubmit}
    >
      <div className="color-bg-tertiary color-border-primary gsc-comment-box-tabs">
        <div className="mx-2 mb-[-1px] mt-2">
          <button
            className={`rounded-t border border-b-0 px-4 py-2 ${
              !isPreview
                ? 'color-text-primary color-bg-canvas color-border-primary'
                : 'color-text-secondary border-transparent'
            }`}
            onClick={() => setIsPreview(false)}
            type="button"
          >
            {'write'}
          </button>
          <button
            className={`ml-1 rounded-t border border-b-0 px-4 py-2 ${
              isPreview
                ? 'color-text-primary color-bg-canvas color-border-primary'
                : 'color-text-secondary border-transparent'
            }`}
            onClick={() => setIsPreview(true)}
            type="button"
          >
            {'preview'}
          </button>
        </div>

        {!isPreview ? (
          <div className="gsc-comment-box-md-toolbar">
            <button
              className="gsc-toolbar-item"
              type="button"
              title={isFixedWidth ? 'disableFixedWidth' : 'enableFixedWidth'}
              onClick={() => {
                setIsFixedWidth(!isFixedWidth)
                textarea.current!.focus()
              }}
              tabIndex={-1}
            >
              <TypeIcon />
            </button>
          </div>
        ) : null}
      </div>
      <div className="gsc-comment-box-main">
        {isPreview ? (
          <div
            className="markdown color-border-primary gsc-comment-box-preview"
            dangerouslySetInnerHTML={
              isLoading ? undefined : { __html: preview || 'nothingToPreview' }
            }
            onClick={handleCommentClick}
          >
            {isLoading ? 'loading...' : undefined}
          </div>
        ) : (
          <div className="gsc-comment-box-write">
            <textarea
              className={`form-control input-contrast gsc-comment-box-textarea ${
                isFixedWidth ? 'gsc-is-fixed-width' : ''
              }`}
              placeholder={session ? placeHolderText : 'signInToComment'}
              onChange={handleTextAreaChange}
              value={input}
              disabled={!session || isSubmitting}
              ref={textarea}
              onKeyDown={(event) =>
                (event.ctrlKey || event.metaKey) &&
                event.key === 'Enter' &&
                handleSubmit
              }
            ></textarea>
            <div className="form-control input-contrast gsc-comment-box-textarea-extras">
              <a
                className="link-secondary gsc-comment-box-markdown-hint flex gap-2"
                rel="nofollow noopener noreferrer"
                target="_blank"
                href="https://guides.github.com/features/mastering-markdown/"
                title={'stylingWithMarkdownIsSupported'}
              >
                <BookMarkedIcon className="mr-1" />
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="gsc-comment-box-bottom">
        {session && !isReply ? (
          <button
            type="button"
            className="link-secondary text-sm"
            onClick={() => signOut()}
          >
            <div className="mr-2" />
            {'signOut'}
          </button>
        ) : null}
        <div className="gsc-comment-box-buttons">
          {isReply ? (
            <button
              className="btn ml-1 rounded-md border"
              onClick={() => setIsReplyOpen(false)}
              type="button"
            >
              {'cancel'}
            </button>
          ) : null}
          {session ? (
            <button
              className="btn btn-primary ml-1 items-center rounded-md border"
              type="submit"
              disabled={(session && !input.trim()) || isSubmitting}
            >
              {isReply ? 'reply' : 'comment'}
            </button>
          ) : (
            <a
              className="btn btn-primary ml-1 inline-flex items-center rounded-md border hover:no-underline"
              target="_top"
              onClick={() => signIn()}
            >
              <GithubIcon className="mr-2" fill="currentColor" />{' '}
              {'signInWithGitHub'}
            </a>
          )}
        </div>
      </div>
    </form>
  ) : (
    <div className="color-bg-tertiary gsc-reply-box">
      <button
        className="form-control color-text-secondary color-border-primary w-full cursor-text rounded border px-2 py-1 text-left focus:border-transparent"
        onClick={handleReplyOpen}
        type="button"
      >
        {'writeAReply'}
      </button>
    </div>
  )
}

/* <form onSubmit={handleSubmit}>
   <div className="mt-4 flex flex-row">
     <textarea
       autoFocus={autoFocus}
       value={text}
       onChange={(e) => setText(e.target.value)}
       className="mr-2 h-20 grow resize-none rounded-lg border-2 border-purple-300 p-2 leading-6"
     />
     <button
       className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-400"
       type="submit"
       disabled={!!isLoading}>
       {isLoading ? '...' : submitLabel}
     </button>
   </div>
   <div ref={parent} className="pt-2 text-sm font-medium text-red-500">
     {error}
   </div>
 </form>; */

/* <article className="p-6 mb-6 text-base bg-white rounded-lg dark:bg-gray-900">
        <footer className="flex justify-between items-center mb-2">
            <div className="flex items-center">
                <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                <img
                        className="mr-2 w-6 h-6 rounded-full"
                        src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                        alt="Michael Gough">Michael Gough</p>
                <p className="text-sm text-gray-600 dark:text-gray-400"><time pubdate datetime="2022-02-08"
                        title="February 8th, 2022">Feb. 8, 2022</time></p>
            </div>
            <button id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1"
                className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                type="button">
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z">
                    </path>
                </svg>
                <span className="sr-only">Comment settings</span>
            </button>
            <!-- Dropdown menu -->
            <div id="dropdownComment1"
                className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownMenuIconHorizontalButton">
                    <li>
                        <a href="#"
                            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                    </li>
                    <li>
                        <a href="#"
                            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                    </li>
                    <li>
                        <a href="#"
                            className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                    </li>
                </ul>
            </div>
        </footer>
        <p className="text-gray-500 dark:text-gray-400">Very straight-to-point article. Really worth time reading. Thank you! But tools are just the
            instruments for the UX designers. The knowledge of the design tools are as important as the
            creation of the design strategy.</p>
        <div className="flex items-center mt-4 space-x-4">
            <button type="button"
                className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
                <svg aria-hidden="true" className="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                Reply
            </button>
        </div>
    </article> */
