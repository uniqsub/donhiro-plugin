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
        
        let remainingHtml = "<div style='color:#ffffff;margin:10px'>おに譜面制覇まであと" + (countGold + countSilver + countPlayed + countNone) + "譜面</div>";
        let remainingHtml_gold = "<div style='color:#ffffff;margin:10px'>おに譜面フルコン制覇まであと" + (countSilver + countPlayed + countNone) + "譜面</div>";
        
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