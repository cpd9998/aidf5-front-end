import { useState, useEffect } from "react";
import AISearch from "./AISearch";

const Hero = () => {
  const slides = [
    "https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1",
    "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1",
    "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308797093.jpg?k=3a35a30f15d40ced28afacf4b6ae81ea597a43c90c274194a08738f6e760b596&o=&hp=1",
    "https://cf.bstatic.com/xdata/images/hotel/max1280x900/608273980.jpg?k=c7df20ffb25ae52b6a17037dc13f5e15b94a0fe253a9b9d0b656f6376eabec7d&o=&hp=1",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  // const goToPrevious = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === 0 ? slides.length - 1 : prevIndex - 1
  //   );
  // };

  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex, slides.length]);

  return (
    <div className="relative   h-[500px] md:h-[600px] ml-4! mr-4! my-5 overflow-hidden rounded-lg shadow-lg">
      {/* Slider Image */}
      <div className="absolute  inset-0 bg-black opacity-50 z-20"></div>
      <div className="absolute flex   inset-0 z-50  justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-white text-center  font-bold md:text-6xl text-3xl px-2 capitalize ">
            finding your best stacation{" "}
          </h1>
          <p className="text-white text-center mt-4 md:text-lg text-md font-light max-w-2xl">
            Describe your dream destination and experience, and we'll find the
            perfect place for you.
          </p>
          <AISearch />
        </div>
      </div>
      <div></div>
      <img
        src={
          slides[currentIndex] ||
          "https://cf.bstatic.com/xdata/images/hotel/max1280x900.jpg"
        }
        fetchpriority="high"
        className=" z-50 w-full h-full bg-cover bg-center transition-all duration-500 ease-in-out "
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ring-1 ring-white cursor-pointer flex items-center justify-center ${
              index === currentIndex ? "scale-150" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            {currentIndex === index && (
              <div className="w-[6px] h-[6px] bg-slate-300 rounded-full"></div>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Hero;
