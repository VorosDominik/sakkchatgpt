$(document).ready(function() {
    var tabla = $("#tabla");

    var sorok = 8;
    var oszlopok = 8;

    var babuk = [
        "♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜",
        "♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟",
        "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "",
        "♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙",
        "♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"
    ];

    for (var i = 0; i < sorok; i++) {
        var sorElem = $("<tr></tr>");

        for (var j = 0; j < oszlopok; j++) {
            var cellaElem = $("<td></td>");

            if ((i + j) % 2 === 0) {
                cellaElem.addClass("feher");
            } else {
                cellaElem.addClass("fekete");
            }

            var index = i * oszlopok + j;
            cellaElem.html(babuk[index]);

            // Az eseménykezelő hozzáadása a paraszt bábukhoz
            if (babuk[index] === "♙") {
                cellaElem.on("click", mozgatParaszt);
            }

            sorElem.append(cellaElem);
        }

        tabla.append(sorElem);
    }

    var kijeloltParaszt = null;
    var celMozgatasra = [];

    // A paraszt bábu mozgatását kezelő függvény
    function mozgatParaszt() {
        var cella = $(this);

        // Ha a célmezőre kattintunk, lépjen oda a kijelölt paraszt
        if (celMozgatasra.includes(cella[0])) {
            cella.html(kijeloltParaszt.html());
            kijeloltParaszt.html("");

            // Távolítsa el a kijelölést és a színezést
            kijeloltParaszt.removeClass("kijelolt");
            celMozgatasra.forEach(function(cella) {
                $(cella).removeClass("lepes");
            });

            kijeloltParaszt = null;
            celMozgatasra = [];
            return;
        }

        // Ellenőrizze, hogy van-e már kijelölt paraszt
        if (kijeloltParaszt) {
            // Távolítsa el a kijelölést és a színezést
            kijeloltParaszt.removeClass("kijelolt");
            celMozgatasra.forEach(function(cella) {
                $(cella).removeClass("lepes");
            });

            kijeloltParaszt = null;
            celMozgatasra = [];
        }

        // Ellenőrizze, hogy a kattintott cella egy paraszt bábut tartalmaz-e
        if (cella.html() === "♙") {
            // Jelölje ki a parasztot
            cella.addClass("kijelolt");
            kijeloltParaszt = cella;

            // Ellenőrizze a lehetséges lépéseket és színezzük a célmezőket
            var parasztSor = cella.parent().index();
            var parasztOszlop = cella.index();
            ellenorizLepest(parasztSor, parasztOszlop);
        }
    }

    // Ellenőrzi, hogy az adott paraszt érvényes lépést tesz-e az új célmezőre
function ervenyesParasztLepes(parasztSor, parasztOszlop, celSor, celOszlop) {
    var koztesSor = (parasztSor + celSor) / 2;
    var koztesOszlop = parasztOszlop;
  
    // Ellenőrizze, hogy a célmező a paraszt előtt van-e
    if (celSor === parasztSor - 1 && celOszlop === parasztOszlop) {
      return true;
    }
  
    // Ellenőrizze, hogy a célmező a paraszt előtt van-e, ha a paraszt az induló pozíciójában van
    if (parasztSor === 6 && celSor === parasztSor - 2 && celOszlop === parasztOszlop) {
      // Ellenőrizze, hogy az útvonal üres-e
      var koztesCella = tabla.find("tr").eq(koztesSor).find("td").eq(koztesOszlop);
      if (koztesCella.html() === "") {
        return true;
      }
    }
  
    return false;
  }

    // Ellenőrzi a lehetséges lépéseket és színezi a célmezőket
    function ellenorizLepest(parasztSor, parasztOszlop) {
        var lepesek = [];
        var celSor;
        var celOszlop;

        // Számítsa ki a lehetséges célmezőket
        celSor = parasztSor - 1;
        celOszlop = parasztOszlop;
        if (celSor >= 0 && tabla.find("tr").eq(celSor).find("td").eq(celOszlop).html() === "") {
            lepesek.push([celSor, celOszlop]);
        }

        celSor = parasztSor - 2;
        celOszlop = parasztOszlop;
        var koztesSor = parasztSor - 1;
        var koztesOszlop = parasztOszlop;
        if (parasztSor === 6 && tabla.find("tr").eq(celSor).find("td").eq(celOszlop).html() === "" &&
            tabla.find("tr").eq(koztesSor).find("td").eq(koztesOszlop).html() === "") {
            lepesek.push([celSor, celOszlop]);
        }

        // Színezzük a célmezőket
        lepesek.forEach(function(lepes) {
            var sor = lepes[0];
            var oszlop = lepes[1];
            var celCella = tabla.find("tr").eq(sor).find("td").eq(oszlop);
            celCella.addClass("lepes");
            celMozgatasra.push(celCella[0]);
        });
 // Az eseménykezelő hozzáadása a célmezőkhöz
celMozgatasra.forEach(function(cella) {
    $(cella).on("click", vegrehajtParasztLepes);
  });
  
  // A paraszt lépésének végrehajtása
  function vegrehajtParasztLepes() {
    var celCella = $(this);
    var celSor = celCella.parent().index();
    var celOszlop = celCella.index();
  
    // Ellenőrizze, hogy a célmező érvényes lépés-e
    if (ervenyesParasztLepes(kijeloltParaszt.parent().index(), kijeloltParaszt.index(), celSor, celOszlop)) {
      // Mozgassa a kijelölt parasztot a célmezőre
      celCella.html(kijeloltParaszt.html());
      kijeloltParaszt.html("");
  
      // Távolítsa el a kijelölést és a színezést
      kijeloltParaszt.removeClass("kijelolt");
      celMozgatasra.forEach(function(cella) {
        $(cella).removeClass("lepes");
      });
  
      kijeloltParaszt = null;
      celMozgatasra = [];
    }
  }
  
    }
});
