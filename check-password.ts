import db from './_helpers/db';
import bcrypt from 'bcryptjs';

async function checkPassword() {
    const account = await db.Account.scope('withHash').findOne({ where: { id: 2 } });
    if (account) {
        console.log(`Email: ${account.email}`);
        console.log(`Password hash exists: ${!!account.passwordHash}`);
        
        // Try common passwords
        const passwords = ['password', 'password123', 'admin', 'test123', '123456'];
        for (const pwd of passwords) {
            const match = await bcrypt.compare(pwd, account.passwordHash);
            if (match) {
                console.log(`\n✓ Password found: "${pwd}"`);
                break;
            }
        }
    }
}

checkPassword().catch(console.error);
