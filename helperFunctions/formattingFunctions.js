"use strict";
exports.__esModule = true;
exports.formatResponsesPostgresql = exports.formatDatePostgresql = void 0;
/**
 * turns a date into YYYY-MM-DD so that postgres is happy
 * @param {Date} date - just a date
 */
function formatDatePostgresql(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return "".concat(year, "-").concat(String(month).padStart(2, "0"), "-").concat(String(day).padStart(2, "0"));
}
exports.formatDatePostgresql = formatDatePostgresql;
/**
 * turns an array of Response[] objects into a string in order to be
 * put into a query so we can add tickets to database
 * @param {Response[]} responses - array of responses for a specific ticket
 */
function formatResponsesPostgresql(responses) {
    var output = "{";
    for (var _i = 0, responses_1 = responses; _i < responses_1.length; _i++) {
        var response = responses_1[_i];
        output += "{";
        output += "\"".concat(response.utility_name, "\",");
        output += "\"".concat(response.utility_type, "\",");
        output += "\"".concat(response.response, "\",");
        output += "\"".concat(response.contact, "\",");
        output += "\"".concat(response.alternate_contact, "\",");
        output += "\"".concat(response.emergency_contact, "\",");
        output += "\"".concat(response.notes, "\"},");
    }
    output = output.slice(0, -1);
    output += "}";
    console.log('\n\n----');
    console.log(output);
    console.log('\n\n----');
    return output;
}
exports.formatResponsesPostgresql = formatResponsesPostgresql;
