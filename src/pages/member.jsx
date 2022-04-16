import React, { useState, useEffect } from "react"
import Navbar from "../components/navbar"
import axios from "axios"
import { base_url } from "../config"
import useConstructor from "../hooks/useConstructor"
import Modal from "react-modal"

const modalStyles = {
	overlay: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.75)",
	},
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
}

const Member = () => {
	const [stateToken, setStateToken] = useState(null)
	
	useConstructor(() => {
		if (localStorage.getItem("token")) {
			setStateToken(localStorage.getItem("token"))
		} else {
			window.location = "/login"
		}
	})
	
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [stateMembers, setStateMembers] = useState([
		{ id: "", nama: "", alamat: "", jenis_kelamin: "", tlp: "" },
	])
	const [stateMember, setStateMember] = useState({
		id: null,
		nama: "",
		alamat: "",
		jenis_kelamin: "",
		tlp: "",
	})
	const [stateAction, setStateAction] = useState("")
	const [stateMessage, setStateMessage] = useState({
		show:false,
		text:''
	})

	const headerConfig = () => {
		let header = {
			headers: { Authorization: `Bearer ${stateToken}` },
		}
		return header
	}

	const showMessage =(message)=>{
		setStateMessage({show:true,text:message})
		const interval = setInterval(() => {
			setStateMessage({show:false,text:""})
			clearInterval(interval)
		}, 5000);
	}

	const getMembers = () => {
		let url = base_url + "/member"
		axios
			.get(url, headerConfig())
			.then((response) => {
				if (response.data.notLogged) {
					window.location = "/login"
				} else {
					setStateMembers(response.data.data)
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

	const saveMember = (e) => {
		e.preventDefault()
		const id = stateMember.id ? stateMember.id : ""
		console.log(stateMember)
		let url = base_url + "/member/" + id
		const reqAPI = stateAction == "insert" ? axios.post : axios.put
		reqAPI(url, stateMember, headerConfig())
			.then((response) => {
				if (response.data.notLogged) {
					window.location = "/login"
				} else {
					showMessage(response.data.message)
					setModalIsOpen(false)
					getMembers()
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

	const deleteMember = (id) => {
		let url = base_url + "/member/" + id
		axios
			.delete(url, headerConfig())
			.then((response) => {
				if (response.data.notLogged) {
					window.location = "/login"
				} else {
					getMembers()
					showMessage(response.data.message)
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
		getMembers()
	}, [])
	return (
		<>
			<Navbar />
			<div class='grid grid-cols-3 gap-4'>
				<div>
					<h1 className='text-4xl m-10'>Member</h1>
				</div>
				<div className='mx-auto mt-6'>
					<button
						onClick={() => {
							setModalIsOpen(true)
							setStateMember({
								id: null,
								nama: "",
								alamat: "",
								jenis_kelamin: "laki-laki",
								tlp: "",
							})
							setStateAction("insert")
						}}
						className='bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded mr-5'
					>
						Tambah Data
					</button>
				</div>
			</div>
			<div className='mx-10'>
				{stateMessage.show?(
					<div
					class='bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-5'
					role='alert'
				>
					<button
					onClick={() => setStateMessage({show:false,text:""})}
					className='absolute right-14'
					aria-label='Close alert'
					type='button'
					data-close
				>
					<span aria-hidden='true' className='text-2xl'>
						&times;
					</span>
				</button>
					<p class='font-bold'>Pesan</p>
					<p>{stateMessage.text}</p>
				</div>
				 ):""}
				<div className='flex flex-col'>
					<div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
						<div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
							<div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead className='bg-gray-200'>
										<tr>
											<th
												scope='col'
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												#
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												Nama
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												Alamat
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												Jenis Kelamin
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												Telepon
											</th>
											<th scope='col' className='relative px-6 py-3'>
												<span className='sr-only'>Edit</span>
											</th>
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-200'>
										{stateMembers.map((element, i) => (
											<tr>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='ml-4'>
														<div className='text-sm font-medium text-gray-900'>
															{i + 1}
														</div>
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-900'>
														{element.nama}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-900'>
														{element.alamat}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
													<div className='text-sm text-gray-900'>
														{element.jenis_kelamin}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
													<div className='text-sm text-gray-900'>
														{element.tlp}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
													<button
														onClick={() => {
															if (
																window.confirm(
																	"apakah anda yakin akan menghapus data ini?"
																)
															)
																deleteMember(element.id)
														}}
														className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-5'
													>
														Hapus
													</button>
													<button
														onClick={() => {
															setModalIsOpen(true)
															console.log(element)
															setStateMember(element)
															setStateAction("edit")
														}}
														className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
													>
														Edit
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Modal
				isOpen={modalIsOpen}
				// onAfterOpen={afterOpenModal}
				// onRequestClose={closeModal}
				style={modalStyles}
				contentLabel='Example Modal'
			>
				<button
					onClick={() => setModalIsOpen(false)}
					className='absolute right-3'
					aria-label='Close alert'
					type='button'
					data-close
				>
					<span aria-hidden='true' className='text-2xl'>
						&times;
					</span>
				</button>
				<div className='block p-6 rounded-lg shadow-lg bg-white max-w-sm'>
					<form className='m-10'>
						<div className='form-group mb-6'>
							<label
								htmlfor='inputnama'
								className='form-label inline-block mb-2 text-gray-700'
							>
								Nama
							</label>
							<input
								value={stateMember.nama}
								onChange={(event) => {
									let tempMember = { ...stateMember }
									tempMember.nama = event.target.value
									setStateMember(tempMember)
								}}
								type='text'
								className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
								id='inputnama'
								placeholder='Masukkan Nama'
							/>
						</div>
						<div className='form-group mb-6'>
							<label
								htmlfor='inputalamat'
								className='form-label inline-block mb-2 text-gray-700'
							>
								Alamat
							</label>
							<input
								value={stateMember.alamat}
								onChange={(event) => {
									let tempMember = { ...stateMember }
									tempMember.alamat = event.target.value
									setStateMember(tempMember)
									console.log(tempMember)
								}}
								type='text'
								className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
								id='inputalamat'
								placeholder='Masukkan alamat'
							/>
						</div>
						<div className='form-group mb-6'>
							<label
								htmlfor='inputjeniskelamin'
								className='form-label inline-block mb-2 text-gray-700'
							>
								Jenis Kelamin
							</label>
							<select
								value={stateMember.jenis_kelamin.toLowerCase()}
								onChange={(event) => {
									let tempMember = { ...stateMember }
									tempMember.jenis_kelamin = event.target.value
									setStateMember(tempMember)
								}}
								type='text'
								className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
								id='inputjeniskelamin'
								placeholder='Masukkan alamat'
							>
								<option value='laki-laki'>Laki-Laki</option>
								<option value='perempuan'>Perempuan</option>
							</select>
						</div>
						<div className='form-group mb-6'>
							<label
								htmlfor='inputtlp'
								className='form-label inline-block mb-2 text-gray-700'
							>
								Nomor Telfon
							</label>
							<input
								value={stateMember.tlp}
								onChange={(event) => {
									let tempMember = { ...stateMember }
									tempMember.tlp = event.target.value
									setStateMember(tempMember)
									console.log(tempMember)
								}}
								type='number'
								className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
								id='inputtlp'
								placeholder='Masukkan alamat'
							/>
						</div>
						<button
							onClick={(e) => {
								saveMember(e)
							}}
							type='submit'
							className='
							w-full px-6 py-2.5 bg-blue-600 text-white font-medium 
							text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg
							 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
							active:bg-blue-800 active:shadow-lg transition
							duration-150      ease-in-out'
						>
							Simpan
						</button>
					</form>
				</div>
			</Modal>
		</>
	)
}

export default Member
