export const mergeText = (...items: string[]) => {
    let list: Array<string> = [];
    items.forEach(item => {
        if (item) list.push(item);
    })
    return list.join(" / ");
}

export const makeTranslator = (translator: string) => {
    if (translator) return `${translator}【译】`;
    return undefined;
}

export const makeAuthor = (author: string) => {
    if (author) return `${author}【著】`;
    return undefined;
}

export const makeProducer = (producer: string) => {
    if (producer) return `${producer}【出品】`;
    return undefined;
}

export const makePage = (page: string) => {
    if (page) return `${page}页`;
    return undefined;
}