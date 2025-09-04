import CryptoJS from "crypto-js";

// Mã hóa object thành string sử dụng key
export function encryptObject(obj: any): string {
    const json = JSON.stringify(obj);
    const ciphertext = CryptoJS.AES.encrypt(json, process.env.NEXT_PUBLIC_SECRET_KEY || "").toString();
    return ciphertext;
}

// Giải mã string thành object sử dụng key
export function decryptObject(str: string): any {
    try {
        const bytes = CryptoJS.AES.decrypt(str, process.env.NEXT_PUBLIC_SECRET_KEY || "");
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) throw new Error("Wrong key or corrupted data");
        return decrypted;
    } catch (e) {
        console.log(e);
        return null; // Không giải mã được nếu sai key hoặc lỗi
    }
}