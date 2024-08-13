import '@/app/globals.css'
import Header from '@/components/Share/Header'

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  )
}