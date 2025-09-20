'use client';

import { useState } from 'react';

interface LocationMapProps {
  className?: string;
}

export default function LocationMap({ className = "" }: LocationMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  // Coordonnées pour 967 Rue Jacquard, 27000 Évreux (Zone Industrielle)
  const restaurantAddress = "967 Rue Jacquard, 27000 Évreux, France";
  const latitude = 49.0139;
  const longitude = 1.1514;

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurantAddress)}`;
    window.open(url, '_blank');
  };

  const handleShowOnMap = () => {
    const url = `https://www.google.com/maps/place/${encodeURIComponent(restaurantAddress)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg ${className}`}>

      {/* Carte interactive avec Google Maps Embed */}
      <div className="relative w-full h-96">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 z-10">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">🌍</div>
              <div className="text-lg font-semibold text-gray-700">Chargement de la carte...</div>
              <div className="text-sm text-gray-500">Zone Industrielle Évreux</div>
            </div>
          </div>
        )}

        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2595.5!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDnCsDAwJzUwLjAiTiAxwrAwOScwNS4wIkU!5e0!3m2!1sen!2sfr!4v1620000000000!5m2!1sen!2sfr`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setMapLoaded(true)}
          className="rounded-2xl"
        />
      </div>

      {/* Overlay avec informations du restaurant */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200/50">
        <div className="flex items-start space-x-3">
          <div className="text-red-600 text-2xl">📍</div>
          <div>
            <div className="font-bold text-gray-900 text-lg">O'Boricienne Burger</div>
            <div className="text-sm text-gray-600 leading-relaxed">
              967 Rue Jacquard<br />
              27000 Évreux<br />
              <span className="text-xs text-gray-500">Zone Industrielle - Près du Bâtiment CFA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleDirections}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 text-sm transform hover:scale-105"
        >
          🧭 Itinéraire
        </button>
        <button
          onClick={handleShowOnMap}
          className="bg-white/90 hover:bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 text-sm border border-gray-200 transform hover:scale-105"
        >
          🗺️ Voir sur la carte
        </button>
      </div>

      {/* Indicateur de distance depuis le centre d'Évreux */}
      <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm text-white rounded-lg px-3 py-2 text-xs font-medium">
        <div className="flex items-center space-x-1">
          <span>🚗</span>
          <span>~5 min du centre</span>
        </div>
      </div>
    </div>
  );
}