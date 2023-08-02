import {FaUser} from 'react-icons/fa'
import {FiMail} from 'react-icons/fi';
import {BiLockAlt} from 'react-icons/bi';
import {useState} from 'react';
import {GiConfirmed} from 'react-icons/gi';
import {register,checkExist,login} from '../ApiRoutes';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {useRecoilState} from 'recoil';
import {currentUserState} from '../atoms/userAtom';

export default function SignInComponent({alertUser,setAlertUser}) {
	// body...
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [createAccount,setCreateAccount] = useState(false);
	const [loading,setLoading] = useState(false);
	const [email,setEmail] = useState('');
	const [password,setPassword] = useState('');
	const [confirmPassword,setConfirmPassword] = useState('');
	const [remember,setRemember] = useState(false);
    const navigate = useNavigate();

    const checkTheEmailAndPass = () => {    	
		if(/@gmail\.com$/.test(email) && password.length > 1){
			handleValidation()
		}else{
			if(email.length < 2 || password.length < 2){
				setAlertUser('Email and password are required');
				setTimeout(()=>{setAlertUser('')},4000)				
			}else if(!/@gmail\.com$/.test(email)) {
				setAlertUser('Email is incorrect');
				setTimeout(()=>{setAlertUser('')},4000)
			}
		}    
    }

	const handleValidation = async() => {
		if(createAccount){
			if(password === confirmPassword){
				setLoading(true);
				const {data} = await axios.get(`${checkExist}/${email}`);
				if(!data.status){
					setLoading(false);
					setAlertUser(data.msg);
					setTimeout(()=>{setAlertUser('')},4000)
				}else{
					let name = email.split('@')[0];
					const {data} = await axios.post(register,{
						email,password,name
					})
					if(data.status){
						setLoading(false)
						let userDetails = {
							email:data.user.email,
							password
						}
						if(remember){
							sessionStorage.setItem('techhive-task',JSON.stringify(userDetails))
						}
						setCurrentUser(data.user);
						navigate('/');
					}
				}
			}else{
				setAlertUser('Password not matching')
				setTimeout(()=>{setAlertUser('')},4000)
			}
			
		}else{
			setLoading(true)
			const {data} = await axios.post(login,{
				email,password
			})
			if(data.status){
				setLoading(false)
				let userDetails = {
					email:data.user.email,
					password
				}
				if(remember){
					sessionStorage.setItem('techhive-task',JSON.stringify(userDetails))
				}
				setCurrentUser(data.user);
				navigate('/')
			}else{
				setLoading(false)				
				setAlertUser(data.msg);
				setTimeout(()=>{setAlertUser('')},4000)
			}

		}
	}


	return (
		<div className="flex items-center flex-col  max-w-6xl mx-auto pt-[30px] py-3 px-3">
			

			<div className="rounded-full p-6 border-[5px] border-white">
				<FaUser className="h-[60px] w-[60px] text-white"/>

			</div>
			<h1 className="mt-3 uppercase md:text-3xl text-2xl text-gray-200 font-semibold">User {
				createAccount ? 
				'Register'
				:
				'login'
			}</h1>
			<form 
			onSubmit={(e)=>{
				e.preventDefault();
			}}
			className="mt-5 w-full h-full flex flex-col gap-4 items-center">
				<div className="flex items-center gap-[6px] border-y-[2px] border-r-[2px] focus-within:border-sky-500 transition-all duration-200 
				ease-in-out border-white pr-2 rounded-full focus-within:text-sky-200 text-white">
					<div id="mail-container" className="rounded-full  transition-all
					duration-300 ease-out border-[2px] p-2 ">
						<FiMail className="h-6 w-6"/>
					</div>
					<input value={email} onChange={(e)=>setEmail(e.target.value)}
					onFocus={()=>document.getElementById('mail-container').classList.add('border-sky-500')}
					onBlur={()=>document.getElementById('mail-container').classList.remove('border-sky-500')}
					type="email" className="bg-transparent outline-none 
					placeholder:text-gray-300 transition-all rounded-md text-md duration-300 ease-in-out text-gray-200 w-[200px]"
					placeholder="Email"
					/>
				</div>
				<div className="flex items-center gap-[6px] border-[2px] focus-within:border-sky-500 transition-all duration-200 
				ease-in-out border-white pr-2 rounded-full focus-within:text-sky-200 text-white">
					<div id="pass-container" className="rounded-full border-r-[2px] border-y-[2px] p-2 ">
						<BiLockAlt className="h-6 w-6"/>
					</div>
					<input value={password} onChange={(e)=>setPassword(e.target.value)}
					onFocus={()=>document.getElementById('pass-container').classList.add('border-sky-500')}
					onBlur={()=>document.getElementById('pass-container').classList.remove('border-sky-500')}
					type="password" className="bg-transparent outline-none 
					placeholder:text-gray-300 transition-all rounded-md text-md duration-300 ease-in-out text-gray-200 w-[200px]"
					placeholder="Password"
					/>
				</div>
				{
					createAccount &&
					<div  className="flex items-center gap-[6px] border-[2px] focus-within:border-sky-500 transition-all duration-200 
					ease-in-out border-white pr-2 rounded-full focus-within:text-sky-200 text-white">
						<div id="pass-container2" className="rounded-full border-r-[2px] border-y-[2px] p-2">
							<BiLockAlt className="h-6 w-6"/>
						</div>
						<input value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}
						onFocus={()=>document.getElementById('pass-container2').classList.add('border-sky-500')}
						onBlur={()=>document.getElementById('pass-container2').classList.remove('border-sky-500')}
						type="password" className="bg-transparent outline-none 
						placeholder:text-gray-300 transition-all rounded-md text-md duration-300 ease-in-out text-gray-200 w-[200px]"
						placeholder="Confirm password"
						/>
					</div>
				}
				<div className="flex flex-col items-center gap-2">
					{
						!createAccount &&
						<div className="flex items-center text-md font-mono text-sky-100 gap-1">
							<input type="checkbox" value={remember} onChange={(e)=>setRemember(e.target.checked)}
							className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 h-3 w-3 rounded"/>
							Remember me
						</div>
					}

					<button onClick={checkTheEmailAndPass} className="rounded-full font-semibold 
					tracking-[1px] px-14 py-3 text-black bg-yellow-500 flex items-center">
					{	
						!loading ?
						createAccount ? 
						'Create'
						:
						'Submit'
						:
						<span class="loader2"></span>
					}
					</button>

				</div>
				
				<div className="mt-3 flex flex-col items-center gap-2">
					<h1 className="text-lg  text-gray-200">{
						createAccount ? 
						'Already'
						:
						'Not'
					} a member?</h1>	
					<button 
					onClick={()=>{
						if(createAccount){
							setCreateAccount(false)
						}else{
							setCreateAccount(true)
						}
					}}
					className="border-[1px] hover:text-sky-500 hover:border-sky-500 transition-all duration-200 ease-in-out
					border-gray-200 rounded-full text-lg text-gray-200
					px-5 py-2">{
						createAccount ? 'Login' :
						'Create Account'
					}</button>
				</div>
			</form>

		</div>


	)
}