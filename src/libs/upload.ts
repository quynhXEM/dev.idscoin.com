

export const UploadImage = async (files: File[]) => {
    console.log("UploadImage - Input files:", files);
    console.log("Files count:", files.length);
    
    const formData = new FormData()
    files.forEach((file, index) => {
        console.log(`Appending file ${index}:`, file.name, file.size, file.type);
        formData.append("files", file)
    })
    
    // Debug: Check what's in FormData
    console.log("FormData entries before sending:");
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    
    const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData
    }).then(data => data.json())
    
    return response;
}