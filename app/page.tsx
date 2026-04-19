import { Stopwatch } from "@/components/stopwatch"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center">
        <Stopwatch />
      </main>
      <Footer />
    </div>
  )
}
