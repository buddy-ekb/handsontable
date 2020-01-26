/**
 * SheetClip - Spreadsheet Clipboard Parser
 * version 0.2-rewritten
 *
 * This tiny library transforms JavaScript arrays to strings that are pasteable by LibreOffice, OpenOffice,
 * Google Docs and Microsoft Excel.
 *
 * Somehow based on original version 0.2 by Marcin Warpechowski along with StackOverflow Q&A.
 * Licensed under the MIT license.
 */
/*jslint white: true*/
(function (global) {
  "use strict";

  function countQuotes(str) {
    return str.split('"').length - 1;
  }

  var SheetClip = {
    /**
     * Decode spreadsheet string into array
     *
     * @param {String} str
     * @returns {Array}
     */
    parse: function (str) {
      var l = str.length,
          arr = [],
          newRow = true,
          newCell,
          dataQuoted,
          r,
          c;
      for (var i = 0; i < l; i++) {
        if (newRow) {
          arr.push([]);
          r = arr.length - 1;
          newRow = false;
          newCell = true;
        }
        if (newCell) {
          arr[r].push('');
          c = arr[r].length - 1;
          newCell = false;
          dataQuoted = str[i] == '"';
          if (dataQuoted) {
            i++;
          }
        }
        for (var j = i; j < l + 1; j++) {
          if (dataQuoted && j < l) {
            if (str[j] != '"') {
              continue;
            }
            j++;
            if (str[j] == '"') {
              arr[r][c] += str.slice(i, j - 1);
              i = j;
              continue;
            }
          }
          if (j == l || str[j] == "\t" || str[j] == "\n") {
            newCell = str[j] == "\t";
            newRow = str[j] == "\n";
            arr[r][c] += str.slice(i, j - +(dataQuoted));
            i = j;
            break;
          }
        }
      }
      return arr;
    },

    /**
     * Encode array into valid spreadsheet string
     *
     * @param arr
     * @returns {String}
     */
    stringify: function (arr) {
      var r,
          rLen,
          c,
          cLen,
          str = '',
          val;
      for (r = 0, rLen = arr.length; r < rLen; r += 1) {
        cLen = arr[r].length;
        for (c = 0; c < cLen; c += 1) {
          if (c > 0) {
            str += '\t';
          }
          val = arr[r][c];
          if (val === null || val === void 0) {
            str += '';
          } else {
            val += '';
            if (val.length > 0 && (val[0] == '"' || val.indexOf('\t') > -1 || val.indexOf('\n') > -1)) {
              str += '"' + val.replace(/"/g, '""') + '"';
            } else {
              str += val;
            }
          }
        }
        str += '\n';
      }
      return str;
    }
  };

  if (typeof exports !== 'undefined') {
    exports.parse = SheetClip.parse;
    exports.stringify = SheetClip.stringify;
  } else {
    global.SheetClip = SheetClip;
  }
}(window));
