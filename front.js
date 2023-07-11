


//SectionIdMax = 0;
//function DoDo() {
//    //class一覧を回収してみる。
//    Sections = document.getElementsByClassName( "column" );
//    console.log( Sections );
//
//    //ウィンドウ幅が小さいとローカルタイムラインのみになる。 
//    console.log( "セクションの数 : " + Sections.length );
//
//    for (let _i = 0 ; _i < Sections.length ; _i++){
//        //セクション名一覧を。
//        //自前セクションは読み込みが遅いのか、ariaLabelがnullの時がある。
//        console.log( Sections[_i].ariaLabel );
//
//        //除外項目
//        if( Sections[_i].ariaLabel == "通知" || Sections[_i].ariaLabel == null ){
//            continue;
//        }
//        console.log( Sections[_i] );
//
//        //再取得用にIDを付与する。
//        Sections[_i].id    = "SectionNumber" + SectionIdMax;
//        SectionIdMax++;
//    }
//
//    //付与したIDのあるセクションを探索する。
//    for (let _i = 0 ; _i < SectionIdMax ; _i++){
//        const SectionId   = document.getElementById( "SectionNumber" + _i );
//        const articles    = SectionId.getElementsByTagName( "article" );
//        console.log( articles );
//        for (let _y = 0 ; _y < articles.length ; _y++){
//            console.log( articles[_y] );
//            //htmlタグがおもらしすることがあるな。
//            //あとスタンプ類をどのように処理するかが問題である。
//            console.log( [_y] );
//            console.log( articles[_y].innerText );
//            console.log( articles[_y].dataset.id );
//        }
//    }
//}



var ZENMAI          = 0;
var ConfigJson      = {};

var NextStart       = 0;
var Sections;
var SectionOldToot = {};

var IfGhost         = "";
var afterText       = "";
var beforeText      = "";
var TootOffSet      = 0;
var INTERVAL        = 26;
var UPDATETIME      = 6000;


SectionIdMax = 0;
function SetSectionID(){
    //class一覧を回収してみる。
    Sections = document.getElementsByClassName( "column" );
    //console.log( Sections );
    //ウィンドウ幅が小さいとローカルタイムラインのみになる。 
    console.log( "セクションの数 : " + Sections.length );
    for (let _i = 0 ; _i < Sections.length ; _i++){
        //セクション名一覧を。
        //自前セクションは読み込みが遅いのか、ariaLabelがnullの時がある。
        console.log( Sections[_i].ariaLabel );

        //除外項目
        if( Sections[_i].ariaLabel == "通知" || Sections[_i].ariaLabel == null ){
            continue;
        }

        //読み込む項目かどうか。
        const SectionName =  Sections[_i].ariaLabel;
        if( ConfigJson["LoadSection"][SectionName] != 1){
            continue;
        }
        //console.log( Sections[_i] );
        //再取得用にIDを付与する。
        Sections[_i].id    = "SectionNumber" + SectionIdMax;
        SectionIdMax++;
    }
}


function Initialise(){

    TootOffSet  = ConfigJson[ "TootOffSet" ];
    INTERVAL    = ConfigJson[ "Interval"    ];
    UPDATETIME  = ConfigJson[ "UpdateTime"  ];

    IfGhost     = ConfigJson[ "IfGhost"     ];
    afterText   = ConfigJson[ "afterText"   ];
    beforeText  = ConfigJson[ "beforeText"  ];

    var SendJson = { 
        FunctionName : "SendSSTP"   ,
        SakuraScript : ""           ,
        IfGhost      : IfGhost      ,
        afterText    : afterText    ,
        beforeText   : beforeText   ,
        Time         : 0
    };  
    chrome.runtime.sendMessage( SendJson );
}


