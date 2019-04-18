import React from 'react'

export default React.createContext({
  isAuth: false,
  user: null,
  setAuthState: () => {},
})
