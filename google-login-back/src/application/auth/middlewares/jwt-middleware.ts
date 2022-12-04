import { AuthService } from '../auth.service';
import { Identity } from '../models/identity';

class JwtMiddleware {
    private headerPrefix = 'Bearer ';

    constructor(
        private readonly authService: AuthService,
    ) {}

    public async run(req, res, next) {

        const token = this.extractToken(req);

        req['identity'] = new Identity();
        const identity: Identity = req['identity'];


        if (token) {
            const googleUser = await this.authService.googleAuthenticate(token);

            if (googleUser) {
                identity.user = googleUser;
            }
        }
        next();
    }

    private extractToken(req): string {
        return req.headers['authorization']?.substr(this.headerPrefix.length) ?? null;
    }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function getJwtMiddleware(authService: AuthService): Function {
    const e = new JwtMiddleware(authService);
    return e.run.bind(e);
}
