/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import PaymeSDK, { LANGUAGES, encryptAES } from "expo-payme-sdk";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import PickerModal from "react-native-picker-modal-view";
import * as Application from "expo-application";
const package_json = require('./package.json')

const listPayCode = [
  'PAYME',
  'ATM',
  'CREDIT',
  'MANUAL_BANK',
  'VN_PAY',
  'MOMO',
  'ZALO_PAY',
  'VIET_QR'
]

const CONFIGS = {
  production: {
    appToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6NDQsImlhdCI6MTY1MjIzMjEwM30.IMhz9dBDKJ736hTaxGaMJhJvQiq7Q1axsm6TiydspAU",
    publicKey: `-----BEGIN PUBLIC KEY-----
    MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKRWwS+plGNWsiQiAMUJgBe7wdjhbAbx
    ZDBqKnAH9hZlRjrdgglBERzy/80/nL8cTI2FWAhEDaR3CewO+nRbaPECAwEAAQ==
    -----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
    MIIBOgIBAAJBAI8rsaSa1cOzIDX/XsniS8TeZ9c1Kg0wqH4pIjUfL3z5X6lXDA3G
    g3uj/sdOJews6zDoXXxTHPkocPGdja98rb8CAwEAAQJAWRQOiyPrLMAeonopN+Mc
    0Xivky744wwLSbO+HN8yZMazvdvVCGjuXRXf9C2Et3sP5mcz1MlO2Zmq2xi0Lgc7
    QQIhANh5Z888Pv7dWr+s9o7SHoyeSAuO6NCUA0r2aaxNd+cDAiEAqU/hdSUeGicG
    HQl7chq14DImAbEplcGoT0l7Z/7aE5UCIQC7Z18XaXCf88G8bmCFBCKuWdjFKNMk
    vv6axvh00hwbQQIgcIPFMDQabQbB6UoD3zAg7XxmBXnWSM8JKqeKevHBuoECIG3A
    deJhhdalcQyJMTFIzx3r3+ANrkrd1v7VMsdFfaQ0
    -----END RSA PRIVATE KEY-----`,
    env: "PRODUCTION",
    secretKey: "0418d21948d904fb6f423998fd1e4714",
    appId: "44",
  },
  sandbox: {
    appToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6OTUsImlhdCI6MTY1MTczMjM0Nn0.TFsg9wizgtWa7EbGzrjC2Gn55TScsJzKGjfeN78bhlg",
    publicKey: `-----BEGIN PUBLIC KEY-----
    MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAId28RoBckMTTPqVCC3c1f+fH+BbdVvv
    wDkSf+0zmaUlCFyQpassU3+8CvM6QbeYSYGWp1YIwGqg2wTF94zT4eECAwEAAQ==
    -----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
    MIIBOwIBAAJBAMEKxNcErAKSzmWcps6HVScLctpdDkBiygA3Pif9rk8BoSU0BYAs
    G5pW8yRmhCwVMRQq+VhJNZq+MejueSBICz8CAwEAAQJBALfa29K1/mWNEMqyQiSd
    vDotqzvSOQqVjDJcavSHpgZTrQM+YzWwMKAHXLABYCY4K0t01AjXPPMYBueJtFeA
    i3ECIQDpb6Fp0yGgulR9LHVcrmEQ4ZTADLEASg+0bxVjv9vkWwIhANOzlw9zDMRr
    i/5bwttz/YBgY/nMj7YIEy/v4htmllntAiA5jLDRoyCOPIGp3nUMpVz+yW5froFQ
    nfGjPSOb1OgEMwIhAI4FhyvoJQKIm8wyRxDuSXycLbXhU+/sjuKz7V4wfmEpAiBb
    PmELTX6BquyCs9jUzoPxDWKQSQGvVUwcWXtpnYxSvQ==
    -----END RSA PRIVATE KEY-----`,
    env: "SANDBOX",
    secretKey: "b5d8cf6c30d9cb4a861036bdde44c137",
    appId: "95",
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
    storeId: 9
  },
};

