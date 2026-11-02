/** Words that stay in capitals when a name is written in sentence case. */
const KEEP = new Set(["CRM", "HRMS", "ESS", "QC", "BOM", "ERP", "IGU", "IGUs", "CNC", "KPI"]);

/**
 * "TASK MANAGEMENT" -> "Task management", "MY PORTAL (ESS)" -> "My portal (ESS)", "CRM" stays "CRM".
 * The module and stage names are stored in capitals; the page shows them in ordinary sentence case.
 */
export function sentenceCase(text: string): string {
  return text
    .split(" ")
    .map((word, i) => {
      const bare = word.replace(/[()&,.]/g, "");
      if (KEEP.has(bare)) return word;
      if (word === "&") return word;
      const lower = word.toLowerCase();
      return i === 0 ? lower.charAt(0).toUpperCase() + lower.slice(1) : lower;
    })
    .join(" ");
}
