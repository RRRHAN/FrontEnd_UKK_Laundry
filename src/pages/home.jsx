import React,{useEffect,useState}from "react"
import Navbar from "../components/navbar"
import transaction from "../assets/money-transfer.png"
import packages from "../assets/packages.png"
import user from "../assets/man.png"
import member from "../assets/group-chat.png"
import arrow from "../assets/fast-forward.png"
import useConstructor from "../hooks/useConstructor"
import { base_url } from "../config"
import axios from 'axios'

const Home = () => {
	const [stateToken, setStateToken] = useState(null)
	
	useConstructor(() => {
		if (localStorage.getItem("token")) {
			setStateToken(localStorage.getItem("token"))
		} else {
			window.location = "/login"
		}
	})

	const [stateCounts, setStateCounts] = useState({})

	const headerConfig = () => {
		let header = {
			headers: { Authorization: `Bearer ${stateToken}` },
		}
		return header
	}

	const getCounts = ()=>{
		let url = base_url + "/count"
		axios
			.get(url, headerConfig())
			.then((response) => {
				if (response.data.notLogged) {
					window.location = "/login"
					alert("notlogged")
				} else {
					setStateCounts(response.data)
				}
			})
			.catch((error) => {
				if (error.response) {
					if (error.response.status) {
						window.alert(error.response.data.message)
					}
				} else {
					console.log(error)
				}
			})
	}

	useEffect(() => {
		getCounts()
	}, [])
	return (
		<>
			<Navbar />
			<h1 className="text-4xl m-10">Welcome to Laundry Dasboard</h1>
			<div class='flex justify-around mx-8'>
				{/* transaction */}
				<div class='w-72 text-white'>
					<div className='flex justify-between bg-red-700/80 p-5 rounded-t-lg'>
						<div className='max-h-full max-w-full'>
							<img src={transaction} alt='' className='h-24 w-24' />
						</div>
						<div className='flex flex-col justify-end  h-full'>
							<div className='text-right'>
								<h1 className='text-5xl'>{stateCounts.cTransaksi}</h1>
								<p className='text-lg'>Transaksi</p>
							</div>
						</div>
					</div>
					<div onClick={()=> window.location = "/transaksi"} className='flex justify-between text-black p-2 bg-slate-300/90 rounded-b-lg cursor-pointer'>
						<div>View Details</div>
						<div><img src={arrow} alt="" className="h-7"/></div>
					</div>
				</div>
				{/* member */}
				<div class='w-72 text-white'>
					<div className='flex justify-between bg-red-700/80 p-5 rounded-t-lg'>
						<div className='max-h-full max-w-full'>
							<img src={member} alt='' className='h-24 w-24' />
						</div>
						<div className='flex flex-col justify-end  h-full'>
							<div className='text-right'>
								<h1 className='text-5xl'>{stateCounts.cMember}</h1>
								<p className='text-lg'>Member</p>
							</div>
						</div>
					</div>
					<div onClick={()=> window.location = "/member"} className='flex justify-between text-black p-2 bg-slate-300/90 rounded-b-lg cursor-pointer'>
						<div>View Details</div>
						<div><img src={arrow} alt="" className="h-7"/></div>
					</div>
				</div>
				</div>
				<div class='flex justify-around mx-8 mt-9'>					
				{/* user */}
				<div class='w-72 text-white'>
					<div className='flex justify-between bg-red-700/80 p-5 rounded-t-lg'>
						<div className='max-h-full max-w-full'>
							<img src={user} alt='' className='h-24 w-24' />
						</div>
						<div className='flex flex-col justify-end  h-full'>
							<div className='text-right'>
								<h1 className='text-5xl'>{stateCounts.cUser}</h1>
								<p className='text-lg'>user</p>
							</div>
						</div>
					</div>
					<div onClick={()=> window.location = "/user"} className='flex justify-between text-black p-2 bg-slate-300/90 rounded-b-lg cursor-pointer'>
						<div>View Details</div>
						<div><img src={arrow} alt="" className="h-7"/></div>
					</div>
				</div>
				{/* paket */}
				<div class='w-72 text-white'>
					<div className='flex justify-between bg-red-700/80 p-5 rounded-t-lg'>
						<div className='max-h-full max-w-full'>
							<img src={packages} alt='' className='h-24 w-24' />
						</div>
						<div className='flex flex-col justify-end  h-full'>
							<div className='text-right'>
								<h1 className='text-5xl'>{stateCounts.cPaket}</h1>
								<p className='text-lg'>Paket</p>
							</div>
						</div>
					</div>
					<div onClick={()=> window.location = "/paket"} className='flex justify-between text-black p-2 bg-slate-300/90 rounded-b-lg cursor-pointer'>
						<div>View Details</div>
						<div><img src={arrow} alt="" className="h-7"/></div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Home
