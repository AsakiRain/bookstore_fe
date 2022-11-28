import {Book} from "@/models/book";

const keys = ["author", "publisher", "producer", "original_title", "translator", "publish_at", "page", "price", "binding", "series"]

const filterKeys = (book: Book) => {
    let list: Array<string> = [];
    keys.forEach(key => {
        if (Object.hasOwn(book, key)) {
            list.push(key);
        }
    })
    return list
}

export default filterKeys