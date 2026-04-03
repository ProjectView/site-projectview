// Player de relecture
export default async function ReplayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <h1>Relecture</h1>
      {/* TODO: Layout 3 colonnes (vidéo, transcription, CR) */}
    </div>
  );
}
