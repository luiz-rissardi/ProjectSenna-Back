
import crypto from "crypto"

export class EncryptService {
    static encrypt(password) {
        const hash = crypto
            .pbkdf2Sync(password, "73ks731h-abb7-4f14-bd17-bffd11b91c08", 1000, 64, 'sha256')
            .toString('hex');
        return hash;
    }
}