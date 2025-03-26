import readline from "node:readline/promises";

export const DIGITS =
	"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";

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
	let i = 0;
	while (i < num.length) {
		const digit = num[i];

		if (digit === "." || digit === ",") {
			i++;
			break;
		}

		const value = parseDigit(digit);
		result *= base;
		result += value;

		i++;
	}

	let exponent = -1;
	while (i < num.length) {
		const digit = num[i];
		const value = parseDigit(digit);
		result += base ** exponent * value;

		exponent--;
		i++;
	}

	return result;
}

export function parseDigit(digit: string): number {
	if (digit.length !== 1) throw new Error("Digit length must be 1");

	const value = DIGITS.indexOf(digit);
	if (value === -1) throw new Error(`Invalid digit: ${digit}`);
	return value;
}

export function getNumberInBase(num: number, base: number): string {
	let int = Math.floor(num);
	let frac = num - int;

	// Integer part
	const digits: string[] = [];
	while (int >= 1) {
		const lsd = int % base;
		digits.unshift(DIGITS[lsd]);
		int -= lsd;
		int /= base;
	}

	// Fractional part
	const decimals: string[] = [];
	while (frac !== 0) {
		frac *= base;
		const val = Math.floor(frac);
		frac -= val;
		decimals.push(DIGITS[val]);
	}

	const numberPart = digits.join("") || "0";
	const decimalPart = decimals.length ? `.${decimals.join("")}` : "";
	return numberPart + decimalPart;
}

async function main() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const inputBase = parseNumberFromBase(await rl.question("Input base: "), 10);
	const inputNumber = parseNumberFromBase(
		await rl.question("Input number: "),
		inputBase,
	);
	const outputBase = parseNumberFromBase(
		await rl.question("Output base: "),
		10,
	);

	const outputNumber = getNumberInBase(inputNumber, outputBase);
	console.log(outputNumber);
	process.exit(0);
}

if (import.meta.url === `file:///${process.argv[1].replaceAll("\\", "/")}`) {
	main();
}
