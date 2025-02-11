import React, { useState } from "react";

const Shop = () => {
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState("paweluna@howstuffworks.ca");
  const [isPublic, setIsPublic] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleAvatarDelete = () => {
    setAvatar(null);
  };

  const handleEmailChange = () => {
    const newEmail = prompt("Enter new email:");
    if (newEmail) {
      setEmail(newEmail);
    }
  };

  const handleSetPassword = () => {
    alert("Set new password functionality here");
  };

  const handlePublicProfileToggle = () => {
    setIsPublic(!isPublic);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      {/* Profile Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500">AV</span>
            )}
          </div>
          <div>
            <label className="cursor-pointer text-blue-600 hover:text-blue-700">
              Change avatar
              <input type="file" className="hidden" onChange={handleAvatarChange} />
            </label>
            <button
              onClick={handleAvatarDelete}
              className="ml-4 text-red-600 hover:text-red-700"
            >
              Delete avatar
            </button>
          </div>
        </div>
      </div>

      {/* Business Profile */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Business Profile</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Business Name</th>
              <th className="text-left py-2">Business ID</th>
              <th className="text-left py-2">Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">Tabler</td>
              <td className="py-2">560afc32</td>
              <td className="py-2">Peimei, China</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Email */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Email</h2>
        <p className="text-gray-600 mb-4">
          This contact will be shown to others publicly, so choose it carefully.
        </p>
        <div className="flex items-center">
          <span className="text-gray-800">{email}</span>
          <button
            onClick={handleEmailChange}
            className="ml-4 text-blue-600 hover:text-blue-700"
          >
            Change
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Password</h2>
        <p className="text-gray-600 mb-4">
          You can set a permanent password if you don’t want to use temporary login codes.
        </p>
        <button
          onClick={handleSetPassword}
          className="text-blue-600 hover:text-blue-700"
        >
          Set new password
        </button>
      </div>

      {/* Public Profile */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Public Profile</h2>
        <p className="text-gray-600 mb-4">
          Making your profile public means that anyone on the Dashkit network will be able to find you.
        </p>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={handlePublicProfileToggle}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-gray-800">
            You’re currently {isPublic ? "visible" : "invisible"}
          </span>
        </label>
      </div>
    </div>
  );
};


export default Shop;