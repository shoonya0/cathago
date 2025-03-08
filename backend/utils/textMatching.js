const levenshtein = (a, b) => {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (a[j - 1] === b[i - 1] ? 0 : 1)
      );
    }
  }
  return matrix[b.length][a.length];
};

exports.findSimilarDocuments = (inputContent, documents) => {
  const matches = [];
  for (const doc of documents) {
    const distance = levenshtein(inputContent, doc.content);
    if (distance < 10) {
      matches.push({
        id: doc.id,
        filename: doc.filename,
        similarity: distance,
      });
    }
  }
  return matches;
};
