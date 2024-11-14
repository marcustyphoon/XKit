import assert from "node:assert";
import fs from "node:fs";
import process from "node:process";

assert(process.env.GITHUB_OUTPUT, "This script must be run in a Github action.");

fs.mkdirSync("web-ext-artifacts", { recursive: true });
const getExistingFiles = () => fs.readdirSync("./web-ext-artifacts")
	.filter(filePath => filePath.endsWith(".xpi"));

if (!getExistingFiles().length) {
	await import("./download_xpi.mjs");
}

const file = getExistingFiles()[0];

assert(file, "Could not find XPI file.");

fs.appendFileSync(process.env.GITHUB_OUTPUT, `filepath=web-ext-artifacts/${file}\n`);
fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${file.replace(/^.*-/, "").replace(".xpi", "")}\n`);
