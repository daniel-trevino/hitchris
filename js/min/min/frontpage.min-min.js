$(document).ready(function(){var o=$(window),i=$(".navigation");$(".navigation .burger").on("click",function(){i.addClass("visible")}),$("a[href^='#']").on("click",function(o){o.preventDefault();var i=this.hash,a=$(i);a&&a.length>0&&$("html, body").stop().animate({scrollTop:a.offset().top},500,"swing",function(){window.location.hash=i})});var a=$(".map .locator .morph-content");o.resize(function(){var i=o.width(),n=o.height();a.css({top:n/2-5+"px",right:i/2-5+"px"})});var n=$("#main .map");o.on("scroll resize",function(){o.scrollTop()>=o.height()?(i.addClass("visible"),n.addClass("fixed")):(i.removeClass("visible"),n.removeClass("fixed")),o.scrollTop()>=6*o.height()?i.addClass("end"):i.removeClass("end")});var s=$(window).scrollTop();0!==s&&$(".nicer-splash").hide()});