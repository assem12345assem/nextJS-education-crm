export interface INews {
    _id: string,
    title: string,
    text: string,
    coverPhoto: string,
    datePublished: string,
    active: boolean,
    comments: IComment[],
    likes: ILike[]
}
export interface ILike{
    _id: string,
    user: string,
    news: string,
    date: string
}

export interface IComment{
    _id: string,
    user: string,
    news: string,
    text: string,
    date: string
}
export interface IBookmark{
    _id: string,
    user: string,
    news: string,
    date: string
}