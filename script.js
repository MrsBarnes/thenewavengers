document.addEventListener("DOMContentLoaded", function () {
  // --------------------------------
  // 모바일 화면 높이 조정 (주소창 문제 해결)
  // --------------------------------
  function setVh() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  setVh();
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setVh, 200);
  });

  // --------------------------------
  // 첫 번째 페이지 문구 효과 (타이핑 페이드인)
  // --------------------------------
  const text = document.querySelector(".fade-text");
  if (text) {
    const content = text.textContent;
    text.textContent = "";

    content.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.innerHTML = char === " " ? "&nbsp;" : char;
      span.style.animationDelay = `${i * 0.05}s`;
      text.appendChild(span);
    });
  }

 // -----------------------------
// 두 번째, 여섯 번째 페이지: .introtxt + .conttxt 순차 페이드인
// -----------------------------
const $introTexts = $('.introtxt');
const $contTexts  = $('.conttxt');
const $allTexts   = $introTexts.add($contTexts);

function fadeInOnScroll($elements) {
  $(window).on('scroll load', function(){
    $elements.each(function(index){
      const $el = $(this);
      if($el.hasClass('show')) return;

      const elTop = $el.offset().top;
      const winBottom = $(window).scrollTop() + $(window).height() * 0.8;

      if(winBottom > elTop){
        setTimeout(function(){
          $el.addClass('show');
        }, index * 500);
      }
    });
  });

  // ✅ 페이지 로드 직후 즉시 한 번 실행
  $(window).trigger('scroll');
}

fadeInOnScroll($allTexts);

//세번째 페이지 캐릭터 설명
$(function(){
  $('.shadowbox').hover(
    function() {
      let imgId = $(this).attr('id');        
      let nameId = imgId.replace('img','name');

      // 모든 namebox 숨기기
      $('.yellowbox .namebox').removeClass('show');

      // 해당 namebox만 보이게
      $('#' + nameId).addClass('show');

      // shadowbox만 투명하게
      $(this).css('opacity', 0);
    },
    function() {
      // 마우스 아웃 시 shadowbox 원래대로
      $(this).css('opacity', 0.6);

      // 모든 namebox 숨김
      $('.yellowbox .namebox').removeClass('show');
    }
  );
});


//네번째 페이지 슬라이더
$(function(){
  const $slider = $('.news-slider');
  const $track = $slider.find('.slider-track');
  const $slides = $track.find('.slide');
  const slideCount = $slides.length;
  let currentIndex = 0;
  let startX = 0, currentTranslate = 0, prevTranslate = 0, isDragging = false;

  // 반응형 슬라이드 폭 조정
  function updateSlideWidth() {
    const sliderWidth = $slider.width();

    $slides.each(function() {
      if (sliderWidth <= 767) {
        // ✅ 모바일: 90% 폭, 중앙 정렬
        $(this).css({
          width: sliderWidth * 0.9,
          marginLeft: sliderWidth * 0.05,
          marginRight: sliderWidth * 0.05
        });
      } else {
        // ✅ 데스크탑: 70% 폭, 여유 공간 중앙 배치
        $(this).css({
          width: sliderWidth * 0.7,
          marginLeft: sliderWidth * 0.15,
          marginRight: sliderWidth * 0.15
        });
      }
    });
  }

  updateSlideWidth();
  $(window).on('resize', updateSlideWidth);

  function getSlideWidth() {
    return $slides.outerWidth(true);
  }

  function goToSlide(index) {
    if (index < 0) index = slideCount - 1;
    if (index >= slideCount) index = 0;
    currentIndex = index;
    const moveX = -currentIndex * getSlideWidth();
    $track.css('transform', `translateX(${moveX}px)`);
  }

  // 버튼 클릭
  $slider.find('.prev').on('click', function(){ goToSlide(currentIndex - 1); });
  $slider.find('.next').on('click', function(){ goToSlide(currentIndex + 1); });

  // 터치 이벤트
  $track.on('touchstart', function(e){
    isDragging = true;
    startX = e.originalEvent.touches[0].clientX;
    prevTranslate = -currentIndex * getSlideWidth();
  });

  $track.on('touchmove', function(e){
    if (!isDragging) return;
    const x = e.originalEvent.touches[0].clientX;
    const delta = x - startX;
    currentTranslate = prevTranslate + delta;
    $track.css('transform', `translateX(${currentTranslate}px)`);
  });

  $track.on('touchend', function(){
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -50) goToSlide(currentIndex + 1);
    else if (movedBy > 50) goToSlide(currentIndex - 1);
    else goToSlide(currentIndex);
  });

  goToSlide(0);
});



  // --------------------------------
  // jQuery: 팝업 관련 로직
  // --------------------------------
  // DOM이 이미 로드된 상태이므로 바로 실행 가능
  // (굳이 $(function(){ ... })로 중첩할 필요 없음)
  if (window.jQuery) {
    // 쿠키 함수
    $.setCookie = function (name, value, days) {
      var date = new Date();
      date.setDate(date.getDate() + days);
      document.cookie =
        name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
    };

    $.getCookie = function (name) {
      var result = null;
      $.each(document.cookie.split("; "), function (i, cookie) {
        var parts = cookie.split("=");
        if (parts[0] === name) {
          result = parts[1];
          return false;
        }
      });
      return result;
    };

    // 순차 팝업 로직
    var popups = ["#popup1", "#popup2", "#popup3"];
    var current = 0;

    function showNextPopup() {
      while (current < popups.length) {
        var id = popups[current].replace("#", "");
        if (!$.getCookie(id + "_closed")) {
          $(popups[current]).fadeIn(300);
          break;
        }
        current++;
      }
    }

    $(".close-btn").on("click", function () {
      var $popup = $(this).closest(".popup-overlay");
      var id = $popup.attr("id");

      if ($popup.find(".today-close").is(":checked")) {
        $.setCookie(id + "_closed", "true", 1);
      }

      $popup.fadeOut(300, function () {
        current++;
        showNextPopup();
      });
    });

    // 첫 번째 팝업 실행
    showNextPopup();
  } else {
    console.warn("⚠️ jQuery가 로드되지 않았습니다.");
  }
});