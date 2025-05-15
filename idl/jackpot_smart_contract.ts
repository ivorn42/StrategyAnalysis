/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/jackpot_smart_contract.json`.
 */
export type JackpotSmartContract = {
  "address": "DZQyG4Xsgt8vGvaWEPHyTgzmHYz4V9qrw7eirpBidXU9",
  "metadata": {
    "name": "jackpotSmartContract",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimReward",
      "discriminator": [
        149,
        95,
        181,
        242,
        94,
        90,
        158,
        162
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "globalVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "winner",
          "writable": true,
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "gameGround",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  66,
                  79,
                  78,
                  68,
                  73,
                  78,
                  71,
                  95,
                  67,
                  85,
                  82,
                  86,
                  69
                ]
              },
              {
                "kind": "arg",
                "path": "roundNum"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "roundNum",
          "type": "u64"
        }
      ]
    },
    {
      "name": "configure",
      "discriminator": [
        245,
        7,
        108,
        117,
        95,
        196,
        54,
        217
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "globalVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "newConfig",
          "type": {
            "defined": {
              "name": "config"
            }
          }
        }
      ]
    },
    {
      "name": "createGame",
      "discriminator": [
        124,
        69,
        75,
        66,
        184,
        220,
        72,
        206
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "globalVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "gameGround",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  66,
                  79,
                  78,
                  68,
                  73,
                  78,
                  71,
                  95,
                  67,
                  85,
                  82,
                  86,
                  69
                ]
              },
              {
                "kind": "account",
                "path": "global_config.game_round",
                "account": "config"
              }
            ]
          }
        },
        {
          "name": "random",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  111,
                  45,
                  118,
                  114,
                  102,
                  45,
                  114,
                  97,
                  110,
                  100,
                  111,
                  109,
                  110,
                  101,
                  115,
                  115,
                  45,
                  114,
                  101,
                  113,
                  117,
                  101,
                  115,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "force"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                7,
                71,
                177,
                26,
                250,
                145,
                180,
                209,
                249,
                34,
                242,
                123,
                14,
                186,
                193,
                218,
                178,
                59,
                33,
                41,
                164,
                190,
                243,
                79,
                50,
                164,
                123,
                88,
                245,
                206,
                252,
                120
              ]
            }
          }
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  111,
                  45,
                  118,
                  114,
                  102,
                  45,
                  110,
                  101,
                  116,
                  119,
                  111,
                  114,
                  107,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  117,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                7,
                71,
                177,
                26,
                250,
                145,
                180,
                209,
                249,
                34,
                242,
                123,
                14,
                186,
                193,
                218,
                178,
                59,
                33,
                41,
                164,
                190,
                243,
                79,
                50,
                164,
                123,
                88,
                245,
                206,
                252,
                120
              ]
            }
          }
        },
        {
          "name": "vrf",
          "address": "VRFzZoJdhFWL8rkvu87LpKM3RbcVezpMEc6X5GVDr7y"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "force",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "roundTime",
          "type": "i64"
        },
        {
          "name": "minDepositAmount",
          "type": "u64"
        },
        {
          "name": "maxJoinerCount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "joinGame",
      "discriminator": [
        107,
        112,
        18,
        38,
        56,
        173,
        60,
        128
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "globalVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "teamWallet",
          "writable": true
        },
        {
          "name": "joiner",
          "writable": true,
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "gameGround",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  66,
                  79,
                  78,
                  68,
                  73,
                  78,
                  71,
                  95,
                  67,
                  85,
                  82,
                  86,
                  69
                ]
              },
              {
                "kind": "arg",
                "path": "roundNum"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "roundNum",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setWinner",
      "discriminator": [
        207,
        149,
        39,
        13,
        31,
        233,
        182,
        109
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "globalVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "gameGround",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  66,
                  79,
                  78,
                  68,
                  73,
                  78,
                  71,
                  95,
                  67,
                  85,
                  82,
                  86,
                  69
                ]
              },
              {
                "kind": "arg",
                "path": "roundNum"
              }
            ]
          }
        },
        {
          "name": "random",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "roundNum",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "gameGround",
      "discriminator": [
        83,
        177,
        70,
        183,
        113,
        223,
        206,
        38
      ]
    },
    {
      "name": "networkState",
      "discriminator": [
        212,
        237,
        148,
        56,
        97,
        245,
        51,
        169
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "valueTooSmall",
      "msg": "valueTooSmall"
    },
    {
      "code": 6001,
      "name": "valueTooLarge",
      "msg": "valueTooLarge"
    },
    {
      "code": 6002,
      "name": "valueInvalid",
      "msg": "valueInvalid"
    },
    {
      "code": 6003,
      "name": "incorrectAuthority",
      "msg": "incorrectAuthority"
    },
    {
      "code": 6004,
      "name": "incorrectTeamWalletAuthority",
      "msg": "incorrectTeamWalletAuthority"
    },
    {
      "code": 6005,
      "name": "incorrectPayerAuthority",
      "msg": "incorrectPayerAuthority"
    },
    {
      "code": 6006,
      "name": "incorrectConfigAccount",
      "msg": "incorrectConfigAccount"
    },
    {
      "code": 6007,
      "name": "overflowOrUnderflowOccurred",
      "msg": "Overflow or underflow occured"
    },
    {
      "code": 6008,
      "name": "invalidAmount",
      "msg": "Amount is invalid"
    },
    {
      "code": 6009,
      "name": "incorrectTeamWallet",
      "msg": "Incorrect team wallet address"
    },
    {
      "code": 6010,
      "name": "gameAlreadyCompleted",
      "msg": "Can not deposit after the game is completed"
    },
    {
      "code": 6011,
      "name": "setWinnerCompleted",
      "msg": "Already set winner"
    },
    {
      "code": 6012,
      "name": "gameNotCompleted",
      "msg": "Game is not completed"
    },
    {
      "code": 6013,
      "name": "winnerClaimed",
      "msg": "Winner already claimed"
    },
    {
      "code": 6014,
      "name": "returnAmountTooSmall",
      "msg": "Return amount is too small compared to the minimum received amount"
    },
    {
      "code": 6015,
      "name": "notInitialized",
      "msg": "Global Not Initialized"
    },
    {
      "code": 6016,
      "name": "invalidGlobalAuthority",
      "msg": "Invalid Global Authority"
    },
    {
      "code": 6017,
      "name": "insufficientSol",
      "msg": "Not enough SOL received to be valid."
    },
    {
      "code": 6018,
      "name": "arithmeticError",
      "msg": "Arithmetic Error"
    },
    {
      "code": 6019,
      "name": "mathOverflow",
      "msg": "Math Overflow"
    },
    {
      "code": 6020,
      "name": "endTimeError",
      "msg": "End time is error"
    },
    {
      "code": 6021,
      "name": "roundTimeError",
      "msg": "Round time is error"
    },
    {
      "code": 6022,
      "name": "minDepositAmountError",
      "msg": "Minimum Deposit Amount is error"
    },
    {
      "code": 6023,
      "name": "maxJoinerCountError",
      "msg": "Maximum Joiner Count is error"
    },
    {
      "code": 6024,
      "name": "userCountOverError",
      "msg": "User count exceeds the maximum allowed limit"
    },
    {
      "code": 6025,
      "name": "stillProcessing",
      "msg": "Randomness is still being fulfilled"
    },
    {
      "code": 6026,
      "name": "depositAmountError",
      "msg": "The deposit amount must be more than the minimum deposit amount."
    },
    {
      "code": 6027,
      "name": "roundNumberError",
      "msg": "This Round not exist"
    }
  ],
  "types": [
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "payerWallet",
            "type": "pubkey"
          },
          {
            "name": "teamWallet",
            "type": "pubkey"
          },
          {
            "name": "gameRound",
            "type": "u64"
          },
          {
            "name": "platformFee",
            "type": "u64"
          },
          {
            "name": "minDepositAmount",
            "type": "u64"
          },
          {
            "name": "maxJoinerCount",
            "type": "u64"
          },
          {
            "name": "initialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "depositInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "gameGround",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "gameRound",
            "type": "u64"
          },
          {
            "name": "createDate",
            "type": "i64"
          },
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "endDate",
            "type": "i64"
          },
          {
            "name": "roundTime",
            "type": "i64"
          },
          {
            "name": "totalDeposit",
            "type": "u64"
          },
          {
            "name": "rand",
            "type": "u64"
          },
          {
            "name": "winner",
            "type": "pubkey"
          },
          {
            "name": "userCount",
            "type": "u64"
          },
          {
            "name": "minDepositAmount",
            "type": "u64"
          },
          {
            "name": "maxJoinerCount",
            "type": "u64"
          },
          {
            "name": "force",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "isCompleted",
            "type": "bool"
          },
          {
            "name": "isClaimed",
            "type": "bool"
          },
          {
            "name": "depositList",
            "type": {
              "vec": {
                "defined": {
                  "name": "depositInfo"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "networkConfiguration",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "requestFee",
            "type": "u64"
          },
          {
            "name": "fulfillmentAuthorities",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "tokenFeeConfig",
            "type": {
              "option": {
                "defined": {
                  "name": "oraoTokenFeeConfig"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "networkState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "config",
            "type": {
              "defined": {
                "name": "networkConfiguration"
              }
            }
          },
          {
            "name": "numReceived",
            "docs": [
              "Total number of received requests."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "oraoTokenFeeConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "docs": [
              "ORAO token mint address."
            ],
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "docs": [
              "ORAO token treasury account."
            ],
            "type": "pubkey"
          },
          {
            "name": "fee",
            "docs": [
              "Fee in ORAO SPL token smallest units."
            ],
            "type": "u64"
          }
        ]
      }
    }
  ]
};
