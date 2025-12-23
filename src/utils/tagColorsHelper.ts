export const getTagColor = (tag: string) => {
  const t = tag.toLowerCase();
  if (t.includes("technical") || t.includes("react"))
    return { bg: "#dbeafe", text: "#1e40af" };
  if (t.includes("design") || t.includes("concept"))
    return { bg: "#fce7f3", text: "#9d174d" };
  if (t.includes("front")) return { bg: "#dcfce7", text: "#09913dff" };
  return { bg: "#e2e8f0", text: "#485e7dff" };
};