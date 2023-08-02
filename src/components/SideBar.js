import {useRecoilState} from 'recoil';
import {currentUserState,sideBarState,createItemWindowState,editAppState,
	currentItemsState,showItemState,showItemIndexState,uploadingState} from '../atoms/userAtom';
import {BsArrowLeft} from 'react-icons/bs';
import {useState} from 'react';
import {AiOutlinePlusCircle} from 'react-icons/ai';
import {uploadImage,create,editItemRoute,deleteItemRoute} from '../ApiRoutes';
import axios from 'axios';
import {AiOutlineLink} from 'react-icons/ai';



export default function SideBar({fetchItem}) {
	// body...
	const [sideBar,setSidebar] = useRecoilState(sideBarState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [createItemWindow,setCreateItemWindow] = useRecoilState(createItemWindowState);
	const [showItem,setShowItem] = useRecoilState(showItemState)
	const [image,setImage] = useState('');
	const [path,setPath] = useState('');
	const [itemName,setItemName] = useState('')
	const [itemDescription,setItemDescription] = useState('');
	const [itemLink,setItemLink] = useState('');
	const [nameCheck,setNameCheck] = useState(false);
	const [uploading,setUploading] = useRecoilState(uploadingState);
	const [showItemIndex,setShowItemIndex] = useRecoilState(showItemIndexState)
	const [currentItems,setCurrentItems] = useRecoilState(currentItemsState)
	const [editApp,setEditApp] = useRecoilState(editAppState);

	const imagePathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:image')){
				return true;				
			}
		}
	}	

	const urlSetter = () => {
		const file_input = document.getElementById('file');
		const file = file_input?.files[0];
		if(file){
			const reader = new FileReader();
			reader.addEventListener('load',()=>{
				let uploaded_file = reader.result;
				if(imagePathCheck(uploaded_file)){
					setImage(uploaded_file)
				}
			})
			reader.readAsDataURL(file);			
		}
	}

	const deleteItem  = async() => {
		const {data} = await axios.delete(`${deleteItemRoute}/${showItem?._id}`)
		console.log(data)
		setItemName('');setItemDescription('');setShowItem('');setItemLink('');
		setImage('');setSidebar(false);setCreateItemWindow(false);
		setUploading(false)
		fetchItem()
	}

	const editItem = () => {
		setItemName(showItem?.itemName);
		setItemDescription(showItem?.itemDescription);
		setImage(showItem?.itemImage);
		setItemLink(showItem?.itemLink);
		setCreateItemWindow(true);
		setEditApp(true)
	}

	const editItemWithImage = async(img) => {
		let user = {
			name:currentUser?.name,
			email:currentUser?.email,
			image:currentUser?.image
		}
		const {data} = await axios.put(`${editItemRoute}/${showItem?._id}`,{
			itemName,itemDescription,itemImage:img,itemLink,user
		})
		if(data.status){
			setItemName('');setItemDescription('');setShowItem('');setItemLink('');
			setImage('');setSidebar(false);setCreateItemWindow(false);
			setUploading(false)
			fetchItem()
		}
	}

	const createItemWithImage = async(img) => {
		if(nameCheck){
			let user = {
				name:currentUser.name,
				email:currentUser.email,
				image:currentUser.image
			}
			const {data} = await axios.post(create,{
				itemDescription,itemName,itemImage:img,user:user,itemLink
			})
			if(data.status){
				setCurrentItems(currentItems=>[data.item,...currentItems]);
				setItemName('');setItemDescription('');setItemLink('');
				setImage('');setSidebar(false);setCreateItemWindow(false);
				setUploading(false)
			}
		}else{
			let user = {}
			const {data} = await axios.post(create,{
				itemDescription,itemName,itemImage:img,user:user,itemLink
			})
			if(data.status){
				setCurrentItems(currentItems=>[data.item,...currentItems]);
				setItemName('');setItemDescription('');setItemLink('');
				setImage('');setSidebar(false);setCreateItemWindow(false);
				setUploading(false)				
			}
		}
	}

	const uploadImageFun = async() => {
		const {data} = await axios.post(uploadImage,{
			imageChunk:image
		})
		if(data.status){
			createItemWithImage(data.imageUrl)
		}
	}

	const uploadEditImageFun = async() => {
		const {data} = await axios.post(uploadImage,{
			imageChunk:image
		})
		if(data.status){
			editItemWithImage(data.imageUrl);
		}
	}

	const editItemFun = async() => {
		document.getElementById('addListText').scrollIntoView({behavior:'smooth',block:"center"});
		if(currentUser){
			setUploading(true);
			uploadEditImageFun()
		}
	}

	const createItem = async() => {
		document.getElementById('addListText').scrollIntoView({behavior:'smooth',block:"center"});
		if(itemDescription.length > 5 && itemName.length > 5 && image && currentUser){
			setUploading(true);
			uploadImageFun()
		}
	}

	const closeTheSideBar = () => {
		if(!uploading){
			setSidebar(false);
			setShowItem('');
			setCreateItemWindow(false);		
		}
	}

	return (
		<div className={`sm:h-full h-[100vh] right-0 top-0 ${sideBar ? 'md:w-[30%] sm:w-[50%] w-[100%] sm:relative fixed z-50 sm:z-10' : 'w-[0%] sm:relative fixed'} backdrop-blur-lg 
		transition-all duration-300 ease-in-out overflow-hidden sm:bg-transparent bg-black/40`} >
			<div className="h-full  sm:rounded-l-xl w-full sm:border-[1px] border-blue-200/80 overflow-y-scroll">
				<div className=" px-4 rounded-l-xl 
				rounded-b-[0px] py-2 flex items-center gap-3 backdrop-blur-lg">
					<BsArrowLeft onClick={()=>closeTheSideBar()} className={`h-5 w-5 
					${uploading ? 'opacity-40' : 'opacity-100'} text-gray-200 cursor-pointer`}/>
					<h1 id="addListText" className="text-xl font-semibold text-gray-200 select-none">{
						createItemWindow ? editApp ? 'Edit App' : 'Add New App':`App #${showItemIndex + 1}`
					}</h1>
				</div>
				
				<div className="w-full bg-gray-400/50 h-[1px]"/>
				
				<div className="w-full h-full flex flex-col items-center mt-6">
					<div id="image" onClick={()=>{
						if(createItemWindow){
							document.getElementById('file').click()
						}
					}}
					className="w-[80%] aspect-square rounded-xl border-dashed 
					border-[1.4px] hover:border-solid transition-all duration-300 
					ease-in-out cursor-pointer border-sky-500 flex flex-col 
					items-center justify-center hover:scale-105 relative">
						<div className={`${uploading ? 'block':'hidden'} h-full w-full absolute z-50
						backdrop-blur-lg bg-white/10 flex items-center rounded-xl justify-center`}>
							<span className="loader border-sky-500"/>
						</div>
						{
							image ?
							<img className={`h-full w-full rounded-xl aspect-square`} alt="" src={image}/>
							:
							showItem?.itemImage &&
							<img className={`aspect-square h-full w-full rounded-xl`} alt="" src={showItem?.itemImage}/>

						}
						{
							(!image && !showItem?.itemImage) &&
							<>
								<AiOutlinePlusCircle className="h-[30%] w-[30%] text-sky-500"/>
								<h1 className="text-lg px-2 font-semibold text-sky-400">Add item image</h1>
							</>
						}
						<input type="file" accept="image/*" id="file"
						value={path} onChange={(e)=>{setPath(e.target.value);urlSetter()}}
						hidden/>
					</div>
					
					<div className="w-full mt-6 bg-gray-400/50 h-[1px]"/>
					
					
					{
						createItemWindow ? 
						<>
							<div className="flex flex-col w-full px-4 mt-3 gap-2">
								<h1 className="md:text-2xl text-xl font-semibold text-gray-200">App name</h1>
								<div className=" backdrop-blur-sm rounded-xl px-4 py-2 
								border-[1px] bg-blue-500/10 border-sky-500">
									<input 
									value={itemName} onChange={(e)=>setItemName(e.target.value)}
									type="text" className="w-full outline-none bg-transparent text-gray-200"/>
								</div>
							</div>

							<div className="flex flex-col w-full px-4 mt-3 gap-2">
								<h1 className="md:text-2xl text-xl font-semibold text-gray-200">Website URL (Optional)</h1>
								<div className=" backdrop-blur-sm rounded-xl px-4 py-2 
								border-[1px] bg-blue-500/10 border-sky-500">
									<input 
									value={itemLink} onChange={(e)=>setItemLink(e.target.value)}
									type="text" className="w-full outline-none bg-transparent text-gray-200"/>
								</div>
							</div>

							<div className="flex flex-col w-full px-4 mt-3 gap-2 mt-2">
								<h1 className="md:text-2xl text-xl font-semibold text-gray-200">Description</h1>
								<div className=" h-[150px] backdrop-blur-sm rounded-xl px-4 py-2 
								border-[1px] bg-blue-500/10 border-sky-500">
									<textarea 
									value={itemDescription} onChange={(e)=>setItemDescription(e.target.value)}
									type="text" className="w-full h-full resize-none outline-none bg-transparent text-gray-200"/>
								</div>
							</div>

							{
								!editApp && 
								<div className="w-full grid grid-cols-10 mt-5 px-5  gap-10">
									<label class="container inline-block col-span-1 align-middle mr-2">
									  <input type="checkbox" value={nameCheck} onChange={(e)=>setNameCheck(e.target.checked)} />
									  <div class="checkmark"></div>
									</label>
									<h1 className="inline-block col-span-9 align-middle text-lg font-semibold text-gray-200">Enable edit option after adding</h1>
								</div>
							}

							<button onClick={()=>{
								if(editApp){
									editItemFun()
								}else{
									createItem()
								}
							}} className={`w-[90%] mx-auto bg-sky-500/50 backdrop-blur-lg px-5 py-3 
							font-semibold text-xl transition-all duration-300 ease-in-out text-white 
							rounded-full mt-5 ${(itemDescription.length > 5 && itemName.length > 5 && image && currentUser ) ? 'hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 opacity-100':
							'opacity-40' } mb-7`}>
								{editApp ? 'Save' : 'Create'} App
							</button>
						</>

						:

						<>
							<div className="flex flex-col w-full px-4 mt-3 gap-2 pb-7">
								<h1 className="md:text-2xl text-3xl font-semibold text-gray-200">{showItem?.itemName}</h1>
								<p className={` text-sky-300 hover:underline flex items-center gap-1 text-lg cursor-pointer ${!showItem?.itemLink && 'hidden'}`}><AiOutlineLink 
								className="h-5 w-5"/><a href={showItem?.itemLink} target="_blank" >{showItem?.itemLink}</a></p>
								<p className="text-md text-gray-200 ">{showItem?.itemDescription}</p>
								{
									showItem?.user?.name &&
									<p onClick={()=>{
										window.location.href = `mailto:${showItem?.user?.email}?subject=New Order&body=` 
									}} 
									className="flex items-center gap-2 text-sky-300 mt-2 hover:underline cursor-pointer">By {
										showItem?.user?.image ?
										<img src={showItem?.user?.image} alt="" className="h-6 w-6 rounded-full "/>
										:
										''
									}
									{showItem?.user?.name}</p>
								}
								{
									currentUser?.email === showItem?.user?.email &&
									<>
										<div className="w-full mt-4 bg-gray-400/50 h-[1px]"/>

										<div className="flex mt-1 flex-col w-full gap-2">
											<button onClick={editItem} className={`w-[90%] mx-auto bg-green-500/70 backdrop-blur-lg px-5 py-2 
											font-semibold text-xl transition-all duration-300 ease-in-out text-white hover:bg-green-400/50 
											rounded-full mt-2 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 opacity-100`}>
												Edit
											</button>
											<button onClick={deleteItem} className={`w-[90%] mx-auto bg-red-500/70 backdrop-blur-lg px-5 py-2 
											font-semibold text-xl transition-all duration-300 ease-in-out text-white hover:bg-red-400/50
											rounded-full mt-2 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/40 opacity-100`}>
												Delete
											</button>

										</div>
									</>
								}

							</div>

						</>
					}

				</div>
			</div>	

		</div>


	)
}