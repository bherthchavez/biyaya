
import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PageLoader from "../../components/PageLoader";
import { AiOutlineUserAdd } from 'react-icons/ai';
import PageError from "../../components/PageError";

const UsersList = () => {

  const [search, setsearch] = useState("");


  const navigate = useNavigate();
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 20000, // refresh data every 15 seconds
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });



  let content;

  if (isLoading) content = <PageLoader />

  if (isError) {
    content = <PageError error={error?.data?.message} />
  }


  const handleSearch = (text) => {
    setsearch(text);
  };


  if (isSuccess) {
    const { ids } = users;
    // const tableContent = ids?.length && ids.map((userId) => <User key={userId} userId={userId} search={search} />)
    const userContent = ids?.length && ids.map((userId) => <User key={userId} userId={userId} search={search} />)


    content = (
      <>

        <div className="mx-auto  max-w-screen-xl  px-4 py-8 sm:px-6 lg:px-8 no-print">
          <div className="sm:flex justify-between">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold  text-gray-500 ">
                Manage User
              </h1>
              <span
                onClick={() => navigate("/settings/users/new")}
                title='Add Item'
                className="flex text-xs gap-2 sm:hidden items-center cursor-pointer  px-8 py-3 text-black border font-medium border-gray-300  hover:bg-gray-200 rounded-full duration-150"
              >
                <AiOutlineUserAdd size={20} />
              </span>
            </div>

            <div className="sm:flex  mt-6 sm:mt-0">
              <div className="pr-0 sm:pr-5">
                <label htmlFor="table-search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none shrink-0">
                    <svg
                      className="w-4 h-4  text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="table-search"
                    className="w-full pl-10 p-2 block py-4 px-6 text-sm font-normal bg-white text-gray-900 border border-gray-200 outline-none focus:border-gray-300  focus:shadow-sm rounded-xl"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex">
                <span
                  onClick={() => navigate("/settings/users/new")}
                  title='Add New Item'
                  className="hidden sm:flex gap-3 items-center cursor-pointer  px-8 py-3 text-black border font-medium border-gray-300  hover:bg-white rounded-full duration-150"
                >
                  <AiOutlineUserAdd size={19} />
                  Add User
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 mt-10">
            <div className="font-normal px-6 sm:px-0 grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-6 2xl:grid-cols-4 2xl:gap-6 ">
              {userContent}
            </div>
          </div>
        </div>


      </>
    );
  }

  return content;
};
export default UsersList;
