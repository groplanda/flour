export function choseWordForm( count, form1, form2, form5 ) {
  count = Math.abs(count) % 100;
  let count1 = count % 10;
  if (count > 10 && count < 20) return form5;
  if (count1 > 1 && count1 < 5) return form2;
  if (count1 == 1) return form1;
  return form5;
}