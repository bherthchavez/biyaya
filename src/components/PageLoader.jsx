import React from 'react'
import biyayaLogo from "../assets/biyaya_logo.png";

const pageLoader = () => {
    return (
        <div className="w-full  flex flex-col items-center justify-start mt-20">
            <div className=" overflow-x-auto border-gray-400 rounded-2xl overflow-hidden">
                <div className="flex flex-col items-center px-10 py-8 sm:py-10 sm:px-28">
                    <img src={biyayaLogo} className='animate-bounce  h-[80px] xl:h-[110px] mx-auto ' />
                    <div className="flex space-x-2 animate-pulse">
                        <div className='m-auto text-sm sm:text-lg text-gray-700'>Loading ...</div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center text-center items-center gap-2 mt-16">
                        <p className="text-xs font-thin text-gray-400">Designed and developed by: </p>

                        <a href='https://julbertpruel.netlify.app/'
                            target='_blank' rel='noreferrer noopener'
                            className=" font-normal text-xs text-gray-400"
                        >
                            Julbert Pruel
                        </a>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default pageLoader