var editedData = [];

document.getElementById("file").addEventListener("change", function (e) {
  var file = e.target.files[0];

  if (file && file.type === "text/csv") {
    var reader = new FileReader();
    reader.onload = function (e) {
      var contents = e.target.result;
      var lines = contents.split("\n");

      var csvData = [];
      for (var i = 0; i < lines.length; i++) {
        var cells = lines[i].split(",");
        csvData.push(cells);
      }

      editedData = csvData.slice(); // Make a copy of the original CSV data

      var csvTable = createCsvTable(editedData);
      var csvDataElement = document.getElementById("csv-data");
      csvDataElement.innerHTML = "";
      csvDataElement.appendChild(csvTable);

      document.getElementById("save-button").disabled = false; // Enable save button
    };

    reader.readAsText(file);
  } else {
    UIkit.modal(document.querySelector("#error-modal")).show();
  }
});

var csvDataElement = document.getElementById("csv-data");

function createCsvTable(data) {
  var table = document.createElement("table");
  table.classList.add(
    "uk-table",
    "uk-table-striped",
    "uk-table-hover",
    "uk-border-rounded"
  );
  table.style.borderRadius = "8px";

  var maxColumns = getMaxColumns(data);

  for (var i = 0; i < data.length; i++) {
    var row = document.createElement("tr");

    for (var j = 0; j < maxColumns; j++) {
      var cell = document.createElement(i === 0 ? "th" : "td");

      if (data[i] && j < data[i].length) {
        cell.textContent = data[i][j];
      } else {
        cell.textContent = ""; // Empty entry for additional cells
      }

      cell.classList.add("editable", "uk-card", "uk-card-hover", "uk-light");
      cell.style.backgroundColor = "#696969";

      if (i === 0) {
        cell.style.color = "#ccd2cc"; // Set font color for the first row
      }

      cell.style.borderRight = "1px solid #ccc";
      cell.addEventListener("click", function () {
        if (this.contentEditable !== "true") {
          this.contentEditable = true;
          this.focus();
          this.classList.add("uk-form-blank");
        }
      });
      cell.addEventListener("blur", function () {
        this.contentEditable = false;
        this.classList.remove("uk-form-blank");
        var rowIndex = this.parentNode.rowIndex;
        var cellIndex = this.cellIndex;
        editedData[rowIndex][cellIndex] = this.textContent;
      });
      row.appendChild(cell);
    }

    table.appendChild(row);
  }
  document.getElementById("row-column-add").style.display = "block";
  return table;
}

function getMaxColumns(data) {
  var maxColumns = 0;
  for (var i = 0; i < data.length; i++) {
    maxColumns = Math.max(maxColumns, data[i].length);
  }
  return maxColumns;
}
document.getElementById("save-button").addEventListener("click", function () {
  var csvContent = editedData
    .map(function (row) {
      return row.join(",");
    })
    .join("\n");

  var fileName = document
    .getElementById("file")
    .files[0].name.replace(".csv", "_edited.csv");
  var blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, fileName);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
});
function addRow() {
  var table = document.querySelector("#csv-data table");
  var newRow = document.createElement("tr");

  var numColumns = getMaxColumns(editedData);
  for (var i = 0; i < numColumns; i++) {
    var cell = document.createElement("td");
    cell.textContent = "";
    cell.classList.add("editable", "uk-card", "uk-card-hover", "uk-light");
    cell.style.backgroundColor = "#696969";
    cell.style.borderRight = "1px solid #ccc";
    cell.addEventListener("click", function () {
      if (this.contentEditable !== "true") {
        this.contentEditable = true;
        this.focus();
        this.classList.add("uk-form-blank");
      }
    });
    cell.addEventListener("blur", function () {
      this.contentEditable = false;
      this.classList.remove("uk-form-blank");
      var rowIndex = this.parentNode.rowIndex;
      var cellIndex = this.cellIndex;
      editedData[rowIndex][cellIndex] = this.textContent;
    });
    newRow.appendChild(cell);
  }

  table.appendChild(newRow);
}

function addColumn() {
  var table = document.querySelector("#csv-data table");

  var rows = table.getElementsByTagName("tr");
  for (var i = 0; i < rows.length; i++) {
    var cell = document.createElement(i === 0 ? "th" : "td");
    cell.textContent = "";
    cell.classList.add("editable", "uk-card", "uk-card-hover", "uk-light");
    cell.style.backgroundColor = "#696969";
    cell.style.borderRight = "1px solid #ccc";
    cell.addEventListener("click", function () {
      if (this.contentEditable !== "true") {
        this.contentEditable = true;
        this.focus();
        this.classList.add("uk-form-blank");
      }
    });
    cell.addEventListener("blur", function () {
      this.contentEditable = false;
      this.classList.remove("uk-form-blank");
      var rowIndex = this.parentNode.rowIndex;
      var cellIndex = this.cellIndex;
      editedData[rowIndex][cellIndex] = this.textContent;
    });

    var lastCell = rows[i].lastElementChild;
    rows[i].insertBefore(cell, lastCell);
  }
}

document.getElementById("push-button").addEventListener("click", function () {
  var csvContent = editedData
    .map(function (row) {
      return row.join(",");
    })
    .join("\n");

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/parse-csv", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // CSV parsing and processing completed successfully
        console.log(xhr.responseText);
        alert("CSV parsing and processing completed successfully.");
      } else {
        // Handle errors if necessary
        console.error("Error:", xhr.status, xhr.responseText);
        alert("An error occurred while parsing the CSV.");
      }
    }
  };
  xhr.send(JSON.stringify({ editedData: editedData }));
});
document.getElementById("add-row-button").addEventListener("click", addRow);
document
  .getElementById("add-column-button")
  .addEventListener("click", addColumn);
