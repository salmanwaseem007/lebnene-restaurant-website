import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface MenuPhoto {
    id: string;
    blob: ExternalBlob;
    displayOrder: bigint;
    name: string;
}
export interface ContactInfo {
    email: string;
    whatsappNumber: string;
    restaurantName: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMenuPhotoEN(id: string, blob: ExternalBlob, name: string): Promise<void>;
    addMenuPhotoES(id: string, blob: ExternalBlob, name: string): Promise<void>;
    addMenuPhotosEN(photos: Array<{
        id: string;
        blob: ExternalBlob;
        name: string;
    }>): Promise<void>;
    addMenuPhotosES(photos: Array<{
        id: string;
        blob: ExternalBlob;
        name: string;
    }>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMenuPhotoEN(id: string): Promise<void>;
    deleteMenuPhotoES(id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo | null>;
    getMenuPhotosEN(): Promise<Array<MenuPhoto>>;
    getMenuPhotosES(): Promise<Array<MenuPhoto>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    reorderMenuPhotosEN(newOrder: Array<string>): Promise<void>;
    reorderMenuPhotosES(newOrder: Array<string>): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateContactInfo(newInfo: ContactInfo): Promise<void>;
}
