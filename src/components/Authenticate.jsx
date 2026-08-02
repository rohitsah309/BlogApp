import { useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Authenticate({children, authentication = true}) {
    const navigate = useNavigate()
    const authStatus = useSelector(state => state.auth.status)
    
    useEffect(() => {
        if(authentication && authStatus !== authentication) {
            navigate("/login")
        } else if (!authentication && authStatus !== authentication) {
            navigate("/")
        }

    }, [authStatus, navigate, authentication])

    if (authStatus === null) {
        return <h1>Loading...</h1>;
    }


    return <>{children}</>;
    
  
}

