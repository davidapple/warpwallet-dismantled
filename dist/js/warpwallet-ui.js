(function() {
  var Warper;

  Warper = (function() {
    function Warper() {
      this.check_compatibility();
      this.attach_ux();
      if (window.SALT_DEFAULT != null) {
        $('#salt').val(window.SALT_DEFAULT);
        $('#salt').attr('disabled', true);
        $('.salt-label').text('Prefilled salt');
      }
    }

    Warper.prototype.check_compatibility = function() {
      if (typeof Int32Array === "undefined" || Int32Array === null) {
        return $('.form-container').html('<p>\n  Sorry, but your browser is too old to run WarpWallet, which requires Int32Array support.\n</p>');
      }
    };

    Warper.prototype.attach_ux = function() {
      $('#btn-submit').on('click', (function(_this) {
        return function() {
          return _this.click_submit();
        };
      })(this));
      $('#btn-reset').on('click', (function(_this) {
        return function() {
          return _this.click_reset();
        };
      })(this));
      $('#salt').on('change', (function(_this) {
        return function() {
          return _this.salt_change();
        };
      })(this));
      $('#salt').on('keyup', (function(_this) {
        return function() {
          return _this.salt_change();
        };
      })(this));
      $('#checkbox-salt-confirm').on('click', (function(_this) {
        return function() {
          return _this.any_change();
        };
      })(this));
      $('#passphrase').on('change', (function(_this) {
        return function() {
          return _this.any_change();
        };
      })(this));
      $('#passphrase').on('keyup', (function(_this) {
        return function() {
          return _this.any_change();
        };
      })(this));
      $('#public-address').on('click', function() {
        return $(this).select();
      });
      $('#private-key').on('click', function() {
        return $(this).select();
      });
      return $('.what-salt').on('click', (function(_this) {
        return function() {
          return $('.salt-explanation').toggle();
        };
      })(this));
    };

    Warper.prototype.any_change = function() {
      var chk, err, pp, salt, warn;
      $('.progress-form').hide();
      $('#private-key').val('');
      $('#public-address').val('');
      $('#btn-submit').attr('disabled', false).show().html('Generate');
      pp = $('#passphrase').val();
      salt = $('#salt').val();
      chk = $('#checkbox-salt-confirm').is(":checked");
      err = null;
      warn = null;
      if (!pp.length) {
        err = "Please enter a passphrase";
      } else if ((salt != null ? salt.length : void 0) && !this.salt_ok()) {
        err = "Fix your salt";
      } else if ((salt != null ? salt.length : void 0) && (!chk) && (window.SALT_DEFAULT == null)) {
        err = "Confirm your salt";
      } else if (pp.length < 12) {
        warn = "Consider a larger passphrase";
      }
      if (err) {
        $('#btn-submit').attr('disabled', true).html(err);
      } else if (warn) {
        $('#btn-submit').attr('disabled', false).html(warn);
      } else {
        $('#btn-submit').attr('disabled', false).html("Generate");
      }
      $('.output-form').hide();
      $('#public-address-qr').html('');
      return $('#private-key-qr').html('');
    };

    Warper.prototype.commas = function(n) {
      while (/(\d+)(\d{3})/.test(n.toString())) {
        n = n.toString().replace(/(\d+)(\d{3})/, '$1,$2');
      }
      return n;
    };

    Warper.prototype.salt_ok = function() {
      var salt;
      salt = $('#salt').val();
      return (salt.match(/^[\S]+@[\S]+\.[\S]+$/)) || (window.SALT_DEFAULT != null);
    };

    Warper.prototype.salt_change = function() {
      var salt;
      salt = $('#salt').val();
      $('#checkbox-salt-confirm').attr('checked', false);
      if (!salt.length) {
        $('.salt-confirm').hide();
      }
      if (window.SALT_DEFAULT != null) {
        $('.salt-confirm').hide();
      } else if (this.salt_ok()) {
        $('.salt-confirm').show();
        $('.salt-summary').text(salt);
      } else {
        $('.salt-confirm').hide();
      }
      return this.any_change();
    };

    Warper.prototype.progress_hook = function(o) {
      var w;
      if (o.what === 'scrypt') {
        w = (o.i / o.total) * 50;
        $('.progress-form .bar').css('width', w + "%");
        return $('.progress-form .bar .progress-scrypt').html("scrypt " + (this.commas(o.i)) + " of " + (this.commas(o.total)));
      } else if (o.what === 'pbkdf2') {
        w = 50 + (o.i / o.total) * 50;
        $('.progress-form .bar').css('width', w + "%");
        return $('.progress-form .bar .progress-pbkdf2').html("&nbsp; pbkdf2 " + (this.commas(o.i)) + " of " + (this.commas(o.total)));
      }
    };

    Warper.prototype.click_reset = function() {
      $('#btn-submit').attr('disabled', false).show().html('Please enter a passphrase');
      $('#passphrase, #public-address, #private-key').val('');
      if (window.SALT_DEFAULT == null) {
        $('#salt').val('');
      }
      $('#checkbox-salt-confirm').attr('checked', false);
      $('.salt-summary').html('');
      $('.salt-confirm').hide();
      $('.progress-form').hide();
      $('.output-form').hide();
      $('#public-address-qr').html('');
      return $('#private-key-qr').html('');
    };

    Warper.prototype.write_qrs = function(pub, priv) {
      var params;
      params = {
        width: 256,
        height: 256,
        colorLight: "#f8f8f4",
        correctLevel: QRCode.CorrectLevel.H
      };
      (new QRCode("public-address-qr", params)).makeCode(pub);
      return (new QRCode("private-key-qr", params)).makeCode(priv);
    };

    Warper.prototype.click_submit = function() {
      $('#btn-submit').attr('disabled', true).html('Running...');
      $('#btn-reset').attr('disabled', true).html('Running...');
      $('#passphrase, #salt, checkbox-salt-confirm').attr('disabled', true);
      $('.progress-pbkdf2, .progress-scrypt').html('');
      $('.progress-form').show();
      return warpwallet.run({
        passphrase: $('#passphrase').val(),
        salt: $('#salt').val(),
        progress_hook: (function(_this) {
          return function(o) {
            return _this.progress_hook(o);
          };
        })(this),
        params: window.params
      }, (function(_this) {
        return function(res) {
          $('#passphrase, #checkbox-salt-confirm').attr('disabled', false);
          if (window.SALT_DEFAULT == null) {
            $('#salt').attr('disabled', false);
          }
          $('.progress-form').hide();
          $('.output-form').show();
          $('#btn-submit').hide();
          $('#btn-reset').attr('disabled', false).html('Clear &amp; reset');
          $('#public-address').val(res["public"]);
          $('#private-key').val(res["private"]);
          _this.write_qrs(res["public"], res["private"]);
          return console.log;
        };
      })(this));
    };

    return Warper;

  })();

  $(function() {
    return new Warper();
  });

}).call(this);
