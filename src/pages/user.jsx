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

const User = () => {
	const [stateToken, setStateToken] = useState(null)
	useConstructor(() => {
		if (localStorage.getItem("token")) {
			setStateToken(localStorage.getItem("token"))
		} else {
			window.location = "/login"
		}
	})
	const [stateUser, setStateUser] = useState({
		id: "",
		nama: "",
		username: "",
		password: "",
		role: "",
	})
	const [stateUsers, setStateUsers] = useState([
		{ id: "", nama: "", username: "", password: "", role: "" },
	])
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [stateAction, setStateAction] = useState("")
	const [stateMessage, setStateMessage] = useState({
		show: false,
		text: "",
	})


	const showMessage = (message) => {
		setStateMessage({ show: true, text: message })
		const interval = setInterval(() => {
			setStateMessage({ show: false, text: "" })
			clearInterval(interval)
		}, 5000)
	}

	const headerConfig = () => {
		let header = {
			headers: { Authorization: `Bearer ${stateToken}` },
		}
		return header
	}
	const getUsers = () => {
		let url = base_url + "/User"
		axios
			.get(url, headerConfig())
			.then((response) => {
				if (response.data.notLogged) {
					window.location = "/login"
				} else {
					setStateUsers(response.data.data)
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
	
	const saveUser = (e) => {
		e.preventDefault()
		const id = stateUser.id ? stateUser.id : ""
		console.log(stateUser)
		let url = base_url + "/User/" + id
		const reqAPI = stateAction == "insert" ? axios.post : axios.put
		reqAPI(url, stateUser, headerConfig())
			.then((response) => {
				if (response.data.notLogged) {
					window.location = "/login"
				} else {
					showMessage(response.data.message)
					setModalIsOpen(false)
					getUsers()
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

	const deleteUser = (id) => {
		let url = base_url + "/user/" + id
		axios
			.delete(url, headerConfig())
			.then((response) => {
				if (response.data.notLogged) {
					window.location = "/login"
				} else {
					getUsers()
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
		getUsers()
	}, [])
	return (
		<>
			<Navbar />
			<div class='grid grid-cols-3 gap-4'>
				<div>
					<h1 className='text-4xl m-10'>User</h1>
				</div>
				<div className='mx-auto mt-6'>
					<button
						onClick={() => {
							setModalIsOpen(true)
							setStateUser({
								id: "",
								nama: "",
								username: "",
								password: "",
								role: "kasir",
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
				{stateMessage.show ? (
					<div
						class='bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-5'
						role='alert'
					>
						<button
							onClick={() => setStateMessage({ show: false, text: "" })}
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
				) : (
					""
				)}
				<div class='flex flex-col'>
					<div class='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
						<div class='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
							<table class='min-w-full divide-y divide-gray-200'>
								<thead class='bg-gray-200'>
									<tr>
										<th
											scope='col'
											class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											#
										</th>
										<th
											scope='col'
											class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Nama
										</th>
										<th
											scope='col'
											class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Username
										</th>
										<th
											scope='col'
											class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Password
										</th>
										<th
											scope='col'
											class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Role
										</th>
										<th scope='col' class='relative px-6 py-3'>
											<span class='sr-only'>Edit</span>
										</th>
									</tr>
								</thead>
								<tbody class='bg-white divide-y divide-gray-200'>
									{stateUsers.map((element, i) => (
										<tr>
											<td class='px-6 py-4 whitespace-nowrap'>
												<div class='ml-4'>
													<div class='text-sm font-medium text-gray-900'>
														{i + 1}
													</div>
												</div>
											</td>
											<td class='px-6 py-4 whitespace-nowrap'>
												<div class='text-sm text-gray-900'>{element.nama}</div>
											</td>
											<td class='px-6 py-4 whitespace-nowrap'>
												<div class='text-sm text-gray-900'>
													{element.username}
												</div>
											</td>
											<td class='px-6 py-4 whitespace-nowrap'>
												<div class='text-sm text-gray-900'>
													{element.password}
												</div>
											</td>
											<td class='px-6 py-4 whitespace-nowrap'>
												<div class='text-sm text-gray-900'>{element.role}</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
												<button
													onClick={() => {
														if (
															window.confirm(
																"apakah anda yakin akan menghapus data ini?"
															)
														)
															deleteUser(element.id)
													}}
													className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-5'
												>
													Hapus
												</button>
												<button
													onClick={() => {
														setModalIsOpen(true)
														setStateUser(element)
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
								value={stateUser.nama}
								onChange={(event) => {
									let tempUser = { ...stateUser }
									tempUser.nama = event.target.value
									setStateUser(tempUser)
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
								htmlfor='inputusername'
								className='form-label inline-block mb-2 text-gray-700'
							>
								Username
							</label>
							<input
								value={stateUser.username}
								onChange={(event) => {
									let tempUser = { ...stateUser }
									tempUser.username = event.target.value
									setStateUser(tempUser)
								}}
								type='text'
								className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
								id='inputusername'
								placeholder='Masukkan Username'
							/>
						</div>
						<div className='form-group mb-6'>
							<label
								htmlfor='inputpassword'
								className='form-label inline-block mb-2 text-gray-700'
							>
								Password
							</label>
							<input
								value={stateUser.password}
								onChange={(event) => {
									let tempUser = { ...stateUser }
									tempUser.password = event.target.value
									setStateUser(tempUser)
								}}
								type='password'
								className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
								id='inputpassword'
								placeholder='Masukkan Password'
							/>
						</div>
						<div className='form-group mb-6'>
							<label
								htmlfor='inputrole'
								className='form-label inline-block mb-2 text-gray-700'
							>
								Role
							</label>
							<select
								value={stateUser.role.toLowerCase()}
								onChange={(event) => {
									let tempUser = { ...stateUser }
									tempUser.role = event.target.value
									setStateUser(tempUser)
									console.log(tempUser)
								}}
								type='text'
								className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
								id='inputrole'
								placeholder='Masukkan alamat'
							>
								<option value='admin'>Admin</option>
								<option value='kasir'>Kasir</option>
							</select>
						</div>
						<button
							onClick={(e) => {
								saveUser(e)
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
export default User
