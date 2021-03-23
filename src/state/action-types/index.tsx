export enum ActionType {
  // settings
  CURRENT_THEME = "CURRENT_THEME",
  ACCOUNT_BALANCE = "ACCOUNT_BALANCE",
  CURRENT_PROVIDER = "CURRENT_PROVIDER",
  SET_ACTIVE_TAB = "SET_ACTIVE_TAB",
  SELECTED_NETWORK_ID = "SELECTED_NETWORK_ID",

  DEPOSIT_APPROVAL_STATUS = "DEPOSIT_APPROVAL_STATUS",
  DEPOSIT_ACTION = "DEPOSIT_ACTION",
  DEPOSIT_SUCCESS = "DEPOSIT_SUCCESS",
  DEPOSIT_FAILED = "DEPOSIT_FAILED",
  DEPOSIT_STATUS = "DEPOSIT_STATUS",
  DEPOSIT_AMOUNT = "DEPOSIT_AMOUNT",

  DONATE_APPROVAL_STATUS = "DONATE_APPROVAL_STATUS",
  DONATE_ACTION = "",
  DONATE_SUCCESS = "DONATE_SUCCESS",
  DONATE_FAILED = "DONATE_FAILED",
  GET_DONATION_CONTRACT = "GET_DONATION_CONTRACT",

  CONNECT_WALLET = "CONNECT_WALLET",
  CONNECT_WALLET_ERROR = "CONNECT_WALLET_ERROR",
  CONNECT_WALLET_SUCCESS = "CONNECT_WALLET_SUCCESS",

  REDEEM_SUCCESS = "REDEEM_SUCCESS",
  REDEEM_FAILED = "REDEEM_FAILED",

  CREATE_POOL_SUCCESS = "CREATE_POOL_SUCCESS",

  TOKEN_DETAIL = "TOKEN_DETAIL",
  GET_TOKEN_LIST_REQUEST = "GET_TOKEN_LIST_REQUEST",
  GET_TOKEN_LIST = "GET_TOKEN_LIST",
  TOKEN_LIST_TOGGLE = "TOKEN_LIST_TOGGLE",
  SET_SEARCHED_TOKEN = "SET_SEARCHED_TOKEN",
}
