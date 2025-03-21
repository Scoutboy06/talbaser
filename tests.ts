import { getNumberInBase, parseNumberFromBase } from ".";

function assertEq<T>(left: T, right: T) {
	if (left !== right) throw new Error(`${left} ≠ ${right}`);
}

function testParsing() {
	assertEq(parseNumberFromBase("0", 2), 0);
	assertEq(parseNumberFromBase("1", 2), 1);
	assertEq(parseNumberFromBase("10", 2), 2);
	assertEq(parseNumberFromBase("11", 2), 3);
	assertEq(parseNumberFromBase("00000010", 2), 2);
	assertEq(parseNumberFromBase("01000111", 2), 71);
	assertEq(parseNumberFromBase("0.0", 2), 0);
	assertEq(parseNumberFromBase("0.1", 2), 0.5);
	assertEq(parseNumberFromBase("1.0", 2), 1);
	assertEq(parseNumberFromBase("1.1", 2), 1.5);
	assertEq(parseNumberFromBase("10.0", 2), 2);
	assertEq(parseNumberFromBase("10.1", 2), 2.5);
	assertEq(parseNumberFromBase("10.01", 2), 2.25);
	assertEq(parseNumberFromBase("10.10", 2), 2.5);
	assertEq(parseNumberFromBase("10.11", 2), 2.75);
	assertEq(parseNumberFromBase("00000010.111", 2), 2.875);

	assertEq(
		parseNumberFromBase("22,2", 3),
		2 * 3 ** 1 + 2 * 3 ** 0 + 2 * 3 ** -1,
	);

	assertEq(parseNumberFromBase("0", 10), 0);
	assertEq(parseNumberFromBase("9", 10), 9);
	assertEq(parseNumberFromBase("10", 10), 10);
	assertEq(parseNumberFromBase("19", 10), 19);
	assertEq(parseNumberFromBase("100", 10), 100);
	assertEq(parseNumberFromBase("501", 10), 501);
	assertEq(parseNumberFromBase("501,1", 10), 501.1);
	assertEq(parseNumberFromBase("501,5", 10), 501.5);
	assertEq(parseNumberFromBase("501,95", 10), 501.95);

	assertEq(parseNumberFromBase("0", 16), 0);
	assertEq(parseNumberFromBase("9", 16), 9);
	assertEq(parseNumberFromBase("a", 16), 10);
	assertEq(parseNumberFromBase("f", 16), 15);
	assertEq(parseNumberFromBase("000", 16), 0);
	assertEq(parseNumberFromBase("ff", 16), 255);

	assertEq(parseNumberFromBase("010", 64), 64);
	assertEq(parseNumberFromBase("a", 64), 10);
	assertEq(parseNumberFromBase("z", 64), 35);
	assertEq(parseNumberFromBase("A", 64), 36);
	assertEq(parseNumberFromBase("Z", 64), 61);
	assertEq(parseNumberFromBase("+", 64), 62);
	assertEq(parseNumberFromBase("/", 64), 63);
	assertEq(
		parseNumberFromBase("90azAZ+/,5H", 64),
		9 * 64 ** 7 + // 9
			0 * 64 ** 6 + // 0
			10 * 64 ** 5 + // a
			35 * 64 ** 4 + // z
			36 * 64 ** 3 + // A
			61 * 64 ** 2 + // Z
			62 * 64 ** 1 + // +
			63 * 64 ** 0 + // /
			5 * 64 ** -1 + // 5
			43 * 64 ** -2, // H
	);
}

function testPrinting() {
	assertEq(getNumberInBase(0, 2), "0");
	assertEq(getNumberInBase(1, 2), "1");
	assertEq(getNumberInBase(2, 2), "10");
	assertEq(getNumberInBase(4, 2), "100");
	assertEq(getNumberInBase(8, 2), "1000");
	assertEq(getNumberInBase(255, 2), "11111111");
	assertEq(getNumberInBase(256, 2), "100000000");
	assertEq(getNumberInBase(255.5, 2), "11111111.1");

	assertEq(getNumberInBase(0, 10), "0");
	assertEq(getNumberInBase(15, 10), "15");
	assertEq(getNumberInBase(16, 10), "16");
	assertEq(getNumberInBase(255, 10), "255");
	assertEq(getNumberInBase(255.5, 10), "255.5");
	assertEq(getNumberInBase(256, 10), "256");
	assertEq(getNumberInBase(256.5, 10), "256.5");

	assertEq(getNumberInBase(0, 16), "0");
	assertEq(getNumberInBase(15, 16), "f");
	assertEq(getNumberInBase(16, 16), "10");
	assertEq(getNumberInBase(255, 16), "ff");
	assertEq(getNumberInBase(255.5, 16), "ff.8");
	assertEq(getNumberInBase(256, 16), "100");

	assertEq(getNumberInBase(0, 64), "0");
	assertEq(getNumberInBase(15, 64), "f");
	assertEq(getNumberInBase(16, 64), "g");
	assertEq(getNumberInBase(255, 64), "3/");
	assertEq(getNumberInBase(255.5, 64), "3/.w");
	assertEq(getNumberInBase(256, 64), "40");
	assertEq(getNumberInBase(256.5, 64), "40.w");
}

try {
	testParsing();
	testPrinting();
	console.log("Tests ran successfully");
} catch (err) {
	console.error(err);
	process.exit(1);
}
