import React, { useState } from 'react';

const TailwindTest = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600">
        Tailwind CSS Test Component
      </h2>
      
      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Colors & Typography</h3>
          <p className="text-gray-600 mb-4">Testing various text colors and sizes.</p>
          <div className="space-y-2">
            <p className="text-red-500 font-medium">Red text</p>
            <p className="text-green-500 font-medium">Green text</p>
            <p className="text-blue-500 font-medium">Blue text</p>
            <p className="text-purple-500 font-medium">Purple text</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-6 rounded-lg shadow-lg text-white">
          <h3 className="text-xl font-semibold mb-3">Gradients & Shadows</h3>
          <p className="mb-4">Beautiful gradient background with shadow effects.</p>
          <div className="bg-white bg-opacity-20 p-3 rounded backdrop-blur-sm">
            <p className="text-sm">Semi-transparent overlay</p>
          </div>
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Interactive Elements</h3>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setIsToggled(!isToggled)}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
              isToggled 
                ? 'bg-green-500 hover:bg-green-600 text-white transform scale-105' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {isToggled ? 'Active' : 'Inactive'}
          </button>
          
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors duration-200 hover:shadow-lg">
            Hover Me
          </button>
          
          <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-transform duration-200 hover:scale-110">
            Scale on Hover
          </button>
        </div>

        {isToggled && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-green-700">✅ Toggle is active! This demonstrates conditional styling.</p>
          </div>
        )}
      </div>

      {/* Layout & Spacing */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Layout & Spacing</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 bg-yellow-100 p-4 rounded text-center">
            <p className="text-yellow-800 font-medium">Responsive Flex Item 1</p>
          </div>
          <div className="flex-1 bg-blue-100 p-4 rounded text-center">
            <p className="text-blue-800 font-medium">Responsive Flex Item 2</p>
          </div>
          <div className="flex-1 bg-purple-100 p-4 rounded text-center">
            <p className="text-purple-800 font-medium">Responsive Flex Item 3</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Resize your browser to see responsive behavior!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;
