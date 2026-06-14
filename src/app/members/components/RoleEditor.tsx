'use client'

import { useState, useTransition } from 'react'
import { updateMemberRole } from '@/app/actions/members'
import { Loader2 } from 'lucide-react'

export default function RoleEditor({ userId, initialRole }: { userId: string, initialRole: string }) {
  const [isPending, startTransition] = useTransition()
  const [role, setRole] = useState(initialRole || 'ospite')

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value
    setRole(newRole)
    startTransition(() => {
      updateMemberRole(userId, newRole)
    })
  }

  return (
    <div className="relative inline-flex items-center">
      <select 
        value={role}
        onChange={handleChange}
        disabled={isPending}
        className="appearance-none bg-gray-100 text-gray-700 font-medium text-xs rounded-full px-3 py-1 pr-8 border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        <option value="admin">Admin</option>
        <option value="redattore">Redattore</option>
        <option value="ospite">Ospite</option>
      </select>
      {/* Freccia custom per select */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        {isPending ? (
          <Loader2 size={12} className="animate-spin text-indigo-500" />
        ) : (
          <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        )}
      </div>
    </div>
  )
}
