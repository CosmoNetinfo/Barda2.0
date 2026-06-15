'use client'

import { useState } from 'react'
import { removeMember, updateIdeaStatus, deleteIdea, deleteTask, deleteEvent, toggleEventPin } from '@/app/actions/admin'
import { updateMemberRole } from '@/app/actions/members'
import { Trash2, Pin } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AdminActions({ members, ideas, tasks, events, logs }: any) {
  const [activeTab, setActiveTab] = useState('members')

  const handleAction = async (actionFn: () => Promise<void>) => {
    if (!confirm('Sei sicuro di voler procedere?')) return
    try {
      await actionFn()
      alert('Operazione completata')
    } catch (e: unknown) {
      if (e instanceof Error) alert(e.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['members', 'ideas', 'tasks', 'events', 'logs'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold rounded-xl whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
        {activeTab === 'members' && (
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-3">Nome</th>
                <th className="p-3">Ruolo</th>
                <th className="p-3">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m: { id: string; name: string; role?: string }) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold">{m.name}</td>
                  <td className="p-3 text-sm">
                    <select 
                      value={m.role || 'membro'} 
                      onChange={(e) => handleAction(() => updateMemberRole(m.id, e.target.value))}
                      className="bg-gray-100 rounded px-2 py-1 text-sm font-medium"
                    >
                      <option value="membro">👤 Membro</option>
                      <option value="redattore">✏️ Redattore</option>
                      <option value="admin">🛡️ Admin</option>
                      <option value="founder" disabled>👑 Founder</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleAction(() => removeMember(m.id))} className="text-red-500 hover:text-red-700 p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'ideas' && (
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-3">Titolo</th>
                <th className="p-3">Stato</th>
                <th className="p-3">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((i: { id: string; title: string; status: string }) => (
                <tr key={i.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold">{i.title}</td>
                  <td className="p-3">
                    <select 
                      value={i.status} 
                      onChange={(e) => handleAction(() => updateIdeaStatus(i.id, e.target.value))}
                      className="bg-gray-100 rounded px-2 py-1 text-sm font-medium"
                    >
                      <option value="new">Nuova</option>
                      <option value="approved">Approvata</option>
                      <option value="rejected">Scartata</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleAction(() => deleteIdea(i.id))} className="text-red-500 hover:text-red-700 p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'tasks' && (
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-3">Task</th>
                <th className="p-3">Stato</th>
                <th className="p-3">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t: { id: string; title: string; status: string }) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold">{t.title}</td>
                  <td className="p-3 text-sm">{t.status}</td>
                  <td className="p-3">
                    <button onClick={() => handleAction(() => deleteTask(t.id))} className="text-red-500 hover:text-red-700 p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'events' && (
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-3">Evento</th>
                <th className="p-3">Data</th>
                <th className="p-3">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e: { id: string; title: string; date: string; is_pinned: boolean }) => (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold">{e.title}</td>
                  <td className="p-3 text-sm">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleAction(() => toggleEventPin(e.id, !e.is_pinned))} className={`${e.is_pinned ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 bg-gray-100'} hover:bg-indigo-100 p-2 rounded-lg transition-colors`}>
                      <Pin size={18} />
                    </button>
                    <button onClick={() => handleAction(() => deleteEvent(e.id))} className="text-red-500 hover:text-red-700 p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'logs' && (
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-3">Data</th>
                <th className="p-3">Utente</th>
                <th className="p-3">Azione</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l: { id: string; created_at: string; action: string; profiles?: { name: string } }) => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-xs text-gray-400 whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="p-3 font-bold text-sm">{l.profiles?.name || 'Utente'}</td>
                  <td className="p-3 text-sm">{l.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
