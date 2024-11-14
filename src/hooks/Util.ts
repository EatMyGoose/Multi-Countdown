export interface IHasId
{
    id: string
}

export function UpdateArrayElement<TElem extends IHasId>(
    old: TElem[], 
    id: string,
    mapper: (old: TElem) => TElem) : TElem[]
{
    return old.map(elem => {
        if(elem.id === id)
        {
            return mapper(elem);
        }
        else
        {
            return elem    
        }
    })
}

export function LinearRandomDistribution(center: number, radius: number): number
{
    return -(Math.random() * radius * 2) + radius + center;
}