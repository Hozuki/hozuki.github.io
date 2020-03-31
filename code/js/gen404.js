(function () {
    var idMain = "err-main", idExtra = "err-extra", idSig = "err-sig", idSig2 = "err-sig2";
    var MSG = {
        "zh-cn": {
            title: "404 - 初春饰利在监视着你！",
            text: {
                "main": "我监视着整个互联网，<br/>但是并没找到你想要的页面。",
                "extra": "由于本博客可能会时不时地调整分类或链接格式，所以不妨试试从首页开始找一下。",
                "sig": "- <b>初春饰利</b>",
                "sig2": "&nbsp;&nbsp;学园都市风纪委员会第177支部"
            }
        },
        "zh-tw": {
            title: "404 - 初春飾利在監視著你！",
            text: {
                "main": "我監視著整個互聯網，<br/>但是並沒找到你想要的頁面。",
                "extra": "由於本部落格可能會時不時地調整分類或鏈接格式，所以不妨試試從首頁開始找一下。",
                "sig": "- <b>初春飾利</b>",
                "sig2": "&nbsp;&nbsp;學園都市風紀委員會第177支部"
            }
        },
        "jp": {
            title: "404 - 初春飾利は見ている！",
            text: {
                "main": "I'm monitoring the whole Internet,<br/>and the page requested does not exist.",
                "extra": "Due to frequent page changes, you probably should enter the Matrix again, from the homepage.",
                "sig": "- <b>Uiharu Kazari</b>,",
                "sig2": "&nbsp;&nbsp;Branch 177 of Judgement of Academy City"
            }
        },
        "en": {
            title: "404 - Uiharu Kazari is watching you!",
            text: {
                "main": "I'm monitoring the whole Internet,<br/>and the page requested does not exist.",
                "extra": "Due to frequent page changes, you probably should enter the Matrix again, from the homepage.",
                "sig": "- <b>Uiharu Kazari</b>,",
                "sig2": "&nbsp;&nbsp;Branch 177 of Judgement of Academy City"
            }
        }
    };
    var userLang = navigator.language;
    var langObj;
	var lang = (navigator.language || navigator.userLanguage).toLowerCase();
	if (lang === "zh-cn") {
		// 简体中文
        langObj = MSG["zh-cn"];
	} else if (lang === "zh-tw") {
		// 繁体中文
        langObj = MSG["zh-tw"];
	} else if (lang.substring(0, 2) === "jp") {
		// 日文
        langObj = MSG["jp"];
	} else /*if (lang.substring(0, 2) === "en")*/ {
		// 其他，默认为英语语系
        langObj = MSG["en"];
	}
})();