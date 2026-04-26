'use client';

export function EnvStatus() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isConfigured = !!(supabaseUrl && supabaseKey);

  return (
    <div className="p-4 rounded-lg border">
      <h3 className="font-semibold mb-3">Configuration Supabase</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className={isConfigured ? "text-green-600" : "text-red-600"}>
            {isConfigured ? "✅" : "❌"}
          </span>
          <span>
            NEXT_PUBLIC_SUPABASE_URL: {supabaseUrl ? "Configurée" : "Manquante"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={supabaseKey ? "text-green-600" : "text-red-600"}>
            {supabaseKey ? "✅" : "❌"}
          </span>
          <span>
            NEXT_PUBLIC_SUPABASE_ANON_KEY: {supabaseKey ? "Configurée" : "Manquante"}
          </span>
        </div>
      </div>

      {isConfigured ? (
        <div className="mt-3 p-2 bg-green-50 text-green-700 rounded text-sm">
          ✨ Supabase est correctement configuré!
        </div>
      ) : (
        <div className="mt-3 p-2 bg-red-50 text-red-700 rounded text-sm">
          ⚠️ Consultez ENV_SETUP_GUIDE.md pour configurer les variables
        </div>
      )}
    </div>
  );
}
