/* eslint-disable jsx-a11y/anchor-is-valid */
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import biyayaLogo from "../../assets/biyaya_logo.png";
import biyayaShop from "../../assets/biyaya_shop.png";
import biyayaSmile from "../../assets/biyaya_smile.jpg";
import biyayaSmile2 from "../../assets/biyaya_smile2.jpg";
import { FaRegUser } from "react-icons/fa";
import { motion as m } from "framer-motion"
import Carousel from "../../components/Carousel";
import { motion } from "framer-motion";
import { RiCupFill } from "react-icons/ri";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };


  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dashboard");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const errClass = errMsg ? "list-disc mt-8 text-red-600 text-xs tracking-wide" : null;

  let slides = [
    biyayaSmile,
    biyayaSmile2,
    biyayaShop,
  ];

  if (isLoading) return (
    <div className="bg-white h-screen">
      <div className="lg:grid lg:grid-cols-12 lg:min-h-screen">
        {/* Left Section - Carousel & Branding */}
        <div ref={userRef} className="relative flex h-48 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <Carousel slides={slides} />
          <div className="hidden lg:absolute lg:block lg:p-12 text-white">
            <img alt="Logo" src={biyayaLogo} className="h-32 sm:h-32" />
            <h2 className="mt-6 text-2xl font-bold sm:text-3xl md:text-4xl">
              Welcome to Biyaya 🍵
            </h2>
            <p className="mt-4 leading-relaxed text-white/90">
              Welcome to our cozy coffee haven! Whether you're here for your daily brew or a relaxing escape, we're delighted to serve you.
            </p>
          </div>
        </div>

        {/* Right Section - Login & Animation */}
        <div className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="flex flex-col max-w-xl lg:max-w-3xl w-full">
            {/* Mobile Logo & Title */}
            <div className="relative -mt-16 block lg:hidden text-center">
              <div className="inline-flex size-28 items-center justify-center rounded-full bg-white sm:size-20">
                <img alt="Logo" src={biyayaLogo} className="h-20" />
              </div>
              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome to Biyaya 🍵
              </h1>
            </div>

            {/* Animation & Loading Text */}
            <div className="flex flex-col items-center bg-white px-10 py-8 sm:py-10 sm:px-28 ease-in-out duration-300">
              <motion.div
                className="relative flex flex-col items-center mt-20 sm:mt-0"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Steam Animation */}
                <div className="absolute top-[-40px] flex space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-10 bg-gray-900 rounded-full"
                      animate={{ y: [-10, -30, -10], opacity: [0.2, 1, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
                <RiCupFill size={90} className="text-gray-800" />
              </motion.div>
              <div className='m-auto text-lg text-black'>Logging in ...</div>
            </div>

            {/* Footer */}
            <div className="flex mx-auto gap-2 mt-16 text-gray-600 text-xs font-thin">
              <p>Designed and developed by:</p>
              <a
                href='https://julbertpruel.netlify.app/'
                target='_blank'
                rel='noreferrer noopener'
                className="font-normal text-black"
              >
                Julbert Pruel
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>


  )


  const content = (
    <>
      <div className="bg-white ">
        <div className="lg:grid h-screen lg:grid-cols-12">
          <div className="relative flex h-48 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
            <Carousel slides={slides} />
            <div className="hidden lg:relative lg:block lg:p-12">
              <div className="block text-white">
                <span className="sr-only">Home</span>

                <img
                  alt="Logo"
                  src={biyayaLogo}
                  className="h-32 sm:h-32"
                />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Welcome to Biyaya 🍵
              </h2>

              <p className="mt-4 leading-relaxed text-white/90">
                Welcome to our cozy coffee haven! Whether you're here for your daily brew or a relaxing escape, we're delighted to serve you.
              </p>
            </div>
          </div>

          <div
            className="flex  items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
          >
            <div className="flex flex-col  max-w-xl lg:max-w-3xl">
              <div className="relative -mt-16 block lg:hidden">
                <div
                  className="inline-flex size-28 items-center justify-center rounded-full bg-white sm:size-20"

                >
                  <span className="sr-only">Home</span>
                  <img
                    alt="Logo"
                    src={biyayaLogo}

                  />
                </div>

                <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                  Welcome to Biyaya 🍵
                </h1>
              </div>
              <form onSubmit={handleSubmit} className=" space-y-7">
                <div className=" space-y-2 sm:text-center">

                  <h3 className="text-black hidden sm:block text-xl font-bold tracking-widest font-sans">
                    LOGIN
                  </h3>
                  <p
                    className="text-black text-base font-thin text-left pt-5">
                    Enter your login information to access the system.
                  </p>
                </div>

                <ul className="list-inside">
                  <li ref={errRef} className={errClass} aria-live="assertive">
                    {errMsg}
                  </li>
                </ul>

                <div className="relative">
                  <label
                    htmlFor="UserEmail"
                    className="block overflow-hidden bg-white rounded-lg border border-gray-400 px-3 pb-2 pt-1 "
                  >
                    <span className="text-xs font-light tracking-wider text-gray-700"> Username: </span>

                    <input
                      type="text"
                      id="username"
                      ref={userRef}
                      value={username}
                      onChange={handleUserInput}
                      autoComplete="current-password"
                      required={true}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-lg"
                    />
                    <div className="absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-400 text-lg">

                      <FaRegUser size={20} className="mr-2" />

                    </div>


                  </label>
                </div>

                <div className="relative">
                  <label
                    htmlFor="UserEmail"
                    className="block overflow-hidden bg-white rounded-lg  px-3 pb-2 pt-1 border border-gray-400"
                  >
                    <span className="text-xs font-light tracking-wider text-gray-700"> Password: </span>

                    <input
                      type={passwordShown ? "text" : "password"}
                      id="password"
                      onChange={handlePwdInput}
                      value={password}
                      autoComplete="off"
                      required
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-lg"
                    />
                    <span className="absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-300 text-lg">

                      <div className="absolute inset-y-0 right-0 flex items-center px-2">
                        <input
                          className="hidden js-password-toggle"
                          id="toggle"
                          type="checkbox"
                          onClick={togglePasswordVisiblity}
                        />
                        <label
                          className={`bg-white hover:bg-slate-100 rounded-xl px-2 py-1 mt-1 text-lg text-gray-400 font-mono cursor-pointer js-password-label`}
                          htmlFor="toggle"
                        >
                          {passwordShown ? (
                            <AiOutlineEye size={20} />
                          ) : (
                            <AiOutlineEyeInvisible size={20} />
                          )}
                        </label>
                      </div>
                    </span>


                  </label>
                </div>


                <div className="pb-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={persist} onChange={handleToggle} />
                    <div className="w-[33px] h-[18px] bg-gray-200 flex-nowrap peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-gray-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700"> Trust this device</span>
                  </label>
                </div>

                <button
                  className="w-full px-4 py-3 cursor-pointer font-sans text-white bg-[#1E1E1E] hover:bg-slate-700 active:bg-slate-800 rounded-full duration-150">
                  LOGIN
                </button>


              </form>

              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.75, ease: "easeIn" }}
                className="flex  justify-center  gap-2 mt-20">
                <p className="text-xs font-thin text-gray-500">Designed and developed by: </p>

                <a href='https://julbertpruel.netlify.app/'
                  target='_blank' rel='noreferrer noopener'
                  className=" font-normal text-xs text-gray-600"
                >
                  Julbert Pruel
                </a>
              </m.div>
            </div>

          </div>
        </div >
      </div >


    </>



  );
  return content;
};

export default Login;