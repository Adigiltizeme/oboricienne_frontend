import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import PopularProducts from '../components/PopularProducts';
import CategoriesNav from '../components/CategoriesNav';
import LocationMap from '../components/LocationMap';
import OrderingAlert from '../components/OrderingAlert';

import { categories, products } from '../data/products';
import { getCategoryImage } from '@/helpers/getCategoryEmoji';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navigation Header */}
      <Header />

      {/* Ordering Alert */}
      <OrderingAlert />

      {/* Hero Section */}
      <HeroSection />

      {/* Popular Products Section */}
      <PopularProducts />

      {/* Categories Navigation */}
      <CategoriesNav />

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-yellow-600">
                  L'ART DU BURGER
                </span>
                <br />DANS TOUTE SA SPLEND-EURE
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-yellow-600 mb-6"></div>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Chez O'Boricienne, nous maîtrisons l'art du smash burger.
                Chaque création est smashée à la plancha pour développer une croûte parfaite
                et révéler des saveurs intenses.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Installés près du Bâtiment CFA d'Évreux, nous servons la communauté étudiante
                et les professionnels de la zone industrielle avec passion et authenticité.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🔥</div>
                  <div>
                    <div className="font-bold text-gray-900">Smash Technique</div>
                    <div className="text-gray-600 text-sm">Plancha haute température</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <div className="font-bold text-gray-900">Service Rapide</div>
                    <div className="text-gray-600 text-sm">15 min en moyenne</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🚚</div>
                  <div>
                    <div className="font-bold text-gray-900">Livraison CFA</div>
                    <div className="text-gray-600 text-sm">Zone industrielle</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🎨</div>
                  <div>
                    <div className="font-bold text-gray-900">Street Art</div>
                    <div className="text-gray-600 text-sm">Créations uniques</div>
                  </div>
                </div>
              </div>

              <button className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white font-bold py-4 px-8 rounded-full text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl">
                Notre Histoire
              </button>
            </div>

            {/* Image placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-red-600 to-yellow-600 rounded-2xl p-8 text-white text-center">
                <div className="text-8xl mb-4">
                  <img
                    src={getCategoryImage('smash-burger')}
                    alt="Smash Burger"
                    className="w-24 h-24 rounded-xl object-cover text-center mx-auto mb-4"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">Technique Smash</h3>
                <p className="text-red-100">
                  La viande est écrasée sur la plancha brûlante pour créer
                  une croûte caramélisée unique
                </p>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 rounded-full p-4 font-black text-xl shadow-xl">
                🔥
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 rounded-full p-4 font-black text-xl shadow-xl">
                ⭐
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-yellow-400 mb-2">{products.length}</div>
              <div className="text-gray-300">Créations Menu</div>
            </div>
            <div>
              <div className="text-4xl font-black text-yellow-400 mb-2">15</div>
              <div className="text-gray-300">Min. Préparation</div>
            </div>
            <div>
              <div className="text-4xl font-black text-yellow-400 mb-2">{categories.length}</div>
              <div className="text-gray-300">Univers Culinaires</div>
            </div>
            <div>
              <div className="text-4xl font-black text-yellow-400 mb-2">100%</div>
              <div className="text-gray-300">Street Art</div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-yellow-600">
                NOUS TROUVER
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-yellow-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Idéalement situés près du Bâtiment CFA d'Évreux, zone industrielle
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Interactive Map */}
            <LocationMap />

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Informations</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-red-600 text-xl">📍</div>
                    <div>
                      <div className="font-semibold">O'BORICIENNE BURGER</div>
                      <div className="text-gray-600">967 Rue Jacquard<br />27000 Évreux</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-red-600 text-xl">📞</div>
                    <div>
                      <div className="font-semibold">+337 44 78 64 78</div>
                      <div className="text-gray-600">Commandes & Informations</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-red-600 text-xl">⏰</div>
                    <div>
                      <div className="font-semibold">11h-14h - 18h-22h00</div>
                      <div className="text-gray-600">Du Lundi au Vendredi</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Livraison</h4>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🚚</div>
                      <div className="font-semibold">Zone CFA</div>
                      <div className="text-green-600 font-bold">Gratuit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">📦</div>
                      <div className="font-semibold">Sur Place</div>
                      <div className="text-blue-600 font-bold">15 min</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <button className="w-full bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white font-bold py-4 px-8 rounded-full text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl">
                Commander Maintenant
              </button> */}
            </div>
          </div>
        </div>

        {/* Scroll indicator vers le haut de la page */}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-3xl"></div>
                <img
                  src="/images/logo_obb.jpeg"
                  alt="O'Boricienne Logo"
                  className="w-12 h-10 rounded-full shadow-lg"
                />
              </div>
              <div className="text-2xl font-black">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-400">
                  O'BORICIENNE BURGER
                </span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                L'art du burger, dans toute sa Splend-Eure
                Créations street art près du Bâtiment CFA d'Évreux.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                  f
                </div>
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                  📷
                </div>
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                  🐦
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4">Navigation</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/menu" className="hover:text-yellow-400 transition-colors">Menu Complet</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Nos Hits</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Notre Histoire</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>Zone Industrielle près du Bâtiment CFA</li>
                <li>967 Rue Jacquard</li>
                <li>27000 Évreux</li>
                <li>oboricienneburger@gmail.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 O'Boricienne Burger - Tous droits réservés.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}