import BigNumber from "bignumber.js";
import {
  approveTokenMaximumValue,
  UnilendFlashLoanCoreContract,
} from "ethereum/contracts";
import { FlashloanLBCore, IERC20 } from "ethereum/contracts/FlashloanLB";
import { web3Service } from "ethereum/web3Service";
import { Dispatch } from "redux";
import { ActionType } from "state/action-types";
import { DepositAction } from "state/actions/depositA";

// Allowance Should be checked to reveal the approval state of the contract
export const checkAllowance = (
  currentProvider: any,
  address: any,
  receipentAddress: string
) => {
  return async (dispatch: Dispatch<DepositAction>) => {
    dispatch({
      type: ActionType.DEPOSIT_ALLOWANCE_ACTION,
    });
    try {
      let allowance;
      let _IERC20 = await IERC20(currentProvider, receipentAddress);
      _IERC20.methods
        .allowance(address, UnilendFlashLoanCoreContract(currentProvider))
        .call((error: any, result: any) => {
          if (!error && result) {
            allowance = result;
            if (allowance === "0") {
              dispatch({
                type: ActionType.DEPOSIT_APPROVAL_STATUS,
                payload: false, // isApproved
              });
            } else {
              localStorage.setItem("isApproving", "false");
              dispatch({
                type: ActionType.DEPOSIT_APPROVE_SUCCESS,
              });
              dispatch({
                type: ActionType.DEPOSIT_APPROVAL_STATUS,
                payload: true, // isApproved
              });
            }
          } else {
            dispatch({
              type: ActionType.DEPOSIT_ALLOWANCE_FAILED,
            });
          }
        });
    } catch (e) {
      dispatch({
        type: ActionType.DEPOSIT_ALLOWANCE_FAILED,
      });
    }
  };
};

// On Approve Action
export const depositApprove = (
  currentProvider: any,
  address: any,
  receipentAddress: string
) => {
  return async (dispatch: Dispatch<DepositAction>) => {
    dispatch({
      type: ActionType.DEPOSIT_APPROVE_ACTION,
    });
    try {
      let _IERC20 = await IERC20(currentProvider, receipentAddress);
      localStorage.setItem("isApproving", "true");
      dispatch({
        type: ActionType.DEPOSIT_APPROVAL_STATUS,
        payload: false,
      });
      _IERC20.methods
        .approve(
          UnilendFlashLoanCoreContract(currentProvider),
          approveTokenMaximumValue
        )
        .send({
          from: address,
        })
        .on("receipt", (res: any) => {
          localStorage.setItem("isApproving", "false");
          dispatch({
            type: ActionType.DEPOSIT_APPROVAL_STATUS,
            payload: true,
          });
          dispatch({
            type: ActionType.DEPOSIT_APPROVE_SUCCESS,
          });
        })
        .catch((e: Error) => {
          localStorage.setItem("isApproving", "false");
          dispatch({
            type: ActionType.DEPOSIT_APPROVE_FAILED,
          });
          dispatch({
            type: ActionType.DEPOSIT_APPROVAL_STATUS,
            payload: false,
          });
        });
    } catch (e) {
      dispatch({
        type: ActionType.DEPOSIT_APPROVE_FAILED,
      });
    }
  };
};

export const handleDeposit = (
  currentProvider: any,
  depositAmount: any,
  address: string,
  recieptAddress: string,
  isEth: boolean,
  decimal: any
) => {
  return async (dispatch: Dispatch<DepositAction>) => {
    dispatch({
      type: ActionType.DEPOSIT_ACTION,
    });
    try {
      // var fullAmount = await web3Service.getValue(
      //   false,
      //   currentProvider,
      //   depositAmount,
      //   decimal
      // );
      let fullAmount = new BigNumber(depositAmount)
        .multipliedBy(Math.pow(10, decimal))
        .toString();
      // portis.onError((error) => {
      //   console.log("error", error);
      // });
      console.log("fullAmount", fullAmount);
      FlashloanLBCore(currentProvider)
        .methods.deposit(recieptAddress, fullAmount)
        .send({
          from: address,
          value: isEth ? fullAmount : 0,
        })
        .on("receipt", (res: any) => {
          console.log(res);
          dispatch({
            type: ActionType.DEPOSIT_SUCCESS,
            payload: true,
          });
        })
        .on("error", (err: any, res: any) => {
          console.log("ERR", err, "RES", res);
          if (res === undefined) {
            dispatch({
              type: ActionType.DEPOSIT_FAILED,
              payload: false,
              message: err.message.split(":")[1],
            });
          } else {
            dispatch({
              type: ActionType.DEPOSIT_FAILED,
              payload: false,
              message: "Transaction Failed: Transaction has been reverted",
            });
          }
        })
        .catch((e: any) => {
          dispatch({
            type: ActionType.DEPOSIT_FAILED,
            payload: false,
            message: "Deposit Failed",
          });
        });
    } catch (e) {
      console.log(e);
      dispatch({
        type: ActionType.DEPOSIT_FAILED,
        payload: false,
      });
    }
  };
};
export const clearDepositError = () => {
  return async (dispatch: Dispatch<DepositAction>) => {
    dispatch({
      type: ActionType.DEPOSIT_MESSAGE_CLEAR,
    });
  };
};
