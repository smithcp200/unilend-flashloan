/* eslint-disable eqeqeq */
import axios from "axios";
import { setTimestamp, toFixed } from "components/Helpers";
import { UnilendFlashLoanCoreContract } from "ethereum/contracts";
import { BalanceContract, ERC20, MERC20 } from "ethereum/contracts/FlashloanLB";
import { errorHandler } from "index";
import { Dispatch } from "redux";
import { ActionType } from "state/action-types";
import { TokenAction } from "state/actions/tokenManageA";
import { v4 as uuidv4 } from "uuid";

export const handleTokenListToggle = (id: number) => {
  return async (dispatch: Dispatch<TokenAction>) => {
    dispatch({
      type: ActionType.TOKEN_LIST_TOGGLE,
      payload: id,
    });
  };
};
export const getTokenMetadata = async (
  currentProvider: any,
  receipentAddress: any
) => {
  //   let _ERC20 = MERC20(currentProvider, receipentAddress);
  //   console.log(_ERC20);
  //   _ERC20.methods.symbol().call((e: any, r: any) => {
  //     console.log(e, r);
  //   });
};
const getDefaultNetwork = (network) => {
  console.log(network, typeof network);
  if (network === 56 || network === 97) {
    return "56";
  } else if (network === 137 || network === 80001) {
    return "137";
  } else {
    return "1";
  }
};
export const searchToken = (
  address: string,
  networkId: any,
  selectedNetworkId: any
) => {
  return async (dispatch: Dispatch<TokenAction>) => {
    // const data = {
    //   jsonrpc: "2.0",
    //   method: "alchemy_getTokenMetadata",
    //   params: [`${address}`],
    //   id: 1,
    // };
    // if (address.length)
    //   axios
    //     .post(
    //       "https://eth-mainnet.alchemyapi.io/v2/maI7ecducWmnh8z5s2B1H2G4KzHkHMtb",
    //       JSON.stringify(data)
    //     )
    //     .then((res: any) => {
    //       if (res?.data?.result)
    //         dispatch({
    //           type: ActionType.SET_SEARCHED_TOKEN,
    //           payload: { data: res.data.result, message: null },
    //         });
    //     })
    //     .catch((e: any) => {
    //       dispatch({
    //         type: ActionType.SET_SEARCHED_TOKEN,
    //         payload: { data: null, message: "Enter valid token address" },
    //       });
    //     });

    const api = "ckey_86f9398035604a998979408cd03";

    var qs = `?key=${api}`;
    var selectedNetwork = getDefaultNetwork(networkId);
    if (address.length)
      axios
        .get(
          `https://api.covalenthq.com/v1/${selectedNetwork}/tokens/${address}/nft_metadata/111/${qs}`
        )
        .then((res: any) => {
          if (res?.data?.data === null)
            dispatch({
              type: ActionType.SET_SEARCHED_TOKEN,
              payload: { data: null, message: null },
            });
          else if (res?.data?.data) {
            let item = res.data.data.items[0];
            let body = {
              address: item.contract_address,
              decimals: item.contract_decimals,
              logoURI: item.logo_url,
              name: item.contract_name,
              symbol: item.contract_ticker_symbol,
              chainId: networkId,
              isCustomToken: true,
            };
            dispatch({
              type: ActionType.SET_SEARCHED_TOKEN,
              payload: { data: body, message: null },
            });
          }
        })
        .catch((e: any) => {
          console.log(e);

          dispatch({
            type: ActionType.SET_SEARCHED_TOKEN,
            payload: { data: null, message: "Enter valid token address" },
          });
        });
  };
};

export const searchTokenFromERC = () => {
  return async (dispatch: Dispatch<TokenAction>) => {};
};

export const resetList = () => {
  return async (dispatch: Dispatch<TokenAction>) => {
    dispatch({
      type: ActionType.GET_TOKEN_LIST,
      payload: [],
    });
  };
};

export const getErcTokenDetail = () => {
  return async (dispatch: Dispatch<TokenAction>) => {};
};

