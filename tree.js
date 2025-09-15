const fs = require("fs").promises;
const path = require("path");

async function getDirectoryItems(dirPath) {
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    return items
      .filter((item) => !item.name.startsWith("."))
      .sort((firstItem, secondItem) => {
        if (firstItem.isDirectory() !== secondItem.isDirectory()) {
          return firstItem.isDirectory() ? -1 : 1;
        }
        return firstItem.name.localeCompare(secondItem.name);
      });
  } catch (error) {
    throw new Error(dirPath);
  }
}

async function buildFileTree(
  currentPath,
  maxDepth,
  currentDepth = 0,
  prefix = "",
  isLast = true
) {
  const output = [];
  let dirsCount = 0;
  let filesCount = 0;

  try {
    const name =
      currentDepth === 0
        ? path.resolve(currentPath)
        : path.basename(currentPath);
    const linePrefix = currentDepth === 0 ? "" : prefix;
    const connector = isLast ? "└── " : "├── ";
    output.push(`${linePrefix}${connector}${name}`);

    const isDepthLimited = maxDepth !== -1;
    if (isDepthLimited && currentDepth >= maxDepth) {
      return { output, dirsCount, filesCount };
    }

    const items = await getDirectoryItems(currentPath);
    const newPrefix = prefix + (isLast ? "    " : "│   ");

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemPath = path.join(currentPath, item.name);
      const itemIsLast = i === items.length - 1;

      if (item.isDirectory()) {
        dirsCount = dirsCount + 1;

        const result = await buildFileTree(
          itemPath,
          maxDepth,
          currentDepth + 1,
          newPrefix,
          itemIsLast
        );
        output.push(...result.output);

        dirsCount = dirsCount + result.dirsCount;
        filesCount = filesCount + result.filesCount;
      } else {
        filesCount = filesCount + 1;
        const itemConnector = itemIsLast ? "└── " : "├── ";
        output.push(`${newPrefix}${itemConnector}${item.name}`);
      }
    }
  } catch (error) {
    output.push(`${prefix}└── [${error.message}]`);
  }

  return { output, dirsCount, filesCount };
}

function getDepthValue(args) {
  const depthArgIndex = args.findIndex(
    (arg) => arg === "--depth" || arg === "-d"
  );

  if (depthArgIndex === -1) {
    console.error(
      "Необходимо указать глубину вложенности с помощью аргумента --depth или -d"
    );
    process.exit(1);
  }

  if (depthArgIndex === args.length - 1) {
    console.error("После флага --depth или -d необходимо указать глубину");
    process.exit(1);
  }
  const depthValue = parseInt(args[depthArgIndex + 1]);

  return depthValue;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Необходимо указать путь к папке");
    process.exit(1);
  }

  const targetPath = args[0];
  const maxDepth = getDepthValue(args);

  try {
    const { output, dirsCount, filesCount } = await buildFileTree(
      targetPath,
      maxDepth
    );
    console.log(output.join("\n"));
    console.log(`\n${dirsCount} папок, ${filesCount} файлов`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
