/**
 * turns a date into YYYY-MM-DD so that postgres is happy
 * @param {Date} date - just a date
 */
export function formatDatePostgresql(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
/**
 * turns an array of Response[] objects into a string in order to be
 * put into a query so we can add tickets to database
 * @param {Response[]} responses - array of responses for a specific ticket
 */
export function formatResponsesPostgresql(responses) {
    let output = "{";
    for (const response of responses) {
        output += `{`;
        output += `"${response.utility_name}",`;
        output += `"${response.utility_type}",`;
        output += `"${response.response}",`;
        output += `"${response.contact}",`;
        output += `"${response.alternate_contact}",`;
        output += `"${response.emergency_contact}",`;
        output += `"${response.notes}"},`;
    }
    output = output.slice(0, -1);
    output += `}`;
    console.log('\n\n----');
    console.log(output);
    console.log('\n\n----');
    return output;
}