// export const fetchTokenList = (
//   tokenList: any,
//   networkId: any,
//   currentProvider: any,
//   accounts: any,
//   accountBalance: any,
//   selectedNetworkId: any
// ) => {
//   return async (dispatch: Dispatch<TokenAction>) => {
//     let timestamp = setTimestamp();
//     let totalTokenList: any = [];
//     // dispatch({ type: ActionType.GET_TOKEN_LIST_REQUEST });
//     if (tokenList) {
//       console.log(tokenList);
//       let _enableChecked = tokenList.some((item: any) => item.isEnabled);

//       _enableChecked
//         ? tokenList.forEach((token: any, i: any) => {
//             if (token.isEnabled) {
//               console.log(token);
//               axios.get(`${token.fetchURI}?t=${timestamp}`).then((res) => {
//                 let tokens = [...res.data.tokens];
//                 if (res.data) {
//                   const tokenList: any = tokens.filter((item: any) => {
//                     // eslint-disable-next-line eqeqeq
//                     return item.chainId == networkId;
//                   });
//                   let addresses = tokenList.map((item: any) => {
//                     return item.address;
//                   });
//                   totalTokenList.push(...tokenList);
//                   console.log(totalTokenList);

//                 }
//               });
//               if (i === tokenList.length - 1) {
//                 dispatch({
//                   type: ActionType.GET_TOKEN_LIST,
//                   payload: totalTokenList,
//                 });
//               }
//             }
//           })
//         : dispatch({
//             type: ActionType.GET_TOKEN_LIST,
//             payload: [],
//           });
//     }
//   };
// };

