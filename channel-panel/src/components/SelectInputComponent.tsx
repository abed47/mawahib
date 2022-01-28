import React, { useRef } from 'react';
import { FaChevronCircleDown } from 'react-icons/fa';
import { UtilsRequests } from '../utils/services/request';

interface SelectInputComponentInterface {
    hasIndent?: 'image' | 'icon' | 'text',
    textIndex?: string,
    children: any[],
    value?: any,
    onChange?: (item: any) => void,
    error?: boolean,
    placeholder?: string,
    tabIndex?: number
}

const imgPlaceholder = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8HBhITEBASFhUTFxoWFxcXFxAaEhcbGhgYGRcXFxkYHiggGB0lHhgYITIhJSsrLi8uGCA/ODMsNygtLisBCgoKDg0OGxAQGi0lICY3Ly0vLjcvNi0rLSs3LTUtNS0tLS0tLS0rLS01LSstLS0tLS0tLisyLS8uLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEBAAIDAQAAAAAAAAAAAAAABgQFAgMHAf/EAEIQAAIBAwEEBwQHBgMJAAAAAAABAgMEEQUGEiExEzJBUWFxgRQVIqEHI1JTgpGxFkJyksHxQ7LRJDM2RVVic4PC/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAIDAQT/xAAnEQEBAAIBAwMEAgMAAAAAAAAAAQIRAxIhMQRBURMyYfAigXHR4f/aAAwDAQACEQMRAD8A9xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADB1LVqGlypKtUUOlnuQynhyazxa5LxfDiZxFba2kNW2ks6FRZh0decl5xjGL80+KLwxmV1XMrqLUEPpuo6vZ2caPs1Kbp5gq1SrjpIp4jJxinLq45vJ3e265P/p0fS6bO/SrnXFkCN9s1yPbp0vS6X9RW1jWY0JJWtrKTTSlGrJJPse7Nccd2R9K/g64paeq0KmrStozTqwgpyjh8ItpcXjGeK4c+K7zNPPtA073Ptjbpzc6lehW6Wbzmc96E5S8uxeCPQTmeMxvYxuwAEKAAAAAAAAAAAAAAAAAAAAAAAAAAAI/Vnn6QKXhZyf51UiwPHb6rWp6/TnQ96RlOE1F16cJ1WlJSahCbWaa5vPFG3DjuozvZeanfw0yxnVqZ3YYzhZby0kl6tHDR9Tp6vYqrTUkm2sSSUk1zTxwO1W3TWKp192pmKU/hxGT7Xu8cceJwqUvd2mSVvTgtyLcYdWGefHHqX28IZZqtO2gt9S1GpRp7+9TzxaxFqLUW4vPe1zwctnNQq6ppcatWEIb/ABioybzHsbzyec8PAyrbT6NrcTnTpRjKo8yaXF8c/rxHjy6wa3/HFh/Bcf5YlmePXGpe1bTLpryrGNONSO9b0akZxzLdcI5Tk844y5cD1TRJQlpNJ05VZR3FiVXe6VrHOe8k8+ZHNjrTuFZoAMWgAAAAAAAAAAAAAAAAAAAAAAAAAABF7eXdKw1fT6s5xThUnFrPFQqQ3ZSx3JqPHxLQifpHtIXFW0UFFXNWp0cZ9qp4k6m9HlOCyspp9Z97zpxfcnPw3MZKUU000+Ka5Nd6NPquj17u6c6N3Okpw6Ocd1Ti1x4xTa3JcXxRo9Ap3lpcyoUZwjVhxdrWcuinH7y2qc1F/ZfJ5znsyqO3FGneulc03SlHKk4zjVpppcs0+L7uCfHmb9Nl7M9/LItNmatmo06d9WVCMlLo0oKfB5a6VcVFvmsdpRykoxbbSS4tvgku99xK6HrV/tJTm7aFpTVN4k6k6spJNZTUUllPjxfczAu6ctUunSjWlfTi/ix9Vp1J81v7nGs12LP58hZbe43myOoUtS2zvJwkpJUqcKcl1XFN77Xet94z4FyQ2wdo7TaC8hWkp1YQpKMsbsejkm3GEFwjFSWMIuTDl+5ph4AAZqAAAAAAAAAAAAAAAAAAAAAAAhdHsLnXLm8c9Qu6fRXVWko05QUd1Ycf3e6WPQrHHblul0CY/ZCT56nqT/8Ael+kR+xdN877UX53M/8AQ7rH5N34UlarGjSlKTSjFNtvkklltkToUZaxezv6qeanw0Iv/Dop4T8JS4t+fczYy2GtakGp1buafBqVeq0/NZPi2B0/dw4VWlww61fHykXjcMfdNlrhrWi0tXpxVTfjKDzGcHu1I54SSfc1waJrbrT7fT9AoxpUoxlGoo093mspueXzed1Zz24NnZaZR0LbWpQoRcYTtY1cOU5cVVcXxk2zSbfXXTaxRpLlSg5vznhJPxSjn8Rdz6Zv28tPTcN5ebHCebZP+svRNl7a+02jVjUrRjVprpoKcsVXnLU33KWVhdy5dtbbW1O0oKFOEYxjyjFJJEz9Hd1vabVot8aNTKX/AGz+JfNTNttJfVdM05VqeGqc4OosZbpt4njufFPPgdt6r2Z543DK45eZ2rH1yfufVKF9HlB9DX8aU31n/DLD9S4Tyidu7eF/ZThLjCpFxeO6S5r9RsJeyuNF6Kq/rbWToT8dzqS8nHHHtwzPkm5sxvfSjABisAAAAAAAAAAAAAAAAAAAAAY+oXlPT7KdWo8QpxcpPwXcu1kpsJqCuNUvU6dSm6s1cxjNJS3JxUc8G1zXzNztnYVNT2XuKVNZnKHwrtbi1LC88Y9SN0q7WqbcWtW3hJOEHG4g6c4Sp/DJfWSfW47qS74m2GMuFRle8emAHFSzLBityB8zwGeAEjri6Lbq2l95b1YfyyjL+p5/r0Zw2kuek6znvLxhhbmPJYR6Dtb8O0+my8a8P5qax+hp9u9Ine29OrQg5Vab3cJZcoS7PR4fgnI2yx6+Pp+f9tvRepnp/UTks7Tz/izTVbAQlLXqso9SNHdl3bzmnH1wpF3dW8bq2nTmsxnFxfk1hmq0azo7M6MlVqQi38VScmkpTfPGeeOS8joe0FS/mo2NvKonzrTzCgl3rPGfksF446kk9mXqOb63Llya1u7duyFeU9H6Ko/rLaUqEvwPEX5bu6dlpP3XtvF8oX1Pdfd0tJZi35wbXmdui6fKwpTdSpv1Kkt+csYjlpLEV2Lh/bgjF199Lq2n04f7z2mNTC57kFJ1H5YO3vaw8LgHzPE+nlbAAAAAAAAAAAAAAAAAAAAAATFJ9F9JNRfeWUZfy1nH+pTkxrtje09paVzaUqdTFGVGSnPdSzNST5ZZeHwnJSVeqdeOeCf39dqcoadDzlcyfySCttbnzubKP8NKs/8ANIdH5hv8KGawkOaRPPTNYn/zGjHytov9ZGlpVdWq63cW/vJL2dU25K2oYl0kXLk+WPN58Ds49+LP3+i5a9mPtJZU623H+0Qmo1YQhRmuk3nJY6ko8IYbllPPfwOy8tPdr3ZatUpr7NV0ZTa4Zw3h+q7zt1DZ671bcV1qHSwhJSwrejCXDnuzi8xyuGTYWOzllYvMLeGX+9PM5fnPLXobyySTf7/bP3TlvW0qhW3s1rup9qUatabfNYylH/Q28dXurhLodPqJdjrShTx+HiygilCOEsLuXIHLlDSXjPUbvWoW9StRo9JTlUzSg5tbrinHNTt4viim0bZ6jpNaVTeqVK0vhlVqPenj7MeyK4ckae4rxt9ubHeeN+FaC82otL1fD1LYz5cr2i8ZHQ+vxO2E95vwOQMVgBqNodoaGgUIyq78pTzuwgs1JYWZNLK4JcW20jslt1C3Tbg6bK5he2kKkHmNSKnF96ksr9TuOAAAAAAAAAAAAAAAAAAAAAAEVp31m2Gpy7N6hBfhpcfmywua8bW3lObxGCcpPuSWW/yI3ZGEqmnTrzWJXVWddruUn8C8t1J+prx+LUZt2AaHTtrLS8nV3qtKmoTcYb1SCc4pL48PGE3nHkaSWpb4Gu0zWKWp3daFJp9C4reTi4S3o5Ti13Ya9DYizQk9qbOOpbR2tJ1HCXR1ZQknhxmnFwa72nHOPAptmdoHeVHb3SULqmvij+7VX3tLvT7uw0N9pMNf2vdKblFU7TejOLxKFR1vgkvFJGLq6dBRp6pCUHB/U3tHKjnsbceNKT7U+D9Eztkykxcm53elAh7G+1WNFdBc2V1DslNTjPwy6TcTIlqWtTWFRsY+LlXa/JIx+lWnXFVd3VOytpVKs1GEFmUnySPNdRvZ30K124PpLtezWVN9ZQlw38djllyz5ccM56lVhUuo+33Tu6ufq7ShH6ve7Mwjne859meZSbOaFVlfe13qXTY3aVJPMLeL7E+Tm+2RpJOObqbers3uj2Xu3SqNFPPRU4wz37sUs/IzADztAAAAAAAAAAAAAAAAAAAAABJ7cV3ezo2MG07h71VrnGjB5l5bzxFepnwioQSSwksJLkkuSNLo8veOvXty/vPZ6fhCl1seEpPPobe5rwtbeU5vEYJyk+5LmejWpIy3u7anaWvUqwp2tB/XXT3E/sQ/xKj8ln8+HIo6Gz9nRtIU/Z6UowiorfhCTwlji2uLNPsZYzuas76vHE66xSi+dOiuMV5y6z9PEqyOTL2isZ7oila09N24r06UIwjUtqdRRilGPwzlB4S4dpuzWbQLoNt7OX3tGtT/AJHGePmbPOC/MlT7tdsmvaNpNQq9kZUqEfwQbmvzkVc4KcWmk0+DT5Mmfo4jvbNKq+dxVq1pecptfpFFQZcn3VePhO3exGm3NXe9nUJd9OU6fyg0vkdL2CsJ9dVprulWrtfKRUAfUy+XemfDB0vR7bSYYt6FOnnm4pbz85c36mcARbt0AAAAAAAAAAAAAAAAAAAAADpvK6trSc3yhFyfom/6HcaTbav7Nsldy76Uo/zLd/8Ao7jN3Tl8NJsZSdLZmhnnOLqN97nJyz8zjrFL3xrdtZ/uPNeuu+nBrdi/CU+HobPSqHs2l0YfYpwj+UUjH2Ph7brN7c9m+ren/DSXxteDk/kejK63kzk9lYlhH0A8zVJ7cLoLzT632Ljo2+5VYOLb8OCNhjJ3bV6W9Y0CtSj12t6D7pxe9Dj2cUl6mr0PUVqulU6vJyWJrtjNcJxx2YaZvhd4s8vLl9HU9zZtUX17apUoz81NtfKSKgjdMqe7NuJR5QvaW8v/AC0uePODyWRHJP5b+VY+AAGagAAAAAAAAAAAAAAAAAAAAAAAAlvpGl0mgRo9txXpUl6zUn8olSRF5crWdqZTbSoWGY5bSjKtJfG2+WIR4ceT8zTjn8t/Ccr2Zuu360vSKtX7EXu+MnwgvzaNnsppj0jZ6hSfWUcz79+XxT+bZN2ae1usQcE/ZLae+5vKVerHqxj3wi+Lfb+Rdlcl1OlzGe4ADFYRlSj7k2tlBcKV6nVh3RrRX1q/FHEvNFmTP0hw3NnunivjtqlOtH0mlJeW7KRpx3vr5TlOzWbXN21nSuY5za1oVeHNxzu1I+qfyLiMlOKa5PiiO2rqxhsxctvg6UkvOSxH5tFLolOVLRqEZ9aNKmpeagk/mVyeI5j5ZoAMVgAAAAAAAAAAAAAAAAAAAAAAABH2mwNGFSXT1qtanvynGk3u0syeczUXmo/F/kWAKmVnhyyVwo0o0KSjCKjGKwkklFLuSXBHMAl0AAAmPpFqP9mJUo9a4nTox85TX9EynNZtDotPXtP6KpKccSU4yg0pxlHk02mu1r1KwsmUtcvhLql+0+tRoQ42trJSrS/dqVI9Siu9LnL+2bsxNK06lpNhClRiowgsJdvi2+1vnkyzueXVXMZoABCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//Z"

