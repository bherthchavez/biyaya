/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../config/roles";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineSave, AiOutlineWarning } from "react-icons/ai";
import Image from "../../components/Image";
import Spenner from "../../components/Spinner";
import useAuth from "../../hooks/useAuth";
import { AiOutlineUserDelete } from 'react-icons/ai';
import { BsArrowLeftShort } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Modal from "../../components/Modal";
import useActivityLogger from "../../hooks/useActivityLogger";


const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {

  const { log } = useActivityLogger();
  const { id, name: userName } = useAuth(); //current user id

  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isLoading: isDelLoading, },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  const [name, setName] = useState(user.name);
  const [position, setPosition] = useState(user.position);
  const [username, setUsername] = useState(user.username)
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState("")
  const [validPassword, setValidPassword] = useState(false)
  const [roles, setRoles] = useState(user.roles)
  const [active, setActive] = useState(user.active)
  const [spinText, setSpinText] = useState('')
  const [passwordShown, setPasswordShown] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageView, setImageView] = useState("");
  const [image, setImage] = useState();

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }


  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setName("");
      setPosition("");
      setUsername("");
      setPassword("");
      setImageView("");
      setImage("");
      navigate("/settings/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);


  const onNameChanged = (e) => setName(e.target.value);
  const onPositionChanged = (e) => setPosition(e.target.value)
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onActiveChanged = () => setActive((prev) => !prev);

  const onImageChanged = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
      setImageView(reader.result);
    };
  };

  const onSaveUserClicked = async () => {


    if (password) {
      setSpinText('Updating...')
      const result = await updateUser({
        id: user.id,
        name,
        position,
        username,
        password,
        roles,
        active,
        image
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
        toast.success(result?.data.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        log(`UPDATED USER`, `${userName} updated existing user data and password of ${name}`)

      }

    } else {

      setSpinText('Updating...')
      const result = await updateUser({
        id: user.id,
        name,
        position,
        username,
        roles,
        active,
        image
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
        toast.success(result?.data.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        log(`UPDATED USER`, `${userName} updated existing user data of ${name}`)

      }
    }
  };

  const onDeleteUserClicked = async () => {

    if (!isLoading) {
      setIsModalOpen(false)
      setSpinText('Deleting...')
      const result = await deleteUser({ id: user.id })
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

        toast.success(result?.data, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        log(`DELETED USER`, `${userName} deleted user ${name}`)

      }


    }

  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {" "}
        {role}
      </option>
    );
  });


  let canSave;
  if (password) {
    canSave =
      [roles, validUsername, validPassword].every(Boolean) && !isLoading;
  } else {
    canSave = [roles, validUsername].every(Boolean) && !isLoading;
  }

  const validUserClass = !validUsername
    ? "text-red-600"
    : "text-blue-700";
  const validPwdClass = !validPassword
    ? "text-red-600"
    : "text-blue-700";

  async function readImage(e, func) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      let binaryData = e.target.result;
      let base64String = window.btoa(binaryData);
      func(base64String);
    };
    let image = reader.readAsBinaryString(file);
    return image;
  }

  const btnClass = id !== user._id ? 'flex justify-between' : null;


  const content = (
    <>
      <Modal isOpen={isModalOpen} onClose={handleModalClose} onOk={onDeleteUserClicked}>
        <div className="bg-white  p-4">
          <h2 className="text-lg font-bold mb-4 text-gray-800"><AiOutlineWarning size={50} className="m-auto text-red-600" /></h2>
          <h2 className="text-lg font-bold mb-4 text-gray-800">{name}</h2>
          <p className=" text-gray-800">Do you really want to delete this User?</p>
        </div>
      </Modal>

      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 ">
        <h1 className="mb-2 text-xl font-semibold text-gray-500 sm:text-2xl ">
          {id === user._id ? 'Account Setting' : 'Edit User'}
        </h1>
        <p className="text-red-700 sm:text-xl">{error?.data?.message}</p>

        <div className="mt-5 md:col-span-2 ">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="border border-gray-200 overflow-hidden rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-10">
                <div className="grid grid-cols-2 gap-20">
                  <div className="col-span-2 sm:col-span-1 ">

                    <div className="">

                      <div className="mt-1 flex flex-col gap-4 sm:gap-0 sm:flex-row items-center">
                        <div className="flex flex-col items-center gap-1">
                          <label className="block text-base text-center sm:text-left  text-gray-500">
                            User  Photo
                          </label>
                          {imageView ? (
                            <Image
                              data={imageView}
                              size="h-40 w-40"
                              rounded="rounded-full"
                            />
                          ) : (
                            <span className="inline-block h-40 w-40 overflow-hidden rounded-full bg-gray-100">
                              <img
                                alt="Man"
                                src={user.avatar}
                                className="h-40 w-40 rounded-full object-cover border border-slate-300 "
                              />
                            </span>
                          )}
                        </div>

                        <label
                          htmlFor="file-upload"
                          className="sm:ml-5 cursor-pointer text-[10px]  px-4 py-2 text-black border font-medium border-gray-300   hover:bg-gray-200   rounded-full"
                        >
                          <span className="whitespace-nowrap">Replace Photo</span>

                          <input
                            id="file-upload"
                            name="image"
                            type="file"
                            className="sr-only"
                            accept="image/png, image/jpeg"
                            onChange={(event) => {
                              readImage(event, setImage);
                              onImageChanged(event);
                            }}
                          />
                        </label>
                        <p className="text-xs text-gray-500 ml-3">
                          JPG, JPEG, PNG up to 10MB
                        </p>
                      </div>
                    </div>
                    <div className="mt-10">
                      <label
                        className="block text-base  text-gray-500"
                        htmlFor="name"
                      >
                        Name
                      </label>
                      <input
                        className={`w-full mt-1 px-3 py-3 text-base font-normal text-gray-900  border  border-gray-200      outline-none focus:border-gray-300  focus:shadow-sm rounded-md`}
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="off"
                        value={name}
                        onChange={onNameChanged}
                      />
                    </div>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

                      <div>
                        <label
                          className="block text-base text-gray-500"
                          htmlFor="position"
                        >
                          Position
                        </label>
                        <input
                          className={`w-full mt-1 px-3 py-3 text-base font-normal text-gray-900  border  border-gray-200      outline-none focus:border-gray-300  focus:shadow-sm rounded-md`}
                          id="position"
                          name="position"
                          type="text"
                          autoComplete="off"
                          required
                          value={position}
                          onChange={onPositionChanged}
                        />
                      </div>

                      <div className="">
                        <label
                          htmlFor="country"
                          className="block text-base text-gray-500"
                        >
                          Roles
                        </label>
                        <select
                          id="roles"
                          name="roles"
                          value={roles}
                          onChange={(e) => setRoles(e.target.value)}
                          className="mt-1 block w-full py-2 px-2 text-base font-normal text-gray-900  border  border-gray-200      outline-none focus:border-gray-300  focus:shadow-sm rounded-md"
                        >
                          {options}
                        </select>
                      </div>
                    </div>


                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <div className="">
                      <label
                        htmlFor="username"
                        className="block text-base text-gray-500"
                      >
                        Username{" "}
                        <span className="nowrap text-[11px] text-red-600 ">
                          {!validUsername ? "3-20 letters" : ""}
                        </span>
                      </label>

                      <input
                        className={` w-full sm:w-1/2 mt-1 px-3 py-3 text-base font-normal  border  border-gray-200      outline-none focus:border-gray-300  focus:shadow-sm rounded-md ${validUserClass}`}
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="off"
                        value={username}
                        onChange={onUsernameChanged}
                      />
                    </div>

                    <div className="mt-3">
                      <label
                        className="mt-2 block text-base text-gray-500"
                        htmlFor="password"
                      >
                        Password{" "}
                        <span className="nowrap text-xs text-red-600 ">
                          {!validPassword
                            ? "[empty = no change] 4-12 characters including !@#$%"
                            : ""}
                        </span>
                      </label>
                      <div className="relative  w-full sm:w-1/2">
                        <div className="absolute inset-y-0 right-0 flex items-center px-2">
                          <input
                            className="hidden js-password-toggle"
                            id="toggle"
                            type="checkbox"
                            onClick={togglePasswordVisiblity}
                          />
                          <label
                            className=" bg-white hover:bg-slate-100  rounded-xl px-2 py-1 mt-1 text-lg text-gray-600 font-mono cursor-pointer js-password-label"
                            htmlFor="toggle"
                          >
                            {passwordShown ? (
                              <AiOutlineEye />
                            ) : (
                              <AiOutlineEyeInvisible />
                            )}
                          </label>
                        </div>
                        <input
                          className={`leading-tight w-full mt-1 px-3 py-3 text-base font-normal border  border-gray-200      outline-none focus:border-gray-300  focus:shadow-sm rounded-md ${validPwdClass}`}
                          id="password"
                          name="password"
                          type={passwordShown ? "text" : "password"}
                          value={password}
                          autoComplete="off"
                          placeholder="Enter password"
                          onChange={onPasswordChanged}
                        />
                      </div>
                    </div>
                    {id !== user._id

                      && <CheckboxField label="User active/inactive " checked={active} onChange={onActiveChanged} />

                    }
                  </div>
                </div>
                {isDelLoading || isLoading
                  ?
                  <div className="mt-6 flex text-gray-400 justify-end">
                    <Spenner />
                    <p>{spinText} </p>
                  </div>
                  : null
                }

              </div>

              {/*footer big screen  */}
              <div className={`hidden sm:flex  justify-between text-sm bg-gray-50 px-4 py-3 text-right sm:px-6 ${btnClass}`}>
                {id !== user._id
                  && <span
                    className={
                      !isLoading || isDelLoading
                        ? `cursor-pointer flex  px-3 sm:px-6 py-3 text-red-700 border border-red-300  hover:bg-gray-200  rounded-full`
                        : "flex  px-3 sm:px-6 py-3 text-white border border-gray-200 bg-gray-400 hover:bg-gray-400   rounded-full"
                    }
                    title="Delete User"
                    disabled={!isLoading || !isDelLoading}
                    onClick={handleModalOpen}
                  >
                    <AiOutlineUserDelete size={20} className='mr-1 sm:mr-2' />
                    Delete
                  </span>
                }

                <div className="flex items-center gap-5">
                  <div>
                    <span
                      title="Cancel"
                      disabled={!isLoading && !isDelLoading}
                      onClick={() => !isLoading && !isDelLoading ? navigate("/settings/users") : undefined}
                      className={
                        !isLoading && !isDelLoading
                          ? `cursor-pointer flex px-6 py-3 text-black border border-gray-300   hover:bg-gray-200   rounded-full`
                          : `flex px-6 py-3 text-white border border-gray-200 bg-gray-400 hover:bg-gray-400   rounded-full`
                      } >
                      <BsArrowLeftShort size={20} className='mr-1 sm:mr-2' />
                      Cancel
                    </span>
                  </div>

                  <span
                    title="Save"
                    disabled={!canSave}
                    onClick={canSave && !isDelLoading ? onSaveUserClicked : undefined}
                    className={
                      canSave && !isDelLoading
                        ? `cursor-pointer flex px-3 sm:px-6 py-3 text-white border border-gray-200 bg-black  hover:bg-gray-700   rounded-full`
                        : `flex px-3 sm:px-6 py-3 text-white border border-gray-200 bg-gray-400 hover:bg-gray-400   rounded-full`
                    }
                  >
                    <AiOutlineSave size={20} className="mr-1 sm:mr-2" />
                    Update
                  </span>
                </div>
              </div>

              {/*footer mobile screen */}
              <div className={`flex gap-2  flex-col sm:flex-row sm:hidden  sm:justify-end text-sm bg-gray-50 px-4 py-3 text-center sm:px-6 ${btnClass}`}>

                <div
                  title="Cancel"
                  disabled={!isLoading && !isDelLoading}
                  onClick={() => !isLoading && !isDelLoading ? navigate("/settings") : undefined}
                  className={
                    ` ${!isLoading && !isDelLoading
                      ? `cursor-pointer  text-black border border-gray-300   hover:bg-gray-200 `
                      : `  text-white border border-gray-200 bg-gray-400 hover:bg-gray-400 `
                    }   rounded-full flex px-6 py-3  justify-center`} >
                  <BsArrowLeftShort size={20} className='mr-1 sm:mr-2' />
                  Cancel
                </div>

                <div
                  title="Save"
                  onClick={!isDelLoading ? onSaveUserClicked : undefined}
                  className={`${!isDelLoading
                    ? `cursor-pointer flex px-3 sm:px-6 py-3 text-white border border-gray-200 bg-black  hover:bg-gray-700 `
                    : ` text-white border border-gray-200 bg-gray-400 hover:bg-gray-400 `
                    } flex items-center justify-center  px-3 sm:px-4 py-2   rounded-full `}
                >
                  <AiOutlineSave size={20} className="mr-1 sm:mr-2" />
                  Update
                </div>

                {id !== user._id
                  && <span
                    className={
                      `${!isLoading || isDelLoading
                        ? `cursor-pointer   text-red-700  border-red-300  hover:bg-gray-200  `
                        : " text-white  border-gray-200 bg-gray-400 hover:bg-gray-400  "
                      }flex justify-center px-3 mt-5 sm:px-6 py-3 border rounded-full `}
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

const CheckboxField = ({ label, checked, onChange }) => (
  <div className="mt-10 space-y-4">
    <label className="block text-base text-gray-500">{label}</label>
    <div className="mt-4">
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
        <div className="w-[33px] h-[18px] bg-red-200 flex-nowrap peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] sm:after:top-[5px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-green-600"></div>
        <span className={`${checked ? 'text-green-700' : 'text-red-700'} ml-3 text-xs sm:text-base `}>{checked ? 'Active' : 'Inactive'}</span>
      </label>
    </div>
  </div>
);

export default EditUserForm;
