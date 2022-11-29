import {Book} from "@/models/book";
import findAlias from "@/utils/findAlias";

export interface FormItem {
    key: string;
    label: string;
    // value: string;
    disabled: boolean;
}

const display = ["isbn", "title", "original_title", "author", "translator", "publisher", "publish_at", "page", "binding", "producer", "series", "rating", "rating_people", "cover"]
const allow = ["title", "original_title", "author", "translator", "publisher", "publish_at", "page", "binding", "producer", "series", "rating", "rating_people", "cover"]

export const genForm = (single: Book) => {
    return display.map((key) => {
        return {
            key: key,
            label: findAlias(key),
            disabled: !allow.includes(key),
        }
    })
}
// export const genForm = (single: Book) => {
//     let items: FormItem[] = [];
//     display.forEach((key) => {
//         if (Object.hasOwn(single, key)) {
//             items.push({
//                 key: key,
//                 label: findAlias(key),
//                 //@ts-ignore
//                 // value: single[key],
//                 disabled: !allow.includes(key)
//             })
//         }
//     })
//     return items
// }
export const genNewForm = () => {
    return display.map((key) => {
        return {
            key: key,
            label: findAlias(key),
            disabled: false,
        }
    })
}
