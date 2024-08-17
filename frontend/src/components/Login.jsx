import React, { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { toast } from "sonner"
import { Link, useNavigate } from 'react-router-dom'



const Login = () => {
    const navigate = useNavigate()
    const [formdata, setFormData] = useState({

        email: "",
        password: "",
    })
    const [isLoading, setisLoading] = useState(false)

    const submitHandler = (e) => {
        setFormData({ ...formdata, [e.target.name]: e.target.value })
    }
    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(formdata)
        try {
            setisLoading(true)
            const res = await axios.post('http://localhost:8080/api/v1/user/login', formdata, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            })
            if (res.data.success) {
                toast.success(res.data.message)
                setisLoading(false)
                setFormData({
                    email: '',
                    password: '',
                })
                navigate('/')
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('An unexpected error occurred')
            }

        } finally {
            setisLoading(false)
        }
    }
    return (
        <>
            <div className='flex w-screen h-screen justify-center items-center'>
                <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                    <div className='my-4 flex flex-col items-center'>
                        <h1 className='text-4xl font-bold'>Instagram</h1>
                        <p className='text-[18px] mx-5  mt-5'>Login Up To See Photos & Videos From Your Friends</p>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <Label htmlFor='username'>Email</Label>
                        <Input type='email' value={formdata.email} name='email' onChange={submitHandler} />
                    </div>
                    <div className='flex flex-col gap-3'>
                        <Label htmlFor='username'>Password</Label>
                        <Input type='password' value={formdata.password} name='password' onChange={submitHandler} />
                    </div>

                    <Button type="submit">Log in</Button>
                    <h6 className='text-center'>Dont Have An Account? <Link to={'/register'} className='text-blue-500'>Register</Link></h6>

                </form>
            </div>
        </>
    )
}

export default Login