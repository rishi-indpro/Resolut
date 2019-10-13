$(window).ready(function () {
  TableHeader();
  $('.emailMobileInput').focus(function () {
    $('.emailMobLabel').addClass('emailMobLabelMove');
  });

  $('.emailMobileInput').blur(function () {
    var splVal = $(this).val();
    if (splVal.length < 1) {
      $('.emailMobLabel').removeClass('emailMobLabelMove');
    }
  });

  $('.passwordInput').focus(function () {
    $('.passwLabel').addClass('emailMobLabelMove');
  });

  $('.passwordInput').blur(function () {
    var splVal = $(this).val();
    if (splVal.length < 1) {
      $('.passwLabel').removeClass('emailMobLabelMove');
    }
  });

  $('.gridTablerow tr:odd').css({ 'background': '#ffffff' });
  $('.cart-table tr:odd').css({ 'background': '#ffffff' });
  $('.tabPurple tr:odd').css({ 'background': 'rgb(233, 233, 233)' });
  $('.ship-table tr:odd').css({ 'background': 'rgb(233, 233, 233)' });

  $('.showAlterAdd').on('click', function () {
    $('.shippingAddress').toggle();
    $('.ipadHidePcShow').toggleClass('dpNone');
    $('.ipadShowPcHide').toggleClass('dpblk');
  });

  $('nav ul li').on('click', function (e) {
    $('nav ul li').removeClass('active');
    $(this).addClass('active').siblings().find('ul').removeClass('dpblk');
    $(this).find('ul').toggleClass('dpblk');
    e.stopPropagation();
  });



  //$('body > .mainH').on('click', function () {
  //  var MenuFun = $('nav ul li').find('ul').hasClass('dpblk');
  //  if (MenuFun === true) {
  //    //console.log("MenuFun1", MenuFun);
  //    $('nav ul li').find('ul').removeClass('dpblk');
  //  }
  //});



  $('body').on('click', function (event) {
    var li = $('.filterH').children();
    var filFun = $('.filterH li').find('ul').hasClass('dpblk');
   
    $.each(li, function (index, value) {
    
      if (value === event.target)
      {
        filFun = false;
        return false;
      }
      if (($(value).children())[0] === event.target)
      {
        filFun = false;
        return false;
      }
    });


    if (filFun === true) {
      $('.filterH li').find('ul').removeClass('dpblk');
      $('.filterH li').find('a').removeClass('dpblk');
      $('.filterH li').removeClass('active');
    }
  });



  $('.mobileMenu a').on('click', function (e) {
    $('.headerSecondPart').toggleClass('dpblk');
    $('.headerMiddlePart').toggleClass('dpblk');
    $('.personalH').toggleClass('dpblk');
    $('nav').toggleClass('dpblk');
    $('.mobileCart').toggleClass('dpNone');

    /* $('.stickyMenu').next().css({'margin-top': stickyHgt + 10}); */

    e.preventDefault();
  });

  $('.cartMsg').hide();
  var counter = 0;
  $('.pmTopBtn .fa-plus-square').on('click', function (e) {
    var bubbleVal = $('.bubbleH').text();
    $('.bubbleH').text(++counter);
    e.stopPropagation();
    e.preventDefault();
  });

  $('.pmBottomBtn .fa-minus-square').on('click', function (e) {
    var bubbleVal = $('.bubbleH').text();
    if (counter !== 0) {
      $('.bubbleH').text(--counter);
    }

    e.stopPropagation();
    e.preventDefault();
  });

  /*
  $('.cartMsg').hide();
  $('.qtyBtn, .addCartBtn, .closeRight').on('click', function(e){
      var bubbleVal = $('.bubbleH').text();
      bubbleVal = parseInt(bubbleVal) + 1;
      $('.bubbleH').text(bubbleVal);
      $(this).parent().find('.cartMsg').fadeIn();
      setTimeout(function(){
          $('.cartMsg').fadeOut();
      }, 1700);
      e.stopPropagation();
      e.preventDefault();
  });
  */

  $(".returnSelect").change(function () {
    var val = $(this).val();
    if (val === "item1") {
      $(".returnSubSelect").html("<option value='test'>HELT UTEBLIVEN LEVERANS</option><option value='test2'>KOLLI SAKNAS</option><option value='test2'>SAKNAS/FEL ANTAL I FÖRPACKNINGEN</option><option value='test2'>LEVERANS ANKOM FÖR SENT</option>");
    } else if (val === "item2") {
      $(".returnSubSelect").html("<option value='test'>FEL ARTIKEL LEVERERAD JÄMFÖRT MED FÖLJESEDELN</option><option value='test2'>FELBESTÄLLD ARTIKEL ELLER STORLEK</option>");
    } else if (val === "item3") {
      $(".returnSubSelect").html("<option value='test'>TRANSPORTSKADAT - KLÄMT ELLER KROSSAT</option><option value='test2'>TRANSPORTSKADAT - FUKT</option><option value='test2'>TRANSPORTSKADAT - SMUTSIGT</option>");
    } else if (val === "item0") {
      $(".returnSubSelect").html("<option value=''>DEFEKT ARTIKEL - MÅTT STÄMMER EJ MED SPECIFIKATION</option><option value=''>DEFEKT ARTIKEL - FÄRGFEL</option><option value=''>DEFEKT ARTIKEL - MATERIALFEL</option><option value=''>DEFEKT ARTIKEL - SMUTSIGT</option><option value=''>DEFEKT ARTIKEL - FEL I SAMMANSÄTTNING / MONTERING</option>");
    }
  });

  $('.arrowMenu a').on('click', function (e) {
    $("html").animate({ scrollTop: 0 }, 900);
    e.preventDefault();
  });

  $('.arrowMenu').hide();


  setTimeout(AlignFixedHeight(), 100);

});

