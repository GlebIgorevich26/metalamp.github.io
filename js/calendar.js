// Datepicker with two dates for choise win two choise sections
$(function() {
    $(".dropdown-date__range_from").datepicker({
      minDate: new Date(),
      range: true,
      offset: 10,
      multipleDatesSeparator: "-",
      classes: "dropdown-date",
      clearButton: true,
      prevHtml : '<svg><path d="M16.1755 8.01562V9.98438H3.98801L9.56613 15.6094L8.15988 17.0156L0.144258 9L8.15988 0.984375L9.56613 2.39062L3.98801 8.01562H16.1755Z" /></svg>',
      nextHtml : '<svg><path d="M8.36301 0.984375L16.3786 9L8.36301 17.0156L6.95676 15.6094L12.5349 9.98438H0.347383V8.01562H12.5349L6.95676 2.39062L8.36301 0.984375Z" /></svg>',
      todayButton: true,
      navTitles: {
        days: "<h2>MM yyyy</h2>",
      },
      language: {
        today: "Применить",
      },
      onRenderCell: function(date, cellType) {
        if (cellType == "day") {
          return {
            html: `${date.getDate()}<div class="bg-selected"><span></span></div>`,
          };
        }
      },
      onSelect: function(fd, d, picker) {
        $(".dropdown-date__range_from").val(fd.split("-")[0]);
        $(".dropdown-date__range_to").val(fd.split("-")[1]);
      },
    });
    $(".datepicker")
      .find(".datepicker--button")
      .click(function() {
        if (this.dataset.action === "today") {
          $(this)
            .parents(".dropdown-date")
            .removeClass("active");
        }
      });
    $(".dropdown-date__range_to").click(function() {
      $(this)
        .parents(".dropdown-date")
        .find(".dropdown-date__range_from")
        .data("datepicker")
        .show();
    });
  });


// Datepicker with two dates for choise with choise section

$(function() {
    $(".filterDate-item").datepicker({
      minDate: new Date(),
      range: true,
      offset: 10,
      multipleDatesSeparator: "-",
      classes: "dropdown-date",
      clearButton: true,
      prevHtml : '<svg><path d="M16.1755 8.01562V9.98438H3.98801L9.56613 15.6094L8.15988 17.0156L0.144258 9L8.15988 0.984375L9.56613 2.39062L3.98801 8.01562H16.1755Z" /></svg>',
      nextHtml : '<svg><path d="M8.36301 0.984375L16.3786 9L8.36301 17.0156L6.95676 15.6094L12.5349 9.98438H0.347383V8.01562H12.5349L6.95676 2.39062L8.36301 0.984375Z" /></svg>',
      todayButton: true,
      navTitles: {
        days: "<h2>MM yyyy</h2>",
      },
      language: {
        today: "Применить",
      },
      onRenderCell: function(date, cellType) {
        if (cellType == "day") {
          return {
            html: `${date.getDate()}<div class="bg-selected"><span></span></div>`,
          };
        }
      },
      onSelect: function(fd, d, picker) {
        $(".dropdown-date__range_from").val(fd.split("-")[0]);
        $(".dropdown-date__range_to").val(fd.split("-")[1]);
      },
    });
    $(".datepicker")
      .find(".datepicker--button")
      .click(function() {
        if (this.dataset.action === "today") {
          $(this)
            .parents(".dropdown-date")
            .removeClass("active");
        }
      });
    $(".dropdown-date__range_to").click(function() {
      $(this)
        .parents(".dropdown-date")
        .find(".dropdown-date__range_from")
        .data("datepicker")
        .show();
    });
  });
