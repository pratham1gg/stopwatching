import { Stopwatch } from "@/components/stopwatch"
import { Footer } from "@/components/footer"
import { WorldClockSidebar } from "@/components/world-clock"

export default function Page() {
  return (
    <div className="flex h-screen flex-row overflow-hidden">
      <WorldClockSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex flex-1 items-center justify-center overflow-hidden">
          <Stopwatch />
        </main>
        <Footer />
      </div>
    </div>
  )
}