$(window).scroll(function () {
  if ($(this).scrollTop() > 120) {
    $('.arrowMenu').show();
  } else {
    $('.arrowMenu').hide();
  }
});



$(window).bind("load", function () {
  $('.detailsH .notAvail').each(function () {
    var countNotAvail = $(this).text().length;
    var detailsWidth = $('.detailsH').width();
    if (countNotAvail > 30) {
      $(this).css({ 'text-overflow': 'ellipsis', 'overflow': 'hidden', 'white-space': 'nowrap', 'width': detailsWidth / 1.3 });
    }
  });

  $('.lastShowBtn').on('click', function (e) {
    $('.lastRow').css({ 'display': 'block' });
    e.preventDefault();
  });

  var totalWidth = $(window).width();
  var minSliderSpl;
  if (totalWidth < 430) {
    minSliderSpl = 1;
    console.log("360", minSliderSpl);
  } else if (totalWidth < 600) {
    minSliderSpl = 4;
  } else {
    minSliderSpl = 6;
  }

  var obxSettings = {
    auto: false,
    minSlides: minSliderSpl,
    maxSlides: minSliderSpl + 2,
    shrinkItems: true,
    pager: false,
    slideMargin: 5,
    slideWidth: 960
  };

  //var stickyHgt = 0;
  //var headerHeight = 0;
  //if ($(window).width() > 1210) {
  //  stickyHgt = $('.stickyMenu').height();
  //}
  //headerHeight = $('.stickyMenu').parent().height();
  //var height = stickyHgt + headerHeight + 63;
  //$('.mainContainerForArticles').css({ 'margin-top': height });
  //checkoutHeight = $('.contentstickyMenu').height();
  //$('.contentstickyMenu').next().css({ 'margin-top': stickyHgt + checkoutHeight + 10 });

  console.log("GGGG");
  var listWid = $('.listHeader').parent().width();
  $('.listHeader').width(listWid);

  AlignFixedHeight();
});

