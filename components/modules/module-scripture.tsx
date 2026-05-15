export function ModuleScripture({
  scripture,
}: {
  scripture: { text: string; reference: string; translation?: string };
}) {
  return (
    <blockquote className="scripture my-6">
      <p className="text-lg leading-relaxed">&ldquo;{scripture.text}&rdquo;</p>
      <cite className="not-italic mt-2 block font-mono text-xs uppercase tracking-[0.28em] text-accent">
        {scripture.reference}
        {scripture.translation && ` · ${scripture.translation}`}
      </cite>
    </blockquote>
  );
}
