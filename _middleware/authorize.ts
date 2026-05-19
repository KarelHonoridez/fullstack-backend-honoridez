import { expressjwt as jwt } from 'express-jwt';
import config from '../config.json';
import db from '../_helpers/db';

const secret = process.env.JWT_SECRET || config.secret;

export default function authorize(roles: any = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    const jwtMiddleware = jwt({ secret, algorithms: ['HS256'] });

    return (req: any, res: any, next: any) => {
        jwtMiddleware(req, res, async (err: any) => {
            if (err) return next(err);

            const auth = req.user || req.auth;
            if (!auth) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const account = await db.Account.findByPk(auth.id || auth.sub);

            if (!account || (roles.length && !roles.includes(account.role))) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            req.user = auth;
            req.user.role = account.role;
            const refreshTokens = await account.getRefreshTokens();
            req.user.ownsToken = (token: any) => !!refreshTokens.find((x: any) => x.token === token);
            next();
        });
    };
}