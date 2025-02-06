import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectItemById } from "./itemsApiSlice";
import iconPicture from "../../assets/icon-item.svg"
import useGenerateORDATE from "../../hooks/useGenerateORDATE";

const Item = ({ itemId }) => {

  const { username } = useAuth();
  const { formatCurrency } = useGenerateORDATE()
  const item = useSelector((state) => selectItemById(state, itemId));

  const navigate = useNavigate();

  if (item && item.username !== username) {
    const handleEdit = () => navigate(`/inventory/${itemId}`);

    return (
      <tr onClick={handleEdit} className="hover:bg-gray-100 text-lg cursor-pointer">

        <td
          className={`sm:flex gap-4 whitespace-nowrap px-8 py-3 font-medium text-gray-900`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12">
              <img
                alt="img"
                src={
                  item.avatar
                    ? item.avatar
                    : iconPicture
                }
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-slate-300 object-cover"
              />
            </div>
            <div className="ml-4">
              <p className="capitalize text-base">{item.name} </p>
            </div>
          </div>


        </td>

        <td className={`whitespace-nowrap  px-8 py-3  text-gray-900`}>
          <div className="flex-wrap">
            <p className=" text-sm text-gray-700"
              title={item.description}
            >
              {item.description.slice(0, 30)}...
            </p>
          </div>
        </td>
        <td className={`whitespace-nowrap px-8 py-2  font-medium text-gray-600 `}>
          <div className="flex gap-1 justify-start text-sm">

            <h1
              className={` ${item.status === "In Stock"
                ? " text-green-600"
                : " text-red-600"
                }  inline-flex items-center justify-center leading-none`}
            >
              {item.status === "In Stock" ? "In Stock" : "Out of Stock"}

            </h1>
            <h2 className="flex items-center">
              {item.stock_mgt && ` (${item.qty})`}
            </h2>
          </div>
        </td>

        <td className={`whitespace-nowrap px-8 py-2  text-sm text-gray-900`}>
          <div className="flex-nowrap">
            <p className="capitalize">{formatCurrency(item.price)} </p>

          </div>
        </td>

        <td className={`whitespace-nowrap px-8 py- text-sm  text-gray-900 `}>
          {item.category}
        </td>


      </tr>
    );



  } else return null;


};
export default Item;
