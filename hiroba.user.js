// ==UserScript==
// @name         Hiroba plugin
// @namespace    https://donderhiroba.jp
// @version      1.01
// @description  他為ドンだーひろば增加新功能:在成績單上方增加王冠過濾按鈕 及 王冠資訊
// @author       Lunyeung
// @include      https://donderhiroba.jp/*
// @icon         https://www.google.com/s2/favicons?domain=donderhiroba.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424904/Hiroba%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/424904/Hiroba%20plugin.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = window.jQuery;

    if (window.location.href.indexOf("score_list") > 0) {
	scoreListFilter();
    }
    function scoreListFilter(){
        var countDonderFull = 0;
        var countGold = 0;
        var countSilver = 0;
        var countPlayed = 0;
        var countNone = 0;

        var buttonsHtml = "";
        buttonsHtml += "<button name='crown_filter' data-crown='donderfull'>全良</button>";
        buttonsHtml += "<button name='crown_filter' data-crown='gold'>フルコン</button>";
        buttonsHtml += "<button name='crown_filter' data-crown='silver'>クリア</button>";
        buttonsHtml += "<button name='crown_filter' data-crown='played'>ノルマ落ち</button>";
        buttonsHtml += "<button name='crown_filter' data-crown='none'>未プレイ</button>";

        $('.tabList').append(buttonsHtml);

        $('[name="crown_filter"]').click(function(){
            crownFilter($(this).data('crown'));
            console.log($(this).data('crown'));
        });


        var songNameList = [];
        var crownList =[];

        $( ".songName").each(function( index){
            songNameList.push($(this).html());
        });

        $( ".buttonList li:nth-child(4) a img" ).each(function( index ) {
            let img = $(this).attr('src');
            var crownStatus = "";
            if(img.indexOf("donderfull") > 0){
                crownStatus = "donderfull";
                countDonderFull ++;
            } else if(img.indexOf("gold") > 0){
                crownStatus = "gold";
                countGold ++;
            } else if(img.indexOf("silver") > 0){
                crownStatus = "silver";
                countSilver ++;
            } else if(img.indexOf("played") > 0){
                crownStatus = "played";
                countPlayed ++;
            } else if(img.indexOf("none") > 0){
                crownStatus = "none";
                countNone ++;
            }
            crownList.push({'songName':songNameList[index],'crown':crownStatus});
        });

        $( '[name="crown_filter"]' ).each(function( index ) {
            switch($(this).data('crown')){
                case "donderfull":
                    $(this).append('('+ countDonderFull + ')');
                    break;
                case "gold":
                    $(this).append('('+ countGold + ')');
                    break;
                case "silver":
                    $(this).append('('+ countSilver + ')');
                    break;
                case "played":
                    $(this).append('('+ countPlayed + ')');
                    break;
                case "none":
                    $(this).append('('+ countNone + ')');
                    break;
            }
        });
        
        // 制覇状況を見やすく表示

// ・おに譜面フルコン制覇 = 金色

// ・おに譜面制覇 = 虹色

var remainingHtml = `

    <div class="hiroba-progress hiroba-progress-rainbow">

        <span class="hiroba-progress-title">おに譜面制覇</span>

        <span class="hiroba-progress-count">あと ${countGold + countSilver + countPlayed + countNone} 譜面</span>

    </div>`;

var remainingHtml_gold = `

    <div class="hiroba-progress hiroba-progress-gold">

        <span class="hiroba-progress-title">おに譜面フルコン制覇</span>

        <span class="hiroba-progress-count">あと ${countSilver + countPlayed + countNone} 譜面</span>

    </div>`;

// このページだけで使うCSSを追加

if (!document.getElementById('hiroba-progress-style')) {

    $('head').append(`

        <style id="hiroba-progress-style">

            .hiroba-progress {

                margin: 8px 10px;

                padding: 10px 14px;

                border-radius: 8px;

                color: #fff;

                font-weight: bold;

                text-align: center;

                line-height: 1.45;

                text-shadow:

                    0 1px 2px rgba(0,0,0,.8),

                    0 0 4px rgba(0,0,0,.45);

                box-shadow:

                    0 2px 5px rgba(0,0,0,.35),

                    inset 0 1px 0 rgba(255,255,255,.35);

                border: 1px solid rgba(255,255,255,.35);

            }

            .hiroba-progress-title {

                display: block;

                font-size: 14px;

            }

            .hiroba-progress-count {

                display: block;

                margin-top: 2px;

                font-size: 13px;

            }

            /* フルコン制覇：金 */

            .hiroba-progress-gold {

                background:

                    linear-gradient(

                        135deg,

                        #8a5a00 0%,

                        #d99a00 22%,

                        #ffe27a 48%,

                        #d99a00 72%,

                        #8a5a00 100%

                    );

            }

            /* おに譜面制覇：虹 */

            .hiroba-progress-rainbow {

                background:

                    linear-gradient(

                        110deg,

                        #ff3b30 0%,

                        #ff9500 16%,

                        #ffd60a 30%,

                        #34c759 45%,

                        #0a84ff 62%,

                        #5856d6 78%,

                        #af52de 90%,

                        #ff375f 100%

                    );

            }

        </style>

    `);

}

$('.tabList').append(remainingHtml);

$('.tabList').append(remainingHtml_gold);
        
        function crownFilter(crown){
            $(".contentBox").each(function( index){
                $(this).show();
                if(crownList[index].crown != crown){
                    $(this).hide();
                }
            });
        }
    }








    // Your code here...
})();