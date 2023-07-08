


var TABID ;



function SendSSTP( SakuraScript , beforeText , afterText , Ghost ) { 
    var Sender = "";
    if( SakuraScript == "" ){
        Sender = "ゼンマイ仕掛けのうかどん";
        SakuraScript = "ジジッ..ジジッ..ジジッ....";
    } else {

        //check boost
        let CheckBoostStr = SakuraScript.split( "\\n" );
        let CheckBoost  = CheckBoostStr[0].match( /^.*?ブースト$/ );
        if( !CheckBoost ){
            Sender = CheckBoostStr[1];
            SakuraScript = SakuraScript.replace( /^.*?\\n/ , "" );
            SakuraScript = SakuraScript.replace( /^.*?\\n/ , "" );
            SakuraScript = SakuraScript.replace( /^.*?\\n/ , "" );

            SakuraScript = SakuraScript.replace( "UserSetPoint" , CheckBoostStr[2] );

        //ブースト処理
        } else {
            Sender = CheckBoostStr[2] + "/" + CheckBoostStr[0];
            SakuraScript = SakuraScript.replace( /^.*?\\n/ , "" );
            SakuraScript = SakuraScript.replace( /^.*?\\n/ , "" );
            SakuraScript = SakuraScript.replace( /^.*?\\n/ , "" );
            SakuraScript = SakuraScript.replace( /^.*?\\n/ , "" );

            SakuraScript = SakuraScript.replace( "UserSetPoint" , CheckBoostStr[3] );
        }
        //文頭の改行を処分する。
        SakuraScript = SakuraScript.replace( /^\\n*/ , "" );
    }

    console.log( "do" );
    console.log( SakuraScript );
    //前後整形。
    SakuraScript = beforeText + SakuraScript + afterText;

    var sstpText =        "SEND SSTP/1.4\r\n";
    sstpText = sstpText + "Content-Type: text/plain"                  + "\r\n"; 
    sstpText = sstpText + "Sender      : " + Sender                   + "\r\n"; 
    //sstpText = sstpText + "Option      : nobreak"                     + "\r\n"; 
    sstpText = sstpText + "Option      : nobreak,notranslate"         + "\r\n"; 
    sstpText = sstpText + "Charset     : UTF-8"                       + "\r\n"; 
    sstpText = sstpText + "IfGhost     : " + Ghost                    + "\r\n"; 
    sstpText = sstpText + "Event       : OnRecieveClockWorkUkadon"    + "\r\n"; 
    sstpText = sstpText + "Reference0  : " + Sender                   + "\r\n"; 
    sstpText = sstpText + "Reference1  : " + SakuraScript             + "\r\n"; 
    sstpText = sstpText + "Script      : " + SakuraScript             + "\r\n"; 
    sstpText = sstpText + "\r\n"; 

    const url = "http://localhost:9801/api/sstp/v1";
    var dataSSTP = {}
    dataSSTP[ "method" ]    = "POST";
    dataSSTP[ "body" ]      = sstpText;
    fetch( url , dataSSTP );
} 


//OnKillTimeClockWorkUkadon
//時間つぶし用関数を作成する。
//これはUPDATETIME/再取得のインターバル中にIntervalの回数だけ発生させる。(少数以下切り捨て。
function KillTime( Ghost ) { 
    const Sender = "ゼンマイ仕掛けのうかどん";
    var sstpText =        "SEND SSTP/1.4\r\n";
    sstpText = sstpText + "Content-Type: text/plain"                  + "\r\n"; 
    sstpText = sstpText + "Sender      : " + Sender                   + "\r\n"; 
    sstpText = sstpText + "Option      : nobreak"                     + "\r\n"; 
    sstpText = sstpText + "Charset     : UTF-8"                       + "\r\n"; 
    sstpText = sstpText + "IfGhost     : " + Ghost                    + "\r\n"; 
    sstpText = sstpText + "Event       : OnKillTimeClockWorkUkadon"   + "\r\n"; 
    sstpText = sstpText + "Reference0  : " + Sender                   + "\r\n"; 
    //sstpText = sstpText + "Script      : " + "none SakuraScript"      + "\r\n"; 
    sstpText = sstpText + "\r\n"; 

    const url = "http://localhost:9801/api/sstp/v1";
    var dataSSTP = {}
    dataSSTP[ "method" ]    = "POST";
    dataSSTP[ "body" ]      = sstpText;
    var promise_SSTP = (resolve, reject) => { 
        fetch( url , dataSSTP );
    }
    return new Promise(promise_SSTP); 
}



function SendJson( json ){
    json["FunctionName"] = "SetJson";
    chrome.tabs.sendMessage( TABID , json );
}


function LoadJson(){
    fetch( chrome.runtime.getURL( "conf.json" ) )
        .then((response) => response.json()) 
        .then((data) => SendJson(data));
}


//IDの取得。
//呼び出したタブに設定ファイルを送信する。
chrome.runtime.onMessage.addListener(function ( json , sender, sendResponse ) {
    if( json[ "FunctionName" ] == "LoadJson" ){
        TABID = sender.tab.id;
        LoadJson();
    } else if( json[ "FunctionName" ] == "SendSSTP" ) {
        setTimeout(() => { 
            SendSSTP( json[ "SakuraScript" ], json[ "beforeText" ], json[ "afterText" ], json[ "IfGhost" ] );
        }, json[ "Time" ] );

    } else if( json[ "FunctionName" ] == "KillTime" ) {
        setTimeout(() => { 
            KillTime( json[ "IfGhost" ] );
        }, json[ "Time" ] );
    }
});

