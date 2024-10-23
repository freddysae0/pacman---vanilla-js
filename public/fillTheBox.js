export function fillRow(x, y, oneArr) {
  for (let i = x; i <= y; i++) {
    oneArr[i] = true;
  }
  return oneArr;
}
export function fillCol(x, y, twoArr, col) {
  for (let i = x; i <= y; i++) {
    twoArr[i][col] = true;
  }
  return twoArr;
}

export function fillTheBox(twoArr) {
  fillRow(2, 13, twoArr[2]);
  fillRow(16, 27, twoArr[2]);

  fillRow(2, 27, twoArr[6]);
  fillRow(2, 7, twoArr[9]);
  fillRow(22, 27, twoArr[9]);

  fillRow(10, 13, twoArr[9]);
  fillRow(16, 19, twoArr[9]);

  fillCol(2, 9, twoArr, 2);
  fillCol(2, 27, twoArr, 7);
  fillCol(2, 6, twoArr, 13);

  fillCol(2, 6, twoArr, 16);
  fillCol(2, 9, twoArr, 27);
  fillCol(2, 27, twoArr, 22);

  fillCol(6, 9, twoArr, 10);
  fillCol(6, 9, twoArr, 19);
  return twoArr;
}
