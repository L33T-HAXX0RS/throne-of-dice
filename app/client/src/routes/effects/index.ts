import { all } from 'typed-redux-saga/macro'
import { appRouteSaga } from '../app'

export const routeSagas = all({ appRouteSaga })
