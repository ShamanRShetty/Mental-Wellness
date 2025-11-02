const { getRateLimitStatus } = require('./src/services/geminiService');

console.log('📊 Current API Usage:');
console.log('====================');

const status = getRateLimitStatus();

console.log(`\n🤖 Gemini API:`);
console.log(`Daily: ${status.daily.used}/${status.daily.limit} (${status.daily.remaining} remaining)`);
console.log(`Minute: ${status.minute.used}/${status.minute.limit}`);

console.log(`\n💰 Estimated Cost:₹0.00 (Free Tier)`);
console.log('\n⚠️  Warnings:');
if (status.daily.used > status.daily.limit * 0.8) {
console.log(`❌ WARNING: You've used ${Math.round((status.daily.used / status.daily.limit) * 100)}% of daily quota!`);
} else {
console.log(`✅ Usage looks good (${Math.round((status.daily.used / status.daily.limit) * 100)}% of daily quota)`);
}
console.log(`\n📅 Date: ${new Date().toLocaleString()}`);