import store from '../store'
import { push } from 'react-router-redux'

// Action 表
// 注册相关动作
const LOGIN = 'Blipay/auditor/LOGIN';
const LOGIN_SUCCESS = 'Blipay/auditor/LOGIN_SUCCESS';
const LOGIN_FAIL = 'Blipay/auditor/LOGIN_FAIL';
const LOGOUT = 'Blipay/auditor/LOGOUT';
const LOGOUT_SUCCESS = 'Blipay/auditor/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'Blipay/auditor/LOGOUT_FAIL';
// 获得个人信息
const LOAD_ACCOUNT_INFO = 'Blipay/auditor/LOAD_ACCOUNT_INFO';
const LOAD_ACCOUNT_INFO_SUCCESS = 'Blipay/auditor/LOAD_ACCOUNT_INFO_SUCCESS';
const LOAD_ACCOUNT_INFO_FAIL = 'Blipay/auditor/LOAD_ACCOUNT_INFO_FAIL';
// 获得交易记录
const LOAD_TRANSACTIONS = 'Blipay/auditor/LOAD_TRANSACTIONS';
const LOAD_TRANSACTIONS_SUCCESS = 'Blipay/auditor/LOAD_TRANSACTIONS_SUCCESS';
const LOAD_TRANSACTIONS_FAIL = 'Blipay/auditor/LOAD_TRANSACTIONS_FAIL';

const LOAD_LOG = 'Blipay/auditor/LOAD_LOG';
const LOAD_LOG_SUCCESS = 'Blipay/auditor/LOAD_LOG_SUCCESS';
const LOAD_LOG_FAIL = 'Blipay/auditor/LOAD_LOG_FAIL';

const messages = {
  USER_NOT_EXIST: '审计员账号错误或不存在。',
  INVALID_USERNAME_OR_PASSWORD: '账号或密码错误。'
}

// 用户管理模块初始状态
const initialState = {
  user: null,
  message: null
}

// Action Creators
export const login = (data) => ({
  types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
  promise: (client) => client.post('/api/auditor/login', data)
})

export const logout = () => ({
  types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
  promise: (client) => client.get('/api/auditor/logout')
})

export const loadAccountInfo = () => ({
  types: [LOAD_ACCOUNT_INFO, LOAD_ACCOUNT_INFO_SUCCESS, LOAD_ACCOUNT_INFO_FAIL],
  promise: (client) => client.get('/api/auditor/info')
})

export const loadTransactions = () => ({
  types: [LOAD_TRANSACTIONS, LOAD_TRANSACTIONS_SUCCESS, LOAD_TRANSACTIONS_FAIL],
  promise: (client) => client.get('/api/auditor/transactions')
})

export const loadLog = () => ({
  types: [LOAD_LOG, LOAD_LOG_SUCCESS, LOAD_LOG_FAIL],
  promise: (client) => client.get('/api/auditor/log')
})

// Helper
const wrapTransaction = (e) => ({
  ...e,
  createdAt: new Date(e.createdAt),
  updatedAt: new Date(e.updatedAt)
})

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      setTimeout(() => {
        store.dispatch(push('/audit'))
      }, 0)
      return {
        ...state,
        message: null
      }
    case LOGOUT_SUCCESS:
      setTimeout(() => {
        store.dispatch(push('/auditor'))
      }, 0)
      return {
        ...state,
        user: null,
        message: null
      };
    case LOAD_ACCOUNT_INFO_SUCCESS:
      return {
        ...state,
        user: action.result.user,
        message: null
      }
    case LOAD_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        // 映射 transactions 里的 createdAt 和 updatedAt 变成 Date Object
        transactions: action.result.transactions.map(e => wrapTransaction(e)),
        message: null
      }
      case LOAD_LOG_SUCCESS:
      return {
        ...state,
        // 映射 transactions 里的 createdAt 和 updatedAt 变成 Date Object
        logtable: action.result.logtable.map(e => wrapTransaction(e)),
        message: null
      }
    // Errors
    case LOGIN_FAIL:
    case LOGOUT_FAIL:
      return {
        ...state,
        message: (action.error.type && messages[action.error.type]) || '未知错误'
      }
    default:
      return state
  }
}