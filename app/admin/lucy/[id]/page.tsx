// Detail licence admin
export default async function AdminLicenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <h1>Licence {id}</h1>
      {/* TODO: Détails licence, historique, actions */}
    </div>
  );
}
