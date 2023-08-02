import { atom } from 'recoil';


export const currentUserState = atom({
	key:"currentUserState",
	default:''
});

export const sideBarState = atom({
	key:"sideBarState",
	default:false
})

export const currentItemsState = atom({
	key:"currentItemsState",
	default:[]
})

export const selectedItemState = atom({
	key:"selectedItemState",
	default:''
})

export const createItemWindowState = atom({
	key:"createItemWindowState",
	default:false
})

export const showItemState = atom({
	key:"showItemState",
	default:''
})

export const showItemIndexState = atom({
	key:"showItemIndexState",
	default:''
})

export const uploadingState = atom({
	key:"uploadingState",
	default:false
})

export const editAppState = atom({
	key:"editAppState",
	default:false
})

export const openUserImageAddState = atom({
	key:"openUserImageAddState",
	default:false
})