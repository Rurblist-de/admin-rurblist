export function PropertyDescription({ description }: { description?: string }) {
  return (
    <section className="border-b border-[#E5E7EB] pb-5">
      <h2 className="text-base font-semibold text-[#111827]">Description</h2>
      <p className="mt-2 text-sm leading-6 text-[#6B7280]">
        {description ?? "No description provided."}
      </p>
    </section>
  );
}