$(window).on("resize", function () {
  $('.detailsH .notAvail').each(function () {
    var countNotAvail = $(this).text().length;
    var detailsWidth = $('.detailsH').width();
    if (countNotAvail > 30) {
      $(this).css({ 'text-overflow': 'ellipsis', 'overflow': 'hidden', 'white-space': 'nowrap', 'width': detailsWidth / 1.3 });
    }
  });

  $('.lastShowBtn').on('click', function (e) {
    $('.lastRow').css({ 'display': 'block' });
    e.preventDefault();
  });

  var totalWidth = $(window).width();
  var minSliderSpl;
  if (totalWidth < 430) {
    minSliderSpl = 1;
    console.log("360", minSliderSpl);
  } else if (totalWidth < 600) {
    minSliderSpl = 4;
  } else {
    minSliderSpl = 6;
  }

  var obxSettings = {
    auto: false,
    minSlides: minSliderSpl,
    maxSlides: minSliderSpl + 2,
    shrinkItems: true,
    pager: false,
    slideMargin: 5,
    slideWidth: 960
  };

  //var stickyHgt = 0;
  //var headerHeight = 0;
  //if ($(window).width() > 1210) {
  //  stickyHgt = $('.stickyMenu').height();
  //}
  //headerHeight = $('.stickyMenu').parent().height();
  //var height = stickyHgt + headerHeight + 63;
  //$('.stickyMenu').next().css({ 'margin-top': height });
  //checkoutHeight = $('.contentstickyMenu').height();
  //$('.contentstickyMenu').next().css({ 'margin-top': stickyHgt + checkoutHeight + 10 });

  var listWid = $('.listHeader').parent().width();
  $('.listHeader').width(listWid);

  AlignFixedHeight();
});

