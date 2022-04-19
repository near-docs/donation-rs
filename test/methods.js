const { wallet_balance, create_contract } = require('./utils')
const { utils: { format: { formatNearAmount, parseNearAmount } }, } = nearAPI

const TGAS = 1000000000000

// Contract methods
donate = async function (amount, contract) {
	amount = parseNearAmount(amount.toString())
	return await contract.account.functionCall(
		{ contractId: nearConfig.contractName, methodName: 'donate', args: {},
			gas: 5*TGAS, attachedDeposit: amount }
	)
}

init = async function (beneficiary, contract) {
	return await contract.init({args:{beneficiary}})
}

// Class to simplify interacting with the contract
class User {
	constructor(accountId) {
		this.accountId = accountId;
		this.contract;
	}

  init(beneficiary) { return init(beneficiary, this.contract) }
	donate(amount) { return donate(amount, this.contract) }
}

async function create_user(accountId) {
	let user = new User(accountId)
	const viewMethods = ['get_donation']
	const changeMethods = ['donate']
	user.contract = await create_contract(accountId, viewMethods, changeMethods)
	return user
}

module.exports = { create_user, wallet_balance }