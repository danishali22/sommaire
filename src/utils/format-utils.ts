export function formatFileNameAsTitle(fileName: string) {
    // Remove the file extension and replace special characters with spaces
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
    
    const withSpaces = nameWithoutExtension
        .replace(/[-_]+/g, " ") // Replace dashes and underscores with spaces
        .replace(/([a-z])([A-Z])/g, "$1 $2"); // Add space before camel case letters

        // Convert to title case (capitalize first letter of each word)
    return withSpaces
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.
        slice(1).toLowerCase())
        .join(" ")
        .trim();
}