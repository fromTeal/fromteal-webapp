import React from 'react'

export default React.createContext({
  isAuth: false,
  setAuthState: (authState, user) => {},
  user: null
})
