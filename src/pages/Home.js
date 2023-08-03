import {AiOutlineUser,AiOutlinePlusCircle} from 'react-icons/ai';
import {useRecoilState} from 'recoil';
import {useState,useEffect} from 'react';
import {currentUserState,sideBarState,currentItemsState,selectedItemState,
	createItemWindowState,showItemIndexState,openUserImageAddState} from '../atoms/userAtom';
import {Link,useNavigate} from 'react-router-dom';
import SideBar from '../components/SideBar'
import ItemCard from '../components/ItemCard';
import UserImageAddAlertComponent from '../components/UserImageAddAlertComponent';
import {getAllItems,login} from '../ApiRoutes';
import axios from 'axios';
import {FiLogOut} from 'react-icons/fi';
import HeroComponent from '../components/HeroComponent';

export default function Home() {
	// body...
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [sideBar,setSidebar] = useRecoilState(sideBarState);
	const [currentItems,setCurrentItems] = useRecoilState(currentItemsState)
	const [selectedItem,setSelectedItem] = useRecoilState(selectedItemState);
	const [createItemWindow,setCreateItemWindow] = useRecoilState(createItemWindowState)
	const [openUserImageAdd,setOpenUserImageAdd] = useRecoilState(openUserImageAddState);
	const [openSignOutWindow,setOpenSignOutWindow] = useState(false);
	const navigate = useNavigate()

	const fetchItem = async() => {
		const {data} = await axios.get(getAllItems);
		setCurrentItems(data.item.reverse());
	}

	const checkForAuthData = async() => {
		if(sessionStorage.getItem('techhive-task')){
			let userDetails = JSON.parse(sessionStorage.getItem('techhive-task'))
			const {data} = await axios.post(login,{
				email:userDetails.email,
				password:userDetails.password.toString()
			})
			if(data.status){
				setCurrentUser(data.user);
			}
		}
	}

	useEffect(()=>{
		fetchItem();
		if(!currentUser?.image && currentUser){
			setOpenUserImageAdd(true)
		}
		checkForAuthData()
	},[currentUser])

	return (
		<div className="App min-h-screen w-full z-10 bg-gradient-to-r from-blue-500/50 scroll-smooth to-purple-600/50">
	      	<img src='https://ik.imagekit.io/thejas/bg.jpg?updatedAt=1690899127919'
 			 className="fixed h-[100vh] w-full z-0 opacity-70"/>
 			<img src='https://ik.imagekit.io/thejas/OIP-removebg-preview.png?updatedAt=1690990084901'
 			 className="fixed h-[50px] w-[50px] z-0 top-[150px] md:right-[200px] right-[100px] rotate-45 blur-[1.2px] opacity-70"/> 
 			
 			<UserImageAddAlertComponent />

	        <header className="top-0 px-3 py-3 w-full sticky flex z-40 items-center backdrop-blur-lg">
	          <nav className="max-w-6xl mx-auto flex items-center w-full justify-between select-none">
	            <h1 className="md:text-3xl text-2xl text-gray-200 font-semibold">App&#39;opedia</h1>
	            <div className="flex items-center gap-2 relative">
	            	<div 
	            	onClick={()=>{setCurrentUser('');sessionStorage?.removeItem('techhive-task');navigate('/signin')}}
	            	className={`absolute ${openSignOutWindow ? 'top-12' : '-top-[150px]'} right-3 transition-all
	            	duration-300 ease-in-out px-5  rounded-xl backdrop-blur-lg bg-black/40 py-2 border-[1px] border-red-500 flex 
	            	items-center gap-2 hover:bg-black/20 hover:scale-105 cursor-pointer`}>
	            		<span className="text-red-500 font-semibold whitespace-nowrap text-lg">Sign out</span>
	            		<FiLogOut className="h-6 w-6 text-red-500"/>
	            	</div>
	            	{
	            		!currentUser ?
	            		<Link to="/signin"><button className="md:text-xl cursor-pointer text-lg font-semibold border-[1px] 
	            		border-sky-500 text-white md:px-5 p-2 md:py-2 p-2 hover:text-sky-200 transition-all duration-300 ease-in-out
	            		rounded-xl shrink">Login</button></Link>
	            		:
	            		<button className="md:text-xl cursor-pointer text-lg font-semibold 
	            		text-white md:px-5 truncate p-2 md:py-2 p-2 hover:text-sky-200 transition-all duration-300 ease-in-out
	            		rounded-xl shrink flex items-center gap-1">
	            		{!currentUser?.image && <AiOutlineUser className="h-5 w-5"/>} 
	            		<span onClick={()=>setOpenSignOutWindow(!openSignOutWindow)}>{currentUser?.name}</span> 
	            		{currentUser?.image && <img onClick={()=>setOpenUserImageAdd(true)} className="h-7 ml-1 w-7 rounded-full" src={currentUser?.image} />}</button>
	            	}
	            </div>
	          </nav>
	        </header>
	        <section id="hero" className=" relative" >
		    	<HeroComponent />
	        </section>
		    <h1 className="md:text-3xl text-2xl text-center mb-7 z-30 relative font-semibold text-gray-200">Explore by here</h1>
	        <body className="flex w-full mt-2 h-full  pb-10 overflow-x-hidden bg-transparent" >

		        <div className={`h-full ${sideBar ? 'md:w-[70%] sm:w-[50%] w-[100%]' : 'w-[100%]'} overflow-x-hidden flex flex-col transition-all duration-300 ease-in-out`} >
		        	<div id="itemList"/>
		        	<div 
		        	className={`h-full max-w-6xl px-5 mx-auto grid ${sideBar ? 'md:grid-cols-2 grid-cols-1':'lg:grid-cols-3 sm:grid-cols-2 grid-cols-1'} gap-5`}>
		        		{
		        			currentItems.map((item,j)=>(
		        				<ItemCard item={item} j={j} key={j}/>

		        			))
		        		}
		        	</div>
		        	{
		        		!sideBar &&
			        	<div className="flex mt-5 mx-auto z-10 backdrop-blur-lg">
			        		<button 
			        		onClick={()=>{
			        			setSidebar(true);
								let ele = document.getElementById('addListText');
								ele.scrollIntoView({behavior:'smooth',block:"start"});			        			
			        			setCreateItemWindow(true);
			        		}}
			        		className="flex text-sky-400 border-[1px] border-sky-500 border-dashed 
			        		px-3 py-2 rounded-xl hover:border-solid transition-all duration-300 ease-in-out 
			        		font-semibold md:text-xl text-lg items-center gap-2 hover:bg-blue-800/30">
			        			<AiOutlinePlusCircle className="h-7 w-7"/>	Add my app
			        		</button>
			        	</div>
		        	}
		        </div>
		        <SideBar fetchItem={fetchItem}/>
	        </body>

	    </div>


	)
}