function InitializeControls() {
  $('nav ul li').on('click', function (e) {
    $('nav ul li').removeClass('active');
    $(this).addClass('active').siblings().find('ul').removeClass('dpblk');
    $(this).find('ul').toggleClass('dpblk');
    e.stopPropagation();
  });
  
}
function TableHeader() {
  var stickyHgt = 0;
  var headerHeight = 0;
  if ($(window).width() > 1210) {
    stickyHgt = $('.stickyMenu').height();
  }
  headerHeight = $('.stickyMenu').parent().height();
  var height = stickyHgt + headerHeight + 63;
  $('.stickyMenu').next().css({ 'margin-top': height });
  checkoutHeight = $('.contentstickyMenu').height();
  $('.contentstickyMenu').next().css({ 'margin-top': stickyHgt + checkoutHeight + 10 });
  var listWid = $('.listHeader').parent().width();
  $('.listHeader').width(listWid);


  $('.rowGrid').on('click', function (e) {
    $(this).parents(".row").find('.col-md-offset-1').removeClass("col-md-offset-1");
    $(this).parents(".row").find('.col-md-5:nth-child(2)').removeClass('col-md-5').addClass("col-md-7");
    $('.gridTablerow').show();
    $('.colBoxView').hide();
    e.preventDefault();
  });

  $('.colGrid').on('click', function (e) {
    $(this).parents(".row").find('.col-md-5:first-child').addClass("col-md-offset-1");
    $(this).parents(".row").find('.col-md-7:nth-child(2)').removeClass('col-md-7').addClass("col-md-5");
    $('.colBoxView').show();
    $('.gridTablerow').hide();
    AlignFixedHeight();
    e.preventDefault();
  });

  $('.sortByH .colGrid').on('click', function () {
    $(this).addClass('act');
    $('.sortByH .rowGrid').removeClass('act');
    $('.qualityHead').show();
  });

  $('.sortByH .rowGrid').on('click', function () {
    $(this).addClass('act');
    $('.sortByH .colGrid').removeClass('act');
    $('.qualityHead').hide();
  });

  //$('.marquee').marquee();{
  //  //speed in milliseconds of the marquee
  //  duration: 15000,
  //  //gap in pixels between the tickers
  //  gap: 50,
  //  //time in milliseconds before the marquee will start animating
  //  delayBeforeStart: 0,
  //  //'left' or 'right'
  //  direction: 'left',
  //  //true or false - should the marquee be duplicated to show an effect of continues flow
  //  duplicated: true
  //});
  //var qualCount = 1;
  //$('.qualityH .pmTopBtn .fa-plus-square').on('click', function (e) {
  //  var inputQuality = $(this).parents('.qualityH').find('.qualityCount');
  //  var inputVal = inputQuality.val();
  //  var result = parseInt(inputVal) + qualCount;
  //  inputQuality.val(result);
  //  inputQuality.addClass('plusActive');
  //  $('.pmBottomBtn .fa-minus-square').removeClass('minusdeActive');

  //  setTimeout(function () {
  //    $('.cartH').css({ 'padding-right': '3px', 'padding-left': '10px' });
  //    $('.cartH a i').removeClass('fa-shopping-cart').addClass('fa-spinner fa-spin');
  //    $('.mobileCart a i').removeClass('fa-shopping-cart').addClass('fa-spinner fa-spin');
  //  }, 300);

  //  setTimeout(function () {
  //    $('.cartH').css({ 'padding-right': '5px', 'padding-left': '12px' });
  //    $('.cartH a i').removeClass('fa-spinner fa-spin').addClass('fa-shopping-cart');
  //    $('.mobileCart a i').removeClass('fa-spinner fa-spin').addClass('fa-shopping-cart');
  //  }, 450);
  //  e.preventDefault();
  //});

  //$('.qualityH .pmBottomBtn .fa-minus-square').on('click', function (e) {
  //  var stopAtZero = $(this).parents('.qualityH').find('.qualityCount');
  //  var minusResult = stopAtZero.val();
  //  if (minusResult == 0) {
  //    $(this).addClass('minusdeActive');
  //    stopAtZero.removeClass('plusActive');
  //  } else {
  //    stopAtZero.val(minusResult -= 1);
  //    setTimeout(function () {
  //      $('.cartH').css({ 'padding-right': '3px', 'padding-left': '10px' });
  //      $('.cartH a i').removeClass('fa-shopping-cart').addClass('fa-spinner fa-spin');
  //      $('.mobileCart a i').removeClass('fa-shopping-cart').addClass('fa-spinner fa-spin');
  //    }, 300);

  //    setTimeout(function () {
  //      $('.cartH').css({ 'padding-right': '5px', 'padding-left': '12px' });
  //      $('.cartH a i').removeClass('fa-spinner fa-spin').addClass('fa-shopping-cart');
  //      $('.mobileCart a i').removeClass('fa-spinner fa-spin').addClass('fa-shopping-cart');
  //    }, 450);

  //  }
  //  e.preventDefault();
  //});

  //$('.cartTdStyle .pmTopBtn .fa-plus-square').on('click', function (e) {
  //  var inputQuality = $(this).parents('.cartTdStyle').find('.quanInput');
  //  var inputVal = inputQuality.val();
  //  var result = parseInt(inputVal) + (qualCount);
  //  inputQuality.val(result);
  //  inputQuality.addClass('plusActive');
  //  $('.pmBottomBtn .fa-minus-square').removeClass('minusdeActive');

  //  setTimeout(function () {
  //    $('.cartH').css({ 'padding-right': '3px', 'padding-left': '10px' });
  //    $('.cartH a i').removeClass('fa-shopping-cart').addClass('fa-spinner fa-spin');
  //    $('.mobileCart a i').removeClass('fa-shopping-cart').addClass('fa-spinner fa-spin');
  //  }, 300);

  //  setTimeout(function () {
  //    $('.cartH').css({ 'padding-right': '5px', 'padding-left': '12px' });
  //    $('.cartH a i').removeClass('fa-spinner fa-spin').addClass('fa-shopping-cart');
  //    $('.mobileCart a i').removeClass('fa-spinner fa-spin').addClass('fa-shopping-cart');
  //  }, 450);
  //  e.preventDefault();
  //});

  //$('.cartTdStyle .pmBottomBtn .fa-minus-square').on('click', function (e) {
  //  var stopAtZero = $(this).parents('.cartTdStyle').find('.quanInput');
  //  var minusResult = stopAtZero.val();
  //  if (minusResult === 0) {
  //    $(this).addClass('minusdeActive');
  //    stopAtZero.removeClass('plusActive');
  //  } else {
  //    stopAtZero.val(minusResult -= 1);
  //    setTimeout(function () {
  //      $('.cartH').css({ 'padding-right': '3px', 'padding-left': '10px' });
  //      $('.cartH a i').removeClass('fa-shopping-cart').addClass('fa-spinner fa-spin');
  //      $('.mobileCart a i').removeClass('fa-shopping-cart').addClass('fa-spinner fa-spin');
  //    }, 300);

  //    setTimeout(function () {
  //      $('.cartH').css({ 'padding-right': '5px', 'padding-left': '12px' });
  //      $('.cartH a i').removeClass('fa-spinner fa-spin').addClass('fa-shopping-cart');
  //      $('.mobileCart a i').removeClass('fa-spinner fa-spin').addClass('fa-shopping-cart');
  //    }, 450);

  //  }
  //  e.preventDefault();
  //});

  $('.quanInput').focus(function () {
    $(this).addClass('plusActive');
  });

  $('.qualityCount').focus(function () {
    $(this).addClass('plusActive');
  });

  $('.qualityCount').blur(function () {
    setTimeout(function () {
      $('.cartH').css({ 'padding-right': '3px', 'padding-left': '10px' });
      $('.cartH a i').removeClass('fa-shopping-cart').addClass('fa-spinner fa-spin');
      $('.mobileCart a i').removeClass('fa-shopping-cart').addClass('fa-spinner fa-spin');
    }, 300);
    setTimeout(function () {
      $('.cartH').css({ 'padding-right': '5px', 'padding-left': '12px' });
      $('.cartH a i').removeClass('fa-spinner fa-spin').addClass('fa-shopping-cart');
      $('.mobileCart a i').removeClass('fa-spinner fa-spin').addClass('fa-shopping-cart');
    }, 450);
  });

  $('.quanInput').blur(function () {
    setTimeout(function () {
      $('.cartH').css({ 'padding-right': '3px', 'padding-left': '10px' });
      $('.cartH a i').removeClass('fa-shopping-cart').addClass('fa-spinner fa-spin');
      $('.mobileCart a i').removeClass('fa-shopping-cart').addClass('fa-spinner fa-spin');
    }, 300);
    setTimeout(function () {
      $('.cartH').css({ 'padding-right': '5px', 'padding-left': '12px' });
      $('.cartH a i').removeClass('fa-spinner fa-spin').addClass('fa-shopping-cart');
      $('.mobileCart a i').removeClass('fa-spinner fa-spin').addClass('fa-shopping-cart');
    }, 450);
  });

  $('.filterH > li').on('click', function (e) {
    $('.filterH li').removeClass('active');
    $(this).addClass('active').siblings().find('ul').removeClass('dpblk');
    $(e.target).find('ul').toggleClass('dpblk');
    e.stopPropagation();
  });

  $('.marquee').marquee({
    //speed in milliseconds of the marquee
    duration: 15000,
    //gap in pixels between the tickers
    gap: 50,
    //time in milliseconds before the marquee will start animating
    delayBeforeStart: 0,
    //'left' or 'right'
    direction: 'left',
    //true or false - should the marquee be duplicated to show an effect of continues flow
    duplicated: true
  });
}

function HeaderPositionChange() {
  $("#dvHeader").addClass('headerPosition');
}

function AlignFixedHeight() {
  var longHgt = new Array();
  $('.featuredBox .roundImg').each(function () {
    longHgt.push($(this).outerHeight());
  });
  var max = 0;
  max = Math.max.apply(Math, longHgt);
  $('.featuredBox').css({ 'min-height': max + 10 });

  var maxHeight = new Array();
  $('.featuredBox .articleName').each(function () {
    maxHeight.push($(this).outerHeight());
  });
  max = 0;
  max = Math.max.apply(Math, maxHeight);
  $('.featuredBox .articleName').css({ 'min-height': max });
}

function setArticlesTableViewContent() {
  console.log("setArticlesTableViewContent")
  var listWid = $('.listHeader').parent().width();
  $('.listHeader').width(listWid);
}




