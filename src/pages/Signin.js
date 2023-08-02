import {AiOutlineCloseCircle} from 'react-icons/ai';
import React from 'react';
import {useState} from 'react'

import SignInComponent from '../components/SignInComponent'



export default function Signin() {
	// body...
	const [alertUser,setAlertUser] = useState('');


	return (
		<main className="App min-h-screen z-10 w-full bg-gradient-to-br from-blue-500/20 to-purple-600/20" >
			<div className={`fixed flex ${alertUser ? 'top-3' : '-top-[20%]'}  
			left-0 right-0  transition-all duration-200 px-auto ease-in-out`}>
				<div className="flex px-3 mx-auto py-2 bg-sky-700/50 gap-[6px] backdrop-blur-lg 
				items-center rounded-2xl">
					<AiOutlineCloseCircle onClick={()=>setAlertUser('')} className="text-gray-300 cursor-pointer h-7 w-7"/>
					<h1 className="text-lg text-gray-200 font-semibold">{alertUser}</h1>
				</div>
			</div>	
			<SignInComponent alertUser={alertUser} setAlertUser={setAlertUser} />
		</main>
	)
}	