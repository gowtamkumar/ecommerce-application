import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Customer() {
    const user = await auth()

    // if(!session){
    //     console.log("dafsdf");
    //     redirect('/login')
    // }
    console.log("🚀 ~ customer session:", user)
    return (
        <div>Customer</div>
    )
}
