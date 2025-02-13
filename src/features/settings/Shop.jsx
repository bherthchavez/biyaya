import React, { useState } from "react";

const Shop = () => {

  const [isPublic, setIsPublic] = useState(false);

  return (
    <>
      <div className="w-full bg-white p-6  border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold  text-gray-500 ">
        Shop Details
        </h1>
        <div className="flex items-center space-x-4 mt-10 mb-6">
          <img
            src="https://via.placeholder.com/80"
            alt="Avatar"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">Change avatar</button>
            <button className="text-red-500">Delete avatar</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-700 font-medium">Business Name</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-lg"
              value="Tabler"
            />
          </div>
          <div>
            <label className="text-gray-700 font-medium">Business ID</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-lg"
              value="560afc32"
              disabled
            />
          </div>
          <div>
            <label className="text-gray-700 font-medium">Location</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-lg"
              value="Peimei, China"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-gray-700 font-medium">Email</label>
          <div className="flex space-x-2 mt-1">
            <input
              type="email"
              className="w-full p-2 border rounded-lg"
              value="paweluna@howstuffworks.cor"
            />
            <button className="bg-gray-300 px-4 py-2 rounded-lg">Change</button>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-gray-700 font-medium">Password</label>
          <button className="block bg-gray-300 px-4 py-2 mt-2 rounded-lg">Set new password</button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <label className="text-gray-700 font-medium">Public profile</label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Submit</button>
        </div>
      </div>
    </>
  );

};




export default Shop;