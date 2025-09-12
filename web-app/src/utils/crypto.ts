// Crypto utilities for local authentication
// WARNING: This is a DEMO implementation only. In production, use proper backend authentication.

interface HashedPassword {
  hash: string;
  salt: string;
  iterations: number;
  algorithm: string;
}

/**
 * Generates a secure password hash using PBKDF2
 * @param password The password to hash
 * @returns Promise<string> The hashed password with salt and parameters as JSON string
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // Generate a cryptographically secure random salt
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iterations = 100000; // High iteration count for security
    
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    
    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordData,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    // Derive key using PBKDF2
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      256 // 32 bytes
    );
    
    const hashArray = Array.from(new Uint8Array(derivedBits));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    
    const saltHex = Array.from(salt).map(byte => byte.toString(16).padStart(2, '0')).join('');
    
    const result: HashedPassword = {
      hash: hashHex,
      salt: saltHex,
      iterations: iterations,
      algorithm: 'PBKDF2-SHA256'
    };
    
    return JSON.stringify(result);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Verifies a password against a stored hash
 * @param password The plain text password
 * @param storedHash The stored hash string (JSON format with salt and parameters)
 * @returns Promise<boolean> True if password matches hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    // Parse the stored hash to extract salt and parameters
    const hashData: HashedPassword = JSON.parse(storedHash);
    
    if (!hashData.hash || !hashData.salt || !hashData.iterations || !hashData.algorithm) {
      console.error('Invalid stored hash format');
      return false;
    }
    
    // Convert salt from hex back to Uint8Array
    const saltArray = new Uint8Array(
      hashData.salt.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );
    
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    
    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordData,
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    // Derive key using the same parameters
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltArray,
        iterations: hashData.iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      256 // 32 bytes
    );
    
    const hashArray = Array.from(new Uint8Array(derivedBits));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    
    return hashHex === hashData.hash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * Generates a secure random salt (for future use if needed)
 * @returns string A random salt string
 */
export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
