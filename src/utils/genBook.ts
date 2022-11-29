import {Book} from "@/models/book";

const genBook = (): Book => {
    return {
        author: "",
        publisher: "",
        publish_at: "",
        page: "",
        price: "",
        binding: "",
        isbn: "",
        intro: "",
        cover: "",
        series: "",
        translator: "",
        original_title: "",
        producer: "",
        id: "",
        title: "",
        url: "",
        rating: "",
        rating_people: "",
    }
}

export default genBook;