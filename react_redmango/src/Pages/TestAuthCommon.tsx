import React from 'react'
import { Auth } from '../HOC'

function TestAuthCommon() {
  return (
    <div>Доступно для всех пользователей</div>
  )
}

export default Auth(TestAuthCommon);