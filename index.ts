const DIGITS =
	"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");

function assertEq(left: unknown, right: unknown) {
	if (left !== right) throw new Error(`${left} ≠ ${right}`);
}

export function validateNumber(num: string, base: number) {
	if (num.length === 0) throw new Error("Empty input");
	if (typeof base === "number" && (base < 2 || base > 64))
		throw new Error(`Invalid base: ${base}`);
	let decimalPos = -1;

	for (let i = 0; i < num.length; i++) {
		const digit = num[i];

		if (digit === "," || digit === ".") {
			if (decimalPos !== -1) throw new Error("Multiple decimal points found");
			decimalPos = i;
			continue;
		}

		const val = parseDigit(digit);
		if (typeof base === "number" && val >= base)
			throw new Error(
				`Digit not valid in specified base. \n\tDigit: ${digit} (${val}) \n\tBase: ${base}`,
			);
	}

	if (decimalPos === num.length - 1)
		throw new Error("Decimal point in end of number");
}

export function parseNumberFromBase(num: string, base: number): number {
	validateNumber(num, base);

	let result = 0;
	const decimalPos = num.search(/[,\.]/);
	let exponent = decimalPos === -1 ? num.length - 1 : decimalPos - 1;

	for (let i = 0; i < num.length; i++) {
		const digit = num[i];

		if (digit === "," || digit === ".") continue;

		const value = parseDigit(digit);
		result += base ** exponent * value;
		exponent--;
	}

	return result;
}

export function parseDigit(digit: string): number {
	if (digit.length !== 1) throw new Error("Digit length must be 1");

	const value = DIGITS.indexOf(digit);
	if (value === -1) throw new Error(`Invalid digit: ${digit}`);
	return value;
}

export function printNumberInBase(num: number, base: number): void {}

function main() {
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

	console.log(parseNumberFromBase("010", 64));
	console.log(parseNumberFromBase("a", 64));
	console.log(parseNumberFromBase("z", 64));
	console.log(parseNumberFromBase("A", 64));
	console.log(parseNumberFromBase("Z", 64));
	console.log(parseNumberFromBase("+", 64));
	console.log(parseNumberFromBase("/", 64));
	console.log(parseNumberFromBase("09azAZ+/", 64));
}

main();
