export const validateCreoleWord = (word) => {

  const forbidden = [
    "q",
    "c",
    "x"
  ];

  return !forbidden.some(
    letter =>
      word.toLowerCase().includes(letter)
  );

};