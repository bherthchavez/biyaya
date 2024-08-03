import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectItemById } from "./itemsApiSlice";
import { MdEditNote } from 'react-icons/md';
import { SlOptionsVertical } from "react-icons/sl";

const Item = ({ itemId, search }) => {

  const { username } = useAuth();

  const item = useSelector((state) => selectItemById(state, itemId));

  const navigate = useNavigate();

  if (item && item.username !== username) {

    if (item.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      item.qty.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      item.status.toLowerCase().indexOf(search.toLowerCase()) > -1
    ) {

      const handleEdit = () => navigate(`/dashboard/items/${itemId}`);

      return (
        <tr onClick={handleEdit} className="hover:bg-slate-200 text-xl dark:hover:bg-[#151e30] cursor-pointer">
         
          <td
            className={`sm:flex gap-4 whitespace-nowrap px-6 py-6 font-medium text-gray-900 dark:text-gray-300`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-16 w-16">
                <img
                  alt="Man"
                  src={
                    item.avatar
                      ? item.avatar
                      : `https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80`
                  }
                  className="h-16 w-16 rounded-full border border-slate-300  dark:border-slate-600 object-cover"
                />
              </div>
              <div className="ml-4">
                <p className="capitalize">{item.name} </p>
              </div>
            </div>


          </td>

          <td className={`whitespace-pre-wrap  px-6 py-6  text-gray-900 dark:text-gray-300`}>
            <div className="flex-wrap">
              <p className=" text-base text-gray-700 dark:text-gray-500"
                title={item.description}
              >
                {item.description.slice(0, 30)}...
              </p>
            </div>
          </td>

          <td className={`whitespace-nowrap px-6 py-6  text-gray-900 dark:text-gray-300`}>
            <div className="flex-nowrap">
              <p className="capitalize">{item.qty} </p>

            </div>
          </td>
          <td className={`whitespace-nowrap px-6 py-6 font-semibold  text-gray-900 dark:text-gray-300`}>
            <div className="flex-nowrap">
              <p className="capitalize">₱ {Number(item.price).toFixed(2)} </p>

            </div>
          </td>

          <td className={`whitespace-nowrap px-6 py-6 text-base  text-gray-900 dark:text-gray-300 `}>
            {item.category}
          </td>

          <td className={`whitespace-nowrap px-6 py-6 font-medium text-gray-600 dark:text-gray-500 `}>
            <span
              className={` ${item.status === "In Stock"
                ? "bg-green-200 text-green-900 font-semibold dark:bg-green-900 dark:text-green-200"
                : "bg-red-200 text-red-900 font-semibold dark:bg-red-900 dark:text-red-200"
                }  inline-flex items-center justify-center px-3 py-2 text-sm font-normal leading-none  rounded-full`}
            >
              {item.status === "In Stock" ? "In Stock" : "Out of Stock"}
            </span>
          </td>
        </tr>
      );
    }



  } else return null;


};
export default Item;