'use client';

import { useState, useEffect } from 'react';

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const heroSlides = [
        {
            title: "Le goût de la rue",
            subtitle: "L'art du burger",
            description: "Découvrez nos créations smashées à la plancha, près du CFA d'Évreux",
            cta: "Voir le menu",
            background: "bg-gradient-to-br from-red-900 via-red-800 to-red-700"
        },
        {
            title: "Smash Burgers",
            subtitle: "Technique authentique",
            description: "L'âme de la rue en un burger - Nos créations smashées pour une explosion de saveurs",
            cta: "Nos Smash",
            background: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
        },
        {
            title: "Zone CFA",
            subtitle: "Livraison rapide",
            description: "Commandez en ligne, récupérez en 15 minutes près du CFA d'Évreux",
            cta: "Commander",
            background: "bg-gradient-to-br from-yellow-700 via-yellow-600 to-yellow-500"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    return (
        <section className="relative h-screen overflow-hidden">
            {/* Background avec animation */}
            <div className={`absolute inset-0 transition-all duration-1000 ${heroSlides[currentSlide].background}`}>
                {/* Graffiti pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-9xl font-black text-white transform -rotate-12">🍔</div>
                    <div className="absolute top-20 right-20 text-6xl font-black text-white transform rotate-12">★</div>
                    <div className="absolute bottom-20 left-20 text-7xl font-black text-white transform rotate-45">●</div>
                    <div className="absolute bottom-10 right-10 text-8xl font-black text-white transform -rotate-45">◆</div>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gray bg-opacity-40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-6">
                <div className="max-w-4xl mx-auto">

                    {/* Logo/Brand */}
                    <div className="mb-8">
                        {/* Logo/Icon */}
                        <div className="flex justify-center">
                            <img
                            src="/images/logo_obb.jpeg"
                            alt="O'Boricienne Logo"
                            className='w-32 h-24 sm:w-32 sm:h-32 md:w-44 md:h-36 lg:w-52 lg:h-40 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300'
                            />
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 hover:scale-105 transition-transform duration-300">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-400">
                                O'BORICIENNE
                            </span>
                        </h1>
                        <div className="text-2xl md:text-3xl font-bold text-yellow-400 tracking-widest">
                            BURGER
                        </div>
                    </div>

                    {/* Dynamic content */}
                    <div className="mb-8 transition-all duration-500">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            {heroSlides[currentSlide].title}
                        </h2>
                        <h3 className="text-xl md:text-2xl font-semibold text-yellow-300 mb-6">
                            {heroSlides[currentSlide].subtitle}
                        </h3>
                        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
                            {heroSlides[currentSlide].description}
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-red-500/25">
                            {heroSlides[currentSlide].cta}
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-full text-lg transform hover:scale-105 transition-all duration-300">
                            Notre Histoire
                        </button>
                    </div>

                    {/* Stats bar */}
                    <div className="mt-12 mb-6 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl font-black text-yellow-400">32</div>
                            <div className="text-sm text-gray-300">Créations</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-yellow-400">15</div>
                            <div className="text-sm text-gray-300">Min. Prépa</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-yellow-400">100%</div>
                            <div className="text-sm text-gray-300">Street Art</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex space-x-3">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'bg-yellow-400 w-8'
                                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 right-8 z-20 animate-bounce">
                <div className="text-white text-2xl">↓</div>
                <div className="text-white text-xs mt-1">Scroll</div>
            </div>
        </section>
        // <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        //     {/* Background gradient */}
        //     <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-red-900"></div>

        //     {/* Content */}
        //     <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        //         {/* Logo/Icon */}
        //         <div className="text-6xl sm:text-8xl lg:text-9xl mb-6 sm:mb-8">🍔</div>

        //         {/* Title */}
        //         <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6">
        //             <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-400">
        //                 O'BORICIENNE
        //             </span>
        //             <br />
        //             <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
        //                 BURGER
        //             </span>
        //         </h1>

        //         {/* Subtitle */}
        //         <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
        //             Le goût de la rue
        //         </div>

        //         {/* Description */}
        //         <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-8 sm:mb-12 max-w-4xl mx-auto">
        //             L'art du burger
        //         </p>

        //         <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
        //             Découvrez nos créations smashées à la plancha, près du CFA d'Évreux
        //         </p>

        //         {/* Buttons - Responsive */}
        //         <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
        //             <a
        //                 href="/menu"
        //                 className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
        //             >
        //                 Voir le menu
        //             </a>
        //             <a
        //                 href="#histoire"
        //                 className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-full text-lg sm:text-xl transition-all duration-300"
        //             >
        //                 Notre Histoire
        //             </a>
        //         </div>

        //         {/* Stats - Responsive Grid */}
        //         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-4xl mx-auto">
        //             <div className="text-center">
        //                 <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-yellow-400 mb-2">32</div>
        //                 <div className="text-sm sm:text-base lg:text-lg">Créations</div>
        //             </div>
        //             <div className="text-center">
        //                 <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-yellow-400 mb-2">15</div>
        //                 <div className="text-sm sm:text-base lg:text-lg">Min. Prépa</div>
        //             </div>
        //             <div className="text-center">
        //                 <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-yellow-400 mb-2">100%</div>
        //                 <div className="text-sm sm:text-base lg:text-lg">Street Art</div>
        //             </div>
        //         </div>
        //     </div>

        //     {/* Scroll indicator */}
        //     <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        //         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        //         </svg>
        //         <div className="text-xs mt-2">Scroll</div>
        //     </div>
        // </section>
    );
}