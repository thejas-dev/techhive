import {useEffect} from 'react';


export default function HeroComponent() {
	// body...
	const typeMessage = (text) =>{
	    let index=0;
	    const element =document.getElementById('about');
	    element.innerHTML = "";
	    const interval = setInterval(()=>{
	      if(index<text.length){
	        element.innerHTML += text.charAt(index);
	        index++;
	      }else{
	        clearInterval(interval);
	        let ele = document.getElementById('itemList');
	        if(ele){
	        	ele.scrollIntoView({behavior:'smooth',block:'center'})
	        }
	      }
	    },20)
	}

	useEffect(()=>{
		typeMessage("Welcome to App'opedia – your curated hub for web applications! Dive into a world of innovation, where developers showcase their creations and users explore a diverse array of web apps. Discover the latest tools, entertainment platforms, productivity boosters, and more, all in one place. Whether you're a creator or a connoisseur of web apps, App'opedia is your window to limitless possibilities. Join us in revolutionizing the way we interact with the digital realm.")
	},[])

	return (
		<main className="h-[100vh] max-w-6xl mx-auto flex md:pt-[150px] pt-[100px] ">
			<h1 id="about" className="md:text-xl text-lg px-3 text-purple-100 drop-shadow-xl md:w-[60%] w-full text-xl font-semibold ">
				
			</h1>

		</main>
	)
}