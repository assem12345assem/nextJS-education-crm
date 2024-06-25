export type News={
    title: string,
    text: string,
    coverPhoto: string,
    datePublished: string,
    active: boolean
}

export type Like={
    user: string,
    news: string,
    date: string
}

export type Comment={
    user: string,
    news: string,
    text: string,
    date: string
}
export type Bookmark={
    user: string,
    news: string,
    date: string
}
