export default function ToolPage() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isMobile) {
    return (
      <main
        id="mainContent"
        className="flex-auto"
      >
        No use of Mobile
      </main>
    );
  }

  return <div>Dergi-m Tool</div>;
}
