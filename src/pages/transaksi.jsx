import React, { useState, useEffect } from "react"
import Navbar from "../components/navbar"
import axios from "axios"
import { base_url } from "../config"
import useConstructor from "../hooks/useConstructor"
import Modal from "react-modal"
import convertPrice from "../convertPrice"

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

Modal.setAppElement("#root")

const Transaksi = () => {
	const [stateToken, setStateToken] = useState(null)

	useConstructor(() => {
		if (localStorage.getItem("token")) {
			setStateToken(localStorage.getItem("token"))
		} else {
			window.location = "/login"
		}
	})

	const [stateTransaksi, setStateTransaksi] = useState({
		id: "",
		id_member: "",
		tgl: "",
		batas_waktu: "",
		tgl_bayar: "",
		status: "",
		dibayar: "",
		id_user: "",
		id_paket: "",
		qty: "",
	})
	const [stateTransaksis, setStateTransaksis] = useState([
		{
			id: "",
			id_member: "",
			tgl: "",
			batas_waktu: "",
			tgl_bayar: "",
			status: "",
			dibayar: "",
			id_user: "",
		},
	])

	const [stateDetailTransaksis, setStateDetailTransaksis] = useState([
		{
			id: "",
			id_transaksi: "",
			id_paket: "",
			qty: "",
		},
	])

	const [stateMembers, setStateMembers] = useState([
		{ id: "", nama: "", alamat: "", jenis_kelamin: "", tlp: "" },
	])

	const [stateUsers, setStateUsers] = useState([
		{ id: "", nama: "", username: "", password: "", role: "" },
	])

	const [statePakets, setStatePakets] = useState([
		{ id: "", jenis: "", harga: 0 },
	])
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [modalDetailIsOpen, setModalDetailIsOpen] = useState(false)
	const [stateAction, setStateAction] = useState("")
	const [stateMessage, setStateMessage] = useState({
		show: false,
		text: "",
	})

	const headerConfig = () => {
		let header = {
			headers: { Authorization: `Bearer ${stateToken}` },
		}
		return header
	}

	const showMessage = (message) => {
		setStateMessage({ show: true, text: message })
		const interval = setInterval(() => {
			setStateMessage({ show: false, text: "" })
			clearInterval(interval)
		}, 5000)
	}

	const weekday = [
		"Minggu",
		"Senin",
		"Selasa",
		"Rabu",
		"Kamis",
		"Jum'at",
		"Sabtu",
	]

	const convertTime = (time) => {
		if (!time) return ""
		let date = new Date(time)
		return `${weekday[date.getDay()]}, ${date.getDate()}/${
			Number(date.getMonth()) + 1
		}/${date.getFullYear()}`
	}

	const getTransaksis = () => {
		let url = base_url + "/transaksi"
		axios
			.get(url, headerConfig())
			.then((response) => {
				if (response.data.notLogged) {
					window.location = "/login"
				} else {
					setStateTransaksis(response.data.data)
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

	const deleteTransaksi = (id) => {
		let url = base_url + "/Transaksi/" + id
		axios
			.delete(url, headerConfig())
			.then((response) => {
				if (response.data.notLogged) {
					window.location = "/login"
				} else {
					getTransaksis()
					setModalDetailIsOpen(false)
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

	const deleteDetailTransaksi = (id_detail_transaksi, id_transaksi) => {
		let url = base_url + "/detil_transaksi/" + id_detail_transaksi
		axios
			.delete(url, headerConfig())
			.then((response) => {
				if (response.data.notLogged) {
					window.location = "/login"
				} else {
					deleteTransaksi(id_transaksi)
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

	const saveTransaksi = (e) => {
		e.preventDefault()
		let url = `${base_url}/transaksi/${
			stateAction == "insert" ? "" : stateTransaksi.id
		}`
		const reqAPI = stateAction == "insert" ? axios.post : axios.put
		reqAPI(url, stateTransaksi, headerConfig())
			.then((response) => {
				if (response.data.notLogged) {
					window.location = "/login"
				} else {
					if (stateAction == "insert") {
						saveDetailTransaksi(response.data.data.id)
					} else {
						saveDetailTransaksi()
					}
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

	const saveDetailTransaksi = (id) => {
		let url = `${base_url}/detil_transaksi/${
			stateAction == "insert" ? "" : stateTransaksi.id_detail_transaksi
		}`
		const reqAPI = stateAction == "insert" ? axios.post : axios.put
		reqAPI(
			url,
			{
				id_transaksi: id,
				id_paket: stateTransaksi.id_paket,
				qty: stateTransaksi.qty,
			},
			headerConfig()
		)
			.then((response) => {
				if (response.data.notLogged) {
					window.location = "/login"
				} else {
					showMessage(response.data.message)
					setModalIsOpen(false)
					getPaket()
					getDetailTransaksis()
					getTransaksis()
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

	const getPakets = () => {
		let url = base_url + "/paket"
		axios
			.get(url, headerConfig())
			.then((response) => {
				if (response.data.notLogged) {
					window.location = "/login"
					alert("notlogged")
				} else {
					setStatePakets(response.data.data)
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

	const getDetailTransaksis = () => {
		let url = base_url + "/detil_transaksi"
		axios
			.get(url, headerConfig())
			.then((response) => {
				if (response.data.notLogged) {
					window.location = "/login"
					alert("notlogged")
				} else {
					setStateDetailTransaksis(response.data.data)
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

	const getMemberName = (id) => {
		let obj = stateMembers.find((o) => o.id === id)
		if (obj == undefined) {
			return "name"
		}
		return obj.nama
	}

	const getNameUser = (id) => {
		let obj = stateUsers.find((o) => o.id === id)
		if (obj == undefined) {
			return "name"
		}
		return obj.nama
	}
	const getPaket = (id) => {
		let obj = statePakets.find((o) => o.id === id)
		if (obj == undefined) {
			return "paket"
		}
		return obj
	}

	const getDetailTransaksi = (id) => {
		let obj = stateDetailTransaksis.find((o) => o.id_transaksi === id)
		if (obj == undefined) {
			return {
				id: "",
				id_transaksi: "",
				id_paket: "",
				qty: "",
			}
		}
		return obj
	}
	useEffect(() => {
		getMembers()
		getPakets()
		getDetailTransaksis()
		getUsers()
		getTransaksis()
	}, [])
	return (
		<>
			<Navbar />
			<div class='grid grid-cols-3 gap-4'>
				<div>
					<h1 className='text-4xl m-10'>Transaksi</h1>
				</div>
				<div className='mx-auto mt-6'>
					<button
						onClick={() => {
							setModalIsOpen(true)
							setStateTransaksi({
								id: "",
								Id_member: "",
								tgl: "",
								batas_waktu: "",
								tgl_bayar: "",
								status: "baru",
								dibayar: "belum_dibayar",
								id_transaksi: "",
								id_paket: 1,
								qty: 1,
							})
							setStateAction("insert")
						}}
						className='bg-green-600 hover:bg-green-900 text-white font-bold py-2 px-4 rounded mr-5'
						data-modal-toggle='modal1'
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
							<table class='min-w-full divide-y divide-gray-200 text-center'>
								<thead class='bg-gray-200'>
									<tr>
										<th
											scope='col'
											class='px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											#
										</th>
										<th
											scope='col'
											class='px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Tanggal
										</th>
										<th
											scope='col'
											class='px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Member
										</th>
										<th
											scope='col'
											class='px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Status
										</th>
										<th
											scope='col'
											class='px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Dibayar
										</th>
										<th
											scope='col'
											class='px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Paket
										</th>
										<th
											scope='col'
											class='px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											QTY
										</th>
										<th
											scope='col'
											class='px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Harga
										</th>
										<th scope='col' class='relative px-6 py-3'>
											<span class='sr-only'>Edit</span>
										</th>
									</tr>
								</thead>
								<tbody class='bg-white divide-y divide-gray-200'>
									{stateTransaksis.map((element, i) => (
										<tr>
											<td class='px-6 py-4 whitespace-nowrap'>
												<div class='ml-4'>
													<div class='text-sm font-medium text-gray-900'>
														{i + 1}
													</div>
												</div>
											</td>
											<td class='px-6 py-4 whitespace-nowrap'>
												<div class='text-sm text-gray-900'>
													{convertTime(element.tgl)}
												</div>
											</td>
											<td class='px-6 py-4 whitespace-nowrap'>
												<div class='text-sm text-gray-900'>
													{getMemberName(element.id_member)}
												</div>
											</td>
											<td class='px-6 py-4 whitespace-nowrap'>
												<div class='text-sm text-gray-900'>
													<div
														className={`text-center p-1 text-white font-bold rounded ${
															element.status == "baru"
																? " bg-teal-500"
																: element.status == "proses"
																? " bg-indigo-500"
																: element.status == "selesai"
																? " bg-emerald-500"
																: element.status == "diambil"
																? " bg-green-500"
																: ""
														}`}
													>
														{element.status}
													</div>
												</div>
											</td>
											<td class='px-6 py-4 whitespace-nowrap'>
												<div class='text-sm text-gray-900'>
													<div
														className={`text-center p-1 text-white font-bold rounded ${
															element.dibayar == "dibayar"
																? " bg-blue-500"
																: " bg-red-500"
														}`}
													>
														{element.dibayar}
													</div>
												</div>
											</td>
											<td class='px-6 py-4 whitespace-nowrap'>
												<div class='text-sm text-gray-900'>
													{
														getPaket(getDetailTransaksi(element.id).id_paket)
															.jenis
													}
												</div>
											</td>
											<td class='px-6 py-4 whitespace-nowrap'>
												<div class='text-sm text-gray-900'>
													{getDetailTransaksi(element.id).qty}
												</div>
											</td>
											<td class='px-6 py-4 whitespace-nowrap'>
												<div class='text-sm text-gray-900'>
													{convertPrice(
														getPaket(getDetailTransaksi(element.id).id_paket)
															.harga * getDetailTransaksi(element.id).qty
													)}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
												<button
													onClick={() => {
														setModalDetailIsOpen(true)
														setStateTransaksi({
															...element,
															id_detail_transaksi: getDetailTransaksi(
																element.id
															).id,
															id_paket: getDetailTransaksi(element.id).id_paket,
															qty: getDetailTransaksi(element.id).qty,
														})
													}}
													className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
												>
													Detail
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<Modal
					isOpen={modalIsOpen}
					style={modalStyles}
					onRequestClose={() => setModalIsOpen(false)}
					contentLabel='edit add modal'
				>
					<div className='m-5' id='modal1'>
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
						<div className='flex'>
							<div className='w-96 m-5'>
								<div className='form-group mb-6'>
									<label
										htmlfor='inputidmember'
										className='form-label inline-block mb-2 text-gray-700'
									>
										Id Member
									</label>
									<input
										value={stateTransaksi.id_member}
										onChange={(event) => {
											let tempTransaksi = { ...stateTransaksi }
											tempTransaksi.id_member = event.target.value
											setStateTransaksi(tempTransaksi)
										}}
										type='text'
										className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
										id='inputidmember'
										placeholder='Masukkan Id Member'
									/>
								</div>
								<div className='form-group mb-6'>
									<label
										htmlfor='inputtgl'
										className='form-label inline-block mb-2 text-gray-700'
									>
										Tanggal
									</label>
									<input
										value={stateTransaksi.tgl}
										onChange={(event) => {
											let tempTransaksi = { ...stateTransaksi }
											tempTransaksi.tgl = event.target.value
											setStateTransaksi(tempTransaksi)
										}}
										type='date'
										className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
										id='inputtgl'
										placeholder='Masukkan Tanggal'
									/>
								</div>
								<div className='form-group mb-6'>
									<label
										htmlfor='inputbataswaktu'
										className='form-label inline-block mb-2 text-gray-700'
									>
										Batas waktu
									</label>
									<input
										value={stateTransaksi.batas_waktu}
										onChange={(event) => {
											let tempTransaksi = { ...stateTransaksi }
											tempTransaksi.batas_waktu = event.target.value
											setStateTransaksi(tempTransaksi)
										}}
										type='date'
										className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
										id='inputbataswaktu'
										placeholder='Masukkan batas Waktu Bayar'
									/>
								</div>
								<div className='form-group mb-6'>
									<label
										htmlfor='inputtglbayar'
										className='form-label inline-block mb-2 text-gray-700'
									>
										Tanggal Bayar
									</label>
									<input
										value={stateTransaksi.tgl_bayar}
										onChange={(event) => {
											let tempTransaksi = { ...stateTransaksi }
											tempTransaksi.tgl_bayar = event.target.value
											setStateTransaksi(tempTransaksi)
										}}
										type='date'
										className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
										id='inputtglbayar'
										placeholder='Masukkan Tanggal Bayar'
									/>
								</div>
							</div>
							<div className='w-96 m-5'>
								<div className='form-group mb-6'>
									<label
										htmlfor='inputstatus'
										className='form-label inline-block mb-2 text-gray-700'
									>
										Status
									</label>
									<select
										value={stateTransaksi.status.toLowerCase()}
										onChange={(event) => {
											let tempTransaksi = { ...stateTransaksi }
											tempTransaksi.status = event.target.value
											setStateTransaksi(tempTransaksi)
										}}
										className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
										id='inputstatus'
										placeholder='Masukkan alamat'
									>
										<option value='baru'>Baru</option>
										<option value='proses'>Proses</option>
										<option value='selesai'>Selesai</option>
										<option value='diambil'>Diambil</option>
									</select>
								</div>
								<div className='form-group mb-6'>
									<label
										htmlfor='inputstatuspembayaran'
										className='form-label inline-block mb-2 text-gray-700'
									>
										Status Pembayaran
									</label>
									<select
										value={stateTransaksi.dibayar.toLowerCase()}
										onChange={(event) => {
											let tempTransaksi = { ...stateTransaksi }
											tempTransaksi.dibayar = event.target.value
											setStateTransaksi(tempTransaksi)
										}}
										className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
										id='inputstatuspembayaran'
										placeholder='Masukkan alamat'
									>
										<option value='belum_dibayar'>Belum Dibayar</option>
										<option value='dibayar'>Dibayar</option>
									</select>
								</div>
								<div className='form-group mb-6'>
									<label
										htmlfor='inputidpaket'
										className='form-label inline-block mb-2 text-gray-700'
									>
										Paket
									</label>
									<select
										value={stateTransaksi.id_paket}
										onChange={(event) => {
											let tempTransaksi = { ...stateTransaksi }
											tempTransaksi.id_paket = event.target.value
											setStateTransaksi(tempTransaksi)
										}}
										className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
										id='inputidpaket'
										placeholder='Masukkan alamat'
									>
										{statePakets.map((element) => (
											<option value={element.id}>{element.jenis}</option>
										))}
									</select>
								</div>
								<div className='form-group mb-6'>
									<label
										htmlfor='inputqty'
										className='form-label inline-block mb-2 text-gray-700'
									>
										QTY
									</label>
									<input
										value={stateTransaksi.qty}
										onChange={(event) => {
											let tempTransaksi = { ...stateTransaksi }
											tempTransaksi.qty = event.target.value
											setStateTransaksi(tempTransaksi)
										}}
										type='text'
										className='form-control block w-full px-3 py-1.5 text-base
								font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded
								transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
										id='inputqty'
										placeholder='Masukkan QTY'
									/>
								</div>
							</div>
						</div>
						<button
							onClick={(e) => {
								saveTransaksi(e)
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
					</div>
				</Modal>
				<Modal
					isOpen={modalDetailIsOpen}
					style={modalStyles}
					onRequestClose={() => setModalDetailIsOpen(false)}
					contentLabel='detail modal'
				>
					<button
							onClick={() => setModalDetailIsOpen(false)}
							className='absolute right-3'
							aria-label='Close alert'
							type='button'
							data-close
						>
							<span aria-hidden='true' className='text-2xl'>
								&times;
							</span>
						</button>
					<div className='p-10 flex'>
						<div>
							<table className='min-w-full divide-y divide-gray-200'>
								<tr>
									<td className='p-5'>Member Name</td>
									<td className='p-5'>:</td>
									<td className='p-5'>
										{getMemberName(stateTransaksi.id_member)}
									</td>
								</tr>
								<tr>
									<td className='p-5'>Member Id</td>
									<td className='p-5'>:</td>
									<td className='p-5'>{stateTransaksi.id_member}</td>
								</tr>
								<tr>
									<td className='p-5'>tgl</td>
									<td className='p-5'>:</td>
									<td className='p-5'>{convertTime(stateTransaksi.tgl)}</td>
								</tr>
								<tr>
									<td className='p-5'>batas waktu</td>
									<td className='p-5'>:</td>
									<td className='p-5'>
										{convertTime(stateTransaksi.batas_waktu)}
									</td>
								</tr>
								<tr>
									<td className='p-5'>tgl bayar</td>
									<td className='p-5'>:</td>
									<td className='p-5'>
										{convertTime(stateTransaksi.tgl_bayar)}
									</td>
								</tr>
								<tr>
									<td className='p-5'>Status</td>
									<td className='p-5'>:</td>
									<td className='p-5'>
										<div
											className={`text-center p-1 text-white font-bold rounded ${
												stateTransaksi.status == "baru"
													? " bg-teal-500"
													: stateTransaksi.status == "proses"
													? " bg-indigo-500"
													: stateTransaksi.status == "selesai"
													? " bg-emerald-500"
													: stateTransaksi.status == "diambil"
													? " bg-green-500"
													: ""
											}`}
										>
											{stateTransaksi.status}
										</div>
									</td>
								</tr>
								<tr>
									<td className='p-5'>dibayar</td>
									<td className='p-5'>:</td>
									<td className='p-5'>
										<div
											className={`text-center p-1 text-white font-bold rounded ${
												stateTransaksi.dibayar == "dibayar"
													? " bg-blue-500"
													: " bg-red-500"
											}`}
										>
											{stateTransaksi.dibayar}
										</div>
									</td>
								</tr>
							</table>
						</div>
						<div>
							<table className='min-w-full divide-y divide-gray-200'>
								<tr>
									<td className='p-5'>Id user</td>
									<td className='p-5'>:</td>
									<td className='p-5'>{stateTransaksi.id_user}</td>
								</tr>
								<tr>
									<td className='p-5'>user</td>
									<td className='p-5'>:</td>
									<td className='p-5'>{getNameUser(stateTransaksi.id_user)}</td>
								</tr>
								<tr>
									<td className='p-5'>paket</td>
									<td className='p-5'>:</td>
									<td className='p-5'>
										{getPaket(stateTransaksi.id_paket).jenis}
									</td>
								</tr>
								<tr>
									<td className='p-5'>harga satuan</td>
									<td className='p-5'>:</td>
									<td className='p-5'>
										{getPaket(stateTransaksi.id_paket).harga}
									</td>
								</tr>
								<tr>
									<td className='p-5'>QTY</td>
									<td className='p-5'>:</td>
									<td className='p-5'>{stateTransaksi.qty}</td>
								</tr>
								<tr>
									<td className='p-5'>harga</td>
									<td className='p-5'>:</td>
									<td className='p-5 w-16'>
										{convertPrice(
											getPaket(stateTransaksi.id_paket).harga *
												stateTransaksi.qty
										)}
									</td>
								</tr>
								<tr>
									<td className='p-5 text-center w-full'>
										<button
											onClick={() => {
												if (
													window.confirm(
														"apakah anda yakin akan menghapus data ini?"
													)
												)
													deleteDetailTransaksi(
														stateTransaksi.id_detail_transaksi,
														stateTransaksi.id_transaksi
													)
											}}
											className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-5 w-full'
										>
											Hapus
										</button>
									</td>
									<td className='p-5 text-center w-full'>
										<button
											onClick={() => {
												setModalDetailIsOpen(false)
												setModalIsOpen(true)
												setStateAction("edit")
											}}
											className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full'
										>
											Edit
										</button>
									</td>
								</tr>
							</table>
						</div>
					</div>
				</Modal>
			</div>
		</>
	)
}
export default Transaksi
