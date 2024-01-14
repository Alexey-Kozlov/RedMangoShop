import React from 'react'
import { AdminAuth } from '../HOC'

function TestAuthAdmin() {
  return (
    <div>Досткупно только для админов (с ролью admin)</div>
  )
}

export default AdminAuth(TestAuthAdmin);