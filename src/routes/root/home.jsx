import { Link } from "react-router"
import ImageGallery from "../../components/ImageGallery"
import Trips from "../../components/Trips"
import Footer from "../../components/Footer"

const Home = () => {
  return (
    <section className="">
      <div className="relative h-screen w-full bg-[url('/images/hero-img.png')] bg-no-repeat">
        <div className="h-full w-full absolute top-0 left-0 bg-linear-to-r from-white/60 to-transparent"></div>
        <div className="absolute top-0 left-0 flex flex-col justify-end items-start h-full w-full pl-28 pb-20 gap-3">
          <h1 className="text-[clamp(3rem,7vw,9rem)] font-extrabold leading-none">Plain Your<br />Trip with Ease</h1>
          <p>Customize your travel itinerary in minutes—pick your<br />destination, set your preferences, and explore with confidence.</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md cursor-pointer">Get Started</button>
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
      <div className="">
        <Footer/>
      </div>

    </section>
  )
}

export default Home