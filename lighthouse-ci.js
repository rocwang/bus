const fs = require("fs");

const scoreThreshold = {
  performance: 50,
  accessibility: 80,
  "best-practices": 80,
  seo: 80,
  pwa: 80
};

// load report file path from command argument
const report = JSON.parse(fs.readFileSync(process.argv[2]).toString("utf8"));
const categories = Object.values(report.categories);

categories.forEach(category => {
  console.log(`${category.title}: ${category.score * 100}`);
});

process.exitCode = categories.every(
  category => category.score * 100 > scoreThreshold[category.id]
)
  ? 0
  : 1;
