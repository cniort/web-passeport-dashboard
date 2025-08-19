// Page de test pour vérifier les couleurs des pastilles DeltaBadge
import { FileText } from "lucide-react";
import KpiCard from "../components/KpiCard";

export default function TestColorsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test des couleurs des pastilles - Version améliorée</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pastille positive (vert) */}
          <KpiCard
            title="Évolution positive"
            icon={FileText}
            value={1250}
            delta={15.5}
            subtitle="Augmentation de 15.5%"
          />

          {/* Pastille négative (rouge) */}
          <KpiCard
            title="Évolution négative"
            icon={FileText}
            value={850}
            delta={-8.3}
            subtitle="Diminution de 8.3%"
          />

          {/* Pastille nulle (gris) */}
          <KpiCard
            title="Évolution nulle"
            icon={FileText}
            value={1000}
            delta={0}
            subtitle="Aucune évolution"
          />

          {/* Pas de pastille (null) */}
          <KpiCard
            title="Pas d'évolution à noter (null)"
            icon={FileText}
            value={500}
            delta={null}
            subtitle="Pas de données d'évolution"
          />

          {/* Pas de pastille (undefined) */}
          <KpiCard
            title="Pas d'évolution à noter (undefined)"
            icon={FileText}
            value={750}
            delta={undefined}
            subtitle="Pas de données d'évolution"
          />

          {/* Grande variation positive */}
          <KpiCard
            title="Grande hausse"
            icon={FileText}
            value={2000}
            delta={125.7}
            subtitle="Très forte augmentation"
          />

          {/* Grande variation négative */}
          <KpiCard
            title="Grande baisse"
            icon={FileText}
            value={300}
            delta={-45.2}
            subtitle="Forte diminution"
          />

          {/* Petite variation positive */}
          <KpiCard
            title="Petite hausse"
            icon={FileText}
            value={1100}
            delta={2.1}
            subtitle="Légère augmentation"
          />

          {/* Petite variation négative */}
          <KpiCard
            title="Petite baisse"
            icon={FileText}
            value={980}
            delta={-1.5}
            subtitle="Légère diminution"
          />
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Spécifications implémentées :</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span><strong>Vert :</strong> Évolutions positives (delta &gt; 0) - text-green-800 bg-green-200</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 rounded"></div>
              <span><strong>Rouge :</strong> Évolutions négatives (delta &lt; 0) - text-red-800 bg-red-200</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span><strong>Gris clair :</strong> Évolution nulle (delta = 0) - text-gray-600 bg-gray-200</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 bg-white rounded"></div>
              <span><strong>Pas de pastille :</strong> Pas d'évolution à noter (delta = null ou undefined)</span>
            </li>
          </ul>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note :</strong> Cette page utilise exactement les mêmes composants (KpiCard et DeltaBadge) 
              que le dashboard principal. Les améliorations visibles ici sont déjà implémentées dans le code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}