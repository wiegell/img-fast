"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tsExifParser = require("ts-exif-parser");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var thumb = /*#__PURE__*/function () {
  function thumb() {
    var _this = this;

    _classCallCheck(this, thumb);

    _defineProperty(this, "xhr", new XMLHttpRequest());

    _defineProperty(this, "parser", void 0);

    _defineProperty(this, "data", void 0);

    this.xhr.open('GET', './test.jpg', true);
    this.xhr.setRequestHeader('Range', 'bytes=100-200'); // the bytes (incl.) you request

    this.xhr.responseType = "arraybuffer";

    this.xhr.onload = function () {
      var arrayBuffer = _this.xhr.response;

      if (arrayBuffer) {
        _this.parser = _tsExifParser.ExifParserFactory.create(arrayBuffer);
        _this.data = _tsExifParser.ExifParserFactory.create(arrayBuffer).parse();
      }
    };

    this.xhr.send(null);
  }

  _createClass(thumb, [{
    key: "getExifData",
    value: function getExifData() {
      if (this.data instanceof _tsExifParser.ExifData) {
        return this.data;
      } else {
        throw console.error("no data loaded");
      }
    }
  }]);

  return thumb;
}();

exports["default"] = thumb;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZ2V0LXRodW1iLnRzIl0sIm5hbWVzIjpbInRodW1iIiwiWE1MSHR0cFJlcXVlc3QiLCJ4aHIiLCJvcGVuIiwic2V0UmVxdWVzdEhlYWRlciIsInJlc3BvbnNlVHlwZSIsIm9ubG9hZCIsImFycmF5QnVmZmVyIiwicmVzcG9uc2UiLCJwYXJzZXIiLCJFeGlmUGFyc2VyRmFjdG9yeSIsImNyZWF0ZSIsImRhdGEiLCJwYXJzZSIsInNlbmQiLCJFeGlmRGF0YSIsImNvbnNvbGUiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7Ozs7O0lBR3FCQSxLO0FBS2pCLG1CQUFjO0FBQUE7O0FBQUE7O0FBQUEsaUNBSkEsSUFBSUMsY0FBSixFQUlBOztBQUFBOztBQUFBOztBQUNWLFNBQUtDLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLEtBQWQsRUFBcUIsWUFBckIsRUFBbUMsSUFBbkM7QUFDQSxTQUFLRCxHQUFMLENBQVNFLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLGVBQW5DLEVBRlUsQ0FFMkM7O0FBQ3JELFNBQUtGLEdBQUwsQ0FBU0csWUFBVCxHQUF3QixhQUF4Qjs7QUFDQSxTQUFLSCxHQUFMLENBQVNJLE1BQVQsR0FBa0IsWUFBTTtBQUNwQixVQUFJQyxXQUFXLEdBQUcsS0FBSSxDQUFDTCxHQUFMLENBQVNNLFFBQTNCOztBQUNBLFVBQUlELFdBQUosRUFBaUI7QUFDYixRQUFBLEtBQUksQ0FBQ0UsTUFBTCxHQUFjQyxnQ0FBa0JDLE1BQWxCLENBQXlCSixXQUF6QixDQUFkO0FBQ0EsUUFBQSxLQUFJLENBQUNLLElBQUwsR0FBWUYsZ0NBQWtCQyxNQUFsQixDQUF5QkosV0FBekIsRUFBc0NNLEtBQXRDLEVBQVo7QUFDSDtBQUNKLEtBTkQ7O0FBT0EsU0FBS1gsR0FBTCxDQUFTWSxJQUFULENBQWMsSUFBZDtBQUNIOzs7O2tDQUU4QjtBQUMzQixVQUFJLEtBQUtGLElBQUwsWUFBcUJHLHNCQUF6QixFQUFtQztBQUMvQixlQUFPLEtBQUtILElBQVo7QUFDSCxPQUZELE1BRU87QUFDSCxjQUFNSSxPQUFPLENBQUNDLEtBQVIsQ0FBYyxnQkFBZCxDQUFOO0FBQ0g7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV4aWZQYXJzZXJGYWN0b3J5LCBFeGlmRGF0YSB9IGZyb20gJ3RzLWV4aWYtcGFyc2VyJztcbmltcG9ydCB7IEV4aWZQYXJzZXIgfSBmcm9tICd0cy1leGlmLXBhcnNlci9saWIvRXhpZlBhcnNlcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgdGh1bWIge1xuICAgIHByaXZhdGUgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xuICAgIHByaXZhdGUgcGFyc2VyOiBFeGlmUGFyc2VyIHwgdW5kZWZpbmVkO1xuICAgIHByaXZhdGUgZGF0YTogRXhpZkRhdGEgfCB1bmRlZmluZWQ7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy54aHIub3BlbignR0VUJywgJy4vdGVzdC5qcGcnLCB0cnVlKTtcbiAgICAgICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcignUmFuZ2UnLCAnYnl0ZXM9MTAwLTIwMCcpOyAvLyB0aGUgYnl0ZXMgKGluY2wuKSB5b3UgcmVxdWVzdFxuICAgICAgICB0aGlzLnhoci5yZXNwb25zZVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG4gICAgICAgIHRoaXMueGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGxldCBhcnJheUJ1ZmZlciA9IHRoaXMueGhyLnJlc3BvbnNlO1xuICAgICAgICAgICAgaWYgKGFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZXIgPSBFeGlmUGFyc2VyRmFjdG9yeS5jcmVhdGUoYXJyYXlCdWZmZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IEV4aWZQYXJzZXJGYWN0b3J5LmNyZWF0ZShhcnJheUJ1ZmZlcikucGFyc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnhoci5zZW5kKG51bGwpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRFeGlmRGF0YSgpOiBFeGlmRGF0YSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGEgaW5zdGFuY2VvZiBFeGlmRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGNvbnNvbGUuZXJyb3IoXCJubyBkYXRhIGxvYWRlZFwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4iXX0=