const dataEnv = [
  { Id: "1", Name: "sandbox", Value: "1" },
  { Id: "2", Name: "dev", Value: "2" },
  { Id: "3", Name: "production", Value: "3" },
];

export default function App() {
  const refPaymeSDK = React.useRef(null);

  const [env, setEnv] = useState("sandbox");

  const [listService, setListService] = useState([]);
  const [serviceSelected, setServiceSelected] = useState("MOBILE_CARD");
  // const [listPaymentMethod, setListPaymentMethod] = useState([]);
  // const [paymentMethodSelected, setPaymentMethodSelected] = useState({ type: "WALLET" });

  useEffect(() => {
    if (listService.length > 0) {
      setServiceSelected(listService[0]?.Value);
    }
  }, [listService]);

  const [userID, setUserID] = useState("");

  const [phone, setPhone] = useState("");

  const [balancce, setBalance] = useState(0);

  const [moneyDeposit, setMoneyDeposit] = useState("10000");
  const [moneyWithdraw, setMoneyWithdraw] = useState("10000");
  const [moneyTransfer, setMoneyTransfer] = useState("10000");
  const [moneyPay, setMoneyPay] = useState("10000");
  const [userName, setUserName] = useState("");

  const [payCode, setPayCode] = useState("PAYME");
  const [payCodeScanQR, setPayCodeScanQR] = useState("PAYME");

  const [appId, setAppId] = useState(CONFIGS[env].appId);
  const [appToken, setAppToken] = useState(CONFIGS[env].appToken);
  const [appPublicKey, setAppPublicKey] = useState(CONFIGS[env].publicKey);
  const [appPrivateKey, setAppPrivateKey] = useState(CONFIGS[env].privateKey);
  const [appSecretkey, setAppSecretkey] = useState(CONFIGS[env].secretKey);
  const [lang, setLang] = useState(LANGUAGES.VI);
  const [qrString, setQrString] = useState("");

  const [showLog, setShowLog] = useState(false);
  const [showSetting, setShowSetting] = useState(false);

  const [isLogin, setIsLogin] = useState(false);

  const [loadingApp, setLoadingApp] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState();

  useEffect(() => {
    setQrString(`OPENEWALLET|${CONFIGS[env]?.storeId ?? "null"}|PAYMENT|10000|Thanhtoan|${Date.now().toString()}|${"null"}`);
  }, []);

  const handleRestoreDefault = () => {
    setAppId(CONFIGS[env].appId);
    setAppToken(CONFIGS[env].appToken);
    setAppPublicKey(CONFIGS[env].publicKey);
    setAppPrivateKey(CONFIGS[env].privateKey);
    setAppSecretkey(CONFIGS[env].secretKey);
    setShowLog(false);
    setIsLogin(false);
  };

  const handleChangeEnv = env => {
    setAppId(CONFIGS[env].appId);
    setAppToken(CONFIGS[env].appToken);
    setAppPublicKey(CONFIGS[env].publicKey);
    setAppPrivateKey(CONFIGS[env].privateKey);
    setAppSecretkey(CONFIGS[env].secretKey);
    setIsLogin(false);
  };

  const handleSave = () => {
    setShowSetting(false);
    setIsLogin(false);
  };

  const checkMoney = money => {
    const m = Number(money);
    if (m < 10000) {
      alert("Vui lòng nhập số tiền lớn hơn 10,000 đ.");
      return false;
    } else if (m >= 100000000) {
      alert("Vui lòng nhập số tiền nhỏ hơn 100,000,000 đ.");
      return false;
    }
    return true;
  };

  const checkUserId = () => {
    if (userID === "") {
      alert("userID is required!");
      return false;
    }
    if (phone === "") {
      alert("Phone Number is required!");
      return false;
    }
    if (!/^(0|84)\d{9}$/g.test(phone)) {
      alert("Số điện thoại không hợp lệ!");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setBalance(0);
    setIsLogin(false);
    if (!checkUserId()) {
      return;
    }
    setLoadingApp(true);
    Keyboard.dismiss();

    const data = {
      userId: userID,
      phone,
      timestamp: Date.now(),
    };

    const connectToken = encryptAES(JSON.stringify(data), appSecretkey);
    const clientId = Platform.OS === "ios" ? await Application.getIosIdForVendorAsync() : Application.androidId;
    const configs = {
      connectToken,
      appToken,
      clientId,
      env,
      lang,
      showLog: showLog ? "1" : "0",
      publicKey: appPublicKey,
      privateKey: appPrivateKey,
      appId: appId,
      configColor: ["#ffa000", "#ff6700"],
      phone,
      ...(Platform.OS === "ios" && {
        partner: {
          paddingTop: 30,
        },
      }),
    };
    refPaymeSDK.current?.login(
      configs,
      respone => {
        console.log("respone login", respone);
        alert("Login thành công");
        setIsLogin(true);
        setLoadingApp(false);
        getWalletInfo();
        getListService();
      },
      error => {
        console.log("error login", error);
        alert(error?.message ?? "Login thất bại");
        setIsLogin(false);
        setLoadingApp(false);
      }
    );
  };

  const onUnlink = () => {
    const data = {
      userId: userID,
      phone,
      timestamp: Date.now(),
    };

    const connectToken = encryptAES(JSON.stringify(data), appSecretkey);

    const configs = {
      connectToken,
      appToken,
      env,
      publicKey: appPublicKey,
      privateKey: appPrivateKey,
      appId: appId,
    };

    refPaymeSDK.current?.unlinkAccount(
      configs,
      response => {
        setUserID("");
        setPhone("");
        setIsLogin(false);
        console.log("response onUnlink", response);
      },
      error => {
        console.log("error onUnlink", error);
        alert(error?.message ?? "error onUnlink");
      }
    )
  };

  const handlePressOpen = () => {
    refPaymeSDK.current?.openWallet(
      response => {
        console.log("response openWallet", response);
      },
      error => {
        console.log("error openWallet", error);
        alert(error?.message ?? "error openWallet");
      }
    );
  };

  const handlePressOpenHistory = () => {
    refPaymeSDK.current?.openHistory(
      response => {
        console.log("response openHistory", response);
      },
      error => {
        console.log("error openHistory", error);
        alert(error?.message ?? "error openHistory");
      }
    );
  };

  const getWalletInfo = () => {
    console.log("getWalletInfo");
    return new Promise(resole => {
      refPaymeSDK.current?.getWalletInfo(
        response => {
          console.log("response getWalletInfo", response);
          setBalance(response?.balance ?? 0);
          resole(true);
        },
        error => {
          console.log("error getWalletInfo", error);
          setBalance(0);
          resole(true);
        }
      );
    });
  };

  const getAccountInfo = () => {
    setLoadingApp(true);
    refPaymeSDK.current?.getAccountInfo(
      response => {
        setLoadingApp(false);
        console.log("response getAccountInfo", response);
        Alert.alert("Account Info", JSON.stringify(response));
      },
      error => {
        setLoadingApp(false);
        console.log("error getAccountInfo", error);
        alert(error.message ?? "error getAccountInfo");
      }
    );
  };

  const deposit = () => {
    if (!checkMoney(moneyDeposit)) {
      return;
    }
    refPaymeSDK.current?.deposit(
      {
        amount: Number(moneyDeposit),
        description: "description",
      },
      response => {
        console.log("response deposit", response);
      },
      error => {
        console.log("error deposit", error);
        alert(error?.message ?? "error deposit");
      }
    );
  };
  const withdraw = () => {
    if (!checkMoney(moneyWithdraw)) {
      return;
    }
    refPaymeSDK.current?.withdraw(
      {
        amount: Number(moneyWithdraw),
        description: "description",
      },
      response => {
        console.log("response withdraw", response);
      },
      error => {
        console.log("error withdraw", error);
        alert(error?.message ?? "error withdraw");
      }
    );
  };

  const transfer = () => {
    if (!checkMoney(moneyTransfer)) {
      return;
    }
    refPaymeSDK.current?.transfer(
      {
        amount: Number(moneyTransfer),
        description: "Chuyển tiền",
        closeWhenDone: true,
      },
      response => {
        console.log("response transfer", response);
      },
      error => {
        console.log("error transfer", error);
        alert(error?.message ?? "error transfer");
      }
    );
  };

  const getListService = (showAlert = false) => {
    if (showAlert) {
      setLoadingApp(true);
    }
    refPaymeSDK.current?.getListService(
      response => {
        if (showAlert) {
          setLoadingApp(false);
          Alert.alert("List Service", JSON.stringify(response));
        }
        if (Array.isArray(response)) {
          setListService(
            response
              ?.filter(i => i?.enable === true)
              .map((i, index) => ({ Id: `${index}`, Name: `${i?.description}`, Value: `${i?.code}` })) ?? []
          );
        }
      },
      error => {
        if (showAlert) {
          setLoadingApp(false);
        }
        console.log("error getListService", error);
        alert(error?.message ?? "error getListService");
      }
    );
  };

  const openService = () => {
    refPaymeSDK.current?.openService(
      serviceSelected ?? "MOBILE_CARD",
      response => {
        console.log("response openService", response);
      },
      error => {
        console.log("error openService", error);
        alert(error?.message ?? "error openService");
      }
    );
  };

  const pay = async () => {
    if (!checkMoney(moneyPay)) {
      return;
    }
    const data = {
      amount: Number(moneyPay),
      orderId: Date.now().toString(),
      storeId: CONFIGS[env].storeId,
      userName: userName,
      isShowResultUI: true,
      note: "note",
      payCode,
    };
    refPaymeSDK.current?.pay(
      data,
      response => {
        console.log("response pay", response);
      },
      error => {
        console.log("error pay", error);
        // alert(error?.message ?? 'error pay');
        Alert.alert("Thông báo", error?.message ?? "error pay");
      }
    );
  };

  const scanQR = async () => {
    refPaymeSDK.current?.scanQR(
      {
        payCode: payCodeScanQR,
      },
      response => {
        console.log("response scanQR", response);
      },
      error => {
        console.log("error scanQR", error);
        alert(error?.message ?? "error scanQR");
      }
    );
  };

  const payQRCode = async () => {
    refPaymeSDK.current?.payQRCode(
      {
        qr: qrString,
        isShowResultUI: true,
        payCode: payCodeScanQR,
      },
      response => {
        console.log("response payQRCode", response);
      },
      error => {
        console.log("error payQRCode", error);
        Alert.alert("Thông báo", error?.message ?? "error payQRCode");
      }
    );
  };

  const changeLang = lang => {
    setIsLogin(false);
    setLang(lang);
  };

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
                      setEnv(i.Name);
                      handleChangeEnv(i.Name);
                    }
                  }}
                  selected={dataEnv[0]}
                />
                {/* <Text style={{ borderWidth: 1, padding: 5 }}>sandbox</Text> */}
              </View>
              <TouchableOpacity onPress={() => setShowSetting(!showSetting)}>
                <AntDesign name="setting" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text>Language</Text>
              <View style={{ flexDirection: "row", marginLeft: 20 }}>
                <TouchableOpacity
                  onPress={() => changeLang(LANGUAGES.VI)}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <MaterialIcons
                    name={lang === LANGUAGES.VI ? "check-box" : "check-box-outline-blank"}
                    size={24}
                    color="black"
                  />
                  <Text>Tiếng Việt</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => changeLang(LANGUAGES.EN)}
                  style={{ flexDirection: "row", alignItems: "center", marginLeft: 20 }}
                >
                  <MaterialIcons
                    name={lang === LANGUAGES.EN ? "check-box" : "check-box-outline-blank"}
                    size={24}
                    color="black"
                  />
                  <Text>English</Text>
                </TouchableOpacity>
              </View>
            </View>

            {showSetting ? (
              <>
                <Text style={{ marginTop: 10 }}>App ID</Text>

                <TextInput
                  style={styles.inputToken}
                  value={appId}
                  onChangeText={text => setAppId(text)}
                  placeholder="Nhập App SecretKey Key"
                />

                <Text style={{ marginTop: 10 }}>App Token</Text>

                <TextInput
                  style={styles.inputToken}
                  value={appToken}
                  onChangeText={text => setAppToken(text)}
                  placeholder="Nhập App Token"
                />

                <Text style={{ marginTop: 10 }}>App Public Key</Text>

                <TextInput
                  style={styles.inputToken}
                  value={appPublicKey}
                  onChangeText={text => setAppPublicKey(text)}
                  placeholder="Nhập Public Key"
                  multiline
                />
                <Text style={{ marginTop: 10 }}>App Private Key</Text>

                <TextInput
                  style={styles.inputToken}
                  value={appPrivateKey}
                  onChangeText={text => setAppPrivateKey(text)}
                  placeholder="Nhập Private Key"
                  multiline
                />

                <Text style={{ marginTop: 10 }}>App SecretKey Key</Text>

                <TextInput
                  style={styles.inputToken}
                  value={appSecretkey}
                  onChangeText={text => setAppSecretkey(text)}
                  placeholder="Nhập App SecretKey Key"
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
                    placeholderTextColor="grey"
                    keyboardType="numeric"
                  />
                </View>

                <View style={{ width: "100%", marginTop: 10 }}>
                  <Text style={{ marginBottom: 5 }}>Phone Number</Text>
                  <TextInput
                    style={styles.inputPhone}
                    value={phone}
                    onChangeText={text => setPhone(text)}
                    placeholder="required"
                    placeholderTextColor="grey"
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
                    onPress={onUnlink}
                  >
                    <Text>UNLINK ACCOUNT</Text>
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
                        <Text style={{ marginRight: 10 }}>{`${balancce} đ`}</Text>
                        <TouchableOpacity onPress={getWalletInfo}>
                          <FontAwesome name="refresh" size={24} color="black" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.btnOpenWallet} activeOpacity={0.8} onPress={handlePressOpen}>
                      <Text>OPEN WALLET</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnOpenWallet} activeOpacity={0.8} onPress={handlePressOpenHistory}>
                      <Text>OPEN HISTORY</Text>
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
                        style={[styles.inputMoney, { marginLeft: 10 }]}
                        value={moneyDeposit}
                        onChangeText={text => setMoneyDeposit(text)}
                        placeholder="Nhập số tiền"
                        placeholderTextColor="grey"
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
                        style={[styles.inputMoney, { marginLeft: 10 }]}
                        value={moneyWithdraw}
                        onChangeText={text => setMoneyWithdraw(text)}
                        placeholder="Nhập số tiền"
                        placeholderTextColor="grey"
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
                        style={[styles.inputMoney, { marginLeft: 10 }]}
                        value={moneyTransfer}
                        onChangeText={text => setMoneyTransfer(text)}
                        placeholder="Nhập số tiền"
                        placeholderTextColor="grey"
                        keyboardType="numeric"
                        maxLength={9}
                      />
                    </View>

                    {/* <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        marginTop: 15,
                      }}
                    >
                      <TouchableOpacity style={styles.btnDeposit} activeOpacity={0.8} onPress={() => pay()}>
                        <Text>PAY</Text>
                      </TouchableOpacity>
                      <TextInput
                        style={styles.inputMoney}
                        value={moneyPay}
                        onChangeText={text => setMoneyPay(text)}
                        placeholder="Nhập số tiền"
                        keyboardType="numeric"
                        maxLength={9}
                      />
                    </View> */}

                    <View style={{ borderWidth: 1, marginTop: 10, padding: 10, borderColor: "#ccc", borderRadius: 10 }}>
                      <TouchableOpacity
                        style={[styles.btnOpenWallet, { marginTop: 0 }]}
                        activeOpacity={0.8}
                        onPress={() => pay()}
                      >
                        <Text>PAY</Text>
                      </TouchableOpacity>
                      <View>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            marginTop: 10,
                          }}
                        >
                          <TextInput
                            style={styles.inputMoney}
                            value={moneyPay}
                            onChangeText={text => setMoneyPay(text)}
                            placeholder="Nhập số tiền"
                            placeholderTextColor="grey"
                            keyboardType="numeric"
                            maxLength={9}
                          />
                        </View>

                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            marginTop: 10,
                          }}
                        >
                          <TextInput
                            style={styles.inputMoney}
                            value={userName}
                            onChangeText={text => setUserName(text)}
                            placeholder="Nhập userName"
                            placeholderTextColor="grey"
                          />
                        </View>

                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            marginTop: 10,
                          }}
                        >
                          <CPicker
                            value={payCode}
                            list={listPayCode}
                            onChange={(value) => setPayCode(value)}
                          />
                        </View>
                      </View>
                    </View>

                    <View style={{ borderWidth: 1, marginTop: 10, padding: 10, borderColor: "#ccc", borderRadius: 10 }}>
                      <TouchableOpacity
                        style={[styles.btnOpenWallet, { marginTop: 0 }]}
                        activeOpacity={0.8}
                        onPress={scanQR}
                      >
                        <Text>SCAN QR</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnOpenWallet} activeOpacity={0.8} onPress={payQRCode}>
                        <Text>PAY QRCODE</Text>
                      </TouchableOpacity>
                      <View>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            marginTop: 10,
                          }}
                        >
                          <CPicker
                            value={payCodeScanQR}
                            list={listPayCode}
                            onChange={(value) => setPayCodeScanQR(value)}
                          />
                        </View>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            marginTop: 10,
                          }}
                        >
                          <TextInput
                            style={styles.inputMoney}
                            value={qrString}
                            onChangeText={text => setQrString(text)}
                            placeholder="Nhập QR String"
                          />
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.btnOpenWallet} activeOpacity={0.8} onPress={getAccountInfo}>
                      <Text>GET ACCOUNT INFO</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnOpenWallet}
                      activeOpacity={0.8}
                      onPress={() => getListService(true)}
                    >
                      <Text>GET LIST SERVICE</Text>
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

                    <Text style={{ textAlign: "center", marginTop: 4 }}>{`Version Demo: ${package_json.version}`}</Text>
                    <Text style={{ textAlign: "center", marginTop: 4 }}>Version SDK: 0.4.7</Text>
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
  );
}

