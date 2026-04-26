#!/usr/bin/env node

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

const optionalVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
];

console.log('\n🔍 Vérification des variables d\'environnement Supabase\n');

let hasError = false;

// Vérifier les variables requises
console.log('📌 Variables REQUISES :');
requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName} : ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName} : NON DÉFINIE`);
    hasError = true;
  }
});

// Vérifier les variables optionnelles
console.log('\n⚠️  Variables OPTIONNELLES :');
optionalVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName} : ${value.substring(0, 20)}...`);
  } else {
    console.log(`⏭️  ${varName} : non définie (optionnel)`);
  }
});

console.log('\n' + '='.repeat(50));

if (hasError) {
  console.log('❌ ERREUR : Certaines variables requises manquent!');
  console.log('\n📖 Consultez SUPABASE_SETUP.md pour plus d\'infos\n');
  process.exit(1);
} else {
  console.log('✅ Toutes les variables requises sont définies!');
  console.log('🚀 Vous pouvez démarrer votre app avec: npm run dev\n');
  process.exit(0);
}
