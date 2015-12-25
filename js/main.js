var mainJs = new MainJsClass();

function MainJsClass() {
  var scope = this;

  this.createTable = function () {
    (function () {
      if (sessionStorage.getItem("res")) {
        main()
      } else {
        var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        var xhr = new XHR();

        xhr.open('GET', 'stats.csv', true);

        xhr.onload = function () {
          window.sessionStorage.setItem("res", this.responseText);
          main();
        };

        xhr.onerror = function () {
          alert('Ошибка ' + this.status);
        };

        xhr.send();
      }
    })();

    function constructTable(sortingDate, config) {
      var table = document.createElement("table");
      table.setAttribute("class", "main-table");
      $('.wrap').append(table);
      createTableHead();
      createDataTable(config);

      function createTableHead() {
        var tr = document.createElement("tr");
        tr.setAttribute("class", "table-head");
        for (var j = 0; j < config.length; j++) {
          var td = document.createElement("td");
          var text = document.createTextNode(config[j]);
          td.appendChild(text);
          tr.appendChild(td);
        }
        table.appendChild(tr);

      }

      function createDataTable(config) {

        createDate();


        function createDate() {
          for (var n = 0; n < sortingDate.length; n++) {

            var tr = document.createElement('tr');
            var firstTd = document.createElement("td");
            var secondTd = document.createElement("td");
            var sortCount = sortBy(sortingDate[n], 'country');

            tr.setAttribute("class", "table-date");
            firstTd.appendChild(document.createTextNode(sortingDate[n][0][config[0]]));
            secondTd.setAttribute("colspan", "2");
            tr.appendChild(firstTd);
            tr.appendChild(secondTd);
            table.appendChild(tr);
            createCountry(sortingDate[n]);
            var tempSum = 0;
            var insertSum = 0;

            for (var c = 3; c < config.length; c++) {

              var td = document.createElement("td");
              td.style.textAlign = "right";

              if (config[c] === 'bcpm') {

                for (var d = 0; d < sortCount.length; d++) {

                  tempSum += +((getSum(sortCount[d], config[c]) / sortCount[d].length));
                  insertSum += tempSum;

                }
                td.appendChild(document.createTextNode((tempSum / sortCount.length).toFixed(2)));
              } else {
                td.appendChild(document.createTextNode(getSum(sortingDate[n], config[c])));
              }
              tr.appendChild(td);
            }
          }
        }

        function createCountry(data) {
          var countryTr = document.createElement('tr');
          var countryTd = document.createElement('td');
          var countryTable = document.createElement('table');
          var sortingCountry = sortBy(data, "country");
          countryTable.setAttribute("class", "cont");
          for (var n = 0; n < sortingCountry.length; n++) {
            var insertTr = document.createElement('tr');
            var insertTd = document.createElement('td');
            var firstInsertTd = document.createElement('td');
            var secondInsertTd = document.createElement('td');
            insertTd.style.textAlign = "right";
            insertTd.style.backgroundColor = "#8E9AE2";
            insertTd.style.borderColor = "#8E9AE2";
            secondInsertTd.style.textAlign = "right";
            secondInsertTd.style.backgroundColor = "#8E9AE2";
            secondInsertTd.style.borderColor = "#8E9AE2";
            secondInsertTd.appendChild(document.createTextNode(sortingCountry[n][0][config[1]]));
            insertTr.appendChild(firstInsertTd);
            insertTr.appendChild(secondInsertTd);
            insertTr.appendChild(insertTd);
            insertTr.setAttribute("class", "city");
            for (var i = 3; i < config.length; i++) {
              var tdr = document.createElement("td");
              tdr.style.textAlign = "right";
              tdr.style.borderColor = "#8E9AE2";
              tdr.style.backgroundColor = "#8E9AE2";
              if (config[i] === 'bcpm') {
                tdr.appendChild(document.createTextNode((getSum(sortingCountry[n], config[i]) / sortingCountry[n].length).toFixed(2)));
                insertTr.appendChild(tdr);
              } else {
                tdr.appendChild(document.createTextNode(getSum(sortingCountry[n], config[i])));
              }
              insertTr.appendChild(tdr);
            }


            countryTable.appendChild(insertTr);
            CreateAllData(countryTable, sortingCountry[n]);

          }
          countryTr.setAttribute("class", "table-cont");
          countryTd.setAttribute("colspan", config.length);
          countryTd.appendChild(countryTable);
          countryTr.appendChild(countryTd);
          table.appendChild(countryTr);
        }

        function CreateAllData(countryTable, newdate) {
          var dataTr = document.createElement("tr");
          var dataTd = document.createElement("td");
          var dataTable = document.createElement("table");
          dataTr.setAttribute("class", "city-cont");

          for (var f = 0; f < newdate.length; f++) {
            var tre = document.createElement("tr");
            var tde1 = document.createElement("td");
            var tde2 = document.createElement("td");
            tre.appendChild(tde1);
            tre.appendChild(tde2);
            dataTable.appendChild(tre);

            for (var d = 2; d < config.length; d++) {
              var tde = document.createElement("td");
              if (d === 2) {
                tde.style.textAlign = "left";
              } else {
                tde.style.textAlign = "right";
              }
              tde.appendChild(document.createTextNode(newdate[f][config[d]]));
              tre.appendChild(tde);
              dataTable.appendChild(tre);
            }
          }


          dataTd.setAttribute("colspan", config.length);
          dataTd.appendChild(dataTable);
          dataTr.appendChild(dataTd);


          countryTable.appendChild(dataTr);
        }

      }

    }

    function sortBy(obj, elem) {

      var newArr = obj.sort(function (obj1, obj2) {
        if (obj1[elem] < obj2[elem]) return -1;
        if (obj1[elem] > obj2[elem]) return 1;
        return 0;
      });
      var tempArr = [];
      var sortingArr = [];
      for (var i = 0, len = newArr.length; i < len; i++) {

        var tempData = newArr[i][elem];
        tempArr.push(newArr[i]);
        if (newArr[i + 1]) {
          if (!(tempData === newArr[i + 1][elem])) {
            sortingArr.push(tempArr);
            tempArr = [];
            tempData = newArr[i + 1][elem];
          }
          }
         else {
          sortingArr.push(tempArr);
        }

      }
      return sortingArr;
    }

    function getSum(data, name) {
      var sum = 0;
      for (var p = 0; p < data.length; p++) {
        sum += +data[p][name];
      }
      return sum.toFixed(2);
    }

    function csvTojs(csv) {
      var lines = csv.split("\n");
      var result = [];
      var headers = lines[0].split(",");

      for (var i = 1; i < lines.length; i++) {
        var obj = {};

        var row = lines[i],
          queryIdx = 0,
          startValueIdx = 0,
          idx = 0;

        if (row.trim() === '') {
          continue;
        }

        while (idx < row.length) {
          /* if we meet a double quote we skip until the next one */
          var c = row[idx];

          if (c === '"') {
            do {
              c = row[++idx];
            } while (c !== '"' && idx < row.length - 1);
          }

          if (c === ',' || /* handle end of line with no comma */ idx === row.length - 1) {
            /* we've got a value */
            var value = row.substr(startValueIdx, idx - startValueIdx).trim();

            /* skip first double quote */
            if (value[0] === '"') {
              value = value.substr(1);
            }
            /* skip last comma */
            if (value[value.length - 1] === ',') {
              value = value.substr(0, value.length - 1);
            }
            /* skip last double quote */
            if (value[value.length - 1] === '"') {
              value = value.substr(0, value.length - 1);
            }

            var key = headers[queryIdx++];
            obj[key] = value;
            startValueIdx = idx + 1;
          }

          ++idx;
        }

        result.push(obj);
      }
      return result;
    }

    function main() {

      var workData = window.sessionStorage.getItem("res");
      var jsonObj = csvTojs(workData);
      var sortingDate = sortBy(jsonObj, "date");
      var config = ["date", "country", "carrier", "views", 'bcpm', "sent", "earned", "leads"];

      constructTable(sortingDate, config);
    }
  };

  this.toggleData = function () {

    $(document).on('click', ".table-date", function () {
      $(this).next(".table-cont").find(".city").slideToggle(0).next(".city-cont").css("display", "none");
    });
    $(document).on('click', ".city", function () {
      $(this).next(".city-cont").slideToggle(0);
    });
  };

  $(function () {
    scope.toggleData();
    scope.createTable();
  });
}