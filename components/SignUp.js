import {useState} from 'react'
import {auth} from '../lib/firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'

const SignUp = () => {
	
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const signup = (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		createUserWithEmailAndPassword(auth, email, password)
			.then((creds) => {
				console.log('registered', creds) // Should save user data to a context state
				setLoading(false)
			}).catch((err) => { // Password too short or email already used
				setError(err.message) // Need to confirm this formatting, might just be (err)
				setLoading(false)
			})
	}

	return (
		<div className="my-4">
			<h3>Create Account</h3>
			<form onSubmit={signup} className="flex gap-2 mt-2">
				<input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}/>
				<input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)}/>
				<button type="submit">Sign Up</button>
			</form>
			{loading && <p>Loading...</p>}
			{error && <p className='error'>{error}</p>}
		</div>
	)
}
export default SignUp