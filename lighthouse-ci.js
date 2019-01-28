const scoreThreshold = 80;
// load report file path from command argument
const report = require(process.argv[2]);
const categories = Object.values(report.categories);

categories.forEach(category => {
  console.log(`${category.title}: ${category.score * 100}`);
});

process.exitCode = categories.every(
  category => category.score * 100 > scoreThreshold
)
  ? 0
  : 1;
