import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

/* Умный компонент, записывает стор и работает с логикой */
const RandomChar = () => {

    const [char, setChar] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [])

    const marvelService = new MarvelService();

    /* Запись персонажа в стор */
    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false)
    }

    /* При ошибке прекращает загрузку и показывает ошибку */
    const onError = () => {
        setLoading(false);
        setError(true);
    }
    /* Отправляет запрос на рандомного персонажа с рандомным айди, записывает в стор и если ошибка кидает ошибку */
    const updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        marvelService
            .getCharacter(id)
            .then(onCharLoaded)
            .catch(onError);
    }

    const onReloadChar = () => {
        setLoading(true)
        updateChar();
    }

    /* Условные отрисовки */
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? <View char={char}/> : null

    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main"
                onClick={onReloadChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

/* "Глупый компонент отрисовки, берет данные только из пропсов.*/
const View = ({char}) => {

    const {name, description, thumbnail, homepage, wiki} = char

    const imgNotFoud = thumbnail.indexOf('image_not_available') > 0

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgNotFoud ? {objectFit:"contain"} : null}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    {/* eslint-disable-next-line */}
                    <a href={homepage} className="button button__main" target="_blank">
                        <div className="inner">homepage</div>
                    </a>
                    {/* eslint-disable-next-line */}
                    <a href={wiki} className="button button__secondary" target="_blank">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;