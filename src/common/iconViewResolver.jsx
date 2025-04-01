import { Adventure,Drama, Fiction, History, Humor, Philosophy, Politics } from "./icons"
export const IconViewResolver =(name)=>{
    switch (name) {
        case 'adventure':
            return <Adventure />
        case 'history':
            return <History />
        case 'fiction':
            return <Fiction />
        case 'drama':
            return <Drama />
        case 'humor':
            return <Humor />
        case 'politics':
            return <Politics />
        case 'philosophy':
            return <Philosophy />
        default:
            return null
    }
}