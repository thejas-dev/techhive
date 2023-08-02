import {motion} from 'framer-motion';
import {selectedItemState,sideBarState,createItemWindowState,
	showItemState,showItemIndexState,uploadingState,editAppState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil';

export default function ItemCard({item,j}) {
	// body...
	const [selectedItem,setSelectedItem] = useRecoilState(selectedItemState);
	const [createItemWindow,setCreateItemWindow] = useRecoilState(createItemWindowState)
	const [sideBar,setSidebar] = useRecoilState(sideBarState);
	const [uploading,setUploading] = useRecoilState(uploadingState);
	const [showItem,setShowItem] = useRecoilState(showItemState)
	const [editApp,setEditApp] = useRecoilState(editAppState);
	const [showItemIndex,setShowItemIndex] = useRecoilState(showItemIndexState)



	return (
		<motion.div 
		initial={{
			opacity:0,
		}}
		whileInView={{opacity:1}}
		transition={{duration:0.4}}
		viewport={{ once: true }}
		onClick={()=>{
			if(!uploading){
				setSelectedItem(item);
				if(selectedItem === item){
					setSidebar(false)	
					setSelectedItem('');
					setCreateItemWindow(false);	
					setEditApp(false);	
				}else{
					setSidebar(true)
					setCreateItemWindow(false);		
					setEditApp(false);	
					setShowItem(item);
					setShowItemIndex(j);
				}			
			}
		}}
		className="px-3 py-5 rounded-2xl bg-sky-200/10 border-[1px] border-blue-500/30 cursor-pointer backdrop-blur-md 
		transition-all duration-200 flex overflow-hidden ease-in-out hover:bg-white/20" key={j}>
			<div className="w-[30%] rounded-lg overflow-hidden">
				<img src={item?.itemImage} alt=""
				className="h-auto rounded-lg aspect-square w-full"/>
			</div>
			<div className="flex px-3 w-[70%]  flex-col">
				<h1 className="item-name text-2xl text-gray-200 flex items-center gap-1 
				font-semibold">{item.itemName}</h1>
				<p className="item-description text-md text-gray-300/80 
				">{item.itemDescription.length > 50 ? `${item.itemDescription.substring(0,70)}...` : item.itemDescription }</p>

			</div>	


		</motion.div>


	)
}