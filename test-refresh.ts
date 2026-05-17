import db from './_helpers/db';

async function test() {
    const accounts = await db.Account.findAll();
    console.log('=== Accounts ===');
    for (const acc of accounts) {
        console.log(`ID: ${acc.id}, Email: ${acc.email}, Role: ${acc.role}, Verified: ${acc.isVerified}`);
    }
    
    const refreshTokens = await db.RefreshToken.findAll();
    console.log('\n=== Refresh Tokens ===');
    for (const rt of refreshTokens) {
        console.log(`Token: ${rt.token.substring(0, 20)}..., Active: ${rt.isActive}, Revoked: ${rt.revoked}`);
    }
}

test().catch(console.error);
