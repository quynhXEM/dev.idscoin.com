

export const UploadImage = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file, index) => {
        formData.append("files", file)
    })
    
    for (let [key, value] of formData.entries()) {
    }
    
    const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData
    }).then(data => data.json())
    
    return response;
}