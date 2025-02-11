
import React, { useState } from 'react';
import { useGetPublicItemsQuery } from "./publicItemsApiSlice";
import useGenerateORDATE from "../../hooks/useGenerateORDATE";

import biyayaLogo from "../../assets/biyaya_logo.png";
import biyayaShop from "../../assets/biyaya_shop.png";
import biyayaSmile from "../../assets/biyaya_smile.jpg";
import biyayaSmile2 from "../../assets/biyaya_smile2.jpg";
import PageLoader from "../../components/PageLoader";



const Landing = () => {
  const itemCategories = ["Coffee", "Non Coffee", "Food", "Other"]
  const [isOpen, setIsOpen] = useState(true); // Simulate open/close status
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [expandedItem, setExpandedItem] = useState(null); // Track expanded menu item
  const [activeTab, setActiveTab] = useState('Coffee'); // Track active tab
  const [search, setsearch] = useState("Coffee");
  const { formatCurrency } = useGenerateORDATE()

  const galleryImages = [
    biyayaSmile,
    biyayaSmile2,
    biyayaShop,
  ];


  const { data: settings, error, isLoading } = useGetPublicItemsQuery("Settings",{
    pollingInterval: 10000, // refresh data every 15 seconds
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });


  if (isLoading) return <PageLoader />;

  const extractedItems = Object.values(settings[0]);
  const items = extractedItems.filter((item) => item.category === search);
  const description = settings[1][0].description;
  const shopName = settings[1][0].shopName;
  const shopOpen = settings[1][0].isOpen;

  const handleNextGallery = () => {
    setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevGallery = () => {
    setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const toggleItemDescription = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const onCategorySearch = (category) => {
    setsearch(category)
  }


  return (
    <div className="min-h-screen bg-[#f6f8fb]  text-gray-700">
      {/* Navbar */}
      <nav className="p-6 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={biyayaLogo} alt="Biyaya Logo" className="h-12" />
            <span className="ml-4 text-2xl font-bold">Biyaya</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#about" className=" hover:text-gray-400">About</a>
            <a href="#menu" className=" hover:text-gray-400">Menu</a>
            <a href="#gallery" className=" hover:text-gray-400">Gallery</a>
            <a href="#contact" className=" hover:text-gray-400">Contact</a>
          </div>
          <button className="md:hidden">
            <svg className="w-6 h-6 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 h-screen ">
        <div className="grid md:grid-cols-2 gap-9 sm:gap-12 items-center">
          {/* Image on the left */}
          <div className="order-1 md:order-1 h-72 md:h-auto">
            <img
              src='https://cdn.shopify.com/s/files/1/0838/4525/files/Methods_of_Flavoring_Coffee_1024x1024.jpg?v=1733128083' // Replace with your hero image path
              alt="Coffee"
              className="w-full h-full object-cover -rotate-12 rounded-full shadow-md border-4 border-slate-300"
            />
          </div>
          {/* Text on the right */}
          <div className="order-2 md:order-2 text-left md:text-left">

            <span
              className={`${shopOpen ? 'bg-emerald-100 px-2.5 py-0.5 text-emerald-700' : 'bg-red-100 px-2.5 py-0.5 text-red-700' } inline-flex gap-2 items-center justify-center rounded-full`}
            >
              <div className={`${shopOpen ? 'bg-green-700' : 'bg-red-700'} p-1 rounded-full animate-pulse`}></div>

              <p className="whitespace-nowrap text-xs sm:text-sm font-bold tracking-wider">{shopOpen ? 'We are open!' : 'Closed' } </p>
            </span>

            <h1 className="text-5xl md:text-7xl font-bold  text-slate-900">{`Welcome to`}</h1>
            <div className="mb-6 mt-1">
              <p className="whitespace-nowrap font-bold text-2xl sm:text-3xl text-gray-800">{shopName}</p>

            </div>
            <p className="text-md sm:text-lg text-gray-500 mb-8">{description}</p>
            <div className="mb-8">
            </div>
            <a href="#menu" className="bg-slate-900 text-slate-100 px-8 py-3 rounded-full hover:bg-slate-700 transition duration-300">
              Our Available Menu
            </a>
          </div>
        </div>
      </div>


      {/* Menu Section */}
      {extractedItems.length &&

        <div id="menu" className="py-16 h-screen">
          <div className="container max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col mb-12 gap-6 justify-center">
              <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800">
                Our Menu
              </h2>
              <div className="grid grid-cols-1 min-w-full">
                {/* Scrollable Categories */}
                <div className="flex whitespace-nowrap sm:justify-center overflow-x-auto py-3 gap-3 text-xs lg:text-lg">
                  {itemCategories.map((category, idx) => (
                    <div
                      key={idx}
                      title={category}
                      onClick={() => onCategorySearch(category)}
                      className={`${search === category
                        ? 'bg-[#242424] text-white active:bg-black'
                        : 'active:bg-white text-black hover:shadow'
                        } flex justify-center items-center px-6 sm:px-8 py-2 cursor-pointer border border-gray-300 rounded-full`}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-4 text-center cursor-pointer hover:shadow-2xl transition duration-300"
                  onClick={() => toggleItemDescription(index)}
                >
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-24 md:h-40 object-cover rounded-2xl mb-4"
                  />
                  <h3 className="text-lg md:text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-gray-700 mb-2">{formatCurrency(item.price)}</p>
                  {expandedItem === index && (
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      }


      {/* Gallery Section */}
      <div id="gallery" className="container mx-auto px-6 py-16 h-screen">
        <h2 className="text-2xl sm:text-5xl font-bold text-center mb-12">Shop Gallery</h2>
        <div className="relative ">
          <img src={galleryImages[galleryIndex]} alt="Gallery" className="w-full h-96 object-cover rounded-lg shadow-lg" />
          <button
            onClick={handlePrevGallery}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextGallery}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Schedule Section */}
      <div className=" py-16 h-screen">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Store Schedule</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Weekdays</h3>
              <p className="text-gray-400">7:00 AM - 8:00 PM</p>
            </div>
            <div className="p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Weekends</h3>
              <p className="text-gray-400">8:00 AM - 9:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">&copy; 2023 Biyaya. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
