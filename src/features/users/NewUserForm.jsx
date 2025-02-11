import { useEffect, useState } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../config/roles";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineSave } from "react-icons/ai";
import Image from "../../components/Image";
import Spenner from "../../components/Spinner";
import { BsArrowLeftShort } from 'react-icons/bs';
import { toast } from 'react-toastify';
import iconPicture from "../../assets/icon-item.svg";
import useActivityLogger from "../../hooks/useActivityLogger";
import useAuth from "../../hooks/useAuth";



const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {

  const { log } = useActivityLogger();
  const { name: userName } = useAuth()
  const [btnCancel, setBtnCancel] = useState(false)

  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  const [name, setName] = useState("")
  const [position, setPosition] = useState("")
  const [username, setUsername] = useState("")
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false)
  const [roles, setRoles] = useState("")
  const [imageView, setImage] = useState("")
  const [image, setDataImage] = useState()
  const [passwordShown, setPasswordShown] = useState(false)



  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true)
  };

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setName("")
      setPosition("")
      setUsername("")
      setPassword("")
      setRoles("")
      setImage("")
      setDataImage()
      navigate("/settings/users")
    }
  }, [isSuccess, navigate]);

  const onNameChanged = (e) => setName(e.target.value)
  const onPositionChanged = (e) => setPosition(e.target.value)
  const onUsernameChanged = (e) => setUsername(e.target.value)
  const onRolesChanged = (e) => setRoles(e.target.value)
  const onPasswordChanged = (e) => setPassword(e.target.value)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setDataImage(reader.result);
    };
    reader.readAsDataURL(file);
  };


  const canSave =
    [roles, name, validUsername, validPassword, image].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault()


    if (canSave) {
      const result = await addNewUser({ name, position, username, password, roles, image })
      if (result?.error) {
        toast.error(result.error.error, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })

      } else {
        toast.success(result.data.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
        log(`ADDED USER`, `${userName} added new user ${name}`)

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


  const validUserClass = !validUsername
    ? "text-red-600 dark:text-red-600"
    : "text-blue-700 dark:text-blue-400";
  const validPwdClass = !validPassword
    ? "text-red-600 dark:text-red-600"
    : "text-blue-700 dark:text-blue-400";

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 ">
        <h1 className="mb-2 text-xl font-semibold  text-gray-500 sm:text-2xl">
          New User
        </h1>
        <p className="text-red-700 sm:text-xl">{error?.data?.message}</p>

        <div className="mt-5 md:col-span-2">
          <form onSubmit={onSaveUserClicked} >
            <div className="shadow overflow-hidden rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-10">
                <div className="grid grid-cols-2 gap-20">
                  <div className="col-span-2 sm:col-span-1 ">
                    <div className="">
                      <ImageUploadField imageView={imageView} onChange={handleImageChange} />
                    </div>
                    <div className="mt-10">
                      <label
                        className="block text-base text-gray-500"
                        htmlFor="name"
                      >
                        Name
                      </label>
                      <input
                        className={`w-full mt-1 px-3 py-3 text-base font-normal text-gray-900 border  border-gray-200  outline-none focus:border-gray-300  focus:shadow-sm rounded-md`}
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="off"
                        required
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
                          className={`w-full mt-1 px-3 py-3 text-base font-normal text-gray-900 border  border-gray-200  outline-none focus:border-gray-300  focus:shadow-sm rounded-md`}
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
                          className="block text-base  text-gray-500"
                        >
                          Roles
                        </label>
                        <select
                          id="roles"
                          name="roles"
                          value={roles}
                          onChange={onRolesChanged}
                          className="mt-1 block w-full py-3 px-3 text-base font-normal text-gray-900 border  border-gray-200  outline-none focus:border-gray-300  focus:shadow-sm rounded-md"
                        >
                          <option defaultValue value={""}>
                            ---
                          </option>
                          {options}
                        </select>
                      </div>
                    </div>

                  </div>
                  <div className=" col-span-2 sm:col-span-1">
                    <div className="">
                      <label
                        htmlFor="username"
                        className={`block text-sm font-base text-gray-500`}
                      >
                        Username{" "}
                        <span className="nowrap text-[11px] text-red-600">
                          {!validUsername ? "3-20 letters" : ""}
                        </span>
                      </label>

                      <input
                        className={` w-full sm:w-1/2 mt-1 px-3 py-3 text-base font-normal  border  border-gray-200  outline-none focus:border-gray-300  focus:shadow-sm rounded-md ${validUserClass}`}
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="false"
                        value={username}
                        onChange={onUsernameChanged}
                      />
                    </div>

                    <div className="mt-5">
                      <label
                        className="mt-2 block text-base  text-gray-500"
                        htmlFor="password"
                      >
                        Password{" "}
                        <span className="nowrap text-xs text-red-600 font-normal">
                          {!validPassword
                            ? "4-12 characters including !@#$%"
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
                            className=" bg-white hover:bg-slate-1 rounded-xl px-2 py-1 mt-1 text-lg text-gray-600 font-mono cursor-pointer js-password-label"
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
                          className={`leading-tight w-full mt-1 px-3 py-3 text-base font-normal border  border-gray-200  outline-none focus:border-gray-300  focus:shadow-sm rounded-md ${validPwdClass}`}
                          id="password"
                          name="password"
                          type={passwordShown ? "text" : "password"}
                          value={password}
                          autoComplete="off"
                          required
                          onChange={onPasswordChanged}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {isLoading &&
                  <div className="mt-6 flex text-gray-400 justify-end">
                    <Spenner />
                    <p>Saving.... </p>
                  </div>
                }
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3 text-base justify-end bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  title="Cancel"
                  onClick={() => !btnCancel && navigate("/settings/users")}
                  className={
                    `${!btnCancel
                      ? `cursor-pointer text-black border-gray-400 hover:bg-gray-200 `
                      : ` text-black border-gray-200 bg-gray-400 hover:bg-gray-400 `
                    }flex justify-center px-6 py-2 rounded-full border`} >
                  <BsArrowLeftShort size={20} className='mr-2' />
                  Cancel
                </button>

                <button
                  title="Save"
                  onClick={() => setBtnCancel(!btnCancel)}
                  disabled={!canSave}
                  type="submit"
                  className={
                    `${canSave
                      ? `cursor-pointer flex border-gray-400 bg-black  hover:bg-gray-700`
                      : ` border-gray-200 bg-gray-400 hover:bg-gray-400`
                    } flex justify-center items-center px-3 sm:px-7 py-2 text-white border  rounded-full`}
                >
                  <AiOutlineSave size={20} className="mr-2" />
                  Save
                </button>
              </div>

            </div>
          </form>
          {/* <AddTableRow /> */}
        </div>
      </div>
    </>
  );
};

const ImageUploadField = ({ imageView, onChange }) => (
  <div className="">
    <div className="mt-1 flex flex-col gap-4 sm:gap-0 sm:flex-row items-center">
      <div className="flex flex-col items-center gap-1">
        <label className="block text-base text-center sm:text-left text-gray-500">User Photo</label>
        {imageView ? (
          <div>
            <Image data={imageView} size="h-40 w-40" rounded="rounded-full" />
          </div>
        ) : (
          <span className="inline-block h-40 w-40 overflow-hidden rounded-full ">
            <img src={iconPicture} className="h-40 w-40" />
          </span>
        )}

      </div>
      <label
        htmlFor="file-upload"
        className="sm:ml-5 cursor-pointer border text-[10px] px-4 py-2 text-black borde font-medium border-gray-300 hover:bg-gray-200 rounded-full duration-150"
      >
        <span className="whitespace-nowrap">Upload Photo</span>
        <input id="file-upload" name="image" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={onChange} />
      </label>
      <p className="text-xs text-gray-500 ml-3">JPG, JPEG, PNG up to 10MB</p>
    </div>
  </div>
);

export default NewUserForm;
