import { Navigate } from 'react-router-dom'
import { getUser } from '../lib/api'

type Props = { children: React.ReactNode; roles?: string[] }

export default function ProtectedRoute({ children, roles }: Props) {
  const user = getUser()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/app" replace />
  return <>{children}</>
}
