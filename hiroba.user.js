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
        
                // ========================================
        // 制覇までの残り譜面数
        // ========================================

        // 全良制覇までの残り
        // = フルコン + クリア + ノルマ落ち + 未プレイ
        var remainingDonderFull =
            countGold + countSilver + countPlayed + countNone;

        // フルコン制覇までの残り
        // = クリア + ノルマ落ち + 未プレイ
        var remainingFullCombo =
            countSilver + countPlayed + countNone;


        // ========================================
        // 表示
        // ========================================

        var remainingHtml = `
            <div class="hiroba-progress">
                制覇まであと
                <span class="hiroba-count hiroba-rainbow">
                    ${remainingDonderFull}譜面
                </span>
            </div>`;

        var remainingHtml_gold = `
            <div class="hiroba-progress">
                フルコン制覇まであと
                <span class="hiroba-count hiroba-gold">
                    ${remainingFullCombo}譜面
                </span>
            </div>`;


        // ========================================
        // CSS
        // ========================================

        if (!document.getElementById('hiroba-progress-style')) {
            $('head').append(`
                <style id="hiroba-progress-style">

                    .hiroba-progress {
                        margin: 8px 10px;
                        padding: 8px 12px;
                        background: #fff;
                        color: #333;
                        font-weight: bold;
                        font-size: 14px;
                        line-height: 1.5;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                    }

                    .hiroba-count {
                        margin-left: 4px;
                        font-weight: bold;
                    }


                    /* ==================================
                       おに譜面制覇：流れる虹色
                       ================================== */

                    .hiroba-rainbow {
                        background: linear-gradient(
                            90deg,
                            #ff3b30,
                            #ff9500,
                            #ffd60a,
                            #34c759,
                            #0a84ff,
                            #5856d6,
                            #af52de,
                            #ff3b30
                        );

                        background-size: 300% 100%;

                        -webkit-background-clip: text;
                        background-clip: text;

                        -webkit-text-fill-color: transparent;

                        animation:
                            hiroba-rainbow-flow
                            3s linear infinite;
                    }


                    @keyframes hiroba-rainbow-flow {
                        0% {
                            background-position: 0% 50%;
                        }

                        100% {
                            background-position: 300% 50%;
                        }
                    }


                    /* ==================================
                       おに譜面フルコン制覇：金色
                       ================================== */

                    .hiroba-gold {
                        color: #d49a00;
                    }

                </style>
            `);
        }


        // ========================================
        // tabListに追加
        // ========================================

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