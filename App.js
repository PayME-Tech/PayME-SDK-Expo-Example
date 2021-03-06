/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react"
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import PaymeSDK from "expo-payme-sdk"
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons"
import Constants from "expo-constants"
import { ActivityIndicator } from "react-native"
import { encryptAES } from "./createConnectToken"
import PickerModal from "react-native-picker-modal-view"

const CONFIGS = {
  sandbox: {
    appToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6MTQsImlhdCI6MTYxNDE2NDI3MH0.MmzNL81YTx8XyTu6SczAqZtnCA_ALsn9GHsJGBKJSIk",
    publicKey: `-----BEGIN PUBLIC KEY-----
      MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMyTFdiYBiaSIBgqFdxSgzk5LYXKocgT
      MCx/g1gz9k2jadJ1PDohCs7N65+dh/0dTbT8CIvXrrlAgQT1zitpMPECAwEAAQ==
      -----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
      MIIBOQIBAAJAZCKupmrF4laDA7mzlQoxSYlQApMzY7EtyAvSZhJs1NeW5dyoc0XL
      yM+/Uxuh1bAWgcMLh3/0Tl1J7udJGTWdkQIDAQABAkAjzvM9t7kD84PudR3vEjIF
      5gCiqxkZcWa5vuCCd9xLUEkdxyvcaLWZEqAjCmF0V3tygvg8EVgZvdD0apgngmAB
      AiEAvTF57hIp2hkf7WJnueuZNY4zhxn7QNi3CQlGwrjOqRECIQCHfqO53A5rvxCA
      ILzx7yXHzk6wnMcGnkNu4b5GH8usgQIhAKwv4WbZRRnoD/S+wOSnFfN2DlOBQ/jK
      xBsHRE1oYT3hAiBSfLx8OAXnfogzGLsupqLfgy/QwYFA/DSdWn0V/+FlAQIgEUXd
      A8pNN3/HewlpwTGfoNE8zCupzYQrYZ3ld8XPGeQ=
      -----END RSA PRIVATE KEY-----`,
    env: "SANDBOX",
    secretKey: "de7bbe6566b0f1c38898b7751b057a94",
    appId: "14",
    storeId: 24088141,
  },
  dev: {
    appToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6MTIsImlhdCI6MTYyMDg4MjQ2NH0.DJfi52Dc66IETflV2dQ8G_q4oUAVw_eG4TzrqkL0jLU",
    publicKey: `-----BEGIN PUBLIC KEY-----
      MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJi70XBS5+LtaCrNsrnWlVG6xec+J9M1
      DzzvsmDfqRgTIw7RQ94SnEBBcTXhaIAZ8IW7OIWkVU0OXcybQEoLsdUCAwEAAQ==
      -----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
      MIIBOgIBAAJBAIA7GmDWkjuOQsx99tACXhOlJ4atsBN0YMPEmKhi9Ewk6bNBPvaX
      pRMWjn7c8GfWrFUIVqlrvSlMYxmW/XaATjcCAwEAAQJAKZ6FPj8GcWwIBEUyEWtj
      S28EODMxfe785S1u+uA7OGcerljPNOTme6iTuhooO5pB9Q5N7nB2KzoWOADwPOS+
      uQIhAN2S5dxxadDL0wllNGeux7ltES0z2UfW9+RViByX/fAbAiEAlCd86Hy6otfd
      k9K2YeylsdDwZfmkKq7p27ZcNqVUlBUCIQCxzEfRHdzoZDZjKqfjrzerTp7i4+Eu
      KYzf19aSA1ENEwIgAnyXMB/H0ivlYDHNNd+O+GkVX+DMzJqa+kEZUyF7RfECICtK
      rkcDyRzI6EtUFG+ALQOUliRRh7aiGXXZYb2KnlKy
      -----END RSA PRIVATE KEY-----`,
    env: "DEV",
    secretKey: "34cfcd29432cdd5feaecb87519046e2d",
    appId: "12",
    storeId: 9,
  },
}

const dataEnv = [
  { Id: "1", Name: "sandbox", Value: "1" },
  { Id: "2", Name: "dev", Value: "2" },
]

