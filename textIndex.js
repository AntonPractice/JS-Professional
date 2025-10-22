const { createReadStream, createWriteStream } = require("fs");
const path = require("path");
function processTextFile(inputFile, outputFile) {
  return new Promise((resolve, reject) => {
    const wordCounts = {};
    let fileContent = "";

    const readStream = createReadStream(inputFile, {
      encoding: "utf8",
    });

    const writeStream = createWriteStream(outputFile, {
      encoding: "utf8",
    });

    readStream.on("data", (chunk) => {
      fileContent += chunk;
    });

    readStream.on("end", () => {
      const words = fileContent
        .toLowerCase()
        .split(/[\s,\n\r\t\.!?;:()\[\]{}"']+/)
        .filter((word) => word.length > 0);

      words.forEach((word) => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });

      const sortedWords = Object.keys(wordCounts).sort();
      const frequencyVector = sortedWords.map((word) => wordCounts[word]);

      writeStream.write(JSON.stringify(frequencyVector));
      writeStream.end();
    });

    writeStream.on("finish", () => {
      resolve();
    });
  });
}

async function main() {
  const args = process.argv.slice(2);

  const inputFile = args[0];
  const inputFileName = path.basename(inputFile, path.extname(inputFile));
  const outputFile = `result${inputFileName}.txt`;

  try {
    await processTextFile(inputFile, outputFile);
    console.log("Готово");
  } catch (error) {
    console.error("Ошибка:", error);
    process.exit(1);
  }
}

main();
/*node textIndex.js texts/text1.txt*/
