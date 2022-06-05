'use strict';
!function(selector, $, undefined) {
  !function() {
    var testbed;
    var $datepickersContainer;
    var datepicker;
    /** @type {string} */
    var version = "2.2.3";
    /** @type {string} */
    var pluginName = "datepicker";
    /** @type {string} */
    var selector = ".datepicker-here";
    /** @type {boolean} */
    var time = false;
    /** @type {string} */
    var timezonesHTML = '<div class="datepicker"><i class="datepicker--pointer"></i><nav class="datepicker--nav"></nav><div class="datepicker--content"></div></div>';
    var defaults = {
      classes : "",
      inline : false,
      language : "ru",
      startDate : new Date,
      firstDay : "",
      weekends : [6, 0],
      dateFormat : "",
      altField : "",
      altFieldDateFormat : "@",
      toggleSelected : true,
      keyboardNav : true,
      position : "bottom left",
      offset : 12,
      view : "days",
      minView : "days",
      showOtherMonths : true,
      selectOtherMonths : true,
      moveToOtherMonthsOnSelect : true,
      showOtherYears : true,
      selectOtherYears : true,
      moveToOtherYearsOnSelect : true,
      minDate : "",
      maxDate : "",
      disableNavWhenOutOfRange : true,
      multipleDates : false,
      multipleDatesSeparator : ",",
      range : false,
      todayButton : false,
      clearButton : false,
      showEvent : "focus",
      autoClose : false,
      monthsField : "monthsShort",
      prevHtml : '<svg><path d="M16.1755 8.01562V9.98438H3.98801L9.56613 15.6094L8.15988 17.0156L0.144258 9L8.15988 0.984375L9.56613 2.39062L3.98801 8.01562H16.1755Z" /></svg>',
      nextHtml : '<svg><path d="M8.36301 0.984375L16.3786 9L8.36301 17.0156L6.95676 15.6094L12.5349 9.98438H0.347383V8.01562H12.5349L6.95676 2.39062L8.36301 0.984375Z" /></svg>',
      navTitles : {
        days : "MM, <i>yyyy</i>",
        months : "yyyy",
        years : "yyyy1 - yyyy2"
      },
      timepicker : false,
      onlyTimepicker : false,
      dateTimeSeparator : " ",
      timeFormat : "",
      minHours : 0,
      maxHours : 24,
      minMinutes : 0,
      maxMinutes : 59,
      hoursStep : 1,
      minutesStep : 1,
      onSelect : "",
      onShow : "",
      onHide : "",
      onChangeMonth : "",
      onChangeYear : "",
      onChangeDecade : "",
      onChangeView : "",
      onRenderCell : ""
    };
    var hotKeys = {
      ctrlRight : [17, 39],
      ctrlUp : [17, 38],
      ctrlLeft : [17, 37],
      ctrlDown : [17, 40],
      shiftRight : [16, 39],
      shiftUp : [16, 38],
      shiftLeft : [16, 37],
      shiftDown : [16, 40],
      altUp : [18, 38],
      altRight : [18, 39],
      altLeft : [18, 37],
      altDown : [18, 40],
      ctrlShiftUp : [16, 17, 38]
    };
    /**
     * @param {!Element} element
     * @param {?} options
     * @return {undefined}
     */
    var Datepicker = function(element, options) {
      /** @type {!Element} */
      this.el = element;
      this.$el = $(element);
      this.opts = $.extend(true, {}, defaults, options, this.$el.data());
      if (testbed == undefined) {
        testbed = $("body");
      }
      if (!this.opts.startDate) {
        /** @type {!Date} */
        this.opts.startDate = new Date;
      }
      if ("INPUT" == this.el.nodeName) {
        /** @type {boolean} */
        this.elIsInput = true;
      }
      if (this.opts.altField) {
        this.$altField = "string" == typeof this.opts.altField ? $(this.opts.altField) : this.opts.altField;
      }
      /** @type {boolean} */
      this.inited = false;
      /** @type {boolean} */
      this.visible = false;
      /** @type {boolean} */
      this.silent = false;
      this.currentDate = this.opts.startDate;
      this.currentView = this.opts.view;
      this._createShortCuts();
      /** @type {!Array} */
      this.selectedDates = [];
      this.views = {};
      /** @type {!Array} */
      this.keys = [];
      /** @type {string} */
      this.minRange = "";
      /** @type {string} */
      this.maxRange = "";
      /** @type {string} */
      this._prevOnSelectValue = "";
      this.init();
    };
    /** @type {function(!Element, ?): undefined} */
    datepicker = Datepicker;
    datepicker.prototype = {
      VERSION : version,
      viewIndexes : ["days", "months", "years"],
      init : function() {
        if (!(time || this.opts.inline || !this.elIsInput)) {
          this._buildDatepickersContainer();
        }
        this._buildBaseHtml();
        this._defineLocale(this.opts.language);
        this._syncWithMinMaxDates();
        if (this.elIsInput) {
          if (!this.opts.inline) {
            this._setPositionClasses(this.opts.position);
            this._bindEvents();
          }
          if (this.opts.keyboardNav && !this.opts.onlyTimepicker) {
            this._bindKeyboardEvents();
          }
          this.$datepicker.on("mousedown", this._onMouseDownDatepicker.bind(this));
          this.$datepicker.on("mouseup", this._onMouseUpDatepicker.bind(this));
        }
        if (this.opts.classes) {
          this.$datepicker.addClass(this.opts.classes);
        }
        if (this.opts.timepicker) {
          this.timepicker = new $.fn.datepicker.Timepicker(this, this.opts);
          this._bindTimepickerEvents();
        }
        if (this.opts.onlyTimepicker) {
          this.$datepicker.addClass("-only-timepicker-");
        }
        this.views[this.currentView] = new $.fn.datepicker.Body(this, this.currentView, this.opts);
        this.views[this.currentView].show();
        this.nav = new $.fn.datepicker.Navigation(this, this.opts);
        this.view = this.currentView;
        this.$el.on("clickCell.adp", this._onClickCell.bind(this));
        this.$datepicker.on("mouseenter", ".datepicker--cell", this._onMouseEnterCell.bind(this));
        this.$datepicker.on("mouseleave", ".datepicker--cell", this._onMouseLeaveCell.bind(this));
        /** @type {boolean} */
        this.inited = true;
      },
      _createShortCuts : function() {
        this.minDate = this.opts.minDate ? this.opts.minDate : new Date(-86399999136e5);
        this.maxDate = this.opts.maxDate ? this.opts.maxDate : new Date(86399999136e5);
      },
      _bindEvents : function() {
        this.$el.on(this.opts.showEvent + ".adp", this._onShowEvent.bind(this));
        this.$el.on("mouseup.adp", this._onMouseUpEl.bind(this));
        this.$el.on("blur.adp", this._onBlur.bind(this));
        this.$el.on("keyup.adp", this._onKeyUpGeneral.bind(this));
        $(selector).on("resize.adp", this._onResize.bind(this));
        $("body").on("mouseup.adp", this._onMouseUpBody.bind(this));
      },
      _bindKeyboardEvents : function() {
        this.$el.on("keydown.adp", this._onKeyDown.bind(this));
        this.$el.on("keyup.adp", this._onKeyUp.bind(this));
        this.$el.on("hotKey.adp", this._onHotKey.bind(this));
      },
      _bindTimepickerEvents : function() {
        this.$el.on("timeChange.adp", this._onTimeChange.bind(this));
      },
      isWeekend : function(date) {
        return -1 !== this.opts.weekends.indexOf(date);
      },
      _defineLocale : function(lang) {
        if ("string" == typeof lang) {
          this.loc = $.fn.datepicker.language[lang];
          if (!this.loc) {
            console.warn("Can't find language \"" + lang + '" in Datepicker.language, will use "ru" instead');
            this.loc = $.extend(true, {}, $.fn.datepicker.language.ru);
          }
          this.loc = $.extend(true, {}, $.fn.datepicker.language.ru, $.fn.datepicker.language[lang]);
        } else {
          this.loc = $.extend(true, {}, $.fn.datepicker.language.ru, lang);
        }
        if (this.opts.dateFormat) {
          this.loc.dateFormat = this.opts.dateFormat;
        }
        if (this.opts.timeFormat) {
          this.loc.timeFormat = this.opts.timeFormat;
        }
        if ("" !== this.opts.firstDay) {
          this.loc.firstDay = this.opts.firstDay;
        }
        if (this.opts.timepicker) {
          /** @type {string} */
          this.loc.dateFormat = [this.loc.dateFormat, this.loc.timeFormat].join(this.opts.dateTimeSeparator);
        }
        if (this.opts.onlyTimepicker) {
          this.loc.dateFormat = this.loc.timeFormat;
        }
        var boundary = this._getWordBoundaryRegExp;
        if (this.loc.timeFormat.match(boundary("aa")) || this.loc.timeFormat.match(boundary("AA"))) {
          /** @type {boolean} */
          this.ampm = true;
        }
      },
      _buildDatepickersContainer : function() {
        /** @type {boolean} */
        time = true;
        testbed.append('<div class="datepickers-container" id="datepickers-container"></div>');
        $datepickersContainer = $("#datepickers-container");
      },
      _buildBaseHtml : function() {
        var $appendTarget;
        var $inline = $('<div class="datepicker-inline">');
        $appendTarget = "INPUT" == this.el.nodeName ? this.opts.inline ? $inline.insertAfter(this.$el) : $datepickersContainer : $inline.appendTo(this.$el);
        this.$datepicker = $(timezonesHTML).appendTo($appendTarget);
        this.$content = $(".datepicker--content", this.$datepicker);
        this.$nav = $(".datepicker--nav", this.$datepicker);
      },
      _triggerOnChange : function() {
        if (!this.selectedDates.length) {
          if ("" === this._prevOnSelectValue) {
            return;
          }
          return this._prevOnSelectValue = "", this.opts.onSelect("", "", this);
        }
        var formattedDates;
        var selectedDates = this.selectedDates;
        var d = datepicker.getParsedDate(selectedDates[0]);
        var _this = this;
        /** @type {!Date} */
        var dates = new Date(d.year, d.month, d.date, d.hours, d.minutes);
        formattedDates = selectedDates.map(function(date) {
          return _this.formatDate(_this.loc.dateFormat, date);
        }).join(this.opts.multipleDatesSeparator);
        if (this.opts.multipleDates || this.opts.range) {
          dates = selectedDates.map(function(date) {
            var d = datepicker.getParsedDate(date);
            return new Date(d.year, d.month, d.date, d.hours, d.minutes);
          });
        }
        this._prevOnSelectValue = formattedDates;
        this.opts.onSelect(formattedDates, dates, this);
      },
      next : function() {
        var d = this.parsedDate;
        var o = this.opts;
        switch(this.view) {
          case "days":
            /** @type {!Date} */
            this.date = new Date(d.year, d.month + 1, 1);
            if (o.onChangeMonth) {
              o.onChangeMonth(this.parsedDate.month, this.parsedDate.year);
            }
            break;
          case "months":
            /** @type {!Date} */
            this.date = new Date(d.year + 1, d.month, 1);
            if (o.onChangeYear) {
              o.onChangeYear(this.parsedDate.year);
            }
            break;
          case "years":
            /** @type {!Date} */
            this.date = new Date(d.year + 10, 0, 1);
            if (o.onChangeDecade) {
              o.onChangeDecade(this.curDecade);
            }
        }
      },
      prev : function() {
        var d = this.parsedDate;
        var o = this.opts;
        switch(this.view) {
          case "days":
            /** @type {!Date} */
            this.date = new Date(d.year, d.month - 1, 1);
            if (o.onChangeMonth) {
              o.onChangeMonth(this.parsedDate.month, this.parsedDate.year);
            }
            break;
          case "months":
            /** @type {!Date} */
            this.date = new Date(d.year - 1, d.month, 1);
            if (o.onChangeYear) {
              o.onChangeYear(this.parsedDate.year);
            }
            break;
          case "years":
            /** @type {!Date} */
            this.date = new Date(d.year - 10, 0, 1);
            if (o.onChangeDecade) {
              o.onChangeDecade(this.curDecade);
            }
        }
      },
      formatDate : function(string, date) {
        date = date || this.date;
        var validHours;
        /** @type {string} */
        var result = string;
        var boundary = this._getWordBoundaryRegExp;
        var locale = this.loc;
        /** @type {function(string): ?} */
        var leadingZero = datepicker.getLeadingZeroNum;
        var decade = datepicker.getDecade(date);
        var d = datepicker.getParsedDate(date);
        var fullHours = d.fullHours;
        var hours = d.hours;
        var ampm = string.match(boundary("aa")) || string.match(boundary("AA"));
        /** @type {string} */
        var dayPeriod = "am";
        var replacer = this._replacer;
        switch(this.opts.timepicker && this.timepicker && ampm && (validHours = this.timepicker._getValidHoursFromDate(date, ampm), fullHours = leadingZero(validHours.hours), hours = validHours.hours, dayPeriod = validHours.dayPeriod), true) {
          case /@/.test(result):
            result = result.replace(/@/, date.getTime());
          case /aa/.test(result):
            result = replacer(result, boundary("aa"), dayPeriod);
          case /AA/.test(result):
            result = replacer(result, boundary("AA"), dayPeriod.toUpperCase());
          case /dd/.test(result):
            result = replacer(result, boundary("dd"), d.fullDate);
          case /d/.test(result):
            result = replacer(result, boundary("d"), d.date);
          case /DD/.test(result):
            result = replacer(result, boundary("DD"), locale.days[d.day]);
          case /D/.test(result):
            result = replacer(result, boundary("D"), locale.daysShort[d.day]);
          case /mm/.test(result):
            result = replacer(result, boundary("mm"), d.fullMonth);
          case /m/.test(result):
            result = replacer(result, boundary("m"), d.month + 1);
          case /MM/.test(result):
            result = replacer(result, boundary("MM"), this.loc.months[d.month]);
          case /M/.test(result):
            result = replacer(result, boundary("M"), locale.monthsShort[d.month]);
          case /ii/.test(result):
            result = replacer(result, boundary("ii"), d.fullMinutes);
          case /i/.test(result):
            result = replacer(result, boundary("i"), d.minutes);
          case /hh/.test(result):
            result = replacer(result, boundary("hh"), fullHours);
          case /h/.test(result):
            result = replacer(result, boundary("h"), hours);
          case /yyyy/.test(result):
            result = replacer(result, boundary("yyyy"), d.year);
          case /yyyy1/.test(result):
            result = replacer(result, boundary("yyyy1"), decade[0]);
          case /yyyy2/.test(result):
            result = replacer(result, boundary("yyyy2"), decade[1]);
          case /yy/.test(result):
            result = replacer(result, boundary("yy"), d.year.toString().slice(-2));
        }
        return result;
      },
      _replacer : function(str, reg, data) {
        return str.replace(reg, function(canCreateDiscussions, dash_on, s, dash_off) {
          return dash_on + data + dash_off;
        });
      },
      _getWordBoundaryRegExp : function(sign) {
        /** @type {string} */
        var e = "\\s|\\.|-|/|\\\\|,|\\$|\\!|\\?|:|;";
        return new RegExp("(^|>|" + e + ")(" + sign + ")($|<|" + e + ")", "g");
      },
      selectDate : function(date) {
        var _this = this;
        var opts = _this.opts;
        var d = _this.parsedDate;
        var values = _this.selectedDates;
        var len = values.length;
        /** @type {string} */
        var newDate = "";
        if (Array.isArray(date)) {
          return void date.forEach(function(date) {
            _this.selectDate(date);
          });
        }
        if (date instanceof Date) {
          if (this.lastSelectedDate = date, this.timepicker && this.timepicker._setTime(date), _this._trigger("selectDate", date), this.timepicker && (date.setHours(this.timepicker.hours), date.setMinutes(this.timepicker.minutes)), "days" == _this.view && date.getMonth() != d.month && opts.moveToOtherMonthsOnSelect && (newDate = new Date(date.getFullYear(), date.getMonth(), 1)), "years" == _this.view && date.getFullYear() != d.year && opts.moveToOtherYearsOnSelect && (newDate = new Date(date.getFullYear(), 
          0, 1)), newDate && (_this.silent = true, _this.date = newDate, _this.silent = false, _this.nav._render()), opts.multipleDates && !opts.range) {
            if (len === opts.multipleDates) {
              return;
            }
            if (!_this._isSelected(date)) {
              _this.selectedDates.push(date);
            }
          } else {
            if (opts.range) {
              if (2 == len) {
                /** @type {!Array} */
                _this.selectedDates = [date];
                /** @type {string} */
                _this.minRange = date;
                /** @type {string} */
                _this.maxRange = "";
              } else {
                if (1 == len) {
                  _this.selectedDates.push(date);
                  if (_this.maxRange) {
                    /** @type {string} */
                    _this.minRange = date;
                  } else {
                    /** @type {string} */
                    _this.maxRange = date;
                  }
                  if (datepicker.bigger(_this.maxRange, _this.minRange)) {
                    _this.maxRange = _this.minRange;
                    /** @type {string} */
                    _this.minRange = date;
                  }
                  /** @type {!Array} */
                  _this.selectedDates = [_this.minRange, _this.maxRange];
                } else {
                  /** @type {!Array} */
                  _this.selectedDates = [date];
                  /** @type {string} */
                  _this.minRange = date;
                }
              }
            } else {
              /** @type {!Array} */
              _this.selectedDates = [date];
            }
          }
          _this._setInputValue();
          if (opts.onSelect) {
            _this._triggerOnChange();
          }
          if (opts.autoClose && !this.timepickerIsActive) {
            if (opts.multipleDates || opts.range) {
              if (opts.range && 2 == _this.selectedDates.length) {
                _this.hide();
              }
            } else {
              _this.hide();
            }
          }
          _this.views[this.currentView]._render();
        }
      },
      removeDate : function(date) {
        var selected = this.selectedDates;
        var _this = this;
        if (date instanceof Date) {
          return selected.some(function(curDate, child) {
            return datepicker.isSame(curDate, date) ? (selected.splice(child, 1), _this.selectedDates.length ? _this.lastSelectedDate = _this.selectedDates[_this.selectedDates.length - 1] : (_this.minRange = "", _this.maxRange = "", _this.lastSelectedDate = ""), _this.views[_this.currentView]._render(), _this._setInputValue(), _this.opts.onSelect && _this._triggerOnChange(), true) : void 0;
          });
        }
      },
      today : function() {
        /** @type {boolean} */
        this.silent = true;
        this.view = this.opts.minView;
        /** @type {boolean} */
        this.silent = false;
        /** @type {!Date} */
        this.date = new Date;
        if (this.opts.todayButton instanceof Date) {
          this.selectDate(this.opts.todayButton);
        }
      },
      clear : function() {
        /** @type {!Array} */
        this.selectedDates = [];
        /** @type {string} */
        this.minRange = "";
        /** @type {string} */
        this.maxRange = "";
        this.views[this.currentView]._render();
        this._setInputValue();
        if (this.opts.onSelect) {
          this._triggerOnChange();
        }
      },
      update : function(options, value) {
        /** @type {number} */
        var len = arguments.length;
        var lastSelectedDate = this.lastSelectedDate;
        return 2 == len ? this.opts[options] = value : 1 == len && "object" == typeof options && (this.opts = $.extend(true, this.opts, options)), this._createShortCuts(), this._syncWithMinMaxDates(), this._defineLocale(this.opts.language), this.nav._addButtonsIfNeed(), this.opts.onlyTimepicker || this.nav._render(), this.views[this.currentView]._render(), this.elIsInput && !this.opts.inline && (this._setPositionClasses(this.opts.position), this.visible && this.setPosition(this.opts.position)), this.opts.classes && 
        this.$datepicker.addClass(this.opts.classes), this.opts.onlyTimepicker && this.$datepicker.addClass("-only-timepicker-"), this.opts.timepicker && (lastSelectedDate && this.timepicker._handleDate(lastSelectedDate), this.timepicker._updateRanges(), this.timepicker._updateCurrentTime(), lastSelectedDate && (lastSelectedDate.setHours(this.timepicker.hours), lastSelectedDate.setMinutes(this.timepicker.minutes))), this._setInputValue(), this;
      },
      _syncWithMinMaxDates : function() {
        var curTime = this.date.getTime();
        /** @type {boolean} */
        this.silent = true;
        if (this.minTime > curTime) {
          this.date = this.minDate;
        }
        if (this.maxTime < curTime) {
          this.date = this.maxDate;
        }
        /** @type {boolean} */
        this.silent = false;
      },
      _isSelected : function(checkDate, cellType) {
        /** @type {boolean} */
        var otherDate = false;
        return this.selectedDates.some(function(date1) {
          return datepicker.isSame(date1, checkDate, cellType) ? (otherDate = date1, true) : void 0;
        }), otherDate;
      },
      _setInputValue : function() {
        var altValues;
        var _this = this;
        var opts = _this.opts;
        var pattern = _this.loc.dateFormat;
        var altFormat = opts.altFieldDateFormat;
        var value = _this.selectedDates.map(function(date) {
          return _this.formatDate(pattern, date);
        });
        if (opts.altField && _this.$altField.length) {
          altValues = this.selectedDates.map(function(date) {
            return _this.formatDate(altFormat, date);
          });
          altValues = altValues.join(this.opts.multipleDatesSeparator);
          this.$altField.val(altValues);
        }
        value = value.join(this.opts.multipleDatesSeparator);
        this.$el.val(value);
      },
      _isInRange : function(date, type) {
        var time = date.getTime();
        var d = datepicker.getParsedDate(date);
        var min = datepicker.getParsedDate(this.minDate);
        var max = datepicker.getParsedDate(this.maxDate);
        /** @type {number} */
        var dMinTime = (new Date(d.year, d.month, min.date)).getTime();
        /** @type {number} */
        var dMaxTime = (new Date(d.year, d.month, max.date)).getTime();
        var types = {
          day : time >= this.minTime && time <= this.maxTime,
          month : dMinTime >= this.minTime && dMaxTime <= this.maxTime,
          year : d.year >= min.year && d.year <= max.year
        };
        return type ? types[type] : types.day;
      },
      _getDimensions : function(button) {
        var elLocation = button.offset();
        return {
          width : button.outerWidth(),
          height : button.outerHeight(),
          left : elLocation.left,
          top : elLocation.top
        };
      },
      _getDateFromCell : function(cell) {
        var curDate = this.parsedDate;
        var interpretdYear = cell.data("year") || curDate.year;
        var mm2 = cell.data("month") == undefined ? curDate.month : cell.data("month");
        var prevDay = cell.data("date") || 1;
        return new Date(interpretdYear, mm2, prevDay);
      },
      _setPositionClasses : function(pos) {
        pos = pos.split(" ");
        var y = pos[0];
        var yy = pos[1];
        /** @type {string} */
        var className = "datepicker -" + y + "-" + yy + "- -from-" + y + "-";
        if (this.visible) {
          /** @type {string} */
          className = className + " active";
        }
        this.$datepicker.removeAttr("class").addClass(className);
      },
      setPosition : function(position) {
        position = position || this.opts.position;
        var y;
        var x;
        var dims = this._getDimensions(this.$el);
        var selfDims = this._getDimensions(this.$datepicker);
        var style = position.split(" ");
        var offset = this.opts.offset;
        var border = style[0];
        var value = style[1];
        switch(border) {
          case "top":
            /** @type {number} */
            y = dims.top - selfDims.height - offset;
            break;
          case "right":
            x = dims.left + dims.width + offset;
            break;
          case "bottom":
            y = dims.top + dims.height + offset;
            break;
          case "left":
            /** @type {number} */
            x = dims.left - selfDims.width - offset;
        }
        switch(value) {
          case "top":
            y = dims.top;
            break;
          case "right":
            /** @type {number} */
            x = dims.left + dims.width - selfDims.width;
            break;
          case "bottom":
            /** @type {number} */
            y = dims.top + dims.height - selfDims.height;
            break;
          case "left":
            x = dims.left;
            break;
          case "center":
            if (/left|right/.test(border)) {
              /** @type {number} */
              y = dims.top + dims.height / 2 - selfDims.height / 2;
            } else {
              /** @type {number} */
              x = dims.left + dims.width / 2 - selfDims.width / 2;
            }
        }
        this.$datepicker.css({
          left : x,
          top : y
        });
      },
      show : function() {
        var onShow = this.opts.onShow;
        this.setPosition(this.opts.position);
        this.$datepicker.addClass("active");
        /** @type {boolean} */
        this.visible = true;
        if (onShow) {
          this._bindVisionEvents(onShow);
        }
      },
      hide : function() {
        var onHide = this.opts.onHide;
        this.$datepicker.removeClass("active").css({
          left : "-100000px"
        });
        /** @type {string} */
        this.focused = "";
        /** @type {!Array} */
        this.keys = [];
        /** @type {boolean} */
        this.inFocus = false;
        /** @type {boolean} */
        this.visible = false;
        this.$el.blur();
        if (onHide) {
          this._bindVisionEvents(onHide);
        }
      },
      down : function(date) {
        this._changeView(date, "down");
      },
      up : function(date) {
        this._changeView(date, "up");
      },
      _bindVisionEvents : function(event) {
        this.$datepicker.off("transitionend.dp");
        event(this, false);
        this.$datepicker.one("transitionend.dp", event.bind(this, this, true));
      },
      _changeView : function(date, dir) {
        date = date || this.focused || this.date;
        var nextView = "up" == dir ? this.viewIndex + 1 : this.viewIndex - 1;
        if (nextView > 2) {
          /** @type {number} */
          nextView = 2;
        }
        if (0 > nextView) {
          /** @type {number} */
          nextView = 0;
        }
        /** @type {boolean} */
        this.silent = true;
        /** @type {!Date} */
        this.date = new Date(date.getFullYear(), date.getMonth(), 1);
        /** @type {boolean} */
        this.silent = false;
        this.view = this.viewIndexes[nextView];
      },
      _handleHotKey : function(key) {
        var focusedParsed;
        var newDate;
        var maxd;
        var date = datepicker.getParsedDate(this._getFocusedDate());
        var o = this.opts;
        /** @type {boolean} */
        var monthChanged = false;
        /** @type {boolean} */
        var yearChanged = false;
        /** @type {boolean} */
        var decadeChanged = false;
        var y = date.year;
        var m = date.month;
        var d = date.date;
        switch(key) {
          case "ctrlRight":
          case "ctrlUp":
            m = m + 1;
            /** @type {boolean} */
            monthChanged = true;
            break;
          case "ctrlLeft":
          case "ctrlDown":
            /** @type {number} */
            m = m - 1;
            /** @type {boolean} */
            monthChanged = true;
            break;
          case "shiftRight":
          case "shiftUp":
            /** @type {boolean} */
            yearChanged = true;
            y = y + 1;
            break;
          case "shiftLeft":
          case "shiftDown":
            /** @type {boolean} */
            yearChanged = true;
            /** @type {number} */
            y = y - 1;
            break;
          case "altRight":
          case "altUp":
            /** @type {boolean} */
            decadeChanged = true;
            y = y + 10;
            break;
          case "altLeft":
          case "altDown":
            /** @type {boolean} */
            decadeChanged = true;
            /** @type {number} */
            y = y - 10;
            break;
          case "ctrlShiftUp":
            this.up();
        }
        maxd = datepicker.getDaysCount(new Date(y, m));
        /** @type {!Date} */
        newDate = new Date(y, m, d);
        if (d > maxd) {
          d = maxd;
        }
        if (newDate.getTime() < this.minTime) {
          newDate = this.minDate;
        } else {
          if (newDate.getTime() > this.maxTime) {
            newDate = this.maxDate;
          }
        }
        /** @type {!Date} */
        this.focused = newDate;
        focusedParsed = datepicker.getParsedDate(newDate);
        if (monthChanged && o.onChangeMonth) {
          o.onChangeMonth(focusedParsed.month, focusedParsed.year);
        }
        if (yearChanged && o.onChangeYear) {
          o.onChangeYear(focusedParsed.year);
        }
        if (decadeChanged && o.onChangeDecade) {
          o.onChangeDecade(this.curDecade);
        }
      },
      _registerKey : function(key) {
        var e = this.keys.some(function(paramName) {
          return paramName == key;
        });
        if (!e) {
          this.keys.push(key);
        }
      },
      _unRegisterKey : function(key) {
        var kIdx = this.keys.indexOf(key);
        this.keys.splice(kIdx, 1);
      },
      _isHotKeyPressed : function() {
        var a;
        /** @type {boolean} */
        var found = false;
        var _this = this;
        var params = this.keys.sort();
        var hotKey;
        for (hotKey in hotKeys) {
          a = hotKeys[hotKey];
          if (params.length == a.length && a.every(function(n, k) {
            return n == params[k];
          })) {
            _this._trigger("hotKey", hotKey);
            /** @type {boolean} */
            found = true;
          }
        }
        return found;
      },
      _trigger : function(event, args) {
        this.$el.trigger(event, args);
      },
      _focusNextCell : function(keyCode, type) {
        type = type || this.cellType;
        var date = datepicker.getParsedDate(this._getFocusedDate());
        var y = date.year;
        var m = date.month;
        var d = date.date;
        if (!this._isHotKeyPressed()) {
          switch(keyCode) {
            case 37:
              if ("day" == type) {
                /** @type {number} */
                d = d - 1;
              } else {
                "";
              }
              if ("month" == type) {
                /** @type {number} */
                m = m - 1;
              } else {
                "";
              }
              if ("year" == type) {
                /** @type {number} */
                y = y - 1;
              } else {
                "";
              }
              break;
            case 38:
              if ("day" == type) {
                /** @type {number} */
                d = d - 7;
              } else {
                "";
              }
              if ("month" == type) {
                /** @type {number} */
                m = m - 3;
              } else {
                "";
              }
              if ("year" == type) {
                /** @type {number} */
                y = y - 4;
              } else {
                "";
              }
              break;
            case 39:
              if ("day" == type) {
                d = d + 1;
              } else {
                "";
              }
              if ("month" == type) {
                m = m + 1;
              } else {
                "";
              }
              if ("year" == type) {
                y = y + 1;
              } else {
                "";
              }
              break;
            case 40:
              if ("day" == type) {
                d = d + 7;
              } else {
                "";
              }
              if ("month" == type) {
                m = m + 3;
              } else {
                "";
              }
              if ("year" == type) {
                y = y + 4;
              } else {
                "";
              }
          }
          /** @type {!Date} */
          var nd = new Date(y, m, d);
          if (nd.getTime() < this.minTime) {
            nd = this.minDate;
          } else {
            if (nd.getTime() > this.maxTime) {
              nd = this.maxDate;
            }
          }
          /** @type {!Date} */
          this.focused = nd;
        }
      },
      _getFocusedDate : function() {
        var focused = this.focused || this.selectedDates[this.selectedDates.length - 1];
        var d = this.parsedDate;
        if (!focused) {
          switch(this.view) {
            case "days":
              /** @type {!Date} */
              focused = new Date(d.year, d.month, (new Date).getDate());
              break;
            case "months":
              /** @type {!Date} */
              focused = new Date(d.year, d.month, 1);
              break;
            case "years":
              /** @type {!Date} */
              focused = new Date(d.year, 0, 1);
          }
        }
        return focused;
      },
      _getCell : function(date, type) {
        type = type || this.cellType;
        var $cell;
        var it = datepicker.getParsedDate(date);
        /** @type {string} */
        var column = '.datepicker--cell[data-year="' + it.year + '"]';
        switch(type) {
          case "month":
            /** @type {string} */
            column = '[data-month="' + it.month + '"]';
            break;
          case "day":
            /** @type {string} */
            column = column + ('[data-month="' + it.month + '"][data-date="' + it.date + '"]');
        }
        return $cell = this.views[this.currentView].$el.find(column), $cell.length ? $cell : $("");
      },
      destroy : function() {
        var _this = this;
        _this.$el.off(".adp").data("datepicker", "");
        /** @type {!Array} */
        _this.selectedDates = [];
        /** @type {string} */
        _this.focused = "";
        _this.views = {};
        /** @type {!Array} */
        _this.keys = [];
        /** @type {string} */
        _this.minRange = "";
        /** @type {string} */
        _this.maxRange = "";
        if (_this.opts.inline || !_this.elIsInput) {
          _this.$datepicker.closest(".datepicker-inline").remove();
        } else {
          _this.$datepicker.remove();
        }
      },
      _handleAlreadySelectedDates : function(alreadySelected, selectedDate) {
        if (this.opts.range) {
          if (this.opts.toggleSelected) {
            this.removeDate(selectedDate);
          } else {
            if (2 != this.selectedDates.length) {
              this._trigger("clickCell", selectedDate);
            }
          }
        } else {
          if (this.opts.toggleSelected) {
            this.removeDate(selectedDate);
          }
        }
        if (!this.opts.toggleSelected) {
          /** @type {number} */
          this.lastSelectedDate = alreadySelected;
          if (this.opts.timepicker) {
            this.timepicker._setTime(alreadySelected);
            this.timepicker.update();
          }
        }
      },
      _onShowEvent : function(e) {
        if (!this.visible) {
          this.show();
        }
      },
      _onBlur : function() {
        if (!this.inFocus && this.visible) {
          this.hide();
        }
      },
      _onMouseDownDatepicker : function(e) {
        /** @type {boolean} */
        this.inFocus = true;
      },
      _onMouseUpDatepicker : function(e) {
        /** @type {boolean} */
        this.inFocus = false;
        /** @type {boolean} */
        e.originalEvent.inFocus = true;
        if (!e.originalEvent.timepickerFocus) {
          this.$el.focus();
        }
      },
      _onKeyUpGeneral : function(e) {
        var e = this.$el.val();
        if (!e) {
          this.clear();
        }
      },
      _onResize : function() {
        if (this.visible) {
          this.setPosition();
        }
      },
      _onMouseUpBody : function(e) {
        if (!e.originalEvent.inFocus) {
          if (this.visible && !this.inFocus) {
            this.hide();
          }
        }
      },
      _onMouseUpEl : function(e) {
        /** @type {boolean} */
        e.originalEvent.inFocus = true;
        setTimeout(this._onKeyUpGeneral.bind(this), 4);
      },
      _onKeyDown : function(event) {
        var code = event.which;
        if (this._registerKey(code), code >= 37 && 40 >= code && (event.preventDefault(), this._focusNextCell(code)), 13 == code && this.focused) {
          if (this._getCell(this.focused).hasClass("-disabled-")) {
            return;
          }
          if (this.view != this.opts.minView) {
            this.down();
          } else {
            var alreadySelected = this._isSelected(this.focused, this.cellType);
            if (!alreadySelected) {
              return this.timepicker && (this.focused.setHours(this.timepicker.hours), this.focused.setMinutes(this.timepicker.minutes)), void this.selectDate(this.focused);
            }
            this._handleAlreadySelectedDates(alreadySelected, this.focused);
          }
        }
        if (27 == code) {
          this.hide();
        }
      },
      _onKeyUp : function(event) {
        var code = event.which;
        this._unRegisterKey(code);
      },
      _onHotKey : function(e, hotKey) {
        this._handleHotKey(hotKey);
      },
      _onMouseEnterCell : function(e) {
        var $cell = $(e.target).closest(".datepicker--cell");
        var date = this._getDateFromCell($cell);
        /** @type {boolean} */
        this.silent = true;
        if (this.focused) {
          /** @type {string} */
          this.focused = "";
        }
        $cell.addClass("-focus-");
        this.focused = date;
        /** @type {boolean} */
        this.silent = false;
        if (this.opts.range && 1 == this.selectedDates.length) {
          this.minRange = this.selectedDates[0];
          /** @type {string} */
          this.maxRange = "";
          if (datepicker.less(this.minRange, this.focused)) {
            this.maxRange = this.minRange;
            /** @type {string} */
            this.minRange = "";
          }
          this.views[this.currentView]._update();
        }
      },
      _onMouseLeaveCell : function(e) {
        var $cell = $(e.target).closest(".datepicker--cell");
        $cell.removeClass("-focus-");
        /** @type {boolean} */
        this.silent = true;
        /** @type {string} */
        this.focused = "";
        /** @type {boolean} */
        this.silent = false;
      },
      _onTimeChange : function(e, h, m) {
        /** @type {!Date} */
        var date = new Date;
        var selectedDates = this.selectedDates;
        /** @type {boolean} */
        var n = false;
        if (selectedDates.length) {
          /** @type {boolean} */
          n = true;
          date = this.lastSelectedDate;
        }
        date.setHours(h);
        date.setMinutes(m);
        if (n || this._getCell(date).hasClass("-disabled-")) {
          this._setInputValue();
          if (this.opts.onSelect) {
            this._triggerOnChange();
          }
        } else {
          this.selectDate(date);
        }
      },
      _onClickCell : function(e, date) {
        if (this.timepicker) {
          date.setHours(this.timepicker.hours);
          date.setMinutes(this.timepicker.minutes);
        }
        this.selectDate(date);
      },
      set focused(val) {
        if (!val && this.focused) {
          var $cell = this._getCell(this.focused);
          if ($cell.length) {
            $cell.removeClass("-focus-");
          }
        }
        /** @type {string} */
        this._focused = val;
        if (this.opts.range && 1 == this.selectedDates.length) {
          this.minRange = this.selectedDates[0];
          /** @type {string} */
          this.maxRange = "";
          if (datepicker.less(this.minRange, this._focused)) {
            this.maxRange = this.minRange;
            /** @type {string} */
            this.minRange = "";
          }
        }
        if (!this.silent) {
          /** @type {string} */
          this.date = val;
        }
      },
      get focused() {
        return this._focused;
      },
      get parsedDate() {
        return datepicker.getParsedDate(this.date);
      },
      set date(val) {
        return val instanceof Date ? (this.currentDate = val, this.inited && !this.silent && (this.views[this.view]._render(), this.nav._render(), this.visible && this.elIsInput && this.setPosition()), val) : void 0;
      },
      get date() {
        return this.currentDate;
      },
      set view(val) {
        return this.viewIndex = this.viewIndexes.indexOf(val), this.viewIndex < 0 ? void 0 : (this.prevView = this.currentView, this.currentView = val, this.inited && (this.views[val] ? this.views[val]._render() : this.views[val] = new $.fn.datepicker.Body(this, val, this.opts), this.views[this.prevView].hide(), this.views[val].show(), this.nav._render(), this.opts.onChangeView && this.opts.onChangeView(val), this.elIsInput && this.visible && this.setPosition()), val);
      },
      get view() {
        return this.currentView;
      },
      get cellType() {
        return this.view.substring(0, this.view.length - 1);
      },
      get minTime() {
        var min = datepicker.getParsedDate(this.minDate);
        return (new Date(min.year, min.month, min.date)).getTime();
      },
      get maxTime() {
        var max = datepicker.getParsedDate(this.maxDate);
        return (new Date(max.year, max.month, max.date)).getTime();
      },
      get curDecade() {
        return datepicker.getDecade(this.date);
      }
    };
    /**
     * @param {!Date} date
     * @return {?}
     */
    datepicker.getDaysCount = function(date) {
      return (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
    };
    /**
     * @param {!Object} date
     * @return {?}
     */
    datepicker.getParsedDate = function(date) {
      return {
        year : date.getFullYear(),
        month : date.getMonth(),
        fullMonth : date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1,
        date : date.getDate(),
        fullDate : date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
        day : date.getDay(),
        hours : date.getHours(),
        fullHours : date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
        minutes : date.getMinutes(),
        fullMinutes : date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
      };
    };
    /**
     * @param {?} date
     * @return {?}
     */
    datepicker.getDecade = function(date) {
      /** @type {number} */
      var e = 10 * Math.floor(date.getFullYear() / 10);
      return [e, e + 9];
    };
    /**
     * @param {string} data
     * @param {!NodeList} text
     * @return {?}
     */
    datepicker.template = function(data, text) {
      return data.replace(/#\{([\w]+)\}/g, function(canCreateDiscussions, textOfButtonTest) {
        return text[textOfButtonTest] || 0 === text[textOfButtonTest] ? text[textOfButtonTest] : void 0;
      });
    };
    /**
     * @param {?} date1
     * @param {?} date2
     * @param {string} type
     * @return {?}
     */
    datepicker.isSame = function(date1, date2, type) {
      if (!date1 || !date2) {
        return false;
      }
      var d1 = datepicker.getParsedDate(date1);
      var d2 = datepicker.getParsedDate(date2);
      var _type = type ? type : "day";
      var conditions = {
        day : d1.date == d2.date && d1.month == d2.month && d1.year == d2.year,
        month : d1.month == d2.month && d1.year == d2.year,
        year : d1.year == d2.year
      };
      return conditions[_type];
    };
    /**
     * @param {!Date} dateCompareTo
     * @param {!Date} date
     * @param {?} n
     * @return {?}
     */
    datepicker.less = function(dateCompareTo, date, n) {
      return dateCompareTo && date ? date.getTime() < dateCompareTo.getTime() : false;
    };
    /**
     * @param {!Date} dateCompareTo
     * @param {!Date} date
     * @param {?} type
     * @return {?}
     */
    datepicker.bigger = function(dateCompareTo, date, type) {
      return dateCompareTo && date ? date.getTime() > dateCompareTo.getTime() : false;
    };
    /**
     * @param {string} num
     * @return {?}
     */
    datepicker.getLeadingZeroNum = function(num) {
      return parseInt(num) < 10 ? "0" + num : num;
    };
    /**
     * @param {!Object} date
     * @return {?}
     */
    datepicker.resetTime = function(date) {
      return "object" == typeof date ? (date = datepicker.getParsedDate(date), new Date(date.year, date.month, date.date)) : void 0;
    };
    /**
     * @param {boolean} options
     * @return {?}
     */
    $.fn.datepicker = function(options) {
      return this.each(function() {
        if ($.data(this, pluginName)) {
          var plugin = $.data(this, pluginName);
          plugin.opts = $.extend(true, plugin.opts, options);
          plugin.update();
        } else {
          $.data(this, pluginName, new Datepicker(this, options));
        }
      });
    };
    /** @type {function(!Element, ?): undefined} */
    $.fn.datepicker.Constructor = Datepicker;
    $.fn.datepicker.language = {
      ru : {
        days : ["\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435", "\u041f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a", "\u0412\u0442\u043e\u0440\u043d\u0438\u043a", "\u0421\u0440\u0435\u0434\u0430", "\u0427\u0435\u0442\u0432\u0435\u0440\u0433", "\u041f\u044f\u0442\u043d\u0438\u0446\u0430", "\u0421\u0443\u0431\u0431\u043e\u0442\u0430"],
        daysShort : ["\u0412\u043e\u0441", "\u041f\u043e\u043d", "\u0412\u0442\u043e", "\u0421\u0440\u0435", "\u0427\u0435\u0442", "\u041f\u044f\u0442", "\u0421\u0443\u0431"],
        daysMin : ["\u0412\u0441", "\u041f\u043d", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041f\u0442", "\u0421\u0431"],
        months : ["\u042f\u043d\u0432\u0430\u0440\u044c", "\u0424\u0435\u0432\u0440\u0430\u043b\u044c", "\u041c\u0430\u0440\u0442", "\u0410\u043f\u0440\u0435\u043b\u044c", "\u041c\u0430\u0439", "\u0418\u044e\u043d\u044c", "\u0418\u044e\u043b\u044c", "\u0410\u0432\u0433\u0443\u0441\u0442", "\u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c", "\u041e\u043a\u0442\u044f\u0431\u0440\u044c", "\u041d\u043e\u044f\u0431\u0440\u044c", "\u0414\u0435\u043a\u0430\u0431\u0440\u044c"],
        monthsShort : ["\u042f\u043d\u0432", "\u0424\u0435\u0432", "\u041c\u0430\u0440", "\u0410\u043f\u0440", "\u041c\u0430\u0439", "\u0418\u044e\u043d", "\u0418\u044e\u043b", "\u0410\u0432\u0433", "\u0421\u0435\u043d", "\u041e\u043a\u0442", "\u041d\u043e\u044f", "\u0414\u0435\u043a"],
        today : "\u0421\u0435\u0433\u043e\u0434\u043d\u044f",
        clear : "\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c",
        dateFormat : "dd.mm.yyyy",
        timeFormat : "hh:ii",
        firstDay : 1
      }
    };
    $(function() {
      $(selector).datepicker();
    });
  }();
  (function() {
    var templates = {
      days : '<div class="datepicker--days datepicker--body"><div class="datepicker--days-names"></div><div class="datepicker--cells datepicker--cells-days"></div></div>',
      months : '<div class="datepicker--months datepicker--body"><div class="datepicker--cells datepicker--cells-months"></div></div>',
      years : '<div class="datepicker--years datepicker--body"><div class="datepicker--cells datepicker--cells-years"></div></div>'
    };
    var datepicker = $.fn.datepicker;
    var dp = datepicker.Constructor;
    /**
     * @param {!Object} d
     * @param {!Object} type
     * @param {!Object} options
     * @return {undefined}
     */
    datepicker.Body = function(d, type, options) {
      /** @type {!Object} */
      this.d = d;
      /** @type {!Object} */
      this.type = type;
      /** @type {!Object} */
      this.opts = options;
      this.$el = $("");
      if (!this.opts.onlyTimepicker) {
        this.init();
      }
    };
    datepicker.Body.prototype = {
      init : function() {
        this._buildBaseHtml();
        this._render();
        this._bindEvents();
      },
      _bindEvents : function() {
        this.$el.on("click", ".datepicker--cell", $.proxy(this._onClickCell, this));
      },
      _buildBaseHtml : function() {
        this.$el = $(templates[this.type]).appendTo(this.d.$content);
        this.$names = $(".datepicker--days-names", this.$el);
        this.$cells = $(".datepicker--cells", this.$el);
      },
      _getDayNamesHtml : function(firstDay, curDay, html, i) {
        return curDay = curDay != undefined ? curDay : firstDay, html = html ? html : "", i = i != undefined ? i : 0, i > 7 ? html : 7 == curDay ? this._getDayNamesHtml(firstDay, 0, html, ++i) : (html = html + ('<div class="datepicker--day-name' + (this.d.isWeekend(curDay) ? " -weekend-" : "") + '">' + this.d.loc.daysMin[curDay] + "</div>"), this._getDayNamesHtml(firstDay, ++curDay, html, ++i));
      },
      _getCellContents : function(date, type) {
        /** @type {string} */
        var classes = "datepicker--cell datepicker--cell-" + type;
        /** @type {!Date} */
        var currentDate = new Date;
        var parent = this.d;
        var minRange = dp.resetTime(parent.minRange);
        var maxRange = dp.resetTime(parent.maxRange);
        var opts = parent.opts;
        var d = dp.getParsedDate(date);
        var render = {};
        var html = d.date;
        switch(type) {
          case "day":
            if (parent.isWeekend(d.day)) {
              /** @type {string} */
              classes = classes + " -weekend-";
            }
            if (d.month != this.d.parsedDate.month) {
              /** @type {string} */
              classes = classes + " -other-month-";
              if (!opts.selectOtherMonths) {
                /** @type {string} */
                classes = classes + " -disabled-";
              }
              if (!opts.showOtherMonths) {
                /** @type {string} */
                html = "";
              }
            }
            break;
          case "month":
            html = parent.loc[parent.opts.monthsField][d.month];
            break;
          case "year":
            var decade = parent.curDecade;
            html = d.year;
            if (d.year < decade[0] || d.year > decade[1]) {
              /** @type {string} */
              classes = classes + " -other-decade-";
              if (!opts.selectOtherYears) {
                /** @type {string} */
                classes = classes + " -disabled-";
              }
              if (!opts.showOtherYears) {
                /** @type {string} */
                html = "";
              }
            }
        }
        return opts.onRenderCell && (render = opts.onRenderCell(date, type) || {}, html = render.html ? render.html : html, classes = classes + (render.classes ? " " + render.classes : "")), opts.range && (dp.isSame(minRange, date, type) && (classes = classes + " -range-from-"), dp.isSame(maxRange, date, type) && (classes = classes + " -range-to-"), 1 == parent.selectedDates.length && parent.focused ? ((dp.bigger(minRange, date) && dp.less(parent.focused, date) || dp.less(maxRange, date) && dp.bigger(parent.focused, 
        date)) && (classes = classes + " -in-range-"), dp.less(maxRange, date) && dp.isSame(parent.focused, date) && (classes = classes + " -range-from-"), dp.bigger(minRange, date) && dp.isSame(parent.focused, date) && (classes = classes + " -range-to-")) : 2 == parent.selectedDates.length && dp.bigger(minRange, date) && dp.less(maxRange, date) && (classes = classes + " -in-range-")), dp.isSame(currentDate, date, type) && (classes = classes + " -current-"), parent.focused && dp.isSame(date, parent.focused, 
        type) && (classes = classes + " -focus-"), parent._isSelected(date, type) && (classes = classes + " -selected-"), (!parent._isInRange(date, type) || render.disabled) && (classes = classes + " -disabled-"), {
          html : html,
          classes : classes
        };
      },
      _getDaysHtml : function(date) {
        var totalMonthDays = dp.getDaysCount(date);
        /** @type {number} */
        var before = (new Date(date.getFullYear(), date.getMonth(), 1)).getDay();
        /** @type {number} */
        var dayOfWeek = (new Date(date.getFullYear(), date.getMonth(), totalMonthDays)).getDay();
        /** @type {number} */
        var padding = before - this.d.loc.firstDay;
        var daysFromNextMonth = 6 - dayOfWeek + this.d.loc.firstDay;
        /** @type {number} */
        padding = 0 > padding ? padding + 7 : padding;
        daysFromNextMonth = daysFromNextMonth > 6 ? daysFromNextMonth - 7 : daysFromNextMonth;
        var m;
        var y;
        /** @type {number} */
        var $exisintg_num = -padding + 1;
        /** @type {string} */
        var html = "";
        /** @type {number} */
        var i = $exisintg_num;
        var max = totalMonthDays + daysFromNextMonth;
        for (; max >= i; i++) {
          y = date.getFullYear();
          m = date.getMonth();
          html = html + this._getDayHtml(new Date(y, m, i));
        }
        return html;
      },
      _getDayHtml : function(date) {
        var content = this._getCellContents(date, "day");
        return '<div class="' + content.classes + '" data-date="' + date.getDate() + '" data-month="' + date.getMonth() + '" data-year="' + date.getFullYear() + '">' + content.html + "</div>";
      },
      _getMonthsHtml : function(date) {
        /** @type {string} */
        var html = "";
        var i = dp.getParsedDate(date);
        /** @type {number} */
        var mm2 = 0;
        for (; 12 > mm2;) {
          html = html + this._getMonthHtml(new Date(i.year, mm2));
          mm2++;
        }
        return html;
      },
      _getMonthHtml : function(date) {
        var content = this._getCellContents(date, "month");
        return '<div class="' + content.classes + '" data-month="' + date.getMonth() + '">' + content.html + "</div>";
      },
      _getYearsHtml : function(date) {
        var e = (dp.getParsedDate(date), dp.getDecade(date));
        /** @type {number} */
        var numRays = e[0] - 1;
        /** @type {string} */
        var html = "";
        /** @type {number} */
        var i = numRays;
        i;
        for (; i <= e[1] + 1; i++) {
          html = html + this._getYearHtml(new Date(i, 0));
        }
        return html;
      },
      _getYearHtml : function(date) {
        var content = this._getCellContents(date, "year");
        return '<div class="' + content.classes + '" data-year="' + date.getFullYear() + '">' + content.html + "</div>";
      },
      _renderTypes : {
        days : function() {
          var dayNames = this._getDayNamesHtml(this.d.loc.firstDay);
          var days = this._getDaysHtml(this.d.currentDate);
          this.$cells.html(days);
          this.$names.html(dayNames);
        },
        months : function() {
          var html = this._getMonthsHtml(this.d.currentDate);
          this.$cells.html(html);
        },
        years : function() {
          var html = this._getYearsHtml(this.d.currentDate);
          this.$cells.html(html);
        }
      },
      _render : function() {
        if (!this.opts.onlyTimepicker) {
          this._renderTypes[this.type].bind(this)();
        }
      },
      _update : function() {
        var classes;
        var $cell;
        var date;
        var $cells = $(".datepicker--cell", this.$cells);
        var _this = this;
        $cells.each(function(a, canCreateDiscussions) {
          $cell = $(this);
          date = _this.d._getDateFromCell($(this));
          classes = _this._getCellContents(date, _this.d.cellType);
          $cell.attr("class", classes.classes);
        });
      },
      show : function() {
        if (!this.opts.onlyTimepicker) {
          this.$el.addClass("active");
          /** @type {boolean} */
          this.acitve = true;
        }
      },
      hide : function() {
        this.$el.removeClass("active");
        /** @type {boolean} */
        this.active = false;
      },
      _handleClick : function(event) {
        var date = event.data("date") || 1;
        var month = event.data("month") || 0;
        var year = event.data("year") || this.d.parsedDate.year;
        var dp = this.d;
        if (dp.view != this.opts.minView) {
          return void dp.down(new Date(year, month, date));
        }
        /** @type {!Date} */
        var selectedDate = new Date(year, month, date);
        var alreadySelected = this.d._isSelected(selectedDate, this.d.cellType);
        return alreadySelected ? void dp._handleAlreadySelectedDates.bind(dp, alreadySelected, selectedDate)() : void dp._trigger("clickCell", selectedDate);
      },
      _onClickCell : function(e) {
        var $el = $(e.target).closest(".datepicker--cell");
        if (!$el.hasClass("-disabled-")) {
          this._handleClick.bind(this)($el);
        }
      }
    };
  })();
  (function() {
    /** @type {string} */
    var i = '<div class="datepicker--nav-action" data-action="prev">#{prevHtml}</div><div class="datepicker--nav-title">#{title}</div><div class="datepicker--nav-action" data-action="next">#{nextHtml}</div>';
    /** @type {string} */
    var photoText = '<div class="datepicker--buttons"></div>';
    /** @type {string} */
    var template = '<span class="datepicker--button" data-action="#{action}">#{label}</span>';
    var datepicker = $.fn.datepicker;
    var dp = datepicker.Constructor;
    /**
     * @param {!Object} d
     * @param {!Object} options
     * @return {undefined}
     */
    datepicker.Navigation = function(d, options) {
      /** @type {!Object} */
      this.d = d;
      /** @type {!Object} */
      this.opts = options;
      /** @type {string} */
      this.$buttonsContainer = "";
      this.init();
    };
    datepicker.Navigation.prototype = {
      init : function() {
        this._buildBaseHtml();
        this._bindEvents();
      },
      _bindEvents : function() {
        this.d.$nav.on("click", ".datepicker--nav-action", $.proxy(this._onClickNavButton, this));
        this.d.$nav.on("click", ".datepicker--nav-title", $.proxy(this._onClickNavTitle, this));
        this.d.$datepicker.on("click", ".datepicker--button", $.proxy(this._onClickNavButton, this));
      },
      _buildBaseHtml : function() {
        if (!this.opts.onlyTimepicker) {
          this._render();
        }
        this._addButtonsIfNeed();
      },
      _addButtonsIfNeed : function() {
        if (this.opts.todayButton) {
          this._addButton("today");
        }
        if (this.opts.clearButton) {
          this._addButton("clear");
        }
      },
      _render : function() {
        var title = this._getTitle(this.d.currentDate);
        var s = dp.template(i, $.extend({
          title : title
        }, this.opts));
        this.d.$nav.html(s);
        if ("years" == this.d.view) {
          $(".datepicker--nav-title", this.d.$nav).addClass("-disabled-");
        }
        this.setNavStatus();
      },
      _getTitle : function(date) {
        return this.d.formatDate(this.opts.navTitles[this.d.view], date);
      },
      _addButton : function(type) {
        if (!this.$buttonsContainer.length) {
          this._addButtonsContainer();
        }
        var data = {
          action : type,
          label : this.d.loc[type]
        };
        var html = dp.template(template, data);
        if (!$("[data-action=" + type + "]", this.$buttonsContainer).length) {
          this.$buttonsContainer.append(html);
        }
      },
      _addButtonsContainer : function() {
        this.d.$datepicker.append(photoText);
        this.$buttonsContainer = $(".datepicker--buttons", this.d.$datepicker);
      },
      setNavStatus : function() {
        if ((this.opts.minDate || this.opts.maxDate) && this.opts.disableNavWhenOutOfRange) {
          var date = this.d.parsedDate;
          var m = date.month;
          var y = date.year;
          var d = date.date;
          switch(this.d.view) {
            case "days":
              if (!this.d._isInRange(new Date(y, m - 1, 1), "month")) {
                this._disableNav("prev");
              }
              if (!this.d._isInRange(new Date(y, m + 1, 1), "month")) {
                this._disableNav("next");
              }
              break;
            case "months":
              if (!this.d._isInRange(new Date(y - 1, m, d), "year")) {
                this._disableNav("prev");
              }
              if (!this.d._isInRange(new Date(y + 1, m, d), "year")) {
                this._disableNav("next");
              }
              break;
            case "years":
              var a = dp.getDecade(this.d.date);
              if (!this.d._isInRange(new Date(a[0] - 1, 0, 1), "year")) {
                this._disableNav("prev");
              }
              if (!this.d._isInRange(new Date(a[1] + 1, 0, 1), "year")) {
                this._disableNav("next");
              }
          }
        }
      },
      _disableNav : function(nav) {
        $('[data-action="' + nav + '"]', this.d.$nav).addClass("-disabled-");
      },
      _activateNav : function(event) {
        $('[data-action="' + event + '"]', this.d.$nav).removeClass("-disabled-");
      },
      _onClickNavButton : function(e) {
        var currentSprite = $(e.target).closest("[data-action]");
        var action = currentSprite.data("action");
        this.d[action]();
      },
      _onClickNavTitle : function(e) {
        return $(e.target).hasClass("-disabled-") ? void 0 : "days" == this.d.view ? this.d.view = "months" : void(this.d.view = "years");
      }
    };
  })();
  (function() {
    /** @type {string} */
    var i = '<div class="datepicker--time"><div class="datepicker--time-current">   <span class="datepicker--time-current-hours">#{hourVisible}</span>   <span class="datepicker--time-current-colon">:</span>   <span class="datepicker--time-current-minutes">#{minValue}</span></div><div class="datepicker--time-sliders">   <div class="datepicker--time-row">      <input type="range" name="hours" value="#{hourValue}" min="#{hourMin}" max="#{hourMax}" step="#{hourStep}"/>   </div>   <div class="datepicker--time-row">      <input type="range" name="minutes" value="#{minValue}" min="#{minMin}" max="#{minMax}" step="#{minStep}"/>   </div></div></div>';
    var datepicker = $.fn.datepicker;
    var dp = datepicker.Constructor;
    /**
     * @param {!Object} inst
     * @param {!Object} options
     * @return {undefined}
     */
    datepicker.Timepicker = function(inst, options) {
      /** @type {!Object} */
      this.d = inst;
      /** @type {!Object} */
      this.opts = options;
      this.init();
    };
    datepicker.Timepicker.prototype = {
      init : function() {
        /** @type {string} */
        var input = "input";
        this._setTime(this.d.date);
        this._buildHTML();
        if (navigator.userAgent.match(/trident/gi)) {
          /** @type {string} */
          input = "change";
        }
        this.d.$el.on("selectDate", this._onSelectDate.bind(this));
        this.$ranges.on(input, this._onChangeRange.bind(this));
        this.$ranges.on("mouseup", this._onMouseUpRange.bind(this));
        this.$ranges.on("mousemove focus ", this._onMouseEnterRange.bind(this));
        this.$ranges.on("mouseout blur", this._onMouseOutRange.bind(this));
      },
      _setTime : function(date) {
        var _date = dp.getParsedDate(date);
        this._handleDate(date);
        this.hours = _date.hours < this.minHours ? this.minHours : _date.hours;
        this.minutes = _date.minutes < this.minMinutes ? this.minMinutes : _date.minutes;
      },
      _setMinTimeFromDate : function(date) {
        this.minHours = date.getHours();
        this.minMinutes = date.getMinutes();
        if (this.d.lastSelectedDate && this.d.lastSelectedDate.getHours() > date.getHours()) {
          this.minMinutes = this.opts.minMinutes;
        }
      },
      _setMaxTimeFromDate : function(date) {
        this.maxHours = date.getHours();
        this.maxMinutes = date.getMinutes();
        if (this.d.lastSelectedDate && this.d.lastSelectedDate.getHours() < date.getHours()) {
          this.maxMinutes = this.opts.maxMinutes;
        }
      },
      _setDefaultMinMaxTime : function() {
        /** @type {number} */
        var maxHours = 23;
        /** @type {number} */
        var maxMinutes = 59;
        var opts = this.opts;
        this.minHours = opts.minHours < 0 || opts.minHours > maxHours ? 0 : opts.minHours;
        this.minMinutes = opts.minMinutes < 0 || opts.minMinutes > maxMinutes ? 0 : opts.minMinutes;
        this.maxHours = opts.maxHours < 0 || opts.maxHours > maxHours ? maxHours : opts.maxHours;
        this.maxMinutes = opts.maxMinutes < 0 || opts.maxMinutes > maxMinutes ? maxMinutes : opts.maxMinutes;
      },
      _validateHoursMinutes : function(date) {
        if (this.hours < this.minHours) {
          this.hours = this.minHours;
        } else {
          if (this.hours > this.maxHours) {
            this.hours = this.maxHours;
          }
        }
        if (this.minutes < this.minMinutes) {
          this.minutes = this.minMinutes;
        } else {
          if (this.minutes > this.maxMinutes) {
            this.minutes = this.maxMinutes;
          }
        }
      },
      _buildHTML : function() {
        var lz = dp.getLeadingZeroNum;
        var data = {
          hourMin : this.minHours,
          hourMax : lz(this.maxHours),
          hourStep : this.opts.hoursStep,
          hourValue : this.hours,
          hourVisible : lz(this.displayHours),
          minMin : this.minMinutes,
          minMax : lz(this.maxMinutes),
          minStep : this.opts.minutesStep,
          minValue : lz(this.minutes)
        };
        var n = dp.template(i, data);
        this.$timepicker = $(n).appendTo(this.d.$datepicker);
        this.$ranges = $('[type="range"]', this.$timepicker);
        this.$hours = $('[name="hours"]', this.$timepicker);
        this.$minutes = $('[name="minutes"]', this.$timepicker);
        this.$hoursText = $(".datepicker--time-current-hours", this.$timepicker);
        this.$minutesText = $(".datepicker--time-current-minutes", this.$timepicker);
        if (this.d.ampm) {
          this.$ampm = $('<span class="datepicker--time-current-ampm">').appendTo($(".datepicker--time-current", this.$timepicker)).html(this.dayPeriod);
          this.$timepicker.addClass("-am-pm-");
        }
      },
      _updateCurrentTime : function() {
        var h = dp.getLeadingZeroNum(this.displayHours);
        var m = dp.getLeadingZeroNum(this.minutes);
        this.$hoursText.html(h);
        this.$minutesText.html(m);
        if (this.d.ampm) {
          this.$ampm.html(this.dayPeriod);
        }
      },
      _updateRanges : function() {
        this.$hours.attr({
          min : this.minHours,
          max : this.maxHours
        }).val(this.hours);
        this.$minutes.attr({
          min : this.minMinutes,
          max : this.maxMinutes
        }).val(this.minutes);
      },
      _handleDate : function(date) {
        this._setDefaultMinMaxTime();
        if (date) {
          if (dp.isSame(date, this.d.opts.minDate)) {
            this._setMinTimeFromDate(this.d.opts.minDate);
          } else {
            if (dp.isSame(date, this.d.opts.maxDate)) {
              this._setMaxTimeFromDate(this.d.opts.maxDate);
            }
          }
        }
        this._validateHoursMinutes(date);
      },
      update : function() {
        this._updateRanges();
        this._updateCurrentTime();
      },
      _getValidHoursFromDate : function(date, ampm) {
        /** @type {number} */
        var d = date;
        /** @type {number} */
        var hours = date;
        if (date instanceof Date) {
          d = dp.getParsedDate(date);
          hours = d.hours;
        }
        var _ampm = ampm || this.d.ampm;
        /** @type {string} */
        var dayPeriod = "am";
        if (_ampm) {
          switch(true) {
            case 0 == hours:
              /** @type {number} */
              hours = 12;
              break;
            case 12 == hours:
              /** @type {string} */
              dayPeriod = "pm";
              break;
            case hours > 11:
              /** @type {number} */
              hours = hours - 12;
              /** @type {string} */
              dayPeriod = "pm";
          }
        }
        return {
          hours : hours,
          dayPeriod : dayPeriod
        };
      },
      set hours(val) {
        this._hours = val;
        var displayHours = this._getValidHoursFromDate(val);
        this.displayHours = displayHours.hours;
        this.dayPeriod = displayHours.dayPeriod;
      },
      get hours() {
        return this._hours;
      },
      _onChangeRange : function(e) {
        var i = $(e.target);
        var hookName2 = i.attr("name");
        /** @type {boolean} */
        this.d.timepickerIsActive = true;
        this[hookName2] = i.val();
        this._updateCurrentTime();
        this.d._trigger("timeChange", [this.hours, this.minutes]);
        this._handleDate(this.d.lastSelectedDate);
        this.update();
      },
      _onSelectDate : function(e, data) {
        this._handleDate(data);
        this.update();
      },
      _onMouseEnterRange : function(e) {
        var i = $(e.target).attr("name");
        $(".datepicker--time-current-" + i, this.$timepicker).addClass("-focus-");
      },
      _onMouseOutRange : function(e) {
        var i = $(e.target).attr("name");
        if (!this.d.inFocus) {
          $(".datepicker--time-current-" + i, this.$timepicker).removeClass("-focus-");
        }
      },
      _onMouseUpRange : function(e) {
        /** @type {boolean} */
        this.d.timepickerIsActive = false;
      }
    };
  })();
}(window, jQuery);
