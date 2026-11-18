import type { Note } from "@/data/erpContent";

/**
 * A list of short notes: a name and two or three sentences, as open rows with a hairline above each (no cards).
 * `cols` is the widest layout (1 to 4 columns); `level` is the heading level of each name, so the page's outline stays right.
 */
export default function ModuleNotes({ notes, cols = 2, level = 3, className = "" }: { notes: Note[]; cols?: 1 | 2 | 3 | 4; level?: 3 | 4; className?: string }) {
  const Heading = level === 3 ? "h3" : "h4";
  return (
    <ul className={`notes notes-${cols} ${className}`.trim()}>
      {notes.map((n) => (
        <li key={n.name} className="note">
          <Heading className="note-name">{n.name}</Heading>
          <p className="note-text">{n.text}</p>
        </li>
      ))}
    </ul>
  );
}
