/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Picker,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PaymeSDK from 'expo-payme-sdk';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import Constants from 'expo-constants';
import { ActivityIndicator } from 'react-native';

const CONFIGS = {
  production: {
    appToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6NywiaWF0IjoxNjE0OTExMDE0fQ.PJ0ke0Ky_0BoMPi45Cu803VlR8F3e8kOMoNh9I07AR4',
    publicKey: `-----BEGIN PUBLIC KEY-----
     MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJQKJge1dTHz6Qkyz95X92QnsgDqerCB
     UzBmt/Qg+5E/oKpw7RBfni3SlCDGotBJH437YvsDBMx8OMCP8ROd7McCAwEAAQ==
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
    env: 'PRODUCTION',
    secretKey: 'bda4d9de88f37efb93342d8764ac9b84',
    appId: '7',
    storeId: 25092940,
  },

  sandbox: {
    appToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6MTQsImlhdCI6MTYxNDE2NDI3MH0.MmzNL81YTx8XyTu6SczAqZtnCA_ALsn9GHsJGBKJSIk',
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
    env: 'SANDBOX',
    secretKey: 'de7bbe6566b0f1c38898b7751b057a94',
    appId: '14',
    storeId: 24088141,
  },
};

export default function App() {
  const refPaymeSDK = React.useRef(null);

  const [env, setEnv] = useState('sandbox');

  const [userID, setUserID] = useState('');

  const [phone, setPhone] = useState('');

  const [balancce, setBalance] = useState(0);

  const [moneyDeposit, setMoneyDeposit] = useState('');
  const [moneyWithdraw, setMoneyWithdraw] = useState('');
  const [moneyPay, setMoneyPay] = useState('');

  const [appId, setAppId] = useState(CONFIGS[env].appId);
  const [appToken, setAppToken] = useState(CONFIGS[env].appToken);
  const [appPublicKey, setAppPublicKey] = useState(CONFIGS[env].publicKey);
  const [appPrivateKey, setAppPrivateKey] = useState(CONFIGS[env].privateKey);
  const [appSecretkey, setAppSecretkey] = useState(CONFIGS[env].secretKey);

  const [showLog, setShowLog] = useState(false);
  const [showSetting, setShowSetting] = useState(false);

  const [isLogin, setIsLogin] = useState(false);

  const [loadingApp, setLoadingApp] = useState(false);

  const handleRestoreDefault = () => {
    setAppId(CONFIGS[env].appId);
    setAppToken(CONFIGS[env].appToken);
    setAppPublicKey(CONFIGS[env].publicKey);
    setAppPrivateKey(CONFIGS[env].privateKey);
    setAppSecretkey(CONFIGS[env].secretKey);
    setShowLog(false);
    setIsLogin(false);
  };

  const handleChangeEnv = (env) => {
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

  const checkMoney = (money) => {
    const m = Number(money);
    if (m < 10000) {
      alert('Vui lòng nhập số tiền lớn hơn 10,000 đ.');
      return false;
    } else if (m >= 100000000) {
      alert('Vui lòng nhập số tiền nhỏ hơn 100,000,000 đ.');
      return false;
    }
    return true;
  };

  const checkUserId = () => {
    if (userID === '') {
      alert('userID is required!');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!checkUserId()) {
      return;
    }
    setLoadingApp(true);
    Keyboard.dismiss();
    const res = await fetch(
      `https://alcohol-delivery.toptravelasia.com/createConnectToken/${userID}/${appSecretkey}/${phone}`
    );
    if (res.status === 200) {
      const { connectToken } = await res.json();
      console.log('connectToken', connectToken);
      const configs = {
        connectToken,
        appToken,
        clientId: Constants.deviceId,
        env,
        showLog: showLog ? '1' : '0',
        publicKey: appPublicKey,
        privateKey: appPrivateKey,
        xApi: appId,
        phone,
      };
      refPaymeSDK.current?.login(
        configs,
        (respone) => {
          console.log('respone login', respone);
          alert('Login thành công.');
          setIsLogin(true);
          setLoadingApp(false);
          setTimeout(() => {
            getWalletInfo();
          }, 100);
        },
        (error) => {
          console.log('error login', error);
          const message = error?.[0]?.message;
          alert(message ?? 'Login thất bại.');
          setIsLogin(false);
          setLoadingApp(false);
        }
      );
    } else {
      alert('Tạo connectToken thất bại.');
      setLoadingApp(false);
    }
  };

  const onLogout = () => {
    setUserID('');
    setPhone('');
    setIsLogin(false);
  };

  const handlePressOpen = () => {
    refPaymeSDK.current?.open();
  };

  const getWalletInfo = () => {
    refPaymeSDK.current?.getWalletInfo(
      (response) => {
        console.log('response getWalletInfo', response);
        setBalance(response?.balance ?? 0);
      },
      (error) => {
        console.log('error getWalletInfo', error);
        setBalance(0);
      }
    );
  };

  const getAccountInfo = () => {
    refPaymeSDK.current?.getAccountInfo(
      (response) => {
        console.log('response getAccountInfo', response);
        alert(JSON.stringify(response));
      },
      (error) => {
        console.log('error getAccountInfo', error);
      }
    );
  };

  const deposit = () => {
    if (!checkMoney(moneyDeposit)) {
      return;
    }
    refPaymeSDK.current?.deposit({
      amount: Number(moneyDeposit),
      description: 'description',
    });
  };
  const withdraw = () => {
    if (!checkMoney(moneyWithdraw)) {
      return;
    }
    refPaymeSDK.current?.withdraw({
      amount: Number(moneyWithdraw),
      description: 'description',
    });
  };

  const getListService = () => {
    refPaymeSDK.current?.getListService(
      (response) => {
        console.log('response getListService', response);
        alert(JSON.stringify(response));
      },
      (error) => {
        console.log('error getListService', error);
      }
    );
  };

  const openService = () => {
    refPaymeSDK.current?.openService('HOCPHI');
  };

  const getListPaymentMethod = () => {
    setLoadingApp(true);
    refPaymeSDK.current?.getListPaymentMethod(
      (response) => {
        console.log('response getListPaymentMethod', response);
        alert(JSON.stringify(response));
        setLoadingApp(false);
      },
      (error) => {
        console.log('error getListPaymentMethod', error);
        setLoadingApp(false);
      }
    );
  };

  const pay = () => {
    if (!checkMoney(moneyPay)) {
      return;
    }
    const data = {
      amount: env === 'sandbox' ? Number(moneyPay) : 10000,
      orderId: Date.now().toString(),
      storeId: CONFIGS[env].storeId,
      note: 'note',
    };
    refPaymeSDK.current?.pay(
      data,
      (response) => {
        console.log('response pay', response);
        alert(JSON.stringify(response));
      },
      (error) => {
        console.log('error pay', error);
        alert(JSON.stringify(error));
      }
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={{ flex: 1, width: '100%', marginTop: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Text>Enviroment</Text>
            <View
              style={{
                borderWidth: 0.5,
                borderRadius: 5,
                borderColor: 'grey',
                marginLeft: 10,
              }}
            >
              <Picker
                selectedValue={env}
                style={{ height: 36, width: 200 }}
                onValueChange={(itemValue, itemIndex) => {
                  setEnv(itemValue);
                  handleChangeEnv(itemValue);
                }}
              >
                <Picker.Item label="sandbox" value="sandbox" />
                <Picker.Item label="production" value="production" />
              </Picker>
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
                onChangeText={(text) => setAppId(text)}
                placeholder="Nhập App SecretKey Key"
              />

              <Text style={{ marginTop: 10 }}>App Token</Text>

              <TextInput
                style={styles.inputToken}
                value={appToken}
                onChangeText={(text) => setAppToken(text)}
                placeholder="Nhập App Token"
              />

              <Text style={{ marginTop: 10 }}>App Public Key</Text>

              <TextInput
                style={styles.inputToken}
                value={appPublicKey}
                onChangeText={(text) => setAppPublicKey(text)}
                placeholder="Nhập Public Key"
                multiline
              />
              <Text style={{ marginTop: 10 }}>App Private Key</Text>

              <TextInput
                style={styles.inputToken}
                value={appPrivateKey}
                onChangeText={(text) => setAppPrivateKey(text)}
                placeholder="Nhập Private Key"
                multiline
              />

              <Text style={{ marginTop: 10 }}>App SecretKey Key</Text>

              <TextInput
                style={styles.inputToken}
                value={appSecretkey}
                onChangeText={(text) => setAppSecretkey(text)}
                placeholder="Nhập App SecretKey Key"
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <Checkbox
                  style={{ alignItems: 'center' }}
                  value={showLog}
                  onValueChange={setShowLog}
                />
                <Text style={styles.label}>Show Log</Text>
              </View>

              <View
                style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}
              >
                <TouchableOpacity
                  style={styles.btnLogin}
                  activeOpacity={0.7}
                  onPress={handleRestoreDefault}
                >
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
              <View style={{ width: '100%' }}>
                <Text style={{ marginBottom: 5 }}>UserID</Text>
                <TextInput
                  style={styles.inputPhone}
                  value={userID}
                  onChangeText={(text) => setUserID(text)}
                  placeholder="required"
                  keyboardType="numeric"
                />
              </View>

              <View style={{ width: '100%', marginTop: 10 }}>
                <Text style={{ marginBottom: 5 }}>Phone Number</Text>
                <TextInput
                  style={styles.inputPhone}
                  value={phone}
                  onChangeText={(text) => setPhone(text)}
                  placeholder="optional"
                  keyboardType="numeric"
                />
              </View>

              <View
                style={{ width: '100%', marginTop: 10, flexDirection: 'row' }}
              >
                <TouchableOpacity
                  style={styles.btnLogin}
                  activeOpacity={0.7}
                  onPress={handleLogin}
                >
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
                    width: '100%',
                    backgroundColor: '#e9e9e9',
                    padding: 16,
                    marginTop: 15,
                    borderRadius: 5,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text>Balance</Text>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text style={{ marginRight: 10 }}>{`${balancce} đ`}</Text>
                      <TouchableOpacity onPress={getWalletInfo}>
                        <FontAwesome name="refresh" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.btnOpenWallet}
                    activeOpacity={0.8}
                    onPress={handlePressOpen}
                  >
                    <Text>OPEN WALLET</Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      marginTop: 15,
                    }}
                  >
                    <TouchableOpacity
                      style={styles.btnDeposit}
                      activeOpacity={0.8}
                      onPress={deposit}
                    >
                      <Text>DEPOSIT</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.inputMoney}
                      value={moneyDeposit}
                      onChangeText={(text) => setMoneyDeposit(text)}
                      placeholder="Nhập số tiền"
                      keyboardType="numeric"
                      maxLength={9}
                    />
                  </View>

                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      marginTop: 15,
                    }}
                  >
                    <TouchableOpacity
                      style={styles.btnDeposit}
                      activeOpacity={0.8}
                      onPress={withdraw}
                    >
                      <Text>WITHDRAW</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.inputMoney}
                      value={moneyWithdraw}
                      onChangeText={(text) => setMoneyWithdraw(text)}
                      placeholder="Nhập số tiền"
                      keyboardType="numeric"
                      maxLength={9}
                    />
                  </View>

                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      marginTop: 15,
                    }}
                  >
                    <TouchableOpacity
                      style={styles.btnDeposit}
                      activeOpacity={0.8}
                      onPress={pay}
                    >
                      <Text>PAY</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.inputMoney}
                      value={moneyPay}
                      onChangeText={(text) => setMoneyPay(text)}
                      placeholder="Nhập số tiền"
                      keyboardType="numeric"
                      maxLength={9}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.btnOpenWallet}
                    activeOpacity={0.8}
                    onPress={getListPaymentMethod}
                  >
                    <Text>GET LIST PAYMENT METHOD</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      {loadingApp && (
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,.8)',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color="green" />
        </View>
      )}

      <PaymeSDK ref={refPaymeSDK} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  btnLogin: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    borderColor: 'grey',
  },
  inputPhone: {
    padding: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    width: '100%',
    borderRadius: 5,
    borderColor: 'grey',
  },
  btnOpenWallet: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 10,
    elevation: 2,
    shadowColor: 'grey',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  btnDeposit: {
    width: '30%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 2,
    shadowColor: 'grey',
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
    borderColor: 'grey',
    marginLeft: 10,
    backgroundColor: 'white',
  },
  inputToken: {
    width: '100%',
    padding: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'grey',
    backgroundColor: 'white',
    marginTop: 5,
  },
});
