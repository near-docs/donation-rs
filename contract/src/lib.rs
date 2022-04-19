use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::json_types::{U128};
use near_sdk::{env, log, ValidAccount, near_bindgen, Gas, PanicOnDefault};
near_sdk::setup_alloc!();

const STORAGE_COST: u128 = 100_000_000_000_000_000_000_000;


#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Donation {
  pub account_id: String,
  pub amount: U128
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
  pub beneficiary: ValidAccount;
  pub donations: PersistentVector<Donation>;
}


#[near_bindgen]
impl Contract {

    #[init]
    pub fn new(beneficiary: ValidAccount) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        Self {
          beneficiary: beneficiary,
          donations: PersistentVector<Donation>::new(b"vec-uid-1".to_vec())
        }
    }

    pub fn donate(&mut self) -> i32 {
      const donator: ValidAccount = env.predecessor_account_id();
      const amount: u128 = env.attached_amount();

      const donation_number: i32 = add_donation(donator, amount);
      log.
    }

    #[private]
    pub fn get_pool_information_callback(&mut self) -> bool {
      if env::promise_results_count() != 1 {
        log!("Expected a result on the callback");
        return false;
      }

      // Get response, return false if failed
      let pool_info: PoolInfo = match env::promise_result(0) {
          PromiseResult::Successful(value) => near_sdk::serde_json::from_slice::<PoolInfo>(&value).unwrap(),
          _ => { log!("Getting info from Pool Party failed"); return false; },
      };

      log!("{}", pool_info.available);
      return true
    }
}