const CPicker = ({ style = {}, value = "1", onChange = () => null, list = ["1", "2", "3"] }) => {
  const [v, setV] = useState(() => value);
  const [modalVisible, setModaVisible] = useState(false);
  useEffect(() => {
    setV(value);
  }, [value]);
  const onPress = () => {
    setModaVisible(true);
  };
  const onPressItem = i => {
    setV(i);
    setModaVisible(false);
    onChange?.(i);
  };
  return (
    <>
      <TouchableOpacity style={[styles.cPicker, style]} onPress={onPress}>
        <Text>{v}</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => setModaVisible(false)}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,.8)' }}>
            <View style={styles.cPickerContainer}>
              {list.map((i, index) => (
                <TouchableOpacity
                  onPress={() => onPressItem(i)}
                  activeOpacity={0.8}
                  key={index.toString()}
                  style={{ marginBottom: 10, width: "100%" }}
                >
                  <Text style={{ fontSize: 18 }}>{i}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  cPicker: {
    borderWidth: 1,
    flex: 1,
    padding: 8,
    justifyContent: "center",
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "grey",
    backgroundColor: "white",
  },
  cPickerContainer: {
    backgroundColor: "white",
    width: "90%",
    padding: 10,
    paddingBottom: 0,
    elevation: 2,
    shadowColor: "grey",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
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
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "grey",
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
});
