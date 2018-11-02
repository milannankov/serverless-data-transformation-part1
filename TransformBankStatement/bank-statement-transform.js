const moment = require('moment');

const columnIndices = {
    "datetime": 0,
    "amount": 2,
    "dtkt": 3,
    "reference": 1,
    "transactionName": 4,
}

function transformStatement(bankStatement) {
    let newLines = bankStatement
        .split("\n")
        .slice(1)
        .filter(line => line != "")
        .map(line => transformStatementLine(line));

    let transformedStatement = createHeader() + newLines.join("\n"); 

    return transformedStatement;
}

function transformStatementLine(line) {
    let columns = line.split(",");
    let dateTime = parseDateTime(columns[columnIndices.datetime]);
    let debitCredit = columns[columnIndices.dtkt];
    let amount = parseFloat(columns[columnIndices.amount]);
    let amountSigned = debitCredit.toLowerCase() == "d" ? amount * -1.0 : amount;
    let transactionName = columns[columnIndices.transactionName];
    let reference = columns[columnIndices.reference];

    let newLine = [
        dateTime.format("YYYY-MM-DD"),
        amountSigned,
        reference,
        transactionName
    ].join(",");

    return newLine;
}

function parseDateTime(dateTime) {
    var datePart = dateTime.split(" ")[0];
    return moment(datePart, "DD/MM/YYYY");
}

function createHeader() {
    return "date,amount_signed,reference,details\n";
}

module.exports = transformStatement;