

export const uploadWithSignature = async (file: File): Promise<string> => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    let signRes = await fetch(`${apiBase}/api/uploads/sign`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: file.name }),
    });

    if (signRes.status === 401) {
        const refreshRes = await fetch(`${apiBase}/api/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
        });
        if (refreshRes.ok) {
            signRes = await fetch(`${apiBase}/api/uploads/sign`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ filename: file.name }),
            });
        }
    }

    if (!signRes.ok) {
        throw new Error("Failed to get upload signature");
    }
    const { signature, timestamp, public_id, folder } = await signRes.json();

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    form.append("signature", signature);
    form.append("timestamp", timestamp);
    form.append("public_id", public_id);
    form.append("folder", folder);

    const uploadRes = await fetch(url, {
        method: "POST",
        body: form,
    });

if (!uploadRes.ok) {
        throw new Error("Upload to Cloudinary failed");
    }
    const uploadData = await uploadRes.json();
    return uploadData.secure_url;

}