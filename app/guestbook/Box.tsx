import Avatar from 'components/Comments/Avatar'
import { formatDate } from 'lib/utils'

export const HotBox = ({ text, createdAt, user }) => {
  return (
    <div className="rounded-lg p-4 text-base">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 inline-flex items-center text-xs font-semibold text-gray-900 dark:text-white">
            <Avatar
              className="mr-2 h-4 w-4 rounded-full"
              src={user?.image}
              alt={user?.name}
            />
            {user?.name}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {formatDate(createdAt)}
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{text}</div>
    </div>
  )
}