export const fetchTokenList = (
  tokenList: any,
  networkId: any,
  currentProvider: any,
  accounts: any,
  accountBalance: any,
  selectedNetworkId: any,
  customTokens: any
) => {
  return async (dispatch: Dispatch<TokenAction>) => {
    let timestamp = setTimestamp();
    let totalTokenList: any = [];
    dispatch({ type: ActionType.GET_TOKEN_LIST_REQUEST });
    if (tokenList) {
      let _enableChecked = tokenList.some((item: any) => item.isEnabled);
      _enableChecked
        ? tokenList.forEach((item: any, index: any) => {
            if (item.isEnabled) {
              axios
                .get(`${item.fetchURI}?t=${timestamp}`)
                .then((res) => {
                  // console.log(customTokens);
                  let tokens = [...res.data.tokens, ...customTokens];
                  // console.log(tokens);
                  if (res.data) {
                    const tokenList: any = tokens.filter((item: any) => {
                      if (accounts.length) {
                        // eslint-disable-next-line eqeqeq
                        return item.chainId == networkId;
                      } else {
                        if (selectedNetworkId === 1) {
                          return item.chainId == 1;
                        } else if (selectedNetworkId === 3) {
                          return item.chainId == 137;
                        }
                      }
                    });
                    console.log(tokenList);
                    let addresses = tokenList.map((item: any) => {
                      return item.address;
                    });

                    if (currentProvider) {
                      let timestamp = setTimestamp();
                      try {
                        if (accountBalance > 0) {
                          BalanceContract(currentProvider)
                            .methods.getUserBalances(
                              UnilendFlashLoanCoreContract(
                                currentProvider,
                                selectedNetworkId
                              ),
                              accounts[0],
                              addresses,
                              timestamp
                            )
                            .call((error: any, result: any) => {
                              if (!error && result) {
                                tokenList.forEach((item: any, i: number) => {
                                  let fullAmount = toFixed(
                                    result[0][i] / Math.pow(10, item.decimals),
                                    3
                                  );
                                  let underlyingBalance = toFixed(
                                    result[1][i] / Math.pow(10, item.decimals),
                                    3
                                  );
                                  item["balance"] = fullAmount;
                                  item["underlyingBalance"] = underlyingBalance;
                                  totalTokenList.push(item);
                                  if (i === tokenList.length - 1) {
                                    totalTokenList.sort(function (a, b) {
                                      if (a.symbol < b.symbol) {
                                        return -1;
                                      }
                                      if (a.symbol > b.symbol) {
                                        return 1;
                                      }
                                      return 0;
                                    });
                                    dispatch({
                                      type: ActionType.GET_TOKEN_LIST,
                                      payload: totalTokenList,
                                    });
                                  }
                                  // return totalTokenList;
                                });
                              } else {
                                tokenList.forEach((item: any, i: number) => {
                                  item["balance"] = "";
                                  item["underlyingBalance"] = "";
                                  totalTokenList.push(item);
                                  if (i === tokenList.length - 1) {
                                    totalTokenList.sort(function (a, b) {
                                      if (a.symbol < b.symbol) {
                                        return -1;
                                      }
                                      if (a.symbol > b.symbol) {
                                        return 1;
                                      }
                                      return 0;
                                    });

                                    dispatch({
                                      type: ActionType.GET_TOKEN_LIST,
                                      payload: totalTokenList,
                                    });
                                  }
                                });
                              }
                            });
                        } else {
                          tokenList.forEach((item: any, i: number) => {
                            item["balance"] = "";
                            item["underlyingBalance"] = "";
                            totalTokenList.push(item);
                            if (i === tokenList.length - 1) {
                              totalTokenList.sort(function (a, b) {
                                if (a.symbol < b.symbol) {
                                  return -1;
                                }
                                if (a.symbol > b.symbol) {
                                  return 1;
                                }
                                return 0;
                              });

                              dispatch({
                                type: ActionType.GET_TOKEN_LIST,
                                payload: totalTokenList,
                              });
                            }
                          });
                        }
                      } catch (e) {
                        errorHandler.report(e);

                        dispatch({
                          type: ActionType.GET_TOKEN_LIST,
                          payload: tokenList,
                        });
                      }
                      // dispatch({
                      //   type: ActionType.GET_TOKEN_LIST,
                      //   payload: totalTokenList,
                      // });
                    } else {
                      if (tokenList) totalTokenList.push(...tokenList);
                      dispatch({
                        type: ActionType.GET_TOKEN_LIST,
                        payload: totalTokenList,
                      });
                    }
                  } else {
                    dispatch({
                      type: ActionType.GET_TOKEN_LIST,
                      payload: [],
                    });
                  }
                })
                .catch((e: any) => {
                  dispatch({
                    type: ActionType.GET_TOKEN_LIST,
                    payload: [],
                  });
                });
            }
          })
        : dispatch({
            type: ActionType.GET_TOKEN_LIST,
            payload: [],
          });
    }
  };
};
const getTokenGroup = () => {
  return localStorage.getItem("tokenGroup");
};
export const handleTokenPersist = (token: any, selectedNetworkId: any) => {
  return async (dispatch: Dispatch<TokenAction>) => {
    let _allToken: any = [];
    if (getTokenGroup()) {
      console.log("Loading Catched");
      let tg: any = localStorage.getItem("tokenGroup");
      let parsed = JSON.parse(tg);
      dispatch({
        type: ActionType.SET_TOKEN_PERSIST,
        payload: parsed,
      });
    } else {
      console.log("Loading Default");
      // localStorage.getItem("tokenGroup");
      token.forEach((item) => {
        axios.get(item.url).then((res) => {
          // if (selectedNetworkId === )
          _allToken.push({
            id: uuidv4(),
            name: res.data.name,
            icon: res.data.logoURI,
            token: res.data.tokens.length,
            fetchURI: item.url,
            isEnabled: item.isEnabled,
          });
          dispatch({
            type: ActionType.SET_TOKEN_PERSIST,
            payload: _allToken,
          });
        });
      });
    }
  };
};

export const handleCustomTokens = () => {
  return async (dispatch: Dispatch<TokenAction>) => {
    if (localStorage.getItem("customTokens")) {
      let _parsed: any = localStorage.getItem("customTokens");
      dispatch({
        type: ActionType.SET_CUSTOM_TOKEN_PERSIST,
        payload: JSON.parse(_parsed),
      });
    }
  };
};

export const setCustomToken = (tokens: any, type: any) => {
  return async (dispatch: Dispatch<TokenAction>) => {
    dispatch({
      type: ActionType.SET_CUSTOM_TOKENS,
      payload: tokens,
      calc: type,
    });
  };
};

export const removeCustomToken = () => {
  return async (dispatch: Dispatch<TokenAction>) => {};
};

export const resetCustomToken = () => {
  return async (dispatch: Dispatch<TokenAction>) => {
    dispatch({
      type: ActionType.SET_CUSTOM_TOKEN_PERSIST,
      payload: [],
    });
  };
};
