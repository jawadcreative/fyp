import { Link } from "react-router"
import ImageGallery from "../../components/ImageGallery"
import Trips from "../../components/Trips"
import Footer from "../../components/Footer"

const Home = () => {
  return (
    <section className="">
      <div className="relative min-h-[85vh] sm:min-h-screen w-full bg-[url('/images/hero-img.png')] bg-cover bg-center bg-no-repeat">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 flex min-h-[85vh] sm:min-h-screen w-full flex-col items-start justify-end gap-4 px-5 pb-12 sm:px-10 sm:pb-16 md:px-16 lg:px-20 xl:px-28 xl:pb-20">
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-[clamp(5rem,7vw,9rem)]">
            Plan Your
            <br />
            Trip with Ease
          </h1>

          <p className="max-w-xl text-sm leading-6 text-gray-800 sm:text-base sm:leading-7 md:text-lg">
            Customize your travel itinerary in minutes—pick your
            <br className="hidden sm:block" />
            destination, set your preferences, and explore with confidence.
          </p>

          <button className="mt-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:text-base">
            Get Started
          </button>
        </div>
      </div>
      <ImageGallery />
      <div className="px-6 flex flex-col gap-6">
        <div className="">
          <h1 className="text-2xl font-extrabold">Handpicked Trips</h1>
          <p className="text-sm">Browse well-planned trips designed for different travel styles and interests</p>
        </div>
        <Trips total={10} />
      </div>
      <Footer />
    </section>
  )
}

export default Home