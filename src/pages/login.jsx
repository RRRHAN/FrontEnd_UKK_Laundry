import { useState } from "react"
import { base_url } from "../config"
import axios from "axios"

const Login = () => {
	const [username, set_username] = useState("")
	const [password, set_password] = useState("")
	const [message, set_message] = useState({ display: false, text: "" })

	const sendData = () => {
		let data = {
			username,
			password,
		}

		let url = base_url + "/login"

		axios
			.post(url, data)
			.then((response) => {
				if (response.data.logged) {
					let token = response.data.token
					localStorage.setItem("token", token)
					console.log(token)
					window.location = "/"
				} else {
					set_message({ display: true, text: response.data.message })
					console.log(response.data)
				}
			})
			.catch((error) => console.log(error))
	}
	return (
		<>
			<div
				className='fixed right-0 left-0 -z-10 block bg-no-repeat min-h-screen'
				style={{
					backgroundImage: `url(${process.env.PUBLIC_URL}/planetcare-5cpBWEl6y6c-unsplash.jpg)`,
					backgroundSize: "100%",
				}}
			></div>
			<div
				className='min-h-screen max-h-screen overflow-hidden fixed right-0 left-0 z-10'
				style={{
					background: "rgba(0, 0, 0, .7)",
				}}
			>
				<div
					className=' flex justify-center flex-col'
					style={{
						minHeight: "100vh",
					}}
				>
					<h1
						className='text-center text-4xl m-3 blocks'
						style={{ textShadow: "5px 5px 50 #000", color: "#fff" }}
					>
						Laundry App Login Form
					</h1>
					<div className='mx-auto mt-6' style={{ minHeight: "60vh" }}>
						<div
							className='rounded p-12'
							style={{ backgroundColor: "rgba(200,200,200,.8)" }}
						>
							{message.display ? (
								<div
									class='bg-red-100 border border-red-400 text-red-700 px-4 pb-3 rounded relative mb-5'
									role='alert'
								>
									<span class='block sm:inline'>{message.text}</span>
									<button
										class='ml-3'
										onClick={() =>
											set_message((prev) => (prev.display = false))
										}
									>
										<p className="text-2xl">&times;</p>
									</button>
								</div>
							) : null}
							<div class='input-group mb-3'>
							<label for='username'>Username : </label>
								<input
									type='text'
									name='username'
									id='username'
									className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline'
									placeholder='Username'
									onChange={(ev) => {
										set_username(ev.target.value)
									}}
								/>
							</div>
							<div class='input-group mb-5'>
							<label for='password'>Password : </label>
								<input
									type='password'
									name='password'
									id='password'
									className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline'
									placeholder='Password'
									onChange={(ev) => {
										set_password(ev.target.value)
									}}
								/>
							</div>
							<button
								className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
								type='submit'
								onClick={() => sendData()}
							>
								Sign In
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Login
