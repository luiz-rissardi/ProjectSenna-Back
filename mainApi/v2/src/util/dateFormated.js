

export function DateFormat(date) {
    const parsedDate = new Date(date);
    return parsedDate.toISOString()
        .replace("T", " ")
        .replace(/.\w{4}$/, "")
}

