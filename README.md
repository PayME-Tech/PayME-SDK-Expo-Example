[![en](https://img.shields.io/badge/lang-en-yellow.svg)](https://github.com/PayME-Tech/PayME-SDK-Expo-Readme/blob/main/README_EN.md)

PayME SDK là bộ thư viện để các app có thể tương tác với PayME Platform. PayME SDK bao gồm các chức năng chính như sau:

- Hệ thống đăng ký, đăng nhập, eKYC thông qua tài khoản ví PayME

- Chức năng nạp rút chuyển tiền từ ví PayME.

- Tích hợp các dịch vụ của PayME Platform.


**Một số thuật ngữ**

| | Name | Giải thích |
| :--- | :------ | ------------------------------------------------------------ |
| 1 | app | Là app mobile iOS/Android hoặc web sẽ tích hợp SDK vào để thực hiện chức năng thanh toán ví PayME. |
| 2 | SDK | Là bộ công cụ hỗ trợ tích hợp ví PayME vào hệ thống app. |
| 3 | backend | Là hệ thống tích hợp hỗ trợ cho app, server hoặc api hỗ trợ |
| 4 | AES | Hàm mã hóa dữ liệu AES. [Tham khảo](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) |
| 5 | RSA | Thuật toán mã hóa dữ liệu RSA. |
| 6 | IPN | Instant Payment Notification , dùng để thông báo giữa hệ thống backend của app và backend của PayME |

### Mã lỗi của PayME SDK
| Hằng số | Mã lỗi | Giải thích 
| -------------- | ---------- | -------- |
| `EXPIRED` | `401` | token hết hạn sử dụng |
| `ACCOUNT_LOCK` | `405` | Tài khoản user bị khoá chủ động |
| `NETWORK` | `-1` |  Kết nối mạng bị sự cố |
| `SYSTEM` | `-2` |  Lỗi hệ thống |
| `LIMIT` | `-3` |  Lỗi số dư không đủ để thực hiện giao dịch |
| `NOT_ACTIVATED` | `-4` | Lỗi tài khoản chưa kích hoạt |
| `KYC_NOT_APPROVED` | `-5` | Lỗi tài khoản chưa được duyệt |
| `PAYMENT_ERROR` | `-6` | Thanh toán thất bại |
| `ERROR_KEY_ENCODE` | `-7` | Lỗi mã hóa/giải mã dữ liệu |
| `USER_CANCELLED` | `-8` | Người dùng thao tác hủy | 
| `NOT_LOGIN` | `-9` | Lỗi tài khoản chưa login | 
| `BALANCE_ERROR` | `-11` | Lỗi số dư ví không đủ | 
| `UNKNOWN_PAYCODE` | `-12` | Lỗi thiếu thông tin payCode | 


## Cài đặt
- npm:
```shell
npm install expo-payme-sdk
```

- yarn:
```shell
yarn add expo-payme-sdk
```
## Cài đặt thư viện phụ thuộc

```shell
expo add expo-contacts @unimodules/react-native-adapter
```

## Usage
Hệ thống PayME sẽ cung cấp cho app tích hợp các thông tin sau:

-  **PublicKey** : Dùng để mã hóa dữ liệu, app tích hợp cần truyền cho SDK để mã hóa.

-  **AppToken** : AppToken cấp riêng định danh cho mỗi app, cần truyền cho SDK để mã hóa

-  **SecretKey** : Dùng đã mã hóa và xác thực dữ liệu ở hệ thống backend cho app tích hợp.

Bên App sẽ cung cấp cho hệ thống PayME các thông tin sau:

-  **AppPublicKey** : Sẽ gửi qua hệ thống backend của PayME dùng để mã hóa.

-  **AppPrivateKey**: Sẽ truyền vào PayME SDK để thực hiện việc giải mã.

Chuẩn mã hóa: RSA-512bit.
### Khởi tạo thư viện

Trước khi sử dụng PayME SDK cần import Component ExpoPaymeSDK và truyền ref để khởi tạo và sử dụng.

```javascript
import ExpoPaymeSDK from 'expo-payme-sdk';

export default function App() {
  const refExpoPaymeSDK = React.useRef(null);
  return
  (
    <>
      ...
      <RootNavigation />
      ...
      <ExpoPaymeSDK ref={refExpoPaymeSDK}  />
      </>
  )
}
```

### Các chức năng của PayME SDK
Trước khi sử dụng PayME SDK cần gọi login() :

#### login

Có 2 trường hợp

- Dùng để login lần đầu tiên ngay sau khi khởi tạo PayME.

- Dùng khi accessToken hết hạn, khi gọi hàm của SDK mà trả về mã lỗi ERROR_CODE.EXPIRED hoặc ERROR_CODE.ACCOUNT_LOCK, lúc này app cần gọi login lại để lấy accessToken dùng cho các chức năng khác.

Sau khi gọi login() thành công rồi thì mới gọi các chức năng khác của SDK ( openWallet, pay, ... )

```javascript
const configs = {
	connectToken,
	appToken,
	deviceId,
	env,
	configColor,
	publicKey,
	privateKey,
	appId,
	phone
}
refExpoPaymeSDK.current.login(
  configs,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
)
```
#### Constant

| Property | Type | Description |
| ------------------ | ------ | ---------------------- |
| `ENV.SANDBOX` | `enum` | Môi trường sandbox. |
| `ENV.PRODUCTION` | `enum` | Môi trường production. |

#### Parameters

| Property | Type | Description |
| -------------- | ---------- | ------------------------------------------------------------ |
| `appToken` | `string` | AppId cấp riêng định danh cho mỗi app, cần truyền cho SDK để mã hóa. |
| `publicKey` | `string` | Dùng để mã hóa dữ liệu, app tích hợp cần truyền cho SDK để mã hóa. Do hệ thống PayME cung cấp cho app tích hợp. |
| `privateKey` | `string` | app cần truyền vào để giải mã dữ liệu. Bên app sẽ cung cấp cho hệ thống PayME. |
| `connectToken` | `string` | app cần truyền giá trị được cung cấp ở trên, xem cách tạo bên dưới. |
| `deviceId` | `string` | Là deviceId của thiết bị |
| `appId` | `string` | Là appId khi đăng ký merchant sdk sẽ đc hệ thống tạo cho |
| `phone` | `string` | Số điện thoại của hệ thống tích hợp |
| `configColor` | `string[]` | configColor : là tham số màu để có thể thay đổi màu sắc giao dịch ví PayME, kiểu dữ liệu là chuỗi với định dạng #rrggbb. Nếu như truyền 2 màu thì giao diện PayME sẽ gradient theo 2 màu truyền vào. |

configColor : là tham số màu để có thể thay đổi màu sắc giao dịch ví PayME, kiểu dữ liệu là chuỗi với định dạng #rrggbb. Nếu như truyền 2 màu thì giao diện PayME sẽ gradient theo 2 màu truyền vào.

[![img](https://github.com/PayME-Tech/PayME-SDK-Android-Example/raw/main/fe478f50-e3de-4c58-bd6d-9f77d46ce230.png?raw=true)](https://github.com/PayME-Tech/PayME-SDK-Android-Example/blob/main/fe478f50-e3de-4c58-bd6d-9f77d46ce230.png?raw=true)

Cách tạo **connectToken**:

connectToken cần để truyền gọi api từ tới PayME và sẽ được tạo từ hệ thống backend của app tích hợp. Cấu trúc như sau:

-  ***Nodejs Example***

```javascript
import crypto from 'crypto'

const data = {
	timestamp: "2021-01-20T06:53:07.621Z",
	userId: "abc",
	phone: "0123456789"
}
const algorithm = `aes-256-cbc`
const ivbyte = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const iv = Buffer.from(ivbyte)

const cipher = crypto.createCipheriv(algorithm, secretKey, iv)

const encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64')

const connectToken = encrypted + cipher.final('base64')
```

-  ***Expo Example***
```javascript
import forge from 'node-forge'

function encryptAES(text, secretKey) {
  const ivbyte = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const cipher = forge.cipher.createCipher('AES-CBC', secretKey)
  cipher.start({ iv: ivbyte })
  cipher.update(forge.util.createBuffer(text, 'utf8'))
  cipher.finish()
  return forge.util.encode64(cipher.output.getBytes())
}

const data = {
  timestamp: "2021-01-20T06:53:07.621Z",
	userId: "abc",
	phone: "0123456789"
};

const connectToken = encryptAES(JSON.stringify(data), appSecretkey)
```

Tạo connectToken bao gồm thông tin KYC (Dành cho các đối tác có hệ thống KYC riêng)

```javascript
const data = {
  timestamp: "2021-01-20T06:53:07.621Z",
  userId : "abc",
  phone : "0123456789",
  kycInfo: {
    fullname: "Nguyễn Văn A",
    gender: "MALE",
    birthday: "1995-01-20T06:53:07.621Z",
    address: "15 Nguyễn cơ thạch",
    identifyType: "CMND",
    identifyNumber: "142744332",
    issuedAt: "2013-01-20T06:53:07.621Z",
    placeOfIssue: "Hồ Chí Minh",
    video: "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4",
    face: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    image: {
      front: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      back: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
    }
  }
};

const connectToken = encryptAES(JSON.stringify(data), appSecretkey)
```

| **Tham số** | **Bắt buộc** | **Giải thích** |
| :------------ | :----------- | :----------------------------------------------------------- |
| **timestamp** | Yes | Thời gian tạo ra connectToken theo định dạng iSO 8601 , Dùng để xác định thời gian timeout của connectToken. Ví dụ 2021-01-20T06:53:07.621Z |
| ***userId*** | Yes | là giá trị cố định duy nhất tương ứng với mỗi tài khoản khách hàng ở dịch vụ, thường giá trị này do server hệ thống được tích hợp cấp cho PayME SDK |
| ***phone*** | No | Số điện thoại của hệ thống tích hợp |

Trong đó ***AES*** là hàm mã hóa theo thuật toán AES. Tùy vào ngôn ngữ ở server mà bên hệ thống dùng thư viện tương ứng. Xem thêm tại đây https://en.wikipedia.org/wiki/Advanced_Encryption_Standard

Tham số KycInfo

| **Tham số**   | **Bắt buộc** | **Giải thích**                                               |
| :------------ | :----------- | :----------------------------------------------------------- |
| fullname | Yes          | Họ tên |
| gender  | Yes          | Giới tính ( MALE/FEMALE) |
| address   | Yes           | Địa chỉ |
| identifyType   | Yes           | Loại giấy tờ (CMND/CCCD) |
| identifyNumber   | Yes           | Số giấy tờ |
| issuedAt   | Yes           | Ngày đăng ký |
| placeOfIssue   | Yes           | Nơi cấp |
| video   | No           | đường dẫn tới video |
| face   | No           | đường dẫn tới ảnh chụp khuôn mặt |
| front   | No           | đường dẫn tới ảnh mặt trước giấy tờ |
| back   | No           | đường dẫn tới ảnh mặt sau giấy tờ |

#### unlinkAccount
Hàm này được gọi khi app muốn huỷ liên kết tài khoản đã kết nối với PayME

```javascript
const configs = {
	connectToken,
	appToken,
	env,
	publicKey,
	privateKey,
	appId,
}

refExpoPaymeSDK.current.logout(
  configs,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
)
```

#### Constant

| Property | Type | Description |
| ------------------ | ------ | ---------------------- |
| `ENV.SANDBOX` | `enum` | Môi trường sandbox. |
| `ENV.PRODUCTION` | `enum` | Môi trường production. |

#### Parameters

| Property | Type | Description |
| -------------- | ---------- | ------------------------------------------------------------ |
| `appToken` | `string` | AppId cấp riêng định danh cho mỗi app, cần truyền cho SDK để mã hóa. |
| `publicKey` | `string` | Dùng để mã hóa dữ liệu, app tích hợp cần truyền cho SDK để mã hóa. Do hệ thống PayME cung cấp cho app tích hợp. |
| `privateKey` | `string` | app cần truyền vào để giải mã dữ liệu. Bên app sẽ cung cấp cho hệ thống PayME. |
| `connectToken` | `string` | app cần truyền giá trị được cung cấp ở trên, xem cách tạo bên dưới. |
| `env` | `string` | Môi trường sử dụng SDK |
| `appId` | `string` | Là appId khi đăng ký merchant sdk sẽ đc hệ thống tạo cho |

#### getAccountInfo

App có thể dùng thuộc tính này sau khi khởi tạo SDK để biết được trạng thái liên kết tới ví PayME.

```javascript
refExpoPaymeSDK.current.getAccountInfo(
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
)
```
#### openWallet - Mở UI chức năng PayME tổng hợp

Hàm này được gọi khi từ app tích hợp khi muốn gọi 1 chức năng PayME bằng cách truyền vào tham số Action như trên.

```javascript
refExpoPaymeSDK.current.openWallet(
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
)
```
#### openHistory
Hàm này được gọi khi từ app tích hợp khi muốn mở lịch sử giao dịch từ ví.

** Yêu cầu tài khoản đã kích hoạt và định danh để mở lịch sử Ví 

⚠️⚠️⚠️ version 0.3.1 trở đi

```javascript
refExpoPaymeSDK.current.openHistory(
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
)
```
#### deposit - Nạp tiền

```javascript
refExpoPaymeSDK.current.deposit(
	{
    amount: Number,
    description: String,
    extraData: String,
    closeWhenDone: Boolean,
  },
  onSuccess: (response: any) => void,
  onError: (error: any) => void
);
```

| **Tham số** | **Bắt buộc** | **Giải thích** |
| :----------------------------------------------------------- | :----------- | :----------------------------------------------------------- |
| [amount](https://www.notion.so/amount-34eb8b97a9d04453867a7e4d87482980) | Yes| Dùng trong trường hợp action là Deposit/Withdraw thì truyền vào số tiền |
| [description](https://www.notion.so/description-59034b8b0afe4f90a9118da3a478e7c0) | Yes| Truyền mô tả của giao dịch nếu có |
| [extraData](https://www.notion.so/extraData-60ec44734315404685d82f9ab1d2886a) | No | Khi thực hiện Deposit hoặc Withdraw thì app tích hợp cần truyền thêm các dữ liệu khác nếu muốn để hệ thông backend PayME có thể IBN lại hệ thống backend app tích hợp đối chiều. Ví dụ : transactionID của giao dịch hay bất kỳ dữ liệu nào cần thiết đối với hệ thống app tích hợp. |
| closeWhenDone | Yes | true: Đóng SDK khi hoàn tất giao dịch |
| onSuccess | Yes | Dùng để bắt callback khi thực hiện giao dịch thành công từ PayME SDK |
| onError | Yes | Dùng để bắt callback khi có lỗi xảy ra trong quá trình gọi PayME SDK |

#### withdraw - Rút tiền

```javascript
refExpoPaymeSDK.current.withdraw(
	{
    amount: Number,
    description: String,
    extraData: String,
    closeWhenDone: Boolean,
  },
  onSuccess: (response: any) => void,
  onError: (error: any) => void
);
```

| **Tham số** | **Bắt buộc** | **Giải thích** |
| :----------------------------------------------------------- | :----------- | :----------------------------------------------------------- |
| [amount](https://www.notion.so/amount-34eb8b97a9d04453867a7e4d87482980) | Yes| Dùng trong trường hợp action là Deposit/Withdraw thì truyền vào số tiền |
| [description](https://www.notion.so/description-59034b8b0afe4f90a9118da3a478e7c0) | Yes| Truyền mô tả của giao dịch nếu có |
| [extraData](https://www.notion.so/extraData-60ec44734315404685d82f9ab1d2886a) | No | Khi thực hiện Deposit hoặc Withdraw thì app tích hợp cần truyền thêm các dữ liệu khác nếu muốn để hệ thông backend PayME có thể IBN lại hệ thống backend app tích hợp đối chiều. Ví dụ : transactionID của giao dịch hay bất kỳ dữ liệu nào cần thiết đối với hệ thống app tích hợp. |
| closeWhenDone | Yes | true: Đóng SDK khi hoàn tất giao dịch |
| onSuccess | Yes | Dùng để bắt callback khi thực hiện giao dịch thành công từ PayME SDK |
| onError | Yes | Dùng để bắt callback khi có lỗi xảy ra trong quá trình gọi PayME SDK |

#### transfer - Chuyển tiền

```javascript
refExpoPaymeSDK.current.transfer(
	{
    amount: Number,
    description: String,
    closeWhenDone: Boolean,
  },
  onSuccess: (response: any) => void,
  onError: (error: any) => void
);
```

| **Tham số** | **Bắt buộc** | **Giải thích** |
| :----------------------------------------------------------- | :----------- | :----------------------------------------------------------- |
| [amount](https://www.notion.so/amount-34eb8b97a9d04453867a7e4d87482980) | Yes| Dùng trong trường hợp action là Deposit/Withdraw thì truyền vào số tiền |
| [description](https://www.notion.so/description-59034b8b0afe4f90a9118da3a478e7c0) | Yes| Truyền mô tả của giao dịch nếu có |
| closeWhenDone | Yes | true: Đóng SDK khi hoàn tất giao dịch |
| onSuccess | Yes | Dùng để bắt callback khi thực hiện giao dịch thành công từ PayME SDK |
| onError | Yes | Dùng để bắt callback khi có lỗi xảy ra trong quá trình gọi PayME SDK |

#### scanQR() - Mở chức năng quét mã QR để thanh toán

```javascript
refExpoPaymeSDK.current.scanQR(
      {
        payCode: String
      },
      onSuccess: (response: any) => void,
      onError: (error: any) => void,
);
```

| **Tham số** | **Bắt buộc** | **Giải thích** |
| :----------------------------------------------------------- | :----------- | :----------------------------------------------------------- |
| payCode | Yes | [Danh sách phương thức thanh toán](#danh-sách-phương-thức-thanh-toán) |

Định dạng qr :
```javascript
 const qrString = "{$type}|${storeId}|${action}|${amount}|${note}|${orderId}|${userName}"
```

Ví dụ  :
```javascript
const qrString = "OPENEWALLET|54938607|PAYMENT|20000|Chuyentien|2445562323|taikhoan"
```

- action: loại giao dịch ( 'PAYMENT' => thanh toán)
- amount: số tiền thanh toán
- note: Mô tả giao dịch từ phía đối tác
- orderId: mã giao dịch của đối tác, cần duy nhất trên mỗi giao dịch. Tối đa 22 kí tự.
- storeId: ID của store phía công thanh toán thực hiên giao dịch thanh toán
- userName: Tên tài khoản
- type: OPENEWALLET

#### payQRCode() - thanh toán mã QR code
```javascript
refExpoPaymeSDK.current.payQRCode(
      {
        qr: String,
        isShowResultUI: Boolean,
        payCode: String
      },
      onSuccess: (response: any) => void,
      onError: (error: any) => void
);
```

| **Tham số** | **Bắt buộc** | **Giải thích** |
| :----------------------------------------------------------- | :----------- | :----------------------------------------------------------- |
| qr | Yes | Mã QR để thanh toán  (Định dạng QR như hàm scanQR) |
| isShowResultUI | Yes | Option hiển thị UI kết quả giao dịch |
| payCode | Yes | [Danh sách phương thức thanh toán](#danh-sách-phương-thức-thanh-toán) |

#### getListService

App có thể dùng thược tính này sau khi khởi tạo SDK để biết danh sách các dịch vụ mà PayME đang cung cấp

```javascript

refExpoPaymeSDK.current.getListService(
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
)

```
#### openService

Hàm này được gọi khi từ app tích hợp khi muốn gọi 1 dịch vụ mà PayME cũng cấp bằng cách truyền vào tham số serviceCode như trên

```javascript
refExpoPaymeSDK.current.openService(
  serviceCode: String,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
)
```
#### pay - Thanh toán

Hàm này được dùng khi app cần thanh toán 1 khoản tiền từ ví PayME đã được kích hoạt.

```javascript
const  data = {
  amount:  Number,
  orderId:  String,
  storeId:  Number?,
  userName: String?,
  extractData: String,
  note:  String,
  isShowResultUI: true,
  payCode: String
}

refExpoPaymeSDK.current.pay(
  data,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
);
```

| **Tham số** | **Bắt buộc** | **Giải thích** |
| :----------------------------------------------------------- | :----------- | :----------------------------------------------------------- |
| amount | Yes | Số tiền cần thanh toán bên app truyền qua cho SDK. |
| note | No | Mô tả giao dịch từ phía đối tác. |
| orderId | Yes | Mã giao dịch của đối tác, cần duy nhất trên mỗi giao dịch. Tối đa 22 kí tự. |
| storeId | No | ID của store phía công thanh toán thực hiên giao dịch thanh toán. |
| userName | No | Tên tài khoản. |
| extractData | No | Thông tin bổ sung (extraData) là một nội dung được định nghĩa theo dạng chuỗi, chứa thông tin bổ sung của một giao dịch mà đối tác muốn nhận về khi hoàn tất một giao dịch với PAYME. Nếu Merchant ko cần IPN thêm data custom của mình có thể bỏ qua. |
| isShowResultUI | Yes | Option hiển thị UI kết quả thanh toán. |
| payCode | Yes | [Danh sách phương thức thanh toán](#danh-sách-phương-thức-thanh-toán) |
| onSuccess | Yes | Dùng để bắt callback khi thực hiện giao dịch thành công từ PayME SDK |
| onError | Yes | Dùng để bắt callback khi có lỗi xảy ra trong quá trình gọi PayME SDK |

Trong trường hợp app tích hợp cần lấy số dư để tự hiển thị lên UI trên app thì có thể dùng hàm, hàm này không hiển thị UI của PayME SDK.
- Khi thanh toán bằng ví PayME thì yêu cầu tài khoản đã kích hoạt, định danh và số dư trong ví phải lớn hơn số tiền thanh toán
- Thông tin tài khoản lấy qua hàm <code>getAccountInfo()</code>
- Thông tin số dư lấy qua hàm <code>getWalletInfo()</code>

#### getWalletInfo - Lấy các thông tin của ví

```javascript
refExpoPaymeSDK.current.getWalletInfo(
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
)
```

```json
{
	"response": {
		"balance": 111,
		"detail": {
			"cash": 1,
			"lockCash": 2
		}
	}
}
```

*balance*: App tích hợp có thể sử dụng giá trị trong key balance để hiển thị, các field khác hiện tại chưa dùng.

*detail.cash*: Tiền có thể dùng.

*detail.lockCash*: Tiền bị lock.

## Danh sách phương thức thanh toán
| **payCode** | **Phương thức thanh toán** |
| :------------| :-------------|
| PAYME  | Thanh toán ví PayME |
| ATM  | Thanh toán thẻ ATM Nội địa |
| MANUAL_BANK  | Thanh toán chuyển khoản ngân hàng |
| CREDIT  | Thanh toán thẻ tín dụng |
| VIET_QR  | Thanh toán VietQR |

## License
Copyright 2020 @ [PayME](payme.vn)
