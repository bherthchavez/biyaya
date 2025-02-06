import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"
import PageLoader from "../../components/PageLoader"
import { BiErrorCircle } from "react-icons/bi";

const PersistLogin = () => {

    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode

            const verifyRefreshToken = async () => {
                //    console.log('verifying refresh token', process.env.NODE_ENV)
                try {
                    //const response = 
                    await refresh()
                    //const { accessToken } = response.data
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }
            if (!token && persist) verifyRefreshToken()
        }

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [])


    let content
    if (!persist) { // persist: no
        //    console.log('no persist')
        content = <Outlet />
    } else if (isLoading) { //persist: yes, token: no
        //    console.log('loading')
        content = <PageLoader />
    } else if (isError) { //persist: yes, token: no
        console.log('error')
        content = (

            <div className="flex items-center justify-center h-screen p-5 bg-gray-100 text-gray-700 min-w-screen">
                <div className="text-gray-900 flex flex-col items-center">
                    <div className="flex justify-center items-center">

                        <BiErrorCircle className="text-2xl mr-2" />
                        <p className="text-lg">
                            {error.data?.message}
                        </p>
                    </div>
                    <Link to="/">
                        <p className="mt-6 text-sm px-4 py-2 text-white border font-normal border-gray-200 bg-black hover:bg-gray-700 rounded-full duration-150">
                            Please Login Again</p>
                    </Link>
                </div>
            </div>

        )
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        content = <Outlet />
    } else if (token && isUninitialized) { //persist: yes, token: yes
        //    console.log('token and uninit')
        //    console.log(isUninitialized)
        content = <Outlet />
    }

    return content
}
export default PersistLogin