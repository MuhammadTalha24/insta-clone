import React from 'react'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Sidebar = () => {
    const navigate = useNavigate()
    const sideBarItems = [
        { icon: <Home />, name: "Home" },
        { icon: <Search />, name: "Search" },
        { icon: <TrendingUp />, name: "Explore" },
        { icon: <MessageCircle />, name: "Messages" },
        { icon: <Heart />, name: "Notifications" },
        { icon: <PlusSquare />, name: "Create" },
        {
            icon: (<Avatar className='w-8 h-8'>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>), name: "Profile"
        },
        { icon: <LogOut />, name: "Logout" }

    ]
    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/v1/user/logout', { withCredentials: true })
            if (res.data.success) {
                toast.success(res.data.message)
                navigate('/login')
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const setEventHandler = (type) => {
        if (type === 'Logout') {
            logoutHandler()
        }
    }
    return (


        <div className='flex flex-col gap-4'>{
            sideBarItems.map((item, index) => {
                return (
                    <div onClick={() => setEventHandler(item.name)} className='flex items-center hover:bg-black transition-colors hover:text-white cursor-pointer p-3 rounded-lg  gap-3' key={index}>
                        {item.icon}
                        <span>{item.name}</span>
                    </div>
                )
            })
        }</div>
    )
}

export default Sidebar