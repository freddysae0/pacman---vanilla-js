export function fillRow(x, y, oneArr, val = 1) {
  for (let i = x; i <= y; i++) {
    oneArr[i] |= val;
  }
  return oneArr;
}
export function fillCol(x, y, twoArr, col, val = 1) {
  for (let i = x; i <= y; i++) {
    twoArr[i][col] |= val;
  }
  return twoArr;
}

// twoArr is a two-dimensional array
export function fillTheLevel(twoArr) {
  // Points
  fillRow(2, 13, twoArr[2], 3);
  fillRow(2, 14, twoArr[6], 3);
  fillRow(2, 7, twoArr[9], 3);
  fillRow(10, 13, twoArr[9], 3);
  fillRow(2, 13, twoArr[21], 3);
  fillRow(2, 4, twoArr[24], 3);
  fillRow(7, 13, twoArr[24], 3);
  fillRow(2, 6, twoArr[27], 3);
  fillRow(10, 13, twoArr[27], 3);
  fillRow(2, 14, twoArr[30], 3);

  fillCol(2, 9, twoArr, 2, 3);
  fillCol(21, 24, twoArr, 2, 3);
  fillCol(27, 30, twoArr, 2, 3);
  fillCol(24, 27, twoArr, 4, 3);
  fillCol(2, 27, twoArr, 7, 3);
  fillCol(6, 9, twoArr, 10, 3);
  fillCol(24, 27, twoArr, 10, 3);
  fillCol(2, 6, twoArr, 13, 3);
  fillCol(22, 24, twoArr, 13, 3);
  fillCol(27, 29, twoArr, 13, 3);

  // Empty corridors
  fillRow(10, 14, twoArr[12], 1);
  fillRow(2, 10, twoArr[15], 1);
  fillRow(10, 14, twoArr[18], 1);
  fillRow(13, 14, twoArr[24], 1);

  fillCol(12, 21, twoArr, 10, 1);
  fillCol(9, 12, twoArr, 13, 1);

  // Special power
  fillRow(2, 2, twoArr[4], 7);
  fillRow(2, 2, twoArr[24], 7);

  for (let j = 1; j < 31; j++) {
    for (let i = 1; i <= 15; i++) {
      twoArr[j][29 - i] = twoArr[j][i];
    }
  }

  return twoArr;
}
