import { useState } from 'react'
import Logo from '../assets/Layer_1.svg'
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate, useLocation } from 'react-router-dom'
import gLogo from '../assets/Google__G__logo.svg'
import HideIcon from '../assets/Hide.svg'
import SeeIcon from '../assets/See.svg'
import { mockUsers } from './UserJson'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState(location.state?.error || '')

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`
          }
        })

        const profile = await res.json()

        const userData = {
          token: tokenResponse.access_token,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          sub: profile.sub,
        }

        localStorage.setItem('user', JSON.stringify(userData))
        navigate('/home')
      } catch (err) {
        console.error('Failed to fetch Google user info', err)
        setErrorMsg('Échec de connexion avec Google')
      }
    },
    onError: () => {
      console.log('Login Failed')
      setErrorMsg('Échec de connexion avec Google')
    }
  })

  const handleStandardLogin = (e) => {
    e.preventDefault()
    setErrorMsg('') // reset error

    const user = mockUsers.find(u => u.email === email && u.password === password)

    if (user) {
      // Login successful: Save entered info for visualization in UserJson.jsx
      localStorage.setItem('user', JSON.stringify({
        email: user.email,
        password: user.password,
        name: user.name,
        token: user.token
      }))
      navigate('/home')
    } else {
      setErrorMsg('Email ou mot de passe invalide')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form">
          <img src={Logo} alt="SMM Socodam davum" className='Login-logo' />
          <h2 className='login-headline'>Log in</h2>
          <h6 className='login-caption'>Connectez-vous via e-mail ou un autre service pour continuer </h6>
          <button
            type="button"
            className="my-google-btn"
            onClick={() => login()}
          >
            <img src={gLogo} alt="Google logo" className='glogo' />
            <p className='auth text'>Continue with Google</p>
          </button>

          <div className='or'>
            <div className='orfill'></div>
            <p>OU</p>
            <div className='orfill2'></div>
          </div>
          <div className='login-manparent-form'>
            <div className='login-man-form'>
              {errorMsg && <div className="login-error-msg">{errorMsg}</div>}
              <form onSubmit={handleStandardLogin} className="login-actual-form">
                <div className="login-input-group">
                  <div className="login-label">Votre Email</div>
                  <input
                    type="email"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="login-input-group">
                  <div className="password-header">
                    <div className="login-label no-margin-bottom">Votre Mot de passe</div>
                    <div className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                      <img src={!showPassword ? HideIcon : SeeIcon} alt="toggle password visibility" className="toggle-icon" />
                      <div>{!showPassword ? "Masquer" : "Afficher"}</div>
                    </div>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <a href="#" className="forgot-password">Mot de passe oublié?</a>
                </div>
                <button type="submit" className="login-submit-btn">Log in</button>
              </form>
            </div>
          </div>
        </div>
        <div className="login-image">
          <img src="src/assets/ray-donnelly-YybYC5zC1Mk-unsplash 1.jpg" alt="" />
        </div>
      </div>
      <div className='footer-login'>
        <p>&copy; {new Date().getFullYear()} Smm Socodam Davum. All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Login

