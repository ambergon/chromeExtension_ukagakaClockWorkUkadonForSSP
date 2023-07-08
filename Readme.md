# ukagakaClockWorkUkadonForSSP
ゴーストと一緒にうかどんをのぞき込むChrome拡張機能です。<br>
[うかどん](https://ukadon.shillest.net/public/local)<br>

ブラウザ上での更新を確認し、更新があった場合は投稿内容と投稿者をゴーストに通知します。<br>
それぞれのカラム(リスト)ごとに更新確認のする・しないを個別に設定することができます。<br>
初期設定だとEmilyにSSTPが飛ぶようになっています。<br>



## 導入
### DownLoad
下記からzipをダウンロードして適当なフォルダに解凍します。<br>
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa


### 読み込み
[chrome拡張](chrome://extensions/)を開き、右上のデベロッパーモードを有効にし、左上のパッケージ化されていない拡張機能を取り込む->展開したフォルダ/chromeExtension-ClockWorkUkadonを開きフォルダを選択<br>


以前作った拡張で、導入の画像説明があるもの。わからなければ。<br>
[GitHub - ambergon/ChromeVimKeybind](https://github.com/ambergon/ChromeVimKeybind)<br>


## 環境
Windows 10<br>
Chrome<br>
SSP 2.6.48<br>


## 実行開始
実行開始状態になると、IfGhostで指定したゴーストに通知が行きます。<br>
ブラウザにフォーカスした状態で下記の入力すると実行開始状態になります。<br>
```
#US仕様のキーボードで[Shift + ,] x 3 で実行しています。
<<<
```


## 設定可能項目
conf.jsonを編集することで詳細を設定できます。
```.json
{ 
    "LoadSection"   : { 
        "ローカルタイムライン"          : 1 ,
        "ホーム"                        : 1 ,
        "技術者"                        : 1 
    }, 
    "TootOffSet"                   : 20      ,
    "UpdateTime"                   : 60000   ,
    "Interval"                     : 26000   ,
    "beforeText"                   : "\\0\\b[2]\\_q"      ,
    "afterText"                    : "\\_q"               ,
    "IfGhost"                      : "Emily"
} 
```
- LoadSection
    読み込むセクション名:On/Offを設定します。例えば、「技術者」というリストを作成し、ピン止めしておきます。そのうえで、下記のように設定しておくと更新の確認がされます。<br>
    0に設定するとその項目は読み込まれません。<br>
```
        "技術者"                        : 1 
```

- TootOffSet
    0を指定すると、実行時に既に表示されている範囲のトゥートをすべて古いものから送信します。<br>
    画面サイズにもよると思いますが、20以上を指定すると実行時以降に投稿された内容を取得します。<br>

- UpdateTime
    更新確認間隔の設定をします。60000は60秒間隔です。投稿を検知した場合、件数 x Interval秒上乗せされます。<br>

- Interval
    ここで指定した間隔でSSTPを送信します。デフォルトだと26秒間隔で送信されます。<br>

- beforeText
    送信されるテキストの接頭辞です。<br>

- afterText
    送信されるテキストの接尾辞です。<br>

- IfGhost
    送信先のゴースト名です。<br>

    
## Ghost側の追加実装
基本の機能は何もしなくても問題ありませんが、Ghost側で実装を追加することで、投稿内容に応じた反応等を調整できるようになっています。<br>

- OnRecieveClockWorkUkadon
    SSTPで飛ぶ投稿内容を関数で拾うことができます。<br>
    第一引数:送信者名<br>
    第二引数:送信テキスト<br>

- OnKillTimeClockWorkUkadon
    暇つぶし用関数。<br>
    取得内容がなかった際に (UpdateTime / Interval) - 1 回発生する。<br>
    ログファイルの再生等に使用するとよい。<br>
    第一引数に送信者名"ゼンマイ仕掛けのうかどん"が渡される。<br>

- OnClockWorkUkadonOpenLink
    送信されるテキストの最後に下記のようなスクリプトが付きます。<br>
    クリックでリンクが開かれるようにするとチェック作業が捗ります。<br>
```
    "\\_a[OnClockWorkUkadonOpenLink,https://ukadon.shillest.net/投稿ユーザー/投稿ID]〇\\_a";
```


## 注意事項
ブラウザ側で情報を引っ張ってくる仕様なので、ブラウザが応答・更新が発生しない状態だと情報が回ってきません。<br>
具体的に、別タブで表示していたりすると読み込まれていなかったりします。<br>
おすすめはWindows10以降の標準機能の仮想デスクトップに表示しておくと使いやすいと思います。<br>


投稿IDを使ってどこまで読み込んだか管理しているので、投稿が削除されたりすると迷子になる可能性があります。<br>


## その他
他のmastodonで使いたいんだけど?<br>
manifest.jsonのmatchesを書き換えることで使えると思いますが、他の鯖のことはわかりません。<br>
```
    "content_scripts": [{
        "matches": [ "https://ukadon.shillest.net/*" ],
        "js": [ "front.js" ]
    }],
```


## 他
使用は全て自己責任です。<br>


## Author
ambergon










