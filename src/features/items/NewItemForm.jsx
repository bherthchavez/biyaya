import { useEffect, useState } from "react";
import { useAddNewItemMutation } from "./itemsApiSlice";
import { useNavigate } from "react-router-dom";
import { AiOutlineSave } from "react-icons/ai";
import Image from "../../components/Image";
import Spinner from "../../components/Spinner";
import { BsArrowLeftShort } from 'react-icons/bs';
import { toast } from 'react-toastify';
import iconPicture from "../../assets/icon-item.svg";
import useActivityLogger from "../../hooks/useActivityLogger";
import useAuth from "../../hooks/useAuth";

const NewUserForm = () => {
  const { log } = useActivityLogger();
  const { id, name: userName } = useAuth(); //current user id

  const [btnCancel, setBtnCancel] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState("");
  const [stockMGT, setStockMGT] = useState(false);
  const [status, setStatus] = useState("Out of Stock");
  const [imageView, setImageView] = useState("");
  const [image, setImage] = useState();
  const [landingPage, setLandingPage] = useState(false)

  const navigate = useNavigate();
  const [addNewItem, { isLoading, isSuccess, isError, error }] = useAddNewItemMutation();

  useEffect(() => {
    if (isSuccess) {
      resetForm();
      navigate("/inventory");
    }
  }, [isSuccess, navigate]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setQty(0);
    setPrice("");
    setStockMGT(false);
    setStatus("Out of Stock");
    setImageView("");
    setImage("");
  };

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const handleQtyChange = (e) => {
    const value = e.target.value;
    setStatus(stockMGT && value > 0 ? "In Stock" : "Out of Stock");
    setQty(value);
  };

  const handleStockMGTChange = () => {
    setStockMGT((prev) => !prev);
    setStatus("Out of Stock");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setImageView(reader.result);
    };
    reader.readAsDataURL(file);
  };


  const canSave = [name, description, category, image].every(Boolean) && !isLoading;

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


  const handleSaveClick = async (e) => {
    e.preventDefault();
    setBtnCancel(false)
    if (canSave) {
      const result = await addNewItem({ name, description, stockMGT, category, qty, price, status, image });
      toast[result?.error ? 'error' : 'success'](result?.error?.error || result?.data?.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      log(`ADDED INVINTORY`, `${userName} added new item ${name}`)

    }
  };

  const errorClass = isError ? "text-gray-900 sm:text-2xl" : null;

  return (
    <div className="mx-auto  max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-xl font-semibold text-gray-500 sm:text-2xl">New Item</h1>
      <p className={errorClass}>{error?.data?.message}</p>
      <div className="mt-5 md:col-span-2">
        <form onSubmit={handleSaveClick}>
          <div className="border border-gray-200 overflow-hidden rounded-md">
            <div className="space-y-6 bg-white px-4 py-5 sm:p-10">
              <div className="grid grid-cols-2 gap-20">
                <div className="col-span-2 sm:col-span-1">
                  <InputField type="text" label="Item name" value={name} onChange={handleInputChange(setName)} />
                  <TextAreaField label="Description" value={description} onChange={handleInputChange(setDescription)} />
                  <ImageUploadField imageView={imageView} onChange={handleImageChange} />
                </div>
                <div className="col-span-2 sm:col-span-1">
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
            </div>
            <FormFooter canSave={canSave} btnCancel={btnCancel} isLoading={isLoading} setBtnCancel={setBtnCancel} navigate={navigate} />
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, type }) => (
  <div className="mt-5">
    <label className="block text-base text-gray-500">{label}</label>
    <input
      className={`${label == `Item name` ? `w-full` :`w-full sm:w-1/2` } mt-1 px-3 py-3 text-base font-normal text-gray-900 border border-gray-300 outline-none focus:border-gray-300 focus:shadow-sm rounded-md`}
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
      className="w-full mt-1 px-3 py-3 text-base font-normal text-gray-900 border border-gray-300 outline-none focus:border-gray-300 focus:shadow-sm rounded-md"
      rows="4"
      value={value}
      onChange={onChange}
    />
  </div>
);

const ImageUploadField = ({ imageView, onChange }) => (
  <div className="mt-10">
    <label className="block text-base text-center sm:text-left text-gray-500">Item Photo</label>
    <div className="mt-1 flex flex-col gap-4 sm:gap-0 sm:flex-row items-center">
      {imageView ? (
        <Image data={imageView} size="h-40 w-40" rounded="rounded-md" />
      ) : (
        <span className="inline-block h-40 w-40 overflow-hidden rounded-md bg-gray-100">
          <img src={iconPicture} className="h-40 w-40" />
        </span>
      )}
      <label
        htmlFor="file-upload"
        className="sm:ml-5 cursor-pointer text-[10px] px-4 py-2 text-black border font-medium border-gray-300 hover:bg-gray-200 rounded-full duration-150"
      >
        <span className="whitespace-nowrap">Upload Photo</span>
        <input id="file-upload" name="image" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={onChange} />
      </label>
      <p className="text-xs text-gray-500 ml-3">JPG, JPEG, PNG up to 10MB</p>
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="mt-5">
    <label className="block text-base text-gray-500">{label}</label>
    <select
      className="mt-1 block w-full sm:w-1/2 py-3 px-3 text-base font-normal text-gray-900 border border-gray-300 outline-none focus:border-gray-300 focus:shadow-sm rounded-md"
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

const CheckboxField = ({ label, name, checked, onChange }) => (
  <div className="mt-10 space-y-4  whitespace-nowrap">
    <label className="block text-base text-gray-500">{label}</label>
    <div className="mt-4">
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
        <div className="w-[33px] h-[18px] bg-gray-200 flex-nowrap peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] sm:after:top-[5px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-gray-600"></div>
        <span className="ml-3 text-xs lg:text-base text-gray-900">{name}</span>
      </label>
    </div>
  </div>
);

const LoadingIndicator = () => (
  <div className="flex justify-center items-center">
    <Spinner />
    Saving....
  </div>
);

const FormFooter = ({ canSave, btnCancel, setBtnCancel, isLoading, navigate }) => (
  <div className="bg-gray-50 px-4 py-3 sm:px-10 flex justify-between items-center">
    <button
      type="button"
      className="mt-0 inline-flex items-center cursor-pointer justify-center rounded-full text-black bg-gray-200 hover:bg-gray-300 px-4 py-2 text-sm font-medium border border-gray-200 sm:w-40"
      onClick={() => {
        btnCancel && navigate("/inventory");
      }}
    >
      <BsArrowLeftShort className="mr-2 text-[20px]" />
      Cancel
    </button>
    <button
      type="submit"
      disabled={!canSave}
      className={
        `${canSave
          ? `cursor-pointer flex  border-gray-200 bg-black  hover:bg-gray-700`
          : `border-gray-200 bg-gray-300 hover:bg-gray-400`
        } flex justify-center items-center px-3 sm:px-7 py-2 text-white border border-gray-200 rounded-full`}
    >
    {isLoading
    ? <LoadingIndicator/>
    :<>
      <AiOutlineSave size={20} className="mr-2" />
      Save Item
    </>
    }
     
    </button>

  </div>
);

export default NewUserForm;
