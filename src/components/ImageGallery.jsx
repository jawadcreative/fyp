const ImageGallery = () => {
  return (
    <section className="px-6 py-8 flex flex-col gap-4">
        <div className="">
            <h1 className="text-2xl font-extrabold">Featured Travel Destinations</h1>
            <p className="text-sm">Check out some of the best places you can visit around the world.</p>
        </div>
        <div className="h-screen w-full grid md:grid-rows-9 md:grid-cols-5 gap-3 grid-cols-1 grid-rows-6">
            <div className="md:row-span-4 md:col-span-4 col-span-1 row-span-1 rounded-lg overflow-hidden">
                <img className="h-full w-full object-cover object-center" src="/images/card-img-1.png" alt="barcelona" />
            </div>
            <div className="md:row-span-3 row-span-1 col-span-1 rounded-lg overflow-hidden">
                <img className="h-full w-full object-cover object-center" src="/images/card-img-2.png" alt="barcelona" />
            </div>
            <div className="md:row-span-3 md:col-span-1 rounded-lg overflow-hidden">
                <img className="h-full w-full object-cover object-center" src="/images/card-img-3.png" alt="barcelona" />
            </div>
            <div className="md:row-span-5 md:col-span-2 col-span-1 row-span-1 rounded-lg overflow-hidden">
                <img className="h-full w-full object-cover object-center" src="/images/card-img-4.png" alt="barcelona" />
            </div>
            <div className="md:row-span-5 md:col-span-2 row-span-1 col-span-1 rounded-lg overflow-hidden">
                <img className="h-full w-full object-cover object-center" src="/images/card-img-5.png" alt="barcelona" />
            </div>
            <div className="md:row-span-3 row-span-1 col-span-1 rounded-lg overflow-hidden">
                <img className="h-full w-full object-cover object-center" src="/images/card-img-6.png" alt="barcelona" />
            </div>
        </div>
    </section>
  )
}

export default ImageGallery