import {useState} from 'react'
import {auth} from '../lib/firebase'
import {signInWithEmailAndPassword} from 'firebase/auth'

const SignIn = () => {
	
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const signIn = (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		signInWithEmailAndPassword(auth, email, password)
			.then((creds) => {
				console.log('logged in', creds)
				setLoading(false)
			}).catch((err) => {
				setError(err.message) 
				setLoading(false)
			})
	}

	return (
        <div className="my-4">
            <h3>Sign In</h3>
            <form onSubmit={signIn}  className="flex gap-2 mt-2">
                <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}/>
                <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)}/>
                <button type="submit">Log In</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p className='error'>{error}</p>}
        </div>
	)
}
export default SignIn