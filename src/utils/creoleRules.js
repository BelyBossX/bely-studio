export const applyCreoleRules = (text) => {

  let corrected = text;

  // q -> k
  corrected = corrected.replace(/q/g, "k");
  corrected = corrected.replace(/Q/g, "K");

  // qu -> k
  corrected = corrected.replace(/qu/g, "k");
  corrected = corrected.replace(/Qu/g, "K");

  // ph -> f
  corrected = corrected.replace(/ph/g, "f");
  corrected = corrected.replace(/Ph/g, "F");

  // tion -> syon
  corrected = corrected.replace(/tion\b/g, "syon");

  // x -> ks
  corrected = corrected.replace(/x\b/g, "ks");

  corrected =
  corrected.replace(/\bmap\b/gi,"m ap");

corrected =
corrected.replace(/\bwap\b/gi,"w ap");

corrected =
corrected.replace(/\blap\b/gi,"l ap");

corrected =
corrected.replace(/\bnap\b/gi,"n ap");

corrected =
corrected.replace(/\byap\b/gi,"y ap");

corrected =
corrected.replace(/m'/gi,"m ");

corrected =
corrected.replace(/w'/gi,"w ");

corrected =
corrected.replace(/l'/gi,"l ");

corrected =
corrected.replace(/n'/gi,"n ");

corrected =
corrected.replace(/y'/gi,"y ");

corrected =
corrected.replace(/c\s+h/gi,"ch");

corrected =
corrected.replace(/ca/gi,"ka");

corrected =
corrected.replace(/ce/gi,"se");

corrected =
corrected.replace(/ci/gi,"si");

corrected =
corrected.replace(/co/gi,"ko");

corrected =
corrected.replace(/cu/gi,"ku");

corrected =
corrected.replace(
 /avek li/gi,
 "avè l"
);

corrected =
corrected.replace(
 /pou li/gi,
 "pou l"
);

corrected =
corrected.replace(
 /fè li/gi,
 "fè l"
);

corrected =
corrected.replace(
 /si li/gi,
 "si l"
);

corrected =
corrected.replace(
 /si ou/gi,
 "si w"
);
corrected =
corrected.replace(
 /epi ou/gi,
 "epi w"
);
corrected =
corrected.replace(
 /epi li/gi,
 "epi l"
);

corrected =
corrected.replace(
 /ede ou/gi,
 "ede w"
);

corrected =
corrected.replace(
 /fè ou/gi,
 "fè w"
);
corrected =
corrected.replace(
 /kòman ou/gi,
 "kòman w"
);

  corrected = corrected.replace(/\bquestion\b/gi, "kesyon");

  corrected = corrected.replace(/\bquestions\b/gi, "kesyon");

  corrected = corrected.replace(/\bqualite\b/gi, "kalite");

  corrected = corrected.replace(/\bqualité\b/gi, "kalite");

  corrected = corrected.replace(/\bsh/gi, "ch");

  corrected = corrected.replace(/c\s+h/gi, "ch");

  return corrected;
};