function ReplaceLine( SakuraScript ){
    //console.log( SakuraScript );

    //URLの作成。
    let urlText = ""
    let y  = SakuraScript.match( /TootID:.*?$/ );
    let xxxxID = y[0].replace( "TootID:" , "" );
    //console.log( xxxxID );
    SakuraScript = SakuraScript.replace( /TootID:.*?$/ , "" );

    //これ、相手が別鯖の時はまずいかもしんないね。
    //どっかでログを見よう。
    urlText = "\\_a[OnClockWorkUkadonOpenLink," + "https://ukadon.shillest.net" + "/UserSetPoint/" + xxxxID + "]〇\\_a";

    //改行より先に処理する必要がある。
    SakuraScript = SakuraScript.replaceAll( "https://\n" , "https://" );
    SakuraScript = SakuraScript.replaceAll( "http://\n" , "http://" );

    //最後はspaceの可能性。
    SakuraScript = SakuraScript.replace( /http[s]?:\/\/[\w\./-_!%?#:+=!&]*?[\n][\w\./-_!%?#:+=!&]*?[\n ]/g , "リンク" );

    //文末の+を削除
    SakuraScript = SakuraScript.replace( /\+$/g , "" );
    //文末の返答数を削除
    SakuraScript = SakuraScript.replace( /\n[0-9]+$/g , "" );

    //文末の 翻訳を削除
    SakuraScript = SakuraScript.replace( /\\n翻訳/g , "" );

    //もっと見る
    SakuraScript = SakuraScript.replace( "もっと見る" , "read more" );
    
    //危険なモノを処分する。;
    SakuraScript = SakuraScript.replaceAll( "'" , "" );
    SakuraScript = SakuraScript.replaceAll( '"' , "" );
    SakuraScript = SakuraScript.replaceAll( "[" , "「" );
    SakuraScript = SakuraScript.replaceAll( "]" , "」" );
    SakuraScript = SakuraScript.replaceAll( "{" , "「" );
    SakuraScript = SakuraScript.replaceAll( "}" , "」" );
    SakuraScript = SakuraScript.replaceAll( "|" , "" );
    SakuraScript = SakuraScript.replaceAll( "%" , "パーセント" );

    //整形;
    SakuraScript = SakuraScript.replaceAll( "？" , "?" );
    SakuraScript = SakuraScript.replaceAll( "！" , "!" );
    SakuraScript = SakuraScript.replaceAll( "　" , " " );


    ////サクラスクリプトの置換を試みる。
    SakuraScript = SakuraScript.replaceAll( "\\" , "¥" );
    //改行
    SakuraScript = SakuraScript.replace( /\n+/g , "\\n" );

    //英文対応
    //SakuraScript = SakuraScript.replaceAll( "," , ",\\n" );
    //SakuraScript = SakuraScript.replaceAll( "?" , "?\\n" );

    //スペースを省略
    SakuraScript = SakuraScript.replace( / +/g , " " );

    SendText = SakuraScript + urlText ;
    return SendText;
}


function getArticleArray( SectionId , articles ){
    var ResultArray = [];
    if( SectionOldToot[ SectionId ] == undefined ){
        if( articles[0] == undefined ){
            return ResultArray;
        }

        var _max = articles.length - TootOffSet;
        for( var _i = 0 ; _i < _max; _i++ ){
            let tootText = articles[_i].innerText;
            var x = articles[_i].dataset.id;
            tootText = tootText + "TootID:" + x;
            tootText = ReplaceLine( tootText );
            ResultArray.push( tootText );
        }
        SectionOldToot[ SectionId ] = articles[0].dataset.id;
        console.log( "first load : " + SectionId );

    } else {
        console.log( "OLD : " + SectionOldToot[ SectionId ]);
        for( var _i = 0 ; _i < articles.length ; _i++ ){
            if( SectionOldToot[ SectionId ] === articles[_i].dataset.id ){
                console.log( "break" );
                break;
            }
            let tootText = articles[_i].innerText;
            var x = articles[_i].dataset.id;
            tootText = tootText + "TootID:" + x;
            tootText = ReplaceLine( tootText );

            console.log( "NOW : " + tootText );
            ResultArray.push( tootText );
        }
        SectionOldToot[ SectionId ] = articles[0].dataset.id;
    }
    ResultArray.reverse();
    return ResultArray;
}


function Start( ){
    NextStart = 0;

    var time = new Date();
    console.log( time.getMinutes() + ":" + time.getSeconds() );

    var SectionToot = [];
    //get articles
    for (let _i = 0 ; _i < SectionIdMax ; _i++){
        const SectionId = "SectionNumber" + _i
        const Section   = document.getElementById( SectionId );
        const articles    = Section.getElementsByTagName( "article" );
        var _array        = getArticleArray( SectionId , articles );
        SectionToot.push( _array );
    }
    SectionToot = SectionToot.flat(2);

    //console.log( "読み上げリスト" );
    //console.log( SectionToot );

    var interval = 0;
    for (let _i = 0 ; _i < SectionToot.length ; _i++ ){
        console.log( "送信内容" );
        console.log( SectionToot[ _i ] );
        console.log( "interval" );
        console.log( interval );

        var SendJson = { 
            FunctionName : "SendSSTP",
            SakuraScript : SectionToot[ _i ],
            IfGhost      : IfGhost      ,
            afterText    : afterText    ,
            beforeText   : beforeText   ,
            Time         : interval
        };  
        chrome.runtime.sendMessage( SendJson );
        interval = interval + INTERVAL;
    }

    //読み込みがあればそのまま廻す。
    if ( SectionToot.length != 0 ){
        NextStart = interval;

    //無ければ待機時間を置く。
    } else {
        //ここを外すと0タイムで更新される。
        NextStart = interval + UPDATETIME;

        //KillTime関数機構
        var num     = Math.floor( UPDATETIME / INTERVAL );
        var wait    = 0;
        for (let _i = 0 ; _i < num ; _i++ ){
            var SendJson = { 
                FunctionName : "KillTime"   ,
                IfGhost      : IfGhost      ,
                Time         : wait 
            };  
            chrome.runtime.sendMessage( SendJson );
            wait = wait + INTERVAL;
        }
    }
    console.log( "Next : " + NextStart );
    setTimeout(() => { 
        Start();
    }, NextStart );
}


chrome.runtime.onMessage.addListener(function ( json , sender, sendResponse ) {
    if( json[ "FunctionName" ] == "SetJson" ){
        ConfigJson = json;
        Initialise();
        //load sections
        SetSectionID();
        Start();
    }
    //return true;
});


//windowsでは手動実行できるように使用。
console.log( "you are windows user plz push <<<" );
function AddKeyEvent(e) {
    if ( e.shiftKey == true && e.keyCode == 188 ) {
        ZENMAI++;
        if( ZENMAI == 3 ){
            console.log( "Start ゼンマイ仕掛けのうかどん" );
            var SendJson = { 
                FunctionName : "LoadJson"
            };  
            chrome.runtime.sendMessage( SendJson );
        }
    }
}


window.addEventListener( 'keydown' , function(e) {
    this.AddKeyEvent(e);
});





