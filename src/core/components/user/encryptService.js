
import crypto from "crypto"

export class EncryptService {
    static encrypt(password) {
        const hash = crypto
            .pbkdf2Sync(password, process.env.HASHED_SALT, 100000, 64, 'sha256')
            .toString('hex');
        return hash;
    }
}