/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { useUpdateItemMutation, useDeleteItemMutation } from "./itemsApiSlice";
import { useNavigate } from "react-router-dom";
import { AiOutlineSave, AiOutlineWarning } from "react-icons/ai";
import Image from "../../components/Image";
import Spinner from "../../components/Spinner";
import useAuth from "../../hooks/useAuth";
import { AiOutlineUserDelete } from 'react-icons/ai';
import { BsArrowLeftShort } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Modal from "../../components/Modal";
import useActivityLogger from "../../hooks/useActivityLogger";


const EditItemForm = ({ item }) => {
  const { log } = useActivityLogger();
  const { id, name: userName } = useAuth(); //current user id
  const navigate = useNavigate();

  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description)
  const [category, setCategory] = useState(item.category)
  const [qty, setQTY] = useState(item.qty)
  const [price, setPrice] = useState(item.price)
  const [stockMGT, setStockMGT] = useState(item?.stock_mgt)
  const [status, setStatus] = useState(item.status)
  const [imageView, setImage] = useState("")
  const [image, setDataImage] = useState();
  const [landingPage, setLandingPage] = useState(item.landingPage ? item.landingPage : false)
  const [spinText, setSpinText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [updateItem, { isLoading, isSuccess, isError, error }] =
    useUpdateItemMutation();

  const [
    deleteItem,
    { isSuccess: isDelSuccess, isLoading: isDelLoading, },
  ] = useDeleteItemMutation();



  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }



  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      resetForm()
      navigate("/inventory")
    }
  }, [isSuccess, isDelSuccess, navigate]);


  const resetForm = () => {
    setName("")
    setDescription("")
    setCategory("")
    setQTY("")
    setPrice("")
    setStockMGT(false)
    setStatus("")
    setImage("")
    setDataImage()
  };


  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const handleQtyChange = (e) => {
    const value = e.target.value;
    setQTY(value);
    setStatus(stockMGT && value > 0 ? "In Stock" : "Out of Stock");
  };
  
  const handleStockMGTChange = () => {
    setStockMGT((prev) => !prev);
    setQTY(0);
    setStatus((prev)=> prev = stockMGT &&  qty > 0 ? "In Stock" : "Out of Stock");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setDataImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const categoryOptions = [
    { value: "--", label: "--" },
    { value: "Coffee", label: "Coffee" },
    { value: "Non Coffee", label: "Non Coffee" },
    { value: "Food", label: "Food" },
    { value: "Other", label: "Other" },
  ];

  const statusOptions = [
    { value: "In Stock", label: "In Stock" },
    { value: "Out of Stock", label: "Out of Stock" },
  ];



  const onSaveUserClicked = async () => {

    if (!isLoading) {
      setSpinText('Updating...')
      const result = await updateItem({
        id: item.id,
        name,
        description,
        stockMGT,
        category,
        qty,
        price,
        status,
        image,
        landingPage
      });

      if (result?.error) {
        toast.error(result.error, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

      } else {
        toast.success(result.data, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }

      log(`UPDATED INVINTORY`, `${userName} updated existing item data`)
    }

  };

  const onDeleteUserClicked = async () => {

    if (!isDelLoading) {
      setIsModalOpen(false)
      setSpinText('Deleting...')
      const result = await deleteItem({ id: item.id })
      if (result?.error) {
        toast.error(result.error, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

      } else {
        toast.success(result.data, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        log(`DELETED INVINTORY`, `${userName} deleted the item ${name}`)

      }


    }

  };


  const errClass = isError
    ? "text-gray-900 sm:text-2xl"
    : "offscreen";


  const btnClass = id !== item._id ? 'flex justify-between' : null;

  const content = (
    <>
      <Modal isOpen={isModalOpen} onClose={handleModalClose} onOk={onDeleteUserClicked}>
        <div className="bg-white p-4">
          <h2 className="text-lg font-bold mb-4 text-gray-800"><AiOutlineWarning size={50} className="m-auto text-red-600" /></h2>
          <h2 className="text-lg font-bold mb-4 text-gray-800">{name}</h2>
          <p className=" text-gray-800">Do you really want to delete this Item?</p>
        </div>
      </Modal>

      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 ">
        <h1 className="mb-2 text-xl font-semibold  text-gray-500 sm:text-2xl ">
          {id === item._id ? 'Account Setting' : 'Edit Item'}
        </h1>
        <p className={errClass}>{error?.data?.message}</p>

        <div className="mt-5 md:col-span-2 ">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="overflow-hidden rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-10">
                <div className="grid grid-cols-2 gap-20">
                  <div className="col-span-2 sm:col-span-1 ">
                    <InputField type="text" label="Item name" value={name} onChange={handleInputChange(setName)} />
                    <TextAreaField label="Description" value={description} onChange={handleInputChange(setDescription)} />
                    <ImageUploadField imageView={imageView} value={item.avatar} onChange={handleImageChange} />
                  </div>
                  <div className=" col-span-2 sm:col-span-1">
                    <InputField type="number" label="Price" value={price} onChange={handleInputChange(setPrice)} />
                    <SelectField label="Category" value={category} onChange={handleInputChange(setCategory)} options={categoryOptions} />
                    <CheckboxField label="Stock management" name="Track stock quantity for this item" checked={stockMGT} onChange={handleStockMGTChange} />
                    {stockMGT ? (
                      <InputField type="number" label="Quantity" value={qty} onChange={handleQtyChange} />
                    ) : (
                      <SelectField label="Status" value={status} onChange={handleInputChange(setStatus)} options={statusOptions} />
                    )}


                    <CheckboxField label="Landing Page" name="Display this item to Landing Page" checked={landingPage} onChange={()=> setLandingPage(prev => !prev)} />

                  </div>
                </div>

                {isDelLoading || isLoading
                  ?
                  <div className="mt-6 flex text-gray-400 justify-end">
                    <Spinner />
                    <p>{spinText} </p>
                  </div>
                  : null
                }

              </div>

              {/*footer big screen */}
              <div className={`hidden sm:flex justify-between text-sm bg-gray-50 px-4 py-3 text-right sm:px-6 ${btnClass}`}>
                {id !== item._id
                  && <span
                    className={
                      !isLoading || isDelLoading
                        ? `cursor-pointer flex  px-3 sm:px-6 py-3 text-red-700 border border-red-300 hover:bg-gray-200 rounded-full `
                        : "flex  px-3 sm:px-4 py-2 text-white border border-gray-200 bg-gray-400 hover:bg-gray-400 rounded-md "
                    }
                    title="Delete User"
                    disabled={!isLoading || !isDelLoading}
                    onClick={handleModalOpen}
                  >
                    <AiOutlineUserDelete size={20} className='mr-1 sm:mr-2' />
                    Delete
                  </span>
                }

                <div className="flex  items-center gap-5">
                  <div>
                    <span
                      title="Cancel"
                      disabled={!isLoading && !isDelLoading}
                      onClick={() => !isLoading && !isDelLoading ? navigate("/dashboard/items") : undefined}
                      className={
                        !isLoading && !isDelLoading
                          ? `cursor-pointer flex px-6 py-3 text-black border border-gray-300 hover:bg-gray-200 rounded-full`
                          : `flex px-6 py-3 text-white border border-gray-200 bg-gray-400 hover:bg-gray-400 rounded-full`
                      } >
                      <BsArrowLeftShort size={20} className='mr-1 sm:mr-2' />
                      Cancel
                    </span>
                  </div>

                  <span
                    title="Save"
                    onClick={!isDelLoading ? onSaveUserClicked : undefined}
                    className={!isDelLoading
                      ? `cursor-pointer flex px-3 sm:px-6 py-3 text-white border border-gray-200 bg-black hover:bg-gray-700 rounded-full `
                      : `flex px-3 sm:px-4 py-2 text-white border border-gray-200 bg-gray-400 hover:bg-gray-400 rounded-full `
                    }
                  >
                    <AiOutlineSave size={20} className="mr-1 sm:mr-2" />
                    Update
                  </span>
                </div>
              </div>

              {/*footer mobile screen */}
              <div className={`flex  gap-2  flex-col sm:flex-row sm:hidden  sm:justify-end text-sm bg-gray-50 px-4 py-3 text-center sm:px-6 ${btnClass}`}>

                <div
                  title="Cancel"
                  disabled={!isLoading && !isDelLoading}
                  onClick={() => !isLoading && !isDelLoading ? navigate("/inventory") : undefined}
                  className={
                    ` ${!isLoading && !isDelLoading
                      ? `cursor-pointer  text-black border border-gray-300  hover:bg-gray-200 `
                      : `  text-white border border-gray-200 bg-gray-400 hover:bg-gray-400 `
                    } rounded-full flex px-6 py-3  justify-center`} >
                  <BsArrowLeftShort size={20} className='mr-1 sm:mr-2' />
                  Cancel
                </div>

                <div
                  title="Save"
                  onClick={!isDelLoading ? onSaveUserClicked : undefined}
                  className={`${!isDelLoading
                    ? `cursor-pointer flex px-3 sm:px-6 py-3 text-white border border-gray-300 bg-black hover:bg-gray-700 `
                    : ` text-white border border-gray-300 bg-gray-400 hover:bg-gray-400 `
                    } flex items-center justify-center  px-3 sm:px-4 py-2 rounded-full `}
                >
                  <AiOutlineSave size={20} className="mr-1 sm:mr-2" />
                  Update
                </div>

                {id !== item._id
                  && <span
                    className={
                      `${!isLoading || isDelLoading
                        ? `cursor-pointer   text-red-700  border-red-300 hover:bg-gray-200  `
                        : " text-white  border-gray-300 bg-gray-400 hover:bg-gray-400 "
                      }flex justify-center px-3 mt-5 sm:px-6 py-3 border  rounded-full`}
                    title="Delete User"
                    disabled={!isLoading || !isDelLoading}
                    onClick={handleModalOpen}
                  >
                    <AiOutlineUserDelete size={20} className='mr-1 sm:mr-2' />
                    Delete
                  </span>
                }

              </div>
            </div>
          </form>
        </div>
      </div>

    </>
  );

  return content;
};

const InputField = ({ label, value, onChange, type }) => (
  <div className="mt-5">
    <label className="block text-base text-gray-500">{label}</label>
    <input
      className={`${label == `Item name` ? `w-full` : `w-full sm:w-1/2`} mt-1 px-3 py-3 text-base font-normal text-gray-900 border border-gray-200 outline-none focus:border-gray-300 focus:shadow-sm rounded-md`}
      type={type}
      value={value}
      onChange={onChange}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange }) => (
  <div className="mt-5">
    <label className="block text-base text-gray-500">{label}</label>
    <textarea
      className="w-full mt-1 px-3 py-3 text-base font-normal text-gray-900 border border-gray-200 outline-none focus:border-gray-300 focus:shadow-sm rounded-md"
      rows="4"
      value={value}
      onChange={onChange}
    />
  </div>
);

const ImageUploadField = ({ imageView, value, onChange }) => (
  <div className="mt-10">
    <label className="block text-base text-center sm:text-left text-gray-500">Item Photo</label>
    <div className="mt-1 flex flex-col gap-4 sm:gap-0 sm:flex-row items-center">
      {imageView ? (
        <Image data={imageView} size="h-40 w-40" rounded="rounded-md" />
      ) : (
        <span className="inline-block h-40 w-40 overflow-hidden rounded-md bg-gray-100">
          <img src={value} className="h-40 w-40 object-cover" />
        </span>
      )}
      <label
        htmlFor="file-upload"
        className="sm:ml-5 cursor-pointer text-[10px] px-4 py-2 text-black border  font-medium border-gray-300 hover:bg-gray-200 rounded-full duration-150"
      >
        <span className="whitespace-nowrap">Replace Photo</span>
        <input id="file-upload" name="image" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={onChange} />
      </label>
      <p className="text-xs text-gray-500 ml-3">JPG, JPEG, PNG up to 10MB</p>
    </div>
  </div>
);

const CheckboxField = ({ label, name, checked, onChange }) => (
  <div className="mt-10 space-y-4">
    <label className="block text-base text-gray-500">{label}</label>
    <div className="mt-4">
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
        <div className="w-[33px] h-[18px] bg-gray-200 flex-nowrap peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] sm:after:top-[5px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-gray-600"></div>
        <span className="ml-3 text-xs sm:text-base text-gray-900">{name}</span>
      </label>
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="mt-5">
    <label className="block text-base text-gray-500">{label}</label>
    <select
      className="mt-1 block w-full sm:w-1/2 py-3 px-3 text-base font-normal text-gray-900 border border-gray-200 outline-none focus:border-gray-300 focus:shadow-sm rounded-md"
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);



export default EditItemForm;
