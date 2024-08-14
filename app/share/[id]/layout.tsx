import '@/app/globals.css'
import Header from '@/components/Share/Header'
import Footer from '@/components/Share/Footer'
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
      <Footer />
    </div>
  )
}