// Detail licence admin
export default function AdminLicenseDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Licence {params.id}</h1>
      {/* TODO: Détails licence, historique, actions */}
    </div>
  );
}
