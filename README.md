# liff-test

## 初期化

```sh
# 適当なfirebase appへの紐付け (要functions・課金設定)
$ firebase use <project id>

# LINE APIの用意。Messaging APIのチャンネルと、それに紐付けたLoginチャンネルが必要

# config
$ firebase functions:config:set line.channel_access_token=XXXXXXXXXXXXX
$ firebase functions:config:set line.channel_secret=XXXXXXXXXXXXXXX

# deploy (hosting & functions)
$ firebase deploy

# => hostingされたURLを、Loginチャンネルの方の管理画面からLIFFとして追加。LIFF URLを控えておく
# => デプロイされたfunctions APIのエンドポイント(/api/callback)を、Messaging APIのチャンネルのコールバックに登録

# liff urlをconfigに登録して再デプロイ
$ firebase functions:config:set line.liff_uri=XXXXXXXXXXXXXXX
$ firebase deploy --only functions
```

## 諸注意

* コールバック登録時に、コールバックURLを検証するボタンがあるが、これ基本的にエラーになる。気にしなくていい。
    * ref) [LINE DevelopesのWebhook URLの接続確認でエラーが出る件について - Qiita](https://qiita.com/q_masa/items/c9db3e8396fb62cc64ed)

## 参考

* APIを用いて送信できるレスポンスの種類はこのあたりを参照
    * https://developers.line.biz/ja/docs/messaging-api/message-types/#template-messages
* リッチメニューについてはこのあたりを参照
    * https://www.linebiz.com/jp/column/technique/20180731-01/