import Image  from 'next/image';

export const Logo = () =>{
    return(
        <Image
        width={50}
        height={50}
        alt="logo" 
        src="/logo.svg"
        />
    )
}