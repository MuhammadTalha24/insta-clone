import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import RightSideBar from './RightSideBar'

const MainLayout = () => {
    return (
        <>
            <div className="flex h-screen">

                <div className="w-[15%] bg-gray-100 p-4">
                    <h1 className='my-6 font-bold text-3xl'>Instagram</h1>
                    <Sidebar />
                </div>

                {/* Main Content Section */}
                <div className="w-[60%] p-6 overflow-y-auto">
                    <Outlet />
                </div>

                <div className="w-[25%] p-4">
                    <RightSideBar />
                </div>
            </div>
        </>
    )
}

export default MainLayout
