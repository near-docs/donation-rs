import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['get_donation_list', 'get_donation'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['donate'],
  })
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName)
}

// Contract's methods
export async function get_donation_list(from, until) {
  let donation_list = await get_donation_list(from, until)

  for (let i = 0; i <= until - from; i++) {
    // transform from yocto NEAR to NEAR
    donation_list[i].amount = formatNearAmount(donation_list[i].amount)
  }

  return donation_list
}

export async function donate(amount) {
  // pass the amount to yocto NEAR
  let yn_amount = parseNearAmount(amount.toString())
  return await contract.account.functionCall(
    {
      contractId: nearConfig.contractName,
      methodName: 'donate',
      args: {},
      gas: 5 * TGAS,
      attachedDeposit: yn_amount
    }
  )
}