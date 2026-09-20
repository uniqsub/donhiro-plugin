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

        // ========================================
        // 王冠フィルターボタン
        // ========================================

        var buttonsHtml = "";

        buttonsHtml += `
            <button class="hiroba-crown-filter"
                    name="crown_filter"
                    data-crown="donderfull">
                <span>全良</span>
                <span class="hiroba-filter-count" data-count="donderfull"></span>
            </button>`;

        buttonsHtml += `
            <button class="hiroba-crown-filter"
                    name="crown_filter"
                    data-crown="gold">
                <span>フルコン</span>
                <span class="hiroba-filter-count" data-count="gold"></span>
            </button>`;

        buttonsHtml += `
            <button class="hiroba-crown-filter"
                    name="crown_filter"
                    data-crown="silver">
                <span>クリア</span>
                <span class="hiroba-filter-count" data-count="silver"></span>
            </button>`;

        buttonsHtml += `
            <button class="hiroba-crown-filter"
                    name="crown_filter"
                    data-crown="played">
                <span>ノルマ落ち</span>
                <span class="hiroba-filter-count" data-count="played"></span>
            </button>`;

        buttonsHtml += `
            <button class="hiroba-crown-filter"
                    name="crown_filter"
                    data-crown="none">
                <span>未プレイ</span>
                <span class="hiroba-filter-count" data-count="none"></span>
            </button>`;

        $('.tabList').append(buttonsHtml);


        // ========================================
        // ボタンのCSS
        // ========================================

        if (!document.getElementById('hiroba-filter-style')) {
            $('head').append(`
                <style id="hiroba-filter-style">

                  .hiroba-crown-filter {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;

    margin: 1px;
    padding: 3px 7px;

    min-height: 26px;

    background: #fff;
    border: 1px solid #ccc;
    border-radius: 13px;

    color: #555;
    font-size: 11px;
    font-weight: bold;
    line-height: 1.2;

    white-space: nowrap;

    box-shadow: 0 1px 2px rgba(0,0,0,.12);

    cursor: pointer;
}


/* 件数 */
.hiroba-filter-count {
    margin-left: 2px;

    color: #999;
    font-size: 9px;
    font-weight: normal;

    white-space: nowrap;
}


/* 各ボタン */
.hiroba-crown-filter[data-crown="donderfull"] {
    color: #555;
}

.hiroba-crown-filter[data-crown="gold"] {
    color: #c58b00;
}

.hiroba-crown-filter[data-crown="silver"] {
    color: #777;
}

.hiroba-crown-filter[data-crown="played"] {
    color: #888;
}

.hiroba-crown-filter[data-crown="none"] {
    color: #999;
}


/* 狭い画面 */
@media (max-width: 600px) {
    .hiroba-crown-filter {
        margin: 1px;
        padding: 3px 6px;
        min-height: 24px;
        font-size: 10px;
    }

    .hiroba-filter-count {
        margin-left: 2px;
        font-size: 8px;
    }
}

                </style>
            `);
        }

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

        // ========================================
        // 王冠フィルターの件数を表示
        // ========================================

        $('.hiroba-filter-count').each(function() {
            var crown = $(this).data('count');
            var count = 0;

            switch (crown) {
                case "donderfull":
                    count = countDonderFull;
                    break;

                case "gold":
                    count = countGold;
                    break;

                case "silver":
                    count = countSilver;
                    break;

                case "played":
                    count = countPlayed;
                    break;

                case "none":
                    count = countNone;
                    break;
            }

            $(this).text('(' + count + ')');
        });
        
        // ========================================
        // 制覇までの残り譜面数
        // ========================================

        // 全良制覇まであと
        var remainingDonderFull =
            countGold + countSilver + countPlayed + countNone;

        // フルコン制覇まであと
        var remainingFullCombo =
            countSilver + countPlayed + countNone;


        // ========================================
        // 表示
        // ========================================

        var remainingHtml = `
            <div class="hiroba-progress hiroba-progress-rainbow-box">
                <span class="hiroba-progress-label">
                    全良制覇まであと
                </span>
                <span class="hiroba-progress-count hiroba-rainbow">
                    ${remainingDonderFull}譜面
                </span>
            </div>
        `;

        var remainingHtml_gold = `
            <div class="hiroba-progress">
                <span class="hiroba-progress-label">
                    フルコン制覇まであと
                </span>
                <span class="hiroba-progress-count hiroba-gold">
                    ${remainingFullCombo}譜面
                </span>
            </div>
        `;


        // ========================================
        // CSS
        // ========================================

        if (!document.getElementById('hiroba-progress-style')) {
            $('head').append(`
                <style id="hiroba-progress-style">

                    .hiroba-progress {
    box-sizing: border-box;
    width: calc(100% - 50px);

    margin: 6px auto;
    padding: 7px 12px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;

    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;

    color: #333;
    font-size: 14px;
    font-weight: bold;
    line-height: 1.2;

    white-space: nowrap;

    box-shadow: 0 1px 3px rgba(0,0,0,.1);
}

.hiroba-progress-label {
    flex-shrink: 0;
}

.hiroba-progress-count {
    flex-shrink: 0;
    font-size: 17px;
    font-weight: bold;
}


                    /* ==================================
                       全良制覇：流れる虹色
                       ================================== */

                    .hiroba-rainbow {
                        background: linear-gradient(
                            90deg,
                            #ff3b30 0%,
                            #ff9500 14%,
                            #ffd60a 28%,
                            #34c759 42%,
                            #00a8ff 56%,
                            #5856d6 70%,
                            #af52de 84%,
                            #ff3b30 100%
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
                       フルコン制覇：金色
                       ================================== */

                    .hiroba-gold {
                        color: #d49a00;
                    }


                    /* ==================================
                       スマホなど画面が狭い場合
                       ================================== */

                    @media (max-width: 600px) {
                        .hiroba-progress {
                            width: calc(100% - 30px);
                            padding: 12px 10px;
                            gap: 8px;
                            font-size: 18px;
                        }

                        .hiroba-progress-count {
                            font-size: 22px;
                        }
                    }

                </style>
            `);
        }


        // ========================================
        // 表示
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