import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Bardasci App</h1>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="rounded-md border p-2 text-sm"
              placeholder="mario.rossi@example.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="rounded-md border p-2 text-sm"
            />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button 
              formAction={login} 
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
            >
              Accedi
            </button>
            <button 
              formAction={signup} 
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Registrati
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
