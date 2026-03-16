import { useState } from 'react'
import Logo from '../assets/Layer_1.svg'
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate, useLocation } from 'react-router-dom'
import gLogo from '../assets/Google__G__logo.svg'
import HideIcon from '../assets/Hide.svg'
import SeeIcon from '../assets/See.svg'
import { useAuth } from '../hooks/useAuth'
import { loginWithCredentials, loginWithGoogle as authLoginWithGoogle } from '../services/authService'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState(location.state?.error || '')

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const result = await authLoginWithGoogle(tokenResponse.access_token)
        login(result)
        const redirectTo = location.state?.from?.pathname || '/home'
        navigate(redirectTo, { replace: true })
      } catch (err) {
        console.error('Failed to login with Google', err)
        setErrorMsg('Échec de connexion avec Google')
      }
    },
    onError: () => {
      console.log('Login Failed')
      setErrorMsg('Échec de connexion avec Google')
    }
  })

  const handleStandardLogin = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    try {
      const result = await loginWithCredentials(email, password)
      login(result)
      const redirectTo = location.state?.from?.pathname || '/home'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setErrorMsg(err.message || 'Email ou mot de passe invalide')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form">
          <img src={Logo} alt="SMM Socodam davum" className='Login-logo' />
          <h2 className='login-headline'>Log in</h2>
          <h6 className='login-caption'>Connectez-vous via e-mail ou un autre service pour continuer </h6>
          {errorMsg && <div className="login-error-msg">{errorMsg}</div>}
          {!errorMsg && (
            <>
              <button
                type="button"
                className="my-google-btn"
                onClick={() => googleLogin()}
              >
                <img src={gLogo} alt="Google logo" className='glogo' />
                <p className='auth text'>Continue with Google</p>
              </button>
              <a href="http://localhost:5000/auth/google" class="btn-google">
                  Login with Google
              </a>
              <div className='or'>
                <div className='orfill'></div>
                <p>OU</p>
                <div className='orfill2'></div>
              </div>
            </>
          )}
          <div className='login-manparent-form'>
            <div className='login-man-form'>
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
          <img
            src="src/assets/ray-donnelly-YybYC5zC1Mk-unsplash 1.jpg"
            alt=""
            loading="lazy"
          />
        </div>
      </div>
      <div className='footer-login'>
        <p>&copy; {new Date().getFullYear()} Smm Socodam Davum. All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Login

