var app;

(function(){

  'use strict';

  app = {
    life: 1,
    coin: 0,
    init: function () {
      this.bindEvents();
      this.restart();
    },
    restart: function () {
      app.playerDead = false;
      this.render();
      this.addTurtle(1, 100, 1000);
      this.addTurtle(2, 100, 1300);
      this.wall(1, 500, 400);
      this.wall(2, 500, 600);
    },
    bindEvents: function () {
      document.addEventListener("keypress", keyDownTextField, false);
    },
    render: function () {
      var $el = $('.app');
      $el.html('');
      $el.append('<div class="player-life">Life: <span class="i">' + app.life + '</span></div>');
      $el.append('<div class="player-coin">Coin: <span class="i">' + app.coin + '</span></div>');
      $el.append('<div class="player"></div>');
      $el.append('<div class="ground"></div>');
      $el.append('<div class="exit"></div>');
      $el.append('<div class="money"></div>');
      $el.append('<div class="gameover"><p>GAME OVER<br><br>&nbsp;<a class="restart" href="javascript:location.reload()">RESTART</a>&nbsp;</p></div>');
    },
    wall: function (id, bottom, left) {
      var $el = $('.app');
      $el.append('<div class="wall wall' + id + '"></div>');
      $('.wall' + id).css('bottom', bottom + 'px')
        .css('left', left + 'px');
    },
    addTurtle: function (id, bottom, left) {
      var $el = $('.app');
      $el.append('<div class="turtle turtle' + id + '"></div>');
      $('.turtle' + id).css('bottom', bottom + 'px')
        .css('left', left + 'px');
      this.turtleMove(id);
    },
    turtleMove: function (id) {
      this['turtleInterval' + id] = setInterval(function () {
        var left = $('.player').css('left');
        var bottom = $('.player').css('bottom');
        var $turtle = $('.turtle' + id);
        var turtleleft = $turtle.css('left');

        $turtle.css('left', parseInt(turtleleft) - 10 + 'px');

        if (parseInt(turtleleft) < -100) {
          clearInterval(app['turtleInterval' + id]);
          $turtle.remove();
        }

        if (parseInt(turtleleft) < parseInt(left) + 100
          && parseInt(turtleleft) + 100 > parseInt(left)
          && parseInt(bottom) !== 100) {

          $turtle.fadeOut();

          setTimeout(function () {
            $turtle.remove();
          }, 300);
        } else if (parseInt(turtleleft) < parseInt(left) + 100
          && parseInt(turtleleft) + 100 > parseInt(left)
          && parseInt(bottom) === 100) {
          playerDied();
        }
      }, 300);
    },
    gameover: function () {
      $('.gameover').fadeIn(2000);
      setTimeout(function () {
        $('.restart').fadeIn(2000);
      }, 2000);
    }
  };

  function playerDied() {
    if (app.playerDead) {
      return;
    }

    app.playerDead = true;

    $('.player').fadeOut();

    setTimeout(function () {
      $('.player').remove();
    }, 1000);

    app.life = app.life - 1;
    $('.player-life .i').html(app.life);

    if (app.life === 0) {
      app.gameover();
    } else {
      setTimeout(function () {
        app.restart();
      }, 2000);
    }
  }

  function keyDownTextField(e) {
    if ($('.player').length === 0) {
      return;
    }

    var key = e.key;
    var left = $('.player').css('left');
    var bottom = $('.player').css('bottom');

    switch (key) {
    case 'd':
      if (parseInt(left) > 500) {
        moveAll();
      } else {
        $('.player').css('left', parseInt(left) + 10 + 'px');
      }
      break;
    case 'a':
      if (parseInt(left) > 0) {
        $('.player').css('left', parseInt(left) - 10 + 'px');
      }
      break;
    case ' ':
      if (app.jumped) {
        return;
      }
      app.jumped = true;
      $('.player').css('bottom', parseInt(bottom) + 300 + 'px');

      setTimeout(function(){
        app.jumped = false;
        $('.player').css('bottom', parseInt(bottom) + 'px');
      }, 1500);
      break;
    }

    exit();
    money();
  }

  function money() {
    if (app.moneyLocked) {
      return;
    }

    var left = $('.player').css('left');
    var bottom = $('.player').css('bottom');
    var moneyleft = parseInt($('.money').css('left'));

    if (moneyleft === parseInt(left)
      && parseInt(bottom) !== 100) {

      app.moneyLocked = true;

      $('.app').append('<div class="coin"></div>');
      $('.coin').css('bottom', '700px');
      $('.coin').css('left', moneyleft + 'px');
      setTimeout(function () {
        $('.coin').fadeOut();
        setTimeout(function () {
          $('.coin').remove();
          app.moneyLocked = false;
        }, 500);
      }, 1000);

      app.coin = app.coin + 1;
      if (app.coin % 3 === 0) {
        app.life = app.life + 1;
      }

      $('.player-coin .i').html(app.coin);
      $('.player-life .i').html(app.life);
    }
  }

  function exit() {
    var left = $('.player').css('left');
    var bottom = $('.player').css('bottom');
    var exitleft = $('.exit').css('left');

    if (parseInt(exitleft) <= parseInt(left)
      && parseInt(bottom) === 100) {

      $('.player').fadeOut();

      setTimeout(function () {
        $('.player').remove();
      }, 1000);
    }
  }

  function moveAll() {
    var groundleft = parseInt($('.ground').css('left'));
    var exitleft = parseInt($('.exit').css('left'));
    var moneyleft = parseInt($('.money').css('left'));

    $('.ground').css('left', groundleft - 10 + 'px');
    $('.exit').css('left', exitleft - 10 + 'px');
    $('.money').css('left', moneyleft - 10 + 'px');

    $('.coin').css('left', parseInt($('.coin').css('left')) - 10 + 'px');
    $('.wall1').css('left', parseInt($('.wall1').css('left')) - 10 + 'px');
    $('.wall2').css('left', parseInt($('.wall2').css('left')) - 10 + 'px');
    $('.turtle1').css('left', parseInt($('.turtle1').css('left')) - 10 + 'px');
    $('.turtle2').css('left', parseInt($('.turtle2').css('left')) - 10 + 'px');

    if (moneyleft < -100) {
      $('.money').remove();
    }

    if (parseInt($('.wall1').css('left')) < -100) {
      $('.wall1').remove();
    }

    if (parseInt($('.wall2').css('left')) < -100) {
      $('.wall2').remove();
    }
  }

  app.init();
})();
