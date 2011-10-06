/* 
 * HTML5 WebWorker version of @bennadel's CSV parsing snippet:
 * http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data/1293163#1293163
 */

self.addEventListener('message', function(e) {
  var d = e.data,
      csv = d.csv,                                     // CSV data to parse
      len = csv.length,
      delimiter = d.delimiter || ',',                  // delimiter character with default value
      
      // regular expression to parse the CSV values
      pattern = new RegExp(
        "(\\" + delimiter + "|\\r?\\n|\\r|^)" +             // delimiters
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +                 // quoted fields
        "([^\"\\" + delimiter + "\\r\\n]*))"                // standard fields
      , "gi"),
      
      matched_delimiter = 
      matched_value = 
      matches = undefined, 
      row = [];                                             // the last row read
  
  while (matches = pattern.exec(csv)) {
    matched_delimiter = matches[1];
    if (matched_delimiter.length && matched_delimiter !== delimiter) {
      if (row) {
        self.postMessage({
          'event': 'progress',
          'row': row,
          'index': matches.index
        });
      }
      row = [];
    }
    if (matches[2]) {
      matched_value = matches[2].replace(new RegExp("\"\"", "g"), "\"");
    } else {
      matched_value = matches[3];
    }
    row.push(matched_value);
  }
  self.postMessage({
    event: 'close'
  });
  self.close();
}, false);