export default function App() {
  const refPaymeSDK = React.useRef(null)

  const [env, setEnv] = useState("sandbox")

  const [listService, setListService] = useState([])
  const [serviceSelected, setServiceSelected] = useState("MOBILE_CARD")

  useEffect(() => {
    if (listService.length > 0) {
      setServiceSelected(listService[0]?.Value)
    }
  }, [listService])

  const [userID, setUserID] = useState("")

  const [phone, setPhone] = useState("")

  const [balancce, setBalance] = useState(0)

  const [moneyDeposit, setMoneyDeposit] = useState("10000")
  const [moneyWithdraw, setMoneyWithdraw] = useState("10000")
  const [moneyTransfer, setMoneyTransfer] = useState("10000")
  const [moneyPay, setMoneyPay] = useState("10000")

  const [appId, setAppId] = useState(CONFIGS[env].appId)
  const [appToken, setAppToken] = useState(CONFIGS[env].appToken)
  const [appPublicKey, setAppPublicKey] = useState(CONFIGS[env].publicKey)
  const [appPrivateKey, setAppPrivateKey] = useState(CONFIGS[env].privateKey)
  const [appSecretkey, setAppSecretkey] = useState(CONFIGS[env].secretKey)

  const [showLog, setShowLog] = useState(false)
  const [showSetting, setShowSetting] = useState(false)

  const [isLogin, setIsLogin] = useState(false)

  const [loadingApp, setLoadingApp] = useState(false)
  // useEffect(() => {
  //   setLoadingApp(false)
  // },[])

  const handleRestoreDefault = () => {
    setAppId(CONFIGS[env].appId)
    setAppToken(CONFIGS[env].appToken)
    setAppPublicKey(CONFIGS[env].publicKey)
    setAppPrivateKey(CONFIGS[env].privateKey)
    setAppSecretkey(CONFIGS[env].secretKey)
    setShowLog(false)
    setIsLogin(false)
  }

  const handleChangeEnv = env => {
    setAppId(CONFIGS[env].appId)
    setAppToken(CONFIGS[env].appToken)
    setAppPublicKey(CONFIGS[env].publicKey)
    setAppPrivateKey(CONFIGS[env].privateKey)
    setAppSecretkey(CONFIGS[env].secretKey)
    setIsLogin(false)
  }

  const handleSave = () => {
    setShowSetting(false)
    setIsLogin(false)
  }

  const checkMoney = money => {
    const m = Number(money)
    if (m < 10000) {
      alert("Vui l??ng nh???p s??? ti???n l???n h??n 10,000 ??.")
      return false
    } else if (m >= 100000000) {
      alert("Vui l??ng nh???p s??? ti???n nh??? h??n 100,000,000 ??.")
      return false
    }
    return true
  }
  const checkUserId = () => {
    if (userID === "") {
      alert("userID is required!")
      return false
    }
    if (phone === "") {
      alert("Phone Number is required!")
      return false
    }
    if (!/^(0|84)\d{9}$/g.test(phone)) {
      alert("S??? ??i???n tho???i kh??ng h???p l???!")
      return false
    }
    return true
  }

  const handleLogin = async () => {
    setBalance(0)
    setIsLogin(false)
    if (!checkUserId()) {
      return
    }
    setLoadingApp(true)
    Keyboard.dismiss()

    const data = {
      userId: userID,
      phone,
      timestamp: Date.now(),
    }

    const connectToken = encryptAES(JSON.stringify(data), appSecretkey)

    const configs = {
      connectToken,
      appToken,
      clientId: Constants.deviceId,
      env,
      showLog: showLog ? "1" : "0",
      publicKey: appPublicKey,
      privateKey: appPrivateKey,
      appId: appId,
      phone,
      ...(Platform.OS === "ios" && {
        partner: {
          paddingTop: 30,
        },
      }),
    }
    refPaymeSDK.current?.login(
      configs,
      respone => {
        console.log("respone login", respone)
        alert("Login th??nh c??ng")
        setIsLogin(true)
        setLoadingApp(false)
        getWalletInfo()
        getListService()
      },
      error => {
        console.log("error login", error)
        alert(error?.message ?? "Login th???t b???i")
        setIsLogin(false)
        setLoadingApp(false)
      }
    )
  }

  const onLogout = () => {
    setUserID("")
    setPhone("")
    setIsLogin(false)
  }

  const handlePressOpen = () => {
    refPaymeSDK.current?.openWallet(
      response => {
        console.log("response openWallet", response)
      },
      error => {
        console.log("error openWallet", error)
        alert(error?.message ?? "error openWallet")
      }
    )
  }

  const getWalletInfo = () => {
    console.log('getWalletInfo')
    return new Promise(resole => {
      refPaymeSDK.current?.getWalletInfo(
        response => {
          console.log("response getWalletInfo", response)
          setBalance(response?.balance ?? 0)
          resole(true)
        },
        error => {
          console.log("error getWalletInfo", error)
          setBalance(0)
          resole(true)
        }
      )
    })
  }

  const getAccountInfo = () => {
    refPaymeSDK.current?.getAccountInfo(
      response => {
        console.log("response getAccountInfo", response)
        alert(JSON.stringify(response))
      },
      error => {
        console.log("error getAccountInfo", error)
        alert(error.message ?? "error getAccountInfo")
      }
    )
  }

  const deposit = () => {
    if (!checkMoney(moneyDeposit)) {
      return
    }
    refPaymeSDK.current?.deposit(
      {
        amount: Number(moneyDeposit),
        description: "description"
      },
      response => {
        console.log("response deposit", response)
      },
      error => {
        console.log("error deposit", error)
        alert(error?.message ?? "error deposit")
      }
    )
  }
  const withdraw = () => {
    if (!checkMoney(moneyWithdraw)) {
      return
    }
    refPaymeSDK.current?.withdraw(
      {
        amount: Number(moneyWithdraw),
        description: "description",
      },
      response => {
        console.log("response withdraw", response)
      },
      error => {
        console.log("error withdraw", error)
        alert(error?.message ?? "error withdraw")
      }
    )
  }

  const transfer = () => {
    if (!checkMoney(moneyTransfer)) {
      return
    }
    refPaymeSDK.current?.transfer(
      {
        amount: Number(moneyTransfer),
        description: "Chuy???n ti???n",
        closeWhenDone: true
      },
      response => {
        console.log("response transfer", response)
      },
      error => {
        console.log("error transfer", error)
        alert(error?.message ?? "error transfer")
      }
    )
  }

  const getListService = () => {
    console.log('getListService')
    refPaymeSDK.current?.getListService(
      response => {
        console.log("response getListService", response)
        if (Array.isArray(response)) {
          setListService(
            response
              ?.filter(i => i?.enable === true)
              .map((i, index) => ({ Id: `${index}`, Name: `${i?.description}`, Value: `${i?.code}` })) ?? []
          )
        }
      },
      error => {
        console.log("error getListService", error)
        alert(error?.message ?? "error getListService")
      }
    )
  }

  const openService = () => {
    refPaymeSDK.current?.openService(
      serviceSelected ?? "MOBILE_CARD",
      response => {
        console.log("response openService", response)
      },
      error => {
        console.log("error openService", error)
        alert(error?.message ?? "error openService")
      }
    )
  }

  const getListPaymentMethod = () => {
    setLoadingApp(true)
    const storeId = CONFIGS[env].storeId
    refPaymeSDK.current?.getListPaymentMethod(
      storeId,
      response => {
        console.log("response getListPaymentMethod", response)
        alert(JSON.stringify(response))
        setLoadingApp(false)
      },
      error => {
        console.log("error getListPaymentMethod", error)
        alert(error.message ?? "error getAccountInfo")
        setLoadingApp(false)
      }
    )
  }

  const pay = () => {
    if (!checkMoney(moneyPay)) {
      return
    }
    const data = {
      amount: env === "sandbox" ? Number(moneyPay) : 10000,
      orderId: Date.now().toString(),
      storeId: CONFIGS[env].storeId,
      note: "note",
      // method: {
      //   type: 'WALLET'
      // }
    }
    refPaymeSDK.current?.pay(
      data,
      response => {
        console.log("response pay", response)
      },
      error => {
        console.log("error pay", error)
        alert(error?.message ?? 'error pay');
      }
    )
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1, marginTop: 20, padding: Platform.OS === "ios" ? 16 : 0 }}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text>Enviroment</Text>
              <View>
                <PickerModal
                  items={dataEnv}
                  onSelected={i => {
                    if (i.Name) {
                      setEnv(i.Name)
                      handleChangeEnv(i.Name)
                    }
                  }}
                  selected={dataEnv[0]}
                />
              </View>
              <TouchableOpacity onPress={() => setShowSetting(!showSetting)}>
                <AntDesign name="setting" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {showSetting ? (
              <>
                <Text style={{ marginTop: 10 }}>App ID</Text>

                <TextInput
                  style={styles.inputToken}
                  value={appId}
                  onChangeText={text => setAppId(text)}
                  placeholder="Nh???p App SecretKey Key"
                />

                <Text style={{ marginTop: 10 }}>App Token</Text>

                <TextInput
                  style={styles.inputToken}
                  value={appToken}
                  onChangeText={text => setAppToken(text)}
                  placeholder="Nh???p App Token"
                />

                <Text style={{ marginTop: 10 }}>App Public Key</Text>

                <TextInput
                  style={styles.inputToken}
                  value={appPublicKey}
                  onChangeText={text => setAppPublicKey(text)}
                  placeholder="Nh???p Public Key"
                  multiline
                />
                <Text style={{ marginTop: 10 }}>App Private Key</Text>

                <TextInput
                  style={styles.inputToken}
                  value={appPrivateKey}
                  onChangeText={text => setAppPrivateKey(text)}
                  placeholder="Nh???p Private Key"
                  multiline
                />

                <Text style={{ marginTop: 10 }}>App SecretKey Key</Text>

                <TextInput
                  style={styles.inputToken}
                  value={appSecretkey}
                  onChangeText={text => setAppSecretkey(text)}
                  placeholder="Nh???p App SecretKey Key"
                />

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity activeOpacity={0.7} onPress={() => setShowLog(!showLog)}>
                    <MaterialIcons name={showLog ? "check-box" : "check-box-outline-blank"} size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={{ marginLeft: 10 }}>Show Log</Text>
                </View>

                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    marginTop: 10,
                    marginBottom: Platform.OS === "ios" ? 20 : 0,
                  }}
                >
                  <TouchableOpacity style={styles.btnLogin} activeOpacity={0.7} onPress={handleRestoreDefault}>
                    <Text>RESTORE DEFAULT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnLogin, { marginLeft: 15 }]}
                    activeOpacity={0.7}
                    onPress={handleSave}
                  >
                    <Text>SAVE</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={{ width: "100%" }}>
                  <Text style={{ marginBottom: 5 }}>UserID</Text>
                  <TextInput
                    style={styles.inputPhone}
                    value={userID}
                    onChangeText={text => setUserID(text)}
                    placeholder="required"
                    keyboardType="numeric"
                  />
                </View>

                <View style={{ width: "100%", marginTop: 10 }}>
                  <Text style={{ marginBottom: 5 }}>Phone Number</Text>
                  <TextInput
                    style={styles.inputPhone}
                    value={phone}
                    onChangeText={text => setPhone(text)}
                    placeholder="optional"
                    keyboardType="numeric"
                  />
                </View>

                <View style={{ width: "100%", marginTop: 10, flexDirection: "row" }}>
                  <TouchableOpacity style={styles.btnLogin} activeOpacity={0.7} onPress={handleLogin}>
                    <Text>LOGIN</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnLogin, { marginLeft: 15 }]}
                    activeOpacity={0.7}
                    onPress={onLogout}
                  >
                    <Text>LOGOUT</Text>
                  </TouchableOpacity>
                </View>

                {isLogin && (
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: "#e9e9e9",
                      padding: 16,
                      marginTop: 15,
                      borderRadius: 5,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text>Balance</Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ marginRight: 10 }}>{`${balancce} ??`}</Text>
                        <TouchableOpacity onPress={getWalletInfo}>
                          <FontAwesome name="refresh" size={24} color="black" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.btnOpenWallet} activeOpacity={0.8} onPress={handlePressOpen}>
                      <Text>OPEN WALLET</Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        marginTop: 15,
                      }}
                    >
                      <TouchableOpacity style={styles.btnDeposit} activeOpacity={0.8} onPress={deposit}>
                        <Text>DEPOSIT</Text>
                      </TouchableOpacity>
                      <TextInput
                        style={styles.inputMoney}
                        value={moneyDeposit}
                        onChangeText={text => setMoneyDeposit(text)}
                        placeholder="Nh???p s??? ti???n"
                        keyboardType="numeric"
                        maxLength={9}
                      />
                    </View>

                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        marginTop: 15,
                      }}
                    >
                      <TouchableOpacity style={styles.btnDeposit} activeOpacity={0.8} onPress={withdraw}>
                        <Text>WITHDRAW</Text>
                      </TouchableOpacity>
                      <TextInput
                        style={styles.inputMoney}
                        value={moneyWithdraw}
                        onChangeText={text => setMoneyWithdraw(text)}
                        placeholder="Nh???p s??? ti???n"
                        keyboardType="numeric"
                        maxLength={9}
                      />
                    </View>

                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        marginTop: 15,
                      }}
                    >
                      <TouchableOpacity style={styles.btnDeposit} activeOpacity={0.8} onPress={transfer}>
                        <Text>TRANSFER</Text>
                      </TouchableOpacity>
                      <TextInput
                        style={styles.inputMoney}
                        value={moneyTransfer}
                        onChangeText={text => setMoneyTransfer(text)}
                        placeholder="Nh???p s??? ti???n"
                        keyboardType="numeric"
                        maxLength={9}
                      />
                    </View>

                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        marginTop: 15,
                      }}
                    >
                      <TouchableOpacity style={styles.btnDeposit} activeOpacity={0.8} onPress={pay}>
                        <Text>PAY</Text>
                      </TouchableOpacity>
                      <TextInput
                        style={styles.inputMoney}
                        value={moneyPay}
                        onChangeText={text => setMoneyPay(text)}
                        placeholder="Nh???p s??? ti???n"
                        keyboardType="numeric"
                        maxLength={9}
                      />
                    </View>

                    <TouchableOpacity style={styles.btnOpenWallet} activeOpacity={0.8} onPress={getListPaymentMethod}>
                      <Text>GET LIST PAYMENT METHOD</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnOpenWallet} activeOpacity={0.8} onPress={getAccountInfo}>
                      <Text>GET ACCOUNT INFO</Text>
                    </TouchableOpacity>

                    {listService.length > 0 && (
                      <View
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          style={[styles.btnDeposit, { flex: 1, marginRight: 10, paddingVertical: 11 }]}
                          activeOpacity={0.8}
                          onPress={openService}
                        >
                          <Text>OPEN SERVICE</Text>
                        </TouchableOpacity>

                        <View style={{ flex: 1 }}>
                          <PickerModal
                            items={listService}
                            onSelected={i => setServiceSelected(i?.Value ?? "MOBILE_CARD")}
                            selected={listService[0]}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {loadingApp && (
        <View
          style={{
            position: "absolute",
            backgroundColor: "rgba(0,0,0,.8)",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="green" />
        </View>
      )}

      <PaymeSDK ref={refPaymeSDK} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    paddingTop: StatusBar.currentHeight,
  },
  btnLogin: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    borderColor: "grey",
  },
  inputPhone: {
    padding: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    width: "100%",
    borderRadius: 5,
    borderColor: "grey",
  },
  btnOpenWallet: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 10,
    elevation: 2,
    shadowColor: "grey",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  btnDeposit: {
    width: "30%",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 2,
    shadowColor: "grey",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  inputMoney: {
    flex: 1,
    padding: 5,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "grey",
    marginLeft: 10,
    backgroundColor: "white",
  },
  inputToken: {
    width: "100%",
    padding: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "grey",
    backgroundColor: "white",
    marginTop: 5,
  },
})
