import {useRecoilState} from 'recoil';
import {openUserImageAddState,currentUserState} from '../atoms/userAtom';
import {editImageRoute,uploadImage} from '../ApiRoutes';
import axios from 'axios';
import {AiOutlinePlusCircle} from 'react-icons/ai';
import {useState,useEffect} from 'react';

export default function UserImageAddAlertComponent() {

	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [openUserImageAdd,setOpenUserImageAdd] = useRecoilState(openUserImageAddState);
	const [image,setImage] = useState('');
	const [path2,setPath2] = useState('');
	const [uploading,setUploading] = useState(false);

	useEffect(()=>{
		if(currentUser && currentUser?.image){
			setImage(currentUser?.image);
		}
	},[currentUser])

	const imagePathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:image')){
				return true;				
			}
		}
	}

	const urlSetter = () => {
		const file_input = document.getElementById('file2');
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

	const saveProfile = async(imgurl) => {
		setOpenUserImageAdd(false);
		setUploading(false);
		const {data} = await axios.post(`${editImageRoute}/${currentUser?._id}`,{
			image:imgurl
		})
		setCurrentUser(data.user);
	}

	const uploadImageFun = async() => {
		setUploading(true);
		const {data} = await axios.post(uploadImage,{
			imageChunk:image
		})
		if(data.status){
			saveProfile(data.imageUrl)
		}
	}  

	return (
		<main className={`h-full flex items-center justify-center z-50 
		w-full fixed backdrop-blur-lg ${openUserImageAdd ? 'left-0' : '-left-[100%]'} transition-all
		duration-300 ease-in-out`}>
			<div className="flex flex-col items-center">
				<h1 className="text-3xl font-semibold text-gray-200">Select profile picture</h1>
				<p className="text-lg mt-1 text-gray-400">Get discovered easily</p>
				<div onClick={()=>{
					document.getElementById('file2').click()				
				}}className="flex items-center mt-5 flex-col rounded-xl border-dashed justify-center
				border-[1px] border-sky-500 w-[250px] backdrop-blur-md bg-sky-100/10 aspect-square
				hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer relative">
					<div className={`${uploading ? 'block':'hidden'} h-full w-full absolute z-50
					bg-black/50 flex items-center justify-center rounded-xl`}>
						<span className="loader border-sky-500"/>
					</div>
					{
						image &&
						<img className={`h-full w-full rounded-xl aspect-square`} alt="" src={image}/>
					}
					{
						(!image) &&
						<>
							<AiOutlinePlusCircle className="h-[30%] w-[30%] text-sky-500"/>
							<h1 className="text-lg px-2 font-semibold text-sky-400">Add item image</h1>
						</>
					}
					<input type="file" accept="image/*" id="file2"
					value={path2} onChange={(e)=>{setPath2(e.target.value);urlSetter()}}
					hidden/>
				</div>
				<div className="mt-4 flex items-center gap-3">
					{
						currentUser?.image &&
						<button onClick={()=>setOpenUserImageAdd(false)} className={`bg-red-500/70 px-8 hover:scale-105 py-2 rounded-2xl 
						text-white font-mono tracking-[1px] text-lg transition-all ${image ? 'block' : 'hidden'} 
						duration-300 ease`}>
							Close
						</button>
					}
					<button onClick={uploadImageFun} className={`bg-green-500/70 px-8 hover:scale-105 py-2 rounded-2xl 
					text-white font-mono tracking-[1px] text-lg transition-all ${image ? 'block' : 'hidden'} 
					duration-300 ease`}>
						Save
					</button>
				</div>
			</div>
		</main>


	)
}