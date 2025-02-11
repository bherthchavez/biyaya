import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";
import iconItem from "../../assets/icon-item.svg";

const User = ({ userId, search }) => {

  const { username } = useAuth();

  const user = useSelector((state) => selectUserById(state, userId));

  const navigate = useNavigate();



  if (user && user.username !== username && !user?.dev) {

    if (user.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      user.position.toLowerCase().indexOf(search.toLowerCase()) > -1
    ) {

      const handleEdit = () => navigate(`/settings/users/${userId}`);

      return (

        <div title='Edit user' className="hover:shadow-lg gap-3   flex flex-col justify-between bg-white rounded-lg shadow-sm border-gray-200 text-center text-gray-800 hover:text-gray-500">
          <div className="text-4xl font-bold md:text-5xl flex flex-col pt-5 sm:py-5">
            <div className='mx-auto h-20 w-20 lg:h-28 lg:w-2/5 border border-gray-200 rounded-full '>
              <img
                alt={user.name}
                src={user.avatar || iconItem}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="w-full text-sm font-normal mt-3 gap-4 flex flex-col items-start justify-between text-gray-500">
              <div className='mx-auto  flex flex-col gap-2 text-black text-base sm:text-lg text-center'>
                <h1 className=''>{user.name}</h1>
                <p className='text-gray-500 text-sm'>{user.position}</p>
                <span
                  className={` ${user.active
                    ? "border-emerald-500 text-emerald-700"
                    : "border-red-500 text-red-700"
                    }  inline-flex items-center w-14 sm:w-20 mx-auto justify-center rounded-full border  px-2 py-0.5`}
                >


                  <p className="whitespace-nowrap text-xs">
                    {user.active ? "Active" : "Inactive"}
                  </p>
                </span>

              </div>
            </div>
          </div>
          <div onClick={handleEdit} className="flex items-center cursor-pointer h-10 sm:h-14 min-w-full hover:bg-gray-100 text-gray-500 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <h1 className="mx-auto text-xs sm:text-sm font-medium">
              View full Profile
            </h1>

          </div>
        </div>
      );
    }



  } else return null;


};
export default User;