const SelectInputComponent: React.FC<SelectInputComponentInterface> = props => {

    const listRef = useRef<HTMLDivElement>(null);

    const handleItemClick = (item: any) => {
        listRef?.current?.blur();
        if(props?.onChange) props?.onChange(item);
    }

    return (
        <div ref={listRef} tabIndex={props?.tabIndex || 4} className={`mawahib-select-input ${props.error ? 'error-active' : ''} ${props.hasIndent === 'image' ? 'image' : props.hasIndent === 'icon' ? 'icon' : props.hasIndent === 'text' ? 'text' : ''}`}>
            
            {
                props?.hasIndent === 'image' ? 
                props?.value?.image ? <img src={UtilsRequests.loadPhoto(props?.value.iamge)} alt="item img" /> :
                props.value?.photo ? <img src={UtilsRequests.loadPhoto(props?.value.photo)} alt="item img" /> :
                props.value?.thumbnail ? <img src={UtilsRequests.loadPhoto(props?.value.thumbnail)} alt="item img" /> :
                <div className="image"></div>
                : <div className="image"></div>
            }

            <p>{<p>{props.value?.name || props.value?.title || props.value?.label || ''}</p> || props?.placeholder || ''}</p>

            <FaChevronCircleDown />

            <ul>
                {
                    props.children.map((item, index) => {
                        return (
                            <li key={`select-input-${index}`} onClick={() => handleItemClick(item)}>
                                {
                                    props?.hasIndent === 'image' ? 
                                    item?.image ? <img src={UtilsRequests.loadPhoto(item.iamge)} alt="item img" /> :
                                    item?.photo ? <img src={UtilsRequests.loadPhoto(item.photo)} alt="item img" /> :
                                    item?.thumbnail ? <img src={UtilsRequests.loadPhoto(item.thumbnail)} alt="item img" /> :
                                    <div className="image"></div>
                                    : <div className="image"></div>
                                }
                                <p>{item?.name || item?.title || item?.label || ''}</p>
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}

export default SelectInputComponent;