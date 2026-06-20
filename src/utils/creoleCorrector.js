import creoleDictionary
from "../data/creoleDictionary";

import {
  applyCreoleRules
}
from "./creoleRules";

export const correctCreole = (text) => {

  let corrected = text;

  // Diksyonè
  Object.keys(creoleDictionary)
  .forEach((wrongWord) => {

    const regex =
      new RegExp(
        `\\b${wrongWord}\\b`,
        "gi"
      );

    corrected =
      corrected.replace(
        regex,
        creoleDictionary[wrongWord]
      );

  });

  // Règ Kreyòl
  corrected =
    applyCreoleRules(corrected);

  return corrected;

};

function normalizeCreole(text) {

  return text

    .replace(/\bca\b/gi, "ka")
    .replace(/\bce\b/gi, "se")
    .replace(/\bci\b/gi, "si")
    .replace(/\bco\b/gi, "ko")
    .replace(/\bcu\b/gi, "ku")

    .replace(/\bqua/gi, "ka")
    .replace(/\bque/gi, "ke")
    .replace(/\bqui/gi, "ki")
    .replace(/\bquo/gi, "ko")
    .replace(/c\s+h/gi,"ch")
    .replace(/\bx/gi, "ks")
    .replace(/cc/g,"k")
    .replace(/ss/g,"s")
    .replace(/mm/g,"m");

}

