/* eslint-disable jsx-a11y/anchor-is-valid */
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import useAuth from "../hooks/useAuth";
import { IoNotificationsOutline } from "react-icons/io5";
import { useGetLogsQuery, useUpdateLogMutation } from "../features/UserLogs/logsApiSlice";
import PageError from "./PageError";
import LogsComponent from "./LogsComponent";
import { useGetActivitiesQuery, useUpdateActivityMutation } from "../features/UserLogs/activitiesApiSlice";
import ReceiptModal from "./ReceiptModal"
import { POSContext } from "../context/POSContext";
import ActivitiesComponent from "./ActivitiesComponent";

const DashHeader = ({ headerName }) => {

  const { headSearch, setHeadSearch } = useContext(POSContext);
  const navigate = useNavigate();
  const [userNav, setUserNav] = useState(false);
  const [notif, setNotif] = useState(false);
  const [notifAdmin, setNotifAdmin] = useState(false);
  const [logTab, setLogTab] = useState("activity");
  const { id, isAdmin, name, position, avatar, dev } = useAuth();
  const menuRef = useRef();
  const notifRef = useRef();

  const [orderId, setOderID] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = (id) => {
    setOderID(id)
    setIsModalOpen(true)
  }


  const handleModalClose = () => {
    setIsModalOpen(false)
  }


  const {
    data: LogsData,
    isLoading: isLoadingLogs,
    isSuccess: isLogsSuccess,
    isError: isLogsError,
    error: logsError,
  } = useGetLogsQuery("logsList", {
    pollingInterval: 10000, // refresh data every 10 seconds
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });


  const {
    data: ActivitiesData,
    isLoading: isLoadingActivities,
    isSuccess: isActivitiesSuccess,
    isError: isActivitiesError,
    error: activitiesError,
  } = useGetActivitiesQuery("activitiesList", {
    pollingInterval: 10000, // refresh data every 10 seconds
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [updateLog, { isLoading: isLoadingLog, isSuccess: isSuccessLog, isError: isErrorLog, error: errorLog }] =
    useUpdateLogMutation();

  const [updateActivity, { isLoading: isLoadingActivity, isSuccess: isSuccessActivity, isError: isErrorActivity, error: errorActivity }] =
    useUpdateActivityMutation();


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserNav(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotif(false)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleSettingsClick = () => {
    navigate(`/settings/${id}`);
    setUserNav(!userNav);
  };

  const getHeaderName = useCallback(() => {
    switch (headerName) {
      case '/dashboard':
        return 'Dashboard';
      case '/inventory':
        return 'Inventory';
      case '/orders':
        return 'Orders';
      case '/pos':
        return 'POS';
      case '/reports':
        return 'Reports';
      default:
        return 'Settings';
    }
  }, [headerName]);

  const onUpdateLog = async (log) => {
    const handleLogUpdate = async (id, seen) => {
      try {
        await updateLog({ id, seen });
        if (dev) alert(JSON.stringify(log, null, 2));
      } catch (error) {
        console.error('Failed to update log:', error);
      }
    };

    const handleActivityTab = async () => {
      if (!log.seen) {
        await updateActivity({ id: log.id, seen: log.seen });
      }

      if (log?.orderID) {
        handleModalOpen(log?.orderID);
        setNotif(prev => !prev);
      }
    };

    const handleLastViewedTab = async () => {
      if (log.seen && dev) {
        alert(JSON.stringify(log, null, 2));
      } else if (!log.seen) {
        await handleLogUpdate(log.id, log.seen);
      }
    };

    switch (logTab) {
      case 'activity':
        await handleActivityTab();
        break;
      case 'lastViewed':
        await handleLastViewedTab();
        break;
      default:
        console.warn('Unhandled log tab:', logTab);
    }
  };



  if (isLoadingLogs || isLoadingActivities) return (
    <div className={`bg-white sm:px-8 border border-gray-200 flex  h-20 sm:h-32 items-center justify-between px-4 right-0`}>
      <div className="flex items-center">
        <p className="flex">
          <span className="sr-only">Logo</span>
          <span className="inline-block text-gray-700 text-2xl sm:text-3xl font-semibold">
            {getHeaderName()}
          </span>
        </p>
      </div>

      <div className="flex items-center justify-end">
        <nav aria-label="Site Nav" className="hidden lg:flex lg:gap-4  lg:text-gray-300" />
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center divide-x divide-gray-100 border-gray-200">

            <div className="flex gap-4">

              <div className="inline-flex bg-white rounded-full" ref={menuRef}>

                <div className="relative">
                  <button
                    onClick={() => setUserNav(!userNav)}
                    type="button"
                    className="group flex shrink-0 items-center rounded-lg transition"
                  >
                    <span className="sr-only">Menu</span>

                    <img
                      alt="Profile"
                      src={avatar}
                      className="h-12 w-12 sm:h-13 sm:w-13 rounded-full object-cover border border-slate-300"
                    />
                    <div className="ml-1 sm:mr-2 hidden sm:flex flex-col tracking-wide text-left">
                      <h1 className="font-medium text-xs sm:text-md text-gray-800 capitalize">
                        {name}
                      </h1>
                      <p className="text-gray-400 font-light text-[10px] sm:text-sm">{position}</p>
                    </div>
                    {isAdmin && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`mx-2 hidden h-5 w-5 text-gray-500 transition group-hover:text-gray-700 sm:block ${userNav && "rotate-180"}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                  {isAdmin && userNav && (
                    <div className="absolute right-0 z-50 origin-top-right bg-white border border-gray-200 mt-2 w-48 rounded-md shadow-lg">
                      <div className="block top-[-7px] bg-white h-3 w-3 border-t border-l rotate-45 absolute right-3"></div>

                      <div className="py-2">
                        <span
                          onClick={handleSettingsClick}
                          className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          Account Setting
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  if (isLogsError || isActivitiesError) return <PageError error={logsError?.data?.message} />

  if (isLogsSuccess && isActivitiesSuccess) {

    const { entities: logsEntities } = LogsData;
    const { entities: activitiesEntities } = ActivitiesData;

    const logs = Object.values(logsEntities).sort((a, b) => new Date(b.date) - new Date(a.date))
    const activities = Object.values(activitiesEntities).sort((a, b) => new Date(b.date) - new Date(a.date))
    const hasSeen = logs.some(log => log?.seen === false) || activities.some(activity => activity?.seen === false);

    const renderLogComponent = logTab === 'lastViewed'
      ? <LogsComponent logs={logs} onUpdateLog={onUpdateLog} />
      : <ActivitiesComponent logs={activities} onUpdateLog={onUpdateLog} />;

    return (
      <>
        <ReceiptModal isOpen={isModalOpen} onClose={handleModalClose} orderId={orderId} />

        <div className={`bg-white  no-print sm:px-8 border  border-gray-200 flex z-30 sticky top-0 w-full ease-in-out duration-300 h-20 lg:h-32 items-center justify-between px-4 `}>
          <div className="flex items-center">
            <p className="flex">
              <span className="sr-only">Logo</span>
              <span className="inline-block text-gray-700 text-2xl lg:text-3xl font-semibold">
                {getHeaderName()}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-end">
            <nav aria-label="Site Nav" className="hidden lg:flex lg:gap-4  lg:text-gray-300" />

            <div className="flex justify-between items-center gap-2">


              {/* <div className="relative hidden sm:block">
                <label className="sr-only" htmlFor="search">
               
                  {" "}
                  Search{" "}
                </label>
                <button
                  type="button"
                  className="absolute top-1/2 left-1 -translate-y-1/2 rounded-full   p-2 text-gray-400 transition hover:text-gray-700"
                >
                  <span className="sr-only">Submit Search</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
                </button>
                <input
                  className="h-10 w-full outline-none border border-gray-300  rounded-full border-none bg-gray-100 pl-11 pr-2 text-sm shadow-sm sm:w-56"
                  id="search"
                  type="search"
                  placeholder="Search..."
                  value={headSearch}
                  onChange={(e)=> setHeadSearch(e.target.value)}
                />

               
              </div> */}
              {/* <span
                type="button"
                className="block shrink-0 rounded-lg bg-white p-2.5 text-gray-600 shadow-sm hover:text-gray-700 sm:hidden"
              >
                <span className="sr-only">Search</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
              </span> */}

              <div className="relative">
                <div
                  onClick={() => setNotif(prev => !prev)}

                  className="flex cursor-pointer items-center relative rounded-lg border border-gray-100 p-2 text-gray-800  hover:text-gray-700"
                >
                  <span className="sr-only">Notifications</span>
                  {hasSeen &&
                    <div className="absolute top-1 right-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    </div>
                  }
                  <span>
                    <IoNotificationsOutline size={20} />
                  </span>
                </div>
                {notif &&
                  <div ref={notifRef} className="absolute right-[-60px] sm:right-0 z-50 origin-top-right bg-white border border-gray-200 mt-2 w-auto rounded-md shadow-lg">
                    <div className="pt-3 px-4  flex ">
                      <div onClick={() => setLogTab(prev => prev = "activity")}
                        className={`${logTab === `activity` ? `bg-white border-t border-l border-r border-gray-200` : `bg-gray-100 border border-gray-200 hover:bg-gray-50`} px-5 py-2 rounded-t-xl cursor-pointer`}>
                        Activity
                      </div>
                      {isAdmin &&
                        <div onClick={() => setLogTab(prev => prev = "lastViewed")}
                          className={`${logTab === `lastViewed` ? `bg-white border-t border-l border-r border-gray-200` : `bg-gray-100 border border-gray-200 hover:bg-gray-50`} px-5 py-2  rounded-t-xl cursor-pointer`}>
                          Last viewed
                        </div>
                      }
                    </div>
                    <div className="block -top-[7px] bg-white h-3 w-3 border-t border-l border-gray-200 rotate-45 absolute right-[71px] sm:right-3 "></div>

                    <div className="w-[20rem]  sm:w-[25rem] z-50 border border-gray-200 rounded-b-md">
                      {renderLogComponent}
                    </div>
                  </div>
                }
              </div>
              <div className="flex items-center  rounded-full   divide-x divide-gray-100 ">
                <div className="flex gap-4">

                  <div className="inline-flex bg-white  rounded-full"
                    ref={menuRef}>

                    <div className="relative">
                      <button
                        onClick={() => setUserNav(!userNav)}
                        type="button"
                        className="group flex shrink-0 items-center rounded-lg transition"
                      >
                        <span className="sr-only">Menu</span>

                        <img
                          alt="Profile"
                          src={avatar}
                          className="h-12 w-12 sm:h-13 sm:w-13 rounded-full object-cover border border-slate-300 "
                        />
                        <div className="ml-1 sm:mr-2 hidden sm:flex flex-col tracking-wide text-left">
                          <h1 className="font-medium text-xs sm:text-md text-gray-800 capitalize">
                            {name}
                          </h1>
                          <p className="text-gray-400 font-light text-[10px] sm:text-sm">{position}</p>
                        </div>
                        {isAdmin && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`mx-2 hidden h-5 w-5 text-gray-500 transition group-hover:text-gray-700 sm:block ${userNav && "rotate-180"}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      {isAdmin && userNav && (
                        <div className="absolute right-0 z-50 origin-top-right bg-white border border-gray-200 mt-2 w-48 rounded-md shadow-lg">
                          <div className="block top-[-7px] bg-white h-3 w-3 border-t border-l border-gray-200 rotate-45 absolute right-3"></div>

                          <div className="py-2">
                            <span
                              onClick={handleSettingsClick}
                              className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              Account Setting
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </>
    );
  }



};

export default DashHeader;
